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
        // Because the 'product' entity is managed within the @Transactional context,
        // Hibernate will automatically detect changes and flush them to the DB on commit.
        // However, explicitly calling save can sometimes be clearer or needed for certain cascade operations.
        Product updatedProduct = productRepository.save(product);

        // 6. Map the updated product to DTO and return
        return mapToProductDetailDTO(updatedProduct);
    }
    /**
     * Deletes a product if the requesting user is the product's seller.
     *
     * @param productId the ID of the product to delete
     * @param sellerDetails the authenticated user's details
     * @throws ResourceNotFoundException if the product does not exist
     * @throws AccessDeniedException if the user is not authorized to delete the product
     */
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
        // Alternatively: productRepository.deleteById(productId); - less safe as it doesn't guarantee ownership check happened first.
    }

    /**
     * Retrieves a list of product summaries for all products associated with the specified seller.
     *
     * @param sellerDetails the authenticated seller's user details
     * @return a list of product summary DTOs for the seller's products
     * @throws ResourceNotFoundException if the seller user is not found
     */
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
    // Helper method for mapping method
    /**
     * Converts a Product entity to a ProductDetailDTO, including category and seller information.
     *
     * @param product the Product entity to convert
     * @return a ProductDetailDTO containing detailed product information, or null values for category and seller if not present
     */
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
                product.getCategory() != null ? product.getCategory().getName() : null, // Handle potential nulls
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
