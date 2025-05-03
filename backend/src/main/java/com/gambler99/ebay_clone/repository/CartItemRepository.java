package com.gambler99.ebay_clone.repository;

import com.gambler99.ebay_clone.entity.CartItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Corrected method to find cart items where product is null
    List<CartItem> findByUserIdAndProductIsNull(Long userId);

    // Find a specific cart item by user and product
    CartItem findByUserIdAndProductId(Long userId, Long productId);

    // Delete all cart items for a specific user
    void deleteByUserId(Long userId);

    // Use @EntityGraph to fetch product eagerly
    @EntityGraph(attributePaths = "product")
    List<CartItem> findByUserId(Long userId);

}
