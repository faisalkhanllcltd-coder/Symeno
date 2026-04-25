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
CREATE INDEX IF NOT EXISTS idx_b2b_status ON b2b_applications(status);