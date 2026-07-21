package com.ecommerce.auth.repository;

import com.ecommerce.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
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

    /**
     * Check if a mobile number is already registered.
     */
    boolean existsByMobileNumber(String mobileNumber);

    /**
     * Find all active users.
     */
    List<User> findAllByIsActiveTrue();

    /**
     * Find user by email and active status.
     */
    Optional<User> findByEmailAndIsActiveTrue(String email);

    /**
     * Count total registered (active) users.
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    long countActiveUsers();
}
