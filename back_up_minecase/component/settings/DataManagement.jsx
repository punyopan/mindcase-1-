import { AlertCircle, FileText } from '../icon';
import { useState } from 'react';
import TranslationService from '../../services/TranslationService';

/**
 * Data Management Settings Component
 * Allows users to export, import, and reset their progress data
 */
const DataManagement = ({ user, onProgressReset }) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetInput, setResetInput] = useState('');

  const handleExportProgress = () => {
    if (!user) return;

    try {
      const ProgressService = window.ProgressService;
      const progressJSON = ProgressService.exportProgress(user.id);

      // Create download link
      const blob = new Blob([progressJSON], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindcase-progress-${user.email}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export progress data');
    }
  };

  /**
   * Validate imported progress data schema
   * Returns { valid: boolean, errors: string[] }
   */
  const validateProgressSchema = (data) => {
    const errors = [];
    
    // Must be an object
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      return { valid: false, errors: ['Invalid data format: must be a JSON object'] };
    }

    // Required top-level fields
    const requiredFields = ['userId', 'exportDate'];
    for (const field of requiredFields) {
      if (!(field in data)) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Validate tokens if present
    if ('tokens' in data && typeof data.tokens !== 'number') {
      errors.push('Invalid tokens: must be a number');
    }
    if ('tokens' in data && data.tokens < 0) {
      errors.push('Invalid tokens: cannot be negative');
    }

    // Validate unlockedPuzzles if present
    if ('unlockedPuzzles' in data) {
      if (!Array.isArray(data.unlockedPuzzles)) {
        errors.push('Invalid unlockedPuzzles: must be an array');
      }
    }

    // Validate unlockedTopics if present
    if ('unlockedTopics' in data) {
      if (!Array.isArray(data.unlockedTopics)) {
        errors.push('Invalid unlockedTopics: must be an array');
      }
    }

    // Validate streak if present
    if ('streak' in data) {
      if (typeof data.streak !== 'number' || data.streak < 0) {
        errors.push('Invalid streak: must be a non-negative number');
      }
    }

    // Validate analytics if present
    if ('analytics' in data) {
      if (typeof data.analytics !== 'object' || data.analytics === null) {
        errors.push('Invalid analytics: must be an object');
      }
    }

    return { valid: errors.length === 0, errors };
  };

  const handleImportProgress = () => {
    if (!user) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          // Parse JSON first
          let parsedData;
          try {
            parsedData = JSON.parse(event.target.result);
          } catch (parseError) {
            alert('Invalid JSON file. Please check the file format.');
            return;
          }

          // Validate schema
          const validation = validateProgressSchema(parsedData);
          if (!validation.valid) {
            alert('Invalid progress file:\n\n• ' + validation.errors.join('\n• '));
            return;
          }

          // Proceed with import
          const ProgressService = window.ProgressService;
          const result = ProgressService.importProgress(user.id, event.target.result);

          if (result.success) {
            alert('Progress data imported successfully! Please refresh the page.');
            window.location.reload();
          } else {
            alert('Failed to import: ' + result.error);
          }
        } catch (error) {
          console.error('Import failed:', error);
          alert('Failed to import progress data. ' + error.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleResetProgress = () => {
    if (!user) return;

    if (resetInput !== 'RESET') {
      alert('Please type RESET to confirm');
      return;
    }

    try {
      // Clear old progress service data
      const ProgressService = window.ProgressService;
      ProgressService.clearProgress(user.id);

      // Clear user progress service data (tokens, unlocked topics/puzzles)
      const userProgressKey = `mindcase_user_progress_${user.id}`;
      const analyticsKey = `mindcase_analytics_${user.id}`;
      localStorage.removeItem(userProgressKey);
      localStorage.removeItem(analyticsKey);

      // Clear daily minigame progress
      localStorage.removeItem('daily_minigame_progress');

      // NOTE: Premium subscription is preserved during reset
      // Users keep their subscription status even after resetting progress

      // Call parent callback to update UI
      if (onProgressReset) {
        onProgressReset();
      }

      setShowResetConfirm(false);
      setResetInput('');

      alert('All progress has been reset. Refreshing...');
      window.location.reload();
    } catch (error) {
      console.error('Reset failed:', error);
      alert('Failed to reset progress: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-2">{TranslationService.t('settings.data_management')}</h3>
        <p className="text-stone-400 text-sm">{TranslationService.t('settings.data_desc')}</p>
      </div>

      {/* Export Progress */}
      <div className="bg-stone-800/60 border border-stone-700 rounded-xl p-5">
        <div className="flex items-start gap-3 mb-3">
          <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-white text-sm mb-1">{TranslationService.t('settings.export_progress')}</h4>
            <p className="text-stone-400 text-xs mb-3">
              {TranslationService.t('settings.export_desc')}
            </p>
            <button
              onClick={handleExportProgress}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {TranslationService.t('settings.export_data')}
            </button>
          </div>
        </div>
      </div>

      {/* Import Progress */}
      <div className="bg-stone-800/60 border border-stone-700 rounded-xl p-5">
        <div className="flex items-start gap-3 mb-3">
          <FileText className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-white text-sm mb-1">{TranslationService.t('settings.import_progress')}</h4>
            <p className="text-stone-400 text-xs mb-3">
              {TranslationService.t('settings.import_desc')}
            </p>
            <button
              onClick={handleImportProgress}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {TranslationService.t('settings.import_data')}
            </button>
          </div>
        </div>
      </div>

      {/* Reset Progress */}
      <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-red-400 text-sm mb-1">{TranslationService.t('settings.reset_progress')}</h4>
            <p className="text-stone-400 text-xs mb-3">
              {TranslationService.t('settings.reset_desc')}
              <strong className="text-green-400"> {TranslationService.t('settings.premium_preserved')}</strong>
              <strong className="text-red-400"> {TranslationService.t('settings.cannot_undo')}</strong>
            </p>

            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Reset Progress
              </button>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-stone-300 text-xs mb-2">
                    Type <strong className="text-red-400">RESET</strong> to confirm:
                  </label>
                  <input
                    type="text"
                    value={resetInput}
                    onChange={(e) => setResetInput(e.target.value)}
                    placeholder="Type RESET"
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleResetProgress}
                    disabled={resetInput !== 'RESET'}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      resetInput === 'RESET'
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-stone-700 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => {
                      setShowResetConfirm(false);
                      setResetInput('');
                    }}
                    className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
