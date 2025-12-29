/**
 * Authentication Service
 * Handles user authentication and session management
 */

const AUTH_STORAGE_KEY = 'mindcase_auth';
const USERS_STORAGE_KEY = 'mindcase_users';

export class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Object} Result with success status and user data or error
   */
  static register({ email, password, name }) {
    // Validation
    if (!email || !password || !name) {
      return { success: false, error: 'All fields are required' };
    }

    if (!this.isValidEmail(email)) {
      return { success: false, error: 'Invalid email format' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    // Check if user already exists
    const users = this.getAllUsers();
    if (users[email]) {
      return { success: false, error: 'Email already registered' };
    }

    // Create new user
    const user = {
      id: this.generateUserId(),
      email,
      name,
      passwordHash: this.hashPassword(password),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    // Save user
    users[email] = user;
    this.saveUsers(users);

    // Create session
    const session = this.createSession(user);

    return {
      success: true,
      user: this.sanitizeUser(user),
      session
    };
  }

  /**
   * Login existing user
   * @param {Object} credentials - Login credentials
   * @returns {Object} Result with success status and user data or error
   */
  static login({ email, password }) {
    // Validation
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    // Get user
    const users = this.getAllUsers();
    const user = users[email];

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Verify password
    if (!this.verifyPassword(password, user.passwordHash)) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    users[email] = user;
    this.saveUsers(users);

    // Create session
    const session = this.createSession(user);

    return {
      success: true,
      user: this.sanitizeUser(user),
      session
    };
  }

  /**
   * Logout current user
   */
  static logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return { success: true };
  }

  /**
   * Get current logged in user
   * @returns {Object|null} Current user or null
   */
  static getCurrentUser() {
    const session = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!session) return null;

    try {
      const { userId, email, expiresAt } = JSON.parse(session);

      // Check if session expired
      if (new Date(expiresAt) < new Date()) {
        this.logout();
        return null;
      }

      // Get user data
      const users = this.getAllUsers();
      const user = users[email];

      return user ? this.sanitizeUser(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  static isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  /**
   * Change user password
   * @param {string} email - User email
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Object} Result
   */
  static changePassword(email, currentPassword, newPassword) {
    const users = this.getAllUsers();
    const user = users[email];

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (!this.verifyPassword(currentPassword, user.passwordHash)) {
      return { success: false, error: 'Current password is incorrect' };
    }

    if (newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters' };
    }

    user.passwordHash = this.hashPassword(newPassword);
    user.passwordChangedAt = new Date().toISOString();
    users[email] = user;
    this.saveUsers(users);

    // Add to login history
    this.addLoginHistory(user.id, 'password_changed');

    return { success: true, message: 'Password changed successfully' };
  }

  /**
   * Enable/Disable 2FA
   * @param {string} userId - User ID
   * @param {boolean} enable - Enable or disable
   * @returns {Object} Result with secret if enabling
   */
  static toggle2FA(userId, enable) {
    const users = this.getAllUsers();
    const user = Object.values(users).find(u => u.id === userId);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (enable) {
      // Generate a simple 2FA secret (in production, use proper TOTP library)
      const secret = this.generate2FASecret();
      user.twoFactorEnabled = true;
      user.twoFactorSecret = secret;
      user.twoFactorBackupCodes = this.generateBackupCodes();
    } else {
      user.twoFactorEnabled = false;
      delete user.twoFactorSecret;
      delete user.twoFactorBackupCodes;
    }

    users[user.email] = user;
    this.saveUsers(users);

    this.addLoginHistory(userId, enable ? '2fa_enabled' : '2fa_disabled');

    return {
      success: true,
      secret: user.twoFactorSecret,
      backupCodes: user.twoFactorBackupCodes
    };
  }

  /**
   * Get all active sessions for a user
   * @param {string} userId - User ID
   * @returns {Array} Active sessions
   */
  static getActiveSessions(userId) {
    const sessionsKey = `mindcase_sessions_${userId}`;
    try {
      const data = localStorage.getItem(sessionsKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Add a session
   * @param {string} userId - User ID
   * @param {Object} sessionInfo - Session information
   */
  static addSession(userId, sessionInfo) {
    const sessions = this.getActiveSessions(userId);
    const session = {
      id: this.generateSessionId(),
      ...sessionInfo,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    sessions.unshift(session);

    // Keep only last 10 sessions
    const recentSessions = sessions.slice(0, 10);

    const sessionsKey = `mindcase_sessions_${userId}`;
    localStorage.setItem(sessionsKey, JSON.stringify(recentSessions));

    return session;
  }

  /**
   * Revoke a specific session
   * @param {string} userId - User ID
   * @param {string} sessionId - Session ID to revoke
   */
  static revokeSession(userId, sessionId) {
    const sessions = this.getActiveSessions(userId);
    const filtered = sessions.filter(s => s.id !== sessionId);

    const sessionsKey = `mindcase_sessions_${userId}`;
    localStorage.setItem(sessionsKey, JSON.stringify(filtered));

    this.addLoginHistory(userId, 'session_revoked');
    return { success: true };
  }

  /**
   * Get login history for a user
   * @param {string} userId - User ID
   * @param {number} limit - Number of entries to return
   * @returns {Array} Login history
   */
  static getLoginHistory(userId, limit = 20) {
    const historyKey = `mindcase_login_history_${userId}`;
    try {
      const data = localStorage.getItem(historyKey);
      const history = data ? JSON.parse(data) : [];
      return history.slice(0, limit);
    } catch (error) {
      return [];
    }
  }

  /**
   * Add entry to login history
   * @param {string} userId - User ID
   * @param {string} action - Action type
   * @param {Object} metadata - Additional info
   */
  static addLoginHistory(userId, action, metadata = {}) {
    const history = this.getLoginHistory(userId, 100);
    const entry = {
      id: this.generateId(),
      action,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      ...metadata
    };

    history.unshift(entry);

    const historyKey = `mindcase_login_history_${userId}`;
    localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 50)));
  }

  // Private helper methods

  static createSession(user) {
    const session = {
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    return session;
  }

  static getAllUsers() {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading users:', error);
      return {};
    }
  }

  static saveUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  static sanitizeUser(user) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }

  static generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  static hashPassword(password) {
    // Simple hash for demo - in production, use bcrypt or similar
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  static verifyPassword(password, hash) {
    return this.hashPassword(password) === hash;
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static generate2FASecret() {
    // Generate a simple 16-character secret
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 16; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  }

  static generateBackupCodes() {
    // Generate 8 backup codes
    const codes = [];
    for (let i = 0; i < 8; i++) {
      const code = Math.random().toString(36).substr(2, 8).toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  static generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  static generateId() {
    return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
