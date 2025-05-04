package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.entity.CartItem;
import com.gambler99.ebay_clone.entity.Product;
import com.gambler99.ebay_clone.entity.User;
import com.gambler99.ebay_clone.repository.CartItemRepository;
import com.gambler99.ebay_clone.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service class for handling shopping cart functionality like
 * adding/removing items, updating quantities, and adjusting stock.
 */
@Service
@Transactional
public class CartService {

    private final CartItemRepository cartItemRepo;
    private final ProductRepository productRepo;

    public CartService(CartItemRepository cartItemRepo, ProductRepository productRepo) {
        this.cartItemRepo = cartItemRepo;
        this.productRepo = productRepo;
    }

    /**
     * Retrieves all items currently in the user's cart.
     */
    public List<CartItem> getUserCart(User user) {
        return cartItemRepo.findByUser(user);
    }

    /**
     * Adds a product to the user's cart.
     * If it already exists, the quantity is updated.
     * Validates quantity and stock availability.
     */
    public CartItem addToCart(User user, Product product, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0.");
        }

        if (product.getStockQuantity() < quantity) {
            throw new IllegalArgumentException("Not enough stock available for product: " + product.getName());
        }

        // Check if product is already in cart
        Optional<CartItem> existingItem = cartItemRepo.findByUserAndProduct(user, product);
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + quantity;

            // Check if new quantity exceeds stock
            if (product.getStockQuantity() < newQuantity) {
                throw new IllegalArgumentException("Not enough stock available for product: " + product.getName());
            }

            item.setQuantity(newQuantity);
            return cartItemRepo.save(item);
        }

        // Add as new cart item
        CartItem newItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(quantity)
                .build();

        return cartItemRepo.save(newItem);
    }

    /**
     * Removes a specific product from the user's cart.
     */
    public void removeFromCart(User user, Long productId, int quantityToRemove) {
        if (quantityToRemove <= 0) {
            throw new IllegalArgumentException("Quantity to remove must be greater than 0.");
        }

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepo.findByUserAndProduct(user, product)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        int newQuantity = cartItem.getQuantity() - quantityToRemove;

        if (newQuantity > 0) {
            cartItem.setQuantity(newQuantity);
            cartItemRepo.save(cartItem);
        } else {
            cartItemRepo.delete(cartItem);
        }
    }

    /**
     * Clears all items from the user's cart.
     */
    public void clearCart(User user) {
        cartItemRepo.deleteByUser(user);
    }

    /**
     * Handles the purchase of a product:
     * - Decreases stock
     * - Notifies users if stock runs out
     * - Adjusts cart quantities if needed
     */
    public void handleProductPurchase(Product product, int quantityPurchased) {
        if (product.getStockQuantity() >= quantityPurchased) {
            // Reduce stock
            product.setStockQuantity(product.getStockQuantity() - quantityPurchased);
            productRepo.save(product);

            // Notify if stock is 0
            if (product.getStockQuantity() == 0) {
                notifyUsersOutOfStock(product);
            }

            // Adjust user cart quantities if needed
            List<CartItem> cartItems = cartItemRepo.findByProduct(product);
            for (CartItem cartItem : cartItems) {
                if (cartItem.getQuantity() > product.getStockQuantity()) {
                    cartItem.setQuantity(product.getStockQuantity());
                    cartItemRepo.save(cartItem);
                    notifyUserOfStockUpdate(cartItem.getUser(), product);
                }
            }
        } else {
            throw new IllegalArgumentException("Not enough stock for product: " + product.getName());
        }
    }

    /**
     * Notifies a user that the quantity in their cart was reduced due to low stock.
     */
    private void notifyUserOfStockUpdate(User user, Product product) {
        System.out.println("Notification: User " + user.getUsername() +
                ", the stock of product " + product.getName() +
                " has been updated in your cart due to low stock.");
    }

    /**
     * Notifies all users who had a product in their cart that it's now out of stock.
     */
    private void notifyUsersOutOfStock(Product product) {
        List<CartItem> cartItems = cartItemRepo.findByProduct(product);
        for (CartItem cartItem : cartItems) {
            sendOutOfStockNotification(cartItem.getUser(), product);
        }
    }

    /**
     * Sends an "out of stock" notification to a user (prints to console).
     */
    private void sendOutOfStockNotification(User user, Product product) {
        System.out.println("Notification: User " + user.getUsername() +
                ", the product " + product.getName() + " is now out of stock.");
    }

    /**
     * Adjusts cart quantities if stock is reduced below cart quantity.
     * (Currently unused, but helpful for batch stock updates.)
     */
    private void adjustCartQuantitiesIfNeeded(Product product) {
        List<CartItem> cartItems = cartItemRepo.findByProduct(product);
        for (CartItem cartItem : cartItems) {
            if (cartItem.getQuantity() > product.getStockQuantity()) {
                cartItem.setQuantity(product.getStockQuantity());
                cartItemRepo.save(cartItem);
            }
        }
    }
}