-- D1 Database Schema for Symeno

-- 1. Catalog / Products Table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    base_price REAL NOT NULL,
    retail_price REAL NOT NULL,
    stock_status TEXT DEFAULT 'IN_STOCK',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Newsletter / Marketing Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL,
    status TEXT DEFAULT 'SUBSCRIBED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Inject Local Development Data (Smoke Test Seed)
INSERT OR IGNORE INTO products (id, slug, title, brand, category, base_price, retail_price) VALUES
('1', 'sony-xm5', 'Sony WH-1000XM5', 'Sony', 'audio', 249.00, 399.00),
('2', 'apple-airpods-max', 'Apple AirPods Max', 'Apple', 'audio', 399.00, 549.00),
('3', 'lg-c3-42', 'LG C3 42" OLED', 'LG', 'displays', 799.00, 899.00),
('4', 'keychron-q1', 'Keychron Q1 Pro', 'Keychron', 'peripherals', 159.00, 199.00);
