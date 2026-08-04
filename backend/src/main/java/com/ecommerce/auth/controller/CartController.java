package com.ecommerce.auth.controller;

import com.ecommerce.auth.dto.AddToCartRequest;
import com.ecommerce.auth.dto.CartResponse;
import com.ecommerce.auth.dto.UpdateCartRequest;
import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.repository.UserRepository;
import com.ecommerce.auth.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(@Valid @RequestBody AddToCartRequest request) {
        User user = getAuthenticatedUser();
        CartResponse response = cartService.addToCart(user, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart() {
        User user = getAuthenticatedUser();
        CartResponse response = cartService.getCart(user);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartResponse> updateQuantity(
            @PathVariable Long cartItemId,
            @Valid @RequestBody UpdateCartRequest request
    ) {
        User user = getAuthenticatedUser();
        CartResponse response = cartService.updateCartItemQuantity(user, cartItemId, request.getQuantity());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<CartResponse> removeFromCart(@PathVariable Long cartItemId) {
        User user = getAuthenticatedUser();
        CartResponse response = cartService.removeFromCart(user, cartItemId);
        return ResponseEntity.ok(response);
    }
}
