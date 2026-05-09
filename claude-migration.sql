DROP TABLE IF EXISTS rapidapi_cache;
DROP TABLE IF EXISTS catalog_cache;

CREATE TABLE catalog_cache (
    id TEXT PRIMARY KEY,
    name TEXT,
    slug TEXT UNIQUE,
    brand TEXT,
    category TEXT,
    price REAL,
    description TEXT,
    images_json TEXT,
    rating REAL,
    review_count INTEGER DEFAULT 0,
    source TEXT DEFAULT 'hasdata',
    source_url TEXT,
    scraped_at INTEGER,
    in_stock INTEGER DEFAULT 1,
    variants_json TEXT,
    tags_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_catalog_category ON catalog_cache(category);
CREATE INDEX IF NOT EXISTS idx_catalog_brand    ON catalog_cache(brand);
CREATE INDEX IF NOT EXISTS idx_catalog_slug     ON catalog_cache(slug);
