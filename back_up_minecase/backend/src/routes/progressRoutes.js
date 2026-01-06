/**
 * Progress Routes
 * API endpoints for wallet and unlock operations
 * All routes require authentication
 */

const express = require('express');
const router = express.Router();
const ProgressController = require('../controllers/progressController');
const { verifyToken } = require('../middleware/authMiddleware');
const { apiLimiter, earnLimiter } = require('../middleware/rateLimitMiddleware');

// All routes require authentication
router.use(verifyToken);
router.use(apiLimiter); // General limit for all routes

// Wallet operations
router.get('/wallet', ProgressController.getWallet);
router.post('/wallet/earn', earnLimiter, ProgressController.earnTokens); // Stricter limit
router.post('/wallet/spend', ProgressController.spendTokens);

// Minigame Anti-Cheat
router.post('/minigame/start', earnLimiter, ProgressController.startMinigameSession); // Stricter limit
router.post('/minigame/complete', earnLimiter, ProgressController.completeMinigameSession); // Stricter limit

// Unlock operations
router.get('/unlocks', ProgressController.getUnlocks);
router.post('/unlock', ProgressController.unlockContent);

// Access check
router.get('/access/:contentType/:contentId', ProgressController.checkAccess);

// Transaction history
router.get('/transactions', ProgressController.getTransactions);

// Streak operations
router.get('/streak', ProgressController.getStreak);
router.post('/streak/activity', ProgressController.recordActivity);
router.post('/streak/sync', ProgressController.syncStreak);

// Data sync operations
router.get('/sync', ProgressController.getSyncedData);
router.post('/sync', ProgressController.syncData);
router.post('/sync/progress', ProgressController.syncProgressData);
router.post('/sync/analytics', ProgressController.syncAnalyticsData);

module.exports = router;


