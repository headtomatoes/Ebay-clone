package com.gambler99.ebay_clone.repository;

import com.gambler99.ebay_clone.entity.Product;
import com.gambler99.ebay_clone.entity.Category;
import com.gambler99.ebay_clone.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Find products by seller
    List<Product> findBySeller(User seller);

    // Find products by category
    List<Product> findByCategory(Category category);

    // Find products by status
    List<Product> findByStatus(Product.ProductStatus status);

    // Find all active products in a category
    List<Product> findByCategoryAndStatus(Category category, Product.ProductStatus status);

    // Search products by name containing (case-insensitive)
    List<Product> findByNameContainingIgnoreCase(String name);
}


