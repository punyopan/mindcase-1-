import React, { useState, useEffect, useRef } from 'react';

const NumberGhost = ({ onComplete, difficulty }) => {
  const nLevel = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
  const maxTrials = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 12 : 15;
  
  const [currentNumber, setCurrentNumber] = useState(null);
  const [trial, setTrial] = useState(0);
  const [showNumber, setShowNumber] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [hits, setHits] = useState(0);
  const [correctRejections, setCorrectRejections] = useState(0);
  const [responded, setResponded] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  
  const timerRef = useRef(null);
  const feedbackTimerRef = useRef(null);
  const nextTrialTimerRef = useRef(null);
  
  // Use refs for stable state access in callbacks
  const historyRef = useRef([]);
  const scoreRef = useRef({ hits: 0, correctRejections: 0 });
  const respondedRef = useRef(false);
  const currentNumberRef = useRef(null);

  // Cleanup
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
      const { hits: h, correctRejections: cr } = scoreRef.current;
      const accuracy = maxTrials > 0 ? ((h + cr) / maxTrials) : 0;
      
      onComplete({
        success: accuracy >= 0.6,
        score: Math.round(accuracy * 100 * nLevel),
        accuracy: Math.round(accuracy * 100),
        correctResponses: h + cr,
        totalResponses: maxTrials,
        hits: h,
        correctRejections: cr,
        nLevel: nLevel,
        trials: maxTrials
      });
    }
  }, [gameComplete, maxTrials, nLevel, onComplete]);

  const generateNumber = (hist, n) => {
    const shouldMatch = hist.length >= n && Math.random() < 0.35;
    if (shouldMatch) {
      return hist[hist.length - n];
    }
    let num;
    do {
      num = Math.floor(Math.random() * 9) + 1;
    } while (hist.length >= n && num === hist[hist.length - n]);
    return num;
  };

  const isMatch = (num, hist) => {
    return hist.length >= nLevel && num === hist[hist.length - nLevel];
  };

  // Trial progression effect
  useEffect(() => {
    if (gameComplete) return;
    
    if (trial >= maxTrials) {
      setGameComplete(true);
      return;
    }

    const startDelay = trial === 0 ? 1000 : 0;

    const startTrial = setTimeout(() => {
      const history = historyRef.current;
      const num = generateNumber(history, nLevel);
      
      currentNumberRef.current = num;
      respondedRef.current = false;
      
      setCurrentNumber(num);
      setShowNumber(true);
      setResponded(false);
      setFeedback(null);

      // Display timer (1.2 seconds)
      timerRef.current = setTimeout(() => {
        setShowNumber(false);

        // Process response after display ends
        feedbackTimerRef.current = setTimeout(() => {
          const currentNum = currentNumberRef.current;
          const wasMatch = isMatch(currentNum, historyRef.current);
          
          if (!respondedRef.current) {
            // No response given
            if (!wasMatch) {
              // Correct rejection (didn't press for non-match)
              scoreRef.current.correctRejections += 1;
              setCorrectRejections(scoreRef.current.correctRejections);
            }
            // If it was a match and no response, that's a miss (no score change)
          }

          // Add to history
          historyRef.current = [...historyRef.current, currentNum];
          
          // Clear feedback and advance
          nextTrialTimerRef.current = setTimeout(() => {
            setFeedback(null);
            setTrial(t => t + 1);
          }, 400);
          
        }, 1000);
      }, 1200);
    }, startDelay);

    return () => {
      clearTimeout(startTrial);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      if (nextTrialTimerRef.current) clearTimeout(nextTrialTimerRef.current);
    };
  }, [trial, gameComplete, maxTrials, nLevel]);

  const handleResponse = () => {
    if (respondedRef.current || !showNumber || gameComplete) return;
    
    respondedRef.current = true;
    setResponded(true);

    const currentNum = currentNumberRef.current;
    const wasMatch = isMatch(currentNum, historyRef.current);

    if (wasMatch) {
      scoreRef.current.hits += 1;
      setHits(scoreRef.current.hits);
      setFeedback('hit');
    } else {
      setFeedback('false');
    }
  };

  const displayTrial = Math.min(trial + 1, maxTrials);
  const history = historyRef.current;

  return (
    <div className="bg-stone-900/80 border border-stone-700 rounded-xl p-6 max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">👻 Number Ghost</h3>
        <div className="text-base text-stone-300 mb-2">Trial {displayTrial}/{maxTrials}</div>
        <div className="text-lg font-bold text-amber-400 mb-2">{nLevel}-Back Task</div>
        <div className="text-sm text-stone-400 bg-stone-800/50 rounded-lg p-3">
          Press MATCH if the current number is the same as {nLevel} step{nLevel > 1 ? 's' : ''} ago
        </div>
      </div>

      <div className={`w-40 h-40 mx-auto rounded-2xl flex items-center justify-center mb-6 transition-all shadow-lg ${
        showNumber ? 'bg-gradient-to-br from-purple-600 to-blue-600 scale-105' : 'bg-stone-800'
      }`}>
        {showNumber && (
          <span className="text-7xl font-bold text-white animate-pulse">{currentNumber}</span>
        )}
        {feedback && !showNumber && (
          <span className={`text-4xl font-bold ${
            feedback === 'hit' ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {feedback === 'hit' && '✓ Correct!'}
            {feedback === 'false' && '✗ Wrong'}
          </span>
        )}
        {!showNumber && !feedback && (
          <span className="text-6xl opacity-20">?</span>
        )}
      </div>

      <button
        onClick={handleResponse}
        disabled={!showNumber || responded}
        className={`w-full h-14 rounded-xl text-xl font-bold transition-all shadow-lg ${
          !showNumber || responded
            ? 'bg-stone-700 text-stone-500 cursor-not-allowed'
            : 'bg-amber-500 hover:bg-amber-400 text-stone-900 active:scale-95 transform hover:shadow-xl'
        }`}
      >
        MATCH
      </button>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-stone-800/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-emerald-400">{hits}</div>
          <div className="text-xs text-stone-400 uppercase tracking-wide">Correct Matches</div>
        </div>
        <div className="bg-stone-800/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">{correctRejections}</div>
          <div className="text-xs text-stone-400 uppercase tracking-wide">Correct Rejections</div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="mt-4 text-center">
          <div className="text-xs text-stone-500 mb-2">Recent Numbers:</div>
          <div className="flex justify-center gap-2 flex-wrap">
            {history.slice(-5).map((num, i) => (
              <span key={i} className="text-sm text-stone-400 bg-stone-800 px-2 py-1 rounded">
                {num}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NumberGhost;
