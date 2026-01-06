/**
 * Payment Controller - Production Stripe Integration
 * Handles Stripe Checkout Sessions and Webhooks
 */

const EntitlementService = require('../services/EntitlementService');
require('dotenv').config();

// Initialize Stripe with real secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Price ID mapping
const PRICE_IDS = {
    monthly: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_1SlS1iRR1aELApdkpdlcXl2W',
    annual: process.env.STRIPE_ANNUAL_PRICE_ID || 'price_1SlS4cRR1aELApdkgW7QFsfi'
};

class PaymentController {

    /**
     * Create Stripe Checkout Session
     * POST /api/payment/create-checkout-session
     */
    static async createStripeCheckoutSession(req, res) {
        const { userId, planType } = req.body; // planType: 'monthly' or 'annual'

        try {
            const priceId = PRICE_IDS[planType] || PRICE_IDS.monthly;
            // IMPORTANT: Use localhost (not 127.0.0.1) to match the backend domain for cookies
            const frontendUrl = process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5501';

            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [{
                    price: priceId,
                    quantity: 1
                }],
                client_reference_id: userId,
                success_url: `${frontendUrl}/back_up_minecase/prod.html?session_id={CHECKOUT_SESSION_ID}&payment=success`,
                cancel_url: `${frontendUrl}/back_up_minecase/prod.html?payment=canceled`,
                metadata: {
                    userId: userId,
                    planType: planType
                }
            });

            console.log(`Created Checkout Session: ${session.id} for User: ${userId}`);
            return res.json({ url: session.url, sessionId: session.id });

        } catch (error) {
            console.error('Checkout Session Error:', error.message);
            res.status(500).json({ error: 'Failed to create checkout session', details: error.message });
        }
    }

    /**
     * Get Subscription Status
     * GET /api/payment/subscription/:userId
     */
    static async getSubscriptionStatus(req, res) {
        const { userId } = req.params;
        console.log(`[PaymentController] Checking subscription for userId: ${userId} (type: ${typeof userId})`);
        
        try {
            const entitlements = await EntitlementService.getUserEntitlements(userId);
            console.log(`[PaymentController] Found ${entitlements.length} entitlements for ${userId}`);
            
            return res.json({ 
                active: entitlements.length > 0,
                entitlements 
            });
        } catch (error) {
            console.error('Get Subscription Error:', error);
            res.status(500).json({ error: 'Failed to fetch status' });
        }
    }

    /**
     * Stripe Webhook Handler
     * POST /api/payment/webhook/stripe
     * 
     * IMPORTANT: This endpoint must receive raw body (not parsed JSON)
     */
    static async handleStripeWebhook(req, res) {
        const sig = req.headers['stripe-signature'];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        
        let event;

        try {
            // Verify webhook signature (CRITICAL for security)
            if (webhookSecret && webhookSecret !== 'whsec_YOUR_WEBHOOK_SECRET') {
                event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
            } else {
                // Development mode - parse without verification
                console.warn('⚠️ Webhook signature not verified (development mode)');
                event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            }
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        console.log(`Received Stripe event: ${event.type}`);

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const userId = session.client_reference_id || session.metadata?.userId;
                const subscriptionId = session.subscription;
                
                console.log(`✅ Checkout completed for User: ${userId}, Subscription: ${subscriptionId}`);
                
                if (userId && subscriptionId) {
                    // Fetch subscription details from Stripe
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                    
                    await EntitlementService.grantEntitlement({
                        userId,
                        provider: 'stripe',
                        providerSubscriptionId: subscriptionId,
                        productId: subscription.items.data[0]?.price?.id || 'premium',
                        expiresAt: new Date(subscription.current_period_end * 1000)
                    });
                }
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                const userId = subscription.metadata?.userId;
                
                if (subscription.status === 'active') {
                    await EntitlementService.grantEntitlement({
                        userId,
                        provider: 'stripe',
                        providerSubscriptionId: subscription.id,
                        productId: subscription.items.data[0]?.price?.id || 'premium',
                        expiresAt: new Date(subscription.current_period_end * 1000)
                    });
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const userId = subscription.metadata?.userId;
                
                console.log(`❌ Subscription canceled for User: ${userId}`);
                await EntitlementService.revokeEntitlement(userId, subscription.id);
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                console.log(`⚠️ Payment failed for subscription: ${invoice.subscription}`);
                // Could notify user or mark subscription as past_due
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    }

    /**
     * Verify Session (called after redirect back from Stripe)
     * GET /api/payment/verify-session/:sessionId
     */
    static async verifySession(req, res) {
        const { sessionId } = req.params;
        console.log(`[VerifySession] Starting verification for session: ${sessionId}`);
        
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            console.log(`[VerifySession] Session status: ${session.payment_status}, userId: ${session.client_reference_id}`);
            
            if (session.payment_status === 'paid') {
                const userId = session.client_reference_id;
                
                // Ensure entitlement is granted
                if (session.subscription) {
                    const subscription = await stripe.subscriptions.retrieve(session.subscription);
                    console.log(`[VerifySession] Granting entitlement for user ${userId}, subscription: ${session.subscription}`);
                    
                    await EntitlementService.grantEntitlement({
                        userId,
                        provider: 'stripe',
                        providerSubscriptionId: session.subscription,
                        productId: subscription.items.data[0]?.price?.id || 'premium',
                        expiresAt: new Date(subscription.current_period_end * 1000)
                    });
                    
                    console.log(`[VerifySession] Entitlement granted successfully!`);
                } else {
                    console.warn(`[VerifySession] No subscription ID in session!`);
                }
                
                return res.json({ 
                    success: true, 
                    status: 'paid',
                    userId 
                });
            }
            
            console.log(`[VerifySession] Payment not completed. Status: ${session.payment_status}`);
            return res.json({ success: false, status: session.payment_status });
            
        } catch (error) {
            console.error('[VerifySession] Error:', error);
            res.status(500).json({ error: 'Failed to verify session' });
        }
    }

    /**
     * Cancel Subscription
     * POST /api/payment/cancel-subscription
     */
    static async cancelSubscription(req, res) {
        const { userId } = req.body;
        
        try {
            // 1. Get active subscription from DB
            const entitlements = await EntitlementService.getUserEntitlements(userId);
            const activeSub = entitlements.find(e => e.provider === 'stripe' && e.status === 'active');
            
            if (!activeSub) {
                return res.status(404).json({ error: 'No active subscription found' });
            }

            // 2. Cancel in Stripe
            // set cancel_at_period_end = true to let it run out, or delete to cancel immediately.
            // Requirement usually is to let it run out.
            const subscription = await stripe.subscriptions.update(activeSub.provider_subscription_id, {
                cancel_at_period_end: true
            });

            // 3. Update DB status?
            // Actually, we rely on the webhook 'customer.subscription.updated' to update the DB.
            // But for immediate UI feedback, we can return success.
            // The subscription object returned has cancel_at_period_end = true.

            console.log(`Subscription ${activeSub.provider_subscription_id} set to cancel at period end.`);

            return res.json({ 
                success: true, 
                message: 'Subscription will be canceled at the end of the billing period.',
                cancelAt: subscription.cancel_at
            });

        } catch (error) {
            console.error('Cancel Subscription Error:', error);
            res.status(500).json({ error: 'Failed to cancel subscription' });
        }
    }
}

module.exports = PaymentController;
