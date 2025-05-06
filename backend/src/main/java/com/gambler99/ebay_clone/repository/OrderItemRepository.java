package com.gambler99.ebay_clone.repository;

import com.gambler99.ebay_clone.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // Find all order items by order ID
    List<OrderItem> findByOrder_OrderId(Long orderId);

    // Find all order items by product ID
    List<OrderItem> findByProduct_ProductId(Long productId);

    // Find all order items by user ID (if applicable, ensure the relationship exists)
    List<OrderItem> findByOrder_Customer_UserId(Long userId); // Assuming Order has a User relationship
}