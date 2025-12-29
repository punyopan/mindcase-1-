import React, { useState, useEffect } from 'react';

const MemoryConstellation = ({ onComplete, difficulty = 'medium' }) => {
  const [stars, setStars] = useState([]);
  const [constellationStars, setConstellationStars] = useState([]);
  const [playerStars, setPlayerStars] = useState([]);
  const [isShowingPattern, setIsShowingPattern] = useState(true);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [masteredConstellations, setMasteredConstellations] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [shootingStars, setShootingStars] = useState([]);

  const difficultySettings = {
    easy: { gridSize: 5, totalRounds: 6, constellationSizeStart: 3, constellationSizeMax: 5, shootingStarsCount: 1 },
    medium: { gridSize: 6, totalRounds: 8, constellationSizeStart: 4, constellationSizeMax: 6, shootingStarsCount: 2 },
    hard: { gridSize: 7, totalRounds: 10, constellationSizeStart: 5, constellationSizeMax: 8, shootingStarsCount: 3 }
  };

  const settings = difficultySettings[difficulty] || difficultySettings.medium;

  useEffect(() => {
    initializeGame();
    try {
      window.SoundService?.playSound('gameStart');
    } catch (e) {
      console.warn('Sound failed:', e);
    }
  }, []);

  const initializeGame = () => {
    generateStarField();
    generateConstellation(Math.min(settings.constellationSizeStart + round - 1, settings.constellationSizeMax));
  };

  const generateStarField = () => {
    const background = [];
    for (let i = 0; i < 50; i++) {
      background.push({
        id: `bg-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        twinkleDelay: Math.random() * 3
      });
    }
    setStars(background);
  };

  const generateConstellation = (size) => {
    const constellation = [];
    const shooters = [];
    const gridSize = settings.gridSize;
    const cellSize = 100 / gridSize;

    // Generate constellation stars on grid
    const usedCells = new Set();
    for (let i = 0; i < size; i++) {
      let cellX, cellY, cellKey;
      do {
        cellX = Math.floor(Math.random() * gridSize);
        cellY = Math.floor(Math.random() * gridSize);
        cellKey = `${cellX}-${cellY}`;
      } while (usedCells.has(cellKey));

      usedCells.add(cellKey);

      constellation.push({
        id: i,
        x: cellX * cellSize + cellSize / 2 + (Math.random() - 0.5) * cellSize * 0.3,
        y: cellY * cellSize + cellSize / 2 + (Math.random() - 0.5) * cellSize * 0.3,
        isConstellation: true
      });
    }

    // Generate shooting stars (distractors)
    for (let i = 0; i < settings.shootingStarsCount; i++) {
      let cellX, cellY, cellKey;
      do {
        cellX = Math.floor(Math.random() * gridSize);
        cellY = Math.floor(Math.random() * gridSize);
        cellKey = `${cellX}-${cellY}`;
      } while (usedCells.has(cellKey));

      usedCells.add(cellKey);

      shooters.push({
        id: `shooter-${i}`,
        x: cellX * cellSize + cellSize / 2,
        y: cellY * cellSize + cellSize / 2,
        isShootingStar: true,
        delay: i * 0.8
      });
    }

    setConstellationStars(constellation);
    setShootingStars(shooters);
    setPlayerStars([]);
    animateConstellation(constellation, shooters);
  };

  const animateConstellation = (constellation, shooters) => {
    setIsShowingPattern(true);

    // Show constellation stars briefly
    setTimeout(() => {
      setIsShowingPattern(false);
    }, 3000);
  };

  const handleStarClick = (x, y) => {
    if (isShowingPattern || isComplete) return;

    const newStar = { x, y, id: playerStars.length };
    setPlayerStars([...playerStars, newStar]);

    try {
      window.SoundService?.playSound('buttonClick');
    } catch (e) {
      console.warn('Sound failed:', e);
    }
  };

  const handleSubmit = () => {
    if (isShowingPattern || isComplete) return;

    let correctCount = 0;
    const threshold = 8; // Distance threshold for matching

    playerStars.forEach(pStar => {
      const isCorrect = constellationStars.some(cStar => {
        const distance = Math.sqrt(Math.pow(pStar.x - cStar.x, 2) + Math.pow(pStar.y - cStar.y, 2));
        return distance < threshold;
      });
      if (isCorrect) correctCount++;
    });

    const accuracy = correctCount / constellationStars.length;
    const earnedScore = Math.round(accuracy * 100);
    const newScore = score + earnedScore;
    setScore(newScore);

    if (accuracy >= 0.8) {
      // Mastered constellation
      setMasteredConstellations([...masteredConstellations, round]);
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
        generateConstellation(Math.min(settings.constellationSizeStart + round, settings.constellationSizeMax));
      }, 1500);
    }
  };

  const handleClear = () => {
    setPlayerStars([]);
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
        success: finalScore >= 400,
        score: finalScore,
        masteredCount: masteredConstellations.length
      });
    }, 2000);
  };

  if (isComplete) {
    return (
      <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-2xl font-bold text-white mb-2">Constellation Master!</h3>
          <p className="text-stone-400 text-sm mb-6">You've charted the stars</p>

          <div className="bg-stone-800/60 border border-stone-700 rounded-lg p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-stone-300">Final Score:</span>
              <span className="text-amber-400 font-bold text-2xl">{score}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-300">Mastered:</span>
              <span className="text-green-400 font-bold">{masteredConstellations.length} / {settings.totalRounds}</span>
            </div>
          </div>

          {/* Constellation Gallery */}
          <div className="mt-4 bg-stone-800/40 border border-stone-700 rounded-lg p-4">
            <p className="text-amber-300 text-xs font-medium mb-2">Constellation Gallery:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: settings.totalRounds }, (_, i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 ${
                  masteredConstellations.includes(i + 1)
                    ? 'bg-amber-500/30 border-amber-400'
                    : 'bg-stone-700/30 border-stone-600'
                }`}>
                  <span className="text-xs">{masteredConstellations.includes(i + 1) ? '⭐' : '○'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-2">⭐ Memory Constellation</h3>
        <p className="text-stone-400 text-sm">Recreate the star pattern from memory</p>

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

      {/* Star Field */}
      <div className="relative w-full max-w-md mx-auto aspect-square max-h-[50vh] bg-gradient-to-b from-indigo-950 to-slate-950 rounded-xl overflow-hidden mb-4 border-2 border-stone-700"
           onClick={(e) => {
             if (isShowingPattern) return;
             const rect = e.currentTarget.getBoundingClientRect();
             const x = ((e.clientX - rect.left) / rect.width) * 100;
             const y = ((e.clientY - rect.top) / rect.height) * 100;
             handleStarClick(x, y);
           }}>

        {/* Background twinkling stars */}
        {stars.map(star => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.twinkleDelay}s`,
              opacity: 0.6
            }}
          />
        ))}

        {/* Constellation stars (shown during pattern phase) */}
        {isShowingPattern && constellationStars.map((star, index) => (
          <div
            key={star.id}
            className="absolute w-3 h-3 bg-amber-400 rounded-full animate-pulse shadow-lg shadow-amber-500/50"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              transform: 'translate(-50%, -50%)',
              animationDelay: `${index * 0.2}s`,
              opacity: 1
            }}
          />
        ))}

        {/* Shooting stars (distractors) */}
        {isShowingPattern && shootingStars.map(star => (
          <div
            key={star.id}
            className="absolute w-2 h-2 bg-blue-400 rounded-full animate-ping"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              transform: 'translate(-50%, -50%)',
              animationDelay: `${star.delay}s`,
              opacity: 0.8
            }}
          />
        ))}

        {/* Player's placed stars */}
        {!isShowingPattern && playerStars.map(star => (
          <div
            key={star.id}
            className="absolute w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-500/50"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}

        {/* Status overlay */}
        <div className="absolute top-2 left-2 bg-black/50 rounded-lg px-3 py-1">
          <p className="text-white text-xs">
            {isShowingPattern ? '👁️ Watch the constellation...' : `🖱️ Click to place stars (${playerStars.length}/${constellationStars.length})`}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleClear}
          disabled={isShowingPattern || playerStars.length === 0}
          className="bg-red-600 hover:bg-red-700 disabled:bg-stone-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-all text-sm"
        >
          Clear Stars
        </button>
        <button
          onClick={handleSubmit}
          disabled={isShowingPattern}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-stone-700 disabled:to-stone-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
        >
          Submit Pattern
        </button>
      </div>

      <div className="mt-3 bg-stone-800/40 border border-stone-700 rounded-lg p-2">
        <p className="text-stone-400 text-xs text-center">
          💡 Avoid clicking shooting stars (blue flashes) - they're distractors!
        </p>
      </div>
    </div>
  );
};

export default MemoryConstellation;
