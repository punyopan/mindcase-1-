import React, { useState, useEffect } from 'react';
import TranslationService from '../services/TranslationService';
import { X, Lock, Star, Trophy } from './icon';

const TopicUnlockModal = ({ onClose, topic, topicIndex, onUnlock, onSubscribe, userId, userTokens }) => {
  const [tokens, setTokens] = useState(userTokens || 0);
  const [unlocking, setUnlocking] = useState(false);
  const unlockAllCost = 12; // 12 tokens to unlock all puzzles from this topic
  const [, setLang] = useState(TranslationService.currentLang);

  useEffect(() => {
    const unsubscribe = TranslationService.subscribe((lang) => setLang(lang));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Sync with parent's token count
    setTokens(userTokens || 0);
  }, [userTokens]);

  const handleUnlockAll = () => {
    setUnlocking(true);

    try {
      // Use userId from props
      const currentUserId = userId || 'default_user';
      console.log('Attempting to unlock all puzzles for topic:', topic.id, 'for user:', currentUserId, 'cost:', unlockAllCost);
      console.log('UserProgressService available:', typeof window.UserProgressService !== 'undefined');

      if (!window.UserProgressService) {
        throw new Error('UserProgressService not available');
      }

      const result = window.UserProgressService.unlockTopicPuzzle(currentUserId, topic.id, unlockAllCost);
      console.log('Unlock all result:', result);

      if (result?.success) {
        setTokens(result.tokens);
        setTimeout(() => {
          alert(`✅ Entire case unlocked!\\n\\nYou can now play ALL ${topic.puzzles?.length || 5} puzzles from "${topic.name}"\\n\\nRemaining tokens: ${result.tokens}`);
          onUnlock?.();
          onClose();
        }, 500);
      } else if (result?.reason === 'insufficient_tokens') {
        alert(`❌ Not enough tokens!\\n\\nYou have: ${result.tokens} tokens\\nNeed: ${result.required} tokens\\n\\nPlay daily minigames to earn more tokens!`);
      } else {
        alert('❌ Failed to unlock topic. Please try again.');
      }
    } catch (e) {
      console.error('Unlock all error:', e);
      console.error('Error details:', e.message, e.stack);
      alert(`❌ An error occurred: ${e.message}\\n\\nCheck console for details.`);
    } finally {
      setUnlocking(false);
    }
  };

  const handlePremiumUnlock = () => {
    onClose();
    onSubscribe?.();
  };

  const canAffordAll = tokens >= unlockAllCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 border-2 border-amber-700/50 rounded-2xl w-full max-w-4xl shadow-2xl my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-red-900 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Lock className="w-6 h-6" />
              {TranslationService.t('modals.unlock_case_title')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Topic Info */}
          <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">{topic.name}</h3>
            <p className="text-stone-300 text-sm">{topic.description || 'Locked case file with mysterious puzzles...'}</p>
            <div className="mt-3 text-stone-400 text-xs">
              📂 {TranslationService.t('modals.contains_puzzles', { count: topic.puzzles?.length || 5 })}
            </div>
          </div>

          {/* Two Options */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Option 1: Unlock All Puzzles */}
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-2 border-green-600/50 rounded-xl p-5">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-xl font-bold text-green-400 mb-2">{TranslationService.t('modals.unlock_entire')}</h3>
                <p className="text-stone-300 text-sm mb-4">
                  {TranslationService.t('modals.unlock_all_desc', { count: topic.puzzles?.length || 5 })}
                </p>
              </div>

              <div className="bg-black/30 border border-green-700/30 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-stone-300 text-sm">{TranslationService.t('modals.cost')}:</span>
                  <span className="text-2xl font-bold text-green-400">{unlockAllCost} tokens</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-300 text-sm">{TranslationService.t('modals.your_balance')}:</span>
                  <span className={`text-lg font-bold ${canAffordAll ? 'text-green-400' : 'text-red-400'}`}>
                    {tokens} tokens
                  </span>
                </div>
              </div>

              {!canAffordAll && (
                <div className="mb-4 bg-green-900/30 border border-green-700/30 rounded-lg p-3">
                  <p className="text-green-300 text-xs text-center">
                    💎 {TranslationService.t('modals.best_value')}
                  </p>
                </div>
              )}

              <button
                onClick={handleUnlockAll}
                disabled={!canAffordAll || unlocking}
                className={`w-full font-semibold py-2 px-3 rounded-lg transition-all text-sm ${
                  canAffordAll && !unlocking
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white'
                    : 'bg-stone-700 text-stone-500 cursor-not-allowed'
                }`}
              >
                {unlocking ? TranslationService.t('modals.unlocking') : canAffordAll ? TranslationService.t('modals.unlock_btn', { count: unlockAllCost }) : TranslationService.t('modals.not_enough')}
              </button>
            </div>

            {/* Option 2: Premium Unlock */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-2 border-blue-600/50 rounded-xl p-5">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">⭐</div>
                <h3 className="text-xl font-bold text-blue-400 mb-2">{TranslationService.t('modals.premium_access')}</h3>
                <p className="text-stone-300 text-sm mb-4">
                  {TranslationService.t('modals.premium_desc')}
                </p>
              </div>

              <div className="bg-black/30 border border-blue-700/30 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-blue-400" filled />
                  <span className="text-blue-200 text-sm">{TranslationService.t('modals.unlimited_puzzles')}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-blue-400" filled />
                  <span className="text-blue-200 text-sm">{TranslationService.t('modals.advanced_analytics')}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-blue-400" filled />
                  <span className="text-blue-200 text-sm">{TranslationService.t('modals.priority_support')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-blue-400" filled />
                  <span className="text-blue-200 text-sm">{TranslationService.t('modals.ad_free')}</span>
                </div>
              </div>

              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-blue-400">{TranslationService.t('modals.premium_price')}</div>
                <div className="text-stone-400 text-xs">{TranslationService.t('modals.premium_save')}</div>
              </div>

              <button
                onClick={handlePremiumUnlock}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-2 px-3 rounded-lg transition-all text-sm"
              >
                {TranslationService.t('modals.get_premium')}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-4 text-center">
            <p className="text-stone-300 text-sm" dangerouslySetInnerHTML={{
              __html: `💡 <strong>${TranslationService.t('modals.tip_unlock', { count: unlockAllCost }).replace('Tip: ', '')}</strong>`
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicUnlockModal;
