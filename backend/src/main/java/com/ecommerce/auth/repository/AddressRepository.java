package com.ecommerce.auth.repository;

import com.ecommerce.auth.entity.Address;
import com.ecommerce.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserOrderByIsDefaultDesc(User user);
    List<Address> findByUser(User user);
}
