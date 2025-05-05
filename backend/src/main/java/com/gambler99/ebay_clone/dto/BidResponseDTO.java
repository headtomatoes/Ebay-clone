package com.gambler99.ebay_clone.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BidResponseDTO(
        Long BidId,
        BigDecimal bidAmount,
        LocalDateTime bidTime,
        String bidderUsername // denormalized for convenience
                            // could be id or username, subject to change
) {
}
