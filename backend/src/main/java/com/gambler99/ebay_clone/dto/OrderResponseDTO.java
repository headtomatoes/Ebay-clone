package com.gambler99.ebay_clone.dto;

import com.gambler99.ebay_clone.entity.Order.OrderStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class OrderResponseDTO {
    private Long orderId;
    private Long customerId;
    private Set<Long> productIds;
    private LocalDateTime orderDate;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private String shippingAddressSnapshot;
    private String billingAddressSnapshot;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}