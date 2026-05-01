-- Symeno Operations: D1 Edge Database Schema
-- 0002: Auth Security Infrastructure

-- Add missing columns to customers table for secure authentication
ALTER TABLE customers ADD COLUMN is_verified BOOLEAN DEFAULT 0;
ALTER TABLE customers ADD COLUMN verification_token TEXT;
ALTER TABLE customers ADD COLUMN pending_email TEXT;
-- updated_at is already in customers in 0001_core_architecture.sql, so we don't need to add it!
