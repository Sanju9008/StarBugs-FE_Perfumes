package com.ecommerce.auth.service;

import com.ecommerce.auth.dto.OrderHistoryResponse;
import com.ecommerce.auth.dto.OrderProductDto;
import com.ecommerce.auth.entity.Order;
import com.ecommerce.auth.entity.OrderItem;
import com.ecommerce.auth.entity.OrderStatus;
import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.repository.OrderItemRepository;
import com.ecommerce.auth.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public OrderHistoryResponse getOrderHistory(User user) {
        List<Order> userOrders = orderRepository.findByUserId(user.getId()).stream()
                .sorted((o1, o2) -> {
                    if (o1.getCreatedAt() == null || o2.getCreatedAt() == null) return 0;
                    return o2.getCreatedAt().compareTo(o1.getCreatedAt());
                })
                .collect(Collectors.toList());
        
        List<OrderProductDto> productsList = new ArrayList<>();

        for (Order order : userOrders) {
            if (order.getStatus() != OrderStatus.FAILED) {
                List<OrderItem> items = orderItemRepository.findByOrderOrderId(order.getOrderId());
                for (OrderItem item : items) {
                    String imageUrl = null;
                    if (item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()) {
                        imageUrl = item.getProduct().getImages().get(0).getImageUrl();
                    }

                    OrderProductDto dto = OrderProductDto.builder()
                            .orderId(order.getOrderId())
                            .productId(item.getProduct().getProductId().intValue())
                            .name(item.getProduct().getName())
                            .description(item.getProduct().getDescription())
                            .quantity(item.getQuantity())
                            .pricePerUnit(item.getPricePerUnit())
                            .totalPrice(item.getTotalPrice())
                            .imageUrl(imageUrl)
                            .status(order.getStatus() != null ? order.getStatus().name() : "ORDER_PLACED")
                            .date(order.getCreatedAt() != null ? order.getCreatedAt().format(DATE_FORMATTER) : "N/A")
                            .build();

                    productsList.add(dto);
                }
            }
        }

        OrderHistoryResponse.OrdersWrapper wrapper = OrderHistoryResponse.OrdersWrapper.builder()
                .products(productsList)
                .build();

        return OrderHistoryResponse.builder()
                .role(user.getRole().name())
                .username(user.getActualUsername())
                .orders(wrapper)
                .build();
    }
}
