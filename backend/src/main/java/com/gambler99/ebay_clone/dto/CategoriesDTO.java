package com.gambler99.ebay_clone.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoriesDTO {
    private Long categoryId;
    private String name;
    private String description;
}
