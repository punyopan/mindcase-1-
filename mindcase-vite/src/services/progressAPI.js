/**
 * Progress API Client
 * Frontend client for communicating with the server-side token system
 */

import AppConfig from '../config.js';
const PROGRESS_API_URL = `${AppConfig.API_URL || 'http://localhost:3000/api'}/progress`;

// Get access token from AuthService
function getAccessToken() {
    // Import dynamically to avoid circular dependencies
    const { AuthService } = window;
    return AuthService?.getAccessToken?.() || null;
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
    const token = getAccessToken();
    
    if (!token) {
        throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${PROGRESS_API_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }
    
    return data;
}

/**
 * Progress API Client
 */
const ProgressAPI = {
    /**
     * Get user's wallet (balance, daily stats)
     */
    async getWallet() {
        return apiRequest('/wallet');
    },
    
    /**
     * Earn tokens (from minigame or ad)
     */
    async earnTokens(amount = 1, source = 'minigame', metadata = {}) {
        return apiRequest('/wallet/earn', {
            method: 'POST',
            body: JSON.stringify({ amount, source, metadata })
        });
    },
    
    /**
     * Start a minigame session (anti-cheat)
     */
    async startSession(gameType) {
        return apiRequest('/minigame/start', {
            method: 'POST',
            body: JSON.stringify({ gameType })
        });
    },
    
    /**
     * Complete a minigame session and claim reward
     */
    async completeSession(sessionId, result) {
        return apiRequest('/minigame/complete', {
            method: 'POST',
            body: JSON.stringify({ sessionId, result })
        });
    },
    
    /**
     * Spend tokens
     */
    async spendTokens(amount, purpose = 'SPEND_UNLOCK', metadata = {}) {
        return apiRequest('/wallet/spend', {
            method: 'POST',
            body: JSON.stringify({ amount, purpose, metadata })
        });
    },
    
    /**
     * Get all unlocked content
     */
    async getUnlocks() {
        return apiRequest('/unlocks');
    },
    
    /**
     * Unlock a puzzle or topic
     */
    async unlockContent(contentType, contentId) {
        return apiRequest('/unlock', {
            method: 'POST',
            body: JSON.stringify({ contentType, contentId })
        });
    },
    
    /**
     * Check access to content
     */
    async checkAccess(contentType, contentId) {
        return apiRequest(`/access/${contentType}/${contentId}`);
    },
    
    /**
     * Get transaction history
     */
    async getTransactions(limit = 50) {
        return apiRequest(`/transactions?limit=${limit}`);
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ProgressAPI = ProgressAPI;
}

export default ProgressAPI;
