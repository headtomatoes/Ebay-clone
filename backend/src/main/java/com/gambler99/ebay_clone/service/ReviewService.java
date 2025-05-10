package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.dto.ReviewDTO;
import com.gambler99.ebay_clone.dto.ReviewRequestDTO;
import com.gambler99.ebay_clone.entity.Product;
import com.gambler99.ebay_clone.entity.Review;
import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.repository.ProductRepository;
import com.gambler99.ebay_clone.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    // Method to create a new review
    public ReviewDTO createReview(User user, ReviewRequestDTO dto) {
        // Find the product by ID
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Create a new review and set its properties
        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setComment(dto.getComment());
        review.setRating(dto.getRating());

        // Save the review
        Review saved = reviewRepository.save(review);

        // Return the created review as a DTO
        return toDTO(saved);
    }

    // Method to get reviews by product ID
    public List<ReviewDTO> getReviewsByProduct(Long productId) {
        // Create a Product object with the productId
        Product product = new Product();
        product.setProductId(productId);

        // Fetch reviews using the correct method (findByProduct)
        List<Review> reviews = reviewRepository.findByProduct(product);

        // Return reviews mapped to ReviewDTO
        return reviews.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Method to get average rating for a product
    public Double getAverageRating(Long productId) {
        return reviewRepository.findAverageRatingByProductId(productId);
    }

    // Method to convert a Review entity to a ReviewDTO
    private ReviewDTO toDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setProductId(review.getProduct().getProductId()); // Use product.getProductId() instead of getId()
        dto.setUsername(review.getUser().getUsername());
        dto.setComment(review.getComment());
        dto.setRating((int) review.getRating());
        return dto;
    }

}
