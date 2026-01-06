import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle } from './icon';

const TokenShop = ({ onClose, puzzleId, puzzleName, onUnlock, userId, userTokens }) => {
  const [tokens, setTokens] = useState(userTokens || 0);
  const [unlocking, setUnlocking] = useState(false);
  const [unlockCost] = useState(3);

  useEffect(() => {
    // Sync with parent's token count
    setTokens(userTokens || 0);
  }, [userTokens]);

  const handleUnlock = () => {
    setUnlocking(true);

    try {
      // Use userId prop from parent
      const currentUserId = userId || 'default_user';
      const result = window.UserProgressService?.spendTokens(currentUserId, puzzleId, unlockCost);

      if (result?.success) {
        setTokens(result.tokens);
        setTimeout(() => {
          alert(`✅ Puzzle unlocked!\n\nRemaining tokens: ${result.tokens}`);
          onUnlock?.();
          onClose();
        }, 500);
      } else if (result?.reason === 'insufficient_tokens') {
        alert(`❌ Not enough tokens!\n\nYou have: ${result.tokens} tokens\nNeed: ${result.required} tokens\n\nPlay daily minigames to earn more tokens!`);
      } else if (result?.reason === 'already_unlocked') {
        alert('✅ This puzzle is already unlocked!');
        onClose();
      } else {
        alert('❌ Failed to unlock puzzle. Please try again.');
      }
    } catch (e) {
      console.error('Unlock error:', e);
      alert('❌ An error occurred. Please try again.');
    } finally {
      setUnlocking(false);
    }
  };

  const canAfford = tokens >= unlockCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 border-2 border-amber-700/50 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-red-900 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-6 h-6" />
              Unlock Puzzle
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
          {/* Puzzle Info */}
          <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Puzzle Details</h3>
            <p className="text-stone-300 text-sm">{puzzleName || 'Premium Puzzle'}</p>
          </div>

          {/* Cost Display */}
          <div className="bg-gradient-to-br from-amber-900/20 to-yellow-900/20 border-2 border-amber-600/50 rounded-lg p-6 text-center">
            <div className="text-5xl mb-3">💰</div>
            <div className="text-3xl font-bold text-amber-400 mb-2">{unlockCost} Tokens</div>
            <p className="text-stone-300 text-sm">Required to unlock this puzzle</p>
          </div>

          {/* User Balance */}
          <div className="bg-stone-800/50 border border-stone-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-stone-300 text-sm">Your Balance:</span>
              <span className={`text-xl font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                {tokens} tokens
              </span>
            </div>
            {!canAfford && (
              <div className="mt-3 pt-3 border-t border-stone-700">
                <p className="text-amber-400 text-xs mb-2">
                  ⚠️ You need {unlockCost - tokens} more token{unlockCost - tokens > 1 ? 's' : ''}
                </p>
                <p className="text-stone-400 text-xs">
                  💡 Play daily minigames to earn up to 3 tokens per day!
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-stone-700 hover:bg-stone-600 text-white font-semibold py-3 px-4 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleUnlock}
              disabled={!canAfford || unlocking}
              className={`flex-1 font-semibold py-3 px-4 rounded-lg transition-all ${
                canAfford && !unlocking
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white'
                  : 'bg-stone-700 text-stone-500 cursor-not-allowed'
              }`}
            >
              {unlocking ? 'Unlocking...' : canAfford ? 'Unlock Puzzle' : 'Not Enough Tokens'}
            </button>
          </div>

          {/* Premium Alternative */}
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
            <p className="text-blue-300 text-xs text-center mb-2">
              ⭐ <strong>Premium Members</strong> get unlimited access to all puzzles!
            </p>
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold py-2 px-3 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all">
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenShop;
