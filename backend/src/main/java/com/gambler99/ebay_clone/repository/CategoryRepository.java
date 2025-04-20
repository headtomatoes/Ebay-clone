package com.gambler99.ebay_clone.repository;

import com.gambler99.ebay_clone.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Find all categories with a specific parent
    List<Category> findByParentCategory(Category parentCategory);

    // Find categories that don't have a parent (i.e., top-level categories)
    List<Category> findByParentCategoryIsNull();

    // Find category by name
    Category findByName(String name);

    // Optional: Search categories containing part of a name
    List<Category> findByNameContainingIgnoreCase(String namePart);
}

