import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, CheckCircle, AlertCircle } from '../icon';

/**
 * Stripe Checkout Component - Production
 * 
 * Redirects to Stripe Hosted Checkout for secure payment processing.
 * On return, verifies the session with the backend.
 */

const API_BASE = 'http://localhost:3000/api/payment';

const StripeCheckout = ({ plan, user, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('initial');

  // Check for return from Stripe on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const paymentResult = urlParams.get('payment');

    if (sessionId && paymentResult === 'success') {
      setVerifying(true);
      setPaymentStatus('verifying');
      verifySession(sessionId);
      
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (paymentResult === 'canceled') {
      setError('Payment was canceled');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const verifySession = async (sessionId) => {
    try {
      const response = await fetch(`${API_BASE}/verify-session/${sessionId}`);
      const data = await response.json();

      if (data.success && data.status === 'paid') {
        setPaymentStatus('succeeded');
        setTimeout(() => {
          onSuccess && onSuccess({ plan: plan?.id || 'premium', status: 'active' });
        }, 1500);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Could not verify payment. Please contact support.');
      setPaymentStatus('initial');
    } finally {
      setVerifying(false);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const planType = plan.interval === 'year' ? 'annual' : 'monthly';
      
      const response = await fetch(`${API_BASE}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          planType: planType
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to create checkout session');
      }

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to start checkout');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl max-w-md w-full border border-amber-700/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900/40 to-red-900/40 p-6 border-b border-amber-700/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-amber-400" />
              {paymentStatus === 'succeeded' ? 'Payment Complete' : 'Secure Checkout'}
            </h2>
            {paymentStatus !== 'verifying' && paymentStatus !== 'succeeded' && (
              <button
                onClick={onClose}
                disabled={loading}
                className="text-stone-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Plan Summary */}
          {plan && (
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
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {paymentStatus === 'initial' && (
            <>
              {/* Security Notice */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-200 text-sm font-medium mb-1">Secure Payment</p>
                    <p className="text-blue-300/70 text-xs">
                      You'll be redirected to Stripe's secure payment page. Your card details never touch our servers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Redirecting to Stripe...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Continue to Payment
                  </>
                )}
              </button>

              <p className="text-center text-stone-500 text-xs mt-4">
                Powered by Stripe • 256-bit encryption
              </p>
            </>
          )}

          {paymentStatus === 'verifying' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-white font-medium mb-2">Verifying Payment...</p>
              <p className="text-stone-400 text-sm">Please wait while we confirm your subscription</p>
            </div>
          )}

          {paymentStatus === 'succeeded' && (
            <div className="text-center py-8">
              <div className="rounded-full h-16 w-16 bg-green-500/20 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <p className="text-white font-bold text-xl mb-2">Payment Successful!</p>
              <p className="text-stone-400 text-sm">Your premium subscription is now active</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;
