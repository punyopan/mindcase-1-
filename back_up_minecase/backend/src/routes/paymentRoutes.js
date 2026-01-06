const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');

// Web Checkout Endpoints
router.post('/create-checkout-session', PaymentController.createStripeCheckoutSession);
router.get('/subscription/:userId', PaymentController.getSubscriptionStatus);
router.get('/verify-session/:sessionId', PaymentController.verifySession);
router.post('/cancel-subscription', PaymentController.cancelSubscription);

// Stripe Webhook (NOTE: needs raw body, handled in index.js)
router.post('/webhook/stripe', PaymentController.handleStripeWebhook);

module.exports = router;
