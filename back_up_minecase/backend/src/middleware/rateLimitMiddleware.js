/**
 * Rate Limiter Middleware
 * Protects API endpoints from abuse
 */

const rateLimit = require('express-rate-limit');

// General API rate limit (standard protection)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { success: false, message: 'Too many requests, please try again later.' }
});

// Stricter limit for token earning (prevent farming)
// 10 requests per minute = sufficient for minigames (which take >5 seconds)
const earnLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10,
    message: { success: false, message: 'Too many earn attempts. Please slow down.' }
});

// Auth endpoints limiter (brute force protection)
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 5 login attempts per hour per IP
    message: { success: false, message: 'Too many login attempts. Please try again in an hour.' }
});

module.exports = {
    apiLimiter,
    earnLimiter,
    authLimiter
};
