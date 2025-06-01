package com.gambler99.ebay_clone.dto;

import com.gambler99.ebay_clone.entity.Product;

import java.math.BigDecimal;

public record ProductSummaryDTO (
    Long productId,
    String name,
    BigDecimal price,
    String categoryName,// Denormalized for convenience
    Product.ProductStatus status,
    String imageUrl
) { }
