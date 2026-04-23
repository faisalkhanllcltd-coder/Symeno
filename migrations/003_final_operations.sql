-- 1. Store Operations Configuration Table
CREATE TABLE IF NOT EXISTS store_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed default configuration
INSERT OR IGNORE INTO store_settings (key, value) VALUES ('store_name', 'Symeno OPS');
INSERT OR IGNORE INTO store_settings (key, value) VALUES ('tax_rate_percent', '8.5');
INSERT OR IGNORE INTO store_settings (key, value) VALUES ('flat_shipping_rate', '15.00');
INSERT OR IGNORE INTO store_settings (key, value) VALUES ('currency', 'USD');

-- 2. Promotions & Discounts Engine
CREATE TABLE IF NOT EXISTS discounts (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    type TEXT CHECK(type IN ('percentage', 'fixed_amount', 'free_shipping')),
    value REAL NOT NULL,
    min_order_amount REAL DEFAULT 0,
    uses_count INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);