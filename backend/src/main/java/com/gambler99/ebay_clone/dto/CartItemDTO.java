package com.gambler99.ebay_clone.dto;

import lombok.Getter;
import lombok.Setter;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Setter
@Getter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private Long productId;
    private String productName;
    private String productImageUrl;
    private Double price;
    private int quantity;
}
