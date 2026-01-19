// Rewarded Advertisement Manager
// SDK-agnostic, modular, privacy-compliant rewarded ad system

// Use globals for bundle compatibility (services expose themselves to window)
const AnalyticsService = window.AnalyticsService || { 
    logEvent: (name, data) => console.log(`[Analytics] ${name}`, data) 
};

// AdAdapters are loaded separately and exposed globally
const TestAdAdapter = window.AdAdapters?.TestAdAdapter || class {
    async init() { return true; }
    async isAvailable() { return true; }
    async showRewardedAd() {
        return new Promise(r => setTimeout(() => r({ success: true, rewardId: `test_${Date.now()}` }), 1000));
    }
};
const AdMobWebAdapter = window.AdAdapters?.AdMobWebAdapter || TestAdAdapter;

class FrequencyManager {
  constructor(userId) {
    this.userId = userId;
    this.storageKey = `ad_frequency_${userId}`;
    this.config = {
      cooldownSeconds: 30, // 30 seconds between ads (voluntary viewing)
      dailyLimit: 20 // Increased limit for production
    };
  }

  load() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {
        lastAdTime: 0,
        todayCount: 0,
        lastResetDate: new Date().toDateString()
      };
    } catch (e) {
      console.warn('Failed to load frequency data:', e);
      return {
        lastAdTime: 0,
        todayCount: 0,
        lastResetDate: new Date().toDateString()
      };
    }
  }

  save(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  checkAndUpdate() {
    const data = this.load();
    const now = Date.now();
    const today = new Date().toDateString();

    if (data.lastResetDate !== today) {
      data.todayCount = 0;
      data.lastResetDate = today;
    }

    const timeSinceLastAd = now - data.lastAdTime;
    const cooldownMs = this.config.cooldownSeconds * 1000;
    
    // Cooldown check
    if (timeSinceLastAd < cooldownMs) {
      const remainingSeconds = Math.ceil((cooldownMs - timeSinceLastAd) / 1000);
      return { allowed: false, reason: 'cooldown', remainingSeconds };
    }

    // Daily Limit check
    if (data.todayCount >= this.config.dailyLimit) {
      return { allowed: false, reason: 'daily_limit', limit: this.config.dailyLimit };
    }

    // Speculative update (will be confirmed on success)
    return { allowed: true, remainingToday: this.config.dailyLimit - data.todayCount };
  }
  
  recordSuccess() {
      const data = this.load();
      data.lastAdTime = Date.now();
      data.todayCount++;
      this.save(data);
  }
  
  getRemainingCooldown() {
    const data = this.load();
    const now = Date.now();
    const timeSinceLastAd = now - data.lastAdTime;
    const cooldownMs = this.config.cooldownSeconds * 1000;

    if (timeSinceLastAd >= cooldownMs) {
      return 0;
    }

    return Math.ceil((cooldownMs - timeSinceLastAd) / 1000);
  }
}

// Main Rewarded Ad Manager
class RewardedAdManager {
  constructor(userId, options = {}) {
    this.userId = userId;
    this.options = options;
    
    // Initialize Components
    this.frequencyManager = new FrequencyManager(userId);
    this.analytics = AnalyticsService;
    
    // Select Adapter
    const useTestMode = options.testMode !== false;
    this.adapter = useTestMode ? new TestAdAdapter() : new AdMobWebAdapter();
    
    // Initialize Adapter
    this.adapter.init().catch(e => console.error('Ad Adapter Init Failed:', e));
    
    // Backend API URL
    this.apiUrl = options.apiUrl || 'http://localhost:3000/api';
  }

  async requestTokenReward() {
    return this._requestReward('token');
  }

  async requestRetryReward(puzzleId) {
    return this._requestReward('retry', { puzzleId });
  }

  async _requestReward(rewardType, context = {}) {
    // 1. Check Age Compliance (COPPA)
    if (!this.checkAgeCompliance()) {
      return { success: false, reason: 'age_restricted', message: 'Ads are not available for users under 13.' };
    }

    // 2. Check Frequency
    const freqCheck = this.frequencyManager.checkAndUpdate();
    if (!freqCheck.allowed) {
       this.analytics.logEvent('ad_request_rejected', { reason: freqCheck.reason, userId: this.userId });
       return { 
           success: false, 
           reason: freqCheck.reason, 
           message: freqCheck.reason === 'cooldown' 
               ? `Please wait ${freqCheck.remainingSeconds}s.` 
               : 'Daily limit reached.' 
       };
    }

    // 3. Check Availability
    const available = await this.adapter.isAvailable();
    if (!available) {
       this.analytics.logEvent('ad_not_available', { userId: this.userId });
       return { success: false, reason: 'ad_unavailable', message: 'No ads available.' };
    }

    // 4. Show Ad
    this.analytics.logEvent('ad_started', { userId: this.userId, type: rewardType });
    
    const result = await this.adapter.showRewardedAd();

    if (!result.success) {
        this.analytics.logEvent('ad_failed', { userId: this.userId, reason: result.reason });
        return { success: false, reason: result.reason, message: 'Ad not completed.' };
    }

    // 5. Ad Completed - Verify & Grant Reward
    this.frequencyManager.recordSuccess();
    
    // Trigger Server-Side Verification (Simulated for TestAdapter, actual for AdMob)
    await this._triggerVerification(result, rewardType);

    // 6. Optimistic UI Update (Legacy support)
    // We confirm success to the caller so they can update UI immediately
    // but the real source of truth is the backend DB now.
    
    this.analytics.logEvent('ad_completed', { 
        userId: this.userId, 
        rewardType, 
        transactionId: result.rewardId 
    });

    return {
        success: true,
        rewardToken: result.rewardId, // For legacy compatibility
        amount: rewardType === 'token' ? 1 : 1,
        message: 'Reward granted!'
    };
  }

  /**
   * Simulates the Server-Side Verification call from the Ad Network
   * In production, the Ad Network server calls this, not the Client.
   * But for the Test Adapter, we must simulate it.
   */
  async _triggerVerification(adResult, rewardItem) {
      if (this.adapter.constructor.name === 'TestAdAdapter') {
          console.log('[AdManager] Simulating SSV Callback...');
          try {
              // Construct Mock SSV URL
              const params = new URLSearchParams({
                  user_id: this.userId,
                  ad_network_transaction_id: adResult.rewardId,
                  reward_amount: 1,
                  reward_item: rewardItem,
                  signature: 'mock_ssv_signature',
                  key_id: 'mock_key'
              });
              
              const webhookUrl = `${this.apiUrl}/ads/webhook/admob?${params.toString()}`;
              
              // Fire and forget (or await if we want to debug)
              fetch(webhookUrl).then(r => {
                  console.log(`[AdManager] SSV Callback sent: ${r.status}`);
              }).catch(e => console.error('[AdManager] SSV Callback failed:', e));
              
          } catch (e) {
              console.error('SSV Simulation Error:', e);
          }
      }
  }

  checkAgeCompliance() {
    try {
      const userAge = localStorage.getItem(`user_age_${this.userId}`);
      if (!userAge) return true; // Default compliant if unknown
      return parseInt(userAge) >= 13;
    } catch (e) { return true; }
  }
  
  getStats() {
      const stats = this.frequencyManager.load();
      return {
          todayCount: stats.todayCount,
          dailyLimit: this.frequencyManager.config.dailyLimit,
          remainingToday: this.frequencyManager.config.dailyLimit - stats.todayCount,
          cooldownSeconds: this.frequencyManager.getRemainingCooldown()
      };
  }

  // Legacy Compatibility Methods
  getRemainingCooldown() {
      return this.frequencyManager.getRemainingCooldown();
  }

  claimReward(rewardToken) {
      // In the new architecture, rewards are granted server-side via SSV.
      // This method exists for backward compatibility with existing UI code.
      // It returns success since the reward was already processed.
      console.log('[AdManager] claimReward called (legacy) - token:', rewardToken);
      return { success: true, type: 'token', amount: 1 };
  }
}

// Export
window.RewardedAdManager = RewardedAdManager;
export default RewardedAdManager;
