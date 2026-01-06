CREATE TABLE IF NOT EXISTS t_user_entitlements (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES t_users(id),
    provider VARCHAR(50) NOT NULL, -- 'stripe', 'google_play', etc.
    provider_subscription_id VARCHAR(100), -- Stripe Subscription ID
    product_id VARCHAR(100) NOT NULL, -- 'premium_monthly', etc.
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    internal_name VARCHAR(100),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_entitlements_user_id ON t_user_entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_provider_sub_id ON t_user_entitlements(provider_subscription_id);
