-- Drop & Create Database
DROP DATABASE IF EXISTS Ebay_clone_db;
CREATE DATABASE Ebay_clone_db
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;
USE Ebay_clone_db;

-- Define Tables (Order matters due to Foreign Keys)

-- Users Table
CREATE TABLE users ( 
    user_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NULL, -- Nullable for external auth like Google
    email VARCHAR(100) UNIQUE NOT NULL,
    google_id VARCHAR(100) UNIQUE NULL, -- Unique identifier from Google
    address VARCHAR(500) NULL, -- Simplified single address field
    phone_number VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_google_id (google_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Roles Table
CREATE TABLE roles (
    role_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL -- e.g., 'ADMIN', 'SELLER', 'BUYER'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User-Roles Mapping Table (Many-to-Many)
CREATE TABLE user_roles (
    user_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories Table
CREATE TABLE categories (
    category_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    parent_category_id BIGINT UNSIGNED NULL,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products Table
CREATE TABLE products (
    product_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    seller_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    price DECIMAL(12, 2) NULL,
    stock_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    image_url TEXT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'SOLD_OUT', 'DRAFT') DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
    INDEX idx_seller_id (seller_id),
    INDEX idx_category_id (category_id),
    INDEX idx_status (status),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cart Items Table (User's Shopping Cart)
CREATE TABLE cart_items (
    cart_item_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders Table
CREATE TABLE orders (
    order_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT UNSIGNED NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING_PAYMENT', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED') DEFAULT 'PENDING_PAYMENT',
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    shipping_address_snapshot TEXT NULL, -- Store the address JSON/text as it was at time of order
    billing_address_snapshot TEXT NULL,  -- Store the address JSON/text as it was at time of order
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Items Table (Products within an Order)
CREATE TABLE order_items (
    order_item_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL CHECK (quantity > 0),
    price_at_purchase DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payments Table
CREATE TABLE payments (
    payment_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    payment_gateway ENUM('STRIPE', 'PAYPAL', 'COD', 'BANK_TRANSFER', 'OTHER') NOT NULL,
    transaction_id VARCHAR(255) NULL UNIQUE,
    amount DECIMAL(12, 2) NOT NULL,
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_status (status),
    INDEX idx_transaction_id (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Shipping Table
CREATE TABLE shipping (
    shipping_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    shipping_address_snapshot TEXT NOT NULL, -- Store destination address text for this specific shipment
    shipping_provider VARCHAR(100) NULL,
    tracking_number VARCHAR(100) NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
    status ENUM('PENDING', 'LABEL_CREATED', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'RETURNED') DEFAULT 'PENDING',
    shipped_date TIMESTAMP NULL,
    estimated_delivery_date TIMESTAMP NULL,
    actual_delivery_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_status (status),
    INDEX idx_tracking_number (tracking_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews Table
CREATE TABLE reviews (
    review_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NULL,
    rating INT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NULL,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (product_id, user_id, order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL,
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Auctions Table
CREATE TABLE auctions (
    auction_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT UNSIGNED NOT NULL UNIQUE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    starting_price DECIMAL(12, 2) NOT NULL,
    current_price DECIMAL(12, 2) NULL,
    reserve_price DECIMAL(12, 2) NULL,
    bid_increment DECIMAL(10, 2) DEFAULT 1.00,
    winner_id BIGINT UNSIGNED NULL,
    status ENUM('SCHEDULED', 'ACTIVE', 'ENDED_MET_RESERVE', 'ENDED_NO_RESERVE', 'ENDED_NO_BIDS', 'CANCELLED') DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (end_time > start_time),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (winner_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_product_id (product_id),
    INDEX idx_winner_id (winner_id),
    INDEX idx_status (status),
    INDEX idx_end_time (end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bids Table
CREATE TABLE bids (
    bid_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    auction_id BIGINT UNSIGNED NOT NULL,
    bidder_id BIGINT UNSIGNED NOT NULL,
    bid_amount DECIMAL(12, 2) NOT NULL,
    bid_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_winning_bid BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (auction_id) REFERENCES auctions(auction_id) ON DELETE CASCADE,
    FOREIGN KEY (bidder_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_auction_id (auction_id),
    INDEX idx_bidder_id (bidder_id),
    INDEX idx_auction_bid_amount (auction_id, bid_amount DESC),
    INDEX idx_bid_time (bid_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --- Placeholder Data (Example) ---
-- INSERT INTO roles (role_name) VALUES ('ADMIN'), ('SELLER'), ('BUYER');

-- INSERT INTO users (username, password_hash, email, address) VALUES ('admin', 'hashed_password_admin', 'admin@example.com', '123 Admin St, Control City, AC 10001');
-- INSERT INTO users (username, password_hash, email, address) VALUES ('seller1', 'hashed_password_seller', 'seller@example.com', '456 Market Pl, Vendor Town, VT 20002');
-- INSERT INTO users (username, password_hash, email, address) VALUES ('buyer1', 'hashed_password_buyer', 'buyer@example.com', '789 Consumer Ave, Purchase Place, PP 30003');
-- -- Assign roles...
-- INSERT INTO user_roles (user_id, role_id) VALUES (1, 1), (1, 2), (1, 3); -- Admin has all roles
-- INSERT INTO user_roles (user_id, role_id) VALUES (2, 2); -- seller1 is SELLER
-- INSERT INTO user_roles (user_id, role_id) VALUES (3, 3); -- buyer1 is BUYER

-- UPDATE roles SET role_name = 'ROLE_ADMIN' WHERE role_name = 'ADMIN';
-- UPDATE roles SET role_name = 'ROLE_BUYER' WHERE role_name = 'BUYER';
-- UPDATE roles SET role_name = 'ROLE_SELLER' WHERE role_name = 'SELLER';

