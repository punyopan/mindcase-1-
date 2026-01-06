const db = require('../db');

class RefreshToken {
    static async create({ userId, tokenHash, familyId, expiresAt, ipAddress, userAgent, platform, browser }) {
        const result = await db.query(
            `INSERT INTO t_refresh_tokens (user_id, token_hash, family_id, expires_at, ip_address, user_agent, platform, browser)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [userId, tokenHash, familyId, expiresAt, ipAddress || null, userAgent || null, platform || null, browser || null]
        );
        return result.rows[0];
    }

    static async findByTokenHash(tokenHash) {
        const result = await db.query(
            'SELECT * FROM t_refresh_tokens WHERE token_hash = $1',
            [tokenHash]
        );
        return result.rows[0];
    }

    static async revokeFamily(familyId) {
        await db.query(
            'UPDATE t_refresh_tokens SET revoked = TRUE WHERE family_id = $1',
            [familyId]
        );
    }
    
    static async revokeToken(id) {
        await db.query(
            'UPDATE t_refresh_tokens SET revoked = TRUE WHERE id = $1',
            [id]
        );
    }
    
    static async markReplaced(oldTokenId, newTokenId) {
        await db.query(
            'UPDATE t_refresh_tokens SET replaced_by_token_id = $1 WHERE id = $2',
            [newTokenId, oldTokenId]
        );
    }

    static async deleteExpired() {
        await db.query('DELETE FROM t_refresh_tokens WHERE expires_at < NOW()');
    }
}

module.exports = RefreshToken;
