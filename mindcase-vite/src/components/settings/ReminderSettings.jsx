import React, { useState, useEffect } from 'react';
import TranslationService from '../../services/TranslationService';
import { Bell, Clock, X } from '../icon';

const ReminderSettings = ({ onBack }) => {
  const [settings, setSettings] = useState(null);
  const [selectedHour, setSelectedHour] = useState(19);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeUntilNext, setTimeUntilNext] = useState(null);

  useEffect(() => {
    loadSettings();

    // Update time until next reminder every minute
    const interval = setInterval(() => {
      if (settings?.enabled) {
        updateTimeUntilNext();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [settings?.enabled]);

  const loadSettings = () => {
    try {
      const reminderSettings = window.ReminderService?.getSettings();
      setSettings(reminderSettings);
      setSelectedHour(reminderSettings?.time?.hour || 19);
      setSelectedMinute(reminderSettings?.time?.minute || 0);
      updateTimeUntilNext();
    } catch (e) {
      console.error('Failed to load reminder settings:', e);
    } finally {
      setLoading(false);
    }
  };

  const updateTimeUntilNext = () => {
    try {
      const timeInfo = window.ReminderService?.getTimeUntilNextReminder();
      setTimeUntilNext(timeInfo);
    } catch (e) {
      console.error('Failed to get time until next reminder:', e);
    }
  };

  const handleToggleReminders = async () => {
    try {
      if (settings.enabled) {
        // Disable reminders
        const result = window.ReminderService?.disableReminders();
        if (result?.success) {
          loadSettings();
          alert('✅ Daily reminders disabled');
        }
      } else {
        // Enable reminders
        const result = await window.ReminderService?.enableReminders({
          hour: selectedHour,
          minute: selectedMinute
        });

        if (result?.success) {
          loadSettings();
          updateTimeUntilNext();
          alert(`✅ ${result.message}`);
        } else {
          alert(`❌ ${result.error}`);
        }
      }
    } catch (e) {
      console.error('Failed to toggle reminders:', e);
      alert('❌ Failed to update reminder settings');
    }
  };

  const handleUpdateTime = () => {
    try {
      const result = window.ReminderService?.setReminderTime(selectedHour, selectedMinute);
      if (result?.success) {
        loadSettings();
        updateTimeUntilNext();
        alert(`✅ Reminder time updated to ${formatTime(selectedHour, selectedMinute)}`);
      }
    } catch (e) {
      console.error('Failed to update time:', e);
      alert('❌ Failed to update reminder time');
    }
  };

  const handleTestNotification = () => {
    try {
      const result = window.ReminderService?.testNotification();
      if (result?.success) {
        alert('✅ Test notification sent! Check your notifications.');
      } else {
        alert(`❌ ${result.error}`);
      }
    } catch (e) {
      console.error('Failed to send test notification:', e);
      alert('❌ Failed to send test notification');
    }
  };

  const formatTime = (hour, minute) => {
    const h = hour % 12 || 12;
    const m = String(minute).padStart(2, '0');
    const period = hour >= 12 ? 'PM' : 'AM';
    return `${h}:${m} ${period}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!settings?.notificationSupported) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-stone-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-stone-400" />
          </button>
          <h3 className="text-lg font-bold text-white">{TranslationService.t('settings.daily_reminders')}</h3>
        </div>

        <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-6 text-center">
          <Bell className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h4 className="text-red-400 font-bold text-lg mb-2">{TranslationService.t('settings.notifications_not_supported')}</h4>
          <p className="text-stone-300 text-sm">
            {TranslationService.t('settings.browser_not_support')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-stone-700 rounded-lg transition-colors">
          <X className="w-5 h-5 text-stone-400" />
        </button>
        <h3 className="text-lg font-bold text-white">{TranslationService.t('settings.daily_reminders')}</h3>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="bg-stone-800/60 border border-stone-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Bell className={`w-6 h-6 ${settings.enabled ? 'text-green-400' : 'text-stone-400'}`} />
            <div>
              <h4 className="font-bold text-white text-sm">{TranslationService.t('settings.daily_reminders')}</h4>
              <p className="text-stone-400 text-xs">{TranslationService.t('settings.reminder_desc')}</p>
            </div>
          </div>
          <button
            onClick={handleToggleReminders}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              settings.enabled ? 'bg-green-600' : 'bg-stone-600'
            }`}
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
              settings.enabled ? 'translate-x-8' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {settings.permissionStatus === 'denied' && (
          <div className="mt-3 bg-amber-900/30 border border-amber-700/30 rounded-lg p-3">
            <p className="text-amber-300 text-xs">
              ⚠️ Notifications are blocked. Please enable them in your browser settings.
            </p>
          </div>
        )}

        {settings.permissionStatus === 'default' && !settings.enabled && (
          <div className="mt-3 bg-blue-900/30 border border-blue-700/30 rounded-lg p-3">
            <p className="text-blue-300 text-xs">
              💡 You'll be asked to grant notification permission when you enable reminders.
            </p>
          </div>
        )}
      </div>

      {/* Time Selection */}
      {settings.enabled && (
        <>
          <div className="bg-stone-800/60 border border-stone-700 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-bold text-white text-sm mb-1">Reminder Time</h4>
                <p className="text-stone-400 text-xs mb-4">
                  Choose when you'd like to receive your daily reminder
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* Hour Selector */}
                  <div>
                    <label className="text-stone-300 text-xs mb-2 block">Hour</label>
                    <select
                      value={selectedHour}
                      onChange={(e) => setSelectedHour(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {formatTime(i, 0).split(':')[0]} {i >= 12 ? 'PM' : 'AM'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Minute Selector */}
                  <div>
                    <label className="text-stone-300 text-xs mb-2 block">Minute</label>
                    <select
                      value={selectedMinute}
                      onChange={(e) => setSelectedMinute(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
                    >
                      {[0, 15, 30, 45].map((minute) => (
                        <option key={minute} value={minute}>
                          {String(minute).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-stone-900/50 rounded-lg p-3 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-400 mb-1">
                      {formatTime(selectedHour, selectedMinute)}
                    </div>
                    <div className="text-stone-400 text-xs">Current reminder time</div>
                  </div>
                </div>

                {(selectedHour !== settings.time.hour || selectedMinute !== settings.time.minute) && (
                  <button
                    onClick={handleUpdateTime}
                    className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Update Reminder Time
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Time Until Next Reminder */}
          {timeUntilNext && (
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700/30 rounded-xl p-5">
              <div className="text-center">
                <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h4 className="text-white font-bold mb-2">Next Reminder</h4>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {timeUntilNext.hours}h {timeUntilNext.minutes}m
                </div>
                <p className="text-stone-300 text-xs">
                  Your next reminder will arrive at {formatTime(settings.time.hour, settings.time.minute)}
                </p>
              </div>
            </div>
          )}

          {/* Test Notification Button */}
          <div className="bg-stone-800/60 border border-stone-700 rounded-xl p-5">
            <div className="text-center">
              <h4 className="font-bold text-white text-sm mb-2">Test Notifications</h4>
              <p className="text-stone-400 text-xs mb-4">
                Send a test notification to see how reminders will look
              </p>
              <button
                onClick={handleTestNotification}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Send Test Notification
              </button>
            </div>
          </div>
        </>
      )}

      {/* Popular Times */}
      {!settings.enabled && (
        <div className="bg-stone-800/60 border border-stone-700 rounded-xl p-5">
          <h4 className="font-bold text-white text-sm mb-3">Popular Reminder Times</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { hour: 9, minute: 0, label: 'Morning', emoji: '🌅' },
              { hour: 12, minute: 0, label: 'Lunch', emoji: '🍽️' },
              { hour: 18, minute: 0, label: 'Evening', emoji: '🌆' },
              { hour: 21, minute: 0, label: 'Night', emoji: '🌙' }
            ].map((time) => (
              <button
                key={`${time.hour}-${time.minute}`}
                onClick={() => {
                  setSelectedHour(time.hour);
                  setSelectedMinute(time.minute);
                }}
                className="bg-stone-700/50 hover:bg-stone-700 border border-stone-600 rounded-lg p-3 text-left transition-colors"
              >
                <div className="text-lg mb-1">{time.emoji}</div>
                <div className="text-white text-sm font-medium">{time.label}</div>
                <div className="text-stone-400 text-xs">{formatTime(time.hour, time.minute)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
        <p className="text-blue-300 text-sm">
          💡 <strong>Tip:</strong> Daily practice helps build strong critical thinking habits.
          Enable reminders to stay consistent with your learning journey!
        </p>
      </div>
    </div>
  );
};

export default ReminderSettings;
