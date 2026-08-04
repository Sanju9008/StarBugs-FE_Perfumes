package com.ecommerce.auth.controller;

import com.ecommerce.auth.dto.CreateOrderRequest;
import com.ecommerce.auth.dto.PaymentOrderResponse;
import com.ecommerce.auth.dto.PaymentVerificationRequest;
import com.ecommerce.auth.service.PaymentService;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            PaymentOrderResponse response = paymentService.createOrder(request);
            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body("Razorpay Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        try {
            paymentService.verifyPayment(request);
            return ResponseEntity.ok().body("{\"message\": \"Payment successful\"}");
        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body("{\"message\": \"Razorpay Error: " + e.getMessage() + "\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"message\": \"Error: " + e.getMessage() + "\"}");
        }
    }
}
