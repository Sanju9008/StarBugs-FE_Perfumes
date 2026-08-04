package com.ecommerce.auth.repository;

import com.ecommerce.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by email address (used for authentication).
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if an email is already registered.
     */
    boolean existsByEmail(String email);

}
