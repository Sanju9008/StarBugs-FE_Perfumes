package com.ecommerce.auth.service;

import com.ecommerce.auth.dto.AdminAnalyticsResponse;
import com.ecommerce.auth.entity.Order;
import com.ecommerce.auth.entity.OrderStatus;
import com.ecommerce.auth.repository.OrderRepository;
import com.ecommerce.auth.repository.ProductRepository;
import com.ecommerce.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AdminAnalyticsService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    // ─── Daily Revenue ────────────────────────────────────────────────────────
    public AdminAnalyticsResponse getDailyAnalytics(LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        List<Order> allOrders = orderRepository.findAll();
        List<Order> filteredOrders = allOrders.stream()
                .filter(o -> o.getCreatedAt() != null &&
                        !o.getCreatedAt().isBefore(startOfDay) &&
                        !o.getCreatedAt().isAfter(endOfDay))
                .collect(Collectors.toList());

        return buildAnalyticsResponse("DAILY", date.toString(), filteredOrders);
    }

    // ─── Monthly Revenue ──────────────────────────────────────────────────────
    public AdminAnalyticsResponse getMonthlyAnalytics(int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startOfMonth = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = yearMonth.atEndOfMonth().atTime(LocalTime.MAX);

        List<Order> allOrders = orderRepository.findAll();
        List<Order> filteredOrders = allOrders.stream()
                .filter(o -> o.getCreatedAt() != null &&
                        !o.getCreatedAt().isBefore(startOfMonth) &&
                        !o.getCreatedAt().isAfter(endOfMonth))
                .collect(Collectors.toList());

        String periodStr = yearMonth.getMonth().name() + " " + year;
        return buildAnalyticsResponse("MONTHLY", periodStr, filteredOrders);
    }

    // ─── Yearly Revenue ───────────────────────────────────────────────────────
    public AdminAnalyticsResponse getYearlyAnalytics(int year) {
        LocalDateTime startOfYear = LocalDate.of(year, 1, 1).atStartOfDay();
        LocalDateTime endOfYear = LocalDate.of(year, 12, 31).atTime(LocalTime.MAX);

        List<Order> allOrders = orderRepository.findAll();
        List<Order> filteredOrders = allOrders.stream()
                .filter(o -> o.getCreatedAt() != null &&
                        !o.getCreatedAt().isBefore(startOfYear) &&
                        !o.getCreatedAt().isAfter(endOfYear))
                .collect(Collectors.toList());

        return buildAnalyticsResponse("YEARLY", String.valueOf(year), filteredOrders);
    }

    // ─── Overall Revenue & Performance ───────────────────────────────────────
    public AdminAnalyticsResponse getOverallAnalytics() {
        List<Order> allOrders = orderRepository.findAll();
        return buildAnalyticsResponse("OVERALL", "All Time", allOrders);
    }

    // ─── Helper Method ────────────────────────────────────────────────────────
    private AdminAnalyticsResponse buildAnalyticsResponse(String reportType, String period, List<Order> orders) {
        // Calculate revenue for completed / non-failed orders
        List<Order> validOrders = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.FAILED)
                .collect(Collectors.toList());

        BigDecimal totalRevenue = validOrders.stream()
                .map(Order::getTotalAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalOrdersCount = validOrders.size();

        BigDecimal averageOrderValue = BigDecimal.ZERO;
        if (totalOrdersCount > 0) {
            averageOrderValue = totalRevenue.divide(BigDecimal.valueOf(totalOrdersCount), 2, RoundingMode.HALF_UP);
        }

        long totalProducts = productRepository.count();
        long totalUsers = userRepository.count();

        List<AdminAnalyticsResponse.OrderSummary> summaries = orders.stream()
                .sorted((o1, o2) -> {
                    if (o1.getCreatedAt() == null || o2.getCreatedAt() == null) return 0;
                    return o2.getCreatedAt().compareTo(o1.getCreatedAt());
                })
                .map(o -> AdminAnalyticsResponse.OrderSummary.builder()
                        .orderId(o.getOrderId())
                        .userName(o.getUser() != null ? o.getUser().getActualUsername() : "Guest")
                        .userEmail(o.getUser() != null ? o.getUser().getEmail() : "N/A")
                        .totalAmount(o.getTotalAmount())
                        .status(o.getStatus() != null ? o.getStatus().name() : "ORDER_PLACED")
                        .date(o.getCreatedAt() != null ? o.getCreatedAt().format(DATE_FORMATTER) : "N/A")
                        .build())
                .collect(Collectors.toList());

        // Low stock products (stock <= 5)
        List<AdminAnalyticsResponse.LowStockProduct> lowStockProducts = productRepository
                .findByStockLessThanEqualOrderByStockAsc(5)
                .stream()
                .map(p -> AdminAnalyticsResponse.LowStockProduct.builder()
                        .productId(p.getProductId())
                        .name(p.getName())
                        .stock(p.getStock())
                        .price(p.getPrice())
                        .category(p.getCategory() != null ? p.getCategory().getCategoryName() : "Uncategorized")
                        .build())
                .collect(Collectors.toList());

        return AdminAnalyticsResponse.builder()
                .reportType(reportType)
                .period(period)
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrdersCount)
                .totalProducts(totalProducts)
                .totalUsers(totalUsers)
                .averageOrderValue(averageOrderValue)
                .orderSummaries(summaries)
                .lowStockProducts(lowStockProducts)
                .build();
    }
}

