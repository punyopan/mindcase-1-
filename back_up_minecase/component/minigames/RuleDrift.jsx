import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, X, Lightbulb } from '../icon';

const RuleDrift = ({ onComplete, difficulty = 'medium' }) => {
  const [currentObject, setCurrentObject] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [currentRule, setCurrentRule] = useState(null);
  const [ruleChangeDetected, setRuleChangeDetected] = useState(false);
  const [totalObjects, setTotalObjects] = useState(0);
  const [correctClassifications, setCorrectClassifications] = useState(0);
  const [ruleChanges, setRuleChanges] = useState(0);
  const [detectedChanges, setDetectedChanges] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const difficultySettings = {
    easy: { maxRounds: 15, ruleChangeInterval: 6, feedbackDelay: 200 },
    medium: { maxRounds: 20, ruleChangeInterval: 5, feedbackDelay: 300 },
    hard: { maxRounds: 25, ruleChangeInterval: 4, feedbackDelay: 400 }
  };

  const settings = difficultySettings[difficulty] || difficultySettings.medium;

  const shapes = ['🔵', '🔺', '🔶', '⭐', '💠'];
  const colors = ['red', 'blue', 'green', 'purple', 'amber'];
  const sizes = ['small', 'medium', 'large'];

  const rules = [
    { id: 1, name: 'circles', test: (obj) => obj.shape === '🔵', category: 'A' },
    { id: 2, name: 'blue-items', test: (obj) => obj.color === 'blue', category: 'A' },
    { id: 3, name: 'large-items', test: (obj) => obj.size === 'large', category: 'A' },
    { id: 4, name: 'stars', test: (obj) => obj.shape === '⭐', category: 'A' },
    { id: 5, name: 'small-or-green', test: (obj) => obj.size === 'small' || obj.color === 'green', category: 'A' }
  ];

  useEffect(() => {
    initializeGame();
    try {
      window.SoundService?.playSound('gameStart');
    } catch (e) {
      console.warn('Sound failed:', e);
    }
  }, []);

  const initializeGame = () => {
    const initialRule = rules[Math.floor(Math.random() * rules.length)];
    setCurrentRule(initialRule);
    generateNewObject(initialRule);
  };

  const generateNewObject = (rule) => {
    const obj = {
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      size: sizes[Math.floor(Math.random() * sizes.length)]
    };

    obj.correctCategory = rule.test(obj) ? 'A' : 'B';
    setCurrentObject(obj);
  };

  const checkForRuleChange = (currentRound) => {
    if (currentRound % settings.ruleChangeInterval === 0 && currentRound > 0) {
      // Rule change!
      const newRule = rules.filter(r => r.id !== currentRule.id)[Math.floor(Math.random() * (rules.length - 1))];
      setCurrentRule(newRule);
      setRuleChanges(prev => prev + 1);
      return true;
    }
    return false;
  };

  const handleClassification = (category) => {
    if (!currentObject || isComplete) return;

    const isCorrect = currentObject.correctCategory === category;
    setTotalObjects(prev => prev + 1);

    if (isCorrect) {
      setCorrectClassifications(prev => prev + 1);
      setScore(prev => prev + 10);
      setFeedback({ type: 'correct', message: '✓' });
      try {
        window.SoundService?.playSound('buttonClick');
      } catch (e) {
        console.warn('Sound failed:', e);
      }
    } else {
      setFeedback({ type: 'incorrect', message: '✗' });
      try {
        window.SoundService?.playSound('gameFail');
      } catch (e) {
        console.warn('Sound failed:', e);
      }
    }

    // Subtle feedback delay hint
    setTimeout(() => {
      setFeedback(null);
      const nextRound = round + 1;

      if (nextRound > settings.maxRounds) {
        completeGame();
      } else {
        const ruleChanged = checkForRuleChange(nextRound);
        setRound(nextRound);
        generateNewObject(currentRule);
      }
    }, settings.feedbackDelay);
  };

  const handleRuleChangeDetection = () => {
    setDetectedChanges(prev => prev + 1);
    setScore(prev => prev + 20);
    setRuleChangeDetected(true);

    try {
      window.SoundService?.playSound('gameSuccess');
    } catch (e) {
      console.warn('Sound failed:', e);
    }

    setTimeout(() => {
      setRuleChangeDetected(false);
    }, 1500);
  };

  const completeGame = () => {
    setIsComplete(true);

    const accuracy = totalObjects > 0 ? (correctClassifications / totalObjects) * 100 : 0;
    const changeDetectionRate = ruleChanges > 0 ? (detectedChanges / ruleChanges) * 100 : 0;
    const finalScore = Math.round(accuracy * 0.7 + changeDetectionRate * 0.3);

    try {
      if (finalScore >= 70) {
        window.SoundService?.playSound('gameSuccess');
      } else {
        window.SoundService?.playSound('gameFail');
      }
    } catch (e) {
      console.warn('Sound failed:', e);
    }

    setTimeout(() => {
      onComplete({
        success: finalScore >= 60,
        score: finalScore,
        accuracy,
        changeDetectionRate,
        totalChanges: ruleChanges,
        detectedChanges
      });
    }, 2000);
  };

  const getSizeStyle = (size) => {
    switch (size) {
      case 'small': return 'text-4xl';
      case 'medium': return 'text-6xl';
      case 'large': return 'text-8xl';
      default: return 'text-6xl';
    }
  };

  const getColorFilter = (color) => {
    const filters = {
      red: 'hue-rotate-0',
      blue: 'hue-rotate-180',
      green: 'hue-rotate-90',
      purple: 'hue-rotate-270',
      amber: 'hue-rotate-45'
    };
    return filters[color] || '';
  };

  if (isComplete) {
    return (
      <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold text-white mb-2">Rule Drift Complete!</h3>
          <p className="text-stone-400 text-sm mb-6">Analyzing your cognitive flexibility...</p>

          <div className="bg-stone-800/60 border border-stone-700 rounded-lg p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-stone-300">Final Score:</span>
              <span className="text-amber-400 font-bold text-xl">{score}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-300">Accuracy:</span>
              <span className="text-green-400 font-bold">
                {correctClassifications} / {totalObjects} ({Math.round((correctClassifications / totalObjects) * 100)}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-300">Rule Changes Detected:</span>
              <span className="text-blue-400 font-bold">
                {detectedChanges} / {ruleChanges}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">🔄 Rule Drift</h3>
        <p className="text-stone-400 text-sm">Classify objects - rules may change without warning</p>

        <div className="flex justify-center gap-6 mt-3">
          <div className="flex items-center gap-2">
            <span className="text-stone-400 text-xs">Round:</span>
            <span className="font-bold text-sm text-amber-400">{round} / {settings.maxRounds}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-400 text-xs">Score:</span>
            <span className="font-bold text-sm text-green-400">{score}</span>
          </div>
        </div>
      </div>

      {/* Current Object Display */}
      {currentObject && (
        <div className="bg-stone-800/60 border border-stone-700 rounded-xl p-8 mb-6 relative">
          <div className={`text-center transition-all duration-500 ${getSizeStyle(currentObject.size)} ${getColorFilter(currentObject.color)}`}>
            {currentObject.shape}
          </div>

          {feedback && (
            <div className={`absolute top-4 right-4 text-3xl font-bold transition-all ${
              feedback.type === 'correct' ? 'text-green-400' : 'text-red-400'
            } animate-pulse`}>
              {feedback.message}
            </div>
          )}

          {ruleChangeDetected && (
            <div className="absolute top-4 left-4 bg-blue-500/20 border border-blue-400 rounded-lg px-3 py-1 animate-pulse">
              <span className="text-blue-300 text-xs font-bold">⚡ Rule Change Detected!</span>
            </div>
          )}
        </div>
      )}

      {/* Classification Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          onClick={() => handleClassification('A')}
          disabled={!currentObject || feedback !== null}
          className="bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-6 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-2xl mb-2">A</div>
          <div className="text-xs">Category A</div>
        </button>

        <button
          onClick={() => handleClassification('B')}
          disabled={!currentObject || feedback !== null}
          className="bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-bold py-6 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-2xl mb-2">B</div>
          <div className="text-xs">Category B</div>
        </button>
      </div>

      {/* Rule Change Detection Button */}
      <button
        onClick={handleRuleChangeDetection}
        disabled={!currentObject || feedback !== null || ruleChangeDetected}
        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        🔔 I Detected a Rule Change! (+20 pts)
      </button>

      {/* Hint */}
      <div className="mt-4 bg-stone-800/40 border border-stone-700 rounded-lg p-3">
        <p className="text-stone-400 text-xs text-center">
          💡 Pay attention to subtle feedback changes - they might indicate a rule shift
        </p>
      </div>
    </div>
  );
};

export default RuleDrift;
