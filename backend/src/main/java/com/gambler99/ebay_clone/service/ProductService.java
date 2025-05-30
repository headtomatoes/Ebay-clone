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

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Creates a constructor for final fields (dependency injection)
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
        User seller = userRepository.findById(
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

    @Transactional(readOnly = true)
    public List<ProductSummaryDTO> getAllProductsExceptDraftAndInactive(Long categoryId /* accept null */){
        // If categoryId is null, fetch all products
        // If categoryId is not null, fetch products by category
        List<Product.ProductStatus> excludedStatuses = List.of(Product.ProductStatus.DRAFT, Product.ProductStatus.INACTIVE);
        List<Product> products;
        if (categoryId == null) {
            // Fetch all products except those with status DRAFT or INACTIVE
            products = productRepository.findByStatusNotIn(excludedStatuses);
        } else {
            // Fetch products by category and status not in DRAFT or INACTIVE
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));
            products = productRepository.findByCategoryAndStatusNotIn(category, excludedStatuses);
        }

        // Map each Product entity to ProductSummaryDTO
        return products.stream()
                .map(this::mapToProductSummaryDTO)
                .collect(Collectors.toList());
    }
    // Update
    @Transactional
    public ProductDetailDTO updateProduct(Long productId, ProductCreateDTO updateDTO, UserDetailsImpl sellerDetails){
        // 1. Find the existing product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        // 2. Authorization Check: Verify the user updating is the seller
        if (!Objects.equals(product.getSeller().getUserId(), sellerDetails.getUserId())) {
            throw new AccessDeniedException("User is not authorized to update this product.");
        }

        // 3. Find the new Category entity (if categoryId is provided and different)
        if (updateDTO.categoryId() != null && !Objects.equals(product.getCategory().getCategoryId(), updateDTO.categoryId())) {
            Category newCategory = categoryRepository.findById(updateDTO.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + updateDTO.categoryId()));
            product.setCategory(newCategory); // Update category relationship
        }

        // 4. Update product fields from DTO
        product.setName(updateDTO.name());
        product.setDescription(updateDTO.description());
        product.setPrice(updateDTO.price());
        product.setStockQuantity(updateDTO.stock());
        if (updateDTO.imageUrl() != null) { // Update image URL if provided
            product.setImageUrl(updateDTO.imageUrl());
        }
        // Note: createdAt is usually not updated. updatedAt should be handled automatically by JPA auditing if configured (@LastModifiedDate).

        // 5. Save the updated product (optional but good practice for clarity)
        Product updatedProduct = productRepository.save(product);

        // 6. Map the updated product to DTO and return
        return mapToProductDetailDTO(updatedProduct);
    }
    // Delete
    @Transactional
    public void deleteProduct(Long productId, UserDetailsImpl sellerDetails){
        // 1. Find the existing product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        // 2. Authorization Check: Verify the user deleting is the seller
        if (!Objects.equals(product.getSeller().getUserId(), sellerDetails.getUserId())) {
            throw new AccessDeniedException("User is not authorized to delete this product.");
        }

        // 3. Delete the product
        productRepository.delete(product);
    }

    @Transactional(readOnly = true)
    public List<ProductSummaryDTO> getProductsBySellerId(UserDetailsImpl sellerDetails) {
        // 1. Find the Seller User entity
        User seller = userRepository.findById(sellerDetails.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with ID: " + sellerDetails.getUserId()));

        // 2. Fetch products by seller
        List<Product> products = productRepository.findBySeller(seller);

        // 3. Map each Product entity to ProductSummaryDTO
        return products.stream()
                .map(this::mapToProductSummaryDTO)
                .collect(Collectors.toList());
    }

    // change the product from DRAFT to ACTIVE
    @Transactional
    public ProductDetailDTO changeProductStatus(Long productId, Product.ProductStatus status,UserDetailsImpl sellerDetails) {
        // 1. Find the existing product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
        // 2. Authorization Check: Verify the user activating is the seller
        if (!Objects.equals(product.getSeller().getUserId(), sellerDetails.getUserId())) {
            throw new AccessDeniedException("User is not authorized to activate this product.");
        }
        // 3. Change the product status to the given status except
        // ACTIVE to DRAFT
        // the product is already in the given status
        // SOLD OUT to ACTIVE if the product is the stock not refill yet
        if (product.getStatus() != status) {
            product.setStatus(status);
        } else {
            throw new IllegalStateException("Product is already in the given one.");
        }
        // 4. Save the updated product
        Product updatedProduct = productRepository.save(product);
        // 5. Map the updated product to DTO and return
        return mapToProductDetailDTO(updatedProduct);
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
                product.getStatus(),
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
                product.getCategory() != null ? product.getCategory().getName() : null,
                product.getStatus(),// Handle potential nulls
                product.getImageUrl() //update
        );
    }

    // Search
    // Implement search logic here
    public List<ProductSummaryDTO> searchProducts(String searchTerm) {
        List<Product> product = productRepository.findTop10ByNameContainingIgnoreCase(searchTerm);

        // convert Product entities to ProductSummaryDTO
        return product.stream()
                .map(this::mapToProductSummaryDTO)
                .collect(Collectors.toList());
    }
}
