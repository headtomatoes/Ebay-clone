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

@Service
@Transactional
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepo;
    private final ProductRepository productRepo;

    public CartServiceImpl(CartItemRepository cartItemRepo, ProductRepository productRepo) {
        this.cartItemRepo = cartItemRepo;
        this.productRepo = productRepo;
    }

    // Retrieves the list of items in the user's cart.
    @Override
    public List<CartItem> getUserCart(User user) {
        return cartItemRepo.findByUser(user);
    }

    // Adds a product to the user's cart, or updates the quantity if it already exists.
    @Override
    public CartItem addToCart(User user, Product product, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0.");
        }

        if (product.getStockQuantity() < quantity) {
            throw new IllegalArgumentException("Not enough stock available for product: " + product.getName());
        }

        Optional<CartItem> existingItem = cartItemRepo.findByUserAndProduct(user, product);
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + quantity;

            if (product.getStockQuantity() < newQuantity) {
                throw new IllegalArgumentException("Not enough stock available for product: " + product.getName());
            }

            item.setQuantity(newQuantity);
            return cartItemRepo.save(item);
        }

        CartItem newItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(quantity)
                .build();

        return cartItemRepo.save(newItem);
    }


    //Removes a specific product from the user's cart.
    @Override
    public void removeFromCart(User user, Long productId) {
        productRepo.findById(productId).ifPresent(product -> {
            cartItemRepo.findByUserAndProduct(user, product).ifPresent(cartItemRepo::delete);
        });
    }


    //Clears all items from the user's cart.
    @Override
    public void clearCart(User user) {
        cartItemRepo.deleteByUser(user);
    }


    // Handles inventory update and cart adjustments after a product is purchased.
    @Override
    public void handleProductPurchase(Product product, int quantityPurchased) {
        if (product.getStockQuantity() >= quantityPurchased) {
            product.setStockQuantity(product.getStockQuantity() - quantityPurchased);
            productRepo.save(product);

            if (product.getStockQuantity() == 0) {
                notifyUsersOutOfStock(product);
            }

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


    //Sends a notification to a user that the product quantity in their cart has been adjusted.
    private void notifyUserOfStockUpdate(User user, Product product) {
        System.out.println("Notification: User " + user.getUsername() +
                ", the stock of product " + product.getName() +
                " has been updated in your cart due to low stock.");
    }


    // Notifies all users who have a product in their cart that it is now out of stock
    private void notifyUsersOutOfStock(Product product) {
        List<CartItem> cartItems = cartItemRepo.findByProduct(product);
        for (CartItem cartItem : cartItems) {
            sendOutOfStockNotification(cartItem.getUser(), product);
        }
    }

    // Sends an out-of-stock notification to a specific user.
    private void sendOutOfStockNotification(User user, Product product) {
        System.out.println("Notification: User " + user.getUsername() +
                ", the product " + product.getName() + " is now out of stock.");
    }


    //Adjusts cart quantities if the product stock has decreased.
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
