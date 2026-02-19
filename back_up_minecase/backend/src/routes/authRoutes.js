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
// Accept redirect_uri to know where to return after OAuth
router.get('/google', (req, res, next) => {
    const redirectUri = req.query.redirect_uri || req.headers.referer || '';
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        state: Buffer.from(JSON.stringify({ redirectUri })).toString('base64')
    })(req, res, next);
});
router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5501'}?error=auth_failed` }),
    authController.socialCallback
);

module.exports = router;
