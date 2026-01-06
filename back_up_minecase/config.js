/**
 * Frontend Configuration
 * In production, these values should be injected by the build process or loaded from meta tags
 */
const AppConfig = {
    // API URL - defaults to same origin in production
    API_URL: window.MINDCASE_API_URL || 
             (window.location.hostname === 'localhost' ? 'http://localhost:3000' : '') + '/api',
    
    // Environment
    IS_PRODUCTION: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
    
    // Stripe publishable key (safe to expose)
    STRIPE_PUBLISHABLE_KEY: window.MINDCASE_STRIPE_KEY || 'pk_test_YOUR_KEY',
};

// Make available globally
if (typeof window !== 'undefined') {
    window.AppConfig = AppConfig;
}
