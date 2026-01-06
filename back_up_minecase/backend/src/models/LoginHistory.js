const db = require('../db');

class LoginHistory {
    /**
     * Log a login/logout event
     */
    static async create({ userId, action, method, ipAddress, userAgent, platform, browser }) {
        const result = await db.query(
            `INSERT INTO t_login_history (user_id, action, method, ip_address, user_agent, platform, browser)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [userId, action, method, ipAddress, userAgent, platform, browser]
        );
        return result.rows[0];
    }

    /**
     * Get login history for a user (last 50 events)
     */
    static async findByUserId(userId, limit = 50) {
        const result = await db.query(
            `SELECT id, action, method, ip_address as "ipAddress", platform, browser, created_at as timestamp
             FROM t_login_history 
             WHERE user_id = $1 
             ORDER BY created_at DESC 
             LIMIT $2`,
            [userId, limit]
        );
        return result.rows;
    }

    /**
     * Get active sessions (one per login family, non-revoked, non-expired)
     */
    static async getActiveSessions(userId) {
        // Get the most recent valid (non-revoked, non-expired) token per family
        // We need to find tokens where the session is still active
        const result = await db.query(
            `SELECT DISTINCT ON (family_id) id, family_id, ip_address, user_agent, platform, browser, 
                    created_at, last_active
             FROM t_refresh_tokens 
             WHERE user_id = $1 
               AND revoked = FALSE 
               AND expires_at > NOW()
             ORDER BY family_id, last_active DESC NULLS LAST, created_at DESC`,
            [userId]
        );
        return result.rows;
    }

    /**
     * Update last_active timestamp for a session
     */
    static async updateLastActive(tokenId) {
        await db.query(
            'UPDATE t_refresh_tokens SET last_active = NOW() WHERE id = $1',
            [tokenId]
        );
    }
}

module.exports = LoginHistory;
