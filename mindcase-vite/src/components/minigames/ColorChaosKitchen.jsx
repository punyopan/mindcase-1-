import React, { useState, useEffect, useRef } from 'react';

const ColorChaosKitchen = ({ onComplete, difficulty = 'medium' }) => {
  const [ingredients, setIngredients] = useState([]);
  const [isMixing, setIsMixing] = useState(false);
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [correctCounts, setCorrectCounts] = useState({});

  const difficultySettings = {
    easy: { totalRounds: 6, ingredientCount: 8, mixTime: 6000 },
    medium: { totalRounds: 8, ingredientCount: 12, mixTime: 5000 },
    hard: { totalRounds: 10, ingredientCount: 16, mixTime: 4000 }
  };

  const settings = difficultySettings[difficulty] || difficultySettings.medium;

  const ingredientTypes = [
    { color: 'red', emoji: '🍅', name: 'tomato' },
    { color: 'blue', emoji: '🫐', name: 'blueberry' },
    { color: 'yellow', emoji: '🍋', name: 'lemon' },
    { color: 'green', emoji: '🥒', name: 'cucumber' },
    { color: 'orange', emoji: '🥕', name: 'carrot' },
    { color: 'purple', emoji: '🍆', name: 'eggplant' }
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
    const newIngredients = [];
    const counts = {};

    // Generate random ingredients
    for (let i = 0; i < settings.ingredientCount; i++) {
      const type = ingredientTypes[Math.floor(Math.random() * ingredientTypes.length)];
      const ingredient = {
        id: i,
        ...type,
        x: Math.random() * 80 + 10,
        y: -10,
        rotation: Math.random() * 360,
        size: Math.random() * 20 + 40,
        fallSpeed: Math.random() * 2 + 2,
        swirl: Math.random() * 360
      };
      newIngredients.push(ingredient);
      counts[type.color] = (counts[type.color] || 0) + 1;
    }

    setIngredients(newIngredients);
    setCorrectCounts(counts);
    setSelectedAnswer(null);
    animateIngredients(newIngredients, counts);
  };

  const animateIngredients = (items, counts) => {
    setIsMixing(true);

    // Animate ingredients falling and mixing
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 50;

      setIngredients(prev => prev.map(ing => ({
        ...ing,
        y: ing.y + ing.fallSpeed,
        rotation: ing.rotation + 5,
        swirl: ing.swirl + 3
      })));

      if (elapsed >= settings.mixTime) {
        clearInterval(interval);
        setIsMixing(false);
        generateQuestion(counts);
      }
    }, 50);
  };

  const generateQuestion = (counts) => {
    const questionTypes = [
      {
        type: 'count',
        generate: () => {
          const colors = Object.keys(counts);
          const color = colors[Math.floor(Math.random() * colors.length)];
          return {
            text: `How many ${color} ${ingredientTypes.find(t => t.color === color).name}s went into the pot?`,
            correctAnswer: counts[color],
            options: generateOptions(counts[color])
          };
        }
      },
      {
        type: 'compare',
        generate: () => {
          const colors = Object.keys(counts);
          if (colors.length < 2) return null;
          const color1 = colors[Math.floor(Math.random() * colors.length)];
          let color2;
          do {
            color2 = colors[Math.floor(Math.random() * colors.length)];
          } while (color2 === color1);

          const name1 = ingredientTypes.find(t => t.color === color1).name;
          const name2 = ingredientTypes.find(t => t.color === color2).name;

          return {
            text: `Were there more ${color1} ${name1}s or ${color2} ${name2}s?`,
            correctAnswer: counts[color1] > counts[color2] ? color1 : color2,
            options: [color1, color2, 'same amount']
          };
        }
      }
    ];

    const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    const q = qType.generate();
    if (q) setQuestion(q);
  };

  const generateOptions = (correct) => {
    const options = new Set([correct]);
    while (options.size < 4) {
      const offset = Math.floor(Math.random() * 5) - 2;
      const value = Math.max(0, correct + offset);
      options.add(value);
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (answer) => {
    if (!question || selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === question.correctAnswer;

    if (isCorrect) {
      setScore(score + 10);
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
        completeGame(score + (isCorrect ? 10 : 0));
      } else {
        setRound(round + 1);
        startRound();
      }
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
          <div className="text-6xl mb-4">🍳</div>
          <h3 className="text-2xl font-bold text-white mb-2">Kitchen Mastered!</h3>
          <p className="text-stone-400 text-sm mb-6">You tracked the chaos</p>

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
        <h3 className="text-xl font-bold text-white mb-2">🍳 Color Chaos Kitchen</h3>
        <p className="text-stone-400 text-sm">Track ingredients as they fall and mix!</p>

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

      {/* Cooking Pot */}
      <div className="relative w-full max-w-md mx-auto aspect-square max-h-[45vh] bg-gradient-to-b from-orange-900/30 to-red-900/30 rounded-xl overflow-hidden mb-3 border-2 border-amber-700/50">
        {/* Steam effect */}
        {!isMixing && (
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
        )}

        {/* Ingredients */}
        {isMixing && ingredients.map(ing => (
          <div
            key={ing.id}
            className="absolute transition-all duration-100"
            style={{
              left: `${ing.x}%`,
              top: `${Math.min(ing.y, 100)}%`,
              transform: `translate(-50%, -50%) rotate(${ing.rotation}deg) scale(${ing.y > 80 ? 0.6 : 1})`,
              fontSize: `${ing.size}px`,
              opacity: ing.y > 90 ? 0.5 : 1
            }}
          >
            {ing.emoji}
          </div>
        ))}

        {/* Pot bottom indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-stone-900/80 to-transparent flex items-center justify-center">
          {isMixing && (
            <span className="text-amber-300 text-sm font-medium animate-pulse">
              🔥 Cooking...
            </span>
          )}
        </div>
      </div>

      {/* Question and Answers */}
      {question && !isMixing && (
        <div className="space-y-3">
          <div className="bg-stone-800/60 border border-stone-700 rounded-lg p-4">
            <p className="text-white font-medium text-sm text-center">{question.text}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                  selectedAnswer === option
                    ? option === question.correctAnswer
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                    : selectedAnswer !== null && option === question.correctAnswer
                    ? 'bg-green-600/50 text-white'
                    : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {isMixing && (
        <div className="text-center">
          <p className="text-amber-300 text-sm font-medium animate-pulse">
            👀 Watch carefully! Count the ingredients...
          </p>
        </div>
      )}
    </div>
  );
};

export default ColorChaosKitchen;
