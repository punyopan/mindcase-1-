const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

class AuthService {
    
    // --- Cryptography ---

    static async hashPassword(password) {
        return await argon2.hash(password);
    }

    static async verifyPassword(hash, password) {
        return await argon2.verify(hash, password);
    }

    static hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    // --- Tokens ---

    static generateAccessToken(user) {
        return jwt.sign(
            {
                uid: user.id,
                role: user.role,
                is_guest: user.is_guest,
                email: user.email,
                name: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
    }

    static generateRefreshToken() {
        return crypto.randomBytes(40).toString('hex');
    }

    // --- Business Logic ---

    static async register({ email, password, name }) {
        const existing = await User.findByEmail(email);
        if (existing) {
            throw new Error('Email already registered');
        }

        const passwordHash = await this.hashPassword(password);
        const user = await User.create({ email, passwordHash, name });
        
        return this.issueTokenPair(user);
    }

    static async upgradeGuestAccount(guestId, { email, password, name }) {
        const existing = await User.findByEmail(email);
        if (existing) {
            throw new Error('Email already registered');
        }

        const passwordHash = await this.hashPassword(password);
        const user = await User.upgradeGuest(guestId, { email, passwordHash, name });
        
        if (!user) {
            throw new Error('Guest account not found or already upgraded');
        }
        
        // Issue new token pair (with updated role/flags)
        return this.issueTokenPair(user);
    }

    static async login({ email, password }, deviceInfo = {}) {
        const user = await User.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }
        
        if (!user.password_hash) {
             throw new Error('User has no password set (Social Login?)');
        }

        const valid = await this.verifyPassword(user.password_hash, password);
        if (!valid) {
            throw new Error('Invalid email or password');
        }

        await User.updateLastLogin(user.id);
        return this.issueTokenPair(user, deviceInfo);
    }

    static async createGuestSession(deviceInfo = {}) {
        const user = await User.createGuest();
        return this.issueTokenPair(user, deviceInfo);
    }

    static async issueTokenPair(user, deviceInfo = {}) {
        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken();
        
        // Save Refresh Token with Family logic
        // For new login, generate new Family ID
        const familyId = uuidv4();
        
        await RefreshToken.create({
            userId: user.id,
            tokenHash: this.hashToken(refreshToken),
            familyId,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            ...deviceInfo
        });

        return { user, accessToken, refreshToken };
    }

    /**
     * Refresh Token Rotation Implementation
     */
    static async refreshAccessToken(incomingRefreshToken) {
        const tokenHash = this.hashToken(incomingRefreshToken);
        const storedToken = await RefreshToken.findByTokenHash(tokenHash);

        // 1. Theft Detection: If token not found, it might be expired or bogus.
        // But if we track "replaced_by", we can see if an old token is being reused.
        if (!storedToken) {
            throw new Error('Invalid refresh token');
        }

        // 2. Reuse Detection (Critical Security)
        if (storedToken.revoked || storedToken.replaced_by_token_id) {
            // This token was already used! It's a replay attack or theft.
            // Revoke the ENTIRE family to lock out the attacker.
            await RefreshToken.revokeFamily(storedToken.family_id);
            throw new Error('Token reuse detected. Session revoked.');
        }

        // 3. Check Expiry
        if (new Date() > new Date(storedToken.expires_at)) {
             throw new Error('Refresh token expired');
        }

        // 4. Valid Token -> Rotate It
        const user = await User.findById(storedToken.user_id);
        if (!user) throw new Error('User not found');

        const newAccessToken = this.generateAccessToken(user);
        const newRefreshToken = this.generateRefreshToken();
        const newFamilyId = storedToken.family_id; // Keep same family

        // Add new token (preserve device info from original token)
        const newTokenRecord = await RefreshToken.create({
            userId: user.id,
            tokenHash: this.hashToken(newRefreshToken),
            familyId: newFamilyId,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            ipAddress: storedToken.ip_address,
            userAgent: storedToken.user_agent,
            platform: storedToken.platform,
            browser: storedToken.browser
        });

        // Mark old token as replaced
        await RefreshToken.markReplaced(storedToken.id, newTokenRecord.id);
        // Also revoke it (logically it's consumed)
        await RefreshToken.revokeToken(storedToken.id);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
}

module.exports = AuthService;
