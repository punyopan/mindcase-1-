/**
 * Advanced Analytics Engine
 * Provides deep insights into user performance, learning patterns, and skill development
 */

const AnalyticsEngine = (() => {
  /**
   * PERFORMANCE TREND ANALYSIS
   * Analyzes score progression over time
   */
  function analyzePerformanceTrend(scoreHistory) {
    if (!scoreHistory || scoreHistory.length < 5) {
      return {
        trend: 'insufficient_data',
        confidence: 0,
        message: 'Complete more puzzles to see trends'
      };
    }

    // Calculate moving averages
    const windowSize = 5;
    const movingAverages = [];

    for (let i = windowSize - 1; i < scoreHistory.length; i++) {
      const window = scoreHistory.slice(i - windowSize + 1, i + 1);
      const avg = window.reduce((sum, h) => sum + h.score, 0) / windowSize;
      movingAverages.push(avg);
    }

    // Linear regression to determine trend
    const n = movingAverages.length;
    const indices = Array.from({length: n}, (_, i) => i);
    const sumX = indices.reduce((a, b) => a + b, 0);
    const sumY = movingAverages.reduce((a, b) => a + b, 0);
    const sumXY = indices.reduce((sum, x, i) => sum + x * movingAverages[i], 0);
    const sumXX = indices.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Recent vs historical comparison
    const recentCount = Math.min(10, scoreHistory.length);
    const recentScores = scoreHistory.slice(-recentCount).map(h => h.score);
    const historicalScores = scoreHistory.slice(0, -recentCount).map(h => h.score);

    const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const historicalAvg = historicalScores.length > 0
      ? historicalScores.reduce((a, b) => a + b, 0) / historicalScores.length
      : recentAvg;

    const improvement = recentAvg - historicalAvg;
    const improvementPercent = historicalAvg > 0 ? (improvement / historicalAvg) * 100 : 0;

    // Volatility (standard deviation)
    const avgScore = movingAverages[movingAverages.length - 1];
    const variance = recentScores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / recentScores.length;
    const stdDev = Math.sqrt(variance);
    const volatility = (stdDev / avgScore) * 100;

    // Determine trend
    let trend = 'stable';
    if (slope > 1) trend = 'improving';
    else if (slope < -1) trend = 'declining';

    // Confidence based on data points and volatility
    const dataConfidence = Math.min(scoreHistory.length / 20, 1);
    const volatilityPenalty = Math.max(0, 1 - volatility / 50);
    const confidence = dataConfidence * volatilityPenalty;

    return {
      trend,
      slope,
      intercept,
      recentAverage: Math.round(recentAvg),
      historicalAverage: Math.round(historicalAvg),
      improvement: Math.round(improvement),
      improvementPercent: Math.round(improvementPercent * 10) / 10,
      volatility: Math.round(volatility),
      confidence: Math.round(confidence * 100),
      message: getTrendMessage(trend, improvementPercent, volatility)
    };
  }

  function getTrendMessage(trend, improvementPercent, volatility) {
    if (trend === 'improving') {
      if (improvementPercent > 15) return '🚀 Excellent progress! You\'re improving rapidly.';
      if (improvementPercent > 5) return '📈 Steady improvement! Keep up the good work.';
      return '✨ You\'re getting better! Stay consistent.';
    } else if (trend === 'declining') {
      if (volatility > 20) return '⚠️ Scores are inconsistent. Focus on understanding core concepts.';
      return '💪 Take your time to review the fundamentals.';
    } else {
      if (volatility < 10) return '⭐ Consistent performance! Ready for harder challenges?';
      return '➡️ Maintaining steady progress.';
    }
  }

  /**
   * SKILL TYPE ANALYSIS
   * Analyzes performance across different critical thinking skills
   */
  function analyzeSkillTypes(scoreHistory, topics) {
    const skillTypes = ['logical', 'decision', 'adaptive', 'source', 'bias'];
    const skillData = {};

    skillTypes.forEach(skill => {
      skillData[skill] = {
        attempts: 0,
        totalScore: 0,
        avgScore: 0,
        recentAvg: 0,
        trend: 'stable',
        scores: []
      };
    });

    // Map puzzle IDs to their skill types
    const puzzleSkillMap = {};
    if (topics) {
      topics.forEach(topic => {
        topic.puzzles.forEach(puzzle => {
          puzzleSkillMap[puzzle.id] = puzzle.skillType;
        });
      });
    }

    // Categorize scores by skill type
    scoreHistory.forEach(entry => {
      const skillType = puzzleSkillMap[entry.puzzleId];
      if (skillType && skillData[skillType]) {
        skillData[skillType].scores.push(entry.score);
        skillData[skillType].attempts++;
        skillData[skillType].totalScore += entry.score;
      }
    });

    // Calculate averages and trends
    Object.keys(skillData).forEach(skill => {
      const data = skillData[skill];
      if (data.attempts > 0) {
        data.avgScore = Math.round(data.totalScore / data.attempts);

        // Recent average (last 3 attempts)
        const recentScores = data.scores.slice(-3);
        data.recentAvg = recentScores.length > 0
          ? Math.round(recentScores.reduce((a, b) => a + b, 0) / recentScores.length)
          : data.avgScore;

        // Trend
        if (data.scores.length >= 3) {
          const olderScores = data.scores.slice(0, -3);
          const olderAvg = olderScores.length > 0
            ? olderScores.reduce((a, b) => a + b, 0) / olderScores.length
            : data.recentAvg;

          if (data.recentAvg > olderAvg + 5) data.trend = 'improving';
          else if (data.recentAvg < olderAvg - 5) data.trend = 'declining';
        }
      }
    });

    // Find strongest and weakest skills
    const skillsWithData = Object.entries(skillData)
      .filter(([_, data]) => data.attempts > 0)
      .sort((a, b) => b[1].avgScore - a[1].avgScore);

    return {
      skillData,
      strongestSkill: skillsWithData[0]?.[0] || null,
      weakestSkill: skillsWithData[skillsWithData.length - 1]?.[0] || null,
      mostPracticedSkill: Object.entries(skillData)
        .sort((a, b) => b[1].attempts - a[1].attempts)[0]?.[0] || null
    };
  }

  /**
   * TOPIC MASTERY ANALYSIS
   * Deep dive into performance across topics with learning patterns
   */
  function analyzeTopicMastery(topicMastery, scoreHistory, topics) {
    const masteryLevels = {};
    const topicNames = {};

    // Get topic names
    if (topics) {
      topics.forEach(topic => {
        topicNames[topic.id] = topic.name;
      });
    }

    Object.entries(topicMastery).forEach(([topicId, data]) => {
      // Get scores for this topic from history
      const topicScores = scoreHistory
        .filter(h => h.topicId == topicId)
        .map(h => h.score);

      // Calculate mastery level
      let level = 'beginner';
      if (data.avgScore >= 90 && data.attempts >= 5) level = 'expert';
      else if (data.avgScore >= 80 && data.attempts >= 3) level = 'advanced';
      else if (data.avgScore >= 70 && data.attempts >= 2) level = 'intermediate';

      // Progression rate (how quickly they're improving)
      let progression = 'stable';
      if (topicScores.length >= 3) {
        const firstThird = topicScores.slice(0, Math.floor(topicScores.length / 3));
        const lastThird = topicScores.slice(-Math.floor(topicScores.length / 3));

        const firstAvg = firstThird.reduce((a, b) => a + b, 0) / firstThird.length;
        const lastAvg = lastThird.reduce((a, b) => a + b, 0) / lastThird.length;

        if (lastAvg > firstAvg + 10) progression = 'fast';
        else if (lastAvg > firstAvg + 3) progression = 'steady';
        else if (lastAvg < firstAvg - 3) progression = 'struggling';
      }

      // Consistency score
      const variance = topicScores.reduce((sum, score) => {
        return sum + Math.pow(score - data.avgScore, 2);
      }, 0) / topicScores.length;
      const consistency = Math.max(0, 100 - Math.sqrt(variance));

      masteryLevels[topicId] = {
        ...data,
        topicName: topicNames[topicId] || `Topic ${topicId}`,
        level,
        progression,
        consistency: Math.round(consistency),
        recentScores: topicScores.slice(-5),
        needsPractice: data.avgScore < 70 || data.attempts < 3
      };
    });

    return masteryLevels;
  }

  /**
   * LEARNING PATTERNS
   * Identifies when and how the user learns best
   */
  function analyzeLearningPatterns(scoreHistory) {
    if (scoreHistory.length < 10) {
      return {
        insufficient: true,
        message: 'Complete more puzzles to identify learning patterns'
      };
    }

    // Time of day analysis
    const hourlyPerformance = {};
    const weekdayPerformance = {};
    const sessionLengths = [];

    scoreHistory.forEach((entry, index) => {
      const date = new Date(entry.date);
      const hour = date.getHours();
      const weekday = date.getDay();

      // Hourly tracking
      if (!hourlyPerformance[hour]) {
        hourlyPerformance[hour] = { scores: [], count: 0 };
      }
      hourlyPerformance[hour].scores.push(entry.score);
      hourlyPerformance[hour].count++;

      // Weekday tracking
      if (!weekdayPerformance[weekday]) {
        weekdayPerformance[weekday] = { scores: [], count: 0 };
      }
      weekdayPerformance[weekday].scores.push(entry.score);
      weekdayPerformance[weekday].count++;

      // Session length (consecutive puzzles)
      if (index > 0) {
        const prevDate = new Date(scoreHistory[index - 1].date);
        const timeDiff = (date - prevDate) / (1000 * 60); // minutes
        if (timeDiff < 30) { // Same session if within 30 min
          if (sessionLengths.length === 0) sessionLengths.push(1);
          sessionLengths[sessionLengths.length - 1]++;
        } else {
          sessionLengths.push(1);
        }
      }
    });

    // Calculate averages
    Object.keys(hourlyPerformance).forEach(hour => {
      const data = hourlyPerformance[hour];
      data.avg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
    });

    Object.keys(weekdayPerformance).forEach(day => {
      const data = weekdayPerformance[day];
      data.avg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
    });

    // Find best times
    const bestHours = Object.entries(hourlyPerformance)
      .filter(([_, data]) => data.count >= 2)
      .sort((a, b) => b[1].avg - a[1].avg)
      .slice(0, 3)
      .map(([hour, data]) => ({
        hour: parseInt(hour),
        avgScore: Math.round(data.avg),
        count: data.count
      }));

    const bestDays = Object.entries(weekdayPerformance)
      .filter(([_, data]) => data.count >= 2)
      .sort((a, b) => b[1].avg - a[1].avg)
      .slice(0, 3)
      .map(([day, data]) => ({
        day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day],
        avgScore: Math.round(data.avg),
        count: data.count
      }));

    // Optimal session length
    const avgSessionLength = sessionLengths.length > 0
      ? sessionLengths.reduce((a, b) => a + b, 0) / sessionLengths.length
      : 1;

    return {
      bestHours,
      bestDays,
      avgSessionLength: Math.round(avgSessionLength),
      totalSessions: sessionLengths.length,
      recommendation: getTimeRecommendation(bestHours, bestDays, avgSessionLength)
    };
  }

  function getTimeRecommendation(bestHours, bestDays, avgSessionLength) {
    const recommendations = [];

    if (bestHours.length > 0) {
      const topHour = bestHours[0];
      const timeOfDay = topHour.hour < 12 ? 'morning' : topHour.hour < 17 ? 'afternoon' : 'evening';
      recommendations.push(`You perform best in the ${timeOfDay} (around ${formatHour(topHour.hour)})`);
    }

    if (bestDays.length > 0) {
      recommendations.push(`Your strongest days are ${bestDays.map(d => d.day).join(', ')}`);
    }

    if (avgSessionLength < 3) {
      recommendations.push('Try longer practice sessions (3-5 puzzles) to build momentum');
    } else if (avgSessionLength > 7) {
      recommendations.push('Consider shorter, focused sessions to maintain quality');
    }

    return recommendations;
  }

  function formatHour(hour) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${period}`;
  }

  /**
   * ACHIEVEMENT TRACKING
   * Defines and tracks achievements/milestones
   */
  function calculateAchievements(progress, analytics) {
    const achievements = [
      {
        id: 'first_step',
        name: 'First Steps',
        description: 'Complete your first puzzle',
        icon: '🎯',
        unlocked: analytics.totalAnswers >= 1
      },
      {
        id: 'dedicated',
        name: 'Dedicated Learner',
        description: 'Complete 10 puzzles',
        icon: '📚',
        unlocked: analytics.totalAnswers >= 10
      },
      {
        id: 'critical_thinker',
        name: 'Critical Thinker',
        description: 'Complete 50 puzzles',
        icon: '🧠',
        unlocked: analytics.totalAnswers >= 50
      },
      {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Score 100% on any puzzle',
        icon: '⭐',
        unlocked: analytics.scoreHistory.some(h => h.score === 100)
      },
      {
        id: 'consistent',
        name: 'Consistency is Key',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        unlocked: analytics.streak >= 7
      },
      {
        id: 'unstoppable',
        name: 'Unstoppable',
        description: 'Maintain a 30-day streak',
        icon: '💫',
        unlocked: analytics.streak >= 30
      },
      {
        id: 'high_achiever',
        name: 'High Achiever',
        description: 'Average score above 85%',
        icon: '🏆',
        unlocked: analytics.averageScore >= 85
      },
      {
        id: 'master',
        name: 'Master of Logic',
        description: 'Complete all puzzles in a topic with 90%+ average',
        icon: '👑',
        unlocked: Object.values(analytics.topicMastery || {}).some(t => t.avgScore >= 90 && t.attempts >= 5)
      },
      {
        id: 'game_master',
        name: 'Game Master',
        description: 'Complete 20 minigames',
        icon: '🎮',
        unlocked: progress.totalMinigamesCompleted >= 20
      },
      {
        id: 'diverse',
        name: 'Diverse Thinker',
        description: 'Complete puzzles from 5 different topics',
        icon: '🌈',
        unlocked: Object.keys(analytics.topicMastery || {}).length >= 5
      }
    ];

    const unlocked = achievements.filter(a => a.unlocked);
    const locked = achievements.filter(a => !a.unlocked);

    return {
      total: achievements.length,
      unlocked: unlocked.length,
      achievements: unlocked,
      nextAchievements: locked.slice(0, 3)
    };
  }

  /**
   * PERSONALIZED INSIGHTS
   * Generate actionable recommendations based on all analytics
   */
  function generateInsights(comprehensiveAnalytics) {
    const insights = [];
    const { trend, skillAnalysis, topicMastery, learningPatterns, achievements } = comprehensiveAnalytics;

    // Performance trend insights
    if (trend.trend === 'improving' && trend.improvementPercent > 10) {
      insights.push({
        type: 'success',
        icon: '🚀',
        title: 'Rapid Improvement',
        message: `You've improved by ${trend.improvementPercent}%! Your hard work is paying off.`,
        priority: 'high'
      });
    } else if (trend.trend === 'declining') {
      insights.push({
        type: 'warning',
        icon: '💡',
        title: 'Focus Needed',
        message: 'Scores have dipped recently. Try reviewing fundamentals or taking shorter breaks between sessions.',
        priority: 'high'
      });
    }

    // Skill-based insights
    if (skillAnalysis.weakestSkill) {
      const weakSkill = skillAnalysis.skillData[skillAnalysis.weakestSkill];
      const skillNames = {
        logical: 'Logical Reasoning',
        decision: 'Decision Making',
        adaptive: 'Adaptive Learning',
        source: 'Source Evaluation',
        bias: 'Bias Detection'
      };

      insights.push({
        type: 'improvement',
        icon: '🎯',
        title: 'Skill Development Area',
        message: `Focus on ${skillNames[skillAnalysis.weakestSkill]} (${weakSkill.avgScore}% avg). Practice makes perfect!`,
        priority: 'medium'
      });
    }

    if (skillAnalysis.strongestSkill) {
      const skillNames = {
        logical: 'Logical Reasoning',
        decision: 'Decision Making',
        adaptive: 'Adaptive Learning',
        source: 'Source Evaluation',
        bias: 'Bias Detection'
      };

      insights.push({
        type: 'success',
        icon: '⭐',
        title: 'Your Strength',
        message: `Excellent ${skillNames[skillAnalysis.strongestSkill]} skills! Keep challenging yourself.`,
        priority: 'low'
      });
    }

    // Topic mastery insights
    const needsPracticeTopics = Object.values(topicMastery).filter(t => t.needsPractice);
    if (needsPracticeTopics.length > 0) {
      const topic = needsPracticeTopics[0];
      insights.push({
        type: 'improvement',
        icon: '📖',
        title: 'Practice Opportunity',
        message: `Spend more time on ${topic.topicName} to build mastery (${topic.attempts} attempts so far).`,
        priority: 'medium'
      });
    }

    // Learning pattern insights
    if (learningPatterns.recommendation && learningPatterns.recommendation.length > 0) {
      insights.push({
        type: 'info',
        icon: '⏰',
        title: 'Optimize Your Schedule',
        message: learningPatterns.recommendation[0],
        priority: 'low'
      });
    }

    // Achievement insights
    if (achievements.nextAchievements && achievements.nextAchievements.length > 0) {
      const next = achievements.nextAchievements[0];
      insights.push({
        type: 'goal',
        icon: '🎖️',
        title: 'Next Achievement',
        message: `${next.name}: ${next.description}`,
        priority: 'low'
      });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return insights.slice(0, 5); // Return top 5 insights
  }

  /**
   * COMPREHENSIVE ANALYTICS
   * Main function that combines all analyses
   */
  function getComprehensiveAnalytics(userId, topics) {
    const analytics = window.UserProgressService?.loadAnalytics?.(userId) ||
                     JSON.parse(localStorage.getItem(`mindcase_analytics_${userId}`) || '{}');
    const progress = window.UserProgressService?.loadProgress?.(userId) ||
                    JSON.parse(localStorage.getItem(`mindcase_user_progress_${userId}`) || '{}');

    const scoreHistory = analytics.scoreHistory || [];
    const topicMasteryData = analytics.topicMastery || {};

    // Run all analyses
    const trend = analyzePerformanceTrend(scoreHistory);
    const skillAnalysis = analyzeSkillTypes(scoreHistory, topics);
    const topicMastery = analyzeTopicMastery(topicMasteryData, scoreHistory, topics);
    const learningPatterns = analyzeLearningPatterns(scoreHistory);
    const achievements = calculateAchievements(progress, analytics);

    const comprehensive = {
      // Core metrics
      totalAnswers: analytics.totalAnswers || 0,
      averageScore: Math.round(analytics.averageScore || 0),
      streak: analytics.streak || 0,
      totalPuzzlesCompleted: progress.totalPuzzlesCompleted || 0,
      totalMinigamesCompleted: progress.totalMinigamesCompleted || 0,
      timeSpent: Math.round(analytics.timeSpent || 0),

      // Deep analyses
      trend,
      skillAnalysis,
      topicMastery,
      learningPatterns,
      achievements,

      // Legacy compatibility
      performanceTrend: trend.trend,
      recentAverage: trend.recentAverage,
      improvement: trend.improvement,
      strongestTopic: Object.entries(topicMastery)
        .sort((a, b) => b[1].avgScore - a[1].avgScore)[0]?.[1]?.topicName || null,
      weakestTopic: Object.entries(topicMastery)
        .sort((a, b) => a[1].avgScore - b[1].avgScore)[0]?.[1]?.topicName || null,
      mostPlayedMinigame: Object.entries(analytics.minigameStats || {})
        .sort((a, b) => b[1].completed - a[1].completed)[0]?.[0] || null,
      minigameStats: analytics.minigameStats || {}
    };

    // Generate insights last (needs all other data)
    comprehensive.insights = generateInsights(comprehensive);

    return comprehensive;
  }

  // Public API
  return {
    analyzePerformanceTrend,
    analyzeSkillTypes,
    analyzeTopicMastery,
    analyzeLearningPatterns,
    calculateAchievements,
    generateInsights,
    getComprehensiveAnalytics
  };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AnalyticsEngine };
}

// Make available globally for browser
if (typeof window !== 'undefined') {
  window.AnalyticsEngine = AnalyticsEngine;
}
