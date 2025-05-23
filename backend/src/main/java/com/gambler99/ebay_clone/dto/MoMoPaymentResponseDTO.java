package com.gambler99.ebay_clone.dto;

public record MoMoPaymentResponseDTO(
        String payUrl,
        String requestId,
        String momoOrderId
) {
}
