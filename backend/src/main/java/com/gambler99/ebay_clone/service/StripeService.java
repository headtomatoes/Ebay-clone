package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.dto.StripePaymentIntentDetailsDTO;
import com.gambler99.ebay_clone.entity.Order;
import com.gambler99.ebay_clone.exception.PaymentProcessingException; // Ensure this exception exists
import com.stripe.Stripe; // Already imported
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct; // Keep if Stripe key is initialized here, but it's in PaymentService
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value; // For API key if initialized here
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class StripeService {

    // Note: Stripe.apiKey is typically set globally once, e.g., in PaymentService @PostConstruct
    // or a dedicated Stripe configuration class. No need for @Value here if set elsewhere.

    /**
     * Creates a Stripe PaymentIntent for the given order using the Stripe SDK.
     *
     * @param order The order for which to create the PaymentIntent.
     * @return StripePaymentIntentDetailsDTO containing the PaymentIntent ID and client secret.
     * @throws PaymentProcessingException if Stripe API call fails.
     */
    public StripePaymentIntentDetailsDTO createPaymentIntent(Order order) {
        log.info("Attempting to create Stripe PaymentIntent for order ID: {}, Amount: {}", order.getOrderId(), order.getTotalAmount());

        try {
            // Convert order amount to cents (or smallest currency unit for the currency)
            // Stripe expects amounts in the smallest currency unit (e.g., cents for USD).
            long amountInCents = order.getTotalAmount().multiply(new BigDecimal("100")).longValueExact();

            // Define currency (should ideally come from order or configuration)
            String currency = "usd"; // Example: US Dollar

            PaymentIntentCreateParams params =
                    PaymentIntentCreateParams.builder()
                            .setAmount(amountInCents)
                            .setCurrency(currency)
                            // In the latest versions of the API, specifying the `automatic_payment_methods`
                            // parameter is optional because Stripe enables its functionality by default.
                            // Recommended by Stripe for future-proofing and supporting various payment methods.
                            .setAutomaticPaymentMethods(
                                    PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()
                            )
                            // Add metadata for easier reconciliation and tracking in Stripe dashboard
                            .putMetadata("order_id", String.valueOf(order.getOrderId()))
                            .putMetadata("customer_username", order.getCustomer().getUsername()) // If available and useful
                            // You can add more metadata as needed, e.g., .putMetadata("product_details", "...")
                            .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            log.info("Stripe PaymentIntent created successfully. ID: {}, Client Secret: {}", paymentIntent.getId(), paymentIntent.getClientSecret() != null ? "Present" : "Missing");
            if (paymentIntent.getClientSecret() == null) {
                log.error("CRITICAL: Stripe PaymentIntent {} was created but is missing a client_secret. This usually indicates a problem with the PaymentIntent setup or status.", paymentIntent.getId());
                throw new PaymentProcessingException("Failed to create Stripe PaymentIntent: Client secret is missing.");
            }

            return new StripePaymentIntentDetailsDTO(paymentIntent.getId(), paymentIntent.getClientSecret());

        } catch (StripeException e) {
            log.error("Stripe API error while creating PaymentIntent for order {}: Code='{}', Message='{}'",
                    order.getOrderId(), e.getCode(), e.getMessage(), e);
            throw new PaymentProcessingException("Failed to create Stripe PaymentIntent: " + e.getMessage());
        } catch (ArithmeticException e) {
            log.error("Arithmetic error converting amount for order {}: {}", order.getOrderId(), e.getMessage());
            throw new PaymentProcessingException("Error processing payment amount for order " + order.getOrderId());
        }
    }
}