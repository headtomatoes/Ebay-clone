package com.gambler99.ebay_clone.dto;

import com.gambler99.ebay_clone.entity.Payment;
import org.springframework.lang.Nullable;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponseDTO(
        Payment.PaymentGateway paymentGateway,
        BigDecimal amount,
        Payment.PaymentStatus status,
        String transactionId,
        LocalDateTime paymentDate,
        Long orderId,

        @Nullable
        String clientSecret // Optional: Include client secret for Stripe payments
) {
}
