/**
 * Progress Controller
 * Handles API requests for wallet and unlock operations
 */

const WalletService = require('../services/WalletService');
const UserProgressService = require('../services/UserProgressService');
const MinigameSessionService = require('../services/MinigameSessionService');

class ProgressController {

    /**
     * GET /api/progress/wallet
     * Get user's wallet info (balance, daily stats)
     */
    static async getWallet(req, res) {
        try {
            const userId = req.user.uid;
            const wallet = await WalletService.getWallet(userId);
            const dailyLimit = await WalletService.getDailyLimit(userId);
            
            res.json({
                success: true,
                wallet: {
                    balance: wallet.balance,
                    totalEarned: wallet.total_earned,
                    totalSpent: wallet.total_spent,
                    tokensEarnedToday: wallet.tokens_earned_today,
                    dailyLimit: dailyLimit,
                    remainingToday: Math.max(0, dailyLimit - wallet.tokens_earned_today)
                }
            });
        } catch (error) {
            console.error('Error getting wallet:', error);
            res.status(500).json({ success: false, message: 'Failed to get wallet' });
        }
    }

    /**
     * POST /api/progress/minigame/start
     * Start a minigame session (anti-cheat)
     */
    static async startMinigameSession(req, res) {
        try {
            const userId = req.user.uid;
            const { gameType } = req.body;
            
            if (!gameType) {
                return res.status(400).json({ success: false, message: 'gameType is required' });
            }
            
            const session = await MinigameSessionService.startSession(userId, gameType);
            
            res.json({
                success: true,
                session
            });
        } catch (error) {
            console.error('Error starting minigame session:', error);
            res.status(500).json({ success: false, message: 'Failed to start session' });
        }
    }

    /**
     * POST /api/progress/minigame/complete
     * Complete a minigame session and earn tokens
     */
    static async completeMinigameSession(req, res) {
        try {
            const userId = req.user.uid;
            const { sessionId, result } = req.body;
            
            if (!sessionId || !result) {
                return res.status(400).json({ success: false, message: 'sessionId and result are required' });
            }
            
            // Validate session
            const sessionResult = await MinigameSessionService.completeSession(userId, sessionId, result);
            
            if (!sessionResult.success) {
                return res.json(sessionResult); // Return failure reason (e.g. 'too_fast')
            }
            
            // If successful, award tokens
            if (sessionResult.canClaimReward) {
                const tokenResult = await WalletService.earnTokens(
                    userId, 
                    1, 
                    'EARN_MINIGAME', 
                    { sessionId, gameType: result.gameType }
                );
                
                return res.json({
                    success: true,
                    session: sessionResult,
                    reward: tokenResult
                });
            }
            
            res.json({
                success: true,
                session: sessionResult,
                reward: null
            });
            
        } catch (error) {
            console.error('Error completing minigame session:', error);
            res.status(500).json({ success: false, message: 'Failed to complete session' });
        }
    }

    /**
     * POST /api/progress/wallet/earn
     * Earn tokens (fallback/ads only now)
     * For minigames, use completeMinigameSession instead
     */
    static async earnTokens(req, res) {
        try {
            const userId = req.user.uid;
            const { amount = 1, source = 'minigame', metadata = {} } = req.body;
            
            // Block direct minigame earnings (must use session now)
            if (source === 'minigame') {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Direct minigame earning is deprecated. Use session flow.' 
                });
            }
            
            // Validate amount
            if (!Number.isInteger(amount) || amount < 1 || amount > 10) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid amount. Must be 1-10.' 
                });
            }
            
            // Map source to transaction type
            const sourceType = source === 'ad' ? 'EARN_AD' : 'EARN_MINIGAME';
            
            const result = await WalletService.earnTokens(userId, amount, sourceType, metadata);
            
            res.json(result);
        } catch (error) {
            console.error('Error earning tokens:', error);
            res.status(500).json({ success: false, message: 'Failed to earn tokens' });
        }
    }

    /**
     * POST /api/progress/wallet/spend
     * Spend tokens (general purpose)
     * Body: { amount: number, purpose?: string, metadata?: object }
     */
    static async spendTokens(req, res) {
        try {
            const userId = req.user.uid;
            const { amount, purpose = 'SPEND_UNLOCK', metadata = {} } = req.body;
            
            // Validate amount
            if (!Number.isInteger(amount) || amount < 1) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid amount.' 
                });
            }
            
            const result = await WalletService.spendTokens(userId, amount, purpose, metadata);
            
            res.json(result);
        } catch (error) {
            console.error('Error spending tokens:', error);
            res.status(500).json({ success: false, message: 'Failed to spend tokens' });
        }
    }

    /**
     * GET /api/progress/unlocks
     * Get all unlocked content for user
     */
    static async getUnlocks(req, res) {
        try {
            const userId = req.user.uid;
            const unlocks = await UserProgressService.getUnlockedContent(userId);
            
            res.json({
                success: true,
                unlocks
            });
        } catch (error) {
            console.error('Error getting unlocks:', error);
            res.status(500).json({ success: false, message: 'Failed to get unlocked content' });
        }
    }

    /**
     * POST /api/progress/unlock
     * Unlock a puzzle or topic
     * Body: { contentType: 'PUZZLE' | 'TOPIC', contentId: string }
     */
    static async unlockContent(req, res) {
        try {
            const userId = req.user.uid;
            const { contentType, contentId } = req.body;
            
            // Validate input
            if (!contentType || !contentId) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'contentType and contentId are required' 
                });
            }
            
            if (!['PUZZLE', 'TOPIC'].includes(contentType)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'contentType must be PUZZLE or TOPIC' 
                });
            }
            
            const result = await UserProgressService.unlockContent(userId, contentType, contentId);
            
            res.json(result);
        } catch (error) {
            console.error('Error unlocking content:', error);
            res.status(500).json({ success: false, message: 'Failed to unlock content' });
        }
    }

    /**
     * GET /api/progress/access/:contentType/:contentId
     * Check if user has access to specific content
     */
    static async checkAccess(req, res) {
        try {
            const userId = req.user.uid;
            const { contentType, contentId } = req.params;
            
            const access = await UserProgressService.hasAccess(userId, contentType.toUpperCase(), contentId);
            
            res.json({
                success: true,
                ...access,
                cost: UserProgressService.getUnlockCost(contentType.toUpperCase())
            });
        } catch (error) {
            console.error('Error checking access:', error);
            res.status(500).json({ success: false, message: 'Failed to check access' });
        }
    }

    /**
     * GET /api/progress/transactions
     * Get transaction history
     */
    static async getTransactions(req, res) {
        try {
            const userId = req.user.uid;
            const limit = parseInt(req.query.limit) || 50;
            
            const transactions = await WalletService.getTransactions(userId, Math.min(limit, 100));
            
            res.json({
                success: true,
                transactions
            });
        } catch (error) {
            console.error('Error getting transactions:', error);
            res.status(500).json({ success: false, message: 'Failed to get transactions' });
        }
    }
}

module.exports = ProgressController;
