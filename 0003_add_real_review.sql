-- 1. Add your real customer
INSERT INTO customers (id, name, email) 
VALUES ('cust_live_001', 'John D.', 'john.d@realemail.com')
ON CONFLICT(id) DO NOTHING;

-- 2. Attach their real review to a real product in your catalog
INSERT INTO reviews (id, product_id, customer_id, rating, body, status)
SELECT 
  'rev_live_001', 
  (SELECT id FROM catalog_cache LIMIT 1 OFFSET 0), -- Change OFFSET to pick a different product if needed
  'cust_live_001', 
  5, 
  'PUT YOUR REAL CUSTOMER REVIEW TEXT EXACTLY HERE. No fluff, just the real words they said.', 
  'approved'
WHERE (SELECT id FROM catalog_cache LIMIT 1 OFFSET 0) IS NOT NULL;