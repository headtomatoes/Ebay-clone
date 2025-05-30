package com.gambler99.ebay_clone.dto;

import com.gambler99.ebay_clone.entity.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductDetailDTO (
        Long productId,
        String name,
        String description,
        BigDecimal price,
        Integer stockQuantity,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Product.ProductStatus status, // Enum for product status
        String categoryName, // Denormalized for convenience
        String sellerUsername, // Denormalized for convenience
        String imageUrl
) { }
