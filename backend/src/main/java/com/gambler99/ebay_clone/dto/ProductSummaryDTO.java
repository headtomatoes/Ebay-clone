package com.gambler99.ebay_clone.dto;

import java.math.BigDecimal;

public record ProductSummaryDTO (
    Long productId,
    String name,
    BigDecimal price,
    String categoryName, // Denormalized for convenience
    String imageUrl
) { }
