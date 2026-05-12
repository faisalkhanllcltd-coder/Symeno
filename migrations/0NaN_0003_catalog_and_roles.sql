-- Migration number: 0NaN    2026-05-12T16:59:31.900Z

-- Safely add the missing role column to existing customers
ALTER TABLE customers ADD COLUMN role TEXT DEFAULT 'customer';

-- Provision the missing catalog cache table for secure checkout
CREATE TABLE IF NOT EXISTS catalog_cache (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);