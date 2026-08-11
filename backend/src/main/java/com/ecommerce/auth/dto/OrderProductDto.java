package com.ecommerce.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderProductDto {
    @JsonProperty("order_id")
    private String orderId;

    @JsonProperty("product_id")
    private Integer productId;

    private String name;

    private String description;

    private Integer quantity;

    @JsonProperty("price_per_unit")
    private BigDecimal pricePerUnit;

    @JsonProperty("total_price")
    private BigDecimal totalPrice;

    @JsonProperty("image_url")
    private String imageUrl;

    @JsonProperty("status")
    private String status;

    @JsonProperty("date")
    private String date;
}
