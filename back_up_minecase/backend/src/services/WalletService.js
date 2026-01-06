/**
 * Wallet Service (Production Mode)
 * Manages user token balances with PostgreSQL persistence
 * 
 * Features:
 * - Atomic balance operations with row-level locking
 * - Daily token limits (3 for free users, unlimited for premium)
 * - Full transaction audit trail
 */

const db = require('../db');

// Daily limits by plan
const DAILY_LIMITS = {
    FREE: 3,
    PREMIUM: 999 // Effectively unlimited
};

class WalletService {

    /**
     * Get or create wallet for user
     * Auto-resets daily token count if new day
     */
    static async getWallet(userId) {
        // First, try to reset daily tokens if needed
        await db.query('SELECT reset_daily_tokens_if_needed($1)', [userId]);
        
        // Try to get existing wallet
        let result = await db.query(
            'SELECT * FROM t_user_wallets WHERE user_id = $1',
            [userId]
        );
        
        if (result.rows.length === 0) {
            // Create new wallet for user
            result = await db.query(
                `INSERT INTO t_user_wallets (user_id, balance, total_earned, total_spent, tokens_earned_today)
                 VALUES ($1, 0, 0, 0, 0)
                 ON CONFLICT (user_id) DO NOTHING
                 RETURNING *`,
                [userId]
            );
            
            // If insert returned nothing (race condition), fetch again
            if (result.rows.length === 0) {
                result = await db.query(
                    'SELECT * FROM t_user_wallets WHERE user_id = $1',
                    [userId]
                );
            }
        }
        
        return result.rows[0];
    }

    /**
     * Get user's daily token limit based on subscription
     */
    static async getDailyLimit(userId) {
        // Check if user is premium via subscription
        try {
            const subResult = await db.query(
                `SELECT status, plan FROM t_subscriptions 
                 WHERE user_id = $1 AND status = 'active'
                 ORDER BY created_at DESC LIMIT 1`,
                [userId]
            );
            
            if (subResult.rows.length > 0 && subResult.rows[0].status === 'active') {
                return DAILY_LIMITS.PREMIUM;
            }
        } catch (e) {
            // Table might not exist, default to free
            console.warn('Could not check subscription status:', e.message);
        }
        
        return DAILY_LIMITS.FREE;
    }

    /**
     * Add tokens to wallet (from minigames)
     * Respects daily limit for free users
     */
    static async earnTokens(userId, amount, source = 'EARN_MINIGAME', metadata = {}) {
        const client = await db.getClient();
        
        try {
            await client.query('BEGIN');
            
            // Lock the wallet row for update
            const walletResult = await client.query(
                'SELECT * FROM t_user_wallets WHERE user_id = $1 FOR UPDATE',
                [userId]
            );
            
            let wallet = walletResult.rows[0];
            
            // Create wallet if doesn't exist
            if (!wallet) {
                const insertResult = await client.query(
                    `INSERT INTO t_user_wallets (user_id, balance, total_earned, total_spent, tokens_earned_today)
                     VALUES ($1, 0, 0, 0, 0)
                     RETURNING *`,
                    [userId]
                );
                wallet = insertResult.rows[0];
            }
            
            // Reset daily count if new day
            const today = new Date().toISOString().split('T')[0];
            const lastReset = wallet.last_reset_date?.toISOString?.().split('T')[0] || today;
            
            if (lastReset !== today) {
                wallet.tokens_earned_today = 0;
                await client.query(
                    'UPDATE t_user_wallets SET tokens_earned_today = 0, last_reset_date = CURRENT_DATE WHERE user_id = $1',
                    [userId]
                );
            }
            
            // Check daily limit (only for minigame earnings, not ads)
            const dailyLimit = await this.getDailyLimit(userId);
            const remainingToday = dailyLimit - wallet.tokens_earned_today;
            
            if (source === 'EARN_MINIGAME' && remainingToday <= 0) {
                await client.query('ROLLBACK');
                return {
                    success: false,
                    reason: 'daily_limit_reached',
                    balance: wallet.balance,
                    tokensEarnedToday: wallet.tokens_earned_today,
                    dailyLimit: dailyLimit
                };
            }
            
            // Calculate actual tokens to award (respect daily limit for minigames)
            const tokensToAward = source === 'EARN_MINIGAME' 
                ? Math.min(amount, remainingToday)
                : amount;
            
            // Update wallet
            const newBalance = wallet.balance + tokensToAward;
            const newTotalEarned = wallet.total_earned + tokensToAward;
            const newTodayCount = source === 'EARN_MINIGAME' 
                ? wallet.tokens_earned_today + tokensToAward 
                : wallet.tokens_earned_today;
            
            await client.query(
                `UPDATE t_user_wallets 
                 SET balance = $1, total_earned = $2, tokens_earned_today = $3
                 WHERE user_id = $4`,
                [newBalance, newTotalEarned, newTodayCount, userId]
            );
            
            // Log transaction
            await client.query(
                `INSERT INTO t_wallet_transactions (user_id, type, amount, balance_after, metadata)
                 VALUES ($1, $2, $3, $4, $5)`,
                [userId, source, tokensToAward, newBalance, JSON.stringify(metadata)]
            );
            
            await client.query('COMMIT');
            
            console.log(`💰 User ${userId} earned ${tokensToAward} tokens (${source}). Balance: ${newBalance}`);
            
            return {
                success: true,
                tokensAwarded: tokensToAward,
                balance: newBalance,
                tokensEarnedToday: newTodayCount,
                dailyLimit: dailyLimit
            };
            
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error earning tokens:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Spend tokens (unlock puzzles, etc)
     * Validates sufficient balance before spending
     */
    static async spendTokens(userId, amount, purpose = 'SPEND_UNLOCK', metadata = {}) {
        const client = await db.getClient();
        
        try {
            await client.query('BEGIN');
            
            // Lock the wallet row for update
            const walletResult = await client.query(
                'SELECT * FROM t_user_wallets WHERE user_id = $1 FOR UPDATE',
                [userId]
            );
            
            const wallet = walletResult.rows[0];
            
            if (!wallet) {
                await client.query('ROLLBACK');
                return {
                    success: false,
                    reason: 'no_wallet',
                    balance: 0
                };
            }
            
            if (wallet.balance < amount) {
                await client.query('ROLLBACK');
                return {
                    success: false,
                    reason: 'insufficient_balance',
                    balance: wallet.balance,
                    required: amount
                };
            }
            
            // Update wallet
            const newBalance = wallet.balance - amount;
            const newTotalSpent = wallet.total_spent + amount;
            
            await client.query(
                `UPDATE t_user_wallets 
                 SET balance = $1, total_spent = $2
                 WHERE user_id = $3`,
                [newBalance, newTotalSpent, userId]
            );
            
            // Log transaction
            await client.query(
                `INSERT INTO t_wallet_transactions (user_id, type, amount, balance_after, metadata)
                 VALUES ($1, $2, $3, $4, $5)`,
                [userId, purpose, -amount, newBalance, JSON.stringify(metadata)]
            );
            
            await client.query('COMMIT');
            
            console.log(`💸 User ${userId} spent ${amount} tokens (${purpose}). Balance: ${newBalance}`);
            
            return {
                success: true,
                tokensSpent: amount,
                balance: newBalance
            };
            
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error spending tokens:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Get current balance
     */
    static async getBalance(userId) {
        const wallet = await this.getWallet(userId);
        return wallet?.balance || 0;
    }

    /**
     * Get transaction history
     */
    static async getTransactions(userId, limit = 50) {
        const result = await db.query(
            `SELECT * FROM t_wallet_transactions 
             WHERE user_id = $1 
             ORDER BY created_at DESC 
             LIMIT $2`,
            [userId, limit]
        );
        return result.rows;
    }
}

module.exports = WalletService;
