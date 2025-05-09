package com.gambler99.ebay_clone.dto;

public record StripePaymentIntentDetailsDTO(
        String paymentIntentId,
        String clientSecret
) {
}
