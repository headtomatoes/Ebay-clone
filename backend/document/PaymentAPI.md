# Payment API Documentation

This document provides an overview of the Payment API, its endpoints, and key functionalities related to processing payments within the E-Auction site.

## Table of Contents
1.  [Overview](#overview)
2.  [API Endpoints](#api-endpoints)
    *   [Initiate Payment](#post-apipaymentsinitiate)
    *   [Handle Stripe Webhook](#post-apipaymentsstripewebhook)
    *   [Update COD Payment Status (Admin)](#put-apipaymentscodpaymentidstatus)
3.  [Service Logic (`PaymentService`)](#service-logic-paymentservice)
    *   [Payment Initiation Flow](#payment-initiation-flow)
    *   [Stripe Webhook Handling](#stripe-webhook-handling)
    *   [COD Status Update](#cod-status-update)
4.  [Data Transfer Objects (DTOs)](#data-transfer-objects-dtos)
    *   [`PaymentRequestDTO`](#paymentrequestdto)
    *   [`PaymentResponseDTO`](#paymentresponsedto)
5.  [Configuration](#configuration)
6.  [External Dependencies](#external-dependencies)

## 1. Overview

The Payment API is responsible for:
*   Allowing users to initiate payments for their orders using different gateways (Stripe, Cash On Delivery - COD).
*   Handling asynchronous payment confirmations from Stripe via webhooks.
*   Enabling administrators to update the status of COD payments.

## 2. API Endpoints

All endpoints are prefixed with `/api/payments`.

### `POST /api/payments/initiate`

Initiates a payment process for a specified order.

*   **Description:** Allows an authenticated user to start the payment process for an order they own.
*   **Authentication:** Required (User must be authenticated).
*   **Request Body:** `application/json`
    ```json
    {
      "paymentGateway": "STRIPE", // or "COD"
      "orderId": 123
    }
    ```
    *(See `PaymentRequestDTO`)*
*   **Success Response (201 Created):** `application/json`
    ```json
    {
      "paymentGateway": "STRIPE",
      "amount": 100.00,
      "status": "PENDING",
      "transactionId": "pi_xxxxxxxxxxxx", // Stripe PaymentIntent ID or COD transaction ID
      "paymentDate": "2023-10-27T10:30:00",
      "orderId": 123,
      "clientSecret": "pi_xxxxxxxxxxxx_secret_xxxxxxxxxxxx" // For Stripe, null for COD
    }
    ```
    *(See `PaymentResponseDTO`)*
*   **Error Responses:**
    *   `400 Bad Request`: Invalid request (e.g., validation errors, unsupported payment gateway).
    *   `401 Unauthorized`: User not authenticated.
    *   `403 Forbidden`: User does not own the order.
    *   `404 Not Found`: Order not found.
    *   `409 Conflict` (or `IllegalStateException` mapped to `4xx`): Order not in `PENDING_PAYMENT` status.

### `POST /api/payments/stripe/webhook`

Handles incoming webhook events from Stripe to update payment statuses.

*   **Description:** Endpoint for Stripe to send event notifications (e.g., payment success, failure). Signature verification is performed.
*   **Authentication:** None (Public endpoint, secured by Stripe signature verification).
*   **Headers:**
    *   `Stripe-Signature`: Required. Value provided by Stripe for signature verification.
*   **Request Body:** `application/json` (Raw Stripe Event object)
*   **Success Response (200 OK):**
    ```
    Webhook processed
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Signature verification failed, malformed payload, or other processing error related to the webhook data.
    *   `500 Internal Server Error`: Unexpected server error during processing.

### `PUT /api/payments/cod/{paymentId}/status`

Allows an administrator to update the status of a Cash On Delivery (COD) payment.

*   **Description:** Used by admins to reflect the outcome of a COD transaction (e.g., payment received, delivery failed).
*   **Authentication:** Required (User must have 'ADMIN' role).
*   **Path Parameters:**
    *   `paymentId` (Long): The ID of the COD payment to update.
*   **Query Parameters:**
    *   `status` (String): The new status for the payment (e.g., "SUCCESS", "FAILED"). Must match `Payment.PaymentStatus` enum values.
*   **Success Response (200 OK):** `application/json`
    *(Same structure as `PaymentResponseDTO`, `clientSecret` will be null)*
*   **Error Responses:**
    *   `400 Bad Request`: Invalid status value, payment is not COD, or invalid status transition.
    *   `401 Unauthorized`: User not authenticated.
    *   `403 Forbidden`: User is not an ADMIN.
    *   `404 Not Found`: Payment with the given ID not found.

## 3. Service Logic (`PaymentService`)

The `PaymentService` class contains the core business logic for payments.

### Payment Initiation Flow (`initiatePayment`)

1.  **Validation:**
    *   Checks if the order exists.
    *   Verifies that the authenticated user owns the order.
    *   Ensures the order status is `PENDING_PAYMENT`.
2.  **Payment Record Creation:**
    *   A `Payment` entity is created with status `PENDING`.
3.  **Gateway Specific Logic:**
    *   **COD:**
        *   A unique transaction ID (e.g., `COD_<orderId>_<timestamp>`) is generated.
        *   The associated `Order` status is immediately updated to `PROCESSING` (indicating items are reserved/prepared).
    *   **Stripe:**
        *   Calls `StripeService` to create a Stripe `PaymentIntent`.
        *   The `PaymentIntent` ID is stored as the transaction ID, and the `clientSecret` is returned to the frontend for Stripe.js.
        *   The associated `Order` status remains `PENDING_PAYMENT` until a webhook confirms success.
4.  The `Payment` entity is saved to the database.

### Stripe Webhook Handling (`handleStripeWebhook`)

1.  **Signature Verification:** Verifies the `Stripe-Signature` header to ensure the webhook originated from Stripe.
2.  **Event Deserialization:** Parses the event payload.
3.  **Event Processing (Key Events):**
    *   `payment_intent.succeeded`:
        *   Finds the local `Payment` record using the `PaymentIntent` ID (transactionId).
        *   **Idempotency Check:** Ensures the payment hasn't already been marked as `SUCCESS`.
        *   Updates the `Payment` status to `SUCCESS`.
        *   Updates the associated `Order` status from `PENDING_PAYMENT` to `PROCESSING` (or a similar post-payment status).
        *   *TODO: Trigger post-payment actions (notifications, fulfillment).*
    *   `payment_intent.payment_failed`:
        *   Finds the local `Payment` record.
        *   **Idempotency Check:** Ensures the payment hasn't already been marked as `FAILED`.
        *   Updates the `Payment` status to `FAILED`.
        *   The `Order` status typically remains `PENDING_PAYMENT` to allow retries, unless specific business logic dictates otherwise.
        *   *TODO: Notify user of payment failure.*
    *   Other events are logged as unhandled or can be implemented as needed.

### COD Status Update (`updateCodPaymentStatus`)

1.  **Authorization:** Ensures the calling user has the 'ADMIN' role (primarily handled at controller, service has a defense-in-depth check).
2.  **Validation:**
    *   Checks if the payment exists.
    *   Verifies that the payment gateway is indeed `COD`.
    *   **CRITICAL TODO:** Validates that the requested status transition is allowed based on the current status and business rules (e.g., a `PENDING` COD can go to `SUCCESS` or `FAILED`, but a `SUCCESS` cannot typically go to `FAILED` without a refund process).
3.  **Status Update:**
    *   Updates the `Payment` status.
    *   If the new status is `SUCCESS`, the associated `Order` (which should be `PROCESSING`) might be further updated if needed (e.g., to `COMPLETED`).
    *   If the new status is `FAILED`, specific logic needs to be defined for updating the `Order` status (e.g., to `CANCELED`, `ON_HOLD`).

## 4. Data Transfer Objects (DTOs)

### `PaymentRequestDTO`
Used to request a payment initiation.
```java
public record PaymentRequestDTO(
    @NotNull Payment.PaymentGateway paymentGateway, // e.g., "STRIPE", "COD"
    @NotNull Long orderId
) {}
```