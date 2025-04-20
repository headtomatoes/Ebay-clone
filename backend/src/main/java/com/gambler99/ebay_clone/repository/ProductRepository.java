package com.gambler99.ebay_clone.repository;

import com.gambler99.ebay_clone.entity.Product;
import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    /**
     * Finds all products that belong to a specific category.*/
    List<Product> findByCategory(Category category);
    /**
     * Finds all products sold by a specific user (seller).*/
    List<Product> findBySeller(User seller);
    /**
     * Finds all products that have a specific status (e.g., ACTIVE, INACTIVE, SOLD_OUT, DRAFT).*/
    List<Product> findByStatus(Product.ProductStatus status);
}
