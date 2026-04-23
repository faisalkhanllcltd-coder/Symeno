-- Purpose: Initial production schema and base catalog seed.

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    brand TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    base_price REAL NOT NULL,
    retail_price REAL,
    stock_status TEXT NOT NULL DEFAULT 'IN_STOCK',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS product_variants (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    price_adjustment REAL NOT NULL DEFAULT 0,
    inventory_quantity INTEGER NOT NULL DEFAULT 0
);

-- Clear existing seed data to prevent conflicts on re-seed
DELETE FROM product_variants;
DELETE FROM products;

-- Seed: Sony XM5
INSERT INTO products (id, slug, brand, title, description, base_price, retail_price, stock_status)
VALUES ('prod_sony_xm5', 'sony-xm5', 'Sony', 'WH-1000XM5 Wireless Noise Canceling Headphones', 'Industry-leading noise cancellation, 30-hour battery life, and ultra-comfortable lightweight design.', 298.00, 399.00, 'IN_STOCK');

INSERT INTO product_variants (id, product_id, sku, title, price_adjustment, inventory_quantity)
VALUES ('var_xm5_blk', 'prod_sony_xm5', 'SNY-XM5-BLK', 'Midnight Black', 0, 150),
       ('var_xm5_slv', 'prod_sony_xm5', 'SNY-XM5-SLV', 'Platinum Silver', 0, 85);

-- Seed: Apple AirPods Max
INSERT INTO products (id, slug, brand, title, description, base_price, retail_price, stock_status)
VALUES ('prod_app_apm', 'apple-airpods-max', 'Apple', 'AirPods Max', 'High-fidelity audio, Active Noise Cancellation, and spatial audio with dynamic head tracking.', 449.00, 549.00, 'IN_STOCK');

INSERT INTO product_variants (id, product_id, sku, title, price_adjustment, inventory_quantity)
VALUES ('var_apm_spc', 'prod_app_apm', 'APP-APM-SPC', 'Space Gray', 0, 42);
