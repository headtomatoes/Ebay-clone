package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.dto.PaymentRequestDTO;
import com.gambler99.ebay_clone.dto.PaymentResponseDTO;
import com.gambler99.ebay_clone.dto.StripePaymentIntentDetailsDTO;
import com.gambler99.ebay_clone.entity.Order;
import com.gambler99.ebay_clone.entity.Payment;
import com.gambler99.ebay_clone.exception.PaymentProcessingException;
import com.gambler99.ebay_clone.exception.ResourceNotFoundException;
import com.gambler99.ebay_clone.repository.OrderRepository;
import com.gambler99.ebay_clone.repository.PaymentRepository;
import com.gambler99.ebay_clone.security.UserDetailsImpl;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import com.stripe.net.Webhook;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Added for conventional logging
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException; // Changed from SecurityException
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j // Use Lombok's Slf4j for logging
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final StripeService stripeService; // Ensure this service handles Stripe API call exceptions

    @Value("${stripe.api.key.secret}")
    private String stripeSecretKey;

    @Value("${stripe.webhook.secret}")
    private String stripeWebhookSecret;

    // Constants for roles and event types
    private static final String ROLE_ADMIN = "ROLE_ADMIN";
    private static final String EVENT_TYPE_PAYMENT_INTENT_SUCCEEDED = "payment_intent.succeeded";
    private static final String EVENT_TYPE_PAYMENT_INTENT_FAILED = "payment_intent.payment_failed";
    // Add other event types as constants if needed, e.g., payment_intent.canceled

    /**
     * Initializes the Stripe API key upon service construction.
     */
    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey; // Initialize Stripe with secret key
        log.info("Stripe API key configured.");
    }

    /**
     * Initiates a payment for a given order.
     *
     * @param orderId      The ID of the order to pay for.
     * @param dto          The payment request details (gateway, etc.).
     * @param userDetails  The details of the authenticated user.
     * @return A DTO containing the payment response, including client secret for Stripe.
     * @throws ResourceNotFoundException if the order is not found.
     * @throws AccessDeniedException if the order does not belong to the authenticated user.
     * @throws IllegalStateException if the order is not in PENDING_PAYMENT status.
     * @throws IllegalArgumentException if the payment gateway is unsupported.
     */
    @Transactional
    public PaymentResponseDTO initiatePayment(Long orderId, PaymentRequestDTO dto, UserDetailsImpl userDetails) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        // Security check: Ensure the order belongs to the authenticated user
        if (!Objects.equals(order.getCustomer().getUserId(), userDetails.getUserId())) {
            log.warn("User {} attempted to initiate payment for order {} not belonging to them.", userDetails.getUsername(), orderId);
            throw new AccessDeniedException("Order does not belong to the authenticated user.");
        }

        // Business rule: Order must be pending payment
        if (order.getStatus() != Order.OrderStatus.PENDING_PAYMENT) {
            log.warn("Attempt to pay for order {} with status {} (expected PENDING_PAYMENT).", orderId, order.getStatus());
            throw new IllegalStateException("Order " + orderId + " is not in PENDING_PAYMENT status. Current status: " + order.getStatus());
        }

        // TODO: Optional: Check if a PENDING payment already exists for this order and gateway.
        // If so, and it's Stripe, you might re-use the PaymentIntent if still valid to avoid duplicate PaymentIntents.

        String transactionId;
        String clientSecret = null; // Specific to Stripe

        Payment.PaymentBuilder paymentBuilder = Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .paymentGateway(dto.paymentGateway())
                .paymentDate(LocalDateTime.now()) // Initial payment attempt time
                .status(Payment.PaymentStatus.PENDING);

        if (dto.paymentGateway() == Payment.PaymentGateway.COD) {
            transactionId = generateCodTransactionId(orderId);
            paymentBuilder.transactionId(transactionId);
            // For COD, order status might change immediately (e.g., to PROCESSING)
            // This indicates items are reserved/prepared for COD.
            order.setStatus(Order.OrderStatus.PROCESSING);
            log.info("COD payment initiated for order {}. Order status set to PROCESSING.", orderId);
        } else if (dto.paymentGateway() == Payment.PaymentGateway.STRIPE) {
            // StripeService.createPaymentIntent should handle potential exceptions from Stripe API calls
            StripePaymentIntentDetailsDTO stripeDetails = stripeService.createPaymentIntent(order);
            transactionId = stripeDetails.paymentIntentId();
            clientSecret = stripeDetails.clientSecret();
            paymentBuilder.transactionId(transactionId);
            // For Stripe, order status remains PENDING_PAYMENT until webhook confirms successful payment.
            log.info("Stripe payment initiated for order {}. PaymentIntent ID: {}", orderId, transactionId);
        } else {
            log.error("Unsupported payment gateway requested: {}", dto.paymentGateway());
            throw new IllegalArgumentException("Unsupported payment gateway: " + dto.paymentGateway());
        }

        Payment payment = paymentBuilder.build();
        payment = paymentRepository.save(payment);
        orderRepository.save(order); // Save order status changes if any

        log.info("Payment record {} created for order {} with status {} and gateway {}",
                payment.getPaymentId(), orderId, payment.getStatus(), payment.getPaymentGateway());
        return mapToPaymentResponseDTO(payment, clientSecret);
    }

    /**
     * Generates a unique transaction ID for Cash On Delivery (COD) payments.
     * @param orderId The order ID.
     * @return A unique transaction ID string.
     */
    private String generateCodTransactionId(Long orderId) {
        // Example: COD_123_1678886400000
        return "COD_" + orderId + "_" + System.currentTimeMillis();
    }

    /**
     * Handles incoming Stripe webhook events.
     * Verifies the signature and processes supported payment intent events.
     *
     * @param payload   The raw payload string from the webhook request.
     * @param sigHeader The Stripe-Signature header value.
     * @throws PaymentProcessingException if signature verification fails or event processing encounters an error.
     */
    @Transactional
    public void handleStripeWebhook(String payload, String sigHeader) {
        Event event;
        try {
            // 1. Verify webhook signature
            event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
            log.info("Stripe webhook event received. ID: {}, Type: {}", event.getId(), event.getType());
        } catch (SignatureVerificationException e) {
            log.error("⚠️ Webhook signature verification failed.", e);
            throw new PaymentProcessingException("Webhook signature verification failed.");
        } catch (Exception e) { // Catching generic exception for parsing issues before deserialization
            log.error("⚠️ Webhook error while parsing payload. Event might be malformed.", e);
            throw new PaymentProcessingException("Webhook error parsing payload: " + e.getMessage());
        }

        // 2. Deserialize the nested object inside the event
        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        if (dataObjectDeserializer.getObject().isEmpty()) {
            log.error("⚠️ Stripe event data object is missing for event ID: {} type: {}", event.getId(), event.getType());
            throw new PaymentProcessingException("Stripe event data object is missing for event: " + event.getId());
        }
        StripeObject stripeObject = dataObjectDeserializer.getObject().get();

        // 3. Handle the event based on its type
        switch (event.getType()) {
            case EVENT_TYPE_PAYMENT_INTENT_SUCCEEDED:
                if (stripeObject instanceof PaymentIntent paymentIntentSucceeded) {
                    log.info("✅ Processing PaymentIntent Succeeded. ID: {}", paymentIntentSucceeded.getId());
                    handlePaymentIntentSucceeded(paymentIntentSucceeded);
                } else {
                    log.error("⚠️ Expected PaymentIntent for event type '{}', but got: {}", event.getType(), stripeObject.getClass().getName());
                    throw new PaymentProcessingException("Unexpected object type for '" + event.getType() + "'.");
                }
                break;
            case EVENT_TYPE_PAYMENT_INTENT_FAILED:
                if (stripeObject instanceof PaymentIntent paymentIntentFailed) {
                    log.warn("❌ Processing PaymentIntent Failed. ID: {}, Reason: {}", paymentIntentFailed.getId(), paymentIntentFailed.getLastPaymentError());
                    handlePaymentIntentFailed(paymentIntentFailed);
                } else {
                    log.error("⚠️ Expected PaymentIntent for event type '{}', but got: {}", event.getType(), stripeObject.getClass().getName());
                    throw new PaymentProcessingException("Unexpected object type for '" + event.getType() + "'.");
                }
                break;
            // TODO: Handle other relevant event types (e.g., 'payment_intent.canceled', 'charge.refunded')
            // case "payment_intent.canceled":
            //    PaymentIntent paymentIntentCanceled = (PaymentIntent) stripeObject;
            //    handlePaymentIntentCanceled(paymentIntentCanceled);
            //    break;
            default:
                log.warn("↩️ Unhandled Stripe event type: {}", event.getType());
        }
    }

    /**
     * Handles a successful payment intent from Stripe.
     * Updates payment and order statuses. Ensures idempotency.
     * @param paymentIntent The successful PaymentIntent object from Stripe.
     */
    private void handlePaymentIntentSucceeded(PaymentIntent paymentIntent) {
        // Find our Payment record using paymentIntent.getId() which is our transactionId
        Optional<Payment> paymentOpt = paymentRepository.findByTransactionId(paymentIntent.getId());

        if (paymentOpt.isEmpty()) {
            // This is critical: a payment succeeded on Stripe but we don't have a local record.
            // This ideally shouldn't happen if initiatePayment worked correctly.
            log.error("CRITICAL: Payment record not found for succeeded Stripe PaymentIntent ID: {}. Manual investigation required.", paymentIntent.getId());
            // TODO: Consider creating a payment record here or flagging for manual intervention.
            // For now, throwing an exception might be safer to ensure it's not silently ignored.
            throw new PaymentProcessingException("Payment record not found for successful PaymentIntent: " + paymentIntent.getId());
        }

        Payment payment = paymentOpt.get();

        // Idempotency: Check if already processed
        if (payment.getStatus() == Payment.PaymentStatus.SUCCESS) {
            log.info("PaymentIntent {} already processed successfully. Payment ID: {}", paymentIntent.getId(), payment.getPaymentId());
            return;
        }

        // Ensure the payment was in PENDING state
        if (payment.getStatus() != Payment.PaymentStatus.PENDING) {
            log.warn("PaymentIntent {} succeeded, but local Payment ID {} status was {} (not PENDING). Investigate.",
                    paymentIntent.getId(), payment.getPaymentId(), payment.getStatus());
            // Depending on business rules, might still update to SUCCESS or flag for review.
            // For now, we'll proceed if it wasn't already SUCCESS/FAILED.
        }

        // Update Payment and Order status
        payment.setStatus(Payment.PaymentStatus.SUCCESS);
        // payment.setPaymentDate(LocalDateTime.now()); // Or use timestamp from Stripe event if available and preferred
        // e.g. Instant.ofEpochSecond(paymentIntent.getCreated())

        Order order = payment.getOrder();
        if (order != null) {
            if (order.getStatus() == Order.OrderStatus.PENDING_PAYMENT) {
                order.setStatus(Order.OrderStatus.PROCESSING); // Or AWAITING_SHIPMENT, etc.
                orderRepository.save(order);
                log.info("Order ID {} status updated to {} for successful PaymentIntent ID {}", order.getOrderId(), order.getStatus(), paymentIntent.getId());
            } else {
                // If order was not PENDING_PAYMENT, it might have been updated by another process or COD initiation.
                log.warn("Order ID {} was not in PENDING_PAYMENT status (was {}) when processing successful PaymentIntent ID {}. Current status: {}",
                        order.getOrderId(), order.getStatus(), paymentIntent.getId(), order.getStatus());
            }
        } else {
            log.error("CRITICAL: Order not found for payment ID: {}. Data inconsistency for PaymentIntent ID: {}", payment.getPaymentId(), paymentIntent.getId());
            // This implies a data integrity issue (Payment exists without a valid Order relation).
        }
        paymentRepository.save(payment);
        log.info("Payment ID {} status updated to SUCCESS for PaymentIntent ID {}", payment.getPaymentId(), paymentIntent.getId());

        // TODO: Trigger post-payment actions (e.g., send confirmation email, notify fulfillment service, reduce stock).
    }

    /**
     * Handles a failed payment intent from Stripe.
     * Updates payment status. Ensures idempotency.
     * @param paymentIntent The failed PaymentIntent object from Stripe.
     */
    private void handlePaymentIntentFailed(PaymentIntent paymentIntent) {
        Optional<Payment> paymentOpt = paymentRepository.findByTransactionId(paymentIntent.getId());

        if (paymentOpt.isEmpty()) {
            log.error("Payment record not found for failed Stripe PaymentIntent ID: {}. This might be okay if payment initiation failed early.", paymentIntent.getId());
            // If payment initiation never created a Payment entity, this is expected.
            // If it did, it's an issue similar to the success case.
            return; // Or throw if a Payment record was expected.
        }

        Payment payment = paymentOpt.get();

        // Idempotency: Check if already processed as FAILED
        if (payment.getStatus() == Payment.PaymentStatus.FAILED) {
            log.info("PaymentIntent {} already processed as FAILED. Payment ID: {}", paymentIntent.getId(), payment.getPaymentId());
            return;
        }

        // If it was SUCCESS, a FAILED event is problematic and needs investigation.
        if (payment.getStatus() == Payment.PaymentStatus.SUCCESS) {
            log.error("CRITICAL: PaymentIntent {} failed, but local Payment ID {} was already SUCCESS. Investigate.", paymentIntent.getId(), payment.getPaymentId());
            // TODO: Decide on handling. E.g., create a dispute record, notify admin.
            // For now, we won't change status from SUCCESS to FAILED via this path.
            return;
        }

        if (payment.getStatus() == Payment.PaymentStatus.PENDING) {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            // payment.setPaymentDate(LocalDateTime.now()); // Or use timestamp from Stripe event

            Order order = payment.getOrder();
            if (order != null) {
                // Order status for failed Stripe payment typically remains PENDING_PAYMENT,
                // allowing the user to try again with a different method.
                // Or it could be moved to a specific PAYMENT_FAILED status if such exists.
                if (order.getStatus() == Order.OrderStatus.PENDING_PAYMENT) {
                    log.info("Order ID {} remains in PENDING_PAYMENT for failed PaymentIntent ID {}", order.getOrderId(), paymentIntent.getId());
                } else {
                    log.warn("Order ID {} status was {} (not PENDING_PAYMENT) when processing failed PaymentIntent ID {}. Order status unchanged.",
                            order.getOrderId(), order.getStatus(), paymentIntent.getId());
                }
                // No orderRepository.save(order) here unless status changes
            } else {
                log.error("Order not found for payment ID: {} during failed PaymentIntent processing. PI_ID: {}", payment.getPaymentId(), paymentIntent.getId());
            }
            paymentRepository.save(payment);
            log.info("Payment ID {} status updated to FAILED for PaymentIntent ID {}", payment.getPaymentId(), paymentIntent.getId());

            // TODO: Notify user of payment failure and suggest retry or alternative methods.
        } else {
            // Payment was not PENDING, SUCCESS, or FAILED.
            log.warn("PaymentIntent {} failed, but local Payment ID {} status was {} (not PENDING). Investigate.",
                    paymentIntent.getId(), payment.getPaymentId(), payment.getStatus());
        }
    }


    /**
     * Updates the status of a Cash On Delivery (COD) payment. Intended for admin use.
     *
     * @param paymentId    The ID of the payment to update.
     * @param newStatus    The new status for the payment.
     * @param adminUser    The admin user performing the update (for logging/audit).
     * @return A DTO representing the updated payment.
     * @throws ResourceNotFoundException if the payment is not found.
     * @throws AccessDeniedException if the user is not authorized (redundant if controller has @PreAuthorize).
     * @throws IllegalArgumentException if the payment is not COD or if the status transition is invalid.
     */
    @Transactional
    public PaymentResponseDTO updateCodPaymentStatus(Long paymentId, Payment.PaymentStatus newStatus, UserDetailsImpl adminUser) {
        // Authorization check (defense-in-depth, primarily handled by @PreAuthorize in controller)
        if (adminUser.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals(ROLE_ADMIN))) {
            log.warn("Non-admin user {} attempted to update COD payment status for payment ID {}.", adminUser.getUsername(), paymentId);
            throw new AccessDeniedException("User not authorized to update COD payment status.");
        }

        log.info("Admin {} attempting to update COD Payment ID {} to status {}", adminUser.getUsername(), paymentId, newStatus);
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));

        if (payment.getPaymentGateway() != Payment.PaymentGateway.COD) {
            log.warn("Attempt to update non-COD payment ID {} (type: {}) as COD.", paymentId, payment.getPaymentGateway());
            throw new IllegalArgumentException("Payment ID " + paymentId + " is not a COD payment.");
        }

        // CRITICAL TODO: Implement robust logic for valid COD status transitions.
        // For example:
        // PENDING -> DELIVERED, PENDING -> FAILED_DELIVERY, PENDING -> CANCELED
        // DELIVERED -> PAID (SUCCESS), DELIVERED -> RETURNED
        // Current implementation allows any status change. This needs refinement based on business logic.
        // Example (simplified):
        // if (payment.getStatus() == Payment.PaymentStatus.PENDING &&
        //    (newStatus == Payment.PaymentStatus.SUCCESS || newStatus == Payment.PaymentStatus.FAILED)) {
        //     // Allow
        // } else if ( ... other valid transitions ... ) {
        //     // Allow
        // }
        // else {
        //     log.warn("Invalid status transition for COD Payment ID {} from {} to {}", paymentId, payment.getStatus(), newStatus);
        //     throw new IllegalArgumentException("Invalid status transition for COD payment.");
        // }
        log.warn("COD Payment ID {}: Status transition logic is currently basic. Current status: {}, New status: {}. ENSURE ROBUST VALIDATION IS IMPLEMENTED.",
                paymentId, payment.getStatus(), newStatus);


        payment.setStatus(newStatus);
        payment.setPaymentDate(LocalDateTime.now()); // Typically, this is the date cash was confirmed/received or failure noted.

        Order order = payment.getOrder();
        if (order != null) {
            if (newStatus == Payment.PaymentStatus.SUCCESS) {
                // If COD is successful, the order (which was already PROCESSING from initiatePayment)
                // might move to COMPLETED or AWAITING_SHIPMENT (if not already shipped for COD).
                // Assuming PROCESSING is the correct state after payment confirmation for COD.
                if (order.getStatus() == Order.OrderStatus.PROCESSING || order.getStatus() == Order.OrderStatus.PENDING_PAYMENT) {
                    // PENDING_PAYMENT shouldn't happen if initiatePayment set it to PROCESSING for COD
                    order.setStatus(Order.OrderStatus.PROCESSING); // Or COMPLETED if payment means order fulfillment is done.
                    orderRepository.save(order);
                    log.info("COD Payment ID {} successful. Order ID {} status confirmed/updated to {}.", paymentId, order.getOrderId(), order.getStatus());
                }
            } else if (newStatus == Payment.PaymentStatus.FAILED) {
                // If COD payment failed (e.g., customer refused, not available)
                // The order status might need to be updated (e.g., CANCELED, ON_HOLD, or back to PENDING_PAYMENT for re-attempt if applicable)
                // TODO: Define order status update logic for failed COD payments.
                log.warn("COD Payment ID {} failed. Order ID {}. Define order status update logic for this scenario.", paymentId, order.getOrderId());
                // Example: order.setStatus(Order.OrderStatus.CANCELED); orderRepository.save(order);
            }
        } else {
            log.error("Order not found for COD payment ID: {} during status update.", payment.getPaymentId());
        }

        payment = paymentRepository.save(payment);
        return mapToPaymentResponseDTO(payment, null); // clientSecret is null for COD
    }

    /**
     * Maps a Payment entity to a PaymentResponseDTO.
     * @param payment      The Payment entity.
     * @param clientSecret The Stripe client secret (nullable, used for Stripe payments).
     * @return The mapped PaymentResponseDTO.
     */
    private PaymentResponseDTO mapToPaymentResponseDTO(Payment payment, String clientSecret) {
        if (payment.getOrder() == null) {
            log.error("Payment ID {} is missing its associated order. Cannot retrieve orderId for DTO.", payment.getPaymentId());
            throw new IllegalStateException("Associated order is missing for payment " + payment.getPaymentId());
        }
        return new PaymentResponseDTO(
                payment.getPaymentGateway(),
                payment.getAmount(),
                payment.getStatus(),
                payment.getTransactionId(),
                payment.getPaymentDate(),
                payment.getOrder().getOrderId(),
                clientSecret
        );
    }
}