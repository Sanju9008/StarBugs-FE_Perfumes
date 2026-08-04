package com.ecommerce.auth.service;

import com.ecommerce.auth.dto.AddToCartRequest;
import com.ecommerce.auth.dto.CartItemResponse;
import com.ecommerce.auth.dto.CartResponse;
import com.ecommerce.auth.entity.CartItem;
import com.ecommerce.auth.entity.Product;
import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.repository.CartItemRepository;
import com.ecommerce.auth.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Transactional
    public CartResponse addToCart(User user, AddToCartRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndProductProductId(user.getId(), product.getProductId());

        if (existingItem.isPresent()) {
            CartItem cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(cartItem);
        } else {
            CartItem newItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cartItemRepository.save(newItem);
        }

        return getCart(user);
    }

    @Transactional(readOnly = true)
    public CartResponse getCart(User user) {
        List<CartItem> items = cartItemRepository.findByUserId(user.getId());

        int totalItems = 0;
        java.math.BigDecimal totalPrice = java.math.BigDecimal.ZERO;
        
        List<CartItemResponse> itemResponses = items.stream().map(item -> {
            Product p = item.getProduct();
            String imageUrl = (p.getImages() != null && !p.getImages().isEmpty()) 
                    ? p.getImages().get(0).getImageUrl() : "https://via.placeholder.com/150?text=No+Image";
            
            java.math.BigDecimal subTotal = p.getPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity()));
            
            return CartItemResponse.builder()
                    .cartItemId(item.getId())
                    .productId(p.getProductId())
                    .productName(p.getName())
                    .productImage(imageUrl)
                    .price(p.getPrice())
                    .quantity(item.getQuantity())
                    .subTotal(subTotal)
                    .build();
        }).collect(Collectors.toList());

        for (CartItemResponse r : itemResponses) {
            totalItems += r.getQuantity();
            totalPrice = totalPrice.add(r.getSubTotal());
        }

        return CartResponse.builder()
                .success(true)
                .message("Cart fetched successfully")
                .cartTotalItems(totalItems)
                .cartTotalPrice(totalPrice)
                .items(itemResponses)
                .build();
    }

    @Transactional
    public CartResponse updateCartItemQuantity(User user, Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized to update this item");
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
        
        return getCart(user);
    }

    @Transactional
    public CartResponse removeFromCart(User user, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized to remove this item");
        }

        cartItemRepository.delete(cartItem);
        
        return getCart(user);
    }
}
