package com.gambler99.ebay_clone.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

// import org.hibernate.validator.constraints.NotBlank;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Data
public class OrderRequestDTO {
    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotEmpty(message = "At least one product is required")
    private Set<Long> productIds;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Total amount must be greater than 0")
    private BigDecimal totalAmount;

    @NotEmpty(message = "Shipping address is required")
    private String shippingAddressSnapshot;

    @NotEmpty(message = "Billing address is required")
    private String billingAddressSnapshot;
}