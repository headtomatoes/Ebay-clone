package com.gambler99.ebay_clone.repository;

import com.gambler99.ebay_clone.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Custom query methods if needed

    // Find all orders by customer ID
    List<Order> findByCustomerUserId(Long customerId);

    // Find all orders by status
    List<Order> findByStatus(Order.OrderStatus status);

    // Find all orders placed after a specific date
    List<Order> findByOrderDateAfter(LocalDateTime date);
}