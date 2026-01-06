-- Authentication System Schema
-- Supports: Email/Password, OAuth, Guest Access

-- 1. Users Table
-- Core identity record
CREATE TABLE t_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE, -- Nullable for Guests
    password_hash VARCHAR(255), -- Nullable for OAuth/Guests
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'USER', -- 'USER', 'ADMIN', 'GUEST'
    
    -- OAuth / Social Login
    google_id VARCHAR(255) UNIQUE,
    apple_id VARCHAR(255) UNIQUE,
    
    -- State
    is_verified BOOLEAN DEFAULT FALSE,
    is_guest BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON t_users(email);
CREATE INDEX idx_users_google ON t_users(google_id);
CREATE INDEX idx_users_apple ON t_users(apple_id);

-- 2. Refresh Tokens
-- Implements Refresh Token Rotation logic
CREATE TABLE t_refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES t_users(id) ON DELETE CASCADE,
    
    token_hash VARCHAR(64) NOT NULL, -- SHA256 hash of the actual token
    family_id UUID NOT NULL, -- To track token chains for rotation
    
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    replaced_by_token_id UUID -- Links to the new token in the chain
);

CREATE INDEX idx_refresh_token_hash ON t_refresh_tokens(token_hash);
CREATE INDEX idx_refresh_family ON t_refresh_tokens(family_id);

-- 3. Trigger for timestamps
CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON t_users FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
