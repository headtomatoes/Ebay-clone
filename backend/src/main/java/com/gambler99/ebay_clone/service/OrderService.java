package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.dto.OrderRequestDTO;
import com.gambler99.ebay_clone.dto.OrderResponseDTO;
import com.gambler99.ebay_clone.entity.Order;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderService {
    Order createOrder(Order order);
    OrderResponseDTO getOrderById(Long orderId); // New method

    List<Order> getOrdersByCustomerId(Long customerId);
    List<Order> getOrdersByStatus(Order.OrderStatus status);
    List<Order> getOrdersAfterDate(LocalDateTime date);
    Order updateOrderStatus(Long orderId, Order.OrderStatus status);
    OrderResponseDTO createOrder(OrderRequestDTO orderRequestDTO);
    /* create order from cart, input userID, */
}