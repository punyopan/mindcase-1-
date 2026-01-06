import React, { useState, useEffect, useRef } from 'react';

const RhythmReef = ({ onComplete, difficulty = 'easy' }) => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isShowing, setIsShowing] = useState(true);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentCreature, setCurrentCreature] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const animationRef = useRef(null);

  const difficultySettings = {
    easy: { totalRounds: 5, sequenceLength: 3 },
    medium: { totalRounds: 7, sequenceLength: 4 },
    hard: { totalRounds: 10, sequenceLength: 5 }
  };

  const settings = difficultySettings[difficulty] || difficultySettings.easy;

  const creatures = [
    { id: 'jellyfish', emoji: '🪼', tempo: 600, color: '#ec4899', sound: 'high' },
    { id: 'fish', emoji: '🐠', tempo: 600, color: '#3b82f6', sound: 'medium' },
    { id: 'seahorse', emoji: '🦭', tempo: 600, color: '#a78bfa', sound: 'low' },
    { id: 'octopus', emoji: '🐙', tempo: 600, color: '#f97316', sound: 'pulse' }
  ];

  useEffect(() => {
    startRound();
    playSound('gameStart');
  }, []);

  const playSound = (type) => {
    try {
      if (window.SoundService?.playSound) {
        window.SoundService.playSound(type);
      }
    } catch (e) {
      console.warn('Sound failed:', e);
    }
  };

  const startRound = () => {
    const newSequence = Array.from({ length: settings.sequenceLength }, () =>
      creatures[Math.floor(Math.random() * creatures.length)]
    );
    setSequence(newSequence);
    setPlayerSequence([]);
    setFeedback(null);
    animateSequence(newSequence);
  };

  const animateSequence = (seq) => {
    setIsShowing(true);
    let delay = 0;

    seq.forEach((creature, index) => {
      setTimeout(() => {
        setCurrentCreature(creature);
        playSound('buttonClick');

        setTimeout(() => {
          setCurrentCreature(null);
        }, creature.tempo - 150);

        if (index === seq.length - 1) {
          setTimeout(() => {
            setIsShowing(false);
          }, creature.tempo);
        }
      }, delay);

      delay += creature.tempo;
    });
  };

  const handleCreatureClick = (creature) => {
    if (isShowing || isComplete || !creature) return;

    const newPlayerSeq = [...playerSequence, creature];
    setPlayerSequence(newPlayerSeq);

    setCurrentCreature(creature);
    playSound('buttonClick');

    setTimeout(() => setCurrentCreature(null), 200);

    // Check if correct
    const isCorrect = sequence[newPlayerSeq.length - 1]?.id === creature.id;

    if (!isCorrect) {
      handleWrong();
    } else if (newPlayerSeq.length === sequence.length) {
      handleCorrect();
    }
  };

  const handleWrong = () => {
    setFeedback('wrong');
    playSound('gameFail');

    setTimeout(() => {
      if (round >= settings.totalRounds) {
        completeGame(score);
      } else {
        setRound(round + 1);
        startRound();
      }
    }, 1500);
  };

  const handleCorrect = () => {
    const points = 10 * round;
    setScore(score + points);
    setFeedback('correct');
    playSound('gameSuccess');

    setTimeout(() => {
      if (round >= settings.totalRounds) {
        completeGame(score + points);
      } else {
        setRound(round + 1);
        startRound();
      }
    }, 1500);
  };

  const completeGame = (finalScore) => {
    setIsComplete(true);
    playSound('gameSuccess');

    setTimeout(() => {
      onComplete({
        success: finalScore >= 30,
        score: finalScore
      });
    }, 2000);
  };

  if (isComplete) {
    return (
      <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-xl p-8 max-w-md mx-auto">
        <div className="text-center">
          <div className="text-7xl mb-4">🏆</div>
          <h3 className="text-3xl font-bold text-white mb-4">Rhythm Master!</h3>
          <div className="bg-stone-800/60 border border-stone-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xl text-stone-300">Final Score:</span>
              <span className="text-amber-400 font-bold text-3xl">{score}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl text-stone-300">Rounds:</span>
              <span className="text-blue-400 font-bold text-3xl">{round}/{settings.totalRounds}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700/40 rounded-xl p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold text-white mb-3">🌊 Rhythm Reef</h3>
        <div className="text-lg text-blue-200 font-semibold mb-2">
          Round {round} / {settings.totalRounds}
        </div>
        <div className="text-base text-stone-300 bg-stone-900/50 rounded-lg p-3">
          {isShowing ? '👀 Watch the sequence...' : '🎯 Repeat the rhythm!'}
        </div>
      </div>

      {/* Sequence Display Area - Fixed height to prevent layout shift */}
      <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-2 border-cyan-500/30 rounded-2xl p-6 mb-6 h-[140px] flex items-center justify-center overflow-hidden">
        {currentCreature && (
          <div
            className="text-8xl animate-pulse"
            style={{
              filter: `drop-shadow(0 0 20px ${currentCreature.color})`,
              transition: 'all 0.2s ease',
              transform: 'scale(1.1)'
            }}
          >
            {currentCreature.emoji}
          </div>
        )}
        {feedback && !currentCreature && (
          <div className={`text-5xl font-bold ${
            feedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {feedback === 'correct' ? '✓ Perfect!' : '✗ Try Again'}
          </div>
        )}
        {!currentCreature && !feedback && !isShowing && (
          <div className="text-stone-600 text-6xl">?</div>
        )}
      </div>

      {/* Creature Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {creatures.map(creature => (
          <button
            key={creature.id}
            onClick={() => handleCreatureClick(creature)}
            disabled={isShowing || isComplete}
            className={`p-4 rounded-xl border-2 transition-all transform ${
              isShowing || isComplete
                ? 'bg-stone-800/50 border-stone-700 opacity-40 cursor-not-allowed'
                : 'bg-gradient-to-br from-stone-700 to-stone-800 border-stone-600 hover:border-stone-500 hover:scale-105 active:scale-95 shadow-lg'
            }`}
            style={{
              borderColor: currentCreature?.id === creature.id ? creature.color : undefined,
              boxShadow: currentCreature?.id === creature.id ? `0 0 20px ${creature.color}` : undefined
            }}
          >
            <div className="text-5xl mb-2">{creature.emoji}</div>
            <div className="text-xs text-stone-400 font-semibold uppercase">
              {creature.tempo}ms
            </div>
          </button>
        ))}
      </div>

      {/* Progress Indicators */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-emerald-400">{score}</div>
          <div className="text-xs text-emerald-300 uppercase tracking-wide font-semibold">Score</div>
        </div>
        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">{playerSequence.length}/{sequence.length}</div>
          <div className="text-xs text-blue-300 uppercase tracking-wide font-semibold">Progress</div>
        </div>
      </div>

      {/* Sequence Preview (for debugging/learning) */}
      {playerSequence.length > 0 && (
        <div className="mt-4 text-center">
          <div className="text-xs text-stone-500 mb-2">Your Sequence:</div>
          <div className="flex justify-center gap-1">
            {playerSequence.map((c, i) => (
              <span key={i} className="text-2xl">{c.emoji}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RhythmReef;
