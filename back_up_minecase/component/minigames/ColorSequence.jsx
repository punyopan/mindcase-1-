import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Lightbulb } from '../icon';

const ColorSequence = ({ onComplete, difficulty = 'easy' }) => {
  const [sequence, setSequence] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [gameState, setGameState] = useState('memorize'); // 'memorize', 'playing', 'won', 'lost'
  const [userSequence, setUserSequence] = useState([]);
  const [showingIndex, setShowingIndex] = useState(-1);

  const colors = [
    { name: 'red', bg: 'bg-red-500', text: 'Red' },
    { name: 'blue', bg: 'bg-blue-500', text: 'Blue' },
    { name: 'green', bg: 'bg-green-500', text: 'Green' },
    { name: 'yellow', bg: 'bg-yellow-500', text: 'Yellow' },
    { name: 'purple', bg: 'bg-purple-500', text: 'Purple' },
    { name: 'orange', bg: 'bg-orange-500', text: 'Orange' }
  ];

  const length = difficulty === 'easy' ? 6 : difficulty === 'hard' ? 8 : 7;

  useEffect(() => {
    // Play game start sound
    try {
      window.SoundService?.playSound('gameStart');
    } catch (e) {
      console.warn('Sound failed:', e);
    }

    const newSeq = [];
    for (let i = 0; i < length; i++) {
      newSeq.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    setSequence(newSeq);
    showSequence(newSeq);
  }, []);

  const showSequence = async (seq) => {
    setGameState('memorize');
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 500));
      setShowingIndex(i);
      await new Promise(r => setTimeout(r, 400));
      setShowingIndex(-1);
    }
    setGameState('playing');
  };

  const handleColorClick = (color) => {
    if (gameState !== 'playing') return;

    const newUserSeq = [...userSequence, color];
    setUserSequence(newUserSeq);

    if (newUserSeq[currentStep].name !== sequence[currentStep].name) {
      setGameState('lost');
      // Play fail sound
      try {
        window.SoundService?.playSound('gameFail');
      } catch (e) {
        console.warn('Sound failed:', e);
      }
      return;
    }

    if (newUserSeq.length === sequence.length) {
      setGameState('won');
      // Play success sound
      try {
        window.SoundService?.playSound('gameSuccess');
      } catch (e) {
        console.warn('Sound failed:', e);
      }
      setTimeout(() => onComplete({ success: true }), 1000);
    } else {
      setCurrentStep(currentStep + 1);
      // Play button click sound for correct selection
      try {
        window.SoundService?.playSound('buttonClick');
      } catch (e) {
        console.warn('Sound failed:', e);
      }
    }
  };

  const retry = () => {
    setUserSequence([]);
    setCurrentStep(0);
    showSequence(sequence);
  };

  return (
    <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">🎨 Color Sequence</h3>
        <p className="text-stone-400 text-sm">
          {gameState === 'memorize' ? 'Watch the sequence...' : 'Repeat the pattern!'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6 max-w-xs mx-auto">
        {colors.map((color, idx) => (
          <button
            key={color.name}
            onClick={() => handleColorClick(color)}
            disabled={gameState !== 'playing'}
            className={`h-20 rounded-lg transition-all ${color.bg} ${
              showingIndex >= 0 && sequence[showingIndex]?.name === color.name
                ? 'scale-110 ring-4 ring-white brightness-150'
                : ''
            } ${gameState === 'playing' ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
          />
        ))}
      </div>

      <div className="text-center text-stone-400 text-sm mb-4">
        Progress: {userSequence.length} / {sequence.length}
      </div>

      {gameState === 'won' && (
        <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <p className="text-green-200 font-medium">Perfect sequence!</p>
          </div>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="space-y-3">
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <X className="w-6 h-6 text-red-400" />
              <p className="text-red-200 font-medium">Wrong sequence! Try again.</p>
            </div>
          </div>
          <button
            onClick={retry}
            className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorSequence;
