package com.gambler99.ebay_clone.controller;

import com.gambler99.ebay_clone.dto.ReviewDTO;
import com.gambler99.ebay_clone.dto.ReviewRequestDTO;
import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.repository.UserRepository;
import com.gambler99.ebay_clone.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;


    //Create a new review for a product.
    //The authenticated user's username is retrieved from the SecurityContext.

    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(
            @Valid @RequestBody ReviewRequestDTO dto) {

        // Retrieve authentication details from the security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // If not authenticated, return 401 Unauthorized
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        // Extract the username from the authentication principal
        String username = authentication.getName();

        // Fetch the User entity by username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delegate review creation to the service layer
        ReviewDTO createdReview = reviewService.createReview(user, dto);
        return ResponseEntity.ok(createdReview);
    }


    //Retrieve all reviews for a specific product.

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByProduct(@PathVariable Long productId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(reviews);
    }


    //Get the average rating for a specific product.








}
