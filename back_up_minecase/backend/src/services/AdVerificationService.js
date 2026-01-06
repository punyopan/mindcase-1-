const crypto = require('crypto');
const { Pool } = require('pg');

// Initialize DB Pool (assuming environment variables are set)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

class AdVerificationService {
    
    /**
     * Verify Google AdMob SSV Signature
     * @param {Object} queryParams - The query parameters from the GET callback
     * @returns {boolean}
     */
    static async verifyAdMobSignature(queryParams) {
        // checks `signature` and `key_id` against public keys
        // For implementation, we fetch keys from https://www.gstatic.com/admob/reward/public_keys.json
        // simplified mock for this stage:
        
        const { signature, key_id, ...data } = queryParams;
        
        if (!signature || !key_id) {
            console.warn('[AdVerification] Missing signature or key_id');
            return false;
        }

        // In a real implementation:
        // 1. Fetch public keys (cache them)
        // 2. Construct the data string (query params excluding sig/key_id)
        // 3. crypto.verify(...)
        
        // Mock verification for progress
        return true; 
    }

    /**
     * Process a Verified Reward
     * @param {string} userId - User UUID
     * @param {string} transactionId - Unique ID from Ad Network
     * @param {string} rewardItem - 'token' or 'retry'
     * @param {number} amount - Amount to reward
     */
    static async processReward({ userId, transactionId, rewardItem, amount, provider, signature }) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            // 1. Check Idempotency (Prevent Replay Attacks)
            const checkRes = await client.query(
                `SELECT id FROM t_ad_events WHERE transaction_id = $1`,
                [transactionId]
            );

            if (checkRes.rowCount > 0) {
                console.warn(`[AdVerification] Duplicate transaction ${transactionId}`);
                await client.query('ROLLBACK');
                return { success: false, reason: 'duplicate' };
            }

            // 2. Log Event
            await client.query(
                `INSERT INTO t_ad_events 
                (user_id, provider, event_type, reward_item, reward_amount, transaction_id, signature, verified)
                VALUES ($1, $2, 'reward', $3, $4, $5, $6, $7)`,
                [userId, provider, rewardItem, amount, transactionId, signature, true]
            );

            // 3. Grant Reward (Update Wallet)
            if (rewardItem === 'token') {
                await client.query(
                    `INSERT INTO t_user_wallets (user_id, balance, total_earned, updated_at)
                    VALUES ($1, $2, $2, NOW())
                    ON CONFLICT (user_id) 
                    DO UPDATE SET 
                        balance = t_user_wallets.balance + $2,
                        total_earned = t_user_wallets.total_earned + $2,
                        updated_at = NOW()`,
                    [userId, amount]
                );
            }
            
            // Note: Retries might be handled differently or just logged.
            
            await client.query('COMMIT');
            console.log(`[AdVerification] Rewarded User ${userId}: +${amount} ${rewardItem}`);
            
            return { success: true };

        } catch (e) {
            await client.query('ROLLBACK');
            console.error('[AdVerification] Transaction Failed:', e);
            throw e;
        } finally {
            client.release();
        }
    }
}

module.exports = AdVerificationService;
