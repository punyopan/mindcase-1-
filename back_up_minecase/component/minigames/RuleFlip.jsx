import React, { useState, useEffect, useCallback } from 'react';

const RuleFlip = ({ onComplete, difficulty }) => {
  const [phase, setPhase] = useState('ready');
  const [rule, setRule] = useState('color');
  const [currentCard, setCurrentCard] = useState(null);
  const [options, setOptions] = useState([]);
  const [trial, setTrial] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [lastRule, setLastRule] = useState(null);
  const [correct, setCorrect] = useState(0);
  const maxTrials = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 18;

  const shapes = ['circle', 'square', 'triangle'];
  const shapeColors = ['#ef4444', '#22c55e', '#3b82f6'];

  const generateTrial = useCallback(() => {
    const shouldSwitch = Math.random() < 0.4;
    const newRule = shouldSwitch ? (rule === 'color' ? 'shape' : 'color') : rule;

    const cardShape = shapes[Math.floor(Math.random() * shapes.length)];
    const cardColor = shapeColors[Math.floor(Math.random() * shapeColors.length)];

    const correctOption = newRule === 'color'
      ? { shape: shapes[Math.floor(Math.random() * shapes.length)], color: cardColor }
      : { shape: cardShape, color: shapeColors[Math.floor(Math.random() * shapeColors.length)] };

    let wrongOption;
    do {
      wrongOption = {
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        color: shapeColors[Math.floor(Math.random() * shapeColors.length)]
      };
    } while (
      (newRule === 'color' && wrongOption.color === cardColor) ||
      (newRule === 'shape' && wrongOption.shape === cardShape)
    );

    const opts = Math.random() < 0.5
      ? [correctOption, wrongOption]
      : [wrongOption, correctOption];

    setLastRule(rule);
    setRule(newRule);
    setCurrentCard({ shape: cardShape, color: cardColor });
    setOptions(opts);
  }, [rule]);

  const renderShape = (shape, color, size = 40) => {
    switch (shape) {
      case 'circle':
        return <div className="rounded-full" style={{ backgroundColor: color, width: size, height: size }} />;
      case 'square':
        return <div className="rounded-lg" style={{ backgroundColor: color, width: size, height: size }} />;
      case 'triangle':
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size/2}px solid transparent`,
              borderRight: `${size/2}px solid transparent`,
              borderBottom: `${size * 0.87}px solid ${color}`
            }}
          />
        );
      default:
        return null;
    }
  };

  const handleChoice = (optionIndex) => {
    if (feedback || trial >= maxTrials) return;

    const chosen = options[optionIndex];
    const isCorrect = rule === 'color'
      ? chosen.color === currentCard.color
      : chosen.shape === currentCard.shape;
      
    let newCorrect = correct;
    let newScore = score;

    if (isCorrect) {
      newScore += 10;
      newCorrect += 1;
      setScore(newScore);
      setCorrect(newCorrect);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }

    const nextTrial = trial + 1;
    
    setTimeout(() => {
      setFeedback(null);
      if (nextTrial >= maxTrials) {
        // Game Over
        setTrial(nextTrial); // Update visual
        const accuracy = newCorrect / maxTrials;
        onComplete({ success: accuracy >= 0.65, score: newScore });
      } else {
        setTrial(nextTrial);
        generateTrial();
      }
    }, 600);
  };

  useEffect(() => {
    if (phase === 'ready') {
      setTimeout(() => {
        setPhase('playing');
        generateTrial();
      }, 1000);
    }
  }, [phase]);

  return (
    <div className="bg-stone-900/80 border border-stone-700 rounded-xl p-6">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold text-white mb-2">🔄 Rule Flip</h3>
        <div className="text-sm text-stone-400 mb-2">Trial {trial + 1}/{maxTrials}</div>
        <div className={`text-sm font-bold px-3 py-1 rounded-lg inline-block ${
          rule === 'color' ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-white' : 'bg-stone-600'
        }`}>
          Match by {rule.toUpperCase()}
        </div>
      </div>

      {currentCard && (
        <>
          <div className="w-20 h-20 bg-stone-700 rounded-xl flex items-center justify-center mx-auto mb-6">
            {renderShape(currentCard.shape, currentCard.color, 50)}
          </div>

          <div className="flex justify-center gap-4 mb-4">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleChoice(i)}
                disabled={!!feedback}
                className={`w-16 h-16 rounded-lg flex items-center justify-center transition-all ${
                  feedback ? 'bg-stone-700' : 'bg-stone-700 hover:bg-stone-600 active:scale-95'
                }`}
              >
                {renderShape(opt.shape, opt.color, 35)}
              </button>
            ))}
          </div>
        </>
      )}

      {feedback && (
        <div className={`text-lg font-bold text-center mb-2 ${
          feedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'
        }`}>
          {feedback === 'correct' ? '✓' : '✗'}
        </div>
      )}

      <div className="flex justify-center gap-6 text-center">
        <div>
          <div className="text-lg font-bold text-emerald-400">{score}</div>
          <div className="text-xs text-stone-500">Score</div>
        </div>
        <div>
          <div className="text-lg font-bold text-cyan-400">{correct}</div>
          <div className="text-xs text-stone-500">Correct</div>
        </div>
      </div>
    </div>
  );
};

export default RuleFlip;
