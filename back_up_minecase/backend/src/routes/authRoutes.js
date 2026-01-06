const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const passport = require('passport');

router.post('/register', authController.validateRegister, authController.register);
router.post('/login', authController.validateLogin, authController.login);
router.post('/guest', authController.guestLogin);
router.post('/upgrade', verifyToken, authController.validateRegister, authController.upgrade);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// Session management routes (requires authentication)
router.get('/sessions', verifyToken, authController.getSessions);
router.get('/history', verifyToken, authController.getHistory);
router.delete('/sessions/:familyId', verifyToken, authController.revokeSession);

// Password change (requires authentication)
router.post('/change-password', verifyToken, authController.validatePasswordChange, authController.changePassword);

// 2FA routes (requires authentication)
router.post('/2fa/setup', verifyToken, authController.setup2FA);
router.post('/2fa/verify', verifyToken, authController.verify2FA);
router.post('/2fa/disable', verifyToken, authController.disable2FA);
router.get('/2fa/status', verifyToken, authController.get2FAStatus);
router.post('/2fa/login', authController.verify2FALogin); // Not protected - used during login flow

// Social Login Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/login?error=auth_failed' }),
    authController.socialCallback
);

module.exports = router;
