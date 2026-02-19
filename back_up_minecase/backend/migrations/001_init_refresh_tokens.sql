-- Refresh tokens table for JWT rotation
CREATE TABLE IF NOT EXISTS t_refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    family_id VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    replaced_by_token_id INTEGER,
    ip_address VARCHAR(45),
    user_agent TEXT,
    platform VARCHAR(100),
    browser VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON t_refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON t_refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family_id ON t_refresh_tokens(family_id);
