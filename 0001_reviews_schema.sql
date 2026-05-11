-- Create a basic customers table for the JOIN
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create the reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    body TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- Default to pending so fake reviews don't auto-publish
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure reviews are linked to actual products and customers
    FOREIGN KEY (product_id) REFERENCES catalog_cache(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Create indexes for hyper-fast querying on the edge
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status_rating ON reviews(status, rating);