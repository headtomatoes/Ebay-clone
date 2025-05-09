package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.dto.StripePaymentIntentDetailsDTO;
import com.gambler99.ebay_clone.entity.Order;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class StripeService {

    /**
     * Creates a Stripe PaymentIntent for the given order.
     * In a real-world scenario, this method interacts with the Stripe API.
     * It should handle potential {@link StripeException}s.
     *
     * @param order The order for which to create the PaymentIntent.
     * @return StripePaymentIntentDetailsDTO containing the PaymentIntent ID and client secret.
     * @throws com.gambler99.ebay_clone.exception.PaymentProcessingException if Stripe API call fails.
     */
    public StripePaymentIntentDetailsDTO createPaymentIntent(Order order) {
        // IMPORTANT: This is a placeholder/simulation.
        // Replace with actual Stripe SDK logic.
        // Ensure Stripe.apiKey is initialized (e.g., in PaymentService @PostConstruct or a Stripe config class).

        log.info("Attempting to create Stripe PaymentIntent for order ID: {}, Amount: {}", order.getOrderId(), order.getTotalAmount());

        // Example of actual Stripe SDK usage:
        /*
        try {
            // Convert order amount to cents (or smallest currency unit)
            long amountInCents = order.getTotalAmount().multiply(new java.math.BigDecimal("100")).longValue();

            PaymentIntentCreateParams params =
                PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency("usd") // Or get currency from order/config
                    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
                    .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()
                    )
                    // Optionally, add customer ID, metadata, etc.
                    // .setCustomer("cus_...")
                     .putMetadata("order_id", String.valueOf(order.getOrderId()))
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);
            log.info("Stripe PaymentIntent created successfully. ID: {}", paymentIntent.getId());
            return new StripePaymentIntentDetailsDTO(paymentIntent.getId(), paymentIntent.getClientSecret());
        } catch (StripeException e) {
            log.error("Stripe API error while creating PaymentIntent for order {}: {}", order.getOrderId(), e.getMessage(), e);
            throw new com.gambler99.ebay_clone.exception.PaymentProcessingException("Failed to create Stripe PaymentIntent: " + e.getMessage());
        }
        */

        // Simulated response for now:
        String simulatedPaymentIntentId = "pi_sim_" + System.currentTimeMillis() + "_" + order.getOrderId();
        String simulatedClientSecret = "cs_sim_" + System.currentTimeMillis() + "_" + order.getOrderId();
        log.warn("SIMULATION: StripeService createPaymentIntent called for order {}. PI_ID: {}, CS: {}",
                order.getOrderId(), simulatedPaymentIntentId, simulatedClientSecret);
        return new StripePaymentIntentDetailsDTO(simulatedPaymentIntentId, simulatedClientSecret);
    }
}