const db = require('../db');

class User {
    static async findByEmail(email) {
        const result = await db.query(
            'SELECT * FROM t_users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await db.query(
            'SELECT * FROM t_users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async findByGoogleId(googleId) {
        const result = await db.query(
            'SELECT * FROM t_users WHERE google_id = $1',
            [googleId]
        );
        return result.rows[0];
    }

    static async findByAppleId(appleId) {
        const result = await db.query(
            'SELECT * FROM t_users WHERE apple_id = $1',
            [appleId]
        );
        return result.rows[0];
    }

    static async create({ email, passwordHash, name, role = 'USER', isGuest = false }) {
        const result = await db.query(
            `INSERT INTO t_users (email, password_hash, name, role, is_guest)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, email, name, role, is_guest, created_at`,
            [email, passwordHash, name, role, isGuest]
        );
        return result.rows[0];
    }

    static async createSocial({ googleId, appleId, email, name }) {
        // Handle case where email might be null? DB email usually required UNIQUE.
        // For now assume email is present or we use a placeholder if social doesn't provide it?
        // Google usually provides email. Apple might not but usually does proxy.
        // If email is null, generate a unique placeholder? 
        // Better: Make email nullable in DB?? Or use unique placeholder.
        const effectiveEmail = email || `${googleId || appleId}@no-email.mindcase.com`;

        const result = await db.query(
            `INSERT INTO t_users (google_id, apple_id, email, name, role, is_guest)
             VALUES ($1, $2, $3, $4, 'USER', FALSE)
             RETURNING id, email, name, role, is_guest, created_at`,
            [googleId, appleId, effectiveEmail, name || 'Detective']
        );
        return result.rows[0];
    }

    static async linkSocialId(userId, provider, socialId) {
        if (provider === 'google') {
            await db.query('UPDATE t_users SET google_id = $1 WHERE id = $2', [socialId, userId]);
        } else if (provider === 'apple') {
            await db.query('UPDATE t_users SET apple_id = $1 WHERE id = $2', [socialId, userId]);
        }
    }

    static async createGuest() {
        // Guests might not have email/pass initially
        const result = await db.query(
            `INSERT INTO t_users (role, is_guest, name)
             VALUES ('GUEST', TRUE, 'Guest Detective')
             RETURNING id, role, is_guest, created_at`
        );
        return result.rows[0];
    }

    static async upgradeGuest(id, { email, passwordHash, name }) {
        const result = await db.query(
            `UPDATE t_users 
             SET email = $1, password_hash = $2, name = $3, role = 'USER', is_guest = FALSE, updated_at = NOW()
             WHERE id = $4 AND is_guest = TRUE
             RETURNING id, email, name, role, is_guest`,
            [email, passwordHash, name, id]
        );
        return result.rows[0];
    }

    static async updateLastLogin(id) {
        await db.query(
            'UPDATE t_users SET last_login_at = NOW() WHERE id = $1',
            [id]
        );
    }
}

module.exports = User;
