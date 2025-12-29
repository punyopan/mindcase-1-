import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Trophy, Target, BarChart2, Lock, Brain, Clock, Award, Zap, Book, Calendar, CheckCircle } from './icon';

const AdvancedAnalytics = ({ onClose, userId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAnalytics();
  }, [userId]);

  const loadAnalytics = () => {
    try {
      // Check if user is premium
      const premium = window.PaymentService?.isPremium(userId) || false;
      setIsPremium(premium);

      if (premium) {
        // Load comprehensive advanced analytics for premium users
        const topics = window.topics || [];
        const data = window.AnalyticsEngine?.getComprehensiveAnalytics(userId, topics) ||
                     window.UserProgressService?.getAdvancedAnalytics(userId);
        setAnalytics(data);
      } else {
        // Load basic analytics for free users
        const data = window.UserProgressService?.getBasicAnalytics(userId);
        setAnalytics(data);
      }
    } catch (e) {
      console.error('Failed to load analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-stone-900 border-2 border-amber-700/50 rounded-2xl p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Premium upgrade prompt for free users
  if (!isPremium) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 border-2 border-amber-700/50 rounded-2xl w-full max-w-2xl shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-900 to-red-900 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-6 h-6" />
                Analytics Dashboard
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => loadAnalytics(), 100);
                  }}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors text-white text-sm font-medium flex items-center gap-2"
                  title="Refresh analytics data"
                >
                  <Zap className="w-4 h-4" />
                  Refresh
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Basic Analytics */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-amber-400">{analytics?.totalAnswers || 0}</div>
                <div className="text-stone-400 text-xs mt-1">Total Answers</div>
              </div>
              <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-400">{analytics?.averageScore || 0}%</div>
                <div className="text-stone-400 text-xs mt-1">Avg Score</div>
              </div>
              <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-400">{analytics?.streak || 0}</div>
                <div className="text-stone-400 text-xs mt-1">Day Streak</div>
              </div>
              <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-400">{analytics?.totalPuzzlesCompleted || 0}</div>
                <div className="text-stone-400 text-xs mt-1">Puzzles Done</div>
              </div>
            </div>

            {/* Premium Feature Locked */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-2 border-blue-600/50 rounded-xl p-8 text-center relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Lock className="w-8 h-8 text-blue-400 opacity-20" />
              </div>

              <Trophy className="w-16 h-16 text-blue-400 mx-auto mb-4" />

              <h3 className="text-2xl font-bold text-white mb-3">Advanced Analytics</h3>

              <p className="text-blue-200 mb-6 max-w-md mx-auto">
                Unlock detailed insights including performance trends, skill type analysis, topic mastery breakdown, learning patterns, achievements, and personalized recommendations!
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6 max-w-md mx-auto">
                <div className="bg-black/30 border border-blue-700/30 rounded-lg p-3">
                  <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-200 text-xs">Performance Trends</p>
                </div>
                <div className="bg-black/30 border border-blue-700/30 rounded-lg p-3">
                  <Brain className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-200 text-xs">Skill Analysis</p>
                </div>
                <div className="bg-black/30 border border-blue-700/30 rounded-lg p-3">
                  <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-200 text-xs">Topic Mastery</p>
                </div>
                <div className="bg-black/30 border border-blue-700/30 rounded-lg p-3">
                  <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-200 text-xs">Learning Patterns</p>
                </div>
              </div>

              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg">
                ⭐ Upgrade to Premium - $5.99/month
              </button>

              <p className="text-blue-300 text-xs mt-4">
                Also includes unlimited puzzles, priority support, and ad-free experience!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get skill names
  const skillNames = {
    logical: 'Logical Reasoning',
    decision: 'Decision Making',
    adaptive: 'Adaptive Learning',
    source: 'Source Evaluation',
    bias: 'Bias Detection'
  };

  // Premium Analytics Dashboard
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 border-2 border-amber-700/50 rounded-2xl w-full max-w-7xl my-8 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-red-900 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-6 h-6" />
                Advanced Analytics Dashboard
              </h2>
              <p className="text-amber-200 text-sm mt-1">Premium Feature</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => loadAnalytics(), 100);
                }}
                className="px-3 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors text-white text-sm font-medium flex items-center gap-2"
                title="Refresh analytics data"
              >
                <Zap className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-stone-700 px-6">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart2 },
              { id: 'skills', label: 'Skill Analysis', icon: Brain },
              { id: 'topics', label: 'Topic Mastery', icon: Target },
              { id: 'patterns', label: 'Learning Patterns', icon: Clock },
              { id: 'achievements', label: 'Achievements', icon: Trophy }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 border border-amber-700/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-amber-400">{analytics?.totalAnswers || 0}</div>
                  <div className="text-stone-400 text-xs mt-1">Total Answers</div>
                </div>
                <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-400">{analytics?.averageScore || 0}%</div>
                  <div className="text-stone-400 text-xs mt-1">Average Score</div>
                </div>
                <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-400">{analytics?.streak || 0}</div>
                  <div className="text-stone-400 text-xs mt-1">Day Streak</div>
                </div>
                <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-400">{analytics?.totalPuzzlesCompleted || 0}</div>
                  <div className="text-stone-400 text-xs mt-1">Puzzles Done</div>
                </div>
                <div className="bg-gradient-to-br from-pink-900/30 to-pink-800/20 border border-pink-700/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-pink-400">{analytics?.timeSpent || 0}m</div>
                  <div className="text-stone-400 text-xs mt-1">Time Spent</div>
                </div>
                <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 border border-cyan-700/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-cyan-400">{analytics?.totalMinigamesCompleted || 0}</div>
                  <div className="text-stone-400 text-xs mt-1">Minigames</div>
                </div>
              </div>

              {/* Performance Trend */}
              {analytics?.trend && (
                <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Performance Trend
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      analytics.trend.trend === 'improving' ? 'bg-green-900/30 text-green-400 border border-green-700/50' :
                      analytics.trend.trend === 'declining' ? 'bg-red-900/30 text-red-400 border border-red-700/50' :
                      'bg-blue-900/30 text-blue-400 border border-blue-700/50'
                    }`}>
                      {analytics.trend.trend === 'improving' ? '📈 Improving' :
                       analytics.trend.trend === 'declining' ? '📉 Declining' :
                       '➡️ Stable'}
                    </span>
                  </div>

                  <p className="text-stone-300 text-sm mb-4">{analytics.trend.message}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-stone-900/50 rounded-lg p-4">
                      <div className="text-stone-400 text-sm mb-1">Recent Average</div>
                      <div className="text-2xl font-bold text-white">{analytics.trend.recentAverage || 0}%</div>
                    </div>
                    <div className="bg-stone-900/50 rounded-lg p-4">
                      <div className="text-stone-400 text-sm mb-1">Improvement</div>
                      <div className={`text-2xl font-bold ${analytics.trend.improvement >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {analytics.trend.improvement >= 0 ? '+' : ''}{analytics.trend.improvement || 0}%
                      </div>
                    </div>
                    <div className="bg-stone-900/50 rounded-lg p-4">
                      <div className="text-stone-400 text-sm mb-1">Volatility</div>
                      <div className={`text-2xl font-bold ${analytics.trend.volatility < 15 ? 'text-green-400' : analytics.trend.volatility < 25 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {analytics.trend.volatility || 0}%
                      </div>
                    </div>
                    <div className="bg-stone-900/50 rounded-lg p-4">
                      <div className="text-stone-400 text-sm mb-1">Confidence</div>
                      <div className="text-2xl font-bold text-blue-400">{analytics.trend.confidence || 0}%</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Insights & Recommendations */}
              {analytics?.insights && analytics.insights.length > 0 && (
                <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-lg p-6">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Personalized Insights
                  </h3>
                  <div className="space-y-3">
                    {analytics.insights.map((insight, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg p-4 ${
                          insight.type === 'success' ? 'bg-green-900/20 border border-green-700/30' :
                          insight.type === 'warning' ? 'bg-red-900/20 border border-red-700/30' :
                          insight.type === 'improvement' ? 'bg-amber-900/20 border border-amber-700/30' :
                          insight.type === 'goal' ? 'bg-purple-900/20 border border-purple-700/30' :
                          'bg-blue-900/20 border border-blue-700/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">{insight.icon}</span>
                          <div className="flex-1">
                            <div className="text-white font-semibold text-sm mb-1">{insight.title}</div>
                            <p className={`text-sm ${
                              insight.type === 'success' ? 'text-green-300' :
                              insight.type === 'warning' ? 'text-red-300' :
                              insight.type === 'improvement' ? 'text-amber-300' :
                              insight.type === 'goal' ? 'text-purple-300' :
                              'text-blue-300'
                            }`}>
                              {insight.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Minigame Statistics */}
              <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-6">
                <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-purple-400" />
                  Minigame Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {analytics?.minigameStats && Object.entries(analytics.minigameStats).length > 0 ? (
                    Object.entries(analytics.minigameStats).map(([gameName, stats]) => (
                      <div key={gameName} className="bg-stone-900/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium text-sm">{gameName}</span>
                          <span className="text-green-400 font-bold text-sm">{Math.round(stats.successRate)}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-400">
                          <span>{stats.completed} played</span>
                          <span>•</span>
                          <span>{Math.round(stats.avgTime)}s avg</span>
                        </div>
                        <div className="mt-2 bg-stone-800 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-600 to-emerald-500 h-2 rounded-full transition-all"
                            style={{ width: `${stats.successRate}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-stone-400 text-center py-4 col-span-3">No minigame data yet. Play some minigames to see stats!</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* SKILLS TAB */}
          {activeTab === 'skills' && analytics?.skillAnalysis && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-700/30 rounded-lg p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Critical Thinking Skills Breakdown
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4 text-center">
                    <div className="text-green-400 font-semibold text-sm mb-2">Strongest Skill</div>
                    <div className="text-white text-lg font-bold">
                      {analytics.skillAnalysis.strongestSkill ? skillNames[analytics.skillAnalysis.strongestSkill] : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4 text-center">
                    <div className="text-amber-400 font-semibold text-sm mb-2">Focus Area</div>
                    <div className="text-white text-lg font-bold">
                      {analytics.skillAnalysis.weakestSkill ? skillNames[analytics.skillAnalysis.weakestSkill] : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 text-center">
                    <div className="text-blue-400 font-semibold text-sm mb-2">Most Practiced</div>
                    <div className="text-white text-lg font-bold">
                      {analytics.skillAnalysis.mostPracticedSkill ? skillNames[analytics.skillAnalysis.mostPracticedSkill] : 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(analytics.skillAnalysis.skillData).map(([skill, data]) => {
                    if (data.attempts === 0) return null;
                    return (
                      <div key={skill} className="bg-stone-900/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-white font-semibold">{skillNames[skill]}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              data.trend === 'improving' ? 'bg-green-900/30 text-green-400' :
                              data.trend === 'declining' ? 'bg-red-900/30 text-red-400' :
                              'bg-gray-900/30 text-gray-400'
                            }`}>
                              {data.trend === 'improving' ? '↗' : data.trend === 'declining' ? '↘' : '→'}
                            </span>
                          </div>
                          <span className="text-amber-400 font-bold">{data.avgScore}%</span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-stone-400 mb-2">
                          <span>{data.attempts} attempts</span>
                          <span>Recent: {data.recentAvg}%</span>
                        </div>

                        <div className="bg-stone-800 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              data.avgScore >= 85 ? 'bg-gradient-to-r from-green-600 to-emerald-500' :
                              data.avgScore >= 70 ? 'bg-gradient-to-r from-blue-600 to-cyan-500' :
                              data.avgScore >= 60 ? 'bg-gradient-to-r from-amber-600 to-yellow-500' :
                              'bg-gradient-to-r from-red-600 to-orange-500'
                            }`}
                            style={{ width: `${data.avgScore}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TOPICS TAB */}
          {activeTab === 'topics' && analytics?.topicMastery && (
            <div className="space-y-6">
              <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-6">
                <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-amber-400" />
                  Topic Mastery Overview
                </h3>

                <div className="space-y-4">
                  {Object.entries(analytics.topicMastery).length > 0 ? (
                    Object.entries(analytics.topicMastery).map(([topicId, data]) => (
                      <div key={topicId} className="bg-stone-900/50 rounded-lg p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-white font-semibold text-lg">{data.topicName}</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                data.level === 'expert' ? 'bg-purple-900/30 text-purple-400 border border-purple-700/50' :
                                data.level === 'advanced' ? 'bg-blue-900/30 text-blue-400 border border-blue-700/50' :
                                data.level === 'intermediate' ? 'bg-green-900/30 text-green-400 border border-green-700/50' :
                                'bg-stone-700/30 text-stone-400 border border-stone-600/50'
                              }`}>
                                {data.level.toUpperCase()}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                data.progression === 'fast' ? 'bg-green-900/30 text-green-400' :
                                data.progression === 'steady' ? 'bg-blue-900/30 text-blue-400' :
                                data.progression === 'struggling' ? 'bg-red-900/30 text-red-400' :
                                'bg-gray-900/30 text-gray-400'
                              }`}>
                                {data.progression}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-stone-400">
                              <span>{data.attempts} attempts</span>
                              <span>•</span>
                              <span>Avg: {Math.round(data.avgScore)}%</span>
                              <span>•</span>
                              <span>Consistency: {data.consistency}%</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-3xl font-bold text-amber-400">{Math.round(data.avgScore)}%</div>
                          </div>
                        </div>

                        <div className="bg-stone-800 rounded-full h-3 mb-3">
                          <div
                            className="bg-gradient-to-r from-amber-600 to-yellow-500 h-3 rounded-full transition-all"
                            style={{ width: `${data.avgScore}%` }}
                          />
                        </div>

                        {data.recentScores && data.recentScores.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-stone-400 text-xs">Recent scores:</span>
                            <div className="flex gap-1">
                              {data.recentScores.slice(-5).map((score, idx) => (
                                <div
                                  key={idx}
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    score >= 85 ? 'bg-green-900/30 text-green-400' :
                                    score >= 70 ? 'bg-blue-900/30 text-blue-400' :
                                    score >= 60 ? 'bg-amber-900/30 text-amber-400' :
                                    'bg-red-900/30 text-red-400'
                                  }`}
                                >
                                  {score}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {data.needsPractice && (
                          <div className="mt-3 bg-amber-900/20 border border-amber-700/30 rounded-lg p-3">
                            <p className="text-amber-300 text-xs">
                              💡 This topic needs more practice to build mastery
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-stone-400 text-center py-8">No topic data yet. Complete more puzzles to see your mastery!</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PATTERNS TAB */}
          {activeTab === 'patterns' && analytics?.learningPatterns && !analytics.learningPatterns.insufficient && (
            <div className="space-y-6">
              <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-6">
                <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-blue-400" />
                  When You Learn Best
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Best Hours */}
                  {analytics.learningPatterns.bestHours && analytics.learningPatterns.bestHours.length > 0 && (
                    <div className="bg-stone-900/50 rounded-lg p-5">
                      <div className="text-amber-400 font-semibold mb-3">🕐 Best Times of Day</div>
                      <div className="space-y-2">
                        {analytics.learningPatterns.bestHours.map((time, idx) => {
                          const period = time.hour >= 12 ? 'PM' : 'AM';
                          const displayHour = time.hour > 12 ? time.hour - 12 : time.hour === 0 ? 12 : time.hour;
                          return (
                            <div key={idx} className="flex items-center justify-between bg-stone-800/50 rounded-lg p-3">
                              <span className="text-white font-medium">{displayHour}:00 {period}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-green-400 font-bold">{time.avgScore}%</span>
                                <span className="text-stone-500 text-xs">({time.count} sessions)</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Best Days */}
                  {analytics.learningPatterns.bestDays && analytics.learningPatterns.bestDays.length > 0 && (
                    <div className="bg-stone-900/50 rounded-lg p-5">
                      <div className="text-blue-400 font-semibold mb-3">📅 Best Days of Week</div>
                      <div className="space-y-2">
                        {analytics.learningPatterns.bestDays.map((day, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-stone-800/50 rounded-lg p-3">
                            <span className="text-white font-medium">{day.day}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-green-400 font-bold">{day.avgScore}%</span>
                              <span className="text-stone-500 text-xs">({day.count} sessions)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-4 text-center">
                    <div className="text-purple-400 text-sm mb-2">Avg Session Length</div>
                    <div className="text-white text-2xl font-bold">{analytics.learningPatterns.avgSessionLength} puzzles</div>
                  </div>
                  <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-lg p-4 text-center">
                    <div className="text-cyan-400 text-sm mb-2">Total Sessions</div>
                    <div className="text-white text-2xl font-bold">{analytics.learningPatterns.totalSessions}</div>
                  </div>
                </div>

                {analytics.learningPatterns.recommendation && analytics.learningPatterns.recommendation.length > 0 && (
                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-5">
                    <div className="text-blue-400 font-semibold mb-3">💡 Recommendations</div>
                    <ul className="space-y-2">
                      {analytics.learningPatterns.recommendation.map((rec, idx) => (
                        <li key={idx} className="text-blue-200 text-sm flex items-start gap-2">
                          <span className="text-blue-400">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === 'achievements' && analytics?.achievements && (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/50 rounded-lg p-6 text-center">
                  <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white mb-1">{analytics.achievements.unlocked}</div>
                  <div className="text-stone-400 text-sm">Unlocked</div>
                </div>
                <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/50 rounded-lg p-6 text-center">
                  <Trophy className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white mb-1">{analytics.achievements.total}</div>
                  <div className="text-stone-400 text-sm">Total</div>
                </div>
                <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/50 rounded-lg p-6 text-center">
                  <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white mb-1">{Math.round((analytics.achievements.unlocked / analytics.achievements.total) * 100)}%</div>
                  <div className="text-stone-400 text-sm">Completion</div>
                </div>
              </div>

              {/* Unlocked Achievements */}
              <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Unlocked Achievements
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analytics.achievements.achievements.map(achievement => (
                    <div key={achievement.id} className="bg-gradient-to-br from-amber-900/20 to-yellow-900/20 border border-amber-700/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <div className="text-white font-bold mb-1">{achievement.name}</div>
                          <p className="text-amber-200 text-sm">{achievement.description}</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Achievements */}
              {analytics.achievements.nextAchievements && analytics.achievements.nextAchievements.length > 0 && (
                <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-6">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    Next Achievements
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analytics.achievements.nextAchievements.map(achievement => (
                      <div key={achievement.id} className="bg-stone-900/50 border border-stone-700 rounded-lg p-4 opacity-60">
                        <div className="flex items-start gap-3">
                          <span className="text-3xl grayscale">{achievement.icon}</span>
                          <div className="flex-1">
                            <div className="text-white font-bold mb-1">{achievement.name}</div>
                            <p className="text-stone-400 text-sm">{achievement.description}</p>
                          </div>
                          <Lock className="w-5 h-5 text-stone-600 flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
