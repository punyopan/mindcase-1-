/**
 * Streak Service
 * Handles daily streak tracking with UTC date normalization
 */
const db = require('../db');

class StreakService {
    
    /**
     * Get user's current streak data
     */
    static async getStreak(userId) {
        const result = await db.query(
            'SELECT current_streak, max_streak, last_activity_date FROM t_user_streaks WHERE user_id = $1',
            [userId]
        );
        
        if (result.rows.length === 0) {
            return { currentStreak: 0, maxStreak: 0, lastActivityDate: null };
        }
        
        const row = result.rows[0];
        return {
            currentStreak: row.current_streak,
            maxStreak: row.max_streak,
            lastActivityDate: row.last_activity_date
        };
    }
    
    /**
     * Record activity and update streak
     * Uses UTC dates to avoid timezone issues
     */
    static async recordActivity(userId) {
        const todayUTC = this._getUTCDateString();
        
        // Get current streak data
        const result = await db.query(
            'SELECT id, current_streak, max_streak, last_activity_date FROM t_user_streaks WHERE user_id = $1',
            [userId]
        );
        
        if (result.rows.length === 0) {
            // First activity ever - create record
            await db.query(`
                INSERT INTO t_user_streaks (user_id, current_streak, max_streak, last_activity_date)
                VALUES ($1, 1, 1, $2)
            `, [userId, todayUTC]);
            
            return { currentStreak: 1, maxStreak: 1, streakIncreased: true };
        }
        
        const row = result.rows[0];
        const lastDate = row.last_activity_date ? this._formatDate(row.last_activity_date) : null;
        
        // Already recorded today
        if (lastDate === todayUTC) {
            return { 
                currentStreak: row.current_streak, 
                maxStreak: row.max_streak, 
                streakIncreased: false 
            };
        }
        
        const yesterdayUTC = this._getYesterdayUTCDateString();
        let newStreak;
        let streakIncreased = true;
        
        if (lastDate === yesterdayUTC) {
            // Continue streak
            newStreak = row.current_streak + 1;
        } else {
            // Streak broken - start fresh
            newStreak = 1;
            streakIncreased = false;
        }
        
        const newMax = Math.max(newStreak, row.max_streak);
        
        await db.query(`
            UPDATE t_user_streaks 
            SET current_streak = $2, max_streak = $3, last_activity_date = $4, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $1
        `, [userId, newStreak, newMax, todayUTC]);
        
        return { currentStreak: newStreak, maxStreak: newMax, streakIncreased };
    }
    
    /**
     * Sync streak from client (for offline-first support)
     * Server wins if it has a higher streak
     */
    static async syncStreak(userId, clientStreak, clientLastDate) {
        const serverData = await this.getStreak(userId);
        
        // Server has higher streak - keep server data
        if (serverData.currentStreak >= clientStreak) {
            return serverData;
        }
        
        // Client has higher streak - update server (trust client for offline recovery)
        const newMax = Math.max(clientStreak, serverData.maxStreak);
        
        const result = await db.query(
            'SELECT 1 FROM t_user_streaks WHERE user_id = $1',
            [userId]
        );
        
        if (result.rows.length === 0) {
            await db.query(`
                INSERT INTO t_user_streaks (user_id, current_streak, max_streak, last_activity_date)
                VALUES ($1, $2, $3, $4)
            `, [userId, clientStreak, newMax, clientLastDate]);
        } else {
            await db.query(`
                UPDATE t_user_streaks 
                SET current_streak = $2, max_streak = $3, last_activity_date = $4, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = $1
            `, [userId, clientStreak, newMax, clientLastDate]);
        }
        
        return { currentStreak: clientStreak, maxStreak: newMax, lastActivityDate: clientLastDate };
    }
    
    // --- Private helpers ---
    
    static _getUTCDateString() {
        const now = new Date();
        return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
    }
    
    static _getYesterdayUTCDateString() {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return `${yesterday.getUTCFullYear()}-${String(yesterday.getUTCMonth() + 1).padStart(2, '0')}-${String(yesterday.getUTCDate()).padStart(2, '0')}`;
    }
    
    static _formatDate(date) {
        if (!date) return null;
        const d = new Date(date);
        return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
    }
}

module.exports = StreakService;
