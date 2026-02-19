/**
 * Data Sync Service (Frontend)
 * Syncs localStorage progress/analytics to server
 */

import AppConfig from '../config.js';
const API_URL = `${AppConfig.API_URL || 'http://localhost:3000/api'}/progress`;

export class DataSyncService {
    static _accessToken = null;
    static _syncInterval = null;
    static _lastSyncVersion = 0;

    /**
     * Initialize sync with access token
     */
    static init(getAccessToken) {
        this._getAccessToken = getAccessToken;
    }

    /**
     * Get current access token
     */
    static _getToken() {
        if (typeof this._getAccessToken === 'function') {
            return this._getAccessToken();
        }
        // Fallback to AuthService
        return window.AuthService?.getAccessToken?.() || null;
    }

    /**
     * Get synced data from server
     */
    static async getSyncedData() {
        const token = this._getToken();
        if (!token) return null;

        try {
            const response = await fetch(`${API_URL}/sync`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this._lastSyncVersion = data.serverVersion || 0;
                    return data;
                }
            }
        } catch (e) {
            console.warn('Failed to get synced data:', e);
        }
        return null;
    }

    /**
     * Sync all data to server
     */
    static async syncAll(progressData, analyticsData) {
        const token = this._getToken();
        if (!token) return { success: false, error: 'Not authenticated' };

        try {
            const response = await fetch(`${API_URL}/sync`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    progressData,
                    analyticsData,
                    clientVersion: this._lastSyncVersion + 1
                })
            });

            const data = await response.json();
            if (data.success) {
                this._lastSyncVersion = data.serverVersion;
                console.log('[Sync] Data synced to server, version:', data.serverVersion);
            }
            return data;
        } catch (e) {
            console.error('Sync failed:', e);
            return { success: false, error: e.message };
        }
    }

    /**
     * Sync progress data only
     */
    static async syncProgress(progressData) {
        const token = this._getToken();
        if (!token) return { success: false, error: 'Not authenticated' };

        try {
            const response = await fetch(`${API_URL}/sync/progress`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ progressData })
            });

            return await response.json();
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    /**
     * Sync analytics data only
     */
    static async syncAnalytics(analyticsData) {
        const token = this._getToken();
        if (!token) return { success: false, error: 'Not authenticated' };

        try {
            const response = await fetch(`${API_URL}/sync/analytics`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ analyticsData })
            });

            return await response.json();
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    /**
     * Start automatic background sync (every 5 minutes)
     */
    static startAutoSync(userId, intervalMs = 5 * 60 * 1000) {
        this.stopAutoSync();
        
        this._syncInterval = setInterval(() => {
            this._performAutoSync(userId);
        }, intervalMs);

        // Initial sync
        setTimeout(() => this._performAutoSync(userId), 5000);

        console.log('[Sync] Auto-sync started');
    }

    /**
     * Stop automatic sync
     */
    static stopAutoSync() {
        if (this._syncInterval) {
            clearInterval(this._syncInterval);
            this._syncInterval = null;
            console.log('[Sync] Auto-sync stopped');
        }
    }

    /**
     * Perform auto sync (internal)
     */
    static async _performAutoSync(userId) {
        try {
            // Get current localStorage data
            const progressKey = `mindcase_user_progress_${userId}`;
            const analyticsKey = `mindcase_analytics_${userId}`;
            
            const progressData = JSON.parse(localStorage.getItem(progressKey) || '{}');
            const analyticsData = JSON.parse(localStorage.getItem(analyticsKey) || '{}');

            // Only sync if there's data
            if (Object.keys(progressData).length > 0 || Object.keys(analyticsData).length > 0) {
                await this.syncAll(progressData, analyticsData);
            }
        } catch (e) {
            console.warn('[Sync] Auto-sync failed:', e);
        }
    }

    /**
     * Restore data from server (after cache clear)
     */
    static async restoreFromServer(userId) {
        const serverData = await this.getSyncedData();
        
        if (!serverData || !serverData.success) {
            return { success: false, error: 'No server data found' };
        }

        // Restore to localStorage
        const progressKey = `mindcase_user_progress_${userId}`;
        const analyticsKey = `mindcase_analytics_${userId}`;

        if (serverData.progressData && Object.keys(serverData.progressData).length > 0) {
            localStorage.setItem(progressKey, JSON.stringify(serverData.progressData));
        }

        if (serverData.analyticsData && Object.keys(serverData.analyticsData).length > 0) {
            localStorage.setItem(analyticsKey, JSON.stringify(serverData.analyticsData));
        }

        console.log('[Sync] Data restored from server');
        return { success: true, restoredAt: new Date().toISOString() };
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.DataSyncService = DataSyncService;
}
