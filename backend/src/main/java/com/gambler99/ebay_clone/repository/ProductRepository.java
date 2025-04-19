package com.gambler99.ebay_clone.repository;

import com.gambler99.ebay_clone.entity.products;
import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.entity.categories;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<products, Long> {
/**
 * Finds all products that belong to a specific category.*/
    List<products> findByCategory(categories category);
/**
 * Finds all products sold by a specific user (seller).*/
    List<products> findBySeller(User seller);
/**
 * Finds all products that have a specific status (e.g., ACTIVE, INACTIVE, SOLD_OUT, DRAFT).*/
    List<products> findByStatus(products.ProductStatus status);
}
