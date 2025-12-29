import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, CheckCircle } from '../icon';

/**
 * Stripe Checkout Component
 *
 * SECURITY ARCHITECTURE:
 * - This component NEVER sees card data
 * - Stripe.js loads card input in secure iframe
 * - All payment decisions made by backend
 * - Frontend only displays UI and initiates flow
 *
 * FLOW:
 * 1. User clicks "Subscribe"
 * 2. Frontend calls backend: createSubscription()
 * 3. Backend returns client_secret
 * 4. Frontend mounts Stripe payment form
 * 5. User enters card (DIRECTLY INTO STRIPE, not our app)
 * 6. Stripe processes payment
 * 7. Stripe sends webhook to backend
 * 8. Backend verifies and activates subscription
 * 9. Frontend polls backend to check activation status
 */

const StripeCheckout = ({ plan, user, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('initial'); // initial, processing, succeeded, failed
  const [clientSecret, setClientSecret] = useState(null);
  const [subscriptionId, setSubscriptionId] = useState(null);

  // Simulate Stripe.js (in production, load from https://js.stripe.com/v3/)
  const [stripeLoaded, setStripeLoaded] = useState(false);

  useEffect(() => {
    // In production, load Stripe.js dynamically
    // const script = document.createElement('script');
    // script.src = 'https://js.stripe.com/v3/';
    // script.onload = () => setStripeLoaded(true);
    // document.head.appendChild(script);

    // For demo, simulate loaded
    setTimeout(() => setStripeLoaded(true), 500);
  }, []);

  /**
   * STEP 1: Initialize Payment
   * Frontend requests backend to create subscription
   */
  const handleInitiatePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use global PaymentService (loaded via payment.js)
      if (!window.PaymentService) {
        throw new Error('Payment service not loaded');
      }

      // Backend creates subscription and returns client secret
      const response = window.PaymentService.createSubscription(user.id, plan.id);

      setClientSecret(response.clientSecret);
      setSubscriptionId(response.subscriptionId);
      setPaymentStatus('processing');
    } catch (err) {
      setError(err.message || 'Failed to initialize payment');
      setLoading(false);
    }
  };

  /**
   * STEP 2: Process Payment
   * User submits card details to Stripe (NOT to our backend)
   */
  const handleSubmitPayment = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      // In production, use actual Stripe.js:
      // const stripe = Stripe('pk_live_YOUR_PUBLIC_KEY');
      // const { error } = await stripe.confirmCardPayment(clientSecret, {
      //   payment_method: {
      //     card: cardElement, // Stripe-hosted card input
      //     billing_details: { name: user.name, email: user.email }
      //   }
      // });

      // Simulate successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      // ⚠️ CRITICAL SECURITY RULE ⚠️
      // Even if Stripe returns "success" here, we DO NOT grant access
      // We wait for backend webhook to verify and activate subscription

      setPaymentStatus('verifying');

      // Poll backend to check if webhook processed subscription
      pollSubscriptionStatus();
    } catch (err) {
      setError(err.message || 'Payment failed');
      setProcessing(false);
      setPaymentStatus('failed');
    }
  };

  /**
   * STEP 3: Poll Backend for Confirmation
   * Frontend checks if backend received and verified webhook
   */
  const pollSubscriptionStatus = async () => {
    const maxAttempts = 20; // Poll for ~10 seconds
    let attempts = 0;

    const checkStatus = async () => {
      attempts++;

      try {
        if (!window.PaymentService) {
          throw new Error('Payment service not loaded');
        }

        const subscription = window.PaymentService.getUserSubscription(user.id);

        if (subscription && subscription.status === 'active') {
          // Backend confirmed subscription is active
          setPaymentStatus('succeeded');
          setProcessing(false);

          setTimeout(() => {
            onSuccess && onSuccess(subscription);
          }, 1500);
          return true;
        }

        if (attempts >= maxAttempts) {
          throw new Error('Payment verification timeout. Please refresh and check your account.');
        }

        // Continue polling
        setTimeout(checkStatus, 500);
      } catch (err) {
        setError(err.message);
        setProcessing(false);
        setPaymentStatus('failed');
      }
    };

    checkStatus();
  };

  /**
   * DEMO MODE: Simulate successful payment
   * In production, this button should NOT exist
   */
  const handleDemoPayment = async () => {
    setProcessing(true);
    setPaymentStatus('processing');

    try {
      if (!window.PaymentService) {
        throw new Error('Payment service not loaded');
      }

      // Simulate webhook processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      window.PaymentService.simulatePaymentSuccess(user.id, plan.id);

      setPaymentStatus('succeeded');
      setProcessing(false);

      setTimeout(() => {
        const subscription = window.PaymentService.getUserSubscription(user.id);
        onSuccess && onSuccess(subscription);
      }, 1500);
    } catch (err) {
      setError(err.message);
      setProcessing(false);
      setPaymentStatus('failed');
    }
  };

  if (!stripeLoaded) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-stone-900 rounded-2xl p-8 max-w-md w-full border border-amber-700/30">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-stone-400">Loading secure payment system...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl max-w-md w-full border border-amber-700/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900/40 to-red-900/40 p-6 border-b border-amber-700/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-amber-400" />
              Secure Checkout
            </h2>
            <button
              onClick={onClose}
              disabled={processing}
              className="text-stone-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Plan Summary */}
          <div className="bg-stone-800/60 rounded-lg p-4 border border-stone-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-stone-300 font-medium">{plan.name}</span>
              <span className="text-amber-400 font-bold text-xl">
                ${(plan.price / 100).toFixed(2)}
              </span>
            </div>
            <p className="text-stone-500 text-sm">
              Billed {plan.interval === 'year' ? 'annually' : 'monthly'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Security Notice */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-200 text-sm font-medium mb-1">Secure Payment</p>
                <p className="text-blue-300/70 text-xs">
                  Your payment is processed securely by Stripe. We never see or store your card details.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Payment Status */}
          {paymentStatus === 'initial' && (
            <div>
              {/* Payment Form Placeholder */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-stone-300 text-sm font-medium mb-2">
                    Card Information
                  </label>
                  <div className="bg-stone-800 border border-stone-700 rounded-lg p-4 text-center text-stone-500 text-sm">
                    🔒 Stripe secure payment form loads here
                    <br />
                    <span className="text-xs">(Card data never touches our servers)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleInitiatePayment}
                  disabled={loading || processing}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Initializing...' : `Subscribe for $${(plan.price / 100).toFixed(2)}/${plan.interval === 'year' ? 'year' : 'month'}`}
                </button>

                {/* DEMO MODE ONLY - Remove in production */}
                <button
                  onClick={handleDemoPayment}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all border-2 border-green-400"
                >
                  🔧 Demo Mode: Simulate Payment
                </button>
                <p className="text-xs text-stone-500 text-center">
                  Demo mode for testing - Replace with real Stripe integration
                </p>
              </div>
            </div>
          )}

          {paymentStatus === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-white font-medium mb-2">Processing Payment...</p>
              <p className="text-stone-400 text-sm">Please do not close this window</p>
            </div>
          )}

          {paymentStatus === 'verifying' && (
            <div className="text-center py-8">
              <div className="animate-pulse">
                <div className="rounded-full h-16 w-16 bg-amber-500/20 mx-auto mb-4 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-amber-400" />
                </div>
              </div>
              <p className="text-white font-medium mb-2">Verifying Payment...</p>
              <p className="text-stone-400 text-sm">Confirming with our secure servers</p>
            </div>
          )}

          {paymentStatus === 'succeeded' && (
            <div className="text-center py-8">
              <div className="rounded-full h-16 w-16 bg-green-500/20 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <p className="text-white font-bold text-xl mb-2">Payment Successful!</p>
              <p className="text-stone-400 text-sm">Your subscription is now active</p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center py-8">
              <div className="rounded-full h-16 w-16 bg-red-500/20 mx-auto mb-4 flex items-center justify-center">
                <X className="w-10 h-10 text-red-400" />
              </div>
              <p className="text-white font-bold text-xl mb-2">Payment Failed</p>
              <p className="text-stone-400 text-sm mb-4">{error || 'Please try again'}</p>
              <button
                onClick={() => {
                  setPaymentStatus('initial');
                  setError(null);
                }}
                className="bg-stone-700 hover:bg-stone-600 text-white font-medium py-2 px-6 rounded-lg transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Trust Badges */}
          {paymentStatus === 'initial' && (
            <div className="mt-6 pt-6 border-t border-stone-700">
              <div className="flex items-center justify-center gap-6 text-stone-500 text-xs">
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>256-bit SSL</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>PCI Compliant</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Powered by Stripe</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;
