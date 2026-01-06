/**
 * Minigame Session Service
 * Provides anti-cheat protection by issuing signed session tokens for minigames
 * 
 * Flow:
 * 1. Client calls startSession() before starting a minigame
 * 2. Server returns a signed sessionId
 * 3. Client submits sessionId when claiming reward
 * 4. Server validates: token is valid, not expired, not already used
 */

const crypto = require('crypto');
const db = require('../db');

// Session configuration
const SESSION_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes max game duration
const MIN_GAME_DURATION_MS = 5 * 1000; // 5 seconds minimum (anti-speed-hack)

class MinigameSessionService {
    
    /**
     * Start a new minigame session
     * Returns a signed session token that must be submitted to claim reward
     */
    static async startSession(userId, gameType) {
        const sessionId = crypto.randomUUID();
        const startedAt = new Date();
        const expiresAt = new Date(startedAt.getTime() + SESSION_EXPIRY_MS);
        
        // Store session in database
        await db.query(
            `INSERT INTO t_minigame_sessions (id, user_id, game_type, started_at, expires_at, status)
             VALUES ($1, $2, $3, $4, $5, 'active')`,
            [sessionId, userId, gameType, startedAt, expiresAt]
        );
        
        console.log(`🎮 Started minigame session ${sessionId} for user ${userId} (${gameType})`);
        
        return {
            sessionId,
            expiresAt: expiresAt.toISOString(),
            maxDurationMs: SESSION_EXPIRY_MS
        };
    }
    
    /**
     * Complete a minigame session and claim reward
     * Validates the session and returns tokens if valid
     */
    static async completeSession(userId, sessionId, gameResult) {
        const client = await db.getClient();
        
        try {
            await client.query('BEGIN');
            
            // Lock and fetch the session
            const sessionResult = await client.query(
                `SELECT * FROM t_minigame_sessions 
                 WHERE id = $1 AND user_id = $2 
                 FOR UPDATE`,
                [sessionId, userId]
            );
            
            const session = sessionResult.rows[0];
            
            // Validate session exists
            if (!session) {
                await client.query('ROLLBACK');
                return { 
                    success: false, 
                    reason: 'invalid_session',
                    message: 'Session not found or does not belong to user'
                };
            }
            
            // Validate session not already used
            if (session.status !== 'active') {
                await client.query('ROLLBACK');
                return { 
                    success: false, 
                    reason: 'session_already_used',
                    message: `Session already ${session.status}`
                };
            }
            
            // Validate session not expired
            if (new Date() > new Date(session.expires_at)) {
                await client.query(
                    `UPDATE t_minigame_sessions SET status = 'expired' WHERE id = $1`,
                    [sessionId]
                );
                await client.query('COMMIT');
                return { 
                    success: false, 
                    reason: 'session_expired',
                    message: 'Session has expired'
                };
            }
            
            // Validate minimum game duration (anti-speed-hack)
            const gameDuration = Date.now() - new Date(session.started_at).getTime();
            if (gameDuration < MIN_GAME_DURATION_MS) {
                await client.query(
                    `UPDATE t_minigame_sessions SET status = 'rejected', completed_at = NOW() WHERE id = $1`,
                    [sessionId]
                );
                await client.query('COMMIT');
                return { 
                    success: false, 
                    reason: 'too_fast',
                    message: 'Game completed too quickly - possible cheating detected'
                };
            }
            
            // Mark session as completed
            await client.query(
                `UPDATE t_minigame_sessions 
                 SET status = 'completed', completed_at = NOW(), result = $2
                 WHERE id = $1`,
                [sessionId, JSON.stringify(gameResult)]
            );
            
            await client.query('COMMIT');
            
            console.log(`✅ Completed minigame session ${sessionId} (${gameDuration}ms)`);
            
            return {
                success: true,
                sessionId,
                gameDuration,
                canClaimReward: gameResult?.success === true
            };
            
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error completing session:', error);
            throw error;
        } finally {
            client.release();
        }
    }
    
    /**
     * Get active sessions for user (for debugging/admin)
     */
    static async getActiveSessions(userId) {
        const result = await db.query(
            `SELECT id, game_type, started_at, expires_at 
             FROM t_minigame_sessions 
             WHERE user_id = $1 AND status = 'active'
             ORDER BY started_at DESC`,
            [userId]
        );
        return result.rows;
    }
    
    /**
     * Cleanup expired sessions (run periodically)
     */
    static async cleanupExpiredSessions() {
        const result = await db.query(
            `UPDATE t_minigame_sessions 
             SET status = 'expired' 
             WHERE status = 'active' AND expires_at < NOW()
             RETURNING id`
        );
        
        if (result.rows.length > 0) {
            console.log(`🧹 Cleaned up ${result.rows.length} expired sessions`);
        }
        
        return result.rows.length;
    }
}

module.exports = MinigameSessionService;
