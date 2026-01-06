import React, { useState, useEffect, useCallback } from 'react';
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
    if (confirm('Are you sure you want to revoke this session?')) {
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

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

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
      login: 'Logged In',
      logout: 'Logged Out',
      password_changed: 'Password Changed',
      '2fa_enabled': '2FA Enabled',
      '2fa_disabled': '2FA Disabled',
      session_revoked: 'Session Revoked'
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
            <h1 className="text-2xl font-bold text-white">Security Activity</h1>
            <p className="text-stone-400 text-sm">Monitor your account activity</p>
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
            Active Sessions ({sessions.length})
          </button>
          <button
            onClick={() => setView('history')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              view === 'history'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-900/60 text-stone-400 hover:bg-stone-800/60'
            }`}
          >
            Login History
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
                <p className="text-stone-400">No active sessions</p>
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
                          {session.platform || 'Unknown Device'}
                        </div>
                        <div className="text-stone-400 text-sm mt-1">
                          {session.browser ? session.browser.split(' ').slice(0, 3).join(' ') : 'Unknown Browser'}
                        </div>
                        <div className="text-stone-500 text-xs mt-1">
                          Created: {formatDate(session.created_at)}
                        </div>
                        <div className="text-stone-500 text-xs">
                          Last active: {formatDate(session.last_active)}
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
                  These are devices and browsers where you're currently logged in. If you see any suspicious activity, revoke the session immediately and change your password.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {loginHistory.length === 0 ? (
              <div className="bg-stone-900/60 backdrop-blur-sm border border-stone-700 rounded-xl p-8 text-center">
                <p className="text-stone-400">No login history</p>
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
                          Method: {entry.method}
                        </div>
                      )}
                      <div className="text-stone-500 text-xs mt-1">
                        {entry.platform || 'Unknown Platform'} • {entry.ipAddress || 'Unknown IP'}
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
