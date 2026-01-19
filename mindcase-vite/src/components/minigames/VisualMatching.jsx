import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Lightbulb } from '../icon';

const VisualMatching = ({ onComplete }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [moves, setMoves] = useState(0);

  const evidenceTypes = ['🔍', '🔎', '📄', '📋', '🗝️', '💼', '📷', '🔬'];

  useEffect(() => {
    initializeGame();
    // Play game start sound
    try {
      window.SoundService?.playSound('gameStart');
    } catch (e) {
      console.warn('Sound failed:', e);
    }
  }, []);

  const initializeGame = () => {
    // Use 6 pairs for the game
    const pairs = evidenceTypes.slice(0, 6);
    const gameCards = [...pairs, ...pairs]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon, flipped: false }));

    setCards(gameCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const handleCardClick = (index) => {
    // Ignore if already flipped or matched
    if (flipped.includes(index) || matched.includes(index) || flipped.length === 2) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);

      // Check for match
      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        // Match found
        // Play button click sound for match
        try {
          window.SoundService?.playSound('buttonClick');
        } catch (e) {
          console.warn('Sound failed:', e);
        }
        setTimeout(() => {
          setMatched([...matched, first, second]);
          setFlipped([]);

          // Check if game is won
          if (matched.length + 2 === cards.length) {
            // Play success sound
            try {
              window.SoundService?.playSound('gameSuccess');
            } catch (e) {
              console.warn('Sound failed:', e);
            }
            setTimeout(() => {
              onComplete({ success: true, attempts: attempts + 1, moves: moves + 1 });
            }, 500);
          }
        }, 600);
      } else {
        // No match
        // Play fail sound for mismatch
        try {
          window.SoundService?.playSound('gameFail');
        } catch (e) {
          console.warn('Sound failed:', e);
        }
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setAttempts(attempts + 1);
    initializeGame();
  };

  return (
    <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">🧩 Evidence Matching</h3>
        <p className="text-stone-400 text-sm">Match pairs of evidence to unlock the case</p>
        <div className="flex justify-center gap-4 mt-2 text-xs">
          <span className="text-amber-400">Moves: {moves}</span>
          <span className="text-green-400">Matched: {matched.length / 2} / {cards.length / 2}</span>
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6 max-w-md mx-auto">
        {cards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(index)}
            disabled={matched.includes(index)}
            className={`aspect-square rounded-lg transition-all transform ${
              flipped.includes(index) || matched.includes(index)
                ? 'bg-gradient-to-br from-amber-500 to-amber-600'
                : 'bg-gradient-to-br from-stone-700 to-stone-800 hover:scale-105'
            } ${
              matched.includes(index)
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:shadow-lg'
            } flex items-center justify-center text-4xl`}
          >
            {flipped.includes(index) || matched.includes(index) ? (
              <span className="animate-[fadeInScale_0.3s_ease-out]">{card.icon}</span>
            ) : (
              <span className="text-stone-500">?</span>
            )}
          </button>
        ))}
      </div>

      {/* Progress Info */}
      <div className="bg-stone-800/60 border border-stone-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-stone-300 text-sm">Progress:</span>
          <span className="text-amber-400 font-bold">
            {Math.round((matched.length / cards.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-stone-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-green-500 transition-all duration-500"
            style={{ width: `${(matched.length / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Reset Button */}
      {moves > 0 && matched.length < cards.length && (
        <button
          onClick={resetGame}
          className="w-full mt-4 bg-stone-700 hover:bg-stone-600 text-white font-medium py-2 px-4 rounded-lg transition-all text-sm"
        >
          Reset Game
        </button>
      )}
    </div>
  );
};

export default VisualMatching;
