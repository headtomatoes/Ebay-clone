package com.gambler99.ebay_clone.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CartItemResponseDTO(
        Long cartItemId,
        Long userId,
        Long productId,
        String productName,
        BigDecimal productPrice,
        String productImageUrl,
        Integer quantity,
        LocalDateTime addedAt
) {}
