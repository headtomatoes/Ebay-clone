package com.gambler99.ebay_clone.dto;

// Handles input from the client when adding/removing items to/from the cart
public class CartRequestDTO {
    private Long productId;
    private int quantity;

    // Default constructor
    public CartRequestDTO() {}

    // Constructor with fields
    public CartRequestDTO(Long productId, int quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }

    // Getters and Setters
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
