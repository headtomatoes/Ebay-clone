package com.gambler99.ebay_clone.controller;

import com.gambler99.ebay_clone.dto.CategoryDTO;
import com.gambler99.ebay_clone.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/categories")
@RequiredArgsConstructor
// @CrossOrigin(origins = "http://localhost:5173") // Example
public class CategoryController {

    private final CategoryService categoryService;
    // Add methods to handle category-related operations (CRUD, etc.)

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        // Fetch all categories from the service
        List<CategoryDTO> categories = categoryService.getAllCategories();

        // Return the list of categories with a 200 OK status
        return ResponseEntity.ok(categories);
    }

    // Potential future endpoints for Category CRUD (if needed and authorized):
    // @PostMapping @PreAuthorize("hasRole('ADMIN')")
    // public ResponseEntity<CategoryDTO> createCategory(...) { ... }

    // @GetMapping("/{id}")
    // public ResponseEntity<CategoryDTO> getCategoryById(...) { ... }

    // @PutMapping("/{id}") @PreAuthorize("hasRole('ADMIN')")
    // public ResponseEntity<CategoryDTO> updateCategory(...) { ... }

    // @DeleteMapping("/{id}") @PreAuthorize("hasRole('ADMIN')")
    // public ResponseEntity<Void> deleteCategory(...) { ... }
}
