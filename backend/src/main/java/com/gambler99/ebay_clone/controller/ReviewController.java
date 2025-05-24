package com.gambler99.ebay_clone.controller;

import com.gambler99.ebay_clone.dto.ReviewDTO;
import com.gambler99.ebay_clone.dto.ReviewRequestDTO;
import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.repository.UserRepository;
import com.gambler99.ebay_clone.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    //  Enforce auth manually, don't rely on config or @PreAuthorize
    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(@Valid @RequestBody ReviewRequestDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() ||
                authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ReviewDTO createdReview = reviewService.createReview(user, dto);
        return ResponseEntity.ok(createdReview);
    }

    //  Public endpoint
    @GetMapping("product/{productId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByProduct(@PathVariable Long productId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(reviews);
    }

    //  Public endpoint
    @GetMapping("product/{productId}/average-rating")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long productId) {
        Double average = reviewService.getAverageRating(productId);
        double roundedAverage = average != null ? Math.round(average * 10.0) / 10.0 : 0.0;
        return ResponseEntity.ok(roundedAverage);
    }
}
