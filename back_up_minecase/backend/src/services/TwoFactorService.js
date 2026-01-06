/**
 * Two-Factor Authentication Service
 * Handles TOTP generation, verification, backup codes, and trusted devices
 */
const { authenticator } = require('otplib');
const QRCode = require('qrcode');
const crypto = require('crypto');
const db = require('../db');

class TwoFactorService {
    
    /**
     * Generate a new TOTP secret for a user (setup step 1)
     */
    static async generateSecret(userId, userEmail) {
        const secret = authenticator.generateSecret();
        const appName = 'MindCase';
        const otpauth = authenticator.keyuri(userEmail, appName, secret);
        
        // Generate QR code as data URL
        const qrCodeDataUrl = await QRCode.toDataURL(otpauth);
        
        // Store secret (not yet enabled)
        await db.query(`
            INSERT INTO t_user_2fa (user_id, totp_secret, enabled)
            VALUES ($1, $2, FALSE)
            ON CONFLICT (user_id) DO UPDATE SET
                totp_secret = EXCLUDED.totp_secret,
                enabled = FALSE,
                updated_at = CURRENT_TIMESTAMP
        `, [userId, secret]);
        
        return {
            secret,
            qrCode: qrCodeDataUrl,
            manualEntry: secret // For manual entry if QR scan fails
        };
    }
    
    /**
     * Verify a TOTP code and enable 2FA (setup step 2)
     */
    static async verifyAndEnable(userId, code) {
        const result = await db.query(
            'SELECT totp_secret FROM t_user_2fa WHERE user_id = $1',
            [userId]
        );
        
        if (result.rows.length === 0) {
            throw new Error('2FA setup not initiated');
        }
        
        const { totp_secret } = result.rows[0];
        const isValid = authenticator.verify({ token: code, secret: totp_secret });
        
        if (!isValid) {
            throw new Error('Invalid verification code');
        }
        
        // Generate backup codes
        const backupCodes = this._generateBackupCodes();
        const hashedCodes = backupCodes.map(c => this._hashCode(c));
        
        // Enable 2FA and store backup codes
        await db.query(`
            UPDATE t_user_2fa 
            SET enabled = TRUE, backup_codes = $2, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $1
        `, [userId, hashedCodes]);
        
        return { success: true, backupCodes };
    }
    
    /**
     * Verify a TOTP code during login
     */
    static async verifyCode(userId, code) {
        const result = await db.query(
            'SELECT totp_secret, backup_codes FROM t_user_2fa WHERE user_id = $1 AND enabled = TRUE',
            [userId]
        );
        
        if (result.rows.length === 0) {
            return false; // 2FA not enabled
        }
        
        const { totp_secret, backup_codes } = result.rows[0];
        
        // First try TOTP
        if (authenticator.verify({ token: code, secret: totp_secret })) {
            return true;
        }
        
        // Then try backup codes
        const hashedInput = this._hashCode(code);
        const codeIndex = (backup_codes || []).indexOf(hashedInput);
        
        if (codeIndex !== -1) {
            // Remove used backup code
            const updatedCodes = [...backup_codes];
            updatedCodes.splice(codeIndex, 1);
            
            await db.query(
                'UPDATE t_user_2fa SET backup_codes = $2 WHERE user_id = $1',
                [userId, updatedCodes]
            );
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Check if user has 2FA enabled
     */
    static async is2FAEnabled(userId) {
        const result = await db.query(
            'SELECT enabled FROM t_user_2fa WHERE user_id = $1',
            [userId]
        );
        return result.rows.length > 0 && result.rows[0].enabled;
    }
    
    /**
     * Disable 2FA
     */
    static async disable(userId) {
        await db.query('DELETE FROM t_user_2fa WHERE user_id = $1', [userId]);
        await db.query('DELETE FROM t_trusted_devices WHERE user_id = $1', [userId]);
        return { success: true };
    }
    
    /**
     * Trust a device for 30 days
     */
    static async trustDevice(userId, req) {
        const deviceHash = this._generateDeviceHash(req);
        const trustedUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        
        await db.query(`
            INSERT INTO t_trusted_devices (user_id, device_hash, trusted_until)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, device_hash) DO UPDATE SET
                trusted_until = EXCLUDED.trusted_until
        `, [userId, deviceHash, trustedUntil]);
        
        return { success: true };
    }
    
    /**
     * Check if device is trusted
     */
    static async isDeviceTrusted(userId, req) {
        const deviceHash = this._generateDeviceHash(req);
        
        const result = await db.query(`
            SELECT 1 FROM t_trusted_devices 
            WHERE user_id = $1 AND device_hash = $2 AND trusted_until > NOW()
        `, [userId, deviceHash]);
        
        return result.rows.length > 0;
    }
    
    // --- Private helpers ---
    
    static _generateBackupCodes() {
        const codes = [];
        for (let i = 0; i < 8; i++) {
            codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
        }
        return codes;
    }
    
    static _hashCode(code) {
        return crypto.createHash('sha256').update(code.toUpperCase()).digest('hex');
    }
    
    static _generateDeviceHash(req) {
        const ua = req.headers['user-agent'] || '';
        const ip = req.ip || req.connection?.remoteAddress || '';
        return crypto.createHash('sha256').update(`${ua}:${ip}`).digest('hex');
    }
}

module.exports = TwoFactorService;
