/**
 * Frontend Configuration
 * Uses Vite's import.meta.env for build-time environment variable injection.
 * Set VITE_API_URL in your .env file or CI/CD environment.
 */

/** @type {string} */
const API_URL = import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : typeof window !== 'undefined' && window.location.hostname === '127.0.0.1'
      ? 'http://127.0.0.1:3000/api'
      : 'https://mindcase-backend-u23ay2wrba-as.a.run.app/api');

const AppConfig = {
  API_URL,
  IS_PRODUCTION: import.meta.env.PROD,
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY',
};

// Make available globally for services that read window.AppConfig
if (typeof window !== 'undefined') {
  window.AppConfig = AppConfig;
}

export default AppConfig;
