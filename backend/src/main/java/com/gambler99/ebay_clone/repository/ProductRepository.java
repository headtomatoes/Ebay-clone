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

    List<Product> findByCategoryCategoryId(Long categoryId);

    List<Product> findBySeller_userId(Long sellerId);

    /**
     * Finds all products that have a specific name (case-insensitive).*/
    List<Product> findTop10ByNameContainingIgnoreCase(String name);

    /**
     * Finds all products that have a specific name (case-insensitive) and belong to a specific category.*/
    List<Product> findTop10ByNameContainingIgnoreCaseAndCategory(String name, Category category);

    /**
     * Finds all products that have a specific name (case-insensitive) and are sold by a specific user (seller).*/
    List<Product> findTop10ByNameContainingIgnoreCaseAndSeller(String name, User seller);

    /**
     * Finds all products that have active status*/
    List<Product> findByStatusAndCategory(Product.ProductStatus status, Category category);
}
