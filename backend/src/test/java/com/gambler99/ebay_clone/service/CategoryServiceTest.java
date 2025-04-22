package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.dto.CategoryDTO;
import com.gambler99.ebay_clone.entity.Category;
import com.gambler99.ebay_clone.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {
    // Test cases for CategoryService will be implemented here.
    // This will include tests for methods like createCategory, getCategoryById, updateCategory, and deleteCategory.
    // Each test case will mock the necessary dependencies and verify the expected behavior of the service methods.

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void getAllCategories_shouldReturnListOfCategoryDTOs() {
        // Arrange
        Category cat1 = Category.builder().categoryId(1L).name("Electronics").build();
        Category cat2 = Category.builder().categoryId(2L).name("Books").build();
        List<Category> mockCategories = Arrays.asList(cat1, cat2);

        when(categoryRepository.findAll()).thenReturn(mockCategories);

        // Act
        List<CategoryDTO> result = categoryService.getAllCategories();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Electronics", result.get(0).name());
        assertEquals(1L, result.get(0).id());
        assertEquals("Books", result.get(1).name());
        assertEquals(2L, result.get(1).id());

        verify(categoryRepository, times(1)).findAll();
    }
}
