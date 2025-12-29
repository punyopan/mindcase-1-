import React, { useState, useEffect } from 'react';

const GravityGuess = ({ onComplete, difficulty = 'medium' }) => {
  const [scene, setScene] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [accuracy, setAccuracy] = useState(null);

  const difficultySettings = {
    easy: { totalRounds: 6, complexity: 'simple' },
    medium: { totalRounds: 8, complexity: 'moderate' },
    hard: { totalRounds: 10, complexity: 'complex' }
  };

  const settings = difficultySettings[difficulty] || difficultySettings.medium;

  useEffect(() => {
    startRound();
    try {
      window.SoundService?.playSound('gameStart');
    } catch (e) {
      console.warn('Sound failed:', e);
    }
  }, []);

  const startRound = () => {
    const newScene = generateScene();
    setScene(newScene);
    setPrediction(null);
    setIsSimulating(false);
    setAccuracy(null);
  };

  const generateScene = () => {
    const sceneTypes = [
      {
        type: 'ball-on-ramp',
        description: 'Ball on a ramp',
        visual: '🎱📐',
        endPosition: { x: 70, y: 80 }
      },
      {
        type: 'pendulum',
        description: 'Pendulum mid-swing',
        visual: '⚙️⬇️',
        endPosition: { x: 50, y: 70 }
      },
      {
        type: 'falling-dominoes',
        description: 'Dominoes about to fall',
        visual: '🧱🧱🧱',
        endPosition: { x: 80, y: 90 }
      },
      {
        type: 'rolling-ball',
        description: 'Ball rolling down',
        visual: '⚪↘️',
        endPosition: { x: 60, y: 85 }
      }
    ];

    return sceneTypes[Math.floor(Math.random() * sceneTypes.length)];
  };

  const handleCanvasClick = (e) => {
    if (isSimulating || prediction) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPrediction({ x, y });

    try {
      window.SoundService?.playSound('buttonClick');
    } catch (e) {
      console.warn('Sound failed:', e);
    }
  };

  const handleSimulate = () => {
    if (!prediction || isSimulating) return;

    setIsSimulating(true);

    // Simulate physics
    setTimeout(() => {
      const distance = Math.sqrt(
        Math.pow(prediction.x - scene.endPosition.x, 2) +
        Math.pow(prediction.y - scene.endPosition.y, 2)
      );

      const maxDistance = 20; // Maximum acceptable distance
      const acc = Math.max(0, 100 - (distance / maxDistance) * 100);
      setAccuracy(Math.round(acc));

      const earnedScore = Math.round(acc / 10);
      setScore(score + earnedScore);

      if (acc >= 70) {
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

      setTimeout(() => {
        if (round >= settings.totalRounds) {
          completeGame(score + earnedScore);
        } else {
          setRound(round + 1);
          startRound();
        }
      }, 2000);
    }, 1500);
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
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold text-white mb-2">Physics Master!</h3>
          <p className="text-stone-400 text-sm mb-6">Excellent prediction skills</p>

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

  if (!scene) {
    return (
      <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
        <p className="text-white text-center">Loading scene...</p>
      </div>
    );
  }

  return (
    <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-2">🎯 Gravity Guess</h3>
        <p className="text-stone-400 text-sm">Predict where the object will end up</p>

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

      {/* Scene */}
      <div className="bg-stone-800/60 border border-stone-700 rounded-lg p-3 mb-4">
        <p className="text-stone-300 text-xs mb-2 text-center font-medium">{scene.description}</p>
        <div className="text-6xl text-center">{scene.visual}</div>
      </div>

      {/* Chalkboard/Blueprint Canvas */}
      <div
        className="relative w-full max-w-md mx-auto aspect-square max-h-[50vh] bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border-2 border-amber-700 cursor-crosshair mb-3"
        onClick={handleCanvasClick}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full grid grid-cols-10 grid-rows-10">
            {[...Array(100)].map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>

        {/* Player prediction */}
        {prediction && !isSimulating && (
          <div
            className="absolute w-4 h-4 bg-blue-400 rounded-full shadow-lg shadow-blue-500/50"
            style={{
              left: `${prediction.x}%`,
              top: `${prediction.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        )}

        {/* Actual result (shown after simulation) */}
        {isSimulating && (
          <>
            <div
              className="absolute w-4 h-4 bg-green-400 rounded-full shadow-lg shadow-green-500/50 animate-ping"
              style={{
                left: `${scene.endPosition.x}%`,
                top: `${scene.endPosition.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
            {prediction && (
              <svg className="absolute inset-0 w-full h-full">
                <line
                  x1={`${prediction.x}%`}
                  y1={`${prediction.y}%`}
                  x2={`${scene.endPosition.x}%`}
                  y2={`${scene.endPosition.y}%`}
                  stroke={accuracy >= 70 ? '#10b981' : '#ef4444'}
                  strokeWidth="2"
                  strokeDasharray="4"
                />
              </svg>
            )}
          </>
        )}

        {/* Instructions */}
        {!prediction && (
          <div className="absolute top-2 left-2 bg-black/50 rounded-lg px-3 py-1">
            <p className="text-white text-xs">Click where you think it will land</p>
          </div>
        )}

        {/* Accuracy feedback */}
        {accuracy !== null && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 rounded-lg px-6 py-3">
            <p className={`text-2xl font-bold ${accuracy >= 70 ? 'text-green-400' : 'text-red-400'}`}>
              {accuracy}% Accurate
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setPrediction(null)}
          disabled={!prediction || isSimulating}
          className="bg-red-600 hover:bg-red-700 disabled:bg-stone-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-all text-sm"
        >
          Clear
        </button>
        <button
          onClick={handleSimulate}
          disabled={!prediction || isSimulating}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-stone-700 disabled:to-stone-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
        >
          {isSimulating ? 'Simulating...' : 'Run Physics'}
        </button>
      </div>
    </div>
  );
};

export default GravityGuess;
