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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {
    // This class is a placeholder for the ProductService test cases.
    // It will contain unit tests to verify the functionality of the ProductService class.
    // The tests will cover various scenarios, including successful product retrieval,
    // product creation, and error handling.

    @Mock private ProductRepository productRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private ProductService productService;

    private User testSeller;
    private Category testCategory;
    private Product testProduct;
    private UserDetailsImpl testSellerDetails;

    @BeforeEach
    void setUp() {
        testSeller = User.builder().
                userId(7L).
                username("seller").
                passwordHash("$2a$10$4pwAhR4719FTFlLJIHVDl.RZ4rlktilsH5VNfhGk8gbRW45.fZtJy").
                email("seller@test.com").
                build();
        testCategory = Category.builder().categoryId(10L).name("Test Category").build();
        testProduct = Product.builder()
                .productId(100L)
                .name("Test Product")
                .description("Desc")
                .price(new BigDecimal("99.99"))
                .stockQuantity(10)
                .category(testCategory)
                .seller(testSeller)
                .createdAt(LocalDateTime.now().minusDays(1))
                .updatedAt(LocalDateTime.now())
                .build();

        // Simple mock UserDetails
        testSellerDetails = UserDetailsImpl.build(testSeller);
    }

    @Test
    void createProduct_shouldSaveAndReturnProductDetailDTO() {
        // Arrange
        ProductCreateDTO createDTO = new ProductCreateDTO(
                "New Prod",
                "New Desc",
                10L,
                new BigDecimal("10.00"),
                5,
                "https://example.com/image.jpg");

        // --- MOCK THE REPOSITORY CALLS ---
        // --- >>>> ADD THIS LINE <<<< ---
        when(userRepository.findByUsername("seller")).thenReturn(Optional.of(testSeller)); // Tell mock repo to find the user
        // --- >>>> END ADDITION <<<< ---

        when(categoryRepository.findById(10L)).thenReturn(Optional.of(testCategory));

        ArgumentCaptor<Product> productCaptor = ArgumentCaptor.forClass(Product.class);
        when(productRepository.save(productCaptor.capture())).thenAnswer(invocation -> {
            Product p = invocation.getArgument(0);
            p.setProductId(101L); // Simulate ID generation (assuming field is productId)
            p.setCreatedAt(LocalDateTime.now());
            p.setUpdatedAt(LocalDateTime.now());
            return p;
        });

        // Act
        ProductDetailDTO result = productService.createProduct(createDTO, testSellerDetails);

        // Assert
        assertNotNull(result);
        assertEquals(101L, result.productId());
        assertEquals("New Prod", result.name());
        assertEquals("Test Category", result.categoryName());
        assertEquals("seller", result.sellerUsername());

        // Verify interactions
        verify(userRepository, times(1)).findByUsername("seller"); // Verify the call was made
        verify(categoryRepository, times(1)).findById(10L);
        verify(productRepository, times(1)).save(any(Product.class));

        Product captured = productCaptor.getValue();
        assertEquals("New Prod", captured.getName());
        assertEquals(testCategory, captured.getCategory());
        assertEquals(testSeller, captured.getSeller());
    }
    @Test
    void createProduct_shouldThrowException_whenCategoryNotFound () {
        // Arrange
        ProductCreateDTO createDTO = new ProductCreateDTO(
                "New Prod",
                "New Desc",
                99L,
                new BigDecimal("10.00"),
                5,
                "https://example.com/image.jpg");
        when(userRepository.findByUsername("seller")).thenReturn(Optional.of(testSeller));
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty()); // Category not found

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            productService.createProduct(createDTO, testSellerDetails);
        });
        assertEquals("Category not found with ID: 99", exception.getMessage());
        verify(productRepository, never()).save(any()); // Ensure save was not called
    }


    @Test
    void getProductById_shouldReturnProductDetailDTO_whenFound () {
        // Arrange
        when(productRepository.findById(100L)).thenReturn(Optional.of(testProduct));

        // Act
        ProductDetailDTO result = productService.getProductById(100L);

        // Assert
        assertNotNull(result);
        assertEquals(100L, result.productId());
        assertEquals("Test Product", result.name());
        assertEquals("Test Category", result.categoryName());
        assertEquals("seller", result.sellerUsername());
        verify(productRepository, times(1)).findById(100L);
    }

    @Test
    void getProductById_shouldThrowException_whenNotFound () {
        // Arrange
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            productService.getProductById(999L);
        });
        assertEquals("Product not found with ID: 999", exception.getMessage());
        verify(productRepository, times(1)).findById(999L);
    }

    // --- Test cases for Dev 2 methods ---

    @Test
    void getAllProducts_shouldReturnAllProducts_whenCategoryIdIsNull () {
        // Arrange
        Product prod2 = Product.builder().
                productId(102L).
                name("Another").
                price(BigDecimal.ONE).
                category(testCategory).
                seller(testSeller).
                build();
        List<Product> mockProducts = List.of(testProduct, prod2);
        when(productRepository.findAll()).thenReturn(mockProducts);

        // Act
        List<ProductSummaryDTO> result = productService.getAllProducts(null);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Test Product", result.get(0).name());
        assertEquals("Another", result.get(1).name());
        verify(productRepository, times(1)).findAll();
        verify(productRepository, never()).findByCategoryCategoryId(anyLong());
    }

    @Test
    void getAllProducts_shouldReturnFilteredProducts_whenCategoryIdIsProvided () {
        // Arrange
        // Only testProduct belongs to testCategory (ID 10L)
        List<Product> mockProducts = List.of(testProduct);
        when(productRepository.findByCategoryCategoryId(10L)).thenReturn(mockProducts);

        // Act
        List<ProductSummaryDTO> result = productService.getAllProducts(10L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Product", result.get(0).name());
        assertEquals("Test Category", result.get(0).categoryName());
        verify(productRepository, times(1)).findByCategoryCategoryId(10L);
        verify(productRepository, never()).findAll();
    }

    @Test
    void getAllProducts_shouldReturnEmptyList_whenNoProductsFound () {
        // Arrange
        when(productRepository.findAll()).thenReturn(Collections.emptyList());

        // Act
        List<ProductSummaryDTO> result = productService.getAllProducts(null);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(productRepository, times(1)).findAll();
    }

    @Test
    void getAllProducts_shouldReturnEmptyList_whenNoProductsFoundForCategory () {
        // Arrange
        when(productRepository.findByCategoryCategoryId(55L)).thenReturn(Collections.emptyList());

        // Act
        List<ProductSummaryDTO> result = productService.getAllProducts(55L);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(productRepository, times(1)).findByCategoryCategoryId(55L);
    }

}
