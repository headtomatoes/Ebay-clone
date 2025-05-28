package com.gambler99.ebay_clone.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ProductCreateDTO (
    // take name, description, categoryId (Long), price (BigDecimal), stock (Integer), imageUrl (String)
    // Add validation annotations
    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 255, message = "Name must be between 3 and 255 characters")
    String name,

    @NotBlank(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters long")
    String description,

    @NotNull(message = "Category ID cannot be null")
    Long categoryId,

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    @Digits(integer=10, fraction=2, message = "Price format invalid (e.g., 12345678.99)")
    BigDecimal price,

    @NotNull(message = "Stock is required")
    @Positive(message = "Stock quantity must be positive")
    Integer stock,

    @NotNull(message = "Image URL is required")
    // @Pattern(regexp = "^(http|https)://.*\\.(jpg|jpeg|png|gif)$", message = "Image URL must be a valid image URL")
    @Size(max = 255, message = "Image URL must be less than 255 characters")
    String imageUrl
    // Add any other fields you need for product creation
    ) { }
