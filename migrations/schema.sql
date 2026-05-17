-- =======================================================================================
-- SYMENO OPERATIONS: D1 EDGE DATABASE SCHEMA
-- =======================================================================================

-- 1. NUKE LEGACY ARCHITECTURE (Strict Child-to-Parent Order)
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS stock_adjustments;
DROP TABLE IF EXISTS order_notes;
DROP TABLE IF EXISTS return_requests;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS wishlists;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS points_ledger;
DROP TABLE IF EXISTS user_notes;
DROP TABLE IF EXISTS user_notifications;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS customers; 
DROP TABLE IF EXISTS store_settings;
DROP TABLE IF EXISTS discounts;
DROP TABLE IF EXISTS b2b_applications;
DROP TABLE IF EXISTS newsletter_subscribers;
DROP TABLE IF EXISTS catalog_cache;

-- =======================================================================================
-- 2. CORE IDENTITY & AUTHENTICATION
-- =======================================================================================

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'customer',
    stripe_customer_id TEXT,
    is_verified INTEGER DEFAULT 0,
    verification_token TEXT,
    pending_email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at INTEGER,
    device TEXT,
    location TEXT,
    ip_address TEXT,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =======================================================================================
-- 3. PRODUCT CATALOG & INVENTORY
-- =======================================================================================

CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    sku TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    category_id TEXT,
    brand_id TEXT,
    category TEXT DEFAULT 'uncategorized',
    base_price REAL,
    wholesale_price REAL,
    retail_price REAL,
    stock INTEGER DEFAULT 0,
    stock_status TEXT DEFAULT 'IN_STOCK',
    is_active INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS product_variants (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    title TEXT,
    image_url TEXT,
    price_adjustment REAL DEFAULT 0,
    wholesale_cost REAL DEFAULT 0,
    retail_price REAL,
    inventory_quantity INTEGER DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_images (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS catalog_cache (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =======================================================================================
-- 4. COMMERCE & LOGISTICS
-- =======================================================================================

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    stripe_session_id TEXT UNIQUE,
    user_id TEXT, -- FIXED: Removed NOT NULL so ON DELETE SET NULL works securely
    customer_email TEXT NOT NULL,
    shipping_name TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    tracking_number TEXT,
    carrier TEXT,
    fulfilled_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT,
    variant_id TEXT,
    quantity INTEGER NOT NULL,
    locked_price REAL NOT NULL,
    unit_price REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- =======================================================================================
-- 5. CUSTOMER EXPERIENCE & SUPPORT
-- =======================================================================================

CREATE TABLE IF NOT EXISTS wishlists (
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    rating INTEGER NOT NULL,
    title TEXT NOT NULL,
    comment TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    is_verified_buyer INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS return_requests (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING_APPROVAL',
    reason TEXT NOT NULL,
    condition TEXT NOT NULL,
    resolution TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS b2b_applications (
    id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    trade_license TEXT NOT NULL,
    tax_id TEXT,
    contact_email TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING_REVIEW',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS points_ledger (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    points INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =======================================================================================
-- 6. SYSTEM OPERATIONS & LOGGING
-- =======================================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    target_id TEXT,
    entity_type TEXT,
    entity_id TEXT,
    metadata TEXT,
    details TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS store_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS discounts (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    type TEXT,
    value REAL NOT NULL,
    min_order_amount REAL DEFAULT 0,
    uses_count INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    source TEXT DEFAULT 'direct',
    status TEXT DEFAULT 'SUBSCRIBED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_notes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    note TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    action_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_notes (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    note TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS stock_adjustments (
    id TEXT PRIMARY KEY,
    variant_id TEXT NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reason TEXT NOT NULL,
    operator_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);

-- =======================================================================================
-- 7. PERFORMANCE & SCALING INDEXES 
-- =======================================================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products (brand_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants (product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants (sku);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images (product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON order_items(variant_id);
CREATE INDEX IF NOT EXISTS idx_return_requests_order_id ON return_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_return_requests_user_id ON return_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_order_notes_order_id ON order_notes(order_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_points_user ON points_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_user ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_b2b_status ON b2b_applications(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_stock_adjustments_variant_id ON stock_adjustments(variant_id);