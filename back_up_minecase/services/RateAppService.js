/**
 * Rate App Service
 * Manages prompting users to rate the app after reaching engagement thresholds
 */

const RateAppService = (() => {
  const STORAGE_KEY = 'mindcase_rate_app';
  
  // Thresholds for showing rate prompt (total activities: minigames + puzzles)
  const PROMPT_THRESHOLDS = [5, 15, 30];
  
  // Store URLs (update these with actual app store links)
  const STORE_URLS = {
    android: 'https://play.google.com/store/apps/details?id=com.mindcase.app',
    ios: 'https://apps.apple.com/app/mindcase/id123456789',
    web: 'https://mindcase.app/rate' // Fallback for web
  };

  /**
   * State Schema:
   * {
   *   hasRated: boolean,      // User clicked "Rate Now" - never show again
   *   hasDismissed: boolean,  // User clicked "No Thanks" - never show again
   *   lastPromptThreshold: number, // Last threshold that triggered prompt
   *   promptCount: number     // How many times we've shown the prompt
   * }
   */

  function getDefaultState() {
    return {
      hasRated: false,
      hasDismissed: false,
      lastPromptThreshold: 0,
      promptCount: 0
    };
  }

  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...getDefaultState(), ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('[RateApp] Failed to load state:', e);
    }
    return getDefaultState();
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('[RateApp] Failed to save state:', e);
    }
  }

  /**
   * Get current participation count from UserProgressService
   */
  function getParticipationCount(userId) {
    if (!window.UserProgressService) {
      console.warn('[RateApp] UserProgressService not available');
      return 0;
    }

    try {
      // Load progress to get counts
      const storageKey = 'mindcase_user_progress';
      const stored = localStorage.getItem(`${storageKey}_${userId}`);
      if (stored) {
        const progress = JSON.parse(stored);
        const minigames = progress.totalMinigamesCompleted || 0;
        const puzzles = progress.totalPuzzlesCompleted || 0;
        return minigames + puzzles;
      }
    } catch (e) {
      console.error('[RateApp] Failed to get participation count:', e);
    }
    return 0;
  }

  /**
   * Check if we should show the rate prompt
   * @param {string} userId - The user ID
   * @returns {boolean} - Whether to show the prompt
   */
  function shouldShowPrompt(userId) {
    const state = loadState();
    
    // Never show if user already rated or dismissed permanently
    if (state.hasRated || state.hasDismissed) {
      return false;
    }

    const count = getParticipationCount(userId);
    
    // Find the next threshold we haven't prompted for yet
    for (const threshold of PROMPT_THRESHOLDS) {
      if (count >= threshold && state.lastPromptThreshold < threshold) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get the current threshold that triggered the prompt
   */
  function getCurrentThreshold(userId) {
    const state = loadState();
    const count = getParticipationCount(userId);
    
    for (const threshold of PROMPT_THRESHOLDS) {
      if (count >= threshold && state.lastPromptThreshold < threshold) {
        return threshold;
      }
    }
    return 0;
  }

  /**
   * Called when user clicks "Rate Now"
   */
  function onRateNow() {
    const state = loadState();
    state.hasRated = true;
    state.promptCount += 1;
    saveState(state);

    // Open the appropriate store URL
    const url = getStoreUrl();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Called when user clicks "Maybe Later"
   */
  function onMaybeLater(userId) {
    const state = loadState();
    state.lastPromptThreshold = getCurrentThreshold(userId);
    state.promptCount += 1;
    saveState(state);
  }

  /**
   * Called when user clicks "No Thanks"
   */
  function onNoThanks() {
    const state = loadState();
    state.hasDismissed = true;
    state.promptCount += 1;
    saveState(state);
  }

  /**
   * Get the appropriate store URL based on platform
   */
  function getStoreUrl() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Detect iOS
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return STORE_URLS.ios;
    }
    
    // Detect Android
    if (/android/i.test(userAgent)) {
      return STORE_URLS.android;
    }
    
    // Default to Play Store for web (most common)
    return STORE_URLS.android;
  }

  /**
   * Reset state (for testing)
   */
  function reset() {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Get current state (for debugging)
   */
  function getState() {
    return loadState();
  }

  // Public API
  return {
    shouldShowPrompt,
    getCurrentThreshold,
    onRateNow,
    onMaybeLater,
    onNoThanks,
    getStoreUrl,
    getParticipationCount,
    reset,
    getState,
    STORE_URLS
  };
})();

// Make available globally for browser
if (typeof window !== 'undefined') {
  window.RateAppService = RateAppService;
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RateAppService };
}
