// Rewarded Advertisement Manager
// SDK-agnostic, modular, privacy-compliant rewarded ad system

class FrequencyManager {
  constructor(userId) {
    this.userId = userId;
    this.storageKey = `ad_frequency_${userId}`;
    this.config = {
      cooldownSeconds: 30, // 30 seconds between ads (voluntary viewing)
      dailyLimit: 10 // Max 10 ads per day
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
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save frequency data:', e);
    }
  }

  checkAndUpdate() {
    const data = this.load();
    const now = Date.now();
    const today = new Date().toDateString();

    // Reset daily count if it's a new day
    if (data.lastResetDate !== today) {
      data.todayCount = 0;
      data.lastResetDate = today;
    }

    // Check cooldown (30 seconds)
    const timeSinceLastAd = now - data.lastAdTime;
    const cooldownMs = this.config.cooldownSeconds * 1000;
    if (timeSinceLastAd < cooldownMs) {
      const remainingSeconds = Math.ceil((cooldownMs - timeSinceLastAd) / 1000);
      return {
        allowed: false,
        reason: 'cooldown',
        remainingSeconds
      };
    }

    // Check daily limit
    if (data.todayCount >= this.config.dailyLimit) {
      return {
        allowed: false,
        reason: 'daily_limit',
        limit: this.config.dailyLimit
      };
    }

    // Update counters
    data.lastAdTime = now;
    data.todayCount++;
    this.save(data);

    return {
      allowed: true,
      remainingToday: this.config.dailyLimit - data.todayCount
    };
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

class RewardValidator {
  constructor(userId) {
    this.userId = userId;
    this.storageKey = `ad_rewards_${userId}`;
  }

  generateToken() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  createReward(rewardType, amount) {
    const token = this.generateToken();
    const reward = {
      token,
      type: rewardType,
      amount,
      timestamp: Date.now(),
      claimed: false
    };

    try {
      const history = this.loadHistory();
      history.push(reward);
      // Keep only last 50 rewards
      if (history.length > 50) {
        history.shift();
      }
      localStorage.setItem(this.storageKey, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save reward:', e);
    }

    return token;
  }

  claimReward(token) {
    try {
      const history = this.loadHistory();
      const reward = history.find(r => r.token === token && !r.claimed);

      if (!reward) {
        return { success: false, reason: 'invalid_token' };
      }

      // Check if reward is too old (more than 5 minutes)
      const age = Date.now() - reward.timestamp;
      if (age > 5 * 60 * 1000) {
        return { success: false, reason: 'expired' };
      }

      // Mark as claimed
      reward.claimed = true;
      localStorage.setItem(this.storageKey, JSON.stringify(history));

      return {
        success: true,
        type: reward.type,
        amount: reward.amount
      };
    } catch (e) {
      console.error('Failed to claim reward:', e);
      return { success: false, reason: 'error' };
    }
  }

  loadHistory() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  // Fraud detection - check for suspicious patterns
  detectFraud() {
    const history = this.loadHistory();
    const recentRewards = history.filter(r =>
      Date.now() - r.timestamp < 10 * 60 * 1000 // Last 10 minutes
    );

    // Too many rewards in short time
    if (recentRewards.length > 5) {
      return { suspicious: true, reason: 'rapid_rewards' };
    }

    // Check for timestamp manipulation
    const timestamps = recentRewards.map(r => r.timestamp).sort();
    for (let i = 1; i < timestamps.length; i++) {
      if (timestamps[i] - timestamps[i-1] < 30000) { // Less than 30 seconds apart
        return { suspicious: true, reason: 'rapid_completion' };
      }
    }

    return { suspicious: false };
  }
}

// Test mode adapter for development/testing
class TestAdAdapter {
  constructor() {
    this.available = true;
  }

  async isAvailable() {
    return true;
  }

  async showAd() {
    return new Promise((resolve) => {
      // Simulate ad loading and completion
      console.log('[TEST MODE] Simulating ad playback...');
      setTimeout(() => {
        // 90% success rate in test mode
        const success = Math.random() > 0.1;
        resolve({
          success,
          reason: success ? 'completed' : 'user_canceled'
        });
      }, 1000);
    });
  }
}

// Main Rewarded Ad Manager
class RewardedAdManager {
  constructor(userId, options = {}) {
    this.userId = userId;
    this.frequencyManager = new FrequencyManager(userId);
    this.rewardValidator = new RewardValidator(userId);
    this.testMode = options.testMode !== false; // Default to test mode
    this.adapter = new TestAdAdapter();
    this.analytics = options.analytics || this.createDefaultAnalytics();
  }

  createDefaultAnalytics() {
    return {
      logEvent: (event, data) => {
        console.log(`[Analytics] ${event}:`, data);
      }
    };
  }

  async requestTokenReward() {
    // Check user age compliance (COPPA)
    if (!this.checkAgeCompliance()) {
      return {
        success: false,
        reason: 'age_restricted',
        message: 'Ads are not available for users under 13.'
      };
    }

    // Check frequency limits
    const frequencyCheck = this.frequencyManager.checkAndUpdate();
    if (!frequencyCheck.allowed) {
      let message = 'Please wait before watching another ad.';
      if (frequencyCheck.reason === 'cooldown') {
        const seconds = frequencyCheck.remainingSeconds;
        message = `Please wait ${seconds} second${seconds > 1 ? 's' : ''} before watching another ad.`;
      } else if (frequencyCheck.reason === 'daily_limit') {
        message = `You've reached the daily limit of ${frequencyCheck.limit} ads. Please try again tomorrow!`;
      }

      this.analytics.logEvent('ad_request_rejected', {
        reason: frequencyCheck.reason,
        userId: this.userId
      });

      return {
        success: false,
        reason: frequencyCheck.reason,
        message
      };
    }

    // Check for fraud
    const fraudCheck = this.rewardValidator.detectFraud();
    if (fraudCheck.suspicious) {
      this.analytics.logEvent('fraud_detected', {
        reason: fraudCheck.reason,
        userId: this.userId
      });

      return {
        success: false,
        reason: 'suspicious_activity',
        message: 'Unusual activity detected. Please try again later.'
      };
    }

    // Check if ads are available
    const available = await this.adapter.isAvailable();
    if (!available) {
      this.analytics.logEvent('ad_not_available', { userId: this.userId });
      return {
        success: false,
        reason: 'ad_unavailable',
        message: 'Ads are not available right now. Please try again later.'
      };
    }

    this.analytics.logEvent('ad_request_started', { userId: this.userId });

    // Show the ad
    const result = await this.adapter.showAd();

    if (!result.success) {
      this.analytics.logEvent('ad_not_completed', {
        reason: result.reason,
        userId: this.userId
      });

      return {
        success: false,
        reason: result.reason,
        message: result.reason === 'user_canceled'
          ? 'You need to watch the complete ad to earn tokens.'
          : 'Ad could not be loaded. Please try again.'
      };
    }

    // Calculate reward: 1 token guaranteed + 50% chance for bonus
    const baseTokens = 1;
    const bonusToken = Math.random() < 0.5 ? 1 : 0;
    const totalTokens = baseTokens + bonusToken;

    // Create validated reward token
    const rewardToken = this.rewardValidator.createReward('token', totalTokens);

    this.analytics.logEvent('ad_completed', {
      userId: this.userId,
      tokensEarned: totalTokens,
      hadBonus: bonusToken > 0
    });

    return {
      success: true,
      rewardToken,
      tokens: totalTokens,
      hadBonus: bonusToken > 0,
      message: bonusToken > 0
        ? `🎉 Lucky! You earned ${totalTokens} tokens!`
        : `✅ You earned ${totalTokens} token!`
    };
  }

  async requestRetryReward(puzzleId) {
    // Similar checks as token reward
    if (!this.checkAgeCompliance()) {
      return {
        success: false,
        reason: 'age_restricted',
        message: 'Ads are not available for users under 13.'
      };
    }

    const frequencyCheck = this.frequencyManager.checkAndUpdate();
    if (!frequencyCheck.allowed) {
      let message = 'Please wait before watching another ad.';
      if (frequencyCheck.reason === 'cooldown') {
        const seconds = frequencyCheck.remainingSeconds;
        message = `Please wait ${seconds} second${seconds > 1 ? 's' : ''} before watching another ad.`;
      }
      return {
        success: false,
        reason: frequencyCheck.reason,
        message
      };
    }

    const fraudCheck = this.rewardValidator.detectFraud();
    if (fraudCheck.suspicious) {
      return {
        success: false,
        reason: 'suspicious_activity',
        message: 'Unusual activity detected. Please try again later.'
      };
    }

    const available = await this.adapter.isAvailable();
    if (!available) {
      return {
        success: false,
        reason: 'ad_unavailable',
        message: 'Ads are not available right now. Please try again later.'
      };
    }

    this.analytics.logEvent('retry_ad_request', { userId: this.userId, puzzleId });

    const result = await this.adapter.showAd();

    if (!result.success) {
      return {
        success: false,
        reason: result.reason,
        message: 'Ad could not be completed. Please try again.'
      };
    }

    // Create retry reward token
    const rewardToken = this.rewardValidator.createReward('retry', 1);

    this.analytics.logEvent('retry_ad_completed', { userId: this.userId, puzzleId });

    return {
      success: true,
      rewardToken,
      retries: 1,
      message: '✅ You earned 1 more attempt!'
    };
  }

  claimReward(rewardToken) {
    const result = this.rewardValidator.claimReward(rewardToken);

    if (result.success) {
      this.analytics.logEvent('reward_claimed', {
        userId: this.userId,
        type: result.type,
        amount: result.amount
      });
    } else {
      this.analytics.logEvent('reward_claim_failed', {
        userId: this.userId,
        reason: result.reason
      });
    }

    return result;
  }

  checkAgeCompliance() {
    // Check if user has verified age
    try {
      const userId = localStorage.getItem('userId') || 'default_user';
      const userAge = localStorage.getItem(`user_age_${userId}`);

      // If no age set, assume compliant (default for now)
      if (!userAge) return true;

      // COPPA compliance - no ads for under 13
      return parseInt(userAge) >= 13;
    } catch (e) {
      return true; // Default to compliant if check fails
    }
  }

  getRemainingCooldown() {
    return this.frequencyManager.getRemainingCooldown();
  }

  getStats() {
    const freqData = this.frequencyManager.load();
    return {
      todayCount: freqData.todayCount,
      dailyLimit: this.frequencyManager.config.dailyLimit,
      remainingToday: this.frequencyManager.config.dailyLimit - freqData.todayCount,
      cooldownSeconds: this.getRemainingCooldown()
    };
  }
}

// Export for use in the app
window.RewardedAdManager = RewardedAdManager;

export default RewardedAdManager;
