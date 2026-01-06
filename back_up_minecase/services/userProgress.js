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
      minigameStats: {},
      // Enhanced minigame tracking
      minigameHistory: [], // Detailed history of all minigame sessions
      cognitiveProfile: {
        memory: { score: 0, sessions: 0, trend: 'stable' },
        attention: { score: 0, sessions: 0, trend: 'stable' },
        processing: { score: 0, sessions: 0, trend: 'stable' },
        inhibition: { score: 0, sessions: 0, trend: 'stable' },
        flexibility: { score: 0, sessions: 0, trend: 'stable' },
        reasoning: { score: 0, sessions: 0, trend: 'stable' }
      },
      dailyMinigameLog: [] // Track daily performance patterns
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

  // Award tokens (from daily minigames) - Uses API with localStorage fallback
  async function awardTokens(userId, amount) {
    // Try API first
    try {
      if (window.ProgressAPI) {
        const result = await window.ProgressAPI.earnTokens(amount, 'minigame', { source: 'daily_minigame' });
        if (result.success) {
          // Also update localStorage cache for offline access
          let progress = loadProgress(userId);
          progress.tokens = result.balance;
          progress.tokensEarnedToday = result.tokensEarnedToday;
          saveProgress(progress);
        }
        return {
          success: result.success,
          tokens: result.balance,
          tokensAwarded: result.tokensAwarded || 0,
          tokensEarnedToday: result.tokensEarnedToday,
          dailyLimit: result.dailyLimit,
          reason: result.reason
        };
      }
    } catch (e) {
      console.warn('API call failed, falling back to localStorage:', e.message);
    }

    // Fallback to localStorage
    let progress = loadProgress(userId);
    progress = checkDailyReset(progress);

    // Check daily limit (3 tokens per day for free users)
    const limits = { dailyTokens: 3 };
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

  // Award tokens from ads (bypasses daily minigame limit) - Uses API
  async function awardAdTokens(userId, amount) {
    // Try API first
    try {
      if (window.ProgressAPI) {
        const result = await window.ProgressAPI.earnTokens(amount, 'ad', { source: 'rewarded_ad' });
        if (result.success) {
          // Update localStorage cache
          let progress = loadProgress(userId);
          progress.tokens = result.balance;
          saveProgress(progress);
        }
        return {
          success: result.success,
          tokens: result.balance,
          tokensAwarded: result.tokensAwarded || amount
        };
      }
    } catch (e) {
      console.warn('API call failed, falling back to localStorage:', e.message);
    }

    // Fallback to localStorage
    let progress = loadProgress(userId);
    progress = checkDailyReset(progress);

    progress.tokens += amount;
    progress.lastActiveAt = new Date().toISOString();

    saveProgress(progress);

    return {
      success: true,
      tokens: progress.tokens,
      tokensAwarded: amount
    };
  }

  // Spend tokens to unlock puzzle - Uses API with localStorage fallback
  async function spendTokens(userId, puzzleId, cost = 3) {
    // Try API first
    try {
      if (window.ProgressAPI) {
        const result = await window.ProgressAPI.unlockContent('PUZZLE', puzzleId);
        if (result.success) {
          // Update localStorage cache
          let progress = loadProgress(userId);
          progress.tokens = result.balance;
          if (!progress.unlockedPuzzles.includes(puzzleId)) {
            progress.unlockedPuzzles.push(puzzleId);
          }
          saveProgress(progress);
        }
        return {
          success: result.success,
          tokens: result.balance,
          reason: result.reason,
          required: result.required
        };
      }
    } catch (e) {
      console.warn('API call failed, falling back to localStorage:', e.message);
    }

    // Fallback to localStorage
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

  // Get token balance - Uses API with localStorage fallback
  async function getTokens(userId) {
    // Try API first
    try {
      if (window.ProgressAPI) {
        const result = await window.ProgressAPI.getWallet();
        if (result.success) {
          // Update localStorage cache
          let progress = loadProgress(userId);
          progress.tokens = result.wallet.balance;
          progress.tokensEarnedToday = result.wallet.tokensEarnedToday;
          saveProgress(progress);
          
          return {
            tokens: result.wallet.balance,
            tokensEarnedToday: result.wallet.tokensEarnedToday,
            dailyLimit: result.wallet.dailyLimit,
            remainingToday: result.wallet.remainingToday
          };
        }
      }
    } catch (e) {
      console.warn('API call failed, falling back to localStorage:', e.message);
    }

    // Fallback to localStorage
    const progress = loadProgress(userId);
    return {
      tokens: progress.tokens,
      tokensEarnedToday: progress.tokensEarnedToday,
      dailyLimit: 3
    };
  }

  /**
   * MINIGAME SESSION (Anti-Cheat)
   */

  // Start a minigame session
  async function startMinigameSession(userId, gameType) {
    if (window.ProgressAPI) {
      try {
        const result = await window.ProgressAPI.startSession(gameType);
        if (result.success) {
          return result.session;
        }
      } catch (e) {
        console.warn('Failed to start session on server:', e);
      }
    }
    // Return mock session for offline mode
    return {
      sessionId: 'offline_' + Date.now(),
      expiresAt: new Date(Date.now() + 600000).toISOString(),
      offline: true
    };
  }

  // Complete session and claim reward
  async function completeMinigameSession(userId, sessionId, result) {
    // 1. Try server verification
    if (window.ProgressAPI && !sessionId.startsWith('offline_')) {
      try {
        const apiResult = await window.ProgressAPI.completeSession(sessionId, result);
        
        if (apiResult.success) {
           // If reward was granted, update local cache
           if (apiResult.reward && apiResult.reward.success) {
             let progress = loadProgress(userId);
             progress.tokens = apiResult.reward.balance;
             progress.tokensEarnedToday = apiResult.reward.tokensEarnedToday;
             saveProgress(progress);
           }
           
           return {
             success: true,
             reward: apiResult.reward,
             verified: true
           };
        } else {
           // Server rejected it (cheating, expired, etc)
           console.warn('Server rejected minigame session:', apiResult.reason);
           return {
             success: false,
             reason: apiResult.reason,
             message: apiResult.message
           };
        }
      } catch (e) {
        console.warn('Failed to complete session on server:', e);
      }
    }

    // 2. Offline fallback (or if server call failed but wasn't explicitly rejected)
    // Note: If server explicitly rejected (e.g. cheating), we shouldn't award locally either.
    // But if network error, we award locally.
    
    if (result.success) {
      const awardResult = awardTokens(userId, 1);
      return {
        success: true,
        reward: awardResult,
        verified: false
      };
    }
    
    return { success: true, verified: false };
  }

  /**
   * PUZZLE ACCESS CONTROL
   */

  // Check if puzzle is accessible (async due to premium check)
  async function canAccessPuzzle(userId, puzzleId, puzzleIndex) {
    const isPremium = await window.PaymentService?.isPremium(userId) || false;

    // Premium users have unlimited access
    if (isPremium) {
      return { canAccess: true, reason: 'premium' };
    }

    const progress = loadProgress(userId);
    const limits = await window.PaymentService?.getPlanLimits(userId) || { maxPuzzles: 10 };

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
      requiresTokens: limits.unlockCost || 3,
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

  // Check if topic is accessible (async due to premium check)
  async function canAccessTopic(userId, topicId, topicIndex) {
    const isPremium = await window.PaymentService?.isPremium(userId) || false;

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

  // Minigame cognitive category mapping
  const MINIGAME_COGNITIVE_MAP = {
    'Color Sequence': { primary: 'memory', secondary: 'attention', difficulty: 'easy' },
    'Memory Constellation': { primary: 'memory', secondary: 'processing', difficulty: 'easy' },
    'Rhythm Reef': { primary: 'attention', secondary: 'processing', difficulty: 'easy' },
    'Logic Grid': { primary: 'reasoning', secondary: 'flexibility', difficulty: 'medium' },
    'Word Cipher': { primary: 'reasoning', secondary: 'memory', difficulty: 'medium' },
    'Evidence Weight': { primary: 'reasoning', secondary: 'attention', difficulty: 'medium' },
    'Missing Constraint': { primary: 'reasoning', secondary: 'flexibility', difficulty: 'medium' },
    'Color Chaos Kitchen': { primary: 'attention', secondary: 'inhibition', difficulty: 'medium' },
    'Number Ghost': { primary: 'memory', secondary: 'attention', difficulty: 'medium' },
    'Tap Unless': { primary: 'inhibition', secondary: 'attention', difficulty: 'medium' },
    'Rule Flip': { primary: 'flexibility', secondary: 'inhibition', difficulty: 'medium' },
    'Face Fusion': { primary: 'processing', secondary: 'memory', difficulty: 'hard' },
    'Math Puzzle': { primary: 'reasoning', secondary: 'processing', difficulty: 'hard' },
    'Visual Matching': { primary: 'processing', secondary: 'attention', difficulty: 'hard' },
    'Mirror Match': { primary: 'processing', secondary: 'flexibility', difficulty: 'hard' }
  };

  // Record minigame completion with enhanced tracking
  function recordMinigameCompletion(userId, gameName, timeSpent, success, detailedResults = {}) {
    let analytics = loadAnalytics(userId);
    const progress = loadProgress(userId);

    // Initialize minigame stats if needed
    if (!analytics.minigameStats[gameName]) {
      analytics.minigameStats[gameName] = {
        completed: 0,
        totalTime: 0,
        avgTime: 0,
        successRate: 0,
        successes: 0,
        scores: [],
        bestScore: 0,
        lastPlayed: null
      };
    }

    // Initialize enhanced tracking structures if missing
    if (!analytics.minigameHistory) analytics.minigameHistory = [];
    if (!analytics.cognitiveProfile) {
      analytics.cognitiveProfile = {
        memory: { score: 0, sessions: 0, trend: 'stable' },
        attention: { score: 0, sessions: 0, trend: 'stable' },
        processing: { score: 0, sessions: 0, trend: 'stable' },
        inhibition: { score: 0, sessions: 0, trend: 'stable' },
        flexibility: { score: 0, sessions: 0, trend: 'stable' },
        reasoning: { score: 0, sessions: 0, trend: 'stable' }
      };
    }
    if (!analytics.dailyMinigameLog) analytics.dailyMinigameLog = [];

    const stats = analytics.minigameStats[gameName];
    const score = detailedResults.score || (success ? 100 : 50);

    // Update basic stats
    stats.completed += 1;
    stats.totalTime += timeSpent || 0;
    stats.avgTime = stats.totalTime / stats.completed;
    stats.lastPlayed = new Date().toISOString();

    if (success) {
      stats.successes += 1;
    }
    stats.successRate = (stats.successes / stats.completed) * 100;

    // Track scores
    stats.scores.push(score);
    if (stats.scores.length > 50) stats.scores = stats.scores.slice(-50); // Keep last 50
    stats.bestScore = Math.max(stats.bestScore, score);

    // Add to minigame history for detailed analysis
    const historyEntry = {
      gameName,
      timestamp: new Date().toISOString(),
      timeSpent: timeSpent || 0,
      success,
      score,
      difficulty: detailedResults.difficulty || MINIGAME_COGNITIVE_MAP[gameName]?.difficulty || 'medium',
      // Detailed results from the minigame
      correctResponses: detailedResults.correctResponses || 0,
      totalResponses: detailedResults.totalResponses || 0,
      errors: detailedResults.errors || 0,
      accuracy: detailedResults.accuracy || (success ? 100 : 0),
      reactionTime: detailedResults.reactionTime || null,
      // Cognitive category tracking
      cognitiveCategory: MINIGAME_COGNITIVE_MAP[gameName]?.primary || 'general',
      secondaryCategory: MINIGAME_COGNITIVE_MAP[gameName]?.secondary || null
    };

    analytics.minigameHistory.push(historyEntry);
    // Keep last 200 entries
    if (analytics.minigameHistory.length > 200) {
      analytics.minigameHistory = analytics.minigameHistory.slice(-200);
    }

    // Update cognitive profile
    const gameCategory = MINIGAME_COGNITIVE_MAP[gameName];
    if (gameCategory && analytics.cognitiveProfile[gameCategory.primary]) {
      const profile = analytics.cognitiveProfile[gameCategory.primary];
      const oldScore = profile.score;
      profile.sessions += 1;
      // Weighted average favoring recent performance
      profile.score = Math.round(((profile.score * (profile.sessions - 1)) + score) / profile.sessions);

      // Calculate trend
      if (profile.sessions >= 3) {
        const recentHistory = analytics.minigameHistory
          .filter(h => h.cognitiveCategory === gameCategory.primary)
          .slice(-5);
        const olderHistory = analytics.minigameHistory
          .filter(h => h.cognitiveCategory === gameCategory.primary)
          .slice(-10, -5);

        if (recentHistory.length >= 2 && olderHistory.length >= 2) {
          const recentAvg = recentHistory.reduce((a, h) => a + h.score, 0) / recentHistory.length;
          const olderAvg = olderHistory.reduce((a, h) => a + h.score, 0) / olderHistory.length;
          profile.trend = recentAvg > olderAvg + 5 ? 'improving' : recentAvg < olderAvg - 5 ? 'declining' : 'stable';
        }
      }
    }

    // Secondary category gets half weight
    if (gameCategory?.secondary && analytics.cognitiveProfile[gameCategory.secondary]) {
      const profile = analytics.cognitiveProfile[gameCategory.secondary];
      profile.sessions += 0.5;
      profile.score = Math.round(((profile.score * (profile.sessions - 0.5)) + (score * 0.5)) / profile.sessions);
    }

    // Track daily performance
    const today = new Date().toDateString();
    let dailyEntry = analytics.dailyMinigameLog.find(d => d.date === today);
    if (!dailyEntry) {
      dailyEntry = { date: today, games: 0, totalScore: 0, avgScore: 0, categories: {} };
      analytics.dailyMinigameLog.push(dailyEntry);
    }
    dailyEntry.games += 1;
    dailyEntry.totalScore += score;
    dailyEntry.avgScore = Math.round(dailyEntry.totalScore / dailyEntry.games);

    if (gameCategory?.primary) {
      if (!dailyEntry.categories[gameCategory.primary]) {
        dailyEntry.categories[gameCategory.primary] = { count: 0, score: 0 };
      }
      dailyEntry.categories[gameCategory.primary].count += 1;
      dailyEntry.categories[gameCategory.primary].score += score;
    }

    // Keep only last 30 days
    if (analytics.dailyMinigameLog.length > 30) {
      analytics.dailyMinigameLog = analytics.dailyMinigameLog.slice(-30);
    }

    // Update total minigames
    progress.totalMinigamesCompleted += 1;

    saveAnalytics(analytics);
    saveProgress(progress);

    return {
      ...stats,
      cognitiveProfile: analytics.cognitiveProfile,
      historyEntry
    };
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

  // Record full cognitive training session (3-game circuit)
  function recordCognitiveTrainingSession(userId, sessionData) {
    let analytics = loadAnalytics(userId);

    // Initialize cognitive training analytics if not exists
    if (!analytics.cognitiveTraining) {
      analytics.cognitiveTraining = {
        totalSessions: 0,
        sessionHistory: [],
        gameTypeStats: {},
        cognitiveGrowthHistory: [],
        averageProcessScore: 0
      };
    }

    const ct = analytics.cognitiveTraining;
    ct.totalSessions = (ct.totalSessions || 0) + 1;

    // Create history entry
    const historyEntry = {
        timestamp: sessionData.timestamp,
        date: new Date(sessionData.timestamp).toLocaleDateString(),
        processScore: sessionData.overallScore,
        gameTypeName: 'Full Circuit',
        reasoningLevel: sessionData.overallScore >= 80 ? 'Advanced' : sessionData.overallScore >= 60 ? 'Intermediate' : 'Developing',
        patterns: sessionData.patterns || [],
        metrics: sessionData.metrics || {},
        stages: sessionData.stages
    };
    
    ct.sessionHistory.push(historyEntry);
    if (ct.sessionHistory.length > 50) ct.sessionHistory = ct.sessionHistory.slice(-50);

    // Update average
    const allScores = ct.sessionHistory.map(s => s.processScore);
    ct.averageProcessScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
    
    // Update individual game stats for the dashboard
    if (sessionData.stages) {
        Object.entries(sessionData.stages).forEach(([key, stageData]) => {
            if (!ct.gameTypeStats[key]) {
                ct.gameTypeStats[key] = { sessions: 0, totalScore: 0, avgScore: 0 };
            }
            const score = stageData.evaluation?.processQuality || 0;
            ct.gameTypeStats[key].sessions++;
            ct.gameTypeStats[key].totalScore += score;
            ct.gameTypeStats[key].avgScore = Math.round(ct.gameTypeStats[key].totalScore / ct.gameTypeStats[key].sessions);
        });
    }

    saveAnalytics(analytics);
    return { success: true };
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
  async function getAdvancedAnalytics(userId) {
    const isPremium = await window.PaymentService?.isPremium(userId) || false;

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

      // Cognitive Training Stats (New)
      cognitiveTraining: {
        totalSessions: analytics.cognitiveTraining?.totalSessions || 0,
        averageProcessScore: analytics.cognitiveTraining?.averageProcessScore || 0,
        processTrend: analytics.cognitiveTraining?.sessionHistory?.slice(-5).reduce((a,b,i,arr) => i===0?0:(b.processScore - arr[i-1].processScore + a), 0) > 0 ? 'improving' : 'stable',
        recentSessions: analytics.cognitiveTraining?.sessionHistory?.slice().reverse() || [],
        gameTypePerformance: Object.entries(analytics.cognitiveTraining?.gameTypeStats || {}).map(([k,v]) => ({
            gameType: k,
            name: k.replace(/_/g, ' ').toUpperCase(),
            avgScore: v.avgScore,
            sessions: v.sessions
        })),
        
        // Calculate primitives from metrics history
        strongestPrimitives: (() => {
            const history = analytics.cognitiveTraining?.sessionHistory || [];
            if (history.length === 0) return [];
            
            const totals = {};
            const counts = {};
            
            history.forEach(h => {
                if (h.metrics) {
                    Object.entries(h.metrics).forEach(([key, val]) => {
                        totals[key] = (totals[key] || 0) + val;
                        counts[key] = (counts[key] || 0) + 1;
                    });
                }
            });
            
            return Object.entries(totals)
                .map(([key, total]) => ({
                    name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    avg: Math.round(total / counts[key]),
                    count: counts[key]
                }))
                .sort((a,b) => b.avg - a.avg)
                .slice(0, 3);
        })(),

        weakestPrimitives: (() => {
            const history = analytics.cognitiveTraining?.sessionHistory || [];
            if (history.length === 0) return [];
            
            const totals = {};
            const counts = {};
            
            history.forEach(h => {
                if (h.metrics) {
                    Object.entries(h.metrics).forEach(([key, val]) => {
                        totals[key] = (totals[key] || 0) + val;
                        counts[key] = (counts[key] || 0) + 1;
                    });
                }
            });
            
            return Object.entries(totals)
                .map(([key, total]) => ({
                    name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    avg: Math.round(total / counts[key]),
                    count: counts[key]
                }))
                .sort((a,b) => a.avg - b.avg) // Ascending order
                .slice(0, 3);
        })(),

        insights: (analytics.cognitiveTraining?.sessionHistory || [])
            .slice(-3)
            .flatMap(s => s.patterns || [])
            .map(p => ({
                type: p.severity === 'positive' ? 'strength' : 'focus',
                icon: p.severity === 'positive' ? '💪' : '⚠️',
                title: p.title,
                message: p.description
            }))
            .slice(0, 5) // Limit to top 5 recent insights
      },

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

  // Get comprehensive minigame analytics (premium feature)
  async function getMinigameAnalytics(userId) {
    const isPremium = await window.PaymentService?.isPremium(userId) || false;

    if (!isPremium) {
      return {
        error: 'premium_required',
        message: 'Detailed minigame analytics is a premium feature'
      };
    }

    const analytics = loadAnalytics(userId);
    const progress = loadProgress(userId);

    // Initialize if missing
    const minigameStats = analytics.minigameStats || {};
    const minigameHistory = analytics.minigameHistory || [];
    const cognitiveProfile = analytics.cognitiveProfile || {
      memory: { score: 0, sessions: 0, trend: 'stable' },
      attention: { score: 0, sessions: 0, trend: 'stable' },
      processing: { score: 0, sessions: 0, trend: 'stable' },
      inhibition: { score: 0, sessions: 0, trend: 'stable' },
      flexibility: { score: 0, sessions: 0, trend: 'stable' },
      reasoning: { score: 0, sessions: 0, trend: 'stable' }
    };
    const dailyLog = analytics.dailyMinigameLog || [];

    // Calculate overall minigame performance
    const totalGamesPlayed = Object.values(minigameStats).reduce((sum, s) => sum + s.completed, 0);
    const totalSuccesses = Object.values(minigameStats).reduce((sum, s) => sum + s.successes, 0);
    const overallSuccessRate = totalGamesPlayed > 0 ? Math.round((totalSuccesses / totalGamesPlayed) * 100) : 0;

    // Calculate best and most played games
    const gamesByPlayed = Object.entries(minigameStats)
      .sort((a, b) => b[1].completed - a[1].completed);
    const gamesBySuccess = Object.entries(minigameStats)
      .filter(([_, s]) => s.completed >= 3)
      .sort((a, b) => b[1].successRate - a[1].successRate);

    // Calculate cognitive strengths and weaknesses
    const cognitiveScores = Object.entries(cognitiveProfile)
      .filter(([_, p]) => p.sessions >= 1)
      .sort((a, b) => b[1].score - a[1].score);

    // Daily performance trend
    const recentDays = dailyLog.slice(-7);
    const weekAgoStart = dailyLog.slice(-14, -7);

    const recentAvgScore = recentDays.length > 0
      ? Math.round(recentDays.reduce((sum, d) => sum + d.avgScore, 0) / recentDays.length)
      : 0;
    const olderAvgScore = weekAgoStart.length > 0
      ? Math.round(weekAgoStart.reduce((sum, d) => sum + d.avgScore, 0) / weekAgoStart.length)
      : recentAvgScore;

    const weeklyTrend = recentAvgScore > olderAvgScore + 5 ? 'improving'
      : recentAvgScore < olderAvgScore - 5 ? 'declining' : 'stable';

    // Calculate games per category
    const categoryStats = {};
    minigameHistory.forEach(h => {
      if (!categoryStats[h.cognitiveCategory]) {
        categoryStats[h.cognitiveCategory] = { count: 0, totalScore: 0, avgScore: 0 };
      }
      categoryStats[h.cognitiveCategory].count += 1;
      categoryStats[h.cognitiveCategory].totalScore += h.score;
    });
    Object.keys(categoryStats).forEach(cat => {
      categoryStats[cat].avgScore = Math.round(categoryStats[cat].totalScore / categoryStats[cat].count);
    });

    // Generate cognitive insights
    const cognitiveInsights = [];

    if (cognitiveScores.length >= 2) {
      const strongest = cognitiveScores[0];
      const weakest = cognitiveScores[cognitiveScores.length - 1];

      const categoryNames = {
        memory: 'Working Memory',
        attention: 'Sustained Attention',
        processing: 'Visual Processing',
        inhibition: 'Response Inhibition',
        flexibility: 'Cognitive Flexibility',
        reasoning: 'Logical Reasoning'
      };

      cognitiveInsights.push({
        type: 'strength',
        icon: '💪',
        title: 'Cognitive Strength',
        message: `${categoryNames[strongest[0]]} is your strongest area (${strongest[1].score}%)`
      });

      if (weakest[1].score < 70 && weakest[1].sessions >= 3) {
        cognitiveInsights.push({
          type: 'focus',
          icon: '🎯',
          title: 'Area for Growth',
          message: `${categoryNames[weakest[0]]} could use more practice (${weakest[1].score}%)`
        });
      }

      // Check for improving categories
      const improving = cognitiveScores.filter(([_, p]) => p.trend === 'improving');
      if (improving.length > 0) {
        cognitiveInsights.push({
          type: 'progress',
          icon: '📈',
          title: 'Showing Progress',
          message: `Your ${categoryNames[improving[0][0]]} skills are improving!`
        });
      }
    }

    return {
      // Overview
      totalGamesPlayed,
      overallSuccessRate,
      totalMinigamesCompleted: progress.totalMinigamesCompleted,

      // Game-specific stats
      minigameStats,
      mostPlayedGame: gamesByPlayed[0]?.[0] || null,
      bestGame: gamesBySuccess[0]?.[0] || null,

      // Cognitive profile
      cognitiveProfile,
      strongestCognitive: cognitiveScores[0]?.[0] || null,
      weakestCognitive: cognitiveScores[cognitiveScores.length - 1]?.[0] || null,
      categoryStats,

      // History and trends
      minigameHistory: minigameHistory.slice(-50), // Last 50 for charts
      dailyLog: dailyLog.slice(-14), // Last 2 weeks
      weeklyTrend,
      recentAvgScore,

      // Insights
      cognitiveInsights
    };
  }

  // Check if user has completed at least one cognitive training session
  function hasCompletedCognitiveTraining(userId) {
    const analytics = loadAnalytics(userId);
    return (analytics.cognitiveTraining?.totalSessions || 0) >= 1;
  }

  // Public API
  return {
    // Token management
    awardTokens,
    awardAdTokens,
    spendTokens,
    getTokens,
    startMinigameSession,
    completeMinigameSession,

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
    recordCognitiveTrainingSession,
    getBasicAnalytics,
    getAdvancedAnalytics,
    getMinigameAnalytics,
    getProgressSummary,

    // Data access (for AnalyticsEngine)
    loadProgress,
    loadAnalytics,

    // Cognitive training status
    hasCompletedCognitiveTraining,

    // Constants
    MINIGAME_COGNITIVE_MAP
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
