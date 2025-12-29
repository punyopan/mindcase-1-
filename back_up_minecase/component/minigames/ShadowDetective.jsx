import React, { useState, useEffect } from 'react';

const ShadowDetective = ({ onComplete, difficulty = 'medium' }) => {
  const [objects, setObjects] = useState([]);
  const [shadows, setShadows] = useState([]);
  const [matches, setMatches] = useState({});
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [rotation, setRotation] = useState(0);

  const difficultySettings = {
    easy: { totalRounds: 6, objectCount: 4, trickShadows: 0 },
    medium: { totalRounds: 8, objectCount: 5, trickShadows: 1 },
    hard: { totalRounds: 10, objectCount: 5, trickShadows: 2 }
  };

  const settings = difficultySettings[difficulty] || difficultySettings.medium;

  const objectShapes = [
    { id: 'cube', shape: '🎲', shadow: '⬛' },
    { id: 'sphere', shape: '⚽', shadow: '⚫' },
    { id: 'cone', shape: '🍦', shadow: '🔺' },
    { id: 'cylinder', shape: '🥫', shadow: '▭' },
    { id: 'pyramid', shape: '🔺', shadow: '▲' },
    { id: 'star', shape: '⭐', shadow: '★' },
    { id: 'heart', shape: '❤️', shadow: '♥️' },
    { id: 'diamond', shape: '💎', shadow: '♦️' }
  ];

  useEffect(() => {
    startRound();
    try {
      window.SoundService?.playSound('gameStart');
    } catch (e) {
      console.warn('Sound failed:', e);
    }

    // Rotate objects slowly
    const rotationInterval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(rotationInterval);
  }, []);

  const startRound = () => {
    const selectedShapes = [...objectShapes]
      .sort(() => Math.random() - 0.5)
      .slice(0, settings.objectCount);

    const newObjects = selectedShapes.map((shape, idx) => ({
      ...shape,
      displayId: idx
    }));

    // Create shadows (some are correct, some are tricks)
    const correctShadows = selectedShapes.map((shape, idx) => ({
      ...shape,
      shadowId: idx,
      isTrick: false
    }));

    // Add trick shadows
    const trickShapes = objectShapes
      .filter(s => !selectedShapes.includes(s))
      .slice(0, settings.trickShadows);

    const trickShadows = trickShapes.map((shape, idx) => ({
      ...shape,
      shadowId: selectedShapes.length + idx,
      isTrick: true
    }));

    const allShadows = [...correctShadows, ...trickShadows].sort(() => Math.random() - 0.5);

    setObjects(newObjects);
    setShadows(allShadows);
    setMatches({});
  };

  const handleMatch = (objectId, shadowId) => {
    const newMatches = { ...matches };

    // Remove previous match for this object
    Object.keys(newMatches).forEach(key => {
      if (newMatches[key] === shadowId) delete newMatches[key];
    });

    newMatches[objectId] = shadowId;
    setMatches(newMatches);

    try {
      window.SoundService?.playSound('buttonClick');
    } catch (e) {
      console.warn('Sound failed:', e);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;

    objects.forEach(obj => {
      const matchedShadowId = matches[obj.displayId];
      if (matchedShadowId !== undefined) {
        const matchedShadow = shadows.find(s => s.shadowId === matchedShadowId);
        if (matchedShadow && matchedShadow.id === obj.id && !matchedShadow.isTrick) {
          correctCount++;
        }
      }
    });

    const earnedScore = correctCount * 10;
    const newScore = score + earnedScore;
    setScore(newScore);

    if (correctCount === objects.length) {
      try {
        window.SoundService?.playSound('gameSuccess');
      } catch (e) {
        console.warn('Sound failed:', e);
      }
    } else {
      try {
        window.SoundService?.playSound('gameFail');
      } catch (e) {
        console.warn('Sound failed:', e);
      }
    }

    if (round >= settings.totalRounds) {
      completeGame(newScore);
    } else {
      setTimeout(() => {
        setRound(round + 1);
        startRound();
      }, 1500);
    }
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
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">Detective Complete!</h3>
          <p className="text-stone-400 text-sm mb-6">Master of shadows and shapes</p>

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
        <h3 className="text-xl font-bold text-white mb-2">🔍 Shadow Detective</h3>
        <p className="text-stone-400 text-sm">Match objects to their shadows</p>

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

      {/* Objects (Top View) */}
      <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-2 border-stone-700 rounded-xl p-4 mb-4">
        <p className="text-stone-300 text-xs mb-2 text-center">Objects (from above):</p>
        <div className="flex justify-around items-center">
          {objects.map(obj => (
            <div
              key={obj.displayId}
              className="text-center"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 0.05s linear'
              }}
            >
              <div className="text-4xl mb-1">{obj.shape}</div>
              <div className="text-xs text-stone-400">#{obj.displayId + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Shadows (Side View) */}
      <div className="bg-gradient-to-br from-gray-900/40 to-black/40 border-2 border-stone-700 rounded-xl p-4 mb-4">
        <p className="text-stone-300 text-xs mb-2 text-center">Shadows (from side):</p>
        <div className="grid grid-cols-3 gap-2">
          {shadows.map(shadow => {
            const isMatched = Object.values(matches).includes(shadow.shadowId);
            return (
              <div
                key={shadow.shadowId}
                className={`p-3 rounded-lg border-2 text-center cursor-pointer transition-all ${
                  isMatched
                    ? 'bg-amber-500/20 border-amber-400'
                    : 'bg-stone-800/40 border-stone-600 hover:border-stone-500'
                }`}
              >
                <div className="text-3xl mb-1 opacity-70">{shadow.shadow}</div>
                <div className="text-xs text-stone-400">Shadow {String.fromCharCode(65 + shadow.shadowId)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Matching Interface */}
      <div className="bg-stone-800/40 border border-stone-700 rounded-xl p-4 mb-4">
        <p className="text-stone-300 text-xs mb-3 text-center">Click object number, then shadow letter:</p>
        <div className="grid grid-cols-2 gap-2">
          {objects.map(obj => {
            const matchedShadowId = matches[obj.displayId];
            const matchedShadow = shadows.find(s => s.shadowId === matchedShadowId);

            return (
              <div key={obj.displayId} className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (matchedShadow === undefined) return;
                    setMatches(prev => {
                      const newMatches = { ...prev };
                      delete newMatches[obj.displayId];
                      return newMatches;
                    });
                  }}
                  className="flex-1 bg-stone-700 hover:bg-stone-600 border-2 border-stone-600 rounded-lg p-2 text-sm font-medium text-white"
                >
                  #{obj.displayId + 1} → {matchedShadow ? String.fromCharCode(65 + matchedShadow.shadowId) : '?'}
                </button>
                {matchedShadow === undefined && shadows.map(shadow => {
                  const isAlreadyMatched = Object.values(matches).includes(shadow.shadowId);
                  if (isAlreadyMatched) return null;
                  return (
                    <button
                      key={shadow.shadowId}
                      onClick={() => handleMatch(obj.displayId, shadow.shadowId)}
                      className="text-xs bg-amber-600 hover:bg-amber-500 text-white px-2 py-1 rounded"
                    >
                      {String.fromCharCode(65 + shadow.shadowId)}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={Object.keys(matches).length !== objects.length}
        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-stone-700 disabled:to-stone-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition-all"
      >
        Submit Matches
      </button>

      {settings.trickShadows > 0 && (
        <div className="mt-3 bg-red-900/20 border border-red-700/30 rounded-lg p-2">
          <p className="text-red-300 text-xs text-center">
            ⚠️ Watch out! Some shadows don't belong to any object!
          </p>
        </div>
      )}
    </div>
  );
};

export default ShadowDetective;
