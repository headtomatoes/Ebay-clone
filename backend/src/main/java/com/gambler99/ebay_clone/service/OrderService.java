package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.dto.OrderRequestDTO;
import com.gambler99.ebay_clone.dto.OrderResponseDTO;
import com.gambler99.ebay_clone.entity.Order;

// import java.time.LocalDateTime;
import java.util.List;

public interface OrderService {
    OrderResponseDTO createOrderFromAllCartItems(Long userId); 

    OrderResponseDTO createOrderFromCart(Long userId, List<Long> productIds);

    void deleteOrder(Long orderId, Long userId); 

    // New method to get all orders for a customer
    List<OrderResponseDTO> getAllOrdersForCustomer(Long userId);

    OrderResponseDTO getOrderById(Long orderId, Long userId);
}