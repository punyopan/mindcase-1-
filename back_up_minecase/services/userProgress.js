/**
 * User Progress Service
 * Manages tokens, unlocked puzzles, analytics, and user progress
 */

const UserProgressService = (() => {
  // LocalStorage keys
  const STORAGE_KEY = 'mindcase_user_progress';
  const ANALYTICS_KEY = 'mindcase_analytics';

  /**
   * User Progress Schema:
   * {
   *   userId: string,
   *   tokens: number,
   *   lastTokenReset: date,
   *   tokensEarnedToday: number,
   *   unlockedPuzzles: string[], // Array of puzzle IDs
   *   unlockedTopics: string[], // Array of topic IDs
   *   completedPuzzles: string[],
   *   totalPuzzlesCompleted: number,
   *   totalMinigamesCompleted: number,
   *   joinedAt: date,
   *   lastActiveAt: date
   * }
   */

  /**
   * Analytics Schema:
   * {
   *   userId: string,
   *   totalAnswers: number,
   *   averageScore: number,
   *   scoreHistory: [{ date, score, puzzleId }],
   *   timeSpent: number, // minutes
   *   streak: number, // consecutive days
   *   lastStreakDate: date,
   *   topicMastery: { topicId: { attempts: number, avgScore: number } },
   *   minigameStats: { gameName: { completed: number, avgTime: number } }
   * }
   */

  // Initialize default progress
  function getDefaultProgress(userId) {
    return {
      userId: userId,
      tokens: 0,
      lastTokenReset: new Date().toDateString(),
      tokensEarnedToday: 0,
      unlockedPuzzles: [],
      unlockedTopics: [],
      completedPuzzles: [],
      totalPuzzlesCompleted: 0,
      totalMinigamesCompleted: 0,
      joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };
  }

  function getDefaultAnalytics(userId) {
    return {
      userId: userId,
      totalAnswers: 0,
      averageScore: 0,
      scoreHistory: [],
      timeSpent: 0,
      streak: 0,
      lastStreakDate: null,
      topicMastery: {},
      minigameStats: {}
    };
  }

  // Load user progress
  function loadProgress(userId) {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
      if (stored) {
        const progress = JSON.parse(stored);
        // Ensure all required fields exist (for backward compatibility)
        if (!progress.unlockedTopics) {
          progress.unlockedTopics = [];
        }
        if (!progress.unlockedPuzzles) {
          progress.unlockedPuzzles = [];
        }
        return progress;
      }
    } catch (e) {
      console.error('Failed to load user progress:', e);
    }
    return getDefaultProgress(userId);
  }

  // Save user progress
  function saveProgress(progress) {
    try {
      localStorage.setItem(`${STORAGE_KEY}_${progress.userId}`, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save user progress:', e);
    }
  }

  // Load analytics
  function loadAnalytics(userId) {
    try {
      const stored = localStorage.getItem(`${ANALYTICS_KEY}_${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load analytics:', e);
    }
    return getDefaultAnalytics(userId);
  }

  // Save analytics
  function saveAnalytics(analytics) {
    try {
      localStorage.setItem(`${ANALYTICS_KEY}_${analytics.userId}`, JSON.stringify(analytics));
    } catch (e) {
      console.error('Failed to save analytics:', e);
    }
  }

  /**
   * TOKEN MANAGEMENT
   */

  // Reset daily tokens if needed
  function checkDailyReset(progress) {
    const today = new Date().toDateString();
    if (progress.lastTokenReset !== today) {
      progress.lastTokenReset = today;
      progress.tokensEarnedToday = 0;
    }
    return progress;
  }

  // Award tokens (from daily minigames)
  function awardTokens(userId, amount) {
    let progress = loadProgress(userId);
    progress = checkDailyReset(progress);

    // Check daily limit (3 tokens per day for free users)
    const limits = window.PaymentService?.getPlanLimits(userId) || { dailyTokens: 3 };
    const canEarn = progress.tokensEarnedToday < limits.dailyTokens;

    if (!canEarn) {
      return {
        success: false,
        reason: 'daily_limit_reached',
        tokens: progress.tokens,
        message: 'You\'ve reached the daily token limit. Come back tomorrow!'
      };
    }

    // Award tokens
    const tokensToAward = Math.min(amount, limits.dailyTokens - progress.tokensEarnedToday);
    progress.tokens += tokensToAward;
    progress.tokensEarnedToday += tokensToAward;
    progress.lastActiveAt = new Date().toISOString();

    saveProgress(progress);

    return {
      success: true,
      tokens: progress.tokens,
      tokensAwarded: tokensToAward,
      tokensEarnedToday: progress.tokensEarnedToday,
      dailyLimit: limits.dailyTokens
    };
  }

  // Award tokens from ads (bypasses daily minigame limit)
  function awardAdTokens(userId, amount) {
    let progress = loadProgress(userId);
    progress = checkDailyReset(progress);

    // Ad tokens bypass the daily minigame limit
    progress.tokens += amount;
    progress.lastActiveAt = new Date().toISOString();

    saveProgress(progress);

    return {
      success: true,
      tokens: progress.tokens,
      tokensAwarded: amount
    };
  }

  // Spend tokens to unlock puzzle
  function spendTokens(userId, puzzleId, cost = 5) {
    let progress = loadProgress(userId);

    // Check if already unlocked
    if (progress.unlockedPuzzles.includes(puzzleId)) {
      return {
        success: false,
        reason: 'already_unlocked',
        message: 'This puzzle is already unlocked!'
      };
    }

    // Check if enough tokens
    if (progress.tokens < cost) {
      return {
        success: false,
        reason: 'insufficient_tokens',
        tokens: progress.tokens,
        required: cost,
        message: `You need ${cost} tokens. You have ${progress.tokens}.`
      };
    }

    // Spend tokens and unlock
    progress.tokens -= cost;
    progress.unlockedPuzzles.push(puzzleId);
    progress.lastActiveAt = new Date().toISOString();

    saveProgress(progress);

    return {
      success: true,
      tokens: progress.tokens,
      unlockedPuzzle: puzzleId,
      message: 'Puzzle unlocked!'
    };
  }

  // Get token balance
  function getTokens(userId) {
    const progress = loadProgress(userId);
    return {
      tokens: progress.tokens,
      tokensEarnedToday: progress.tokensEarnedToday,
      dailyLimit: window.PaymentService?.getPlanLimits(userId)?.dailyTokens || 3
    };
  }

  /**
   * PUZZLE ACCESS CONTROL
   */

  // Check if puzzle is accessible
  function canAccessPuzzle(userId, puzzleId, puzzleIndex) {
    const isPremium = window.PaymentService?.isPremium(userId) || false;

    // Premium users have unlimited access
    if (isPremium) {
      return { canAccess: true, reason: 'premium' };
    }

    const progress = loadProgress(userId);
    const limits = window.PaymentService?.getPlanLimits(userId) || { maxPuzzles: 10 };

    // Check if within free limit (first 10 puzzles)
    if (puzzleIndex < limits.maxPuzzles) {
      return { canAccess: true, reason: 'free_tier' };
    }

    // Check if unlocked with tokens
    if (progress.unlockedPuzzles.includes(puzzleId)) {
      return { canAccess: true, reason: 'unlocked' };
    }

    return {
      canAccess: false,
      reason: 'locked',
      requiresTokens: limits.unlockCost || 5,
      currentTokens: progress.tokens
    };
  }

  // Get list of unlocked puzzles
  function getUnlockedPuzzles(userId) {
    const progress = loadProgress(userId);
    return progress.unlockedPuzzles;
  }

  /**
   * TOPIC ACCESS CONTROL
   */

  // Check if topic is accessible
  function canAccessTopic(userId, topicId, topicIndex) {
    const isPremium = window.PaymentService?.isPremium(userId) || false;

    // Premium users have unlimited access
    if (isPremium) {
      return { canAccess: true, reason: 'premium' };
    }

    // Free users get first 2 topics
    if (topicIndex < 2) {
      return { canAccess: true, reason: 'free_tier' };
    }

    const progress = loadProgress(userId);

    // Check if unlocked with tokens
    if (progress.unlockedTopics.includes(topicId)) {
      return { canAccess: true, reason: 'unlocked' };
    }

    return {
      canAccess: false,
      reason: 'locked',
      requiresTokens: 3, // 3 tokens to unlock 1 puzzle from topic
      currentTokens: progress.tokens
    };
  }

  // Spend tokens to unlock one puzzle from a topic
  function unlockTopicPuzzle(userId, topicId, cost = 3) {
    let progress = loadProgress(userId);

    // Check if enough tokens
    if (progress.tokens < cost) {
      return {
        success: false,
        reason: 'insufficient_tokens',
        tokens: progress.tokens,
        required: cost,
        message: `You need ${cost} tokens. You have ${progress.tokens}.`
      };
    }

    // Spend tokens - add topic to unlocked list
    progress.tokens -= cost;
    if (!progress.unlockedTopics.includes(topicId)) {
      progress.unlockedTopics.push(topicId);
    }
    progress.lastActiveAt = new Date().toISOString();

    saveProgress(progress);

    return {
      success: true,
      tokens: progress.tokens,
      unlockedTopic: topicId,
      message: 'Topic unlocked! You can play 1 puzzle from this topic.'
    };
  }

  // Get list of unlocked topics
  function getUnlockedTopics(userId) {
    const progress = loadProgress(userId);
    return progress.unlockedTopics || [];
  }

  /**
   * ANALYTICS TRACKING
   */

  // Record puzzle answer
  function recordAnswer(userId, puzzleId, topicId, score, timeSpent) {
    let analytics = loadAnalytics(userId);
    const progress = loadProgress(userId);

    // Update score history
    analytics.scoreHistory.push({
      date: new Date().toISOString(),
      score: score,
      puzzleId: puzzleId,
      topicId: topicId,
      timeSpent: timeSpent
    });

    // Update totals
    analytics.totalAnswers += 1;
    analytics.timeSpent += timeSpent || 0;

    // Recalculate average
    const scores = analytics.scoreHistory.map(h => h.score);
    analytics.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Update topic mastery
    if (!analytics.topicMastery[topicId]) {
      analytics.topicMastery[topicId] = { attempts: 0, totalScore: 0, avgScore: 0 };
    }
    analytics.topicMastery[topicId].attempts += 1;
    analytics.topicMastery[topicId].totalScore += score;
    analytics.topicMastery[topicId].avgScore =
      analytics.topicMastery[topicId].totalScore / analytics.topicMastery[topicId].attempts;

    // Update streak
    updateStreak(analytics);

    // Mark puzzle as completed if high score
    if (score >= 70 && !progress.completedPuzzles.includes(puzzleId)) {
      progress.completedPuzzles.push(puzzleId);
      progress.totalPuzzlesCompleted += 1;
      saveProgress(progress);
    }

    saveAnalytics(analytics);

    return {
      score: score,
      averageScore: analytics.averageScore,
      totalAnswers: analytics.totalAnswers,
      streak: analytics.streak
    };
  }

  // Record minigame completion
  function recordMinigameCompletion(userId, gameName, timeSpent, success) {
    let analytics = loadAnalytics(userId);
    const progress = loadProgress(userId);

    // Update minigame stats
    if (!analytics.minigameStats[gameName]) {
      analytics.minigameStats[gameName] = { completed: 0, totalTime: 0, avgTime: 0, successRate: 0, successes: 0 };
    }

    const stats = analytics.minigameStats[gameName];
    stats.completed += 1;
    stats.totalTime += timeSpent || 0;
    stats.avgTime = stats.totalTime / stats.completed;

    if (success) {
      stats.successes += 1;
    }
    stats.successRate = (stats.successes / stats.completed) * 100;

    // Update total minigames
    progress.totalMinigamesCompleted += 1;

    saveAnalytics(analytics);
    saveProgress(progress);

    return stats;
  }

  // Update daily streak
  function updateStreak(analytics) {
    const today = new Date().toDateString();
    const lastDate = analytics.lastStreakDate ? new Date(analytics.lastStreakDate).toDateString() : null;

    if (lastDate === today) {
      // Already logged today
      return analytics.streak;
    }

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    if (lastDate === yesterday) {
      // Continue streak
      analytics.streak += 1;
    } else if (lastDate === null) {
      // First day
      analytics.streak = 1;
    } else {
      // Streak broken
      analytics.streak = 1;
    }

    analytics.lastStreakDate = new Date().toISOString();
    return analytics.streak;
  }

  // Get basic analytics
  function getBasicAnalytics(userId) {
    const analytics = loadAnalytics(userId);
    const progress = loadProgress(userId);

    return {
      totalAnswers: analytics.totalAnswers,
      averageScore: Math.round(analytics.averageScore),
      streak: analytics.streak,
      totalPuzzlesCompleted: progress.totalPuzzlesCompleted,
      totalMinigamesCompleted: progress.totalMinigamesCompleted,
      timeSpent: Math.round(analytics.timeSpent)
    };
  }

  // Get advanced analytics (premium only)
  function getAdvancedAnalytics(userId) {
    const isPremium = window.PaymentService?.isPremium(userId) || false;

    if (!isPremium) {
      return {
        error: 'premium_required',
        message: 'Advanced analytics is a premium feature'
      };
    }

    const analytics = loadAnalytics(userId);
    const progress = loadProgress(userId);

    // Calculate performance trends
    const recentScores = analytics.scoreHistory.slice(-10).map(h => h.score);
    const olderScores = analytics.scoreHistory.slice(-20, -10).map(h => h.score);

    const recentAvg = recentScores.length ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length : 0;
    const olderAvg = olderScores.length ? olderScores.reduce((a, b) => a + b, 0) / olderScores.length : 0;
    const trend = recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'stable';

    return {
      // Basic stats
      totalAnswers: analytics.totalAnswers,
      averageScore: Math.round(analytics.averageScore),
      streak: analytics.streak,
      totalPuzzlesCompleted: progress.totalPuzzlesCompleted,
      totalMinigamesCompleted: progress.totalMinigamesCompleted,
      timeSpent: Math.round(analytics.timeSpent),

      // Advanced stats
      scoreHistory: analytics.scoreHistory,
      topicMastery: analytics.topicMastery,
      minigameStats: analytics.minigameStats,
      performanceTrend: trend,
      recentAverage: Math.round(recentAvg),
      improvement: Math.round(recentAvg - olderAvg),

      // Insights
      strongestTopic: Object.entries(analytics.topicMastery)
        .sort((a, b) => b[1].avgScore - a[1].avgScore)[0]?.[0] || null,
      weakestTopic: Object.entries(analytics.topicMastery)
        .sort((a, b) => a[1].avgScore - b[1].avgScore)[0]?.[0] || null,
      mostPlayedMinigame: Object.entries(analytics.minigameStats)
        .sort((a, b) => b[1].completed - a[1].completed)[0]?.[0] || null
    };
  }

  // Get user progress summary
  function getProgressSummary(userId) {
    const progress = loadProgress(userId);
    const analytics = loadAnalytics(userId);

    return {
      ...progress,
      averageScore: Math.round(analytics.averageScore),
      streak: analytics.streak
    };
  }

  // Public API
  return {
    // Token management
    awardTokens,
    awardAdTokens,
    spendTokens,
    getTokens,

    // Puzzle access
    canAccessPuzzle,
    getUnlockedPuzzles,

    // Topic access
    canAccessTopic,
    unlockTopicPuzzle,
    getUnlockedTopics,

    // Analytics
    recordAnswer,
    recordMinigameCompletion,
    getBasicAnalytics,
    getAdvancedAnalytics,
    getProgressSummary,

    // Data access (for AnalyticsEngine)
    loadProgress,
    loadAnalytics
  };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UserProgressService };
}

// Make available globally for browser
if (typeof window !== 'undefined') {
  window.UserProgressService = UserProgressService;
}
