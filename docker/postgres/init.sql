-- PostgreSQL initialization script for MediControl
-- This script runs automatically when the database is first created

-- Enable UNACCENT extension for Portuguese full-text search
-- Removes diacritics (accents) from text for better search matching
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Create custom text search configuration for Portuguese with UNACCENT
-- This allows searching for "medicação" to match "medicacao" and vice versa
CREATE TEXT SEARCH CONFIGURATION pt_unaccent (COPY = pg_catalog.portuguese);

ALTER TEXT SEARCH CONFIGURATION pt_unaccent
  ALTER MAPPING FOR hword, hword_part, word
  WITH unaccent, portuguese_stem;

-- Grant all privileges to the postgres user
-- Note: In production, use a dedicated application user with limited privileges
GRANT ALL PRIVILEGES ON DATABASE medicontrol TO postgres;

-- Log successful initialization
DO $$
BEGIN
  RAISE NOTICE 'MediControl database initialized successfully';
  RAISE NOTICE 'UNACCENT extension enabled';
  RAISE NOTICE 'Portuguese text search configuration created';
END $$;
