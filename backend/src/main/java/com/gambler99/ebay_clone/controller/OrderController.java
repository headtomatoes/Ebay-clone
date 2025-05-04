package com.gambler99.ebay_clone.controller;

import com.gambler99.ebay_clone.dto.OrderResponseDTO;
import com.gambler99.ebay_clone.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Create a new order from all CartItems
    @PostMapping("/from-cart/all/{userId}")
    public OrderResponseDTO createOrderFromAllCartItems(@PathVariable Long userId) {
        return orderService.createOrderFromAllCartItems(userId);
    }

    // Create a new order from selected CartItems
    @PostMapping("/from-cart/{userId}")
    public OrderResponseDTO createOrderFromCart(
            @PathVariable Long userId,
            @RequestBody List<Long> cartItemIds
    ) {
        return orderService.createOrderFromCart(userId, cartItemIds);
    }

    // Delete an order (only if status is PENDING_PAYMENT)
    @DeleteMapping("/{orderId}")
    public void deleteOrder(@PathVariable Long orderId, @RequestParam Long userId) {
        orderService.deleteOrder(orderId, userId);
    }

    // New endpoint to get all orders for a customer
    @GetMapping("/user/{userId}")
    public List<OrderResponseDTO> getAllOrdersForCustomer(@PathVariable Long userId) {
        return orderService.getAllOrdersForCustomer(userId);
    }

}