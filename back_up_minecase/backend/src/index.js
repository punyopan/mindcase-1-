const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const paymentRoutes = require('./routes/paymentRoutes');
const adRoutes = require('./routes/adRoutes');
const authRoutes = require('./routes/authRoutes');
const progressRoutes = require('./routes/progressRoutes');
const passport = require('./config/passport');
const session = require('express-session');

// Only load .env for local development (doppler injects vars in production)
if (!process.env.DOPPLER_ENVIRONMENT) {
    require('dotenv').config();
}

// Fail fast if critical secrets are missing
if (!process.env.JWT_SECRET) {
    console.error('❌ FATAL: JWT_SECRET environment variable is not set!');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting for auth endpoints (brute-force protection)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per window per IP
    message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false
});

// Security Middleware
app.use(helmet());
app.use(cookieParser());

// CORS - Allow frontend origin
// IMPORTANT: Use consistent domains for cookies to work
// Both localhost and 127.0.0.1 must be allowed for cross-origin cookie handling
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://127.0.0.1:5501', 'http://localhost:5501'].filter(Boolean),
    credentials: true
}));

// Express Session 
app.use(session({
    secret: process.env.JWT_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

try {
    app.use(passport.initialize());
} catch (e) {
    console.error('Passport init failed:', e);
}
// app.use(passport.session()); // Not using sessions for state, but Passport needs it initialized

// Stripe webhook needs raw body for signature verification
app.use('/api/payment/webhook/stripe', bodyParser.raw({ type: 'application/json' }));

// JSON parsing for other routes
app.use(bodyParser.json());

// Apply rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/payment', paymentRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/progress', progressRoutes);

// Health Check
app.get('/', (req, res) => {
    res.json({ 
        status: 'running',
        service: 'MindCase Payment Backend',
        stripe: process.env.STRIPE_SECRET_KEY ? 'configured' : 'missing'
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📦 Stripe: ${process.env.STRIPE_SECRET_KEY ? 'Configured' : '⚠️ Missing STRIPE_SECRET_KEY'}`);
});
