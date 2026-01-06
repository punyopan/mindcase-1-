-- Add social login columns to t_users table
ALTER TABLE t_users 
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS apple_id VARCHAR(255) UNIQUE;

-- Create indexes for faster lookup
CREATE INDEX IF NOT EXISTS idx_users_google_id ON t_users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_apple_id ON t_users(apple_id);
