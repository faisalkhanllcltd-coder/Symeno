-- 1. Security & Auth Upgrades
ALTER TABLE customers ADD COLUMN role TEXT DEFAULT 'customer';
ALTER TABLE audit_logs ADD COLUMN ip_address TEXT;

-- 2. Order Fulfillment Upgrades
ALTER TABLE orders ADD COLUMN tracking_number TEXT;
ALTER TABLE orders ADD COLUMN carrier TEXT;
ALTER TABLE orders ADD COLUMN shipping_address TEXT;
ALTER TABLE orders ADD COLUMN fulfilled_at DATETIME;
ALTER TABLE orders ADD COLUMN customer_id TEXT;

-- 3. High-Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id, display_order);
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON product_variants(product_id);
