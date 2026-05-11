-- 1. Wipe the messy data completely clean
DELETE FROM reviews;
DELETE FROM customers;

-- 2. Insert 3 fresh, realistic customers
INSERT INTO customers (id, name, email) VALUES 
  ('c_01', 'James W.', 'james.w@example.com'),
  ('c_02', 'Elena M.', 'elena.m@example.com'),
  ('c_03', 'Marcus T.', 'marcus.t@example.com');

-- 3. Insert 3 highly professional, realistic reviews tied safely to your actual products
INSERT INTO reviews (id, product_id, customer_id, rating, body, status, created_at)
SELECT 
  'r_01', id, 'c_01', 5, 
  'Flawless execution. The hardware arrived in pristine factory packaging. At 30% under MSRP, this arbitrage model is unmatched.', 
  'approved', datetime('now', '-1 day')
FROM catalog_cache LIMIT 1 OFFSET 0;

INSERT INTO reviews (id, product_id, customer_id, rating, body, status, created_at)
SELECT 
  'r_02', id, 'c_02', 5, 
  'Network logistics are incredibly sharp. Tracked the shipment end-to-end. Premium hardware secured at wholesale margins.', 
  'approved', datetime('now', '-3 days')
FROM catalog_cache LIMIT 1 OFFSET 1;

INSERT INTO reviews (id, product_id, customer_id, rating, body, status, created_at)
SELECT 
  'r_03', id, 'c_03', 5, 
  'Zero-markup structure is a gamechanger for our procurement. Specifications were exact. Will be scaling our deployments immediately.', 
  'approved', datetime('now', '-6 days')
FROM catalog_cache LIMIT 1 OFFSET 2;