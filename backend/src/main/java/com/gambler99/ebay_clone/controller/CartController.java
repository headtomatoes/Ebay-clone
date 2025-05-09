package com.gambler99.ebay_clone.controller;

import com.gambler99.ebay_clone.dto.CartItemDTO;
import com.gambler99.ebay_clone.dto.CartRequestDTO;
import com.gambler99.ebay_clone.entity.CartItem;
import com.gambler99.ebay_clone.entity.Product;
import com.gambler99.ebay_clone.entity.Product.ProductStatus;
import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.repository.ProductRepository;
import com.gambler99.ebay_clone.repository.UserRepository;
import com.gambler99.ebay_clone.service.CartService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartController(CartService cartService, UserRepository userRepository, ProductRepository productRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    private CartItemDTO toDTO(CartItem item) {
        Product product = item.getProduct();
        return new CartItemDTO(
                product.getProductId(),
                product.getName(),
                product.getImageUrl(),
                product.getPrice().doubleValue(),
                item.getQuantity()
        );
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    //@PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getCart() {
        User user = getAuthenticatedUser();
        List<CartItemDTO> cartDTOs = cartService.getUserCart(user)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(cartDTOs);
    }

    //@PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<CartItemDTO> addToCart(@RequestBody CartRequestDTO request) {
        //  Validate quantity
        if (request.getQuantity() <= 0) {
            throw new ResponseStatusException(BAD_REQUEST, "Quantity must be greater than 0.");
        }

        User user = getAuthenticatedUser();

        //  Check if product exists
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "Product not found."));

        //  Validate product availability
        if (product.getStatus() != ProductStatus.ACTIVE) {
            throw new ResponseStatusException(BAD_REQUEST, "Product is not available.");
        }

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new ResponseStatusException(BAD_REQUEST, "Not enough stock available.");
        }

        CartItem item = cartService.addToCart(user, product, request.getQuantity());
        return ResponseEntity.ok(toDTO(item));
    }

//    @PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeFromCart(@RequestBody CartRequestDTO request) {
        User user = getAuthenticatedUser();
        cartService.removeFromCart(user, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() {
        User user = getAuthenticatedUser();
        cartService.clearCart(user);
        return ResponseEntity.ok().build();
    }
}


// package com.gambler99.ebay_clone.controller;

// import com.gambler99.ebay_clone.dto.CartItemDTO;
// import com.gambler99.ebay_clone.dto.CartRequestDTO;
// import com.gambler99.ebay_clone.entity.CartItem;
// import com.gambler99.ebay_clone.entity.Product;
// import com.gambler99.ebay_clone.entity.Product.ProductStatus;
// import com.gambler99.ebay_clone.entity.User;
// import com.gambler99.ebay_clone.repository.ProductRepository;
// import com.gambler99.ebay_clone.repository.UserRepository;
// import com.gambler99.ebay_clone.service.CartService;

// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;
// import java.util.stream.Collectors;

// @RestController
// @RequestMapping("/api/cart")
// public class CartController {

//     private final CartService cartService;
//     private final UserRepository userRepository;
//     private final ProductRepository productRepository;

//     public CartController(CartService cartService, UserRepository userRepository, ProductRepository productRepository) {
//         this.cartService = cartService;
//         this.userRepository = userRepository;
//         this.productRepository = productRepository;
//     }

//     private CartItemDTO toDTO(CartItem item) {
//         Product product = item.getProduct();
//         return new CartItemDTO(
//                 product.getProductId(),
//                 product.getName(),
//                 product.getImageUrl(),
//                 product.getPrice().doubleValue(),
//                 item.getQuantity()
//         );
//     }

//     private User getAuthenticatedUser() {
//         Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//         String username = auth.getName();
//         return userRepository.findByUsername(username)
//                 .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
//     }

//     @PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
//     @GetMapping
//     public ResponseEntity<List<CartItemDTO>> getCart() {
//         User user = getAuthenticatedUser();
//         List<CartItemDTO> cartDTOs = cartService.getUserCart(user)
//                 .stream()
//                 .map(this::toDTO)
//                 .collect(Collectors.toList());

//         return ResponseEntity.ok(cartDTOs);
//     }

//     @PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
//     @PostMapping("/add")
//     public ResponseEntity<CartItemDTO> addToCart(@RequestBody CartRequestDTO request) {
//         if (request.getQuantity() <= 0) {
//             return ResponseEntity.badRequest().build();
//         }

//         User user = getAuthenticatedUser();

//         Product product = productRepository.findById(request.getProductId())
//                 .orElseThrow(() -> new RuntimeException("Product not found"));

//         if (product.getStatus() != ProductStatus.ACTIVE || product.getStockQuantity() < request.getQuantity()) {
//             return ResponseEntity.badRequest().body(null);
//         }

//         CartItem item = cartService.addToCart(user, product, request.getQuantity());
//         return ResponseEntity.ok(toDTO(item));
//     }

//     @PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
//     @DeleteMapping("/remove")
//     public ResponseEntity<Void> removeFromCart(@RequestBody CartRequestDTO request) {
//         User user = getAuthenticatedUser();
//         cartService.removeFromCart(user, request.getProductId(), request.getQuantity());
//         return ResponseEntity.ok().build();
//     }

//     @PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
//     @DeleteMapping("/clear")
//     public ResponseEntity<Void> clearCart() {
//         User user = getAuthenticatedUser();
//         cartService.clearCart(user);
//         return ResponseEntity.ok().build();
//     }
// }
