-- MediControl Database Initialization Script
-- This script runs automatically when the PostgreSQL container is first created

-- Create UNACCENT extension for accent-insensitive searches
-- Useful for Brazilian Portuguese text searches
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Optional: Create other useful extensions for Laravel/PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- Trigram matching for fuzzy search

-- Grant permissions (if needed)
-- GRANT ALL PRIVILEGES ON DATABASE medicontrol TO medicontrol;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database initialized successfully with extensions:';
    RAISE NOTICE '  ✓ unaccent - for accent-insensitive searches';
    RAISE NOTICE '  ✓ uuid-ossp - for UUID generation';
    RAISE NOTICE '  ✓ pg_trgm - for fuzzy text search';
END $$;
