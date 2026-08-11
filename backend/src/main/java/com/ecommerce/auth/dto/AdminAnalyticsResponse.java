package com.ecommerce.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsResponse {
    private String reportType; // DAILY, MONTHLY, YEARLY, OVERALL
    private String period;     // e.g. "2026-08-04", "August 2026", "2026", "All Time"
    private BigDecimal totalRevenue;
    private long totalOrders;
    private long totalProducts;
    private long totalUsers;
    private BigDecimal averageOrderValue;
    private List<OrderSummary> orderSummaries;
    private List<LowStockProduct> lowStockProducts;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderSummary {
        private String orderId;
        private String userName;
        private String userEmail;
        private BigDecimal totalAmount;
        private String status;
        private String date;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LowStockProduct {
        private Long productId;
        private String name;
        private Integer stock;
        private BigDecimal price;
        private String category;
    }
}
