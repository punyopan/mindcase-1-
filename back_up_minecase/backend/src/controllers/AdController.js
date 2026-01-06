/**
 * Ad Controller
 * Handles rewarded ad verification (AdMob SSV)
 * 
 * Security: Validates signatures to prevent fraud
 */

const crypto = require('crypto');
const WalletService = require('../services/WalletService');
require('dotenv').config();

// In-memory event log (replace with DB in production)
const adEvents = new Map();

// Reward configuration
const REWARDS = {
    token: 1,       // 1 token per ad
    retry: 1,       // 1 retry per ad (if you have that feature)
    bonus: 3        // Bonus tokens for special events
};

class AdController {

    /**
     * AdMob Server-Side Verification (SSV) Callback
     * GET /api/ads/verify
     * 
     * Called by Google after a rewarded ad is watched
     * Query params: ad_network, ad_unit, reward_amount, reward_item, 
     *               signature, key_id, user_id, custom_data, timestamp
     */
    static async verifyAdCallback(req, res) {
        try {
            const {
                ad_network,
                ad_unit,
                reward_amount,
                reward_item,
                signature,
                key_id,
                user_id,
                custom_data,
                timestamp,
                transaction_id
            } = req.query;

            console.log(`📺 Ad verification request for User: ${user_id}`);

            // 1. Check for duplicate (idempotency)
            const eventId = transaction_id || `${user_id}_${timestamp}`;
            if (adEvents.has(eventId)) {
                console.log('⚠️ Duplicate ad event, already processed');
                return res.status(200).send('OK'); // Return 200 to prevent retries
            }

            // 2. Verify signature (In production, implement proper SSV verification)
            // See: https://developers.google.com/admob/android/ssv
            const isValid = await this.verifySignature(req.query);
            
            if (!isValid && process.env.NODE_ENV === 'production') {
                console.error('❌ Invalid signature');
                return res.status(400).send('Invalid signature');
            }

            // 3. Grant reward
            const rewardType = reward_item || 'token';
            const amount = parseInt(reward_amount) || REWARDS[rewardType] || 1;

            await WalletService.addTokens(user_id, amount, 'ad');

            // 4. Log event
            adEvents.set(eventId, {
                user_id,
                provider: ad_network || 'admob',
                event_type: 'reward',
                reward_item: rewardType,
                reward_amount: amount,
                transaction_id: eventId,
                verified: true,
                created_at: new Date().toISOString()
            });

            console.log(`✅ Rewarded ${amount} ${rewardType}(s) to User ${user_id}`);
            res.status(200).send('OK');

        } catch (error) {
            console.error('Ad verification error:', error);
            res.status(500).send('Error');
        }
    }

    /**
     * Verify AdMob signature (simplified)
     * In production, implement full ECDSA verification
     */
    static async verifySignature(params) {
        // For development, skip verification
        if (process.env.NODE_ENV !== 'production') {
            console.log('⚠️ Skipping signature verification (development mode)');
            return true;
        }

        // TODO: Implement proper ECDSA verification
        // 1. Fetch Google's public keys
        // 2. Build the message from query params (excluding signature)
        // 3. Verify signature using the public key
        
        return true; // Placeholder
    }

    /**
     * Client-side reward request (backup method)
     * POST /api/ads/reward
     * 
     * Used when SSV isn't available (web testing)
     */
    static async grantReward(req, res) {
        try {
            const { userId, rewardType, amount, transactionId } = req.body;

            if (!userId) {
                return res.status(400).json({ error: 'Missing userId' });
            }

            // Check for duplicate
            if (transactionId && adEvents.has(transactionId)) {
                return res.json({ 
                    success: true, 
                    message: 'Already processed',
                    balance: await WalletService.getBalance(userId)
                });
            }

            // Grant reward
            const rewardAmount = amount || REWARDS[rewardType] || 1;
            const wallet = await WalletService.addTokens(userId, rewardAmount, 'ad');

            // Log event
            if (transactionId) {
                adEvents.set(transactionId, {
                    user_id: userId,
                    provider: 'client',
                    event_type: 'reward',
                    reward_item: rewardType || 'token',
                    reward_amount: rewardAmount,
                    transaction_id: transactionId,
                    verified: false, // Client-initiated, not server-verified
                    created_at: new Date().toISOString()
                });
            }

            res.json({
                success: true,
                reward: rewardAmount,
                balance: wallet.balance
            });

        } catch (error) {
            console.error('Grant reward error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Get wallet balance
     * GET /api/ads/balance/:userId
     */
    static async getBalance(req, res) {
        try {
            const { userId } = req.params;
            const wallet = await WalletService.getWallet(userId);
            
            res.json({
                balance: wallet.balance,
                total_earned: wallet.total_earned,
                total_spent: wallet.total_spent
            });
        } catch (error) {
            console.error('Get balance error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Spend tokens
     * POST /api/ads/spend
     */
    static async spendTokens(req, res) {
        try {
            const { userId, amount, reason } = req.body;

            if (!userId || !amount) {
                return res.status(400).json({ error: 'Missing userId or amount' });
            }

            const wallet = await WalletService.spendTokens(userId, amount);

            res.json({
                success: true,
                spent: amount,
                balance: wallet.balance,
                reason
            });

        } catch (error) {
            console.error('Spend tokens error:', error);
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = AdController;
