import React, { useState, useEffect } from 'react';

const EmotionGarden = ({ onComplete, difficulty = 'medium' }) => {
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [showingEmotion, setShowingEmotion] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [emotionAccuracy, setEmotionAccuracy] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [flowers, setFlowers] = useState(0);

  const difficultySettings = {
    easy: { totalRounds: 12, displayTime: 800 },
    medium: { totalRounds: 15, displayTime: 600 },
    hard: { totalRounds: 20, displayTime: 500 }
  };

  const settings = difficultySettings[difficulty] || difficultySettings.medium;

  const emotions = [
    { id: 'happy', face: '😊', color: '#fbbf24' },
    { id: 'sad', face: '😢', color: '#3b82f6' },
    { id: 'angry', face: '😠', color: '#ef4444' },
    { id: 'surprised', face: '😲', color: '#a78bfa' },
    { id: 'scared', face: '😨', color: '#6b7280' },
    { id: 'disgusted', face: '🤢', color: '#10b981' }
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
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    setCurrentEmotion(emotion);
    setSelectedEmotion(null);
    setShowingEmotion(true);

    setTimeout(() => {
      setShowingEmotion(false);
    }, settings.displayTime);
  };

  const handleEmotionSelect = (emotionId) => {
    if (selectedEmotion || showingEmotion) return;

    setSelectedEmotion(emotionId);
    const isCorrect = emotionId === currentEmotion.id;

    // Update accuracy tracking
    setEmotionAccuracy(prev => ({
      ...prev,
      [currentEmotion.id]: {
        correct: (prev[currentEmotion.id]?.correct || 0) + (isCorrect ? 1 : 0),
        total: (prev[currentEmotion.id]?.total || 0) + 1
      }
    }));

    if (isCorrect) {
      setScore(score + 10);
      setFlowers(flowers + 1);
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
        success: finalScore >= 80,
        score: finalScore,
        flowers
      });
    }, 2000);
  };

  if (isComplete) {
    return (
      <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🌸</div>
          <h3 className="text-2xl font-bold text-white mb-2">Emotion Master!</h3>
          <p className="text-stone-400 text-sm mb-6">You grew {flowers} flowers!</p>

          <div className="bg-stone-800/60 border border-stone-700 rounded-lg p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-stone-300">Final Score:</span>
              <span className="text-amber-400 font-bold text-2xl">{score}</span>
            </div>

            {/* Emotion Accuracy */}
            <div className="mt-4 space-y-2">
              <p className="text-stone-300 text-sm">Accuracy by Emotion:</p>
              {Object.entries(emotionAccuracy).map(([emotionId, stats]) => {
                const emotion = emotions.find(e => e.id === emotionId);
                const accuracy = ((stats.correct / stats.total) * 100).toFixed(0);
                return (
                  <div key={emotionId} className="flex items-center justify-between text-xs">
                    <span>{emotion.face} {emotionId}</span>
                    <span className={accuracy >= 70 ? 'text-green-400' : 'text-yellow-400'}>
                      {accuracy}% ({stats.correct}/{stats.total})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-2">🌺 Emotion Garden</h3>
        <p className="text-stone-400 text-sm">Identify the fleeting emotion</p>

        <div className="flex justify-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <span className="text-stone-400 text-xs">Round:</span>
            <span className="font-bold text-sm text-amber-400">{round} / {settings.totalRounds}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-400 text-xs">Flowers:</span>
            <span className="font-bold text-sm text-green-400">{flowers} 🌸</span>
          </div>
        </div>
      </div>

      {/* Emotion Display */}
      <div className="relative w-full aspect-square max-w-xs max-h-[40vh] mx-auto mb-3 bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-2xl border-2 border-stone-700 flex items-center justify-center overflow-hidden">
        {/* Flowers background */}
        {flowers > 0 && (
          <div className="absolute inset-0 flex flex-wrap justify-center items-center opacity-20">
            {Array.from({ length: Math.min(flowers, 20) }, (_, i) => (
              <span key={i} className="text-2xl">🌸</span>
            ))}
          </div>
        )}

        {/* Blob creature */}
        <div className="relative z-10">
          {showingEmotion && currentEmotion && (
            <div
              className="text-9xl animate-pulse"
              style={{ color: currentEmotion.color }}
            >
              {currentEmotion.face}
            </div>
          )}
          {!showingEmotion && (
            <div className="text-9xl opacity-30">
              😐
            </div>
          )}
        </div>

        {/* Rain effect for wrong answer */}
        {selectedEmotion && selectedEmotion !== currentEmotion.id && (
          <div className="absolute inset-0 bg-blue-500/10 animate-pulse">
            <div className="text-6xl absolute top-1/4 left-1/4 animate-bounce">💧</div>
            <div className="text-6xl absolute top-1/3 right-1/4 animate-bounce" style={{ animationDelay: '0.2s' }}>💧</div>
          </div>
        )}
      </div>

      {/* Emotion Buttons */}
      {!showingEmotion && (
        <div className="grid grid-cols-3 gap-2">
          {emotions.map(emotion => (
            <button
              key={emotion.id}
              onClick={() => handleEmotionSelect(emotion.id)}
              disabled={selectedEmotion !== null}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedEmotion === emotion.id
                  ? emotion.id === currentEmotion.id
                    ? 'bg-green-600/30 border-green-400'
                    : 'bg-red-600/30 border-red-400'
                  : selectedEmotion !== null && emotion.id === currentEmotion.id
                  ? 'bg-green-600/30 border-green-400'
                  : 'bg-stone-700 border-stone-600 hover:border-stone-500'
              } ${selectedEmotion !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="text-3xl mb-1">{emotion.face}</div>
              <div className="text-xs text-stone-300 capitalize">{emotion.id}</div>
            </button>
          ))}
        </div>
      )}

      {showingEmotion && (
        <div className="text-center">
          <p className="text-amber-300 text-sm font-medium animate-pulse">
            👀 Watch the emotion flash...
          </p>
        </div>
      )}
    </div>
  );
};

export default EmotionGarden;
