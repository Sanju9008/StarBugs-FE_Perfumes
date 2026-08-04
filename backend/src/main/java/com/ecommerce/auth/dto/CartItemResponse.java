package com.ecommerce.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItemResponse {
    private Long cartItemId;
    private Long productId;
    private String productName;
    private String productImage;
    private java.math.BigDecimal price;
    private Integer quantity;
    private java.math.BigDecimal subTotal;
}
