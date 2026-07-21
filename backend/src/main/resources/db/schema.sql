-- ============================================================
-- E-Commerce Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS ecommerce_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ecommerce_db;

-- ============================================================
-- Users Table
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    full_name       VARCHAR(100)    NOT NULL,
    email           VARCHAR(150)    NOT NULL,
    mobile_number   VARCHAR(10)     NOT NULL,
    password        VARCHAR(255)    NOT NULL,
    role            ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
    is_active       TINYINT(1)      NOT NULL DEFAULT 1,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email),
    INDEX idx_users_mobile (mobile_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Sample Admin User (password = 'Admin@1234' BCrypt encoded)
-- ============================================================
INSERT IGNORE INTO users (full_name, email, mobile_number, password, role)
VALUES (
    'Admin User',
    'admin@ecommerce.com',
    '9999999999',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN'
);

-- ============================================================
-- Useful Queries Reference
-- ============================================================

-- Find user by email:
-- SELECT * FROM users WHERE email = 'user@example.com';

-- Find all active users:
-- SELECT * FROM users WHERE is_active = 1;

-- Get user by ID:
-- SELECT id, full_name, email, mobile_number, role, created_at FROM users WHERE id = 1;

-- Soft delete user:
-- UPDATE users SET is_active = 0, updated_at = NOW() WHERE id = 1;

-- Hard delete user:
-- DELETE FROM users WHERE id = 1;

-- Update user profile:
-- UPDATE users SET full_name = 'New Name', mobile_number = '9876543210', updated_at = NOW() WHERE id = 1;

-- Count all registered users:
-- SELECT COUNT(*) AS total_users FROM users WHERE is_active = 1;
