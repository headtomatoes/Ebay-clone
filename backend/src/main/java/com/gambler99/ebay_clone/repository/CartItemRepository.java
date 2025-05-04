package com.gambler99.ebay_clone.repository;

import com.gambler99.ebay_clone.entity.CartItem;
import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Retrieves all cart items for a given user.
    List<CartItem> findByUser(User user);

    // Retrieves a specific cart item based on user and product.
    Optional<CartItem> findByUserAndProduct(User user, Product product);

    // Deletes all cart items belonging to a specific user.
    void deleteByUser(User user);

    // Deletes a specific cart item based on user and product.
    void deleteByUserAndProduct(User user, Product product);

    // Retrieves all cart items that contain a specific product.
    List<CartItem> findByProduct(Product product);

    // Retrieves all cart items for a user by user ID.
    List<CartItem> findByUserUserId(Long userId);
}

// package com.gambler99.ebay_clone.repository;

// import com.gambler99.ebay_clone.entity.CartItem;
// import com.gambler99.ebay_clone.entity.User;
// import com.gambler99.ebay_clone.entity.Product;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

// import java.util.List;
// import java.util.Optional;

// @Repository
// public interface CartItemRepository extends JpaRepository<CartItem, Long> {

//     //Retrieves all cart items for a given user.
//     List<CartItem> findByUser(User user);


//     // Retrieves a specific cart item based on user and product.
//     Optional<CartItem> findByUserAndProduct(User user, Product product);


//     //Deletes all cart items belonging to a specific user.
//     void deleteByUser(User user);


//     //Deletes a specific cart item based on user and product.
//     void deleteByUserAndProduct(User user, Product product);


//     // Use for stock updates or notifications.
//     //Retrieves all cart items that contain a specific product
//     List<CartItem> findByProduct(Product product);

//     List<CartItem> findByUserUserId(Long userId);
//     // void deleteOrder(Long orderId, Long userId); // Delete order if status is PENDING_PAYMENT
// }