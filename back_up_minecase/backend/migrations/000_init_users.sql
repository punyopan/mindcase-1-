-- Core users table (must run before all other migrations)
CREATE TABLE IF NOT EXISTS t_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    name VARCHAR(255) DEFAULT 'Detective',
    role VARCHAR(20) DEFAULT 'USER',
    is_guest BOOLEAN DEFAULT FALSE,
    google_id VARCHAR(255) UNIQUE,
    apple_id VARCHAR(255) UNIQUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON t_users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON t_users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_apple_id ON t_users(apple_id);
