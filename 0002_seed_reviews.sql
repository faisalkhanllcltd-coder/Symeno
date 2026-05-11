-- 1. Create 3 Dummy Customers
INSERT INTO customers (id, name, email) VALUES 
  ('cust_001', 'Michael R.', 'michael.r@example.com'),
  ('cust_002', 'Sarah T.', 'sarah.t@example.com'),
  ('cust_003', 'David L.', 'david.l@example.com')
ON CONFLICT(id) DO NOTHING;

-- 2. Dynamically Insert Reviews (Auto-fetches existing Product IDs)
INSERT INTO reviews (id, product_id, customer_id, rating, body, status, created_at)
SELECT 
  'rev_001', 
  (SELECT id FROM catalog_cache LIMIT 1 OFFSET 0), 
  'cust_001', 
  5, 
  'Secured the complete KitchenAid array for 34% under standard retail. Factory sealed, dispatched same day. This is the only logical way to source hardware.', 
  'approved', 
  datetime('now', '-2 days')
WHERE (SELECT id FROM catalog_cache LIMIT 1 OFFSET 0) IS NOT NULL;

INSERT INTO reviews (id, product_id, customer_id, rating, body, status, created_at)
SELECT 
  'rev_002', 
  (SELECT id FROM catalog_cache LIMIT 1 OFFSET 1), 
  'cust_002', 
  5, 
  'The margin compression is real. Tracked my order straight from the fulfillment center. Perfect condition, zero gray-market concerns.', 
  'approved', 
  datetime('now', '-5 days')
WHERE (SELECT id FROM catalog_cache LIMIT 1 OFFSET 1) IS NOT NULL;

INSERT INTO reviews (id, product_id, customer_id, rating, body, status, created_at)
SELECT 
  'rev_003', 
  (SELECT id FROM catalog_cache LIMIT 1 OFFSET 2), 
  'cust_003', 
  4, 
  'Price match was instant. The UI is clean, no fake flash sales. Just pure volume arbitrage. Very impressed with the logistics network.', 
  'approved', 
  datetime('now', '-12 days')
WHERE (SELECT id FROM catalog_cache LIMIT 1 OFFSET 2) IS NOT NULL;