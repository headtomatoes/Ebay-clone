package com.gambler99.ebay_clone.repository;

import com.gambler99.ebay_clone.entity.Review;
import com.gambler99.ebay_clone.entity.Product;
import com.gambler99.ebay_clone.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Get all reviews for a specific product
    List<Review> findByProduct(Product product);

    // Get all reviews by a specific user
    List<Review> findByUser(User user);

    // Check if a user has already reviewed a product
    Optional<Review> findByUserAndProduct(User user, Product product);

    // Get the average rating for a specific product by productId
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double findAverageRatingByProductId(Long productId);

}
