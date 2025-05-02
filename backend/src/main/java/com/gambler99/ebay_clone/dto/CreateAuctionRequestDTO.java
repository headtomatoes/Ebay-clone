package com.gambler99.ebay_clone.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CreateAuctionRequestDTO(
        @NotNull(message = "Product ID is required")
        Long productId,

        @NotNull(message = "Start time is required")
        @FutureOrPresent(message = "Start time cannot be in the past")
        LocalDateTime startTime,

        @NotNull(message = "End time is required")
        @Future(message = "End time cannot be in the past and must be after start time")
        LocalDateTime endTime,

        @NotNull(message = "Starting price is required")
        @DecimalMin(value = "0.01", message = "Starting price must be greater than 0.01") // object to change
        BigDecimal startPrice,

        @Nullable
        @DecimalMin(value = "0.01", message = "Buyout price must be atleast 0.01 greater than of the startPrice") // object to change
        BigDecimal reservePrice


) {
}
