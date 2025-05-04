package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.dto.OrderRequestDTO;
import com.gambler99.ebay_clone.dto.OrderResponseDTO;
import com.gambler99.ebay_clone.entity.Order;
import com.gambler99.ebay_clone.entity.Product;
import com.gambler99.ebay_clone.entity.User; // Correct import for User entity
import com.gambler99.ebay_clone.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public List<Order> getOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomerUserId(customerId);
    }

    @Override
    public List<Order> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    @Override
    public List<Order> getOrdersAfterDate(LocalDateTime date) {
        return orderRepository.findByOrderDateAfter(date);
    }

    @Override
    public Order updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    @Override
    public OrderResponseDTO createOrder(OrderRequestDTO orderRequestDTO) {
        // Map DTO to Entity
        Order order = new Order();
        order.setCustomer(new User(orderRequestDTO.getCustomerId(), null, null, null, null, null, null, null, null, null)); // Correct User entity usage
        order.setProducts(orderRequestDTO.getProductIds().stream()
                .map(productId -> new Product(productId, null, null, null, null, null, null, null, null, null, null)) // Assuming Product has a constructor with ID
                .collect(Collectors.toSet()));
        order.setTotalAmount(orderRequestDTO.getTotalAmount());
        order.setShippingAddressSnapshot(orderRequestDTO.getShippingAddressSnapshot());
        order.setBillingAddressSnapshot(orderRequestDTO.getBillingAddressSnapshot());

        // Save the order
        Order savedOrder = orderRepository.save(order);

        // Map Entity to DTO
        return mapToResponseDTO(savedOrder);
    }

    private OrderResponseDTO mapToResponseDTO(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setOrderId(order.getOrderId());
        dto.setCustomerId(order.getCustomer().getUserId());
        dto.setProductIds(order.getProducts().stream()
                .map(Product::getProductId)
                .collect(Collectors.toSet()));
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingAddressSnapshot(order.getShippingAddressSnapshot());
        dto.setBillingAddressSnapshot(order.getBillingAddressSnapshot());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        return dto;
    }

    @Override
    public OrderResponseDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        return mapToResponseDTO(order); // Reuse the mapping method
    }
}