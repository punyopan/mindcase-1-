-- Translation Cache Table
-- Stores translated puzzle content to share across all users

CREATE TABLE IF NOT EXISTS t_translation_cache (
    id SERIAL PRIMARY KEY,
    puzzle_id INTEGER NOT NULL,
    language VARCHAR(50) NOT NULL,
    title TEXT,
    question TEXT,
    ideal_answer TEXT,
    key_principles JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(puzzle_id, language)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_translation_cache_lookup ON t_translation_cache(puzzle_id, language);
