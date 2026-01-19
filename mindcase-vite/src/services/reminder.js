/**
 * Daily Reminder Service
 * Sends browser notifications to remind users to practice critical thinking
 */

const ReminderService = (() => {
  const STORAGE_KEY = 'mindcase_reminder_settings';
  const LAST_NOTIFICATION_KEY = 'mindcase_last_notification';

  // Default reminder time: 7:00 PM
  const DEFAULT_REMINDER_TIME = {
    hour: 19,
    minute: 0
  };

  let settings = {
    enabled: false,
    time: DEFAULT_REMINDER_TIME,
    permissionGranted: false
  };

  let checkInterval = null;

  /**
   * Initialize the reminder service
   */
  function init() {
    loadSettings();

    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return false;
    }

    // Start checking for reminder time if enabled
    if (settings.enabled && settings.permissionGranted) {
      startReminderCheck();
    }

    return true;
  }

  /**
   * Load settings from localStorage
   */
  function loadSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        settings = { ...settings, ...data };
      }
    } catch (e) {
      console.error('Failed to load reminder settings:', e);
    }
  }

  /**
   * Save settings to localStorage
   */
  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save reminder settings:', e);
    }
  }

  /**
   * Request notification permission from user
   */
  async function requestPermission() {
    if (!('Notification' in window)) {
      return {
        success: false,
        error: 'Notifications not supported in this browser'
      };
    }

    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        settings.permissionGranted = true;
        saveSettings();

        // Send test notification
        sendNotification(
          'Reminders Enabled! 🧠',
          'You\'ll receive daily reminders to practice critical thinking',
          true
        );

        return { success: true };
      } else if (permission === 'denied') {
        settings.permissionGranted = false;
        settings.enabled = false;
        saveSettings();

        return {
          success: false,
          error: 'Notification permission denied. Please enable notifications in your browser settings.'
        };
      } else {
        return {
          success: false,
          error: 'Notification permission dismissed'
        };
      }
    } catch (e) {
      console.error('Failed to request notification permission:', e);
      return {
        success: false,
        error: 'Failed to request permission: ' + e.message
      };
    }
  }

  /**
   * Enable daily reminders
   */
  async function enableReminders(customTime) {
    // Request permission if not already granted
    if (Notification.permission !== 'granted') {
      const result = await requestPermission();
      if (!result.success) {
        return result;
      }
    }

    // Set custom time if provided
    if (customTime) {
      settings.time = {
        hour: customTime.hour,
        minute: customTime.minute || 0
      };
    }

    settings.enabled = true;
    settings.permissionGranted = true;
    saveSettings();

    // Start checking for reminder time
    startReminderCheck();

    return {
      success: true,
      message: `Daily reminders enabled for ${formatTime(settings.time)}`
    };
  }

  /**
   * Disable daily reminders
   */
  function disableReminders() {
    settings.enabled = false;
    saveSettings();

    // Stop checking
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }

    return {
      success: true,
      message: 'Daily reminders disabled'
    };
  }

  /**
   * Set reminder time
   */
  function setReminderTime(hour, minute = 0) {
    settings.time = { hour, minute };
    saveSettings();

    // Restart reminder check with new time
    if (settings.enabled) {
      stopReminderCheck();
      startReminderCheck();
    }

    return {
      success: true,
      time: settings.time
    };
  }

  /**
   * Start periodic check for reminder time
   */
  function startReminderCheck() {
    // Stop existing interval if any
    stopReminderCheck();

    // Check every minute
    checkInterval = setInterval(() => {
      checkAndSendReminder();
    }, 60000); // 60 seconds

    // Also check immediately
    checkAndSendReminder();
  }

  /**
   * Stop periodic reminder check
   */
  function stopReminderCheck() {
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
  }

  /**
   * Check if it's time to send reminder and send if needed
   */
  function checkAndSendReminder() {
    if (!settings.enabled || !settings.permissionGranted) {
      return;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Check if current time matches reminder time
    if (currentHour === settings.time.hour && currentMinute === settings.time.minute) {
      // Check if we already sent notification today
      const lastNotification = localStorage.getItem(LAST_NOTIFICATION_KEY);
      const today = now.toDateString();

      if (lastNotification !== today) {
        // Send the reminder
        sendDailyReminder();

        // Mark as sent for today
        localStorage.setItem(LAST_NOTIFICATION_KEY, today);
      }
    }
  }

  /**
   * Send daily reminder notification
   */
  function sendDailyReminder() {
    const messages = [
      {
        title: '🧠 Time to Exercise Your Mind!',
        body: 'Practice critical thinking with today\'s puzzles. Your daily streak awaits!'
      },
      {
        title: '🔍 Detective Work Awaits!',
        body: 'New mysteries are waiting. Keep your thinking skills sharp!'
      },
      {
        title: '💡 Daily Brain Challenge!',
        body: 'Don\'t break your streak! Solve puzzles and earn tokens today.'
      },
      {
        title: '🎯 Critical Thinking Time!',
        body: 'Challenge yourself with logical puzzles. Your mind will thank you!'
      },
      {
        title: '⭐ Keep Your Streak Going!',
        body: 'Play daily minigames, solve cases, and sharpen your analytical skills.'
      }
    ];

    // Pick random message
    const message = messages[Math.floor(Math.random() * messages.length)];

    sendNotification(message.title, message.body);
  }

  /**
   * Send a notification
   */
  function sendNotification(title, body, isTest = false) {
    if (Notification.permission !== 'granted') {
      console.warn('Cannot send notification: permission not granted');
      return;
    }

    try {
      const notification = new Notification(title, {
        body: body,
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%237f1d1d" width="100" height="100"/><text y="75" font-size="70">🧠</text></svg>',
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%237f1d1d" width="100" height="100"/><text y="75" font-size="70">🧠</text></svg>',
        tag: isTest ? 'mindcase-test' : 'mindcase-daily-reminder',
        requireInteraction: false,
        silent: false
      });

      // When user clicks notification, focus the window
      notification.onclick = function() {
        window.focus();
        notification.close();
      };

      // Auto-close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);

    } catch (e) {
      console.error('Failed to send notification:', e);
    }
  }

  /**
   * Format time for display
   */
  function formatTime(time) {
    const hour = time.hour % 12 || 12;
    const minute = String(time.minute).padStart(2, '0');
    const period = time.hour >= 12 ? 'PM' : 'AM';
    return `${hour}:${minute} ${period}`;
  }

  /**
   * Get current settings
   */
  function getSettings() {
    return {
      ...settings,
      formattedTime: formatTime(settings.time),
      notificationSupported: 'Notification' in window,
      permissionStatus: Notification.permission
    };
  }

  /**
   * Test notification
   */
  function testNotification() {
    if (!settings.permissionGranted) {
      return {
        success: false,
        error: 'Notification permission not granted'
      };
    }

    sendNotification(
      '🧠 Test Notification',
      'This is how your daily reminder will look!',
      true
    );

    return {
      success: true,
      message: 'Test notification sent!'
    };
  }

  /**
   * Get time until next reminder
   */
  function getTimeUntilNextReminder() {
    if (!settings.enabled) {
      return null;
    }

    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(settings.time.hour, settings.time.minute, 0, 0);

    // If reminder time has passed today, set for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const diff = reminderTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return {
      hours,
      minutes,
      totalMinutes: Math.floor(diff / (1000 * 60)),
      nextReminderTime: reminderTime.toLocaleString()
    };
  }

  // Public API
  return {
    init,
    enableReminders,
    disableReminders,
    setReminderTime,
    requestPermission,
    testNotification,
    getSettings,
    getTimeUntilNextReminder
  };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ReminderService };
}

// Make available globally for browser
if (typeof window !== 'undefined') {
  window.ReminderService = ReminderService;
}
