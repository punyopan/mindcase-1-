import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, X, Lightbulb } from '../icon';

const LogicGrid = ({ onComplete }) => {
  const [puzzle, setPuzzle] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);
  const completedRef = useRef(false);

  const puzzles = [
    {
      clues: [
        "The person who likes Coffee lives in the Red house",
        "Alice doesn't live in the Blue house",
        "The Tea drinker lives next to the Green house owner",
        "Bob lives in the Green house",
        "Charlie doesn't drink Coffee",
        "The Blue house owner drinks Juice"
      ],
      detectives: ["Alice", "Bob", "Charlie"],
      colors: ["Red", "Green", "Blue"],
      solution: {
        "Alice": "Red",
        "Bob": "Green",
        "Charlie": "Blue"
      },
      hint: "Start with Bob's house, then use the drink preferences to eliminate options."
    },
    {
      clues: [
        "The earliest meeting was at 9 AM in the East wing",
        "Dana's meeting was after Carlos but before Elena",
        "The West wing meeting was at 11 AM",
        "Carlos didn't meet in the East wing",
        "Elena's meeting was in the North wing at noon"
      ],
      detectives: ["Carlos", "Dana", "Elena"],
      colors: ["East", "West", "North"],
      solution: {
        "Carlos": "West",
        "Dana": "East",
        "Elena": "North"
      },
      hint: "Elena's location and time are certain. Use the timing sequence to place the others."
    },
    {
      clues: [
        "The suspect with the Knife was in Room A",
        "Frank was interrogated after the Gun suspect",
        "The Room B suspect had the Rope",
        "Grace wasn't in Room A",
        "Henry was interrogated last and didn't have the Rope"
      ],
      detectives: ["Frank", "Grace", "Henry"],
      colors: ["Room A", "Room B", "Room C"],
      solution: {
        "Frank": "Room B",
        "Grace": "Room A",
        "Henry": "Room C"
      },
      hint: "Grace can't be in Room A, but the Knife suspect is. Work from there."
    }
  ];

  useEffect(() => {
    const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    setPuzzle(randomPuzzle);
    // Play game start sound
    try {
      window.SoundService?.playSound('gameStart');
    } catch (e) {
      console.warn('Sound failed:', e);
    }
  }, []);

  if (!puzzle) return null;

  const handleSelect = (detective, color) => {
    if (completed) return;

    setUserAnswers({
      ...userAnswers,
      [detective]: color
    });
    // Play button click sound
    try {
      window.SoundService?.playSound('buttonClick');
    } catch (e) {
      console.warn('Sound failed:', e);
    }
  };

  const checkSolution = () => {
    if (completedRef.current) return;

    const isCorrect = puzzle.detectives.every(
      detective => userAnswers[detective] === puzzle.solution[detective]
    );

    if (isCorrect) {
      completedRef.current = true;
      setCompleted(true);
      // Play success sound
      try {
        window.SoundService?.playSound('gameSuccess');
      } catch (e) {
        console.warn('Sound failed:', e);
      }
      onComplete({ success: true, attempts: attempts + 1 });
    } else {
      setAttempts(attempts + 1);
      // Play fail sound
      try {
        window.SoundService?.playSound('gameFail');
      } catch (e) {
        console.warn('Sound failed:', e);
      }
      alert('Not quite right! Review the clues and try again.');
    }
  };

  const isComplete = puzzle.detectives.every(d => userAnswers[d]);

  return (
    <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">🔍 Logic Grid</h3>
        <p className="text-stone-400 text-sm">Match each detective with their attribute</p>
        {attempts > 0 && <p className="text-amber-400 text-xs mt-1">Attempts: {attempts}</p>}
      </div>

      {/* Clues */}
      <div className="bg-stone-800/60 border border-stone-700 rounded-lg p-4 mb-6">
        <p className="text-amber-400 font-semibold mb-3 text-sm">📋 Clues:</p>
        <ul className="space-y-2">
          {puzzle.clues.map((clue, idx) => (
            <li key={idx} className="text-stone-300 text-sm flex items-start gap-2">
              <span className="text-amber-500 font-bold">{idx + 1}.</span>
              <span>{clue}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Selection Grid */}
      <div className="space-y-3 mb-6">
        {puzzle.detectives.map(detective => (
          <div key={detective} className="bg-stone-800/60 border border-stone-700 rounded-lg p-4">
            <p className="text-white font-medium mb-3">{detective}</p>
            <div className="grid grid-cols-3 gap-2">
              {puzzle.colors.map(color => (
                <button
                  key={color}
                  onClick={() => handleSelect(detective, color)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    userAnswers[detective] === color
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Hint */}
      {showHint && (
        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-blue-200 text-sm">{puzzle.hint}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!showHint && (
          <button
            onClick={() => setShowHint(true)}
            className="flex-1 bg-stone-700 hover:bg-stone-600 text-white font-medium py-3 px-6 rounded-lg transition-all"
          >
            💡 Hint
          </button>
        )}
        <button
          onClick={checkSolution}
          disabled={!isComplete || completed}
          className="flex-1 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 disabled:from-stone-700 disabled:to-stone-800 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:cursor-not-allowed"
        >
          {isComplete ? 'Check Solution' : 'Select All'}
        </button>
      </div>
    </div>
  );
};

export default LogicGrid;
