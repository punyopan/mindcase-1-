-- =============================================
-- Token System Database Migration
-- Creates tables for production-grade token economy
-- =============================================

-- User wallets - stores token balances
CREATE TABLE IF NOT EXISTS t_user_wallets (
    user_id UUID PRIMARY KEY REFERENCES t_users(id) ON DELETE CASCADE,
    balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
    total_earned INTEGER NOT NULL DEFAULT 0,
    total_spent INTEGER NOT NULL DEFAULT 0,
    tokens_earned_today INTEGER NOT NULL DEFAULT 0,
    last_reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for wallet lookups
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON t_user_wallets(user_id);

-- Transaction audit log - tracks all token operations
CREATE TABLE IF NOT EXISTS t_wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES t_users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('EARN_MINIGAME', 'EARN_AD', 'SPEND_UNLOCK', 'SPEND_TOPIC', 'REFUND', 'BONUS')),
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for transaction queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON t_wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON t_wallet_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON t_wallet_transactions(type);

-- Unlocked content tracking - what puzzles/topics user has unlocked
CREATE TABLE IF NOT EXISTS t_unlocked_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES t_users(id) ON DELETE CASCADE,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('PUZZLE', 'TOPIC')),
    content_id VARCHAR(50) NOT NULL,
    tokens_spent INTEGER NOT NULL DEFAULT 0,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, content_type, content_id)
);

-- Create indexes for unlock queries
CREATE INDEX IF NOT EXISTS idx_unlocks_user_id ON t_unlocked_content(user_id);
CREATE INDEX IF NOT EXISTS idx_unlocks_content ON t_unlocked_content(content_type, content_id);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for wallet updates
DROP TRIGGER IF EXISTS update_wallet_updated_at ON t_user_wallets;
CREATE TRIGGER update_wallet_updated_at
    BEFORE UPDATE ON t_user_wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to reset daily token count at midnight
-- This can be called by a cron job or checked on each request
CREATE OR REPLACE FUNCTION reset_daily_tokens_if_needed(p_user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE t_user_wallets 
    SET tokens_earned_today = 0, last_reset_date = CURRENT_DATE
    WHERE user_id = p_user_id AND last_reset_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;
