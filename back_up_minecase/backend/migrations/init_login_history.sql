-- =============================================
-- Login History & Session Tracking
-- Tracks login events and active sessions
-- =============================================

CREATE TABLE IF NOT EXISTS t_login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES t_users(id) ON DELETE CASCADE,
    action VARCHAR(30) NOT NULL CHECK (action IN ('login', 'logout', 'password_changed', '2fa_enabled', '2fa_disabled', 'session_revoked')),
    method VARCHAR(20) CHECK (method IN ('email', 'google', 'apple', 'guest')),
    ip_address VARCHAR(45),
    user_agent TEXT,
    platform VARCHAR(50),
    browser VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_login_history_user ON t_login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_created ON t_login_history(created_at DESC);

-- Add device info columns to refresh tokens for session display
ALTER TABLE t_refresh_tokens 
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45),
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS platform VARCHAR(50),
ADD COLUMN IF NOT EXISTS browser VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_active TIMESTAMPTZ DEFAULT NOW();
