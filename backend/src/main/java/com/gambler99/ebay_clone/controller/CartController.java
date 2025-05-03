package com.gambler99.ebay_clone.controller;

import com.gambler99.ebay_clone.dto.CartItemDTO;
import com.gambler99.ebay_clone.dto.CartItemResponseDTO;
import com.gambler99.ebay_clone.entity.CartItem;
import com.gambler99.ebay_clone.security.UserDetailsImpl;
import com.gambler99.ebay_clone.service.CartItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartItemService cartItemService;

    @PostMapping("/add")
    public ResponseEntity<CartItemResponseDTO> addToCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CartItemDTO dto  // Added @Valid for DTO validation
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        dto.setUserId(userDetails.getUserId());  // Ensure the user ID is set
        CartItem savedItem = cartItemService.addItemToCart(dto);
        CartItemResponseDTO responseDTO = mapToResponseDTO(savedItem);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedItem.getCartItemId())
                .toUri();

        return ResponseEntity.created(location).body(responseDTO);
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Void> removeFromCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long productId
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean isDeleted = cartItemService.deleteItemFromCart(userDetails.getUserId(), productId);
        return isDeleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping
    public ResponseEntity<List<CartItemResponseDTO>> getCartItems(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<CartItem> items = cartItemService.getItemsByUserId(userDetails.getUserId());

        List<CartItemResponseDTO> response = items.stream()
                .map(item -> {
                    var product = item.getProduct();
                    return new CartItemResponseDTO(
                            item.getCartItemId(),
                            item.getUserId(),
                            product.getProductId(),
                            product.getName(),
                            product.getPrice(),
                            product.getImageUrl(),
                            item.getQuantity(),
                            item.getAddedAt()
                    );
                })
                .toList();

        return ResponseEntity.ok(response);
    }

    // Separate method for mapping entity to DTO
    private CartItemResponseDTO mapToResponseDTO(CartItem item) {
        var product = item.getProduct();
        return new CartItemResponseDTO(
                item.getCartItemId(),
                item.getUserId(),
                product.getProductId(),
                product.getName(),
                product.getPrice(),
                product.getImageUrl(),
                item.getQuantity(),
                item.getAddedAt()
        );
    }
}
