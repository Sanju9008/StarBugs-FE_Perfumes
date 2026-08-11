package com.ecommerce.auth.service;

import com.ecommerce.auth.dto.CreateOrderRequest;
import com.ecommerce.auth.dto.PaymentOrderResponse;
import com.ecommerce.auth.dto.PaymentVerificationRequest;
import com.ecommerce.auth.entity.*;
import com.ecommerce.auth.repository.*;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final AddressRepository addressRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private RazorpayClient razorpayClient;

    @PostConstruct
    public void init() {
        try {
            this.razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        } catch (RazorpayException e) {
            System.err.println("Failed to initialize RazorpayClient: " + e.getMessage());
        }
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Transactional
    public PaymentOrderResponse createOrder(CreateOrderRequest request) throws RazorpayException {
        User user = getCurrentUser();
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());

        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new IllegalArgumentException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Invalid address");
        }

        // Calculate total
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            BigDecimal itemTotal = item.getProduct().getPrice().multiply(new BigDecimal(item.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        // Razorpay expects amount in paise (multiply by 100)
        int amountInPaise = totalAmount.multiply(new BigDecimal("100")).intValue();

        // Create Razorpay order
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + UUID.randomUUID().toString().substring(0, 8));

        com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);
        String razorpayOrderId = razorpayOrder.get("id");

        // Save order in our DB
        Order order = Order.builder()
                .orderId(UUID.randomUUID().toString())
                .user(user)
                .address(address)
                .totalAmount(totalAmount)
                .status(OrderStatus.ORDER_PLACED)
                .build();
        
        order = orderRepository.save(order);

        // Save Order Items
        for (CartItem item : cartItems) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(item.getProduct())
                    .quantity(item.getQuantity())
                    .pricePerUnit(item.getProduct().getPrice())
                    .totalPrice(item.getProduct().getPrice().multiply(new BigDecimal(item.getQuantity())))
                    .build();
            orderItemRepository.save(orderItem);
        }

        // Save Payment record
        Payment payment = Payment.builder()
                .order(order)
                .user(user)
                .amount(totalAmount)
                .razorpayOrderId(razorpayOrderId)
                .status(Payment.PaymentStatus.PENDING)
                .build();
        
        paymentRepository.save(payment);

        return PaymentOrderResponse.builder()
                .orderId(order.getOrderId())
                .razorpayOrderId(razorpayOrderId)
                .amount(totalAmount)
                .currency("INR")
                .build();
    }

    @Transactional
    public void verifyPayment(PaymentVerificationRequest request) throws RazorpayException {
        User user = getCurrentUser();

        Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        if (!payment.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized");
        }

        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", request.getRazorpayOrderId());
        options.put("razorpay_payment_id", request.getRazorpayPaymentId());
        options.put("razorpay_signature", request.getRazorpaySignature());

        boolean status = Utils.verifyPaymentSignature(options, razorpayKeySecret);

        if (status) {
            payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
            payment.setRazorpaySignature(request.getRazorpaySignature());
            payment.setStatus(Payment.PaymentStatus.COMPLETED);
            paymentRepository.save(payment);

            Order order = payment.getOrder();
            order.setStatus(OrderStatus.ORDER_PLACED);
            orderRepository.save(order);

            // Clear the user's cart after successful payment
            cartItemRepository.deleteAll(cartItemRepository.findByUserId(user.getId()));
        } else {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            paymentRepository.save(payment);
            
            Order order = payment.getOrder();
            order.setStatus(OrderStatus.FAILED);
            orderRepository.save(order);
            
            throw new IllegalArgumentException("Payment verification failed");
        }
    }
}
