import React, { useState, useEffect } from 'react';
import { CheckCircle, X } from '../icon';

const QuickMath = ({ onComplete }) => {
  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const probs = [];
    for (let i = 0; i < 12; i++) {
      const a = Math.floor(Math.random() * 30) + 5;
      const b = Math.floor(Math.random() * 25) + 3;
      const ops = ['+', '-', '×', '÷'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      let result;
      if (op === '+') result = a + b;
      else if (op === '-') result = a - b;
      else if (op === '×') result = a * b;
      else {
        // For division, ensure clean division
        const quotient = Math.floor(Math.random() * 12) + 2;
        result = quotient;
        probs.push({ a: b * quotient, b: b, op, result });
        continue;
      }
      probs.push({ a, b, op, result });
    }
    setProblems(probs);
    // Play game start sound
    try {
      window.SoundService?.playSound('gameStart');
    } catch (e) {
      console.warn('Sound failed:', e);
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && problems.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
      if (score >= 7) {
        // Play success sound
        try {
          window.SoundService?.playSound('gameSuccess');
        } catch (e) {
          console.warn('Sound failed:', e);
        }
        setTimeout(() => onComplete({ success: true, score }), 1500);
      } else {
        // Play fail sound for not enough score
        try {
          window.SoundService?.playSound('gameFail');
        } catch (e) {
          console.warn('Sound failed:', e);
        }
      }
    }
  }, [timeLeft, gameOver, problems]);

  const checkAnswer = () => {
    if (parseInt(answer) === problems[currentIndex].result) {
      setScore(score + 1);
      // Play button click sound for correct answer
      try {
        window.SoundService?.playSound('buttonClick');
      } catch (e) {
        console.warn('Sound failed:', e);
      }
      if (currentIndex < problems.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setAnswer('');
      } else {
        setGameOver(true);
        if (score + 1 >= 7) {
          // Play success sound
          try {
            window.SoundService?.playSound('gameSuccess');
          } catch (e) {
            console.warn('Sound failed:', e);
          }
          setTimeout(() => onComplete({ success: true, score: score + 1 }), 1500);
        }
      }
    } else {
      setAnswer('');
      // Play fail sound for wrong answer
      try {
        window.SoundService?.playSound('gameFail');
      } catch (e) {
        console.warn('Sound failed:', e);
      }
    }
  };

  if (problems.length === 0) return null;

  const current = problems[currentIndex];

  return (
    <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">⏱️ Quick Math</h3>
        <p className="text-stone-400 text-sm">Solve 7+ problems in 20 seconds!</p>
        <div className="flex justify-center gap-4 mt-3">
          <span className="text-amber-400 font-bold">Time: {timeLeft}s</span>
          <span className="text-green-400 font-bold">Score: {score}/12</span>
        </div>
      </div>

      {!gameOver ? (
        <>
          <div className="bg-stone-800/60 border-2 border-amber-600/50 rounded-lg p-8 mb-6">
            <p className="text-center text-5xl font-bold text-white">
              {current.a} {current.op} {current.b} = ?
            </p>
          </div>

          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && answer && checkAnswer()}
            placeholder="Answer..."
            autoFocus
            className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white text-center text-2xl placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
          />

          <button
            onClick={checkAnswer}
            disabled={!answer}
            className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 disabled:from-stone-700 disabled:to-stone-800 text-white font-bold py-3 rounded-lg transition-all disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </>
      ) : (
        <>
          {score >= 7 ? (
            <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-6">
              <div className="flex flex-col items-center gap-3">
                <CheckCircle className="w-12 h-12 text-green-400" />
                <p className="text-green-200 font-bold text-xl">Success!</p>
                <p className="text-green-300">You solved {score} problems!</p>
              </div>
            </div>
          ) : (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6">
              <div className="flex flex-col items-center gap-3">
                <X className="w-12 h-12 text-red-400" />
                <p className="text-red-200 font-bold text-xl">Not quite!</p>
                <p className="text-red-300">You need 7+ correct answers. You got {score}.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold py-2 px-6 rounded-lg transition-all"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuickMath;
