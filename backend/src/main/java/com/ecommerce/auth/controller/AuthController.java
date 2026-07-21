package com.ecommerce.auth.controller;

import com.ecommerce.auth.dto.AuthResponse;
import com.ecommerce.auth.dto.LoginRequest;
import com.ecommerce.auth.dto.RegisterRequest;
import com.ecommerce.auth.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ─── POST /api/auth/register ───────────────────────────────────────────────

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration attempt for email: {}", request.getEmail());
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ─── POST /api/auth/login ──────────────────────────────────────────────────

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse httpResponse
    ) {
        log.info("Login attempt for email: {}", request.getEmail());
        AuthResponse response = authService.login(request);

        // Set JWT token as HttpOnly cookie
        Cookie jwtCookie = new Cookie("jwt_token", response.getToken());
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false); // Set to true in production (HTTPS)
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(request.isRememberMe()
            ? 7 * 24 * 60 * 60    // 7 days (remember me)
            : 24 * 60 * 60        // 24 hours
        );
        httpResponse.addCookie(jwtCookie);

        return ResponseEntity.ok(response);
    }

    // ─── POST /api/auth/logout ─────────────────────────────────────────────────

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletResponse httpResponse) {
        // Clear JWT cookie
        Cookie jwtCookie = new Cookie("jwt_token", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0);
        httpResponse.addCookie(jwtCookie);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Logged out successfully."
        ));
    }

    // ─── Global Validation Error Handling ─────────────────────────────────────

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<AuthResponse> handleValidationErrors(
            org.springframework.web.bind.MethodArgumentNotValidException ex
    ) {
        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(fe -> fe.getDefaultMessage())
                .orElse("Validation failed");

        return ResponseEntity.badRequest().body(AuthResponse.error(errorMessage));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<AuthResponse> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(AuthResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<AuthResponse> handleBadCredentials(
            org.springframework.security.authentication.BadCredentialsException ex
    ) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(AuthResponse.error(ex.getMessage()));
    }
}
