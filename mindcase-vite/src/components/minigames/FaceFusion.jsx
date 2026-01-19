import React, { useState, useEffect } from 'react';

const FaceFusion = ({ onComplete, difficulty = 'medium' }) => {
  const [face1, setFace1] = useState(null);
  const [face2, setFace2] = useState(null);
  const [fusedFace, setFusedFace] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showingFaces, setShowingFaces] = useState(true);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const difficultySettings = {
    easy: { totalRounds: 8, displayTime: 2500, impossibleChance: 0 },
    medium: { totalRounds: 10, displayTime: 2000, impossibleChance: 0.2 },
    hard: { totalRounds: 12, displayTime: 1500, impossibleChance: 0.3 }
  };

  const settings = difficultySettings[difficulty] || difficultySettings.medium;

  const faceFeatures = {
    skinTones: ['#f5d5c0', '#e8b896', '#c68642', '#8d5524'],
    hairStyles: ['🦱', '👨‍🦱', '👩‍🦱', '👨‍🦰', '👩‍🦰', '🧑‍🦲'],
    eyeShapes: ['👁️', '👀'],
    eyeColors: ['blue', 'brown', 'green', 'hazel'],
    noseShapes: ['👃', '👃🏻', '👃🏼'],
    mouthShapes: ['👄', '😃', '😐'],
    accessories: [null, '👓', '😎', '🕶️']
  };

  useEffect(() => {
    startRound();
    try {
      window.SoundService?.playSound('gameStart');
    } catch (e) {
      console.warn('Sound failed:', e);
    }
  }, []);

  const generateFace = () => {
    return {
      skin: faceFeatures.skinTones[Math.floor(Math.random() * faceFeatures.skinTones.length)],
      hair: faceFeatures.hairStyles[Math.floor(Math.random() * faceFeatures.hairStyles.length)],
      eyes: faceFeatures.eyeShapes[Math.floor(Math.random() * faceFeatures.eyeShapes.length)],
      eyeColor: faceFeatures.eyeColors[Math.floor(Math.random() * faceFeatures.eyeColors.length)],
      nose: faceFeatures.noseShapes[Math.floor(Math.random() * faceFeatures.noseShapes.length)],
      mouth: faceFeatures.mouthShapes[Math.floor(Math.random() * faceFeatures.mouthShapes.length)],
      accessory: faceFeatures.accessories[Math.floor(Math.random() * faceFeatures.accessories.length)]
    };
  };

  const startRound = () => {
    const f1 = generateFace();
    const f2 = generateFace();

    setFace1(f1);
    setFace2(f2);
    setSelectedAnswer(null);
    setShowingFaces(true);

    setTimeout(() => {
      const isImpossible = Math.random() < settings.impossibleChance;
      const fused = fuseFaces(f1, f2, isImpossible);
      setFusedFace(fused);
      generateQuestion(f1, f2, fused);
      setShowingFaces(false);
    }, settings.displayTime);
  };

  const fuseFaces = (f1, f2, impossible) => {
    if (impossible) {
      // Create impossible fusion with features from neither face
      return generateFace();
    }

    // Randomly pick features from f1 or f2
    return {
      skin: Math.random() > 0.5 ? f1.skin : f2.skin,
      hair: Math.random() > 0.5 ? f1.hair : f2.hair,
      eyes: Math.random() > 0.5 ? f1.eyes : f2.eyes,
      eyeColor: Math.random() > 0.5 ? f1.eyeColor : f2.eyeColor,
      nose: Math.random() > 0.5 ? f1.nose : f2.nose,
      mouth: Math.random() > 0.5 ? f1.mouth : f2.mouth,
      accessory: Math.random() > 0.5 ? f1.accessory : f2.accessory
    };
  };

  const generateQuestion = (f1, f2, fused) => {
    const questionTypes = [
      {
        text: 'Whose eyes are showing?',
        getAnswer: () => {
          if (fused.eyes === f1.eyes && fused.eyes === f2.eyes) return 'both';
          if (fused.eyes === f1.eyes) return 'face1';
          if (fused.eyes === f2.eyes) return 'face2';
          return 'neither';
        }
      },
      {
        text: 'Which face had glasses?',
        getAnswer: () => {
          const f1HasGlasses = f1.accessory && f1.accessory.includes('👓') || f1.accessory?.includes('😎') || f1.accessory?.includes('🕶️');
          const f2HasGlasses = f2.accessory && f2.accessory.includes('👓') || f2.accessory?.includes('😎') || f2.accessory?.includes('🕶️');

          if (f1HasGlasses && f2HasGlasses) return 'both';
          if (f1HasGlasses) return 'face1';
          if (f2HasGlasses) return 'face2';
          return 'neither';
        }
      },
      {
        text: 'Whose hair is in the fusion?',
        getAnswer: () => {
          if (fused.hair === f1.hair && fused.hair === f2.hair) return 'both';
          if (fused.hair === f1.hair) return 'face1';
          if (fused.hair === f2.hair) return 'face2';
          return 'neither';
        }
      }
    ];

    const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    setQuestion({
      text: qType.text,
      correctAnswer: qType.getAnswer()
    });
  };

  const handleAnswer = (answer) => {
    if (selectedAnswer || !question) return;

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
        success: finalScore >= 60,
        score: finalScore
      });
    }, 2000);
  };

  const renderFace = (face, label) => {
    if (!face) return null;

    return (
      <div className="bg-stone-800/60 border border-stone-700 rounded-xl p-4">
        <p className="text-stone-300 text-xs mb-2 text-center font-medium">{label}</p>
        <div className="relative w-32 h-32 mx-auto rounded-full border-4 border-stone-600 flex items-center justify-center"
             style={{ backgroundColor: face.skin }}>
          <div className="absolute top-2 text-3xl">{face.hair}</div>
          <div className="absolute top-8 text-2xl">{face.eyes}</div>
          <div className="absolute top-14 text-xl">{face.nose}</div>
          <div className="absolute bottom-6 text-2xl">{face.mouth}</div>
          {face.accessory && (
            <div className="absolute top-6 text-3xl">{face.accessory}</div>
          )}
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
      <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🎭</div>
          <h3 className="text-2xl font-bold text-white mb-2">Fusion Master!</h3>
          <p className="text-stone-400 text-sm mb-6">Perfect facial recognition</p>

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
        <h3 className="text-xl font-bold text-white mb-2">🎭 Face Fusion</h3>
        <p className="text-stone-400 text-sm">Watch faces merge, answer questions</p>

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

      {/* Faces Display */}
      {showingFaces ? (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {renderFace(face1, 'Face 1')}
          {renderFace(face2, 'Face 2')}
        </div>
      ) : (
        <div className="mb-4">
          {renderFace(fusedFace, 'Fused Face')}
        </div>
      )}

      {/* Status */}
      <div className="text-center mb-4">
        {showingFaces ? (
          <p className="text-purple-300 text-sm font-medium animate-pulse">
            👀 Watch the faces carefully...
          </p>
        ) : question && (
          <div className="bg-stone-800/60 border border-stone-700 rounded-lg p-3">
            <p className="text-white font-medium text-sm">{question.text}</p>
          </div>
        )}
      </div>

      {/* Answer Buttons */}
      {!showingFaces && question && (
        <div className="grid grid-cols-2 gap-2">
          {['face1', 'face2', 'both', 'neither'].map(option => (
            <button
              key={option}
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
              {option === 'face1' ? 'Face 1' : option === 'face2' ? 'Face 2' : option === 'both' ? 'Both' : 'Neither'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FaceFusion;
