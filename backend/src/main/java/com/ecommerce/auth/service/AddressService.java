package com.ecommerce.auth.service;

import com.ecommerce.auth.dto.AddressDto;
import com.ecommerce.auth.entity.Address;
import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.repository.AddressRepository;
import com.ecommerce.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public List<AddressDto> getUserAddresses() {
        User user = getCurrentUser();
        List<Address> addresses = addressRepository.findByUserOrderByIsDefaultDesc(user);
        return addresses.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public AddressDto addAddress(AddressDto request) {
        User user = getCurrentUser();

        // If this is the first address, make it default automatically
        List<Address> existingAddresses = addressRepository.findByUser(user);
        boolean isFirst = existingAddresses.isEmpty();
        boolean makeDefault = isFirst || (request.getIsDefault() != null && request.getIsDefault());

        if (makeDefault && !isFirst) {
            // Remove default from others
            for (Address addr : existingAddresses) {
                if (addr.getIsDefault()) {
                    addr.setIsDefault(false);
                    addressRepository.save(addr);
                }
            }
        }

        Address address = Address.builder()
                .user(user)
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .streetAddress(request.getStreetAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .isDefault(makeDefault)
                .build();

        Address savedAddress = addressRepository.save(address);
        return mapToDto(savedAddress);
    }

    @Transactional
    public AddressDto updateAddress(Long addressId, AddressDto request) {
        User user = getCurrentUser();
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized");
        }

        boolean makeDefault = Boolean.TRUE.equals(request.getIsDefault());
        if (makeDefault && !Boolean.TRUE.equals(address.getIsDefault())) {
            List<Address> existingAddresses = addressRepository.findByUser(user);
            for (Address addr : existingAddresses) {
                if (!addr.getId().equals(addressId) && Boolean.TRUE.equals(addr.getIsDefault())) {
                    addr.setIsDefault(false);
                    addressRepository.save(addr);
                }
            }
        }

        if (request.getFullName() != null) address.setFullName(request.getFullName());
        if (request.getPhoneNumber() != null) address.setPhoneNumber(request.getPhoneNumber());
        if (request.getStreetAddress() != null) address.setStreetAddress(request.getStreetAddress());
        if (request.getCity() != null) address.setCity(request.getCity());
        if (request.getState() != null) address.setState(request.getState());
        if (request.getPincode() != null) address.setPincode(request.getPincode());
        if (request.getIsDefault() != null) address.setIsDefault(request.getIsDefault());

        Address updatedAddress = addressRepository.save(address);
        return mapToDto(updatedAddress);
    }
    
    public void deleteAddress(Long addressId) {
        User user = getCurrentUser();
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("Address not found"));
                
        if (!address.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized");
        }
        
        addressRepository.delete(address);
    }

    private AddressDto mapToDto(Address address) {
        return AddressDto.builder()
                .id(address.getId())
                .fullName(address.getFullName())
                .phoneNumber(address.getPhoneNumber())
                .streetAddress(address.getStreetAddress())
                .city(address.getCity())
                .state(address.getState())
                .pincode(address.getPincode())
                .isDefault(address.getIsDefault())
                .build();
    }
}
