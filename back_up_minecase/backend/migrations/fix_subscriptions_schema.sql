DO $$
BEGIN
    -- Rename table if old one exists and new one doesn't
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 't_user_entitlements') 
       AND NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 't_user_subscriptions') THEN
        ALTER TABLE t_user_entitlements RENAME TO t_user_subscriptions;
    END IF;

    -- Create if it doesn't exist (in case rename didn't happen)
    CREATE TABLE IF NOT EXISTS t_user_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES t_users(id),
        provider VARCHAR(50) NOT NULL,
        provider_subscription_id VARCHAR(100),
        product_id VARCHAR(100), 
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        internal_name VARCHAR(100),
        expires_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Make product_id nullable if it exists (handling user's code change)
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 't_user_subscriptions' AND column_name = 'product_id') THEN
        ALTER TABLE t_user_subscriptions ALTER COLUMN product_id DROP NOT NULL;
    END IF;

END $$;
