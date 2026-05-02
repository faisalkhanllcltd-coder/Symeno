-- RESET: Force schema parity by removing outdated tables
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS newsletter_subscribers;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS orders;

-- 1. Catalog / Products Table (Edge Matrix Schema)
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    categorySlug TEXT,
    basePrice REAL NOT NULL,
    retailPrice REAL NOT NULL,
    stockStatus TEXT DEFAULT 'IN_STOCK',
    is_active BOOLEAN DEFAULT 1,
    description TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Storefront Customers
CREATE TABLE customers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Admin / Staff Users
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'staff',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Orders Table
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    customer_email TEXT,
    shipping_name TEXT,
    shipping_address TEXT,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Seed Edge Matrix Data
INSERT INTO products (id, slug, title, brand, category, basePrice, retailPrice) VALUES
('1', 'sony-xm5', 'Sony WH-1000XM5', 'Sony', 'audio', 249.00, 399.00),
('2', 'apple-airpods-max', 'Apple AirPods Max', 'Apple', 'audio', 399.00, 549.00),
('3', 'lg-c3-42', 'LG C3 42" OLED', 'LG', 'displays', 799.00, 899.00),
('4', 'keychron-q1', 'Keychron Q1 Pro', 'Keychron', 'peripherals', 159.00, 199.00);