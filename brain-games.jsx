import React, { useState, useEffect, useCallback, useRef } from 'react';

// ============================================
// BRAIN TRAINING MINIGAMES COLLECTION
// 7 Cognitive Training Games
// ============================================

// Shared Components
const GameWrapper = ({ children, title, onBack }) => (
  <div className="min-h-screen bg-slate-900 text-white p-4 flex flex-col">
    <div className="flex items-center justify-between mb-4">
      <button 
        onClick={onBack}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
      >
        ← Back
      </button>
      <h1 className="text-xl font-bold text-slate-200">{title}</h1>
      <div className="w-20"></div>
    </div>
    {children}
  </div>
);

const ResultsScreen = ({ score, stats, onRestart, onBack }) => (
  <div className="flex-1 flex flex-col items-center justify-center">
    <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center">
      <div className="text-6xl mb-4">🧠</div>
      <h2 className="text-2xl font-bold mb-2">Session Complete</h2>
      <div className="text-5xl font-bold text-emerald-400 mb-6">{score}</div>
      <div className="space-y-2 text-left bg-slate-700/50 rounded-lg p-4 mb-6">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="flex justify-between text-sm">
            <span className="text-slate-400">{key}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button 
          onClick={onBack}
          className="flex-1 py-3 bg-slate-600 hover:bg-slate-500 rounded-lg font-medium transition-colors"
        >
          Menu
        </button>
        <button 
          onClick={onRestart}
          className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  </div>
);

// ============================================
// GAME 1: ECHO TAP
// Visuospatial Working Memory
// ============================================
const EchoTap = ({ onBack }) => {
  const [phase, setPhase] = useState('ready'); // ready, showing, waiting, input, feedback, results
  const [sequence, setSequence] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [activeCell, setActiveCell] = useState(null);
  const [level, setLevel] = useState(3);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [maxLevel, setMaxLevel] = useState(3);
  const [correctRounds, setCorrectRounds] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [inputStartTime, setInputStartTime] = useState(null);
  const maxRounds = 10;

  const generateSequence = useCallback((len) => {
    const seq = [];
    for (let i = 0; i < len; i++) {
      let next;
      do {
        next = Math.floor(Math.random() * 9);
      } while (seq.length > 0 && seq[seq.length - 1] === next);
      seq.push(next);
    }
    return seq;
  }, []);

  const startRound = useCallback(() => {
    const seq = generateSequence(level);
    setSequence(seq);
    setPlayerInput([]);
    setPhase('showing');
    setActiveCell(null);
    
    let i = 0;
    const showInterval = setInterval(() => {
      if (i < seq.length) {
        setActiveCell(seq[i]);
        setTimeout(() => setActiveCell(null), 400);
        i++;
      } else {
        clearInterval(showInterval);
        setTimeout(() => {
          setPhase('waiting');
          setTimeout(() => {
            setPhase('input');
            setInputStartTime(Date.now());
          }, 1500);
        }, 500);
      }
    }, 600);
  }, [level, generateSequence]);

  const handleCellClick = (index) => {
    if (phase !== 'input') return;
    
    const newInput = [...playerInput, index];
    setPlayerInput(newInput);
    setActiveCell(index);
    setTimeout(() => setActiveCell(null), 150);

    if (newInput.length === sequence.length) {
      const rt = Date.now() - inputStartTime;
      setReactionTimes(prev => [...prev, rt]);
      
      const correct = newInput.every((val, i) => val === sequence[i]);
      setTotalRounds(prev => prev + 1);
      
      if (correct) {
        setScore(prev => prev + level * 10);
        setCorrectRounds(prev => prev + 1);
        setMaxLevel(prev => Math.max(prev, level));
        setLevel(prev => Math.min(prev + 1, 9));
      } else {
        setLevel(prev => Math.max(prev - 1, 2));
      }
      
      setPhase('feedback');
      setTimeout(() => {
        if (round + 1 >= maxRounds) {
          setPhase('results');
        } else {
          setRound(prev => prev + 1);
          startRound();
        }
      }, 1000);
    }
  };

  useEffect(() => {
    if (phase === 'ready') {
      setTimeout(() => startRound(), 1000);
    }
  }, [phase, startRound]);

  const restart = () => {
    setPhase('ready');
    setSequence([]);
    setPlayerInput([]);
    setLevel(3);
    setRound(0);
    setScore(0);
    setMaxLevel(3);
    setCorrectRounds(0);
    setTotalRounds(0);
    setReactionTimes([]);
  };

  if (phase === 'results') {
    const avgRT = reactionTimes.length > 0 
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;
    return (
      <GameWrapper title="Echo Tap" onBack={onBack}>
        <ResultsScreen
          score={score}
          stats={{
            'Max Sequence': `${maxLevel} tiles`,
            'Accuracy': `${Math.round((correctRounds / totalRounds) * 100)}%`,
            'Avg Response Time': `${avgRT}ms`,
            'Rounds Completed': totalRounds
          }}
          onRestart={restart}
          onBack={onBack}
        />
      </GameWrapper>
    );
  }

  return (
    <GameWrapper title="Echo Tap" onBack={onBack}>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-6 text-center">
          <div className="text-sm text-slate-400 mb-1">Round {round + 1}/{maxRounds}</div>
          <div className="text-lg font-medium">
            {phase === 'showing' && 'Watch the sequence...'}
            {phase === 'waiting' && 'Get ready...'}
            {phase === 'input' && `Tap ${sequence.length} tiles in order`}
            {phase === 'feedback' && (playerInput.every((v, i) => v === sequence[i]) ? '✓ Correct!' : '✗ Wrong')}
            {phase === 'ready' && 'Starting...'}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[...Array(9)].map((_, i) => (
            <button
              key={i}
              onClick={() => handleCellClick(i)}
              disabled={phase !== 'input'}
              className={`w-20 h-20 rounded-xl transition-all duration-150 ${
                activeCell === i
                  ? 'bg-cyan-400 scale-105 shadow-lg shadow-cyan-400/50'
                  : phase === 'input'
                    ? 'bg-slate-700 hover:bg-slate-600 cursor-pointer'
                    : 'bg-slate-700/50'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-emerald-400">{score}</div>
            <div className="text-xs text-slate-500">Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-400">{level}</div>
            <div className="text-xs text-slate-500">Level</div>
          </div>
        </div>
      </div>
    </GameWrapper>
  );
};

// ============================================
// GAME 2: NUMBER GHOST (N-Back)
// Working Memory Updating
// ============================================
const NumberGhost = ({ onBack }) => {
  const [phase, setPhase] = useState('ready');
  const [nLevel, setNLevel] = useState(1);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [history, setHistory] = useState([]);
  const [trial, setTrial] = useState(0);
  const [showNumber, setShowNumber] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const [correctRejections, setCorrectRejections] = useState(0);
  const [responded, setResponded] = useState(false);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [stimulusTime, setStimulusTime] = useState(null);
  const maxTrials = 25;
  const timerRef = useRef(null);

  const generateNumber = useCallback((hist, n) => {
    const shouldMatch = hist.length >= n && Math.random() < 0.35;
    if (shouldMatch) {
      return hist[hist.length - n];
    }
    let num;
    do {
      num = Math.floor(Math.random() * 9) + 1;
    } while (hist.length >= n && num === hist[hist.length - n]);
    return num;
  }, []);

  const isMatch = useCallback(() => {
    return history.length >= nLevel && currentNumber === history[history.length - nLevel];
  }, [history, currentNumber, nLevel]);

  const runTrial = useCallback(() => {
    if (trial >= maxTrials) {
      setPhase('results');
      return;
    }

    const num = generateNumber(history, nLevel);
    setCurrentNumber(num);
    setShowNumber(true);
    setResponded(false);
    setFeedback(null);
    setStimulusTime(Date.now());

    timerRef.current = setTimeout(() => {
      setShowNumber(false);
      
      setTimeout(() => {
        if (!responded) {
          const wasMatch = history.length >= nLevel && num === history[history.length - nLevel];
          if (wasMatch) {
            setMisses(prev => prev + 1);
            setFeedback('miss');
          } else {
            setCorrectRejections(prev => prev + 1);
            setFeedback('correct');
          }
        }
        
        setHistory(prev => [...prev, num]);
        setTrial(prev => prev + 1);
        
        setTimeout(() => {
          setFeedback(null);
          runTrial();
        }, 800);
      }, 1500);
    }, 800);
  }, [trial, history, nLevel, generateNumber, responded]);

  const handleResponse = () => {
    if (responded || !showNumber) return;
    setResponded(true);
    
    const rt = Date.now() - stimulusTime;
    setReactionTimes(prev => [...prev, rt]);

    if (isMatch()) {
      setHits(prev => prev + 1);
      setFeedback('hit');
    } else {
      setFalseAlarms(prev => prev + 1);
      setFeedback('false');
    }
  };

  useEffect(() => {
    if (phase === 'ready') {
      setTimeout(() => {
        setPhase('playing');
        runTrial();
      }, 1500);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === 'playing' && trial > 0 && trial < maxTrials) {
      const accuracy = (hits + correctRejections) / trial;
      if (trial % 8 === 0 && accuracy > 0.85 && nLevel < 3) {
        setNLevel(prev => prev + 1);
      }
    }
  }, [trial, hits, correctRejections, nLevel, phase]);

  const restart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase('ready');
    setNLevel(1);
    setCurrentNumber(null);
    setHistory([]);
    setTrial(0);
    setShowNumber(false);
    setFeedback(null);
    setHits(0);
    setMisses(0);
    setFalseAlarms(0);
    setCorrectRejections(0);
    setResponded(false);
    setReactionTimes([]);
  };

  if (phase === 'results') {
    const totalResponses = hits + misses + falseAlarms + correctRejections;
    const accuracy = totalResponses > 0 ? Math.round(((hits + correctRejections) / totalResponses) * 100) : 0;
    const avgRT = reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;
    const dPrime = (hits / (hits + misses || 1)) - (falseAlarms / (falseAlarms + correctRejections || 1));
    
    return (
      <GameWrapper title="Number Ghost" onBack={onBack}>
        <ResultsScreen
          score={Math.round(accuracy * nLevel)}
          stats={{
            'N-Level Reached': `${nLevel}-back`,
            'Accuracy': `${accuracy}%`,
            'Hits': hits,
            'False Alarms': falseAlarms,
            'Avg RT': `${avgRT}ms`,
            'd-Prime': dPrime.toFixed(2)
          }}
          onRestart={restart}
          onBack={onBack}
        />
      </GameWrapper>
    );
  }

  return (
    <GameWrapper title="Number Ghost" onBack={onBack}>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-4 text-center">
          <div className="text-sm text-slate-400 mb-1">Trial {trial + 1}/{maxTrials}</div>
          <div className="text-lg font-medium text-amber-400">{nLevel}-Back</div>
          <div className="text-xs text-slate-500 mt-1">
            Press if number matches {nLevel} step{nLevel > 1 ? 's' : ''} ago
          </div>
        </div>

        <div className={`w-40 h-40 rounded-2xl flex items-center justify-center mb-8 transition-all duration-200 ${
          showNumber ? 'bg-slate-700' : 'bg-slate-800'
        }`}>
          {showNumber && (
            <span className="text-7xl font-bold text-white">{currentNumber}</span>
          )}
          {feedback && !showNumber && (
            <span className={`text-4xl ${
              feedback === 'hit' || feedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {feedback === 'hit' && '✓ Hit!'}
              {feedback === 'correct' && '✓'}
              {feedback === 'false' && '✗ False'}
              {feedback === 'miss' && '✗ Miss'}
            </span>
          )}
        </div>

        <button
          onClick={handleResponse}
          disabled={!showNumber || responded}
          className={`w-48 h-16 rounded-xl text-xl font-bold transition-all ${
            !showNumber || responded
              ? 'bg-slate-700 text-slate-500'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-900 active:scale-95'
          }`}
        >
          MATCH
        </button>

        <div className="mt-6 flex gap-8 text-center">
          <div>
            <div className="text-xl font-bold text-emerald-400">{hits}</div>
            <div className="text-xs text-slate-500">Hits</div>
          </div>
          <div>
            <div className="text-xl font-bold text-rose-400">{falseAlarms}</div>
            <div className="text-xs text-slate-500">False Alarms</div>
          </div>
        </div>
      </div>
    </GameWrapper>
  );
};

// ============================================
// GAME 3: TAP UNLESS
// Response Inhibition (Go/No-Go)
// ============================================
const TapUnless = ({ onBack }) => {
  const [phase, setPhase] = useState('ready');
  const [shape, setShape] = useState(null);
  const [isRed, setIsRed] = useState(false);
  const [trial, setTrial] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [responded, setResponded] = useState(false);
  const [correctGo, setCorrectGo] = useState(0);
  const [correctNoGo, setCorrectNoGo] = useState(0);
  const [commissionErrors, setCommissionErrors] = useState(0);
  const [omissionErrors, setOmissionErrors] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [stimulusTime, setStimulusTime] = useState(null);
  const maxTrials = 30;
  const timerRef = useRef(null);

  const shapes = ['circle', 'square', 'triangle', 'diamond'];
  const colors = ['#22d3ee', '#a78bfa', '#4ade80', '#fbbf24'];

  const runTrial = useCallback(() => {
    if (trial >= maxTrials) {
      setPhase('results');
      return;
    }

    const redProbability = 0.25 + (trial / maxTrials) * 0.1;
    const shouldBeRed = Math.random() < redProbability;
    const shapeIndex = Math.floor(Math.random() * shapes.length);

    setShape(shapes[shapeIndex]);
    setIsRed(shouldBeRed);
    setResponded(false);
    setFeedback(null);
    setStimulusTime(Date.now());

    timerRef.current = setTimeout(() => {
      if (!responded) {
        if (shouldBeRed) {
          setCorrectNoGo(prev => prev + 1);
          setFeedback('correct');
        } else {
          setOmissionErrors(prev => prev + 1);
          setFeedback('omission');
        }
      }
      
      setTimeout(() => {
        setShape(null);
        setFeedback(null);
        setTrial(prev => prev + 1);
        setTimeout(runTrial, 300);
      }, 600);
    }, 800);
  }, [trial, responded]);

  const handleTap = () => {
    if (responded || !shape) return;
    setResponded(true);
    
    const rt = Date.now() - stimulusTime;
    
    if (isRed) {
      setCommissionErrors(prev => prev + 1);
      setFeedback('commission');
    } else {
      setCorrectGo(prev => prev + 1);
      setReactionTimes(prev => [...prev, rt]);
      setFeedback('correct');
    }
  };

  useEffect(() => {
    if (phase === 'ready') {
      setTimeout(() => {
        setPhase('playing');
        runTrial();
      }, 1500);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase]);

  const restart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase('ready');
    setShape(null);
    setIsRed(false);
    setTrial(0);
    setFeedback(null);
    setResponded(false);
    setCorrectGo(0);
    setCorrectNoGo(0);
    setCommissionErrors(0);
    setOmissionErrors(0);
    setReactionTimes([]);
  };

  const renderShape = () => {
    const color = isRed ? '#ef4444' : colors[shapes.indexOf(shape)];
    const size = 80;
    
    switch (shape) {
      case 'circle':
        return <div className="w-20 h-20 rounded-full" style={{ backgroundColor: color }} />;
      case 'square':
        return <div className="w-20 h-20 rounded-lg" style={{ backgroundColor: color }} />;
      case 'triangle':
        return (
          <div 
            className="w-0 h-0"
            style={{
              borderLeft: '40px solid transparent',
              borderRight: '40px solid transparent',
              borderBottom: `70px solid ${color}`
            }}
          />
        );
      case 'diamond':
        return (
          <div 
            className="w-14 h-14 rotate-45 rounded-sm"
            style={{ backgroundColor: color }}
          />
        );
      default:
        return null;
    }
  };

  if (phase === 'results') {
    const totalGo = correctGo + omissionErrors;
    const totalNoGo = correctNoGo + commissionErrors;
    const avgRT = reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;
    const accuracy = Math.round(((correctGo + correctNoGo) / maxTrials) * 100);
    
    return (
      <GameWrapper title="Tap Unless" onBack={onBack}>
        <ResultsScreen
          score={accuracy}
          stats={{
            'Accuracy': `${accuracy}%`,
            'Go Accuracy': `${Math.round((correctGo / totalGo) * 100)}%`,
            'No-Go Accuracy': `${Math.round((correctNoGo / totalNoGo) * 100)}%`,
            'Commission Errors': commissionErrors,
            'Omission Errors': omissionErrors,
            'Avg Go RT': `${avgRT}ms`
          }}
          onRestart={restart}
          onBack={onBack}
        />
      </GameWrapper>
    );
  }

  return (
    <GameWrapper title="Tap Unless" onBack={onBack}>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-4 text-center">
          <div className="text-sm text-slate-400 mb-1">Trial {trial + 1}/{maxTrials}</div>
          <div className="text-lg font-medium">Tap fast — unless it's <span className="text-rose-400">RED</span></div>
        </div>

        <div 
          onClick={handleTap}
          className={`w-48 h-48 rounded-2xl flex items-center justify-center mb-6 transition-all cursor-pointer active:scale-95 ${
            shape ? 'bg-slate-700' : 'bg-slate-800'
          }`}
        >
          {shape && renderShape()}
          {feedback && !shape && (
            <span className={`text-3xl font-bold ${
              feedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {feedback === 'correct' && '✓'}
              {feedback === 'commission' && '✗ Don\'t tap red!'}
              {feedback === 'omission' && '✗ Too slow!'}
            </span>
          )}
        </div>

        <div className="text-sm text-slate-400 mb-6">Tap anywhere when shape appears</div>

        <div className="flex gap-8 text-center">
          <div>
            <div className="text-xl font-bold text-emerald-400">{correctGo + correctNoGo}</div>
            <div className="text-xs text-slate-500">Correct</div>
          </div>
          <div>
            <div className="text-xl font-bold text-rose-400">{commissionErrors + omissionErrors}</div>
            <div className="text-xs text-slate-500">Errors</div>
          </div>
        </div>
      </div>
    </GameWrapper>
  );
};

// ============================================
// GAME 4: RULE FLIP
// Cognitive Flexibility (Task Switching)
// ============================================
const RuleFlip = ({ onBack }) => {
  const [phase, setPhase] = useState('ready');
  const [rule, setRule] = useState('color'); // color or shape
  const [currentCard, setCurrentCard] = useState(null);
  const [options, setOptions] = useState([]);
  const [trial, setTrial] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [switchCosts, setSwitchCosts] = useState([]);
  const [nonSwitchRTs, setNonSwitchRTs] = useState([]);
  const [switchRTs, setSwitchRTs] = useState([]);
  const [lastRule, setLastRule] = useState(null);
  const [stimulusTime, setStimulusTime] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const maxTrials = 20;

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
    setStimulusTime(Date.now());
  }, [rule]);

  const renderShape = (shape, color, size = 60) => {
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
    if (feedback) return;
    
    const rt = Date.now() - stimulusTime;
    const chosen = options[optionIndex];
    const isCorrect = rule === 'color' 
      ? chosen.color === currentCard.color
      : chosen.shape === currentCard.shape;
    
    const switched = lastRule !== null && lastRule !== rule;
    
    if (switched) {
      setSwitchRTs(prev => [...prev, rt]);
    } else if (lastRule !== null) {
      setNonSwitchRTs(prev => [...prev, rt]);
    }

    if (isCorrect) {
      setScore(prev => prev + (switched ? 15 : 10));
      setCorrect(prev => prev + 1);
      setFeedback('correct');
    } else {
      setIncorrect(prev => prev + 1);
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
      if (trial + 1 >= maxTrials) {
        setPhase('results');
      } else {
        setTrial(prev => prev + 1);
        generateTrial();
      }
    }, 800);
  };

  useEffect(() => {
    if (phase === 'ready') {
      setTimeout(() => {
        setPhase('playing');
        generateTrial();
      }, 1500);
    }
  }, [phase]);

  const restart = () => {
    setPhase('ready');
    setRule('color');
    setCurrentCard(null);
    setOptions([]);
    setTrial(0);
    setFeedback(null);
    setScore(0);
    setSwitchCosts([]);
    setNonSwitchRTs([]);
    setSwitchRTs([]);
    setLastRule(null);
    setCorrect(0);
    setIncorrect(0);
  };

  if (phase === 'results') {
    const avgSwitch = switchRTs.length > 0
      ? Math.round(switchRTs.reduce((a, b) => a + b, 0) / switchRTs.length)
      : 0;
    const avgNonSwitch = nonSwitchRTs.length > 0
      ? Math.round(nonSwitchRTs.reduce((a, b) => a + b, 0) / nonSwitchRTs.length)
      : 0;
    const switchCost = avgSwitch - avgNonSwitch;
    
    return (
      <GameWrapper title="Rule Flip" onBack={onBack}>
        <ResultsScreen
          score={score}
          stats={{
            'Accuracy': `${Math.round((correct / maxTrials) * 100)}%`,
            'Switch Cost': `${switchCost}ms`,
            'Avg Switch RT': `${avgSwitch}ms`,
            'Avg Non-Switch RT': `${avgNonSwitch}ms`,
            'Total Correct': correct
          }}
          onRestart={restart}
          onBack={onBack}
        />
      </GameWrapper>
    );
  }

  return (
    <GameWrapper title="Rule Flip" onBack={onBack}>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-4 text-center">
          <div className="text-sm text-slate-400 mb-1">Trial {trial + 1}/{maxTrials}</div>
          <div className={`text-xl font-bold px-4 py-2 rounded-lg ${
            rule === 'color' ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-white' : 'bg-slate-600'
          }`}>
            Match by {rule.toUpperCase()}
          </div>
        </div>

        {currentCard && (
          <>
            <div className="w-28 h-28 bg-slate-700 rounded-2xl flex items-center justify-center mb-8">
              {renderShape(currentCard.shape, currentCard.color, 70)}
            </div>

            <div className="flex gap-6 mb-6">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(i)}
                  disabled={!!feedback}
                  className={`w-24 h-24 rounded-xl flex items-center justify-center transition-all ${
                    feedback
                      ? 'bg-slate-700'
                      : 'bg-slate-700 hover:bg-slate-600 active:scale-95'
                  }`}
                >
                  {renderShape(opt.shape, opt.color, 50)}
                </button>
              ))}
            </div>
          </>
        )}

        {feedback && (
          <div className={`text-2xl font-bold ${
            feedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {feedback === 'correct' ? '✓ Correct!' : '✗ Wrong!'}
          </div>
        )}

        <div className="mt-4 flex gap-8 text-center">
          <div>
            <div className="text-xl font-bold text-emerald-400">{score}</div>
            <div className="text-xs text-slate-500">Score</div>
          </div>
          <div>
            <div className="text-xl font-bold text-cyan-400">{correct}</div>
            <div className="text-xs text-slate-500">Correct</div>
          </div>
        </div>
      </div>
    </GameWrapper>
  );
};

// ============================================
// GAME 5: SAME OR DIFFERENT
// Processing Speed
// ============================================
const SameOrDifferent = ({ onBack }) => {
  const [phase, setPhase] = useState('ready');
  const [symbols, setSymbols] = useState([null, null]);
  const [isSame, setIsSame] = useState(false);
  const [trial, setTrial] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [stimulusTime, setStimulusTime] = useState(null);
  const [displayTime, setDisplayTime] = useState(500);
  const [showSymbols, setShowSymbols] = useState(false);
  const maxTrials = 40;
  const timerRef = useRef(null);

  const symbolSet = ['◆', '●', '▲', '■', '★', '◗', '⬡', '⬢', '✦', '○', '□', '△'];

  const runTrial = useCallback(() => {
    if (trial >= maxTrials) {
      setPhase('results');
      return;
    }

    const same = Math.random() < 0.5;
    const sym1 = symbolSet[Math.floor(Math.random() * symbolSet.length)];
    const sym2 = same ? sym1 : symbolSet.filter(s => s !== sym1)[Math.floor(Math.random() * (symbolSet.length - 1))];

    setSymbols([sym1, sym2]);
    setIsSame(same);
    setShowSymbols(true);
    setStimulusTime(Date.now());
    setFeedback(null);

    timerRef.current = setTimeout(() => {
      setShowSymbols(false);
    }, displayTime);
  }, [trial, displayTime]);

  const handleResponse = (response) => {
    if (feedback || !showSymbols) return;
    
    const rt = Date.now() - stimulusTime;
    const isCorrect = (response === 'same') === isSame;

    setReactionTimes(prev => [...prev, rt]);
    
    if (isCorrect) {
      setCorrect(prev => prev + 1);
      setFeedback('correct');
    } else {
      setIncorrect(prev => prev + 1);
      setFeedback('incorrect');
    }

    setShowSymbols(false);

    // Adjust difficulty
    if (trial > 0 && trial % 10 === 0) {
      const recentAccuracy = correct / trial;
      if (recentAccuracy > 0.85 && displayTime > 200) {
        setDisplayTime(prev => Math.max(prev - 100, 150));
      }
    }

    setTimeout(() => {
      setFeedback(null);
      setTrial(prev => prev + 1);
      runTrial();
    }, 500);
  };

  useEffect(() => {
    if (phase === 'ready') {
      setTimeout(() => {
        setPhase('playing');
        runTrial();
      }, 1500);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase]);

  const restart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase('ready');
    setSymbols([null, null]);
    setIsSame(false);
    setTrial(0);
    setFeedback(null);
    setCorrect(0);
    setIncorrect(0);
    setReactionTimes([]);
    setDisplayTime(500);
    setShowSymbols(false);
  };

  if (phase === 'results') {
    const avgRT = reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;
    const accuracy = Math.round((correct / maxTrials) * 100);
    const throughput = Math.round((correct / (reactionTimes.reduce((a, b) => a + b, 0) / 1000)) * 60);
    
    return (
      <GameWrapper title="Same or Different" onBack={onBack}>
        <ResultsScreen
          score={Math.round(accuracy * (500 / avgRT))}
          stats={{
            'Accuracy': `${accuracy}%`,
            'Avg RT': `${avgRT}ms`,
            'Throughput': `${throughput}/min`,
            'Final Speed': `${displayTime}ms`,
            'Total Correct': correct
          }}
          onRestart={restart}
          onBack={onBack}
        />
      </GameWrapper>
    );
  }

  return (
    <GameWrapper title="Same or Different" onBack={onBack}>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-4 text-center">
          <div className="text-sm text-slate-400 mb-1">Trial {trial + 1}/{maxTrials}</div>
          <div className="text-lg font-medium">Same or Different?</div>
          <div className="text-xs text-slate-500">Display: {displayTime}ms</div>
        </div>

        <div className="flex gap-8 mb-8">
          <div className={`w-24 h-24 rounded-xl flex items-center justify-center text-5xl transition-all ${
            showSymbols ? 'bg-slate-700' : 'bg-slate-800'
          }`}>
            {showSymbols && <span className="text-cyan-400">{symbols[0]}</span>}
          </div>
          <div className={`w-24 h-24 rounded-xl flex items-center justify-center text-5xl transition-all ${
            showSymbols ? 'bg-slate-700' : 'bg-slate-800'
          }`}>
            {showSymbols && <span className="text-amber-400">{symbols[1]}</span>}
          </div>
        </div>

        {feedback && (
          <div className={`text-2xl font-bold mb-4 ${
            feedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {feedback === 'correct' ? '✓' : '✗'}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => handleResponse('same')}
            disabled={!showSymbols || !!feedback}
            className={`w-32 h-14 rounded-xl font-bold text-lg transition-all ${
              !showSymbols || feedback
                ? 'bg-slate-700 text-slate-500'
                : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95'
            }`}
          >
            SAME
          </button>
          <button
            onClick={() => handleResponse('different')}
            disabled={!showSymbols || !!feedback}
            className={`w-32 h-14 rounded-xl font-bold text-lg transition-all ${
              !showSymbols || feedback
                ? 'bg-slate-700 text-slate-500'
                : 'bg-rose-600 hover:bg-rose-500 active:scale-95'
            }`}
          >
            DIFF
          </button>
        </div>

        <div className="mt-6 flex gap-8 text-center">
          <div>
            <div className="text-xl font-bold text-emerald-400">{correct}</div>
            <div className="text-xs text-slate-500">Correct</div>
          </div>
          <div>
            <div className="text-xl font-bold text-rose-400">{incorrect}</div>
            <div className="text-xs text-slate-500">Wrong</div>
          </div>
        </div>
      </div>
    </GameWrapper>
  );
};

// ============================================
// GAME 6: BALANCE POINT
// Problem Solving / Mental Arithmetic
// ============================================
const BalancePoint = ({ onBack }) => {
  const [phase, setPhase] = useState('ready');
  const [puzzle, setPuzzle] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [trial, setTrial] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [times, setTimes] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const maxTrials = 8;

  const generatePuzzle = useCallback(() => {
    // Generate left side weights
    const leftCount = Math.min(2 + Math.floor(trial / 3), 4);
    const leftWeights = [];
    let leftTotal = 0;
    
    for (let i = 0; i < leftCount; i++) {
      const pos = -(i + 1);
      const val = Math.floor(Math.random() * 5) + 1;
      leftWeights.push({ position: pos, value: val });
      leftTotal += val * Math.abs(pos);
    }

    // Generate right side with one movable weight
    const rightCount = Math.max(1, leftCount - 1);
    const rightWeights = [];
    let rightTotal = 0;
    
    for (let i = 0; i < rightCount; i++) {
      const pos = i + 1;
      const val = Math.floor(Math.random() * 4) + 1;
      rightWeights.push({ position: pos, value: val, fixed: true });
      rightTotal += val * pos;
    }

    // Calculate the movable weight
    const deficit = leftTotal - rightTotal;
    const possiblePositions = [1, 2, 3, 4].filter(p => 
      !rightWeights.some(w => w.position === p)
    );
    
    // Find a valid position/value combination
    let movableWeight = null;
    for (const pos of possiblePositions) {
      if (deficit % pos === 0 && deficit / pos >= 1 && deficit / pos <= 9) {
        movableWeight = { position: null, value: deficit / pos, fixed: false };
        break;
      }
    }

    if (!movableWeight) {
      // Fallback: create a simpler puzzle
      const simpleVal = Math.floor(Math.random() * 4) + 2;
      const simplePos = possiblePositions[0];
      movableWeight = { position: null, value: simpleVal, fixed: false };
      // Adjust left side
      leftWeights[0].value = (rightTotal + simpleVal * simplePos) / Math.abs(leftWeights[0].position);
      if (!Number.isInteger(leftWeights[0].value)) {
        leftWeights[0].value = Math.ceil(leftWeights[0].value);
      }
    }

    setPuzzle({
      leftWeights,
      rightWeights: [...rightWeights, movableWeight],
      slots: possiblePositions
    });
    setSelectedWeight(null);
    setStartTime(Date.now());
  }, [trial]);

  const calculateBalance = (weights) => {
    return weights.reduce((sum, w) => {
      if (w.position === null) return sum;
      return sum + (w.value * w.position);
    }, 0);
  };

  const handleSlotClick = (slotPosition) => {
    if (feedback || !puzzle) return;

    const movableIndex = puzzle.rightWeights.findIndex(w => !w.fixed);
    if (movableIndex === -1) return;

    const newRightWeights = [...puzzle.rightWeights];
    newRightWeights[movableIndex] = {
      ...newRightWeights[movableIndex],
      position: slotPosition
    };

    const leftBalance = calculateBalance(puzzle.leftWeights);
    const rightBalance = calculateBalance(newRightWeights);

    const isBalanced = Math.abs(leftBalance + rightBalance) < 0.01;
    const time = Date.now() - startTime;
    setTimes(prev => [...prev, time]);

    if (isBalanced) {
      setScore(prev => prev + Math.max(100 - Math.floor(time / 100), 10));
      setCorrect(prev => prev + 1);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }

    setPuzzle({ ...puzzle, rightWeights: newRightWeights });

    setTimeout(() => {
      setFeedback(null);
      if (trial + 1 >= maxTrials) {
        setPhase('results');
      } else {
        setTrial(prev => prev + 1);
        generatePuzzle();
      }
    }, 1200);
  };

  useEffect(() => {
    if (phase === 'ready') {
      setTimeout(() => {
        setPhase('playing');
        generatePuzzle();
      }, 1000);
    }
  }, [phase]);

  const restart = () => {
    setPhase('ready');
    setPuzzle(null);
    setSelectedWeight(null);
    setTrial(0);
    setFeedback(null);
    setScore(0);
    setCorrect(0);
    setTimes([]);
  };

  if (phase === 'results') {
    const avgTime = times.length > 0
      ? Math.round(times.reduce((a, b) => a + b, 0) / times.length / 1000 * 10) / 10
      : 0;
    
    return (
      <GameWrapper title="Balance Point" onBack={onBack}>
        <ResultsScreen
          score={score}
          stats={{
            'Accuracy': `${Math.round((correct / maxTrials) * 100)}%`,
            'Avg Time': `${avgTime}s`,
            'Puzzles Solved': correct,
            'Total Puzzles': maxTrials
          }}
          onRestart={restart}
          onBack={onBack}
        />
      </GameWrapper>
    );
  }

  const movableWeight = puzzle?.rightWeights.find(w => !w.fixed);

  return (
    <GameWrapper title="Balance Point" onBack={onBack}>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-4 text-center">
          <div className="text-sm text-slate-400 mb-1">Puzzle {trial + 1}/{maxTrials}</div>
          <div className="text-lg font-medium">Place the weight to balance</div>
        </div>

        {puzzle && (
          <div className="relative w-full max-w-md">
            {/* Fulcrum */}
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-l-transparent border-r-transparent border-b-slate-500" />
            
            {/* Beam */}
            <div className={`relative h-4 bg-slate-600 rounded-full mb-8 transition-transform duration-300 ${
              feedback === 'correct' ? 'rotate-0' : 
              feedback === 'incorrect' ? 'rotate-3' : 'rotate-0'
            }`}>
              {/* Left weights */}
              {puzzle.leftWeights.map((w, i) => (
                <div
                  key={`left-${i}`}
                  className="absolute -top-12 flex flex-col items-center"
                  style={{ left: `${50 + w.position * 10}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-slate-900">
                    {w.value}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{w.position}</div>
                </div>
              ))}

              {/* Right weights (fixed) */}
              {puzzle.rightWeights.filter(w => w.fixed && w.position).map((w, i) => (
                <div
                  key={`right-${i}`}
                  className="absolute -top-12 flex flex-col items-center"
                  style={{ left: `${50 + w.position * 10}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-slate-900">
                    {w.value}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">+{w.position}</div>
                </div>
              ))}

              {/* Placed movable weight */}
              {movableWeight?.position && (
                <div
                  className="absolute -top-12 flex flex-col items-center"
                  style={{ left: `${50 + movableWeight.position * 10}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-slate-900">
                    {movableWeight.value}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">+{movableWeight.position}</div>
                </div>
              )}

              {/* Slots */}
              {!movableWeight?.position && puzzle.slots.map(pos => (
                <button
                  key={`slot-${pos}`}
                  onClick={() => handleSlotClick(pos)}
                  className="absolute -top-12 w-10 h-10 border-2 border-dashed border-slate-500 rounded-lg hover:border-emerald-400 hover:bg-emerald-400/10 transition-colors"
                  style={{ left: `${50 + pos * 10}%`, transform: 'translateX(-50%)' }}
                />
              ))}
            </div>

            {/* Movable weight indicator */}
            {!movableWeight?.position && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg">
                  <span className="text-sm text-slate-400">Place:</span>
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-slate-900">
                    {movableWeight?.value}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {feedback && (
          <div className={`mt-8 text-2xl font-bold ${
            feedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {feedback === 'correct' ? '✓ Balanced!' : '✗ Not balanced'}
          </div>
        )}

        <div className="mt-6 flex gap-8 text-center">
          <div>
            <div className="text-xl font-bold text-emerald-400">{score}</div>
            <div className="text-xs text-slate-500">Score</div>
          </div>
          <div>
            <div className="text-xl font-bold text-cyan-400">{correct}/{trial}</div>
            <div className="text-xs text-slate-500">Solved</div>
          </div>
        </div>
      </div>
    </GameWrapper>
  );
};

// ============================================
// GAME 7: MIRROR MATCH
// Spatial Reasoning
// ============================================
const MirrorMatch = ({ onBack }) => {
  const [phase, setPhase] = useState('ready');
  const [leftGrid, setLeftGrid] = useState([]);
  const [rightGrid, setRightGrid] = useState([]);
  const [isMirror, setIsMirror] = useState(false);
  const [trial, setTrial] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [stimulusTime, setStimulusTime] = useState(null);
  const [gridSize, setGridSize] = useState(3);
  const maxTrials = 20;

  const generateGrids = useCallback(() => {
    const size = gridSize;
    const fillCount = Math.floor(size * size * 0.4);
    
    // Generate left grid
    const left = Array(size * size).fill(false);
    const indices = [];
    while (indices.length < fillCount) {
      const idx = Math.floor(Math.random() * size * size);
      if (!indices.includes(idx)) {
        indices.push(idx);
        left[idx] = true;
      }
    }

    // Generate right grid (mirror or not)
    const shouldMirror = Math.random() < 0.5;
    let right;
    
    if (shouldMirror) {
      // Create perfect mirror
      right = Array(size * size).fill(false);
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const leftIdx = row * size + col;
          const rightIdx = row * size + (size - 1 - col);
          right[rightIdx] = left[leftIdx];
        }
      }
    } else {
      // Create mirror with one difference
      right = Array(size * size).fill(false);
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const leftIdx = row * size + col;
          const rightIdx = row * size + (size - 1 - col);
          right[rightIdx] = left[leftIdx];
        }
      }
      // Flip one random cell
      const flipIdx = Math.floor(Math.random() * size * size);
      right[flipIdx] = !right[flipIdx];
    }

    setLeftGrid(left);
    setRightGrid(right);
    setIsMirror(shouldMirror);
    setStimulusTime(Date.now());
  }, [gridSize]);

  const handleResponse = (response) => {
    if (feedback) return;
    
    const rt = Date.now() - stimulusTime;
    const isCorrect = (response === 'yes') === isMirror;

    setReactionTimes(prev => [...prev, rt]);
    
    if (isCorrect) {
      setCorrect(prev => prev + 1);
      setFeedback('correct');
    } else {
      setIncorrect(prev => prev + 1);
      setFeedback('incorrect');
    }

    // Increase difficulty
    if (trial > 0 && trial % 6 === 0 && correct / trial > 0.8) {
      setGridSize(prev => Math.min(prev + 1, 5));
    }

    setTimeout(() => {
      setFeedback(null);
      if (trial + 1 >= maxTrials) {
        setPhase('results');
      } else {
        setTrial(prev => prev + 1);
        generateGrids();
      }
    }, 800);
  };

  useEffect(() => {
    if (phase === 'ready') {
      setTimeout(() => {
        setPhase('playing');
        generateGrids();
      }, 1000);
    }
  }, [phase]);

  const restart = () => {
    setPhase('ready');
    setLeftGrid([]);
    setRightGrid([]);
    setIsMirror(false);
    setTrial(0);
    setFeedback(null);
    setCorrect(0);
    setIncorrect(0);
    setReactionTimes([]);
    setGridSize(3);
  };

  if (phase === 'results') {
    const avgRT = reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;
    const accuracy = Math.round((correct / maxTrials) * 100);
    const dPrime = ((correct / (correct + incorrect || 1)) - 0.5) * 2;
    
    return (
      <GameWrapper title="Mirror Match" onBack={onBack}>
        <ResultsScreen
          score={Math.round(accuracy * (1000 / avgRT) * gridSize)}
          stats={{
            'Accuracy': `${accuracy}%`,
            'Avg RT': `${avgRT}ms`,
            'Final Grid Size': `${gridSize}×${gridSize}`,
            'Sensitivity': dPrime.toFixed(2),
            'Total Correct': correct
          }}
          onRestart={restart}
          onBack={onBack}
        />
      </GameWrapper>
    );
  }

  const renderGrid = (grid, label) => (
    <div className="flex flex-col items-center">
      <div 
        className="grid gap-1 bg-slate-800 p-2 rounded-xl"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {grid.map((filled, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded transition-colors ${
              filled ? 'bg-violet-500' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
      <div className="text-xs text-slate-500 mt-2">{label}</div>
    </div>
  );

  return (
    <GameWrapper title="Mirror Match" onBack={onBack}>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-4 text-center">
          <div className="text-sm text-slate-400 mb-1">Trial {trial + 1}/{maxTrials}</div>
          <div className="text-lg font-medium">Is the right a mirror of the left?</div>
          <div className="text-xs text-slate-500">Grid: {gridSize}×{gridSize}</div>
        </div>

        <div className="flex gap-8 items-center mb-8">
          {renderGrid(leftGrid, 'Original')}
          <div className="text-2xl text-slate-600">⟷</div>
          {renderGrid(rightGrid, 'Mirror?')}
        </div>

        {feedback && (
          <div className={`text-2xl font-bold mb-4 ${
            feedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {feedback === 'correct' ? '✓ Correct!' : `✗ It was ${isMirror ? 'a mirror' : 'different'}`}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => handleResponse('yes')}
            disabled={!!feedback}
            className={`w-32 h-14 rounded-xl font-bold text-lg transition-all ${
              feedback
                ? 'bg-slate-700 text-slate-500'
                : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95'
            }`}
          >
            YES
          </button>
          <button
            onClick={() => handleResponse('no')}
            disabled={!!feedback}
            className={`w-32 h-14 rounded-xl font-bold text-lg transition-all ${
              feedback
                ? 'bg-slate-700 text-slate-500'
                : 'bg-rose-600 hover:bg-rose-500 active:scale-95'
            }`}
          >
            NO
          </button>
        </div>

        <div className="mt-6 flex gap-8 text-center">
          <div>
            <div className="text-xl font-bold text-emerald-400">{correct}</div>
            <div className="text-xs text-slate-500">Correct</div>
          </div>
          <div>
            <div className="text-xl font-bold text-rose-400">{incorrect}</div>
            <div className="text-xs text-slate-500">Wrong</div>
          </div>
        </div>
      </div>
    </GameWrapper>
  );
};

// ============================================
// MAIN APP - GAME SELECTION MENU
// ============================================
const BrainTrainingApp = () => {
  const [currentGame, setCurrentGame] = useState(null);

  const games = [
    {
      id: 'echo-tap',
      name: 'Echo Tap',
      description: 'Remember and repeat tile sequences',
      cognitive: 'Working Memory',
      icon: '🔲',
      color: 'from-cyan-600 to-cyan-800',
      component: EchoTap
    },
    {
      id: 'number-ghost',
      name: 'Number Ghost',
      description: 'Match numbers from N steps ago',
      cognitive: 'Memory Updating',
      icon: '👻',
      color: 'from-amber-600 to-amber-800',
      component: NumberGhost
    },
    {
      id: 'tap-unless',
      name: 'Tap Unless',
      description: 'Tap fast—unless it\'s red',
      cognitive: 'Response Inhibition',
      icon: '🚫',
      color: 'from-rose-600 to-rose-800',
      component: TapUnless
    },
    {
      id: 'rule-flip',
      name: 'Rule Flip',
      description: 'Switch between color and shape rules',
      cognitive: 'Cognitive Flexibility',
      icon: '🔄',
      color: 'from-violet-600 to-violet-800',
      component: RuleFlip
    },
    {
      id: 'same-different',
      name: 'Same or Different',
      description: 'Compare symbols at lightning speed',
      cognitive: 'Processing Speed',
      icon: '⚡',
      color: 'from-emerald-600 to-emerald-800',
      component: SameOrDifferent
    },
    {
      id: 'balance-point',
      name: 'Balance Point',
      description: 'Place weights to balance the scale',
      cognitive: 'Problem Solving',
      icon: '⚖️',
      color: 'from-blue-600 to-blue-800',
      component: BalancePoint
    },
    {
      id: 'mirror-match',
      name: 'Mirror Match',
      description: 'Spot the mirror reflection',
      cognitive: 'Spatial Reasoning',
      icon: '🪞',
      color: 'from-fuchsia-600 to-fuchsia-800',
      component: MirrorMatch
    }
  ];

  if (currentGame) {
    const GameComponent = games.find(g => g.id === currentGame)?.component;
    if (GameComponent) {
      return <GameComponent onBack={() => setCurrentGame(null)} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">🧠 Brain Training</h1>
          <p className="text-slate-400">7 cognitive games to sharpen your mind</p>
        </div>

        <div className="grid gap-4">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => setCurrentGame(game.id)}
              className={`bg-gradient-to-r ${game.color} p-4 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg`}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{game.icon}</div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{game.name}</h2>
                  <p className="text-sm text-white/80">{game.description}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded text-xs">
                    {game.cognitive}
                  </span>
                </div>
                <div className="text-2xl">→</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Each session takes 60-90 seconds</p>
          <p>Track accuracy, reaction time, and progression</p>
        </div>
      </div>
    </div>
  );
};

export default BrainTrainingApp;
