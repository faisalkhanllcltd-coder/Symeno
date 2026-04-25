INSERT OR IGNORE INTO products (id, slug, brand, title, description, base_price, retail_price, stock_status) VALUES
('prod_003', 'macbook-pro-m3', 'Apple', 'MacBook Pro 14" M3', 'Mind-blowing. Head-turning. The ultimate arbitrage target.', 1299.00, 1599.00, 'IN_STOCK'),
('prod_004', 'samsung-s24-ultra', 'Samsung', 'Galaxy S24 Ultra', 'Galaxy AI is here. Sourced directly from global surplus.', 950.00, 1299.00, 'IN_STOCK');

INSERT OR IGNORE INTO product_variants (id, product_id, sku, title, price_adjustment, inventory_quantity) VALUES
('var_003_slv', 'prod_003', 'APL-MBP-SLV', 'Silver - 512GB', 0, 15),
('var_003_spb', 'prod_003', 'APL-MBP-SPB', 'Space Black - 1TB', 200.00, 8),
('var_004_tgr', 'prod_004', 'SAM-S24-TGR', 'Titanium Gray - 256GB', 0, 22);
