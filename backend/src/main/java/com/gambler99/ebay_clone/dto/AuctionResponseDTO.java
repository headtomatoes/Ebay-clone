package com.gambler99.ebay_clone.dto;

import com.gambler99.ebay_clone.entity.Auction;
import org.springframework.lang.Nullable;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AuctionResponseDTO(
        Long id,
        LocalDateTime startTime,
        LocalDateTime endTime,
        BigDecimal startPrice,
        BigDecimal currentPrice,
        Auction.AuctionStatus status,
        Long productId, // denormalized for convenience

        @Nullable
        String winnerUsername, // nullable
        @Nullable
        BigDecimal highestBidAmount, // nullable
        int totalBids
) {
}
