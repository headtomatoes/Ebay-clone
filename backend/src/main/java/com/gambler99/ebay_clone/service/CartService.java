package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.entity.CartItem;
import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.entity.Product;

import java.util.List;

public interface CartService {

    // Retrieves all items currently in the user's shopping cart.
    List<CartItem> getUserCart(User user);

    // Adds a quantity of a product to the user's shopping cart.
    // If the product is already in the cart, the quantity is updated.
    CartItem addToCart(User user, Product product, int quantity);

    // Removes a specific product from the user's shopping cart.
    void removeFromCart(User user, Long productId);

    // Clears all items from the user's shopping cart.
    void clearCart(User user);

    // This will handle a product purchase (to adjust stock and cart items)
    void handleProductPurchase(Product product, int quantityPurchased);
}
