package com.ecommerce.auth.service;

import com.ecommerce.auth.entity.JwtToken;
import com.ecommerce.auth.repository.JwtTokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {

    private final JwtTokenRepository jwtTokenRepository;

    @Override
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        String jwt = null;
        final String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
        } else if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("jwt_token".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        if (jwt != null && !jwt.trim().isEmpty()) {
            JwtToken storedToken = jwtTokenRepository.findByToken(jwt).orElse(null);
            if (storedToken != null) {
                if (storedToken.getUser() != null) {
                    jwtTokenRepository.deleteAll(jwtTokenRepository.findAllByUser(storedToken.getUser()));
                } else {
                    jwtTokenRepository.delete(storedToken);
                }
            }
        }

        // Clear Cookie in HTTP response with Max-Age 0
        jakarta.servlet.http.Cookie emptyCookie = new jakarta.servlet.http.Cookie("jwt_token", "");
        emptyCookie.setPath("/");
        emptyCookie.setMaxAge(0);
        emptyCookie.setHttpOnly(true);
        response.addCookie(emptyCookie);
        response.setHeader("Set-Cookie", "jwt_token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax");
    }
}
