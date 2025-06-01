package com.gambler99.ebay_clone.dto;

import com.gambler99.ebay_clone.entity.Payment;
import jakarta.validation.constraints.NotNull;

public record PaymentRequestDTO(
        @NotNull(message = "Payment gateway is required")
        Payment.PaymentGateway paymentGateway,
        @NotNull(message = "Order ID is required")
        Long orderId
) {
}
