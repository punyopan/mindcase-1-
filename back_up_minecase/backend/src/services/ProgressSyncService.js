/**
 * Progress Sync Service
 * Handles syncing localStorage progress/analytics data to server
 * Implements last-write-wins with version tracking
 */
const db = require('../db');

class ProgressSyncService {
    
    /**
     * Get current synced data for user
     */
    static async getSyncedData(userId) {
        const result = await db.query(
            `SELECT progress_data, analytics_data, last_synced_at, client_version, server_version 
             FROM t_user_progress_sync WHERE user_id = $1`,
            [userId]
        );
        
        if (result.rows.length === 0) {
            return {
                progressData: {},
                analyticsData: {},
                lastSyncedAt: null,
                clientVersion: 0,
                serverVersion: 0
            };
        }
        
        const row = result.rows[0];
        return {
            progressData: row.progress_data || {},
            analyticsData: row.analytics_data || {},
            lastSyncedAt: row.last_synced_at,
            clientVersion: row.client_version,
            serverVersion: row.server_version
        };
    }
    
    /**
     * Sync progress data from client
     * Uses last-write-wins strategy
     */
    static async syncProgress(userId, progressData, clientVersion = 1) {
        // Validate progressData structure
        if (typeof progressData !== 'object' || progressData === null) {
            throw new Error('Invalid progress data format');
        }
        
        const result = await db.query(
            'SELECT server_version FROM t_user_progress_sync WHERE user_id = $1',
            [userId]
        );
        
        const newServerVersion = (result.rows[0]?.server_version || 0) + 1;
        
        if (result.rows.length === 0) {
            // First sync - insert
            await db.query(`
                INSERT INTO t_user_progress_sync (user_id, progress_data, client_version, server_version, last_synced_at)
                VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            `, [userId, JSON.stringify(progressData), clientVersion, newServerVersion]);
        } else {
            // Update existing
            await db.query(`
                UPDATE t_user_progress_sync 
                SET progress_data = $2, client_version = $3, server_version = $4, 
                    last_synced_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = $1
            `, [userId, JSON.stringify(progressData), clientVersion, newServerVersion]);
        }
        
        return { success: true, serverVersion: newServerVersion };
    }
    
    /**
     * Sync analytics data from client
     */
    static async syncAnalytics(userId, analyticsData, clientVersion = 1) {
        if (typeof analyticsData !== 'object' || analyticsData === null) {
            throw new Error('Invalid analytics data format');
        }
        
        const result = await db.query(
            'SELECT server_version FROM t_user_progress_sync WHERE user_id = $1',
            [userId]
        );
        
        const newServerVersion = (result.rows[0]?.server_version || 0) + 1;
        
        if (result.rows.length === 0) {
            await db.query(`
                INSERT INTO t_user_progress_sync (user_id, analytics_data, client_version, server_version, last_synced_at)
                VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            `, [userId, JSON.stringify(analyticsData), clientVersion, newServerVersion]);
        } else {
            await db.query(`
                UPDATE t_user_progress_sync 
                SET analytics_data = $2, client_version = $3, server_version = $4,
                    last_synced_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = $1
            `, [userId, JSON.stringify(analyticsData), clientVersion, newServerVersion]);
        }
        
        return { success: true, serverVersion: newServerVersion };
    }
    
    /**
     * Full sync - both progress and analytics
     */
    static async syncAll(userId, progressData, analyticsData, clientVersion = 1) {
        if (typeof progressData !== 'object' || progressData === null) {
            progressData = {};
        }
        if (typeof analyticsData !== 'object' || analyticsData === null) {
            analyticsData = {};
        }
        
        const result = await db.query(
            'SELECT server_version FROM t_user_progress_sync WHERE user_id = $1',
            [userId]
        );
        
        const newServerVersion = (result.rows[0]?.server_version || 0) + 1;
        
        if (result.rows.length === 0) {
            await db.query(`
                INSERT INTO t_user_progress_sync (user_id, progress_data, analytics_data, client_version, server_version, last_synced_at)
                VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
            `, [userId, JSON.stringify(progressData), JSON.stringify(analyticsData), clientVersion, newServerVersion]);
        } else {
            await db.query(`
                UPDATE t_user_progress_sync 
                SET progress_data = $2, analytics_data = $3, client_version = $4, server_version = $5,
                    last_synced_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = $1
            `, [userId, JSON.stringify(progressData), JSON.stringify(analyticsData), clientVersion, newServerVersion]);
        }
        
        return { success: true, serverVersion: newServerVersion };
    }
}

module.exports = ProgressSyncService;
