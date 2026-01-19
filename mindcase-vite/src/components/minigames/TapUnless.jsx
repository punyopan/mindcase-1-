import React, { useState, useEffect, useRef } from 'react';

const TapUnless = ({ onComplete, difficulty }) => {
  const [shape, setShape] = useState(null);
  const [isRed, setIsRed] = useState(false);
  const [trial, setTrial] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [responded, setResponded] = useState(false);
  const [correctGo, setCorrectGo] = useState(0);
  const [correctNoGo, setCorrectNoGo] = useState(0);
  const [errors, setErrors] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  
  const maxTrials = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 20 : 25;
  const timerRef = useRef(null);
  const feedbackTimerRef = useRef(null);
  const nextTrialTimerRef = useRef(null);
  
  // Use refs for score tracking to avoid stale closures
  const scoreRef = useRef({ correctGo: 0, correctNoGo: 0, errors: 0 });
  const isRedRef = useRef(false);
  const respondedRef = useRef(false);

  const shapes = ['circle', 'square', 'triangle', 'diamond'];
  const colors = ['#22d3ee', '#a78bfa', '#4ade80', '#fbbf24'];

  // Cleanup all timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      if (nextTrialTimerRef.current) clearTimeout(nextTrialTimerRef.current);
    };
  }, []);

  // Handle game completion
  useEffect(() => {
    if (gameComplete) {
      const { correctGo: cg, correctNoGo: cng, errors: err } = scoreRef.current;
      const accuracy = maxTrials > 0 ? ((cg + cng) / maxTrials) : 0;
      
      onComplete({
        success: accuracy >= 0.7,
        score: Math.round(accuracy * 100),
        accuracy: Math.round(accuracy * 100),
        correctResponses: cg + cng,
        totalResponses: maxTrials,
        errors: err,
        hits: cg,
        correctRejections: cng,
        trials: maxTrials
      });
    }
  }, [gameComplete, maxTrials, onComplete]);

  // Start trial effect
  useEffect(() => {
    if (gameComplete) return;
    
    if (trial >= maxTrials) {
      setGameComplete(true);
      return;
    }

    const startDelay = trial === 0 ? 1500 : 0;

    const startTrial = setTimeout(() => {
      const redProbability = 0.3;
      const isRedRound = Math.random() < redProbability;
      const shapeIndex = Math.floor(Math.random() * shapes.length);

      isRedRef.current = isRedRound;
      respondedRef.current = false;
      
      setShape(shapes[shapeIndex]);
      setIsRed(isRedRound);
      setResponded(false);
      setFeedback(null);

      // Response window timer (1 second)
      timerRef.current = setTimeout(() => {
        if (!respondedRef.current) {
          // No tap occurred
          if (isRedRef.current) {
            // Correct: didn't tap red
            scoreRef.current.correctNoGo += 1;
            setCorrectNoGo(scoreRef.current.correctNoGo);
          } else {
            // Error: should have tapped
            scoreRef.current.errors += 1;
            setErrors(scoreRef.current.errors);
          }
        }
        
        // End trial sequence
        setShape(null);
        feedbackTimerRef.current = setTimeout(() => {
          setFeedback(null);
          nextTrialTimerRef.current = setTimeout(() => {
            setTrial(t => t + 1);
          }, 400);
        }, 600);
        
      }, 1000);
    }, startDelay);

    return () => {
      clearTimeout(startTrial);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      if (nextTrialTimerRef.current) clearTimeout(nextTrialTimerRef.current);
    };
  }, [trial, gameComplete, maxTrials]);

  const handleTap = () => {
    if (respondedRef.current || !shape || gameComplete) return;
    
    respondedRef.current = true;
    setResponded(true);
    
    // Clear the response window timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isRedRef.current) {
      // Error: tapped red
      setFeedback('commission');
      scoreRef.current.errors += 1;
      setErrors(scoreRef.current.errors);
    } else {
      // Correct: tapped non-red
      setFeedback('correct');
      scoreRef.current.correctGo += 1;
      setCorrectGo(scoreRef.current.correctGo);
    }

    // End trial sequence
    setShape(null);
    feedbackTimerRef.current = setTimeout(() => {
      setFeedback(null);
      nextTrialTimerRef.current = setTimeout(() => {
        setTrial(t => t + 1);
      }, 400);
    }, 600);
  };

  const renderShape = () => {
    const color = isRed ? '#ef4444' : colors[shapes.indexOf(shape)];

    switch (shape) {
      case 'circle':
        return <div className="w-24 h-24 rounded-full shadow-2xl" style={{ backgroundColor: color }} />;
      case 'square':
        return <div className="w-24 h-24 rounded-2xl shadow-2xl" style={{ backgroundColor: color }} />;
      case 'triangle':
        return (
          <div
            className="w-0 h-0"
            style={{
              borderLeft: '48px solid transparent',
              borderRight: '48px solid transparent',
              borderBottom: `84px solid ${color}`,
              filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.3))'
            }}
          />
        );
      case 'diamond':
        return (
          <div
            className="w-16 h-16 rotate-45 rounded-md shadow-2xl"
            style={{ backgroundColor: color }}
          />
        );
      default:
        return null;
    }
  };

  const displayTrial = Math.min(trial + 1, maxTrials);
  const currentAccuracy = trial > 0 ? Math.round(((correctGo + correctNoGo) / trial) * 100) : 0;

  return (
    <div className="bg-stone-900/80 border border-stone-700 rounded-xl p-6 max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h3 className="text-3xl font-bold text-white mb-3">🚫 Tap Unless</h3>
        <div className="text-lg text-stone-200 font-semibold mb-3">Trial {displayTrial}/{maxTrials}</div>
        <div className="text-base font-bold bg-stone-800/50 rounded-lg p-3 mb-2">
          Tap fast — unless it's <span className="text-rose-400 text-xl">RED!</span>
        </div>
        <div className="text-sm text-stone-400">Tap the shape area when any shape appears</div>
      </div>

      <div
        onClick={handleTap}
        className={`w-full h-48 rounded-2xl flex items-center justify-center mb-6 transition-all cursor-pointer active:scale-95 shadow-inner ${
          shape ? 'bg-gradient-to-br from-stone-700 to-stone-800' : 'bg-stone-900'
        } ${!shape ? 'border-2 border-dashed border-stone-600' : ''}`}
      >
        {shape && (
          <div className="animate-fade-in">
            {renderShape()}
          </div>
        )}
        {feedback && !shape && (
          <div className={`text-5xl font-bold ${
            feedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {feedback === 'correct' && '✓'}
            {feedback === 'commission' && '✗'}
          </div>
        )}
        {!shape && !feedback && (
          <div className="text-6xl text-stone-700">◯</div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-emerald-400">{correctGo}</div>
          <div className="text-xs text-emerald-300 font-semibold uppercase tracking-wide">Taps</div>
        </div>
        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-400">{correctNoGo}</div>
          <div className="text-xs text-blue-300 font-semibold uppercase tracking-wide">Holds</div>
        </div>
        <div className="bg-rose-900/30 border border-rose-700/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-rose-400">{errors}</div>
          <div className="text-xs text-rose-300 font-semibold uppercase tracking-wide">Errors</div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <div className="text-xs text-stone-500 mb-2">Accuracy</div>
        <div className="w-full bg-stone-800 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${currentAccuracy}%` }}
          />
        </div>
        <div className="text-sm font-bold text-amber-400 mt-1">
          {currentAccuracy}%
        </div>
      </div>
    </div>
  );
};

export default TapUnless;
