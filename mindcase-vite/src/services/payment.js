/**
 * Payment Service - Hybrid Cloud Integration
 *
 * Connects to the unified backend for all payment operations.
 * NO LocalStorage logic - Backend is the source of truth.
 */

const PaymentService = (() => {
  const API_BASE_URL = 'http://localhost:3000/api/payment'; // Update this if your backend is on a different port/host

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
    
    const plan = Object.values(PLANS).find(p => p.id === planId || p.name === planId /* fallback */);
    if (!plan) throw new Error('Invalid plan');

    try {
      const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          priceId: plan.stripePriceId || plan.id
        })
      });

      if (!response.ok) throw new Error('Failed to create session');
      
      const data = await response.json();
      return { url: data.url }; // Return URL for redirect

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
      const response = await fetch(`${API_BASE_URL}/subscription/${userId}`);
      if (!response.ok) {
         // Fallback to free if backend error or not found
         return {
            plan: 'free',
            status: 'inactive',
            features: PLANS.FREE.features
         };
      }

      const data = await response.json();
      
      if (data.active && data.entitlements.length > 0) {
          // Assuming first entitlement drives the plan for now
          const ent = data.entitlements[0]; 
          
          // MAP Stripe Price ID / stored Product ID to Internal Plan ID
          let planId = 'monthly_premium'; // Default
          
          // Check against known IDs
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
      const response = await fetch(`${API_BASE_URL}/verify-session/${sessionId}`);
      return await response.json();
    } catch (error) {
      console.error('Session Verification Failed', error);
      return { success: false, error: 'Verification failed' };
    }
  }

  /**
   * CHECK ACCESS (Sync/Async Wrapper)
   * Note: This keeps the previous synchronous signature but now warns.
   * ideally this should be awaited.
   */
  function hasAccess(userId, feature) {
     console.warn('hasAccess called synchronously - this relies on cached state which is not implemented yet. Use getUserSubscription');
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

  // Public API
  return {
    PLANS,
    createSubscription,
    getUserSubscription,
    verifySession,
    hasAccess,
    getPlanLimits,
    isPremium,
    cancelSubscription
  };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PaymentService };
}

// Make available globally for browser
if (typeof window !== 'undefined') {
  window.PaymentService = PaymentService;
}
