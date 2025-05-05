package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.dto.CategoryDTO;
import com.gambler99.ebay_clone.entity.Category;
import com.gambler99.ebay_clone.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // basic CRUD operations for categories
    // Read all categories
    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        // Fetch all categories from the repository
        List<Category> categories = categoryRepository.findAll();

        // Map each Category entity to CategoryDTO
        return categories.stream()
                .map(this::mapToCategoryDTO)
                .toList();
    }

    private CategoryDTO mapToCategoryDTO(Category category) {
        return new CategoryDTO(category.getCategoryId(), category.getName());
    }

    // Optional: Add create/update/delete methods later if needed (likely admin-only)
}
