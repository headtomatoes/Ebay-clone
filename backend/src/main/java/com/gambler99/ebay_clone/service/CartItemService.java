package com.gambler99.ebay_clone.service;

import com.gambler99.ebay_clone.dto.CartItemDTO;
import com.gambler99.ebay_clone.entity.CartItem;
import com.gambler99.ebay_clone.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartItemService {

    private final CartItemRepository cartItemRepository;

    /**
     * Adds a product to the user's cart. If it already exists, increases the quantity.
     */
    @Transactional
    public CartItem addItemToCart(CartItemDTO dto) {
        CartItem existingItem = cartItemRepository.findByUserIdAndProductId(dto.getUserId(), dto.getProductId());

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + dto.getQuantity());
            return cartItemRepository.save(existingItem);
        }

        CartItem newItem = CartItem.builder()
                .userId(dto.getUserId())
                .productId(dto.getProductId())
                .quantity(dto.getQuantity())
                .addedAt(LocalDateTime.now())
                .build();

        return cartItemRepository.save(newItem);
    }

    /**
     * Removes a product from the user's cart.
     */
    @Transactional
    public boolean deleteItemFromCart(Long userId, Long productId) {
        CartItem item = cartItemRepository.findByUserIdAndProductId(userId, productId);
        if (item != null) {
            cartItemRepository.delete(item);
            return true;
        }
        return false;
    }

    /**
     * Returns all cart items for a given user.
     */
    @Transactional(readOnly = true)
    public List<CartItem> getItemsByUserId(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }
}
