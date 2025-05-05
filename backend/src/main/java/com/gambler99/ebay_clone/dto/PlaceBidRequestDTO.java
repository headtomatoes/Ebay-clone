package com.gambler99.ebay_clone.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PlaceBidRequestDTO(
        @NotNull(message = "Bid amount is required if you want to place a bid")
        @DecimalMin(value = "0.01", message = "Bid amount must be greater than 0.01")
        BigDecimal bidAmount
) {
}
