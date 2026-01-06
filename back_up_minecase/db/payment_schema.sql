-- Hybrid Payment System Schema
-- Supports: Stripe (Web), Apple App Store (iOS), Google Play (Android)

-- 1. Products Catalog
-- Maps internal product identifiers to store-specific IDs
CREATE TABLE t_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    internal_name VARCHAR(100) NOT NULL UNIQUE, -- e.g. 'premium_monthly'
    type VARCHAR(20) NOT NULL, -- 'subscription', 'consumable', 'non_consumable'
    
    -- Store Specific IDs
    stripe_price_id VARCHAR(100),
    apple_product_id VARCHAR(100),
    google_product_id VARCHAR(100),
    
    -- Metadata limits (synced from code for reference)
    reward_amount INT DEFAULT 0, -- Coins/Tokens
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookup by store ID
CREATE INDEX idx_products_stripe ON t_products(stripe_price_id);
CREATE INDEX idx_products_apple ON t_products(apple_product_id);
CREATE INDEX idx_products_google ON t_products(google_product_id);

-- 2. User Subscriptions (Entitlements)
-- The Single Source of Truth for user access
CREATE TABLE t_user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Links to your Auth User ID
    
    -- Current Status
    status VARCHAR(20) NOT NULL, -- 'active', 'expired', 'grace_period', 'revoked'
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Origin Details
    provider VARCHAR(20) NOT NULL, -- 'stripe', 'apple', 'google'
    provider_subscription_id VARCHAR(255) NOT NULL, -- The specific ID from the provider
    product_id UUID REFERENCES t_products(id),
    
    -- Renewal Info
    auto_renew BOOLEAN DEFAULT TRUE,
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, product_id) -- One entry per product per user used for entitlement calculation
);

CREATE INDEX idx_subs_user ON t_user_subscriptions(user_id);
CREATE INDEX idx_subs_provider_id ON t_user_subscriptions(provider_subscription_id);

-- 3. Transactions Ledger
-- Audit log of every purchase/renewal event
CREATE TABLE t_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    subscription_id UUID REFERENCES t_user_subscriptions(id),
    
    -- Transaction Details
    provider VARCHAR(20) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'purchase', 'renewal', 'refund'
    
    -- Store Data
    store_transaction_id VARCHAR(255) NOT NULL, -- Specific ID for this event
    original_transaction_id VARCHAR(255) NOT NULL, -- Chains renewals together
    
    -- Payload Storage (for debugging)
    raw_receipt_data TEXT, -- DO NOT STORE FULL CARD DETAILS, only store audit tokens/receipts
    
    purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_trans_store_id ON t_transactions(store_transaction_id);
CREATE INDEX idx_trans_original_id ON t_transactions(original_transaction_id);

-- 4. User Wallets (Virtual Currency) [NEW]
-- Authoritative source for tokens/gems
CREATE TABLE t_user_wallets (
    user_id UUID PRIMARY KEY,
    balance INT DEFAULT 0 CHECK (balance >= 0),
    total_earned INT DEFAULT 0,
    total_spent INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Ad Events Log (Fraud Detection) [NEW]
-- Record of every rewarded ad completion
CREATE TABLE t_ad_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    provider VARCHAR(50) NOT NULL, -- 'admob', 'unity', 'ironsource'
    
    -- Event Details
    event_type VARCHAR(50) NOT NULL, -- 'reward', 'impression'
    reward_item VARCHAR(50), -- 'token', 'retry'
    reward_amount INT DEFAULT 0,
    
    -- Verification
    transaction_id VARCHAR(255) UNIQUE, -- Idempotency key from provider
    signature VARCHAR(512), -- SSV signature
    verified BOOLEAN DEFAULT FALSE,
    
    client_ip VARCHAR(50),
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ad_user ON t_ad_events(user_id);
CREATE INDEX idx_ad_txn ON t_ad_events(transaction_id);

-- 6. Audit/History Trigger (Optional but recommended)
-- Automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_timestamp BEFORE UPDATE ON t_products FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_subs_timestamp BEFORE UPDATE ON t_user_subscriptions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_wallets_timestamp BEFORE UPDATE ON t_user_wallets FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
