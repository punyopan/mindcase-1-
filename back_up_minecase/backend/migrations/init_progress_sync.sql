-- User Progress Data Sync Table
-- Server-side backup of client progress data

CREATE TABLE IF NOT EXISTS t_user_progress_sync (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES t_users(id) ON DELETE CASCADE,
    progress_data JSONB NOT NULL DEFAULT '{}',
    analytics_data JSONB NOT NULL DEFAULT '{}',
    last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    client_version INTEGER DEFAULT 1,
    server_version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_progress_sync_user ON t_user_progress_sync(user_id);
CREATE INDEX idx_progress_sync_updated ON t_user_progress_sync(updated_at);
