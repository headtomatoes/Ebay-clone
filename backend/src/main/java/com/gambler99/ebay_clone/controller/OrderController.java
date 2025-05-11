package com.gambler99.ebay_clone.controller;

import com.gambler99.ebay_clone.dto.OrderResponseDTO;
import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.repository.UserRepository;
import com.gambler99.ebay_clone.service.OrderService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    public OrderController(OrderService orderService, UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    // Create a new order from all CartItems
    @PostMapping("/from-cart/all")
    public OrderResponseDTO createOrderFromAllCartItems() {
        User user = getAuthenticatedUser();
        return orderService.createOrderFromAllCartItems(user.getUserId());
    }

    // Create a new order from selected CartItems
    @PostMapping("/from-cart")
    public OrderResponseDTO createOrderFromCart(@RequestBody List<Long> cartItemIds) {
        User user = getAuthenticatedUser();
        return orderService.createOrderFromCart(user.getUserId(), cartItemIds);
    }

    // Delete an order (only if status is PENDING_PAYMENT)
    @DeleteMapping("/{orderId}")
    public void deleteOrder(@PathVariable Long orderId) {
        User user = getAuthenticatedUser();
        orderService.deleteOrder(orderId, user.getUserId());
    }

    @GetMapping("/{orderId}")
    public OrderResponseDTO getOrderById(@PathVariable Long orderId) {
        User user = getAuthenticatedUser();
        return orderService.getOrderById(orderId, user.getUserId());
    }
    // Get all orders for the authenticated user
    @GetMapping
    public List<OrderResponseDTO> getAllOrdersForCustomer() {
        User user = getAuthenticatedUser();
        return orderService.getAllOrdersForCustomer(user.getUserId());
    }
}

// package com.gambler99.ebay_clone.controller;

// import com.gambler99.ebay_clone.dto.OrderResponseDTO;
// import com.gambler99.ebay_clone.service.OrderService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/orders")
// public class OrderController {

//     @Autowired
//     private OrderService orderService;

//     // Create a new order from all CartItems
//     @PostMapping("/from-cart/all/{userId}")
//     public OrderResponseDTO createOrderFromAllCartItems(@PathVariable Long userId) {
//         return orderService.createOrderFromAllCartItems(userId);
//     }

//     // Create a new order from selected CartItems
//     @PostMapping("/from-cart/{userId}")
//     public OrderResponseDTO createOrderFromCart(
//             @PathVariable Long userId,
//             @RequestBody List<Long> cartItemIds
//     ) {
//         return orderService.createOrderFromCart(userId, cartItemIds);
//     }

//     // Delete an order (only if status is PENDING_PAYMENT)
//     @DeleteMapping("/{orderId}")
//     public void deleteOrder(@PathVariable Long orderId, @RequestParam Long userId) {
//         orderService.deleteOrder(orderId, userId);
//     }

//     // New endpoint to get all orders for a customer
//     @GetMapping("/user/{userId}")
//     public List<OrderResponseDTO> getAllOrdersForCustomer(@PathVariable Long userId) {
//         return orderService.getAllOrdersForCustomer(userId);
//     }

// }