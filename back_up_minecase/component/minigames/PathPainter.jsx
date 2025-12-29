import React, { useState, useEffect, useRef } from 'react';

const PathPainter = ({ onComplete, difficulty = 'medium' }) => {
  const canvasRef = useRef(null);
  const [maze, setMaze] = useState(null);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [paintLeft, setPaintLeft] = useState(100);
  const [revealed, setRevealed] = useState(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [bestPath, setBestPath] = useState(null);

  const difficultySettings = {
    easy: { gridSize: 8, paintAmount: 150 },
    medium: { gridSize: 10, paintAmount: 120 },
    hard: { gridSize: 12, paintAmount: 100 }
  };

  const settings = difficultySettings[difficulty] || difficultySettings.medium;

  useEffect(() => {
    initializeMaze();
    try {
      window.SoundService?.playSound('gameStart');
    } catch (e) {
      console.warn('Sound failed:', e);
    }
  }, []);

  const initializeMaze = () => {
    const size = settings.gridSize;
    const newMaze = generateMaze(size);
    setMaze(newMaze);
    setPlayerPos({ x: 0, y: 0 });
    setPaintLeft(settings.paintAmount);
    setRevealed(new Set(['0-0']));
  };

  const generateMaze = (size) => {
    // Simple maze generation - create path from start to end
    const maze = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => false)
    );

    // Create a guaranteed path from top-left to bottom-right
    let x = 0, y = 0;
    maze[y][x] = true;

    while (x < size - 1 || y < size - 1) {
      if (x < size - 1 && (y === size - 1 || Math.random() > 0.5)) {
        x++;
      } else if (y < size - 1) {
        y++;
      }
      maze[y][x] = true;
    }

    // Add some extra paths
    for (let i = 0; i < size * 2; i++) {
      const rx = Math.floor(Math.random() * size);
      const ry = Math.floor(Math.random() * size);
      maze[ry][rx] = true;
    }

    return maze;
  };

  const revealCell = (x, y) => {
    const key = `${x}-${y}`;
    if (!revealed.has(key) && maze && maze[y] && maze[y][x] !== undefined) {
      setRevealed(prev => new Set([...prev, key]));

      // Cost paint based on cell type
      const cost = maze[y][x] ? 2 : 5; // Dead ends cost more
      setPaintLeft(prev => Math.max(0, prev - cost));
    }
  };

  const handleMouseMove = (e) => {
    if (!canvasRef.current || !maze) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const cellSize = rect.width / settings.gridSize;
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);

    if (x >= 0 && x < settings.gridSize && y >= 0 && y < settings.gridSize) {
      revealCell(x, y);
      setPlayerPos({ x, y });

      // Check if reached end
      if (x === settings.gridSize - 1 && y === settings.gridSize - 1) {
        handleWin();
      }
    }
  };

  const handleWin = () => {
    const finalScore = Math.max(0, paintLeft * 2);
    setScore(finalScore);
    setIsComplete(true);

    try {
      window.SoundService?.playSound('gameSuccess');
    } catch (e) {
      console.warn('Sound failed:', e);
    }

    setTimeout(() => {
      onComplete({
        success: true,
        score: finalScore,
        paintUsed: settings.paintAmount - paintLeft
      });
    }, 2000);
  };

  if (isComplete) {
    return (
      <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-2xl font-bold text-white mb-2">Path Complete!</h3>
          <p className="text-stone-400 text-sm mb-6">Masterful navigation</p>

          <div className="bg-stone-800/60 border border-stone-700 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <span className="text-stone-300">Score:</span>
              <span className="text-amber-400 font-bold text-2xl">{score}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-stone-300">Paint Left:</span>
              <span className="text-green-400 font-bold">{paintLeft}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!maze) {
    return (
      <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
        <p className="text-white text-center">Generating maze...</p>
      </div>
    );
  }

  return (
    <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-2">🎨 Path Painter</h3>
        <p className="text-stone-400 text-sm">Reveal the path to the exit with limited paint</p>

        <div className="flex justify-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <span className="text-stone-400 text-xs">Paint Left:</span>
            <div className="w-24 bg-stone-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  paintLeft > 50 ? 'bg-green-500' : paintLeft > 20 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${paintLeft}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Maze Canvas */}
      <div
        ref={canvasRef}
        className="relative w-full max-w-md mx-auto aspect-square max-h-[50vh] bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl overflow-hidden border-2 border-stone-700 cursor-crosshair"
        onMouseMove={handleMouseMove}
        onTouchMove={(e) => {
          e.preventDefault();
          const touch = e.touches[0];
          handleMouseMove(touch);
        }}
      >
        {/* Grid */}
        <div className="absolute inset-0 grid"
             style={{
               gridTemplateColumns: `repeat(${settings.gridSize}, 1fr)`,
               gridTemplateRows: `repeat(${settings.gridSize}, 1fr)`
             }}>
          {maze.map((row, y) => row.map((isPath, x) => {
            const key = `${x}-${y}`;
            const isRevealed = revealed.has(key);
            const isStart = x === 0 && y === 0;
            const isEnd = x === settings.gridSize - 1 && y === settings.gridSize - 1;
            const isPlayer = playerPos.x === x && playerPos.y === y;

            return (
              <div
                key={key}
                className={`border border-stone-200/20 transition-all ${
                  isRevealed
                    ? isPath
                      ? 'bg-blue-300/60'
                      : 'bg-red-300/60'
                    : 'bg-stone-400/40'
                }`}
              >
                {isStart && <div className="text-center text-2xl">🏁</div>}
                {isEnd && <div className="text-center text-2xl">🎯</div>}
                {isPlayer && <div className="text-center text-2xl">🖌️</div>}
              </div>
            );
          }))}
        </div>
      </div>

      <div className="mt-4 bg-stone-800/40 border border-stone-700 rounded-lg p-3">
        <p className="text-stone-300 text-xs text-center">
          💡 Hover or drag to reveal paths. Dead ends cost more paint!
        </p>
      </div>
    </div>
  );
};

export default PathPainter;
