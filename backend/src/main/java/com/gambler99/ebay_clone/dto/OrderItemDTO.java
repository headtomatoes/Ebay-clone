package com.gambler99.ebay_clone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private Long orderItemId;
    private Long productId;
    private String productName;
    private int quantity;
    private double priceAtPurchase;
    private String productImageUrl;
}