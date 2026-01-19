import React, { useState, useEffect, useCallback } from 'react';

const MirrorMatch = ({ onComplete, difficulty }) => {
  const [phase, setPhase] = useState('ready');
  const [leftGrid, setLeftGrid] = useState([]);
  const [rightGrid, setRightGrid] = useState([]);
  const [isMirror, setIsMirror] = useState(false);
  const [trial, setTrial] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [gridSize, setGridSize] = useState(difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 4);
  const maxTrials = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 15;

  const generateGrids = useCallback(() => {
    const size = gridSize;
    const fillCount = Math.floor(size * size * 0.35);

    const left = Array(size * size).fill(false);
    const indices = [];
    while (indices.length < fillCount) {
      const idx = Math.floor(Math.random() * size * size);
      if (!indices.includes(idx)) {
        indices.push(idx);
        left[idx] = true;
      }
    }

    const shouldMirror = Math.random() < 0.5;
    let right;

    if (shouldMirror) {
      right = Array(size * size).fill(false);
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const leftIdx = row * size + col;
          const rightIdx = row * size + (size - 1 - col);
          right[rightIdx] = left[leftIdx];
        }
      }
    } else {
      right = Array(size * size).fill(false);
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const leftIdx = row * size + col;
          const rightIdx = row * size + (size - 1 - col);
          right[rightIdx] = left[leftIdx];
        }
      }
      const flipIdx = Math.floor(Math.random() * size * size);
      right[flipIdx] = !right[flipIdx];
    }

    setLeftGrid(left);
    setRightGrid(right);
    setIsMirror(shouldMirror);
  }, [gridSize]);

  const handleResponse = (response) => {
    if (feedback) return;

    const isCorrect = (response === 'yes') === isMirror;

    if (isCorrect) {
      setCorrect(prev => prev + 1);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
      if (trial + 1 >= maxTrials) {
        const finalCorrect = isCorrect ? correct + 1 : correct;
        const accuracy = finalCorrect / maxTrials;
        onComplete({
          success: accuracy >= 0.65,
          score: Math.round(accuracy * 100 * gridSize),
          accuracy: Math.round(accuracy * 100),
          correctResponses: finalCorrect,
          totalResponses: maxTrials,
          errors: maxTrials - finalCorrect,
          gridSize: gridSize,
          trials: maxTrials
        });
      } else {
        setTrial(prev => prev + 1);
        generateGrids();
      }
    }, 600);
  };

  useEffect(() => {
    if (phase === 'ready') {
      setTimeout(() => {
        setPhase('playing');
        generateGrids();
      }, 800);
    }
  }, [phase]);

  const renderGrid = (grid, label) => (
    <div className="flex flex-col items-center">
      <div
        className="grid gap-1 bg-stone-800 p-1.5 rounded-lg"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {grid.map((filled, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded transition-colors ${
              filled ? 'bg-violet-500' : 'bg-stone-700'
            }`}
          />
        ))}
      </div>
      <div className="text-xs text-stone-500 mt-1">{label}</div>
    </div>
  );

  return (
    <div className="bg-stone-900/80 border border-stone-700 rounded-xl p-6">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold text-white mb-2">🪞 Mirror Match</h3>
        <div className="text-sm text-stone-400 mb-1">Trial {trial + 1}/{maxTrials}</div>
        <div className="text-sm font-medium">Is the right a mirror of the left?</div>
        <div className="text-xs text-stone-500">Grid: {gridSize}×{gridSize}</div>
      </div>

      <div className="flex justify-center gap-6 items-center mb-6">
        {renderGrid(leftGrid, 'Original')}
        <div className="text-xl text-stone-600">⟷</div>
        {renderGrid(rightGrid, 'Mirror?')}
      </div>

      {feedback && (
        <div className={`text-lg font-bold mb-3 text-center ${
          feedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'
        }`}>
          {feedback === 'correct' ? '✓' : '✗'}
        </div>
      )}

      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={() => handleResponse('yes')}
          disabled={!!feedback}
          className={`flex-1 h-11 rounded-lg font-bold text-sm transition-all ${
            feedback ? 'bg-stone-700 text-stone-500' : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95'
          }`}
        >
          YES
        </button>
        <button
          onClick={() => handleResponse('no')}
          disabled={!!feedback}
          className={`flex-1 h-11 rounded-lg font-bold text-sm transition-all ${
            feedback ? 'bg-stone-700 text-stone-500' : 'bg-rose-600 hover:bg-rose-500 active:scale-95'
          }`}
        >
          NO
        </button>
      </div>

      <div className="flex justify-center gap-6 text-center">
        <div>
          <div className="text-lg font-bold text-emerald-400">{correct}</div>
          <div className="text-xs text-stone-500">Correct</div>
        </div>
      </div>
    </div>
  );
};

export default MirrorMatch;
