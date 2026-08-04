package com.ecommerce.auth.controller;

import com.ecommerce.auth.dto.AddressDto;
import com.ecommerce.auth.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<List<AddressDto>> getUserAddresses() {
        return ResponseEntity.ok(addressService.getUserAddresses());
    }

    @PostMapping
    public ResponseEntity<AddressDto> addAddress(@RequestBody AddressDto request) {
        return ResponseEntity.ok(addressService.addAddress(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressDto> updateAddress(@PathVariable Long id, @RequestBody AddressDto request) {
        return ResponseEntity.ok(addressService.updateAddress(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.ok().build();
    }
}
