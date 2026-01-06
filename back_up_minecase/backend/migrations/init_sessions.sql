-- =============================================
-- Minigame Sessions Table (Anti-Cheat)
-- Tracks active game sessions to prevent token farming
-- =============================================

CREATE TABLE IF NOT EXISTS t_minigame_sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES t_users(id) ON DELETE CASCADE,
    game_type VARCHAR(50) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired', 'rejected')),
    result JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_sessions_user_active ON t_minigame_sessions(user_id, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON t_minigame_sessions(expires_at) WHERE status = 'active';
