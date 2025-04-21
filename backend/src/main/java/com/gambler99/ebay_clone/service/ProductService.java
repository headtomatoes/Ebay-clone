package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.dto.ProductCreateDTO;
import com.gambler99.ebay_clone.dto.ProductDetailDTO;
import com.gambler99.ebay_clone.dto.ProductSummaryDTO;
import com.gambler99.ebay_clone.entity.Category;
import com.gambler99.ebay_clone.entity.Product;
import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.exception.ResourceNotFoundException;
import com.gambler99.ebay_clone.repository.CategoryRepository;
import com.gambler99.ebay_clone.repository.ProductRepository;
import com.gambler99.ebay_clone.repository.UserRepository;
import com.gambler99.ebay_clone.security.UserDetailsImpl;


import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Creates constructor for final fields (dependency injection)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository; // Inject UserRepository

    // CRUD operations for products

    // Create
    @Transactional // Ensure the atomicity of the operation
    // Atomicity: All or nothing. If one part fails, the whole transaction fails.
    public ProductDetailDTO createProduct(ProductCreateDTO createDTO, UserDetailsImpl sellerDetails){
        // 1. Find the Seller User entity
        // Extract seller from UserDetails by using userId
        User seller = userRepository.findByUserId(
                sellerDetails.getUserId()).
                orElseThrow(() -> new ResourceNotFoundException(
                        "Seller not found with UserId: "
                        + sellerDetails.getUserId() + " and username: " + sellerDetails.getUsername()));
        // 2. Find the Category entity
        // fetch the category to which the product belongs to
        Category category = categoryRepository.findById(
                createDTO.categoryId()).
                orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with ID: "
                        + createDTO.categoryId()));

        // 3. Create and map the Product entity
        // create the product based on the given DTO and sellerId
        // set the category to the initialized product
        // set the seller to the initialized product
        Product product = Product.builder()
                .name(createDTO.name())
                .description(createDTO.description())
                .price(createDTO.price())
                .stockQuantity(createDTO.stock())
                .category(category) // Set relationship
                .seller(seller)     // Set relationship
                .build();

        // 4. Save the product to the database
        Product savedProduct = productRepository.save(product);

        // %.map the saved product to ProductDetailDTO and return it
        return mapToProductDetailDTO(savedProduct);
    }


    // Read
    @Transactional(readOnly = true)// Read-only transaction
    public ProductDetailDTO getProductById(Long productId){
        Product product = productRepository.findById(productId).
                orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with ID: "
                        + productId));
        return mapToProductDetailDTO(product);
    }

    public List<ProductSummaryDTO> getAllProducts(Long categoryId /* accept null */){
        // If categoryId is null, fetch all products
        // If categoryId is not null, fetch products by category
        List<Product> products;
        if (categoryId == null) {
            products = productRepository.findAll();
        } else {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Category not found with ID: "
                                    + categoryId));
            products = productRepository.findByCategory(category);
        }

        // Map each Product entity to ProductSummaryDTO
        return products.stream()
                .map(this::mapToProductSummaryDTO)
                .collect(Collectors.toList());
    }
    // Update
    public ProductDetailDTO updateProduct(Long id, ProductCreateDTO updateDTO, UserDetails sellerDetails){

        return null;
    }
    // Delete
    public void deleteProduct(Long id, UserDetails sellerDetails){
        // Implement delete logic
    }

    // Helper method for mapping method
    // This method is used to mapping Product entity into ProductDetailDTO
    private ProductDetailDTO mapToProductDetailDTO(Product product) {
        return new ProductDetailDTO(
                product.getProductId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStockQuantity(),
                product.getCreatedAt(),
                product.getUpdatedAt(),
                product.getCategory() != null ? product.getCategory().getName() : null, // Handle potential nulls
                product.getSeller() != null ? product.getSeller().getUsername() : null, // Handle potential nulls
                product.getImageUrl()
        );
    }

    // This method is used to mapping Product entity into ProductSummaryDTO
    private ProductSummaryDTO mapToProductSummaryDTO(Product product) {
        return new ProductSummaryDTO(
                product.getProductId(),
                product.getName(),
                product.getPrice(),
                product.getCategory() != null ? product.getCategory().getName() : null // Handle potential nulls
        );
    }

}
