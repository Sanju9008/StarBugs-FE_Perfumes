package com.ecommerce.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUpdateUserRequest {
    private String username;
    private String email;
    private String password;
    private String role; // e.g. "ADMIN", "USER", "CUSTOMER"
    private String profilePhoto;
}
