package com.ecommerce.auth.controller;

import com.ecommerce.auth.entity.Order;
import com.ecommerce.auth.entity.OrderStatus;
import com.ecommerce.auth.repository.OrderRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminOrderController {

    private final OrderRepository orderRepository;
    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void updateDatabaseSchema() {
        try {
            jdbcTemplate.execute("ALTER TABLE orders MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'ORDER_PLACED'");
            jdbcTemplate.execute("UPDATE orders SET status = 'DELIVERED' WHERE status = 'PENDING' OR status = 'SUCCESS' OR status IS NULL");
            log.info("Successfully updated orders.status schema and converted any PENDING/SUCCESS orders to DELIVERED");
        } catch (Exception e) {
            log.debug("Schema modification note (table may not exist yet or already updated): " + e.getMessage());
        }
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable("orderId") String orderId,
            @RequestBody Map<String, String> request
    ) {
        String statusStr = request.get("status");
        if (statusStr == null || statusStr.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Status field is required"));
        }

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(statusStr.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid order status: " + statusStr));
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        order.setStatus(newStatus);
        orderRepository.save(order);

        log.info("Updated order {} status to {}", orderId, newStatus);

        return ResponseEntity.ok(Map.of(
                "message", "Order status updated successfully",
                "orderId", orderId,
                "status", newStatus.name()
        ));
    }
}
