package com.gambler99.ebay_clone.dto;

public class CartItemDTO {
    private Long productId;
    private String productName;
    private String productImageUrl;
    private Double price;
    private int quantity;

    // Constructors
    public CartItemDTO() {}

    public CartItemDTO(Long productId, String productName, String productImageUrl, Double price, int quantity) {
        this.productId = productId;
        this.productName = productName;
        this.productImageUrl = productImageUrl;
        this.price = price;
        this.quantity = quantity;
    }

    // Getters and setters
}
