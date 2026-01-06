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
   * MINIGAME COGNITIVE ANALYSIS
   * Analyzes performance across cognitive domains based on minigame results
   */
  function analyzeMinigameCognition(userId) {
    const analytics = window.UserProgressService?.loadAnalytics?.(userId) ||
                     JSON.parse(localStorage.getItem(`mindcase_analytics_${userId}`) || '{}');

    const cognitiveProfile = analytics.cognitiveProfile || {};
    const minigameHistory = analytics.minigameHistory || [];
    const minigameStats = analytics.minigameStats || {};

    // Category display names
    const categoryNames = {
      memory: 'Working Memory',
      attention: 'Sustained Attention',
      processing: 'Visual Processing',
      inhibition: 'Response Inhibition',
      flexibility: 'Cognitive Flexibility',
      reasoning: 'Logical Reasoning'
    };

    // Calculate detailed cognitive metrics
    const cognitiveMetrics = {};

    Object.entries(cognitiveProfile).forEach(([category, data]) => {
      if (data.sessions >= 1) {
        // Get recent performance for this category
        const categoryHistory = minigameHistory
          .filter(h => h.cognitiveCategory === category)
          .slice(-20);

        // Calculate performance trajectory
        let trajectory = 'stable';
        if (categoryHistory.length >= 6) {
          const firstHalf = categoryHistory.slice(0, Math.floor(categoryHistory.length / 2));
          const secondHalf = categoryHistory.slice(Math.floor(categoryHistory.length / 2));

          const firstAvg = firstHalf.reduce((sum, h) => sum + h.score, 0) / firstHalf.length;
          const secondAvg = secondHalf.reduce((sum, h) => sum + h.score, 0) / secondHalf.length;

          if (secondAvg > firstAvg + 8) trajectory = 'rapidly_improving';
          else if (secondAvg > firstAvg + 3) trajectory = 'improving';
          else if (secondAvg < firstAvg - 8) trajectory = 'declining';
          else if (secondAvg < firstAvg - 3) trajectory = 'slight_decline';
        }

        // Calculate consistency (lower variance = more consistent)
        const scores = categoryHistory.map(h => h.score);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const variance = scores.reduce((sum, s) => sum + Math.pow(s - avgScore, 2), 0) / scores.length;
        const consistency = Math.max(0, 100 - Math.sqrt(variance));

        // Calculate best and worst performances
        const bestScore = Math.max(...scores, 0);
        const worstScore = Math.min(...scores, 100);

        cognitiveMetrics[category] = {
          name: categoryNames[category],
          score: data.score,
          sessions: Math.round(data.sessions),
          trend: data.trend,
          trajectory,
          consistency: Math.round(consistency),
          bestScore,
          worstScore,
          recentScores: scores.slice(-5),
          // Skill level based on score
          level: data.score >= 90 ? 'expert' :
                 data.score >= 75 ? 'advanced' :
                 data.score >= 60 ? 'intermediate' : 'developing'
        };
      }
    });

    // Calculate overall cognitive score (weighted average)
    const metricsWithData = Object.values(cognitiveMetrics).filter(m => m.sessions >= 1);
    const overallCognitiveScore = metricsWithData.length > 0
      ? Math.round(metricsWithData.reduce((sum, m) => sum + m.score * m.sessions, 0) /
                   metricsWithData.reduce((sum, m) => sum + m.sessions, 0))
      : 0;

    // Find strongest and weakest areas
    const sortedMetrics = metricsWithData.sort((a, b) => b.score - a.score);
    const strongestAreas = sortedMetrics.slice(0, 2);
    const weakestAreas = sortedMetrics.slice(-2).reverse();

    // Generate cognitive insights
    const cognitiveInsights = [];

    if (strongestAreas.length > 0) {
      cognitiveInsights.push({
        type: 'strength',
        icon: '💪',
        title: 'Cognitive Strengths',
        message: `Strong performance in ${strongestAreas.map(a => a.name).join(' and ')}`,
        priority: 'high'
      });
    }

    // Find areas needing improvement
    const needsImprovement = weakestAreas.filter(a => a.score < 70 && a.sessions >= 3);
    if (needsImprovement.length > 0) {
      cognitiveInsights.push({
        type: 'focus',
        icon: '🎯',
        title: 'Focus Areas',
        message: `Consider practicing more ${needsImprovement.map(a => a.name).join(' and ')} exercises`,
        priority: 'medium'
      });
    }

    // Check for rapid improvement
    const rapidlyImproving = metricsWithData.filter(m => m.trajectory === 'rapidly_improving');
    if (rapidlyImproving.length > 0) {
      cognitiveInsights.push({
        type: 'progress',
        icon: '🚀',
        title: 'Rapid Progress',
        message: `Excellent improvement in ${rapidlyImproving.map(a => a.name).join(', ')}!`,
        priority: 'high'
      });
    }

    // Check for declining areas
    const declining = metricsWithData.filter(m => m.trajectory === 'declining');
    if (declining.length > 0) {
      cognitiveInsights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Needs Attention',
        message: `${declining.map(a => a.name).join(', ')} performance has dipped recently`,
        priority: 'medium'
      });
    }

    // Check consistency
    const inconsistent = metricsWithData.filter(m => m.consistency < 60 && m.sessions >= 5);
    if (inconsistent.length > 0) {
      cognitiveInsights.push({
        type: 'tip',
        icon: '💡',
        title: 'Consistency Tip',
        message: `Try to maintain focus during ${inconsistent[0].name} exercises for more consistent results`,
        priority: 'low'
      });
    }

    // Calculate minigame variety (how many different games played)
    const gamesPlayed = Object.keys(minigameStats).filter(g => minigameStats[g].completed > 0);
    const totalGames = 15; // Total available minigames
    const varietyScore = Math.round((gamesPlayed.length / totalGames) * 100);

    if (varietyScore < 50 && gamesPlayed.length >= 3) {
      cognitiveInsights.push({
        type: 'suggestion',
        icon: '🎮',
        title: 'Try New Games',
        message: `You've only played ${gamesPlayed.length} of ${totalGames} games. Try different games to train all cognitive areas!`,
        priority: 'low'
      });
    }

    return {
      cognitiveMetrics,
      overallCognitiveScore,
      strongestAreas: strongestAreas.map(a => a.name),
      weakestAreas: weakestAreas.map(a => a.name),
      cognitiveInsights,
      varietyScore,
      gamesPlayed: gamesPlayed.length,
      totalGamesAvailable: totalGames
    };
  }

  /**
   * ERROR CLASSIFICATION ANALYSIS
   * Classifies errors into categories: Premature Commitment, Rule Persistence, Random Guessing, Over-waiting
   */
  function analyzeErrorPatterns(minigameHistory) {
    if (!minigameHistory || minigameHistory.length < 5) {
      return { insufficient: true, message: 'Need more game data for error analysis' };
    }

    const errorClassification = {
      prematureCommitment: { count: 0, percentage: 0, trend: 'stable', description: 'Acting too quickly before fully processing' },
      rulePersistence: { count: 0, percentage: 0, trend: 'stable', description: 'Continuing old rules after they change' },
      randomGuessing: { count: 0, percentage: 0, trend: 'stable', description: 'Responding without clear strategy' },
      overWaiting: { count: 0, percentage: 0, trend: 'stable', description: 'Missing opportunities by waiting too long' }
    };

    let totalErrors = 0;
    const recentGames = minigameHistory.slice(-30);
    const olderGames = minigameHistory.slice(-60, -30);

    recentGames.forEach(game => {
      const errors = game.errors || 0;
      totalErrors += errors;

      // Classify based on game type and error patterns
      const accuracy = game.accuracy || 0;
      const reactionTime = game.reactionTime || 0;

      // Premature Commitment: Fast response + errors (especially in inhibition games)
      if (game.cognitiveCategory === 'inhibition' && errors > 0) {
        // Commission errors in Go/NoGo tasks = premature commitment
        errorClassification.prematureCommitment.count += Math.ceil(errors * 0.7);
      } else if (reactionTime > 0 && reactionTime < 500 && accuracy < 70) {
        errorClassification.prematureCommitment.count += Math.ceil(errors * 0.5);
      }

      // Rule Persistence: Errors in flexibility games
      if (game.cognitiveCategory === 'flexibility' && errors > 0) {
        errorClassification.rulePersistence.count += Math.ceil(errors * 0.8);
      }

      // Random Guessing: Low accuracy with medium reaction times
      if (accuracy < 50 && accuracy > 0 && game.totalResponses >= 5) {
        errorClassification.randomGuessing.count += Math.ceil(errors * 0.4);
      }

      // Over-waiting: Missed responses or very slow with errors
      if (game.correctRejections !== undefined && game.hits !== undefined) {
        // If correct rejections are high but hits are low, might be over-waiting
        const hitRate = game.hits / (game.totalResponses || 1);
        if (hitRate < 0.5 && game.correctRejections > game.hits) {
          errorClassification.overWaiting.count += 1;
        }
      }
    });

    // Calculate percentages
    const totalClassified = Object.values(errorClassification).reduce((sum, e) => sum + e.count, 0) || 1;
    Object.keys(errorClassification).forEach(key => {
      errorClassification[key].percentage = Math.round((errorClassification[key].count / totalClassified) * 100);
    });

    // Calculate trends by comparing recent vs older data
    if (olderGames.length >= 10) {
      const recentErrorRate = recentGames.reduce((sum, g) => sum + (g.errors || 0), 0) / recentGames.length;
      const olderErrorRate = olderGames.reduce((sum, g) => sum + (g.errors || 0), 0) / olderGames.length;

      if (recentErrorRate < olderErrorRate * 0.8) {
        Object.keys(errorClassification).forEach(key => {
          errorClassification[key].trend = 'improving';
        });
      } else if (recentErrorRate > olderErrorRate * 1.2) {
        Object.keys(errorClassification).forEach(key => {
          errorClassification[key].trend = 'worsening';
        });
      }
    }

    // Determine dominant error type
    const sortedErrors = Object.entries(errorClassification)
      .filter(([_, v]) => v.count > 0)
      .sort((a, b) => b[1].count - a[1].count);

    return {
      errorClassification,
      totalErrors,
      dominantErrorType: sortedErrors[0]?.[0] || null,
      dominantErrorName: sortedErrors[0] ? {
        prematureCommitment: 'Premature Commitment',
        rulePersistence: 'Rule Persistence',
        randomGuessing: 'Random Guessing',
        overWaiting: 'Over-waiting'
      }[sortedErrors[0][0]] : null,
      errorBreakdown: sortedErrors.map(([key, val]) => ({
        type: key,
        name: {
          prematureCommitment: 'Premature Commitment',
          rulePersistence: 'Rule Persistence',
          randomGuessing: 'Random Guessing',
          overWaiting: 'Over-waiting'
        }[key],
        ...val
      }))
    };
  }

  /**
   * SPEED-ACCURACY TRADEOFF ANALYSIS
   * Analyzes the relationship between response speed and accuracy over time
   */
  function analyzeSpeedAccuracyTradeoff(minigameHistory) {
    if (!minigameHistory || minigameHistory.length < 5) {
      return { insufficient: true, message: 'Need more game data for speed-accuracy analysis' };
    }

    // Group games into time periods for trajectory analysis
    const periodsCount = Math.min(6, Math.floor(minigameHistory.length / 3));
    if (periodsCount < 2) {
      return { insufficient: true, message: 'Need more sessions for trajectory analysis' };
    }

    const periodSize = Math.floor(minigameHistory.length / periodsCount);
    const periods = [];

    for (let i = 0; i < periodsCount; i++) {
      const start = i * periodSize;
      const end = i === periodsCount - 1 ? minigameHistory.length : (i + 1) * periodSize;
      const periodGames = minigameHistory.slice(start, end);

      const avgAccuracy = periodGames.reduce((sum, g) => sum + (g.accuracy || g.score || 0), 0) / periodGames.length;
      const gamesWithTime = periodGames.filter(g => g.timeSpent > 0);
      const avgSpeed = gamesWithTime.length > 0
        ? gamesWithTime.reduce((sum, g) => sum + g.timeSpent, 0) / gamesWithTime.length
        : 0;

      periods.push({
        period: i + 1,
        accuracy: Math.round(avgAccuracy),
        speed: Math.round(avgSpeed),
        gamesCount: periodGames.length
      });
    }

    // Analyze trajectory movement
    const firstPeriod = periods[0];
    const lastPeriod = periods[periods.length - 1];

    let trajectoryType = 'stable';
    let trajectoryDescription = '';

    const accuracyChange = lastPeriod.accuracy - firstPeriod.accuracy;
    const speedChange = lastPeriod.speed - firstPeriod.speed; // Positive = slower

    if (accuracyChange > 10 && speedChange > 0) {
      trajectoryType = 'accuracy_focus';
      trajectoryDescription = 'Moving toward higher accuracy (taking more time)';
    } else if (accuracyChange > 10 && speedChange <= 0) {
      trajectoryType = 'optimal_improvement';
      trajectoryDescription = 'Improving both speed and accuracy - excellent progress!';
    } else if (accuracyChange < -10 && speedChange < 0) {
      trajectoryType = 'speed_focus';
      trajectoryDescription = 'Moving toward faster responses (sacrificing accuracy)';
    } else if (accuracyChange < -10 && speedChange >= 0) {
      trajectoryType = 'declining';
      trajectoryDescription = 'Performance declining - consider slowing down';
    } else if (Math.abs(accuracyChange) <= 10 && Math.abs(speedChange) <= 5) {
      trajectoryType = 'stable';
      trajectoryDescription = 'Consistent performance - good stability';
    } else {
      trajectoryType = 'variable';
      trajectoryDescription = 'Performance is variable - working on finding optimal balance';
    }

    // Calculate optimal zone (where accuracy is highest)
    const optimalPeriod = periods.reduce((best, p) => p.accuracy > best.accuracy ? p : best, periods[0]);

    // Calculate efficiency score (accuracy per unit time)
    const currentEfficiency = lastPeriod.speed > 0 ? (lastPeriod.accuracy / lastPeriod.speed) * 10 : 0;
    const startEfficiency = firstPeriod.speed > 0 ? (firstPeriod.accuracy / firstPeriod.speed) * 10 : 0;
    const efficiencyImprovement = currentEfficiency - startEfficiency;

    return {
      periods,
      trajectoryType,
      trajectoryDescription,
      currentAccuracy: lastPeriod.accuracy,
      currentSpeed: lastPeriod.speed,
      accuracyChange,
      speedChange: -speedChange, // Invert so positive = faster
      optimalZone: {
        accuracy: optimalPeriod.accuracy,
        speed: optimalPeriod.speed,
        period: optimalPeriod.period
      },
      efficiency: {
        current: Math.round(currentEfficiency * 10) / 10,
        improvement: Math.round(efficiencyImprovement * 10) / 10,
        trend: efficiencyImprovement > 0.5 ? 'improving' : efficiencyImprovement < -0.5 ? 'declining' : 'stable'
      }
    };
  }

  /**
   * LEARNING CURVE ANALYSIS
   * Analyzes how the user learns over time with performance progression
   */
  function analyzeLearningCurve(minigameHistory) {
    if (!minigameHistory || minigameHistory.length < 8) {
      return { insufficient: true, message: 'Need more sessions for learning curve analysis' };
    }

    // Calculate rolling averages for smooth curve
    const windowSize = 3;
    const learningCurve = [];

    for (let i = windowSize - 1; i < minigameHistory.length; i++) {
      const window = minigameHistory.slice(i - windowSize + 1, i + 1);
      const avgScore = window.reduce((sum, g) => sum + (g.score || g.accuracy || 0), 0) / windowSize;
      learningCurve.push({
        session: i + 1,
        score: Math.round(avgScore),
        timestamp: minigameHistory[i].timestamp
      });
    }

    // Detect learning phases
    const phases = [];
    let currentPhase = { type: 'initial', start: 0, scores: [] };

    learningCurve.forEach((point, idx) => {
      currentPhase.scores.push(point.score);

      // Every 5 points, evaluate the phase
      if ((idx + 1) % 5 === 0 || idx === learningCurve.length - 1) {
        const avgScore = currentPhase.scores.reduce((a, b) => a + b, 0) / currentPhase.scores.length;
        const firstHalf = currentPhase.scores.slice(0, Math.ceil(currentPhase.scores.length / 2));
        const secondHalf = currentPhase.scores.slice(Math.ceil(currentPhase.scores.length / 2));
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

        let phaseType = 'plateau';
        if (secondAvg > firstAvg + 5) phaseType = 'growth';
        else if (secondAvg < firstAvg - 5) phaseType = 'decline';
        else if (avgScore >= 80) phaseType = 'mastery';

        phases.push({
          type: phaseType,
          avgScore: Math.round(avgScore),
          sessions: currentPhase.scores.length
        });

        currentPhase = { type: 'initial', start: idx + 1, scores: [] };
      }
    });

    // Determine overall learning stage
    const recentScores = learningCurve.slice(-10).map(p => p.score);
    const avgRecentScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;

    let learningStage = 'novice';
    if (avgRecentScore >= 85) learningStage = 'expert';
    else if (avgRecentScore >= 70) learningStage = 'proficient';
    else if (avgRecentScore >= 55) learningStage = 'competent';
    else if (avgRecentScore >= 40) learningStage = 'developing';

    // Calculate learning velocity (rate of improvement)
    const firstThird = learningCurve.slice(0, Math.floor(learningCurve.length / 3));
    const lastThird = learningCurve.slice(-Math.floor(learningCurve.length / 3));
    const earlyAvg = firstThird.reduce((sum, p) => sum + p.score, 0) / firstThird.length;
    const lateAvg = lastThird.reduce((sum, p) => sum + p.score, 0) / lastThird.length;
    const learningVelocity = lateAvg - earlyAvg;

    return {
      learningCurve: learningCurve.slice(-20), // Last 20 points for visualization
      phases,
      learningStage,
      learningStageDescription: {
        novice: 'Building foundational skills',
        developing: 'Starting to grasp key concepts',
        competent: 'Solid understanding, still improving',
        proficient: 'Strong performance, approaching mastery',
        expert: 'Excellent mastery of cognitive skills'
      }[learningStage],
      learningVelocity: Math.round(learningVelocity),
      velocityInterpretation: learningVelocity > 10 ? 'rapid_growth' :
                              learningVelocity > 3 ? 'steady_progress' :
                              learningVelocity > -3 ? 'stable' :
                              learningVelocity > -10 ? 'slight_decline' : 'needs_attention',
      currentScore: Math.round(avgRecentScore),
      totalSessions: minigameHistory.length
    };
  }

  /**
   * SESSION PERFORMANCE ANALYSIS
   * Analyzes within-session performance patterns (fatigue, warmup, etc.)
   */
  function analyzeSessionPatterns(minigameHistory, dailyLog) {
    if (!minigameHistory || minigameHistory.length < 10) {
      return { insufficient: true };
    }

    // Analyze performance by position in session
    const positionPerformance = { early: [], middle: [], late: [] };

    // Group by date to identify sessions
    const sessionMap = {};
    minigameHistory.forEach(game => {
      const date = new Date(game.timestamp).toDateString();
      if (!sessionMap[date]) sessionMap[date] = [];
      sessionMap[date].push(game);
    });

    Object.values(sessionMap).forEach(sessionGames => {
      if (sessionGames.length < 3) return;

      const third = Math.ceil(sessionGames.length / 3);
      sessionGames.forEach((game, idx) => {
        const score = game.score || game.accuracy || 0;
        if (idx < third) positionPerformance.early.push(score);
        else if (idx < third * 2) positionPerformance.middle.push(score);
        else positionPerformance.late.push(score);
      });
    });

    const avgEarly = positionPerformance.early.length > 0
      ? positionPerformance.early.reduce((a, b) => a + b, 0) / positionPerformance.early.length : 0;
    const avgMiddle = positionPerformance.middle.length > 0
      ? positionPerformance.middle.reduce((a, b) => a + b, 0) / positionPerformance.middle.length : 0;
    const avgLate = positionPerformance.late.length > 0
      ? positionPerformance.late.reduce((a, b) => a + b, 0) / positionPerformance.late.length : 0;

    let sessionPattern = 'consistent';
    let patternDescription = 'Performance stays consistent throughout sessions';

    if (avgLate < avgEarly - 10 && avgLate < avgMiddle - 5) {
      sessionPattern = 'fatigue';
      patternDescription = 'Performance drops toward end of sessions - consider shorter sessions';
    } else if (avgEarly < avgMiddle - 10) {
      sessionPattern = 'warmup_needed';
      patternDescription = 'Takes time to warm up - start with easier games';
    } else if (avgMiddle > avgEarly && avgMiddle > avgLate) {
      sessionPattern = 'peak_middle';
      patternDescription = 'Best performance in middle of sessions - good pacing';
    } else if (avgLate > avgEarly + 5) {
      sessionPattern = 'building_momentum';
      patternDescription = 'Performance improves as session progresses - great endurance!';
    }

    // Daily performance trends
    const dailyScores = (dailyLog || []).slice(-14).map(d => ({
      date: d.date,
      avgScore: d.avgScore,
      games: d.games
    }));

    return {
      sessionPattern,
      patternDescription,
      positionScores: {
        early: Math.round(avgEarly),
        middle: Math.round(avgMiddle),
        late: Math.round(avgLate)
      },
      dailyTrend: dailyScores,
      recommendation: sessionPattern === 'fatigue' ? 'Try taking a short break after 5-6 games' :
                     sessionPattern === 'warmup_needed' ? 'Start with 1-2 easy games to warm up' :
                     sessionPattern === 'building_momentum' ? 'You\'re on the right track!' :
                     'Keep up the consistent performance!'
    };
  }

  /**
   * COGNITIVE TRAINING ANALYSIS
   * Analyzes performance in cognitive training sessions (Signal Field, Forensic Narrative, Variable Manifold)
   */
  function analyzeCognitiveTraining(userId) {
    const analytics = window.UserProgressService?.loadAnalytics?.(userId) ||
                     JSON.parse(localStorage.getItem(`mindcase_analytics_${userId}`) || '{}');

    const cognitiveTraining = analytics.cognitiveTraining || {
      totalSessions: 0,
      sessionHistory: [],
      gameTypeStats: {},
      cognitiveGrowthHistory: [],
      averageProcessScore: 0
    };

    if (cognitiveTraining.totalSessions === 0) {
      return {
        insufficient: true,
        message: 'Complete cognitive training sessions to see analytics'
      };
    }

    const sessions = cognitiveTraining.sessionHistory || [];
    const gameTypeStats = cognitiveTraining.gameTypeStats || {};

    // Game type display names
    const gameTypeNames = {
      signal_field: 'Signal Field',
      forensic_narrative: 'Forensic Narrative',
      variable_manifold: 'Variable Manifold'
    };

    // Calculate process score trend
    let processTrend = 'stable';
    if (sessions.length >= 5) {
      const firstHalf = sessions.slice(0, Math.floor(sessions.length / 2));
      const secondHalf = sessions.slice(Math.floor(sessions.length / 2));
      const firstAvg = firstHalf.reduce((sum, s) => sum + (s.processScore || 0), 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, s) => sum + (s.processScore || 0), 0) / secondHalf.length;

      if (secondAvg > firstAvg + 10) processTrend = 'rapidly_improving';
      else if (secondAvg > firstAvg + 3) processTrend = 'improving';
      else if (secondAvg < firstAvg - 10) processTrend = 'declining';
      else if (secondAvg < firstAvg - 3) processTrend = 'slight_decline';
    }

    // Calculate cognitive primitive growth
    const primitiveGrowth = {};
    const primitiveNames = {
      ambiguity_tolerance: 'Ambiguity Tolerance',
      evidence_patience: 'Evidence Patience',
      metacognitive_awareness: 'Metacognitive Awareness',
      revision_willingness: 'Revision Willingness',
      causal_skepticism: 'Causal Skepticism'
    };

    (cognitiveTraining.cognitiveGrowthHistory || []).forEach(record => {
      (record.areas || []).forEach(area => {
        if (!primitiveGrowth[area]) {
          primitiveGrowth[area] = { count: 0, name: primitiveNames[area] || area };
        }
        primitiveGrowth[area].count++;
      });
    });

    // Sort primitives by growth frequency
    const sortedPrimitives = Object.entries(primitiveGrowth)
      .sort((a, b) => b[1].count - a[1].count);

    const strongestPrimitives = sortedPrimitives.slice(0, 2);
    const weakestPrimitives = sortedPrimitives.slice(-2).reverse();

    // Calculate game type performance
    const gameTypePerformance = Object.entries(gameTypeStats).map(([gameType, stats]) => ({
      gameType,
      name: gameTypeNames[gameType] || gameType,
      sessions: stats.sessions,
      avgScore: stats.avgScore,
      totalScore: stats.totalScore
    })).sort((a, b) => b.sessions - a.sessions);

    // Get best and worst game types
    const sortedByScore = [...gameTypePerformance].sort((a, b) => b.avgScore - a.avgScore);
    const bestGameType = sortedByScore[0] || null;
    const worstGameType = sortedByScore[sortedByScore.length - 1] || null;

    // Recent sessions for detailed view
    const recentSessions = sessions.slice(-10).reverse().map(s => ({
      ...s,
      gameTypeName: gameTypeNames[s.gameType] || s.gameType,
      date: new Date(s.timestamp).toLocaleDateString()
    }));

    // Generate insights
    const insights = [];

    if (processTrend === 'improving' || processTrend === 'rapidly_improving') {
      insights.push({
        type: 'success',
        icon: '📈',
        title: 'Reasoning Improvement',
        message: `Your reasoning process quality is ${processTrend === 'rapidly_improving' ? 'rapidly ' : ''}improving!`
      });
    } else if (processTrend === 'declining') {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Focus Needed',
        message: 'Take time to reflect before making conclusions. Quality over speed.'
      });
    }

    if (strongestPrimitives.length > 0) {
      insights.push({
        type: 'strength',
        icon: '💪',
        title: 'Cognitive Strengths',
        message: `Strong growth in ${strongestPrimitives.map(([_, v]) => v.name).join(' and ')}`
      });
    }

    if (weakestPrimitives.length > 0 && weakestPrimitives[0][1].count < 3) {
      insights.push({
        type: 'focus',
        icon: '🎯',
        title: 'Growth Opportunity',
        message: `Practice scenarios that develop ${weakestPrimitives.map(([_, v]) => v.name).join(' and ')}`
      });
    }

    if (gameTypePerformance.length < 3) {
      const missingGames = ['signal_field', 'forensic_narrative', 'variable_manifold']
        .filter(g => !gameTypeStats[g])
        .map(g => gameTypeNames[g]);
      if (missingGames.length > 0) {
        insights.push({
          type: 'suggestion',
          icon: '🎮',
          title: 'Try New Training Types',
          message: `Explore ${missingGames.join(' and ')} for comprehensive cognitive development`
        });
      }
    }

    return {
      totalSessions: cognitiveTraining.totalSessions,
      averageProcessScore: cognitiveTraining.averageProcessScore,
      processTrend,
      gameTypePerformance,
      bestGameType,
      worstGameType,
      primitiveGrowth,
      strongestPrimitives: strongestPrimitives.map(([k, v]) => ({ key: k, ...v })),
      weakestPrimitives: weakestPrimitives.map(([k, v]) => ({ key: k, ...v })),
      recentSessions,
      insights,
      // For visualization
      processScoreHistory: sessions.slice(-20).map(s => ({
        score: s.processScore,
        timestamp: s.timestamp,
        gameType: s.gameType
      }))
    };
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

    // Get minigame cognitive analysis
    const minigameCognition = analyzeMinigameCognition(userId);

    // Get cognitive training analysis
    const cognitiveTrainingAnalysis = analyzeCognitiveTraining(userId);

    const comprehensive = {
      // Core metrics
      totalAnswers: analytics.totalAnswers || 0,
      averageScore: Math.round(analytics.averageScore || 0),
      streak: analytics.streak || 0,
      totalPuzzlesCompleted: progress.totalPuzzlesCompleted || 0,
      totalMinigamesCompleted: progress.totalMinigamesCompleted || 0,
      totalCognitiveTrainingSessions: cognitiveTrainingAnalysis.totalSessions || 0,
      timeSpent: Math.round(analytics.timeSpent || 0),

      // Deep analyses
      trend,
      skillAnalysis,
      topicMastery,
      learningPatterns,
      achievements,

      // Minigame cognitive analysis
      minigameCognition,
      cognitiveProfile: analytics.cognitiveProfile || {},
      minigameHistory: analytics.minigameHistory || [],
      dailyMinigameLog: analytics.dailyMinigameLog || [],

      // Cognitive Training analysis
      cognitiveTraining: cognitiveTrainingAnalysis,

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
    analyzeMinigameCognition,
    analyzeCognitiveTraining,
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
