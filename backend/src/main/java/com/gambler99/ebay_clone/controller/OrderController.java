package com.gambler99.ebay_clone.controller;

import com.gambler99.ebay_clone.dto.OrderRequestDTO;
import com.gambler99.ebay_clone.dto.OrderResponseDTO;
import com.gambler99.ebay_clone.entity.Order;
import com.gambler99.ebay_clone.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Create new order
    @PostMapping
    public OrderResponseDTO createOrder(@RequestBody OrderRequestDTO orderRequestDTO) {
        return orderService.createOrder(orderRequestDTO);
    }

    // Get order by ID
    @GetMapping("/{orderId}")
    public OrderResponseDTO getOrderById(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId);
    }

    // Get all orders by customer ID

    // Get orders by status
    @GetMapping("/status/{status}")
    public List<Order> getOrdersByStatus(@PathVariable Order.OrderStatus status) {
        return orderService.getOrdersByStatus(status);
    }

    // Get orders after a certain date
    @GetMapping("/after/{date}")
    public List<Order> getOrdersAfterDate(@PathVariable String date) {
        return orderService.getOrdersAfterDate(LocalDateTime.parse(date));
    }

    // Update order status
    @PutMapping("/{orderId}/status")
    public Order updateOrderStatus(@PathVariable Long orderId,
                                              @RequestParam Order.OrderStatus status) {
        return orderService.updateOrderStatus(orderId, status);
    }


    @GetMapping("/customer/{customerId}")
    public List<Order> getOrdersByCustomerId(@PathVariable Long customerId) {
        return orderService.getOrdersByCustomerId(customerId);
    }


    // @GetMapping("/status/{status}")
    // public List<Order> getOrdersByStatus(@PathVariable Order.OrderStatus status) {
    //     return orderService.getOrdersByStatus(status);
    // }


    // @GetMapping("/after/{date}")
    // public List<Order> getOrdersAfterDate(@PathVariable String date) {
    //     return orderService.getOrdersAfterDate(LocalDateTime.parse(date));
    // }
}