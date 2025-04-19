package com.gambler99.ebay_clone.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long productId;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String imageUrl;
    private String status;
    private String createdAt;
    private String updatedAt;

    private Long sellerId;
    private String sellerUsername;

    private Long categoryId;
    private String categoryName;
}
