package com.ecommerce.auth.controller;

import com.ecommerce.auth.dto.AuthResponse;
import com.ecommerce.auth.dto.UpdateUserRequest;
import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    // ─── GET /api/users/me ─────────────────────────────────────────────────────
    /**
     * Get the currently authenticated user's profile.
     */
    @GetMapping("/me")
    public ResponseEntity<AuthResponse.UserInfo> getCurrentUser(
            @AuthenticationPrincipal User currentUser
    ) {
        log.info("Fetching profile for user: {}", currentUser.getEmail());
        return ResponseEntity.ok(authService.getUserById(currentUser.getId()));
    }

    // ─── GET /api/users/{id} ───────────────────────────────────────────────────
    /**
     * Get a user by ID. Admins can view any user; regular users can only view themselves.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AuthResponse.UserInfo> getUserById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        // Allow access if admin or own profile
        if (!currentUser.getRole().equals(User.Role.ADMIN) && !currentUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(authService.getUserById(id));
    }

    // ─── GET /api/users ────────────────────────────────────────────────────────
    /**
     * Get all users. Admin only.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuthResponse.UserInfo>> getAllUsers() {
        log.info("Fetching all users (admin)");
        return ResponseEntity.ok(authService.getAllUsers());
    }

    // ─── PUT /api/users/{id} ───────────────────────────────────────────────────
    /**
     * Update a user's profile. Users can only update their own profile.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AuthResponse.UserInfo> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        if (!currentUser.getRole().equals(User.Role.ADMIN) && !currentUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        log.info("Updating user with ID: {}", id);
        return ResponseEntity.ok(authService.updateUser(id, request));
    }

    // ─── DELETE /api/users/{id} ────────────────────────────────────────────────
    /**
     * Soft-delete a user. Admins can delete any user; users can delete their own account.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        if (!currentUser.getRole().equals(User.Role.ADMIN) && !currentUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        log.info("Soft-deleting user with ID: {}", id);
        authService.deleteUser(id);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "User account deleted successfully."
        ));
    }

    // ─── Exception Handlers ────────────────────────────────────────────────────

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", ex.getMessage()));
    }
}
