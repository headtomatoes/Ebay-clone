package com.gambler99.ebay_clone.controller;

import com.gambler99.ebay_clone.dto.PaymentRequestDTO;
import com.gambler99.ebay_clone.dto.PaymentResponseDTO;
import com.gambler99.ebay_clone.entity.Payment; // Make sure Payment.PaymentStatus is accessible
import com.gambler99.ebay_clone.exception.PaymentProcessingException;
import com.gambler99.ebay_clone.security.UserDetailsImpl;
import com.gambler99.ebay_clone.service.PaymentService;
import jakarta.validation.Valid; // For validating request body
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
@Slf4j
public class PaymentController {
    private final PaymentService paymentService;

    /**
     * Endpoint to initiate a payment for an order.
     * Requires authentication.
     *
     * @param request     The payment request DTO containing orderId and paymentGateway.
     * @param userDetails The authenticated user details.
     * @return ResponseEntity with PaymentResponseDTO on success, or an error status.
     */
    @PostMapping("/initiate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentResponseDTO> initiatePayment(
            @Valid @RequestBody PaymentRequestDTO request, // Added @Valid for DTO validation
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info("User {} initiating payment for order ID {} via gateway {}", userDetails.getUsername(), request.orderId(), request.paymentGateway());
        // The service call now correctly uses request.orderId() and the full request DTO
        PaymentResponseDTO response = paymentService.initiatePayment(request.orderId(), request, userDetails);
        log.info("Payment initiated successfully for order ID {}. Transaction ID: {}", request.orderId(), response.transactionId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Endpoint to handle Stripe webhook events.
     * This endpoint is public but should be protected by Stripe signature verification.
     *
     * @param payload   The raw request body from Stripe.
     * @param sigHeader The "Stripe-Signature" header.
     * @return ResponseEntity indicating success (200 OK) or an error.
     */
    @PostMapping("/stripe/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload, // Raw payload
            @RequestHeader("Stripe-Signature") String sigHeader) {
        log.info("Received Stripe webhook. Verifying and processing...");
        try {
            paymentService.handleStripeWebhook(payload, sigHeader);
            log.info("Stripe webhook processed successfully.");
            return ResponseEntity.ok().body("Webhook processed"); // Return 200 OK to Stripe
        } catch (PaymentProcessingException e) {
            log.error("Error processing Stripe webhook: {}", e.getMessage(), e);
            // Return an error status. Stripe usually just wants a 2xx for acknowledgment.
            // For critical errors causing non-2xx, Stripe might retry.
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook processing error: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error processing Stripe webhook", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error processing webhook.");
        }
    }

    /**
     * Endpoint for an admin to update the status of a Cash On Delivery (COD) payment.
     * Requires ADMIN role.
     *
     * @param paymentId  The ID of the payment to update.
     * @param newStatus  The new status for the payment (passed as a request parameter).
     * @param adminUser  The authenticated admin user details.
     * @return ResponseEntity with the updated PaymentResponseDTO or an error status.
     */
    @PutMapping("/cod/{paymentId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentResponseDTO> updateCodPaymentStatus(
            @PathVariable Long paymentId,
            @RequestParam("status") Payment.PaymentStatus newStatus, // Spring converts string to enum
            @AuthenticationPrincipal UserDetailsImpl adminUser) {
        log.info("Admin {} attempting to update COD payment ID {} to status {}", adminUser.getUsername(), paymentId, newStatus);
        PaymentResponseDTO response = paymentService.updateCodPaymentStatus(paymentId, newStatus, adminUser);
        log.info("COD Payment ID {} status updated to {} by admin {}", paymentId, newStatus, adminUser.getUsername());
        return ResponseEntity.ok(response);
    }
}