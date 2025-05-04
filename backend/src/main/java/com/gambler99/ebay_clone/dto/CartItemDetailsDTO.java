package com.gambler99.ebay_clone.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CartItemDetailsDTO {
    private Long productId;
    private String productName;
    private String productImageUrl;
    private Double price;
    private int quantity;

    // Constructors
    public CartItemDetailsDTO() {}

    public CartItemDetailsDTO(Long productId, String productName, String productImageUrl, Double price, int quantity) {
        this.productId = productId;
        this.productName = productName;
        this.productImageUrl = productImageUrl;
        this.price = price;
        this.quantity = quantity;
    }

    // Getters and setters
}
