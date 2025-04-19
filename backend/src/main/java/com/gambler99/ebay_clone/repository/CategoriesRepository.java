package com.gambler99.ebay_clone.repository;

import com.gambler99.ebay_clone.entity.categories;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoriesRepository extends JpaRepository<categories, Long> {

/**
 * Finds a category by its unique name.

 */

    Optional<categories> findByName(String name);

    /* Checks if a category with the given name exists.*/
    boolean existsByName(String name);
}
