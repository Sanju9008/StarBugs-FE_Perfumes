package com.ecommerce.auth.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class CartResponse {
    private boolean success;
    private String message;
    private int cartTotalItems;
    private java.math.BigDecimal cartTotalPrice;
    private List<CartItemResponse> items;
}
