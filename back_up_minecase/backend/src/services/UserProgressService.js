/**
 * User Progress Service (Production Mode)
 * Manages unlocked content (puzzles, topics) with PostgreSQL persistence
 */

const db = require('../db');
const WalletService = require('./WalletService');

// Unlock costs
const UNLOCK_COSTS = {
    PUZZLE: 3,
    TOPIC: 12  // Unlocks all puzzles in a topic
};

class UserProgressService {

    /**
     * Check if user has access to content
     * Premium users have full access, otherwise check if unlocked
     */
    static async hasAccess(userId, contentType, contentId) {
        // Check if premium (has active subscription)
        try {
            const subResult = await db.query(
                `SELECT status FROM t_subscriptions 
                 WHERE user_id = $1 AND status = 'active'
                 ORDER BY created_at DESC LIMIT 1`,
                [userId]
            );
            
            if (subResult.rows.length > 0) {
                return { hasAccess: true, reason: 'premium' };
            }
        } catch (e) {
            // Table might not exist
        }
        
        // Check if specifically unlocked
        const unlockResult = await db.query(
            `SELECT * FROM t_unlocked_content 
             WHERE user_id = $1 AND content_type = $2 AND content_id = $3`,
            [userId, contentType, contentId]
        );
        
        if (unlockResult.rows.length > 0) {
            return { hasAccess: true, reason: 'unlocked' };
        }
        
        return { hasAccess: false, reason: 'locked' };
    }

    /**
     * Unlock content by spending tokens
     */
    static async unlockContent(userId, contentType, contentId) {
        // Validate content type
        if (!['PUZZLE', 'TOPIC'].includes(contentType)) {
            return { success: false, reason: 'invalid_content_type' };
        }
        
        const cost = UNLOCK_COSTS[contentType];
        
        // Check if already unlocked
        const existingResult = await db.query(
            `SELECT * FROM t_unlocked_content 
             WHERE user_id = $1 AND content_type = $2 AND content_id = $3`,
            [userId, contentType, contentId]
        );
        
        if (existingResult.rows.length > 0) {
            return { success: false, reason: 'already_unlocked' };
        }
        
        // Spend tokens
        const spendResult = await WalletService.spendTokens(
            userId, 
            cost, 
            contentType === 'PUZZLE' ? 'SPEND_UNLOCK' : 'SPEND_TOPIC',
            { contentType, contentId }
        );
        
        if (!spendResult.success) {
            return {
                success: false,
                reason: spendResult.reason,
                balance: spendResult.balance,
                required: cost
            };
        }
        
        // Record the unlock
        await db.query(
            `INSERT INTO t_unlocked_content (user_id, content_type, content_id, tokens_spent)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id, content_type, content_id) DO NOTHING`,
            [userId, contentType, contentId, cost]
        );
        
        console.log(`🔓 User ${userId} unlocked ${contentType} ${contentId}`);
        
        return {
            success: true,
            contentType,
            contentId,
            tokensSpent: cost,
            balance: spendResult.balance
        };
    }

    /**
     * Get all unlocked content for user
     */
    static async getUnlockedContent(userId) {
        const result = await db.query(
            `SELECT content_type, content_id, unlocked_at 
             FROM t_unlocked_content 
             WHERE user_id = $1
             ORDER BY unlocked_at DESC`,
            [userId]
        );
        
        // Group by type
        const puzzles = [];
        const topics = [];
        
        for (const row of result.rows) {
            if (row.content_type === 'PUZZLE') {
                puzzles.push(row.content_id);
            } else if (row.content_type === 'TOPIC') {
                topics.push(row.content_id);
            }
        }
        
        return { puzzles, topics };
    }

    /**
     * Get unlock cost for content type
     */
    static getUnlockCost(contentType) {
        return UNLOCK_COSTS[contentType] || UNLOCK_COSTS.PUZZLE;
    }
}

module.exports = UserProgressService;
