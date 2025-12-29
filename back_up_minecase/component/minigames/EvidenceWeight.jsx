import React, { useState, useEffect } from 'react';
import { CheckCircle, X, AlertCircle } from '../icon';

const EvidenceWeight = ({ onComplete, difficulty = 'medium' }) => {
  const [scenario, setScenario] = useState(null);
  const [userRanking, setUserRanking] = useState([]);
  const [gameState, setGameState] = useState('playing');
  const [attempts, setAttempts] = useState(0);

  const scenarios = [
    {
      claim: "Coffee improves cognitive performance",
      evidence: [
        { id: 1, text: "A tweet from a celebrity saying 'Coffee makes me smarter!'", strength: 1, reason: "Anecdote from non-expert" },
        { id: 2, text: "Your personal experience: you feel more alert after coffee", strength: 2, reason: "Personal anecdote - real but not generalizable" },
        { id: 3, text: "A peer-reviewed study of 50 people showing 15% improvement on memory tests", strength: 3, reason: "Controlled study with measurable outcomes" }
      ]
    },
    {
      claim: "Reading before bed improves sleep quality",
      evidence: [
        { id: 1, text: "An article titled '10 Benefits of Reading' with no sources cited", strength: 1, reason: "No source verification possible" },
        { id: 2, text: "A survey where 100 people self-reported better sleep after reading", strength: 2, reason: "Self-reported data from decent sample size" },
        { id: 3, text: "Sleep lab study tracking brain waves of 200 subjects, showing improved REM sleep", strength: 3, reason: "Objective measurements from controlled study" }
      ]
    },
    {
      claim: "Exercise reduces anxiety",
      evidence: [
        { id: 1, text: "Your friend says exercise helped their anxiety", strength: 1, reason: "Single anecdotal case" },
        { id: 2, text: "A blog post citing 'research shows' without linking to actual studies", strength: 2, reason: "Claims research exists but no verification" },
        { id: 3, text: "Meta-analysis of 40 studies with 5,000+ participants showing consistent anxiety reduction", strength: 3, reason: "Multiple studies aggregated, large sample" }
      ]
    },
    {
      claim: "Plant-based diets reduce heart disease risk",
      evidence: [
        { id: 1, text: "A documentary featuring people who recovered after going plant-based", strength: 1, reason: "Survivorship bias - only shows successes" },
        { id: 2, text: "Observational study of 1,000 vegetarians showing lower heart disease rates", strength: 2, reason: "Correlation found but causation unclear" },
        { id: 3, text: "Randomized controlled trial comparing plant vs. meat diet with measured cholesterol changes", strength: 3, reason: "Experimental design with control group" }
      ]
    },
    {
      claim: "Meditation improves focus",
      evidence: [
        { id: 1, text: "A motivational Instagram post with 10k likes", strength: 1, reason: "Popularity doesn't equal evidence" },
        { id: 2, text: "Your teacher said meditation helped them focus better", strength: 2, reason: "Expert opinion but still anecdotal" },
        { id: 3, text: "Brain imaging study showing increased prefrontal cortex activity in meditators", strength: 3, reason: "Objective biological measurements" }
      ]
    }
  ];

  useEffect(() => {
    generateScenario();
    // Play game start sound
    try {
      window.SoundService?.playSound('gameStart');
    } catch (e) {
      console.warn('Sound failed:', e);
    }
  }, []);

  const generateScenario = () => {
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    setScenario(randomScenario);
    setUserRanking([]);
    setGameState('playing');
  };

  const handleEvidenceClick = (evidence) => {
    if (gameState !== 'playing') return;

    // If already selected, remove it
    if (userRanking.find(e => e.id === evidence.id)) {
      setUserRanking(userRanking.filter(e => e.id !== evidence.id));
    } else {
      // Add to ranking
      setUserRanking([...userRanking, evidence]);
      // Play button click sound
      try {
        window.SoundService?.playSound('buttonClick');
      } catch (e) {
        console.warn('Sound failed:', e);
      }
    }
  };

  const handleSubmit = () => {
    if (userRanking.length !== 3) return;

    // Check if ranking is correct (by strength)
    const correct = userRanking[0].strength === 1 &&
                   userRanking[1].strength === 2 &&
                   userRanking[2].strength === 3;

    if (correct) {
      setGameState('won');
      // Play success sound
      try {
        window.SoundService?.playSound('gameSuccess');
      } catch (e) {
        console.warn('Sound failed:', e);
      }
      setTimeout(() => {
        onComplete({ success: true, attempts: attempts + 1 });
      }, 3000);
    } else {
      setGameState('lost');
      setAttempts(attempts + 1);
      // Play fail sound
      try {
        window.SoundService?.playSound('gameFail');
      } catch (e) {
        console.warn('Sound failed:', e);
      }
    }
  };

  const handleRetry = () => {
    generateScenario();
  };

  if (!scenario) return null;

  return (
    <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">⚖️ Evidence Weight</h3>
        <p className="text-stone-400 text-sm">
          {gameState === 'playing' ? 'Rank the evidence from weakest to strongest' : 'Analysis complete!'}
        </p>
        {attempts > 0 && <p className="text-amber-400 text-xs mt-1">Attempts: {attempts + 1}</p>}
      </div>

      {/* Claim */}
      <div className="bg-stone-800/60 border border-stone-700 rounded-lg p-4 mb-6">
        <h4 className="text-amber-400 font-semibold text-sm mb-2">Claim:</h4>
        <p className="text-white font-medium">{scenario.claim}</p>
      </div>

      {/* Evidence Cards */}
      <div className="mb-6">
        <h4 className="text-white font-medium text-sm mb-3">Available Evidence (click to add to ranking):</h4>
        <div className="space-y-3">
          {scenario.evidence.map((evidence) => {
            const rankIndex = userRanking.findIndex(e => e.id === evidence.id);
            const isRanked = rankIndex !== -1;

            return (
              <button
                key={evidence.id}
                onClick={() => handleEvidenceClick(evidence)}
                disabled={gameState !== 'playing'}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  isRanked
                    ? 'bg-amber-900/30 border-amber-500 shadow-lg'
                    : 'bg-stone-800/50 border-stone-700 hover:bg-stone-700/50 hover:border-amber-500/50'
                } ${gameState !== 'playing' ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
              >
                <div className="flex items-start gap-3">
                  {isRanked && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">
                      {rankIndex + 1}
                    </div>
                  )}
                  <p className="text-white text-sm flex-1 leading-relaxed">{evidence.text}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Ranking */}
      {userRanking.length > 0 && (
        <div className="mb-6 p-4 bg-stone-800/30 border border-stone-600 rounded-lg">
          <h4 className="text-white font-medium text-sm mb-3">Your Ranking (Weakest → Strongest):</h4>
          <div className="space-y-2">
            {userRanking.map((evidence, index) => (
              <div key={evidence.id} className="flex items-center gap-2 text-sm">
                <span className="text-amber-400 font-bold">{index + 1}.</span>
                <span className="text-stone-300 truncate">{evidence.text.substring(0, 50)}...</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      {gameState === 'playing' && (
        <button
          onClick={handleSubmit}
          disabled={userRanking.length !== 3}
          className={`w-full font-bold py-3 px-6 rounded-lg transition-all ${
            userRanking.length === 3
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white transform hover:scale-105'
              : 'bg-stone-700 text-stone-500 cursor-not-allowed'
          }`}
        >
          {userRanking.length === 3 ? 'Submit Ranking' : `Select all 3 pieces (${userRanking.length}/3)`}
        </button>
      )}

      {/* Feedback */}
      {gameState !== 'playing' && (
        <div className={`p-4 rounded-lg mb-4 ${
          gameState === 'won'
            ? 'bg-green-900/30 border border-green-500/50'
            : 'bg-red-900/30 border border-red-500/50'
        }`}>
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              gameState === 'won' ? 'text-green-400' : 'text-red-400'
            }`} />
            <p className={`text-sm font-medium ${
              gameState === 'won' ? 'text-green-200' : 'text-red-200'
            }`}>
              {gameState === 'won' ? '✓ Perfect ranking!' : '✗ Not quite right. Here\'s the correct ranking:'}
            </p>
          </div>

          {/* Show correct ranking with explanations */}
          <div className="space-y-3">
            {[...scenario.evidence].sort((a, b) => a.strength - b.strength).map((evidence, index) => (
              <div key={evidence.id} className="bg-stone-800/50 p-3 rounded-lg">
                <div className="flex items-start gap-2 mb-1">
                  <span className={`font-bold ${
                    index === 0 ? 'text-red-400' : index === 1 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {index + 1}. {index === 0 ? 'WEAKEST' : index === 1 ? 'MODERATE' : 'STRONGEST'}
                  </span>
                </div>
                <p className="text-white text-sm mb-2">{evidence.text}</p>
                <p className="text-stone-400 text-xs italic">Why: {evidence.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Retry Button */}
      {gameState === 'lost' && (
        <button
          onClick={handleRetry}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 mt-4"
        >
          Try Another Scenario
        </button>
      )}

      {/* Hint */}
      {gameState === 'playing' && (
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
          <p className="text-blue-300 text-xs">
            💡 Tip: Strong evidence is verifiable, objective, controlled, and from larger samples. Anecdotes and opinions are weakest.
          </p>
        </div>
      )}
    </div>
  );
};

export default EvidenceWeight;
