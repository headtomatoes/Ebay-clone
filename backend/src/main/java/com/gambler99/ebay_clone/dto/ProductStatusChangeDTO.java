package com.gambler99.ebay_clone.dto;

import com.gambler99.ebay_clone.entity.Product;

public record ProductStatusChangeDTO(
        Long productId,
        Product.ProductStatus newStatus
) {
}
