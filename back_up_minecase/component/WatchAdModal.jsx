import React, { useState, useEffect } from 'react';
import TranslationService from '../services/TranslationService';
import { X, Zap, Clock } from './icon';

const WatchAdModal = ({ onClose, onAdComplete, type = 'token', puzzleId = null, userId }) => {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [stats, setStats] = useState(null);
  const [, setLang] = useState(TranslationService.currentLang);

  useEffect(() => {
    const unsubscribe = TranslationService.subscribe((lang) => setLang(lang));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('WatchAdModal mounted, checking services...');
    console.log('RewardedAdManager available:', typeof window.RewardedAdManager !== 'undefined');
    console.log('RetryManager available:', typeof window.RetryManager !== 'undefined');

    // Check if RewardedAdManager is available
    if (!window.RewardedAdManager) {
      console.error('RewardedAdManager not loaded - services may not be initialized yet');
      return;
    }

    try {
      // Use userId from props (passed from parent)
      const currentUserId = userId || 'default_user';
      console.log('Initializing RewardedAdManager for user:', currentUserId);
      const adManager = new window.RewardedAdManager(currentUserId, { testMode: true });

      // Get current stats
      const currentStats = adManager.getStats();
      console.log('Ad manager stats:', currentStats);
      setStats(currentStats);
      setCooldown(currentStats.cooldownSeconds);

      // Update cooldown timer
      const interval = setInterval(() => {
        const remaining = adManager.getRemainingCooldown();
        setCooldown(remaining);
      }, 1000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error('Error initializing ad manager:', error);
    }
  }, []);

  const handleWatchAd = async () => {
    console.log('handleWatchAd called, type:', type, 'puzzleId:', puzzleId);
    setLoading(true);

    try {
      // Check if services are available
      if (!window.RewardedAdManager) {
        console.error('RewardedAdManager not available when trying to watch ad');
        alert('❌ Ad system not loaded. Please refresh the page.');
        setLoading(false);
        return;
      }

      // Use userId from props
      const currentUserId = userId || 'default_user';
      console.log('Creating RewardedAdManager instance for user:', currentUserId);
      const adManager = new window.RewardedAdManager(currentUserId, { testMode: true });

      let result;
      const actualType = typeof type === 'object' ? type.type : type;
      const actualPuzzleId = typeof type === 'object' ? type.puzzleId : puzzleId;
      console.log('Requesting ad reward - type:', actualType, 'puzzleId:', actualPuzzleId);

      if (actualType === 'token') {
        console.log('Requesting token reward...');
        result = await adManager.requestTokenReward();
        console.log('Token reward result:', result);
      } else if (actualType === 'retry') {
        console.log('Requesting retry reward for puzzle:', actualPuzzleId);
        result = await adManager.requestRetryReward(actualPuzzleId);
        console.log('Retry reward result:', result);
      }

      if (result.success) {
        // Claim the reward
        const claimResult = adManager.claimReward(result.rewardToken);

        if (claimResult.success) {
          // Grant reward based on type
          if (claimResult.type === 'token') {
            const userProgress = window.UserProgressService;
            if (userProgress) {
              console.log('Awarding ad tokens:', claimResult.amount);
              await userProgress.awardAdTokens(currentUserId, claimResult.amount);
            }
          } else if (claimResult.type === 'retry' && actualPuzzleId) {
            if (window.RetryManager) {
              const retryManager = new window.RetryManager(currentUserId);
              retryManager.addAdRetry(actualPuzzleId);
            } else {
              console.error('RetryManager not available');
            }
          }

          // Notify parent component FIRST to update tokens
          onAdComplete?.(result);

          // Wait a moment for state to update
          await new Promise(resolve => setTimeout(resolve, 100));

          // Show success message
          alert(result.message);

          // Close modal
          onClose();
        } else {
          alert('❌ Failed to claim reward. Please try again.');
        }
      } else {
        // Show error message
        alert(result.message || 'Failed to show ad. Please try again.');

        // Update stats after failure
        const currentStats = adManager.getStats();
        setStats(currentStats);
        setCooldown(currentStats.cooldownSeconds);
      }
    } catch (error) {
      console.error('Ad error:', error);
      console.error('Error details:', error.message, error.stack);
      alert(`❌ An error occurred: ${error.message}\n\nCheck console for details.`);
    } finally {
      setLoading(false);
    }
  };

  const formatCooldown = (seconds) => {
    if (seconds <= 0) return null;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const canWatchAd = cooldown <= 0 && stats && stats.remainingToday > 0;
  const actualType = typeof type === 'object' ? type.type : type;
  const isRetryType = actualType === 'retry';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 border-2 border-amber-700/50 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-yellow-900 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Zap className="w-6 h-6" />
              {isRetryType ? TranslationService.t('modals.watch_ad_retry') : TranslationService.t('modals.watch_ad_tokens')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Reward Info */}
          <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border-2 border-amber-600/50 rounded-xl p-6 text-center">
            <div className="text-6xl mb-4">{isRetryType ? '🎯' : '💰'}</div>
            <h3 className="text-2xl font-bold text-amber-400 mb-2">
              {isRetryType ? TranslationService.t('modals.earn_attempt') : TranslationService.t('modals.earn_tokens')}
            </h3>
            <p className="text-stone-300 text-sm mb-4">
              {isRetryType
                ? TranslationService.t('modals.watch_desc_retry')
                : TranslationService.t('modals.watch_desc_tokens')}
            </p>

            {!isRetryType && (
              <div className="bg-black/30 border border-amber-700/30 rounded-lg p-4">
                <div className="text-amber-400 font-bold text-lg mb-1">{TranslationService.t('modals.token_guarantee')}</div>
                <div className="text-green-400 text-sm">{TranslationService.t('modals.bonus_chance')}</div>
              </div>
            )}
          </div>

          {/* Stats */}
          {stats && (
            <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-400">{TranslationService.t('modals.remaining_today')}:</span>
                <span className="text-white font-bold">{stats.remainingToday} / {stats.dailyLimit}</span>
              </div>
              {cooldown > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {TranslationService.t('modals.cooldown')}:
                  </span>
                  <span className="text-amber-400 font-bold">{formatCooldown(cooldown)}</span>
                </div>
              )}
            </div>
          )}

          {/* Watch Button */}
          <button
            onClick={handleWatchAd}
            disabled={!canWatchAd || loading}
            className={`w-full font-bold py-4 px-6 rounded-lg transition-all text-lg flex items-center justify-center gap-2 ${
              canWatchAd && !loading
                ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white shadow-lg hover:shadow-xl'
                : 'bg-stone-700 text-stone-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {TranslationService.t('modals.loading_ad')}
              </>
            ) : cooldown > 0 ? (
              <>
                <Clock className="w-5 h-5" />
                Wait {formatCooldown(cooldown)}
              </>
            ) : stats && stats.remainingToday <= 0 ? (
              TranslationService.t('modals.daily_limit_reached')
            ) : (
              <>
                <Zap className="w-5 h-5" />
                {TranslationService.t('modals.watch_ad_btn')}
              </>
            )}
          </button>

          {/* Info */}
          <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-4 text-center">
            <p className="text-stone-300 text-xs leading-relaxed">
              💡 <strong>{TranslationService.t('modals.ad_tips')}</strong><br/>
              • {TranslationService.t('modals.ad_tip_1')}<br/>
              • {TranslationService.t('modals.ad_tip_2', { count: stats?.dailyLimit || 10 })}<br/>
              • {TranslationService.t('modals.ad_tip_3')}
            </p>
          </div>

          {/* Privacy Notice */}
          <div className="text-center">
            <p className="text-stone-500 text-xs">
              {TranslationService.t('modals.privacy_notice')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchAdModal;
