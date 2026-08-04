package com.ecommerce.auth.service;

import com.ecommerce.auth.dto.*;
import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.repository.UserRepository;
import com.ecommerce.auth.entity.VerificationToken;
import com.ecommerce.auth.repository.VerificationTokenRepository;
import com.ecommerce.auth.entity.JwtToken;
import com.ecommerce.auth.repository.JwtTokenRepository;
import com.ecommerce.auth.util.JwtUtil;
import java.time.ZoneId;
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
    private final VerificationTokenRepository tokenRepository;
    private final JwtTokenRepository jwtTokenRepository;
    private final EmailService emailService;

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
                .username(request.getUsername())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .build();

        User savedUser = userRepository.save(user);
        log.info("New user registered: {}", savedUser.getEmail());

        return AuthResponse.builder()
                .success(true)
                .message("Registration successful!")
                .build();
    }

    // ─── Verify Email ─────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse verifyEmail(String token) {
        VerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification token."));

        if (verificationToken.isExpired()) {
            throw new IllegalArgumentException("Verification token has expired.");
        }

        // Optional: Delete the token after successful verification
        tokenRepository.delete(verificationToken);

        return AuthResponse.builder()
                .success(true)
                .message("Email verified successfully! You can now login.")
                .build();
    }

    // ─── Login ────────────────────────────────────────────────────────────────

    @Transactional
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

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new BadCredentialsException("User account not found."));

        // Invalidate previous tokens for the user
        List<JwtToken> existingTokens = jwtTokenRepository.findAllByUser(user);
        if (!existingTokens.isEmpty()) {
            jwtTokenRepository.deleteAll(existingTokens);
        }

        String token = jwtUtil.generateToken(user, request.isRememberMe());
        
        JwtToken jwtToken = JwtToken.builder()
                .user(user)
                .token(token)
                .expiresAt(jwtUtil.extractExpiration(token).toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime())
                .build();
        jwtTokenRepository.save(jwtToken);
        
        log.info("User logged in: {}", user.getEmail());

        return AuthResponse.success(
            "Login successful! Welcome back, " + user.getActualUsername() + "!",
            token,
            mapToUserInfo(user)
        );
    }

    // ─── Logout ───────────────────────────────────────────────────────────────

    @Transactional
    public void logout(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            List<JwtToken> existingTokens = jwtTokenRepository.findAllByUser(user);
            if (!existingTokens.isEmpty()) {
                jwtTokenRepository.deleteAll(existingTokens);
                log.info("Deleted {} tokens for user {}", existingTokens.size(), email);
            }
        });
    }

    // ─── Get User by ID ───────────────────────────────────────────────────────

    public AuthResponse.UserInfo getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));
        return mapToUserInfo(user);
    }

    // ─── Get All Users ────────────────────────────────────────────────────────

    public List<AuthResponse.UserInfo> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToUserInfo)
                .collect(Collectors.toList());
    }

    // ─── Update User ──────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse.UserInfo updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));

        if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
            user.setUsername(request.getUsername());
        }

        if (request.getProfilePhoto() != null) {
            user.setProfilePhoto(request.getProfilePhoto());
        }

        User updatedUser = userRepository.save(user);
        log.info("User updated: {}", updatedUser.getEmail());
        return mapToUserInfo(updatedUser);
    }

    // ─── Delete User ──────────────────────────────────────────────────────────

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));
        // Hard delete
        userRepository.delete(user);
        log.info("User deleted: {}", user.getEmail());
    }

    // ─── Helper ───────────────────────────────────────────────────────────────

    private AuthResponse.UserInfo mapToUserInfo(User user) {
        return AuthResponse.UserInfo.builder()
                .id(user.getId())
                .username(user.getActualUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .profilePhoto(user.getProfilePhoto())
                .build();
    }
}
