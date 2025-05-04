package com.gambler99.ebay_clone.controller;

import com.gambler99.ebay_clone.dto.ProductCreateDTO;
import com.gambler99.ebay_clone.dto.ProductDetailDTO;
import com.gambler99.ebay_clone.dto.ProductSummaryDTO;
import com.gambler99.ebay_clone.entity.Product;
import com.gambler99.ebay_clone.security.UserDetailsImpl;
import com.gambler99.ebay_clone.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/public/products") // Base URL for product-related endpoints
@RequiredArgsConstructor
// Consider adding @CrossOrigin here or using global WebConfig (as discussed previously)
 // @CrossOrigin(origins = "http://localhost:5173") // Example for REACT localhost
// ProductController is responsible for handling product-related requests.
public class ProductController {

    private final ProductService productService;

    // Add methods to handle product-related operations (CRUD, search, etc.)
    // createProduct, getProductById, updateProduct, deleteProduct, etc.

    @PostMapping
    @PreAuthorize("hasRole('SELLER')") // Only users with the 'SELLER' role can Create products
    public ResponseEntity<ProductDetailDTO> createProduct(
            @Valid @RequestBody ProductCreateDTO createDTO,
            @AuthenticationPrincipal UserDetailsImpl sellerDetails) // Inject the authenticated user
    {
        // The @Valid annotation triggers validation for ProductCreateDTO fields.
        // Similar to signup, handle validation exceptions globally.
        if (sellerDetails == null) {
            // Should not happen if PreAuthorize works, but good practice
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        // Delegate the product creation logic to the ProductService
        ProductDetailDTO createdProduct = productService.createProduct(createDTO, sellerDetails);

        // Build location URI for the newly created product
        // The URI is constructed using the current request's URI and the product ID
        // This URI can be used to retrieve the created product later
        // URI: /api/products/{id}
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdProduct.productId())
                .toUri();

        // Return the created product and its location in the response
        return ResponseEntity.created(location).body(createdProduct);
    }

    // Add other CRUD methods (getProductById, updateProduct, deleteProduct) here
    // --- READ (Single) ---
    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailDTO> getProductById(@PathVariable Long id) {
        ProductDetailDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product); // Return 200 OK
    }

    // --- READ (All/Filtered) ---
    @GetMapping
    public ResponseEntity<List<ProductSummaryDTO>> getAllProducts(
            @RequestParam(required = false) Long categoryId // Optional category filter
    ) {
        List<ProductSummaryDTO> products = productService.getAllProducts(categoryId);
        return ResponseEntity.ok(products); // Return 200 OK
    }

    // --- UPDATE ---
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')") // Ensure only sellers can attempt update
    public ResponseEntity<ProductDetailDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductCreateDTO updateDTO,
            @AuthenticationPrincipal UserDetailsImpl sellerDetails)
    {
        if (sellerDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        // Delegate update logic AND authorization check (is this user the owner?) to the service
        ProductDetailDTO updatedProduct = productService.updateProduct(id, updateDTO, sellerDetails);
        return ResponseEntity.ok(updatedProduct); // Return 200 OK with updated product
    }

    // --- DELETE ---
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')") // Ensure only sellers can attempt delete
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl sellerDetails)
    {
        if (sellerDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        // Delegate delete logic AND authorization check (is this user the owner?) to the service
        productService.deleteProduct(id, sellerDetails);
        return ResponseEntity.noContent().build(); // Return 204 No Content
    }

    // --- SEARCH ---
    @GetMapping("/search")
    public ResponseEntity<List<ProductSummaryDTO>> searchProducts(
            @RequestParam String query) {
        if(query == null || query.isEmpty()) {
            return ResponseEntity.badRequest().build(); // Return 400 Bad Request if query is empty
        }

        List<ProductSummaryDTO> products = productService.searchProducts(query);
        return ResponseEntity.ok(products); // Return 200 OK with search results
    }
}
