import React, { useState, useEffect } from 'react';

const RhythmReef = ({ onComplete, difficulty = 'medium' }) => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isShowing, setIsShowing] = useState(true);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentCreature, setCurrentCreature] = useState(null);

  const difficultySettings = {
    easy: { totalRounds: 6, sequenceLength: 4 },
    medium: { totalRounds: 8, sequenceLength: 5 },
    hard: { totalRounds: 10, sequenceLength: 6 }
  };

  const settings = difficultySettings[difficulty] || difficultySettings.medium;

  const creatures = [
    { id: 'jellyfish', emoji: '🪼', tempo: 800, color: '#ec4899' },
    { id: 'fish', emoji: '🐠', tempo: 400, color: '#3b82f6' },
    { id: 'seahorse', emoji: '🦭', tempo: 600, color: '#a78bfa' },
    { id: 'octopus', emoji: '🐙', tempo: 500, color: '#f97316' },
    { id: 'turtle', emoji: '🐢', tempo: 900, color: '#10b981' }
  ];

  useEffect(() => {
    startRound();
    try {
      window.SoundService?.playSound('gameStart');
    } catch (e) {
      console.warn('Sound failed:', e);
    }
  }, []);

  const startRound = () => {
    const newSequence = Array.from({ length: settings.sequenceLength }, () =>
      creatures[Math.floor(Math.random() * creatures.length)]
    );
    setSequence(newSequence);
    setPlayerSequence([]);
    animateSequence(newSequence);
  };

  const animateSequence = (seq) => {
    setIsShowing(true);
    let delay = 0;

    seq.forEach((creature, index) => {
      setTimeout(() => {
        setCurrentCreature(creature);
        try {
          window.SoundService?.playSound('buttonClick');
        } catch (e) {
          console.warn('Sound failed:', e);
        }

        setTimeout(() => {
          setCurrentCreature(null);
        }, creature.tempo - 100);

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
    if (isShowing || isComplete) return;

    const newPlayerSeq = [...playerSequence, creature];
    setPlayerSequence(newPlayerSeq);

    setCurrentCreature(creature);
    setTimeout(() => setCurrentCreature(null), creature.tempo - 100);

    try {
      window.SoundService?.playSound('buttonClick');
    } catch (e) {
      console.warn('Sound failed:', e);
    }

    // Check if correct
    const isCorrect = sequence[newPlayerSeq.length - 1].id === creature.id;

    if (!isCorrect) {
      handleWrong();
    } else if (newPlayerSeq.length === sequence.length) {
      handleCorrect();
    }
  };

  const handleCorrect = () => {
    setScore(score + 10);

    try {
      window.SoundService?.playSound('gameSuccess');
    } catch (e) {
      console.warn('Sound failed:', e);
    }

    if (round >= settings.totalRounds) {
      completeGame(score + 10);
    } else {
      setTimeout(() => {
        setRound(round + 1);
        startRound();
      }, 1000);
    }
  };

  const handleWrong = () => {
    try {
      window.SoundService?.playSound('gameFail');
    } catch (e) {
      console.warn('Sound failed:', e);
    }

    setTimeout(() => {
      setPlayerSequence([]);
      animateSequence(sequence);
    }, 1000);
  };

  const completeGame = (finalScore) => {
    setIsComplete(true);

    try {
      window.SoundService?.playSound('gameSuccess');
    } catch (e) {
      console.warn('Sound failed:', e);
    }

    setTimeout(() => {
      onComplete({
        success: finalScore >= 50,
        score: finalScore
      });
    }, 2000);
  };

  if (isComplete) {
    return (
      <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🌊</div>
          <h3 className="text-2xl font-bold text-white mb-2">Reef Master!</h3>
          <p className="text-stone-400 text-sm mb-6">Perfect rhythm and memory</p>

          <div className="bg-stone-800/60 border border-stone-700 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <span className="text-stone-300">Final Score:</span>
              <span className="text-amber-400 font-bold text-2xl">{score}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-2">🌊 Rhythm Reef</h3>
        <p className="text-stone-400 text-sm">Tap creatures in the same rhythm and order</p>

        <div className="flex justify-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <span className="text-stone-400 text-xs">Round:</span>
            <span className="font-bold text-sm text-amber-400">{round} / {settings.totalRounds}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-400 text-xs">Score:</span>
            <span className="font-bold text-sm text-green-400">{score}</span>
          </div>
        </div>
      </div>

      {/* Underwater Scene */}
      <div className="relative w-full max-w-2xl mx-auto aspect-video max-h-[40vh] bg-gradient-to-b from-blue-900 to-blue-950 rounded-xl overflow-hidden border-2 border-blue-700 mb-3">
        {/* Bubbles */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Center Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          {currentCreature && (
            <div
              className="text-9xl animate-pulse"
              style={{
                filter: `drop-shadow(0 0 20px ${currentCreature.color})`
              }}
            >
              {currentCreature.emoji}
            </div>
          )}
          {!currentCreature && !isShowing && (
            <div className="text-white text-sm">
              {playerSequence.length}/{sequence.length}
            </div>
          )}
        </div>

        {/* Coral decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-900/40 to-transparent" />
      </div>

      {/* Status */}
      <div className="text-center mb-4">
        {isShowing ? (
          <p className="text-blue-300 text-sm font-medium animate-pulse">
            🎵 Watch and listen to the rhythm...
          </p>
        ) : (
          <p className="text-green-300 text-sm font-medium">
            🖱️ Tap creatures in the same order and rhythm
          </p>
        )}
      </div>

      {/* Creature Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {creatures.map(creature => (
          <button
            key={creature.id}
            onClick={() => handleCreatureClick(creature)}
            disabled={isShowing}
            className={`p-4 rounded-lg border-2 transition-all ${
              isShowing
                ? 'bg-stone-800 border-stone-700 opacity-50 cursor-not-allowed'
                : 'bg-stone-700 border-stone-600 hover:border-stone-500 hover:scale-105'
            }`}
            style={{
              borderColor: currentCreature?.id === creature.id ? creature.color : undefined
            }}
          >
            <div className="text-3xl">{creature.emoji}</div>
            <div className="text-xs text-stone-400 mt-1">
              {creature.tempo}ms
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 bg-stone-800/40 border border-stone-700 rounded-lg p-2">
        <p className="text-stone-400 text-xs text-center">
          💡 Each creature has a unique tempo - match both order AND rhythm!
        </p>
      </div>
    </div>
  );
};

export default RhythmReef;
