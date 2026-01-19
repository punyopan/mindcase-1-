import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, X, Lightbulb } from '../icon';

const MathPuzzle = ({ onComplete }) => {
  const [puzzle, setPuzzle] = useState(null);
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  const completedRef = useRef(false);

  const puzzles = [
    { question: 'If 3 + 4 = 21, 5 + 6 = 66, 7 + 2 = 63, what is 8 + 9?', answer: '153', hint: 'Pattern: (a + b) × a = answer. Example: (3+4)×3 = 21' },
    { question: 'If 1 = 5, 2 = 10, 3 = 15, 4 = 20, then 5 = ?', answer: '1', hint: 'Look at the reverse pattern. If 1=5, then 5=?' },
    { question: '12 ÷ 3 = 4214, 18 ÷ 6 = 3123, 20 ÷ 5 = ?', answer: '4154', hint: 'Pattern: (a)(a÷b)(b)(a-b). Example: 12,4,3,9 becomes 4214 rearranged' },
    { question: 'A bat and ball cost $110. The bat costs $100 more than the ball. How much does the ball cost?', answer: '5', hint: 'If ball = x, then bat = x + 100. Together: x + (x + 100) = 110' },
    { question: 'If 2 × 3 = 36, 4 × 5 = 400, 6 × 7 = ?', answer: '2916', hint: 'Pattern: (a × b)² = answer. Example: (2×3)² = 6² = 36' },
    { question: 'What 3-digit number has digits that multiply to 36 and add up to 13?', answer: '346', hint: 'Find three single digits where a×b×c=36 and a+b+c=13' }
  ];

  useEffect(() => {
    setPuzzle(puzzles[Math.floor(Math.random() * puzzles.length)]);
    // Play game start sound
    try {
      window.SoundService?.playSound('gameStart');
    } catch (e) {
      console.warn('Sound failed:', e);
    }
  }, []);

  const checkAnswer = () => {
    if (completedRef.current) return;

    if (answer.trim() === puzzle.answer) {
      completedRef.current = true;
      setCompleted(true);
      // Play success sound
      try {
        window.SoundService?.playSound('gameSuccess');
      } catch (e) {
        console.warn('Sound failed:', e);
      }
      onComplete({ success: true });
    } else {
      setAnswer('');
      // Play fail sound
      try {
        window.SoundService?.playSound('gameFail');
      } catch (e) {
        console.warn('Sound failed:', e);
      }
      alert('Incorrect! Try again.');
    }
  };

  if (!puzzle) return null;

  return (
    <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">🔢 Math Puzzle</h3>
        <p className="text-stone-400 text-sm">Solve the brain teaser</p>
      </div>

      <div className="bg-stone-800/60 border-2 border-amber-600/50 rounded-lg p-6 mb-6">
        <p className="text-white text-lg text-center">{puzzle.question}</p>
      </div>

      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && answer && !completed && checkAnswer()}
        placeholder="Your answer..."
        disabled={completed}
        className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {showHint && (
        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-blue-200 text-sm">{puzzle.hint}</p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {!showHint && (
          <button
            onClick={() => setShowHint(true)}
            className="flex-1 bg-stone-700 hover:bg-stone-600 text-white font-medium py-3 rounded-lg transition-all"
          >
            💡 Hint
          </button>
        )}
        <button
          onClick={checkAnswer}
          disabled={!answer.trim() || completed}
          className="flex-1 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 disabled:from-stone-700 disabled:to-stone-800 text-white font-bold py-3 rounded-lg transition-all disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default MathPuzzle;
