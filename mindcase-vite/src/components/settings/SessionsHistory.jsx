import React, { useState, useEffect, useCallback } from 'react';
import TranslationService from '../../services/TranslationService';
import { ChevronLeft, AlertCircle, X, RefreshCw } from '../icon';
import { AuthService } from '../../services/auth';

const SessionsHistory = ({ user, onBack }) => {
  const [view, setView] = useState('sessions'); // 'sessions' or 'history'
  const [sessions, setSessions] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const [sessionsData, historyData] = await Promise.all([
          AuthService.getActiveSessions(),
          AuthService.getLoginHistory()
        ]);
        setSessions(sessionsData);
        setLoginHistory(historyData);
      } catch (e) {
        console.error('Error loading session data:', e);
      }
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRevokeSession = async (familyId) => {
    if (confirm(TranslationService.t('settings.revoke_confirm'))) {
      await AuthService.revokeSession(familyId);
      // Refresh sessions list
      const updated = await AuthService.getActiveSessions();
      setSessions(updated);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return TranslationService.t('settings.just_now');
    if (diffMins < 60) return TranslationService.t('settings.minutes_ago', { count: diffMins });
    if (diffHours < 24) return TranslationService.t('settings.hours_ago', { count: diffHours });
    if (diffDays < 7) return TranslationService.t('settings.days_ago', { count: diffDays });

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getBrowserIcon = (userAgent) => {
    if (!userAgent) return '💻';
    if (userAgent.includes('Chrome')) return '🌐';
    if (userAgent.includes('Firefox')) return '🦊';
    if (userAgent.includes('Safari')) return '🧭';
    if (userAgent.includes('Edge')) return '🔷';
    return '💻';
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'login': return '🔓';
      case 'logout': return '🔒';
      case 'password_changed': return '🔑';
      case '2fa_enabled': return '✅';
      case '2fa_disabled': return '❌';
      case 'session_revoked': return '🚫';
      default: return '📝';
    }
  };

  const getActionLabel = (action) => {
    const labels = {
      login: TranslationService.t('settings.logged_in'),
      logout: TranslationService.t('settings.logged_out'),
      password_changed: TranslationService.t('settings.password_changed_action'),
      '2fa_enabled': TranslationService.t('settings.2fa_enabled_action'),
      '2fa_disabled': TranslationService.t('settings.2fa_disabled_action'),
      session_revoked: TranslationService.t('settings.session_revoked_action')
    };
    return labels[action] || action;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-stone-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{TranslationService.t('settings.security_activity')}</h1>
            <p className="text-stone-400 text-sm">{TranslationService.t('settings.monitor_activity')}</p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 text-stone-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView('sessions')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              view === 'sessions'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-900/60 text-stone-400 hover:bg-stone-800/60'
            }`}
          >
            {TranslationService.t('settings.active_sessions')} ({sessions.length})
          </button>
          <button
            onClick={() => setView('history')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              view === 'history'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-900/60 text-stone-400 hover:bg-stone-800/60'
            }`}
          >
            {TranslationService.t('settings.login_history')}
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-stone-900/60 backdrop-blur-sm border border-stone-700 rounded-xl p-8 text-center">
            <p className="text-stone-400">Loading...</p>
          </div>
        ) : view === 'sessions' ? (
          <div className="space-y-3">
            {sessions.length === 0 ? (
              <div className="bg-stone-900/60 backdrop-blur-sm border border-stone-700 rounded-xl p-8 text-center">
                <p className="text-stone-400">{TranslationService.t('settings.no_active_sessions')}</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-stone-900/60 backdrop-blur-sm border border-stone-700 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getBrowserIcon(session.browser)}</span>
                      <div>
                        <div className="text-white font-medium">
                          {session.platform || TranslationService.t('settings.unknown_device')}
                        </div>
                        <div className="text-stone-400 text-sm mt-1">
                          {session.browser ? session.browser.split(' ').slice(0, 3).join(' ') : TranslationService.t('settings.unknown_browser')}
                        </div>
                        <div className="text-stone-500 text-xs mt-1">
                          {TranslationService.t('settings.created')}: {formatDate(session.created_at)}
                        </div>
                        <div className="text-stone-500 text-xs">
                          {TranslationService.t('settings.last_active')}: {formatDate(session.last_active)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRevokeSession(session.family_id)}
                      className="p-2 hover:bg-red-900/30 rounded-lg transition-colors group"
                      title="Revoke session"
                    >
                      <X className="w-5 h-5 text-stone-500 group-hover:text-red-400" />
                    </button>
                  </div>
                </div>
              ))
            )}

            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-200">
                  {TranslationService.t('settings.session_tips')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {loginHistory.length === 0 ? (
              <div className="bg-stone-900/60 backdrop-blur-sm border border-stone-700 rounded-xl p-8 text-center">
                <p className="text-stone-400">{TranslationService.t('settings.no_login_history')}</p>
              </div>
            ) : (
              loginHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-stone-900/60 backdrop-blur-sm border border-stone-700 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{getActionIcon(entry.action)}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-white font-medium">{getActionLabel(entry.action)}</div>
                        <div className="text-stone-500 text-xs">{formatDate(entry.timestamp)}</div>
                      </div>
                      {entry.method && (
                        <div className="text-stone-400 text-sm mt-1">
                          {TranslationService.t('settings.method')}: {entry.method}
                        </div>
                      )}
                      <div className="text-stone-500 text-xs mt-1">
                        {entry.platform || TranslationService.t('settings.unknown_platform')} • {entry.ipAddress || TranslationService.t('settings.unknown_ip')}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionsHistory;
