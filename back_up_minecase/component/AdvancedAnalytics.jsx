import React, { useState, useEffect } from 'react';
import TranslationService from '../services/TranslationService';
import { X, TrendingUp, Trophy, Target, BarChart2, Lock, Brain, Clock, Award, Zap, Book, Calendar, CheckCircle, Lightbulb } from './icon';

const AdvancedAnalytics = ({ onClose, userId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [, setLang] = useState(TranslationService.currentLang); // Force re-render on lang change

  useEffect(() => {
    const unsubscribe = TranslationService.subscribe((lang) => setLang(lang));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [userId]);

  const loadAnalytics = async () => {
    try {
      // Check if user is premium (async)
      const premium = await window.PaymentService?.isPremium(userId) || false;
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
          <p className="text-white">{TranslationService.t('advanced_analytics.loading')}</p>
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
                {TranslationService.t('advanced_analytics.dashboard_title')}
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
                  {TranslationService.t('advanced_analytics.refresh')}
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
                <div className="text-stone-400 text-xs mt-1">{TranslationService.t('advanced_analytics.total_answers')}</div>
              </div>
              <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-400">{analytics?.averageScore || 0}%</div>
                <div className="text-stone-400 text-xs mt-1">{TranslationService.t('advanced_analytics.avg_score')}</div>
              </div>
              <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-400">{analytics?.streak || 0}</div>
                <div className="text-stone-400 text-xs mt-1">{TranslationService.t('advanced_analytics.day_streak')}</div>
              </div>
              <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-400">{analytics?.totalPuzzlesCompleted || 0}</div>
                <div className="text-stone-400 text-xs mt-1">{TranslationService.t('advanced_analytics.puzzles_done')}</div>
              </div>
            </div>

            {/* Premium Feature Locked */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-2 border-blue-600/50 rounded-xl p-8 text-center relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Lock className="w-8 h-8 text-blue-400 opacity-20" />
              </div>

              <Trophy className="w-16 h-16 text-blue-400 mx-auto mb-4" />

              <h3 className="text-2xl font-bold text-white mb-3">{TranslationService.t('advanced_analytics.premium_title')}</h3>

              <p className="text-blue-200 mb-6 max-w-md mx-auto">
                {TranslationService.t('advanced_analytics.premium_desc')}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6 max-w-md mx-auto">
                <div className="bg-black/30 border border-blue-700/30 rounded-lg p-3">
                  <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-200 text-xs">{TranslationService.t('advanced_analytics.performance_trends')}</p>
                </div>

                <div className="bg-black/30 border border-blue-700/30 rounded-lg p-3">
                  <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-200 text-xs">{TranslationService.t('advanced_analytics.learning_patterns')}</p>
                </div>
              </div>

              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg">
                ⭐ {TranslationService.t('advanced_analytics.upgrade_btn')}
              </button>

              <p className="text-blue-300 text-xs mt-4">
                {TranslationService.t('advanced_analytics.upgrade_note')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get skill names
  const skillNames = {
    logical: TranslationService.t('advanced_analytics.skill_logical'),
    decision: TranslationService.t('advanced_analytics.skill_decision'),
    adaptive: TranslationService.t('advanced_analytics.skill_adaptive'),
    source: TranslationService.t('advanced_analytics.skill_source'),
    bias: TranslationService.t('advanced_analytics.skill_bias')
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
                {TranslationService.t('advanced_analytics.adv_dashboard_title')}
              </h2>
              <p className="text-amber-200 text-sm mt-1">{TranslationService.t('advanced_analytics.premium_feature')}</p>
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
                {TranslationService.t('advanced_analytics.refresh')}
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
              { id: 'overview', label: TranslationService.t('advanced_analytics.tab_overview'), icon: BarChart2 },
              { id: 'training', label: TranslationService.t('advanced_analytics.tab_training'), icon: Lightbulb },
              { id: 'cognitive', label: TranslationService.t('advanced_analytics.tab_cognitive'), icon: Brain },
              { id: 'patterns', label: TranslationService.t('advanced_analytics.tab_patterns'), icon: Clock },
              { id: 'achievements', label: TranslationService.t('advanced_analytics.tab_achievements'), icon: Trophy }
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
                  <div className="text-stone-400 text-xs mt-1">{TranslationService.t('advanced_analytics.total_answers')}</div>
                </div>
                <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-400">{analytics?.averageScore || 0}%</div>
                  <div className="text-stone-400 text-xs mt-1">{TranslationService.t('advanced_analytics.avg_score')}</div>
                </div>
                <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-400">{analytics?.streak || 0}</div>
                  <div className="text-stone-400 text-xs mt-1">{TranslationService.t('advanced_analytics.day_streak')}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-400">{analytics?.totalPuzzlesCompleted || 0}</div>
                  <div className="text-stone-400 text-xs mt-1">{TranslationService.t('advanced_analytics.puzzles_done')}</div>
                </div>
                <div className="bg-gradient-to-br from-pink-900/30 to-pink-800/20 border border-pink-700/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-pink-400">{analytics?.timeSpent || 0}m</div>
                  <div className="text-stone-400 text-xs mt-1">{TranslationService.t('advanced_analytics.time_spent')}</div>
                </div>
                <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 border border-cyan-700/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-cyan-400">{analytics?.totalMinigamesCompleted || 0}</div>
                  <div className="text-stone-400 text-xs mt-1">{TranslationService.t('advanced_analytics.minigames')}</div>
                </div>
              </div>

              {/* Performance Trend */}
              {analytics?.trend && (
                <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      {TranslationService.t('advanced_analytics.performance_trends')}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      analytics.trend.trend === 'improving' ? 'bg-green-900/30 text-green-400 border border-green-700/50' :
                      analytics.trend.trend === 'declining' ? 'bg-red-900/30 text-red-400 border border-red-700/50' :
                      'bg-blue-900/30 text-blue-400 border border-blue-700/50'
                    }`}>
                      {analytics.trend.trend === 'improving' ? `📈 ${TranslationService.t('advanced_analytics.trend_improving')}` :
                       analytics.trend.trend === 'declining' ? `📉 ${TranslationService.t('advanced_analytics.trend_declining')}` :
                       `➡️ ${TranslationService.t('advanced_analytics.trend_stable')}`}
                    </span>
                  </div>

                  <p className="text-stone-300 text-sm mb-4">{analytics.trend.message}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-stone-900/50 rounded-lg p-4">
                      <div className="text-stone-400 text-sm mb-1">{TranslationService.t('advanced_analytics.recent_avg')}</div>
                      <div className="text-2xl font-bold text-white">{analytics.trend.recentAverage || 0}%</div>
                    </div>
                    <div className="bg-stone-900/50 rounded-lg p-4">
                      <div className="text-stone-400 text-sm mb-1">{TranslationService.t('advanced_analytics.improvement')}</div>
                      <div className={`text-2xl font-bold ${analytics.trend.improvement >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {analytics.trend.improvement >= 0 ? '+' : ''}{analytics.trend.improvement || 0}%
                      </div>
                    </div>
                    <div className="bg-stone-900/50 rounded-lg p-4">
                      <div className="text-stone-400 text-sm mb-1">{TranslationService.t('advanced_analytics.volatility')}</div>
                      <div className={`text-2xl font-bold ${analytics.trend.volatility < 15 ? 'text-green-400' : analytics.trend.volatility < 25 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {analytics.trend.volatility || 0}%
                      </div>
                    </div>
                    <div className="bg-stone-900/50 rounded-lg p-4">
                      <div className="text-stone-400 text-sm mb-1">{TranslationService.t('advanced_analytics.confidence')}</div>
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
                    {TranslationService.t('advanced_analytics.personalized_insights')}
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
                  {TranslationService.t('advanced_analytics.minigame_stats')}
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
                          <span>{stats.completed} {TranslationService.t('advanced_analytics.played')}</span>
                          <span>•</span>
                          <span>{Math.round(stats.avgTime)}s {TranslationService.t('advanced_analytics.avg')}</span>
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

          {/* COGNITIVE PROFILE TAB */}
          {activeTab === 'cognitive' && (
            <div className="space-y-6">
              {/* Overall Cognitive Score */}
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Brain className="w-7 h-7 text-purple-400" />
                      {TranslationService.t('advanced_analytics.tab_cognitive')}
                    </h3>
                    <p className="text-purple-200 text-sm mt-1">{TranslationService.t('advanced_analytics.cognitive_profile_desc')}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-purple-400">{analytics?.minigameCognition?.overallCognitiveScore || 0}%</div>
                    <div className="text-purple-300 text-xs">{TranslationService.t('advanced_analytics.overall_score')}</div>
                  </div>
                </div>

                {/* Game Variety */}
                <div className="bg-black/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-stone-300 text-sm">{TranslationService.t('advanced_analytics.game_variety')}</span>
                    <span className="text-purple-400 font-bold">{analytics?.minigameCognition?.gamesPlayed || 0}/{analytics?.minigameCognition?.totalGamesAvailable || 14} {TranslationService.t('advanced_analytics.games')}</span>
                  </div>
                  <div className="bg-stone-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${analytics?.minigameCognition?.varietyScore || 0}%` }}
                    />
                  </div>
                </div>

                {/* Strength & Focus Areas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                    <div className="text-green-400 text-xs font-semibold mb-2 uppercase tracking-wide">{TranslationService.t('advanced_analytics.strengths')}</div>
                    <div className="space-y-1">
                      {analytics?.minigameCognition?.strongestAreas?.length > 0 ? (
                        analytics.minigameCognition.strongestAreas.slice(0, 2).map((area, i) => (
                          <div key={i} className="text-white font-medium text-sm">{area}</div>
                        ))
                      ) : (
                        <div className="text-stone-500 text-sm">Play more games to discover</div>
                      )}
                    </div>
                  </div>
                  <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4">
                    <div className="text-amber-400 text-xs font-semibold mb-2 uppercase tracking-wide">{TranslationService.t('advanced_analytics.focus_areas')}</div>
                    <div className="space-y-1">
                      {analytics?.minigameCognition?.weakestAreas?.length > 0 ? (
                        analytics.minigameCognition.weakestAreas.slice(0, 2).map((area, i) => (
                          <div key={i} className="text-white font-medium text-sm">{area}</div>
                        ))
                      ) : (
                        <div className="text-stone-500 text-sm">Play more games to discover</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cognitive Metrics Grid */}
              <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-6">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  {TranslationService.t('advanced_analytics.cognitive_breakdown')}
                </h4>

                <div className="space-y-4">
                  {analytics?.minigameCognition?.cognitiveMetrics && Object.keys(analytics.minigameCognition.cognitiveMetrics).length > 0 ? Object.entries(analytics.minigameCognition.cognitiveMetrics).map(([key, metric]) => (
                    <div key={key} className="bg-stone-900/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-semibold">{metric.name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            metric.level === 'expert' ? 'bg-purple-900/50 text-purple-300 border border-purple-600/50' :
                            metric.level === 'advanced' ? 'bg-blue-900/50 text-blue-300 border border-blue-600/50' :
                            metric.level === 'intermediate' ? 'bg-green-900/50 text-green-300 border border-green-600/50' :
                            'bg-stone-700/50 text-stone-300 border border-stone-600/50'
                          }`}>
                            {metric.level.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            metric.trajectory === 'rapidly_improving' ? 'bg-green-900/50 text-green-400' :
                            metric.trajectory === 'improving' ? 'bg-emerald-900/50 text-emerald-400' :
                            metric.trajectory === 'declining' || metric.trajectory === 'slight_decline' ? 'bg-red-900/50 text-red-400' :
                            'bg-stone-700/50 text-stone-400'
                          }`}>
                            {metric.trajectory === 'rapidly_improving' ? `🚀 ${TranslationService.t('advanced_analytics.rapid_growth')}` :
                             metric.trajectory === 'improving' ? `📈 ${TranslationService.t('advanced_analytics.trend_improving')}` :
                             metric.trajectory === 'declining' ? `📉 ${TranslationService.t('advanced_analytics.trend_declining')}` :
                             metric.trajectory === 'slight_decline' ? `↘ ${TranslationService.t('advanced_analytics.slight_dip')}` : `→ ${TranslationService.t('advanced_analytics.trend_stable')}`}
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-amber-400">{metric.score}%</span>
                      </div>

                      <div className="bg-stone-800 rounded-full h-3 mb-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            metric.score >= 85 ? 'bg-gradient-to-r from-purple-600 to-purple-400' :
                            metric.score >= 70 ? 'bg-gradient-to-r from-blue-600 to-cyan-500' :
                            metric.score >= 55 ? 'bg-gradient-to-r from-amber-600 to-yellow-500' :
                            'bg-gradient-to-r from-red-600 to-orange-500'
                          }`}
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-stone-400">
                        <span>{metric.sessions} {TranslationService.t('advanced_analytics.sessions')}</span>
                        <span>{TranslationService.t('advanced_analytics.consistency')}: {metric.consistency}%</span>
                        <span>{TranslationService.t('advanced_analytics.best')}: {metric.bestScore}%</span>
                      </div>

                      {metric.recentScores && metric.recentScores.length > 0 && (
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-stone-500 text-xs">{TranslationService.t('advanced_analytics.recent')}:</span>
                          <div className="flex gap-1">
                            {metric.recentScores.map((score, idx) => (
                              <div
                                key={idx}
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  score >= 85 ? 'bg-purple-900/30 text-purple-400' :
                                  score >= 70 ? 'bg-blue-900/30 text-blue-400' :
                                  score >= 55 ? 'bg-amber-900/30 text-amber-400' :
                                  'bg-red-900/30 text-red-400'
                                }`}
                              >
                                {score}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="text-center py-8 text-stone-400">
                      <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Play more minigames to build your cognitive profile!</p>
                      <p className="text-sm mt-1">Each game trains specific cognitive abilities.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cognitive Insights */}
              {analytics?.minigameCognition?.cognitiveInsights && analytics.minigameCognition.cognitiveInsights.length > 0 && (
                <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-6">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    {TranslationService.t('advanced_analytics.cognitive_insights')}
                  </h4>
                  <div className="space-y-3">
                    {analytics.minigameCognition.cognitiveInsights.map((insight, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg p-4 ${
                          insight.type === 'strength' ? 'bg-green-900/20 border border-green-700/30' :
                          insight.type === 'focus' ? 'bg-amber-900/20 border border-amber-700/30' :
                          insight.type === 'progress' ? 'bg-purple-900/20 border border-purple-700/30' :
                          insight.type === 'warning' ? 'bg-red-900/20 border border-red-700/30' :
                          'bg-blue-900/20 border border-blue-700/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">{insight.icon}</span>
                          <div className="flex-1">
                            <div className="text-white font-semibold text-sm mb-1">{insight.title}</div>
                            <p className={`text-sm ${
                              insight.type === 'strength' ? 'text-green-300' :
                              insight.type === 'focus' ? 'text-amber-300' :
                              insight.type === 'progress' ? 'text-purple-300' :
                              insight.type === 'warning' ? 'text-red-300' :
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

              {/* Minigame Game Breakdown */}
              <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-6">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  {TranslationService.t('advanced_analytics.minigame_breakdown')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {analytics?.minigameStats && Object.entries(analytics.minigameStats).length > 0 ? (
                    Object.entries(analytics.minigameStats)
                      .sort((a, b) => b[1].completed - a[1].completed)
                      .map(([gameName, stats]) => (
                      <div key={gameName} className="bg-stone-900/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium text-sm truncate">{gameName}</span>
                          <span className="text-green-400 font-bold text-sm">{Math.round(stats.successRate)}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
                          <span>{stats.completed} {TranslationService.t('advanced_analytics.games')}</span>
                          {stats.bestScore && <span>• {TranslationService.t('advanced_analytics.best')}: {stats.bestScore}</span>}
                        </div>
                        <div className="bg-stone-800 rounded-full h-2">
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
            </div>
          )}

          {/* SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-700/30 rounded-lg p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  {TranslationService.t('advanced_analytics.skill_breakdown')}
                </h3>

                {analytics?.skillAnalysis ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4 text-center">
                        <div className="text-green-400 font-semibold text-sm mb-2">{TranslationService.t('advanced_analytics.strongest_skill')}</div>
                        <div className="text-white text-lg font-bold">
                          {analytics.skillAnalysis.strongestSkill ? skillNames[analytics.skillAnalysis.strongestSkill] : 'N/A'}
                        </div>
                      </div>
                      <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4 text-center">
                        <div className="text-amber-400 font-semibold text-sm mb-2">{TranslationService.t('advanced_analytics.focus_areas')}</div>
                        <div className="text-white text-lg font-bold">
                          {analytics.skillAnalysis.weakestSkill ? skillNames[analytics.skillAnalysis.weakestSkill] : 'N/A'}
                        </div>
                      </div>
                      <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 text-center">
                        <div className="text-blue-400 font-semibold text-sm mb-2">{TranslationService.t('advanced_analytics.most_practiced')}</div>
                        <div className="text-white text-lg font-bold">
                          {analytics.skillAnalysis.mostPracticedSkill ? skillNames[analytics.skillAnalysis.mostPracticedSkill] : 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {analytics.skillAnalysis.skillData && Object.entries(analytics.skillAnalysis.skillData).filter(([_, data]) => data.attempts > 0).length > 0 ? (
                        Object.entries(analytics.skillAnalysis.skillData).map(([skill, data]) => {
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
                                <span>{data.attempts} {TranslationService.t('advanced_analytics.attempts')}</span>
                                <span>{TranslationService.t('advanced_analytics.recent')}: {data.recentAvg}%</span>
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
                        })
                      ) : (
                        <div className="text-center py-8 text-stone-400">
                          <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p>{TranslationService.t('advanced_analytics.complete_puzzles_skill')}</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                   <div className="text-center py-12 text-stone-400">
                    <Brain className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg mb-2">{TranslationService.t('advanced_analytics.no_skill_data')}</p>
                    <p className="text-sm">{TranslationService.t('advanced_analytics.complete_puzzles_skill')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TOPICS TAB */}
          {activeTab === 'topics' && (
            <div className="space-y-6">
              <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-6">
                <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-amber-400" />
                  {TranslationService.t('advanced_analytics.topic_mastery')}
                </h3>

                <div className="space-y-4">
                  {analytics?.topicMastery && Object.entries(analytics.topicMastery).length > 0 ? (
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
                              <span>{data.attempts} {TranslationService.t('advanced_analytics.attempts')}</span>
                              <span>•</span>
                              <span>{TranslationService.t('advanced_analytics.avg')}: {Math.round(data.avgScore)}%</span>
                              <span>•</span>
                              <span>{TranslationService.t('advanced_analytics.consistency')}: {data.consistency}%</span>
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
                            <span className="text-stone-400 text-xs">{TranslationService.t('advanced_analytics.recent_scores')}:</span>
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
                              💡 {TranslationService.t('advanced_analytics.needs_practice')}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-stone-400">
                      <Target className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg mb-2">{TranslationService.t('advanced_analytics.no_topic_data')}</p>
                      <p className="text-sm">{TranslationService.t('advanced_analytics.complete_puzzles_topic')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PATTERNS TAB */}
          {activeTab === 'patterns' && (
            <div className="space-y-6">
              <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-6">
                <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-blue-400" />
                  {TranslationService.t('advanced_analytics.when_learn_best')}
                </h3>

                {analytics?.learningPatterns && !analytics.learningPatterns.insufficient ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Best Hours */}
                      {analytics.learningPatterns.bestHours && analytics.learningPatterns.bestHours.length > 0 && (
                        <div className="bg-stone-900/50 rounded-lg p-5">
                          <div className="text-amber-400 font-semibold mb-3">🕐 {TranslationService.t('advanced_analytics.best_times')}</div>
                          <div className="space-y-2">
                            {analytics.learningPatterns.bestHours.map((time, idx) => {
                              const period = time.hour >= 12 ? 'PM' : 'AM';
                              const displayHour = time.hour > 12 ? time.hour - 12 : time.hour === 0 ? 12 : time.hour;
                              return (
                                <div key={idx} className="flex items-center justify-between bg-stone-800/50 rounded-lg p-3">
                                  <span className="text-white font-medium">{displayHour}:00 {period}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-green-400 font-bold">{time.avgScore}%</span>
                                    <span className="text-stone-500 text-xs">({time.count} {TranslationService.t('advanced_analytics.sessions')})</span>
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
                          <div className="text-blue-400 font-semibold mb-3">📅 {TranslationService.t('advanced_analytics.best_days')}</div>
                          <div className="space-y-2">
                            {analytics.learningPatterns.bestDays.map((day, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-stone-800/50 rounded-lg p-3">
                                <span className="text-white font-medium">{day.day}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-green-400 font-bold">{day.avgScore}%</span>
                                  <span className="text-stone-500 text-xs">({day.count} {TranslationService.t('advanced_analytics.sessions')})</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-4 text-center">
                        <div className="text-purple-400 text-sm mb-2">{TranslationService.t('advanced_analytics.avg_session_length')}</div>
                        <div className="text-white text-2xl font-bold">{analytics.learningPatterns.avgSessionLength || 0} puzzles</div>
                      </div>
                      <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-lg p-4 text-center">
                        <div className="text-cyan-400 text-sm mb-2">{TranslationService.t('advanced_analytics.total_sessions')}</div>
                        <div className="text-white text-2xl font-bold">{analytics.learningPatterns.totalSessions || 0}</div>
                      </div>
                    </div>

                    {analytics.learningPatterns.recommendation && analytics.learningPatterns.recommendation.length > 0 && (
                      <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-5">
                        <div className="text-blue-400 font-semibold mb-3">💡 {TranslationService.t('advanced_analytics.recommendations')}</div>
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
                  </>
                ) : (
                  <div className="text-center py-12 text-stone-400">
                    <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg mb-2">{TranslationService.t('advanced_analytics.not_enough_data')}</p>
                    <p className="text-sm">{TranslationService.t('advanced_analytics.complete_more_puzzles')}</p>
                    <p className="text-xs mt-4 text-stone-500">{TranslationService.t('advanced_analytics.need_10_sessions')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              {analytics?.achievements ? (
                <>
                  {/* Stats Overview */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/50 rounded-lg p-6 text-center">
                      <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-white mb-1">{analytics.achievements.unlocked || 0}</div>
                      <div className="text-stone-400 text-sm">{TranslationService.t('advanced_analytics.unlocked')}</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/50 rounded-lg p-6 text-center">
                      <Trophy className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-white mb-1">{analytics.achievements.total || 0}</div>
                      <div className="text-stone-400 text-sm">{TranslationService.t('advanced_analytics.total')}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/50 rounded-lg p-6 text-center">
                      <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-white mb-1">{analytics.achievements.total > 0 ? Math.round((analytics.achievements.unlocked / analytics.achievements.total) * 100) : 0}%</div>
                      <div className="text-stone-400 text-sm">{TranslationService.t('advanced_analytics.completion')}</div>
                    </div>
                  </div>

                  {/* Unlocked Achievements */}
                  <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-6">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-400" />
                      {TranslationService.t('advanced_analytics.unlocked_achievements')}
                    </h3>

                    {analytics.achievements.achievements && analytics.achievements.achievements.length > 0 ? (
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
                    ) : (
                      <div className="text-center py-8 text-stone-400">
                        <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>{TranslationService.t('advanced_analytics.no_achievements')}</p>
                        <p className="text-sm mt-1">{TranslationService.t('advanced_analytics.keep_playing')}</p>
                      </div>
                    )}
                  </div>

                  {/* Next Achievements */}
                  {analytics.achievements.nextAchievements && analytics.achievements.nextAchievements.length > 0 && (
                    <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-6">
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        {TranslationService.t('advanced_analytics.next_achievements')}
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
                </>
              ) : (
                <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-6">
                  <div className="text-center py-12 text-stone-400">
                    <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg mb-2">No achievement data yet</p>
                    <p className="text-sm">Complete puzzles and minigames to start earning achievements!</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* COGNITIVE TRAINING TAB */}
          {activeTab === 'training' && (
            <div className="space-y-6">
              {analytics?.cognitiveTraining && !analytics.cognitiveTraining.insufficient ? (
                <>
                  {/* Overview Stats */}
                  <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-700/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                          <Lightbulb className="w-7 h-7 text-purple-400" />
                          Cognitive Training Progress
                        </h3>
                        <p className="text-purple-200 text-sm mt-1">Building critical thinking through productive discomfort</p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-purple-400">{analytics.cognitiveTraining.averageProcessScore || 0}%</div>
                        <div className="text-purple-300 text-xs">{TranslationService.t('advanced_analytics.avg_process_score')}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-black/20 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white">{analytics.cognitiveTraining.totalSessions || 0}</div>
                        <div className="text-purple-300 text-xs">{TranslationService.t('advanced_analytics.total_sessions')}</div>
                      </div>
                      <div className="bg-black/20 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white">{analytics.cognitiveTraining.gameTypePerformance?.length || 0}/3</div>
                        <div className="text-purple-300 text-xs">{TranslationService.t('advanced_analytics.game_types_tried')}</div>
                      </div>
                      <div className="bg-black/20 rounded-lg p-4 text-center">
                        <span className={`text-2xl font-bold ${
                          analytics.cognitiveTraining.processTrend === 'improving' || analytics.cognitiveTraining.processTrend === 'rapidly_improving'
                            ? 'text-green-400'
                            : analytics.cognitiveTraining.processTrend === 'declining'
                            ? 'text-red-400'
                            : 'text-blue-400'
                        }`}>
                          {analytics.cognitiveTraining.processTrend === 'rapidly_improving' ? '🚀' :
                           analytics.cognitiveTraining.processTrend === 'improving' ? '📈' :
                           analytics.cognitiveTraining.processTrend === 'declining' ? '📉' : '➡️'}
                        </span>
                        <div className="text-purple-300 text-xs">{TranslationService.t('advanced_analytics.process_trend')}</div>
                      </div>
                      <div className="bg-black/20 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white">{analytics.cognitiveTraining.bestGameType?.avgScore || 0}%</div>
                        <div className="text-purple-300 text-xs">{TranslationService.t('advanced_analytics.best_game_score')}</div>
                      </div>
                    </div>
                  </div>

                  {/* Game Type Performance */}
                  <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-6">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-amber-400" />
                      {TranslationService.t('advanced_analytics.training_type_performance')}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {analytics.cognitiveTraining.gameTypePerformance?.length > 0 ? (
                        analytics.cognitiveTraining.gameTypePerformance.map((game) => (
                          <div key={game.gameType} className="bg-stone-900/50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-medium">{game.name}</span>
                              <span className="text-amber-400 font-bold">{game.avgScore}%</span>
                            </div>
                            <div className="text-stone-400 text-xs mb-2">{game.sessions} {TranslationService.t('advanced_analytics.sessions')}</div>
                            <div className="bg-stone-800 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-600 to-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${game.avgScore}%` }}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-stone-400 text-center py-4 col-span-3">{TranslationService.t('advanced_analytics.complete_training')}</p>
                      )}
                    </div>
                  </div>

                  {/* Cognitive Primitive Growth */}
                  <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-6">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-400" />
                      {TranslationService.t('advanced_analytics.primitive_development')}
                    </h4>
                    <p className="text-stone-400 text-sm mb-4">
                      {TranslationService.t('advanced_analytics.primitive_desc')}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Strengths */}
                      <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                        <div className="text-green-400 text-xs font-semibold mb-3 uppercase tracking-wide">{TranslationService.t('advanced_analytics.growing_strengths')}</div>
                        {analytics.cognitiveTraining.strongestPrimitives?.length > 0 ? (
                          <div className="space-y-2">
                            {analytics.cognitiveTraining.strongestPrimitives.map((prim, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <span className="text-white text-sm">{prim.name}</span>
                                <span className="text-green-400 text-xs">{prim.count} {TranslationService.t('advanced_analytics.growth_instances')}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-stone-500 text-sm">{TranslationService.t('advanced_analytics.complete_more')}</div>
                        )}
                      </div>

                      {/* Focus Areas */}
                      <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4">
                        <div className="text-amber-400 text-xs font-semibold mb-3 uppercase tracking-wide">{TranslationService.t('advanced_analytics.development_areas')}</div>
                        {analytics.cognitiveTraining.weakestPrimitives?.length > 0 ? (
                          <div className="space-y-2">
                            {analytics.cognitiveTraining.weakestPrimitives.map((prim, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <span className="text-white text-sm">{prim.name}</span>
                                <span className="text-amber-400 text-xs">{prim.count} {TranslationService.t('advanced_analytics.growth_instances')}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-stone-500 text-sm">{TranslationService.t('advanced_analytics.complete_more')}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recent Sessions */}
                  {analytics.cognitiveTraining.recentSessions?.length > 0 && (
                    <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-6">
                      <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        {TranslationService.t('advanced_analytics.recent_training')}
                      </h4>
                      <div className="space-y-2">
                        {analytics.cognitiveTraining.recentSessions.slice(0, 5).map((session, i) => (
                          <div key={i} className="flex items-center justify-between bg-stone-900/50 rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              <span className="text-purple-400">{session.gameTypeName}</span>
                              <span className="text-stone-500 text-xs">{session.date}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-sm font-medium ${
                                session.processScore >= 70 ? 'text-green-400' :
                                session.processScore >= 50 ? 'text-amber-400' : 'text-red-400'
                              }`}>
                                {session.processScore}% process score
                              </span>
                              <span className="text-stone-400 text-xs">{session.reasoningLevel}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Insights */}
                  {analytics.cognitiveTraining.insights?.length > 0 && (
                    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-6">
                      <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        {TranslationService.t('advanced_analytics.training_insights')}
                      </h4>
                      <div className="space-y-3">
                        {analytics.cognitiveTraining.insights.map((insight, idx) => (
                          <div
                            key={idx}
                            className={`rounded-lg p-4 ${
                              insight.type === 'success' || insight.type === 'strength' ? 'bg-green-900/20 border border-green-700/30' :
                              insight.type === 'warning' ? 'bg-red-900/20 border border-red-700/30' :
                              insight.type === 'focus' ? 'bg-amber-900/20 border border-amber-700/30' :
                              'bg-blue-900/20 border border-blue-700/30'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl flex-shrink-0">{insight.icon}</span>
                              <div className="flex-1">
                                <div className="text-white font-semibold text-sm mb-1">{insight.title}</div>
                                <p className={`text-sm ${
                                  insight.type === 'success' || insight.type === 'strength' ? 'text-green-300' :
                                  insight.type === 'warning' ? 'text-red-300' :
                                  insight.type === 'focus' ? 'text-amber-300' :
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
                </>
              ) : (
                <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-700/30 rounded-xl p-8 text-center">
                  <Lightbulb className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-bold text-white mb-2">{TranslationService.t('advanced_analytics.no_training_data')}</h3>
                  <p className="text-purple-200 mb-6 max-w-md mx-auto">
                    {TranslationService.t('advanced_analytics.training_data_desc')}
                  </p>
                  <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-left">
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-xl mb-1">📊</div>
                      <div className="text-purple-300 text-xs font-medium">Signal Field</div>
                      <div className="text-stone-400 text-xs">{TranslationService.t('advanced_analytics.signal_field_desc')}</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-xl mb-1">🔍</div>
                      <div className="text-purple-300 text-xs font-medium">Forensic Narrative</div>
                      <div className="text-stone-400 text-xs">{TranslationService.t('advanced_analytics.forensic_narrative_desc')}</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-xl mb-1">⚙️</div>
                      <div className="text-purple-300 text-xs font-medium">Variable Manifold</div>
                      <div className="text-stone-400 text-xs">{TranslationService.t('advanced_analytics.variable_manifold_desc')}</div>
                    </div>
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
