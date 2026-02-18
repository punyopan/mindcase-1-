/**
 * Payment Service - Hybrid Cloud Integration
 *
 * Connects to the unified backend for all payment operations.
 * NO LocalStorage logic - Backend is the source of truth.
 */

import AppConfig from '../config';

const API_BASE_URL = `${AppConfig.API_URL}/payment`;

// Subscription plans (matches your UI)
const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'usd',
    features: ['2 case files (10 puzzles)', 'Basic analytics', 'Daily minigames (3 tokens/day)', 'Community support'],
    limits: {
      caseFiles: 2,
      maxPuzzles: 10,
      dailyTokens: 3,
      unlockCost: 3
    }
  },
  MONTHLY: {
    id: 'monthly_premium',
    name: 'Monthly Premium',
    price: 599,
    currency: 'usd',
    interval: 'month',
    stripePriceId: 'price_1SlS1iRR1aELApdkpdlcXl2W',
    features: ['Unlimited puzzles', 'Advanced analytics', 'Priority support', 'Ad-free experience'],
    limits: {
      caseFiles: 999,
      maxPuzzles: 999,
      dailyTokens: 0,
      unlockCost: 0
    }
  },
  ANNUAL: {
    id: 'annual_premium',
    name: 'Annual Premium',
    price: 3999,
    currency: 'usd',
    interval: 'year',
    stripePriceId: 'price_1SlS4cRR1aELApdkgW7QFsfi',
    features: ['Unlimited puzzles', 'Advanced analytics', 'Priority support', 'Ad-free experience', 'Exclusive content'],
    limits: {
      caseFiles: 999,
      maxPuzzles: 999,
      dailyTokens: 0,
      unlockCost: 0
    }
  }
};

/**
 * CREATE SUBSCRIPTION (Step 1: Frontend initiates)
 * Calls Backend to get a Stripe Checkout URL
 */
async function createSubscription(userId, planId) {
  if (!userId || !planId) throw new Error('Missing parameters');

  const plan = Object.values(PLANS).find(p => p.id === planId || p.name === planId);
  if (!plan) throw new Error('Invalid plan');

  try {
    const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        userId,
        priceId: plan.stripePriceId || plan.id
      })
    });

    if (!response.ok) throw new Error('Failed to create session');

    const data = await response.json();
    return { url: data.url };
  } catch (error) {
    console.error('Payment Init Failed', error);
    throw error;
  }
}

/**
 * GET USER SUBSCRIPTION (Access Control)
 * Calls Backend for authoritative status
 */
async function getUserSubscription(userId) {
  if (!userId) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/subscription/${userId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      return {
        plan: 'free',
        status: 'inactive',
        features: PLANS.FREE.features
      };
    }

    const data = await response.json();

    if (data.active && data.entitlements.length > 0) {
      const ent = data.entitlements[0];

      let planId = 'monthly_premium';
      if (ent.product_id === 'annual' || ent.product_id === PLANS.ANNUAL.stripePriceId) {
        planId = 'annual_premium';
      } else if (ent.product_id === 'monthly' || ent.product_id === PLANS.MONTHLY.stripePriceId) {
        planId = 'monthly_premium';
      }

      return {
        plan: planId,
        status: 'active',
        currentPeriodEnd: ent.expires_at,
        features: planId === 'annual_premium' ? PLANS.ANNUAL.features : PLANS.MONTHLY.features
      };
    }

    return {
      plan: 'free',
      status: 'inactive',
      features: PLANS.FREE.features
    };
  } catch (error) {
    console.warn('Failed to fetch subscription, defaulting to free', error);
    return {
      plan: 'free',
      status: 'inactive',
      features: PLANS.FREE.features
    };
  }
}

/**
 * CANCEL SUBSCRIPTION
 */
async function cancelSubscription(userId) {
  if (!userId) throw new Error('User ID required');

  try {
    const response = await fetch(`${API_BASE_URL}/cancel-subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userId })
    });

    if (!response.ok) throw new Error('Cancellation failed');
    return await response.json();
  } catch (error) {
    console.error('Cancel failed', error);
    throw error;
  }
}

/**
 * VERIFY SESSION (Step 2: Frontend returns from Stripe)
 */
async function verifySession(sessionId) {
  if (!sessionId) return { success: false };

  try {
    const response = await fetch(`${API_BASE_URL}/verify-session/${sessionId}`, {
      credentials: 'include',
    });
    return await response.json();
  } catch (error) {
    console.error('Session Verification Failed', error);
    return { success: false, error: 'Verification failed' };
  }
}

/**
 * CHECK ACCESS (Sync wrapper — warns about deprecated pattern)
 */
function hasAccess(_userId, _feature) {
  console.warn('hasAccess called synchronously — use getUserSubscription instead');
  return false;
}

/**
 * GET PLAN LIMITS
 */
async function getPlanLimits(userId) {
  const sub = await getUserSubscription(userId);
  const planKey = sub.plan === 'free' ? 'FREE' :
    sub.plan.includes('annual') ? 'ANNUAL' : 'MONTHLY';
  return PLANS[planKey]?.limits || PLANS.FREE.limits;
}

/**
 * CHECK IF PREMIUM
 */
async function isPremium(userId) {
  const sub = await getUserSubscription(userId);
  return sub.status === 'active';
}

export const PaymentService = {
  PLANS,
  createSubscription,
  getUserSubscription,
  verifySession,
  hasAccess,
  getPlanLimits,
  isPremium,
  cancelSubscription
};
