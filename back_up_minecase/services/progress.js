/**
 * Progress Tracking Service
 * Handles user progress data and statistics
 */

const PROGRESS_STORAGE_PREFIX = 'mindcase_progress_';

export class ProgressService {
  /**
   * Get user's progress data
   * @param {string} userId - User ID
   * @returns {Object} Progress data
   */
  static getUserProgress(userId) {
    try {
      const data = localStorage.getItem(PROGRESS_STORAGE_PREFIX + userId);
      if (!data) {
        return this.createNewProgress(userId);
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading progress:', error);
      return this.createNewProgress(userId);
    }
  }

  /**
   * Save user's progress data
   * @param {string} userId - User ID
   * @param {Object} progress - Progress data to save
   */
  static saveUserProgress(userId, progress) {
    try {
      progress.lastUpdated = new Date().toISOString();
      localStorage.setItem(PROGRESS_STORAGE_PREFIX + userId, JSON.stringify(progress));
      return { success: true };
    } catch (error) {
      console.error('Error saving progress:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark a puzzle as completed
   * @param {string} userId - User ID
   * @param {number} puzzleId - Puzzle ID
   * @param {number} score - Score achieved
   * @param {Object} dimensionScores - Optional dimension scores from ReasoningEvaluator
   * @returns {Object} Updated progress
   */
  static completePuzzle(userId, puzzleId, score, dimensionScores = null) {
    const progress = this.getUserProgress(userId);

    // Add to completed puzzles set
    if (!progress.completedPuzzles.includes(puzzleId)) {
      progress.completedPuzzles.push(puzzleId);
    }

    // Update score
    progress.puzzleScores[puzzleId] = Math.max(
      progress.puzzleScores[puzzleId] || 0,
      score
    );

    // Store dimension scores if provided (for reasoning evaluation tracking)
    if (dimensionScores) {
      if (!progress.dimensionScores) {
        progress.dimensionScores = {};
      }
      progress.dimensionScores[puzzleId] = {
        claimIdentification: dimensionScores.claimIdentification || 0,
        evidenceEvaluation: dimensionScores.evidenceEvaluation || 0,
        reasoningLogic: dimensionScores.reasoningLogic || 0,
        biasAwareness: dimensionScores.biasAwareness || 0,
        clarityCoherence: dimensionScores.clarityCoherence || 0,
        performanceLevel: dimensionScores.performanceLevel || 'Unknown',
        timestamp: dimensionScores.timestamp || new Date().toISOString()
      };
    }

    // Update total score
    progress.totalScore = Object.values(progress.puzzleScores).reduce((a, b) => a + b, 0);

    // Update statistics
    progress.stats.totalCompleted = progress.completedPuzzles.length;
    progress.stats.averageScore = Math.round(progress.totalScore / progress.completedPuzzles.length);

    // Calculate average dimension scores across all completed puzzles
    if (progress.dimensionScores && Object.keys(progress.dimensionScores).length > 0) {
      const dimensionTotals = {
        claimIdentification: 0,
        evidenceEvaluation: 0,
        reasoningLogic: 0,
        biasAwareness: 0,
        clarityCoherence: 0
      };
      const count = Object.keys(progress.dimensionScores).length;

      Object.values(progress.dimensionScores).forEach(scores => {
        dimensionTotals.claimIdentification += scores.claimIdentification || 0;
        dimensionTotals.evidenceEvaluation += scores.evidenceEvaluation || 0;
        dimensionTotals.reasoningLogic += scores.reasoningLogic || 0;
        dimensionTotals.biasAwareness += scores.biasAwareness || 0;
        dimensionTotals.clarityCoherence += scores.clarityCoherence || 0;
      });

      progress.stats.averageDimensionScores = {
        claimIdentification: Math.round(dimensionTotals.claimIdentification / count),
        evidenceEvaluation: Math.round(dimensionTotals.evidenceEvaluation / count),
        reasoningLogic: Math.round(dimensionTotals.reasoningLogic / count),
        biasAwareness: Math.round(dimensionTotals.biasAwareness / count),
        clarityCoherence: Math.round(dimensionTotals.clarityCoherence / count)
      };
    }

    this.saveUserProgress(userId, progress);
    return progress;
  }

  /**
   * Complete a daily puzzle
   * @param {string} userId - User ID
   * @param {number} dailyPuzzleId - Daily puzzle ID
   * @returns {Object} Updated progress
   */
  static completeDailyPuzzle(userId, dailyPuzzleId) {
    const progress = this.getUserProgress(userId);
    const today = new Date().toDateString();

    // Check if already completed today
    if (progress.dailyPuzzle.lastCompleted === today) {
      return progress;
    }

    // Update streak
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (progress.dailyPuzzle.lastCompleted === yesterday) {
      progress.dailyPuzzle.currentStreak++;
    } else if (progress.dailyPuzzle.lastCompleted !== today) {
      // Streak broken
      progress.dailyPuzzle.currentStreak = 1;
    }

    // Update best streak
    progress.dailyPuzzle.bestStreak = Math.max(
      progress.dailyPuzzle.bestStreak,
      progress.dailyPuzzle.currentStreak
    );

    progress.dailyPuzzle.lastCompleted = today;
    progress.dailyPuzzle.totalCompleted++;

    this.saveUserProgress(userId, progress);
    return progress;
  }

  /**
   * Get user statistics
   * @param {string} userId - User ID
   * @returns {Object} User statistics
   */
  static getUserStats(userId) {
    const progress = this.getUserProgress(userId);
    return {
      totalCompleted: progress.completedPuzzles.length,
      totalScore: progress.totalScore,
      averageScore: progress.stats.averageScore,
      dailyStreak: progress.dailyPuzzle.currentStreak,
      dailyBestStreak: progress.dailyPuzzle.bestStreak,
      completedBySkill: this.getCompletedBySkill(progress),
      recentActivity: progress.stats.recentActivity
    };
  }

  /**
   * Record user activity
   * @param {string} userId - User ID
   * @param {string} action - Action type
   * @param {Object} metadata - Additional data
   */
  static recordActivity(userId, action, metadata = {}) {
    const progress = this.getUserProgress(userId);

    const activity = {
      action,
      timestamp: new Date().toISOString(),
      ...metadata
    };

    progress.stats.recentActivity.unshift(activity);

    // Keep only last 50 activities
    if (progress.stats.recentActivity.length > 50) {
      progress.stats.recentActivity = progress.stats.recentActivity.slice(0, 50);
    }

    this.saveUserProgress(userId, progress);
  }

  /**
   * Create new progress object for a user
   * @param {string} userId - User ID
   * @returns {Object} New progress object
   */
  static createNewProgress(userId) {
    return {
      userId,
      completedPuzzles: [],
      puzzleScores: {},
      totalScore: 0,
      dailyPuzzle: {
        currentStreak: 0,
        bestStreak: 0,
        lastCompleted: null,
        totalCompleted: 0
      },
      stats: {
        totalCompleted: 0,
        averageScore: 0,
        recentActivity: []
      },
      settings: {
        reminderEnabled: false,
        transitionDuration: 300,
        selectedLanguage: 'English'
      },
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get completed puzzles grouped by skill type
   * @param {Object} progress - Progress data
   * @returns {Object} Puzzles by skill
   */
  static getCompletedBySkill(progress) {
    // This would need access to topics data to categorize
    // For now, return empty object
    return {};
  }

  /**
   * Export user progress data
   * @param {string} userId - User ID
   * @returns {string} JSON string of progress
   */
  static exportProgress(userId) {
    const progress = this.getUserProgress(userId);
    return JSON.stringify(progress, null, 2);
  }

  /**
   * Import user progress data
   * @param {string} userId - User ID
   * @param {string} progressJSON - JSON string of progress
   * @returns {Object} Result
   */
  static importProgress(userId, progressJSON) {
    try {
      const progress = JSON.parse(progressJSON);
      this.saveUserProgress(userId, progress);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid progress data' };
    }
  }

  /**
   * Clear all progress for a user
   * @param {string} userId - User ID
   */
  static clearProgress(userId) {
    const newProgress = this.createNewProgress(userId);
    this.saveUserProgress(userId, newProgress);
    return { success: true };
  }
}

// Make available globally for browser
if (typeof window !== 'undefined') {
  window.ProgressService = ProgressService;
}
