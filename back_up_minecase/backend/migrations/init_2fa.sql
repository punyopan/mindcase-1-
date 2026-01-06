-- 2FA (Two-Factor Authentication) Migration
-- Stores TOTP secrets and backup codes for users

CREATE TABLE IF NOT EXISTS t_user_2fa (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    totp_secret VARCHAR(64) NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    backup_codes TEXT[], -- Array of hashed backup codes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Device trust table for "Remember this device" feature
CREATE TABLE IF NOT EXISTS t_trusted_devices (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    device_hash VARCHAR(64) NOT NULL,
    trusted_until TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, device_hash)
);

CREATE INDEX idx_2fa_user ON t_user_2fa(user_id);
CREATE INDEX idx_trusted_devices_user ON t_trusted_devices(user_id);
