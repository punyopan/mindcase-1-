const AuthService = require('../services/AuthService');
const TwoFactorService = require('../services/TwoFactorService');
const { body, validationResult } = require('express-validator');
const LoginHistory = require('../models/LoginHistory');
const RefreshToken = require('../models/RefreshToken');
const User = require('../models/User');

/**
 * Extract device info from request headers
 */
const getDeviceInfo = (req) => {
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    
    // Simple platform detection
    let platform = 'Unknown';
    if (userAgent.includes('Windows')) platform = 'Windows';
    else if (userAgent.includes('Mac')) platform = 'macOS';
    else if (userAgent.includes('Linux')) platform = 'Linux';
    else if (userAgent.includes('Android')) platform = 'Android';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) platform = 'iOS';
    
    // Simple browser detection
    let browser = userAgent;
    if (userAgent.includes('Chrome')) browser = 'Chrome ' + (userAgent.match(/Chrome\/(\d+)/)?.[1] || '');
    else if (userAgent.includes('Firefox')) browser = 'Firefox ' + (userAgent.match(/Firefox\/(\d+)/)?.[1] || '');
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    
    return { ipAddress: ip, userAgent, platform, browser };
};

// Validation rules
exports.validateRegister = [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').notEmpty().withMessage('Name is required')
];

exports.validateLogin = [
    body('email').isEmail(),
    body('password').exists()
];

const setRefreshTokenCookie = (res, token) => {
    res.cookie('refresh_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
};

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { user, accessToken, refreshToken } = await AuthService.register(req.body);
        
        setRefreshTokenCookie(res, refreshToken);
        res.status(201).json({ 
            success: true, 
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            accessToken,
            refreshToken
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.login = async (req, res) => {
    console.log('[Auth] LOGIN ENDPOINT HIT - email:', req.body.email);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('[Auth] Validation failed:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const deviceInfo = getDeviceInfo(req);
        const { user, accessToken, refreshToken } = await AuthService.login(req.body, deviceInfo);
        
        // Log the login event
        const historyEntry = await LoginHistory.create({
            userId: user.id,
            action: 'login',
            method: 'email',
            ...deviceInfo
        });
        console.log('[Auth] Login history created:', historyEntry?.id, 'for user:', user.id);
        
        setRefreshTokenCookie(res, refreshToken);
        res.json({ 
            success: true, 
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            accessToken,
            refreshToken
        });
    } catch (err) {
        // Generic error message for security
        res.status(401).json({ success: false, message: req.body.email ? 'Invalid credentials' : err.message });
    }
};

exports.guestLogin = async (req, res) => {
    try {
        const deviceInfo = getDeviceInfo(req);
        const { user, accessToken, refreshToken } = await AuthService.createGuestSession(deviceInfo);
        
        setRefreshTokenCookie(res, refreshToken);
        res.json({ 
            success: true, 
            user: { id: user.id, role: user.role, is_guest: true },
            accessToken,
            refreshToken
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.upgrade = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Ensure only guests call this
    if (!req.user || !req.user.is_guest) {
         return res.status(403).json({ message: 'Only guest accounts can be upgraded' });
    }

    try {
        const { user, accessToken, refreshToken } = await AuthService.upgradeGuestAccount(req.user.uid, req.body);
        
        setRefreshTokenCookie(res, refreshToken);
        res.status(200).json({ 
            success: true, 
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            accessToken,
            refreshToken
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.refresh = async (req, res) => {
    // Accept refresh token from request body (cross-origin) or cookie (same-origin fallback)
    const incomingRefreshToken = req.body.refresh_token || req.cookies.refresh_token;
    console.log('[Auth] Refresh request from origin:', req.headers.origin);
    console.log('[Auth] Token source:', req.body.refresh_token ? 'body' : 'cookie');
    
    if (!incomingRefreshToken) {
        console.log('[Auth] No refresh token found in body or cookies');
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    try {
        const { accessToken, refreshToken } = await AuthService.refreshAccessToken(incomingRefreshToken);
        
        setRefreshTokenCookie(res, refreshToken);
        res.json({ success: true, accessToken, refreshToken });
    } catch (err) {
        res.clearCookie('refresh_token', { path: '/' });
        res.status(403).json({ success: false, message: err.message });
    }
};

exports.logout = async (req, res) => {
    // Accept refresh token from body (cross-origin) or cookie (same-origin fallback)
    const incomingRefreshToken = req.body.refresh_token || req.cookies.refresh_token;

    // Revoke the token family if we have a refresh token
    if (incomingRefreshToken) {
        try {
            const tokenHash = AuthService.hashToken(incomingRefreshToken);
            const storedToken = await RefreshToken.findByTokenHash(tokenHash);
            if (storedToken) {
                const deviceInfo = getDeviceInfo(req);
                await LoginHistory.create({
                    userId: storedToken.user_id,
                    action: 'logout',
                    ...deviceInfo
                });
                await RefreshToken.revokeFamily(storedToken.family_id);
            }
        } catch (e) {
            console.error('Token revocation error:', e);
        }
    }

    res.clearCookie('refresh_token', { path: '/' });
    res.json({ success: true, message: 'Logged out' });
};

/**
 * Social Login Callback (Google/Apple)
 * Called after successful OAuth authentication
 */
exports.socialCallback = async (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5501';
    try {
        if (!req.user) {
            return res.redirect(`${frontendUrl}?error=auth_failed`);
        }

        const deviceInfo = getDeviceInfo(req);
        
        // Generate tokens for the authenticated user
        const { accessToken, refreshToken } = await AuthService.issueTokenPair(req.user, deviceInfo);

        // Log the OAuth login event
        await LoginHistory.create({
            userId: req.user.id,
            action: 'login',
            method: 'google',
            ...deviceInfo
        });
        console.log('[Auth] OAuth login successful for user:', req.user.id);

        // Extract redirect URL from OAuth state
        let redirectUrl = frontendUrl;
        try {
            if (req.query.state) {
                const state = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
                if (state.redirectUri) {
                    redirectUrl = state.redirectUri;
                }
            }
        } catch (e) {
            console.log('[Auth] Could not parse OAuth state, using default redirect');
        }

        // Pass tokens via URL hash fragment (not query params for security)
        // Hash fragments are never sent to the server, keeping tokens client-side only
        const baseUrl = redirectUrl.split('#')[0].split('?')[0];
        res.redirect(`${baseUrl}?auth=success#access_token=${encodeURIComponent(accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}`);
    } catch (err) {
        console.error('Social callback error:', err);
        res.redirect(`${frontendUrl}?error=auth_failed`);
    }
};

/**
 * Get active sessions for current user
 */
exports.getSessions = async (req, res) => {
    try {
        const sessions = await LoginHistory.getActiveSessions(req.user.uid);
        res.json({ success: true, sessions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Get login history for current user
 */
exports.getHistory = async (req, res) => {
    try {
        console.log('[Auth] Fetching history for user:', req.user.uid);
        const history = await LoginHistory.findByUserId(req.user.uid);
        console.log('[Auth] Found', history.length, 'history entries');
        res.json({ success: true, history });
    } catch (err) {
        console.error('[Auth] getHistory error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Revoke a specific session (by family_id)
 */
exports.revokeSession = async (req, res) => {
    try {
        const { familyId } = req.params;
        
        // Revoke by family_id
        await RefreshToken.revokeFamily(familyId);
        
        // Log the action
        const deviceInfo = getDeviceInfo(req);
        await LoginHistory.create({
            userId: req.user.uid,
            action: 'session_revoked',
            ...deviceInfo
        });
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Change password for authenticated user
 */
exports.validatePasswordChange = [
    body('currentPassword').exists().withMessage('Current password required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
];

exports.changePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { currentPassword, newPassword } = req.body;
        await AuthService.changePassword(req.user.uid, currentPassword, newPassword);
        
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * Setup 2FA - Step 1: Generate secret and QR code
 */
exports.setup2FA = async (req, res) => {
    try {
        const user = await User.findById(req.user.uid);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const result = await TwoFactorService.generateSecret(req.user.uid, user.email);
        res.json({ success: true, ...result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Verify 2FA - Step 2: Verify code and enable 2FA
 */
exports.verify2FA = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ success: false, message: 'Verification code required' });
        }

        const result = await TwoFactorService.verifyAndEnable(req.user.uid, code);
        res.json({ success: true, backupCodes: result.backupCodes });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * Disable 2FA
 */
exports.disable2FA = async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ success: false, message: 'Password required' });
        }

        // Verify password first
        const user = await User.findById(req.user.uid);
        const valid = await AuthService.verifyPassword(user.password_hash, password);
        if (!valid) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        await TwoFactorService.disable(req.user.uid);
        res.json({ success: true, message: '2FA disabled' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Check 2FA status
 */
exports.get2FAStatus = async (req, res) => {
    try {
        const enabled = await TwoFactorService.is2FAEnabled(req.user.uid);
        res.json({ success: true, enabled });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Verify 2FA code during login (for 2FA-enabled users)
 */
exports.verify2FALogin = async (req, res) => {
    try {
        const { userId, code, trustDevice } = req.body;
        
        const valid = await TwoFactorService.verifyCode(userId, code);
        if (!valid) {
            return res.status(401).json({ success: false, message: 'Invalid 2FA code' });
        }

        // Trust device if requested
        if (trustDevice) {
            await TwoFactorService.trustDevice(userId, req);
        }

        // Now issue the actual tokens
        const user = await User.findById(userId);
        const deviceInfo = getDeviceInfo(req);
        const { accessToken, refreshToken } = await AuthService.issueTokenPair(user, deviceInfo);

        setRefreshTokenCookie(res, refreshToken);
        res.json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            accessToken,
            refreshToken
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

