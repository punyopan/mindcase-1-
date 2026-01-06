/**
 * Entitlement Service (Mock Mode)
 * The "Brain" of the payment system.
 * Grants access based on verified payments from ANY provider.
 * 
 * NOTE: This is a mock implementation for development.
 * In production, replace with real database calls.
 */

const db = require('../db');

class EntitlementService {
    
    /**
     * Grant or Extend Entitlement
     */
    static async grantEntitlement({ userId, provider, providerSubscriptionId, productId, expiresAt }) {
        console.log(`[DB] Granting entitlement for User ${userId}`);

        // Check if subscription already exists for this provider subscription
        const existing = await db.query(
            `SELECT id FROM t_user_subscriptions
             WHERE user_id = $1 AND provider_subscription_id = $2`,
            [userId, providerSubscriptionId]
        );

        if (existing.rows.length > 0) {
            // Update existing subscription
            await db.query(
                `UPDATE t_user_subscriptions
                 SET status = 'active', expires_at = $1, product_id = $2, updated_at = NOW()
                 WHERE id = $3`,
                [expiresAt, productId, existing.rows[0].id]
            );
        } else {
            // Insert new subscription
            await db.query(
                `INSERT INTO t_user_subscriptions
                 (user_id, provider, provider_subscription_id, status, expires_at, product_id)
                 VALUES ($1, $2, $3, 'active', $4, $5)`,
                [userId, provider, providerSubscriptionId, expiresAt, productId]
            );
        }

        return true;
    }

    /**
     * Get Current Access Level
     */
    static async getUserEntitlements(userId) {
        const result = await db.query(
            `SELECT * FROM t_user_subscriptions
             WHERE user_id = $1 AND status = 'active' AND expires_at > NOW()`,
            [userId]
        );
        return result.rows;
    }

    /**
     * Revoke (Refund/Ban/Cancel)
     */
    static async revokeEntitlement(userId, providerSubscriptionId) {
        await db.query(
            `UPDATE t_user_subscriptions
             SET status = 'revoked', updated_at = NOW()
             WHERE user_id = $1 AND provider_subscription_id = $2`,
            [userId, providerSubscriptionId]
        );
    }
}

module.exports = EntitlementService;
