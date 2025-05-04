package com.gambler99.ebay_clone.dto;

import com.gambler99.ebay_clone.entity.Order.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {
    private Long orderId;
    private Long customerId;
    private List<OrderItemDTO> orderItems; // Include details of order items
    private LocalDateTime orderDate;
    private OrderStatus status;
    private BigDecimal totalAmount;
}