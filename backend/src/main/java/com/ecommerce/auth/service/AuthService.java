package com.ecommerce.auth.service;

import com.ecommerce.auth.dto.*;
import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.repository.UserRepository;
import com.ecommerce.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    // ─── Register ─────────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check email uniqueness
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered. Please use a different email.");
        }

        // Check password match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and confirm password do not match.");
        }

        // Build and save user
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail().toLowerCase().trim())
                .mobileNumber(request.getMobileNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("New user registered: {}", savedUser.getEmail());

        return AuthResponse.builder()
                .success(true)
                .message("Registration successful! Please login to continue.")
                .build();
    }

    // ─── Login ────────────────────────────────────────────────────────────────

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail().toLowerCase().trim(),
                    request.getPassword()
                )
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid email or password.");
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Authentication failed: " + e.getMessage());
        }

        User user = userRepository.findByEmailAndIsActiveTrue(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new BadCredentialsException("User account not found or inactive."));

        String token = jwtUtil.generateToken(user, request.isRememberMe());
        log.info("User logged in: {}", user.getEmail());

        return AuthResponse.success(
            "Login successful! Welcome back, " + user.getFullName() + "!",
            token,
            mapToUserInfo(user)
        );
    }

    // ─── Get User by ID ───────────────────────────────────────────────────────

    public AuthResponse.UserInfo getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));
        return mapToUserInfo(user);
    }

    // ─── Get All Users ────────────────────────────────────────────────────────

    public List<AuthResponse.UserInfo> getAllUsers() {
        return userRepository.findAllByIsActiveTrue()
                .stream()
                .map(this::mapToUserInfo)
                .collect(Collectors.toList());
    }

    // ─── Update User ──────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse.UserInfo updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));

        user.setFullName(request.getFullName());
        user.setMobileNumber(request.getMobileNumber());

        User updatedUser = userRepository.save(user);
        log.info("User updated: {}", updatedUser.getEmail());
        return mapToUserInfo(updatedUser);
    }

    // ─── Delete User ──────────────────────────────────────────────────────────

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));
        // Soft delete
        user.setActive(false);
        userRepository.save(user);
        log.info("User soft-deleted: {}", user.getEmail());
    }

    // ─── Helper ───────────────────────────────────────────────────────────────

    private AuthResponse.UserInfo mapToUserInfo(User user) {
        return AuthResponse.UserInfo.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .mobileNumber(user.getMobileNumber())
                .role(user.getRole().name())
                .build();
    }
}
