const express = require('express');
const router = express.Router();
const AdController = require('../controllers/AdController');

// AdMob SSV Callback (called by Google)
router.get('/verify', AdController.verifyAdCallback);

// Client-side reward (backup for web testing)
router.post('/reward', AdController.grantReward);

// Wallet operations
router.get('/balance/:userId', AdController.getBalance);
router.post('/spend', AdController.spendTokens);

module.exports = router;
