import React, { useState, useEffect } from 'react';
import { CheckCircle, X, AlertCircle } from '../icon';

const LogicCompression = ({ onComplete, difficulty = 'medium' }) => {
  const [scenario, setScenario] = useState(null);
  const [selected, setSelected] = useState(null);
  const [gameState, setGameState] = useState('playing');
  const [attempts, setAttempts] = useState(0);

  const scenarios = [
    {
      longExplanation: "The reason we can't just look at test scores to judge schools is that test scores reflect many things besides teaching quality. They reflect the wealth of families in the area because wealthier families can afford tutors. They reflect English language proficiency because students learning English score lower regardless of teaching. They reflect neighborhood stability because students who move frequently score lower. So when School A scores higher than School B, it might just mean School A serves wealthier, English-speaking, stable families - not that School A teaches better.",
      options: [
        { id: 1, text: "Test scores don't measure teaching quality", reason: "Too vague - doesn't explain why" },
        { id: 2, text: "Test scores reflect family wealth, language, and stability - not just teaching", reason: "BEST - captures the key point and reason" },
        { id: 3, text: "Schools with higher test scores aren't necessarily better", reason: "True but doesn't explain the mechanism" },
        { id: 4, text: "We need to consider socioeconomic factors when comparing schools", reason: "Okay but too general - doesn't specify the issue with tests" }
      ],
      bestChoice: 2
    },
    {
      longExplanation: "People often say 'correlation doesn't equal causation' but they misunderstand what this means. It doesn't mean correlation is useless - correlation is actually really important for finding patterns. What it means is that if two things happen together (correlation), we can't automatically assume one causes the other (causation). For example, ice cream sales and drowning deaths are correlated - both increase in summer. But ice cream doesn't cause drowning. The weather (third variable) causes both.",
      options: [
        { id: 1, text: "Correlation doesn't equal causation", reason: "Just repeating the phrase, no understanding shown" },
        { id: 2, text: "Things can happen together without one causing the other", reason: "True but misses the point about why we care" },
        { id: 3, text: "Correlation shows patterns but doesn't prove one thing causes another", reason: "BEST - captures both value and limitation" },
        { id: 4, text: "You need experiments to prove causation, not just observation", reason: "True but too narrow - misses the point about correlation's value" }
      ],
      bestChoice: 3
    },
    {
      longExplanation: "The fundamental problem with anecdotal evidence isn't that it's lying or made up - usually it's completely true. The problem is that it's not representative. When you hear 'My aunt smoked until 90 and never got cancer,' that's probably true! But one person's experience doesn't tell you about the average outcome. It's like picking one card from a deck and assuming it represents the whole deck. Anecdotes highlight rare cases precisely because they're surprising. The boring, typical cases don't get shared.",
      options: [
        { id: 1, text: "Anecdotal evidence is unreliable", reason: "Too vague - doesn't explain the specific problem" },
        { id: 2, text: "Anecdotes are true but not representative of average outcomes", reason: "BEST - distinguishes truth from generalizability" },
        { id: 3, text: "Personal stories don't prove anything about larger patterns", reason: "Close but sounds dismissive of anecdotes' truth" },
        { id: 4, text: "You can't trust someone's individual experience", reason: "Wrong - anecdotes ARE trustworthy about that person" }
      ],
      bestChoice: 2
    },
    {
      longExplanation: "Confirmation bias is when we pay more attention to information that supports what we already believe and ignore information that contradicts it. This happens automatically - we're not consciously choosing to be biased. For example, if you believe coffee is healthy, you'll notice and remember studies showing benefits, but skip over studies showing risks. The dangerous thing is that this makes our beliefs stronger over time, even if evidence is mixed, because we're only adding to one side of the scale.",
      options: [
        { id: 1, text: "Confirmation bias makes us ignore contradicting evidence", reason: "True but incomplete - misses the mechanism" },
        { id: 2, text: "We automatically notice evidence that supports our beliefs more than evidence against them", reason: "BEST - explains the automatic nature and the imbalance" },
        { id: 3, text: "People only see what they want to see", reason: "Too strong - implies it's intentional" },
        { id: 4, text: "Confirmation bias strengthens our existing beliefs", reason: "True but describes effect, not the process" }
      ],
      bestChoice: 2
    },
    {
      longExplanation: "Survivorship bias happens when we only look at the successes and forget about all the failures that we can't see anymore. The classic example is WWII planes: analysts wanted to armor the parts of returning planes that had bullet holes. But a statistician pointed out that planes hit in those spots survived - the planes that DIDN'T return were likely hit elsewhere. By only studying survivors, they would have armored the wrong parts. This happens all the time: we see successful college dropouts and think college doesn't matter, forgetting the dropouts who failed.",
      options: [
        { id: 1, text: "Survivorship bias means we only study successes, not failures", reason: "True but doesn't explain why it's misleading" },
        { id: 2, text: "We can't see failures, so we overestimate what made successes work", reason: "BEST - explains the invisibility problem and the consequence" },
        { id: 3, text: "Looking only at survivors gives a distorted picture", reason: "True but too vague about how it distorts" },
        { id: 4, text: "Success stories don't represent typical outcomes", reason: "Related but misses the specific mechanism of survivorship bias" }
      ],
      bestChoice: 2
    },
    {
      longExplanation: "The placebo effect is fascinating because it shows that belief alone can cause real physical changes. When people think they're getting medicine (even if it's just sugar pills), they often get better - not because of the pill's chemistry, but because their brain expects to get better and that expectation triggers real biological responses. This is why medical studies need control groups: if a new drug makes 70% of people better, but placebo makes 60% better, the drug is only adding 10% real benefit. The tricky part is the placebo effect is real improvement, not imaginary.",
      options: [
        { id: 1, text: "Placebos work because people believe they will", reason: "True but misses that the effects are real, not just belief" },
        { id: 2, text: "Belief triggers real biological changes, so we need controls to separate drug effects from expectation effects", reason: "BEST - captures both mechanism and why it matters for research" },
        { id: 3, text: "Sugar pills can make people better", reason: "True but sounds trivial without explaining mechanism" },
        { id: 4, text: "The placebo effect is why we do double-blind studies", reason: "True but backwards - explains the solution not the phenomenon" }
      ],
      bestChoice: 2
    },
    {
      longExplanation: "Selection bias occurs when the sample you're studying isn't representative of the population you want to make conclusions about. A classic case: if you survey people at a gym about exercise habits, you'll get wildly inaccurate data about the general population's exercise habits - because people at the gym obviously exercise more! The selection process itself created the bias. This is different from random sampling errors - it's a systematic problem where the very method of selecting participants skews results in a predictable direction.",
      options: [
        { id: 1, text: "Selection bias is when your sample isn't representative", reason: "True but doesn't explain how or why it happens" },
        { id: 2, text: "The method of choosing participants systematically skews results", reason: "BEST - explains it's about the method and that it's systematic" },
        { id: 3, text: "You can't survey people at gyms about exercise", reason: "Overly specific example, misses the general principle" },
        { id: 4, text: "Selection bias makes research conclusions invalid", reason: "Effect not explanation - doesn't say what it IS" }
      ],
      bestChoice: 2
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
    setSelected(null);
    setGameState('playing');
  };

  const handleSelect = (optionId) => {
    if (gameState !== 'playing') return;

    setSelected(optionId);
    const correct = optionId === scenario.bestChoice;

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
      }, 2500);
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
        <h3 className="text-xl font-bold text-white mb-2">📝 Logic Compression</h3>
        <p className="text-stone-400 text-sm">
          {gameState === 'playing' ? 'Pick the best one-sentence summary' : 'Analysis complete!'}
        </p>
        {attempts > 0 && <p className="text-amber-400 text-xs mt-1">Attempts: {attempts + 1}</p>}
      </div>

      {/* Long Explanation */}
      <div className="bg-stone-800/60 border border-stone-700 rounded-lg p-4 mb-6 max-h-64 overflow-y-auto">
        <h4 className="text-amber-400 font-semibold text-sm mb-3 sticky top-0 bg-stone-800/90 pb-2">
          Long Explanation (compress this):
        </h4>
        <p className="text-white text-sm leading-relaxed">{scenario.longExplanation}</p>
      </div>

      {/* Summary Options */}
      <div className="space-y-3 mb-6">
        <h4 className="text-white font-medium text-sm">Which summary best captures the key point?</h4>
        {scenario.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            disabled={gameState !== 'playing'}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selected === option.id
                ? gameState === 'won'
                  ? 'bg-green-900/30 border-green-500 shadow-lg'
                  : 'bg-red-900/30 border-red-500 shadow-lg'
                : gameState !== 'playing' && option.id === scenario.bestChoice
                ? 'bg-green-900/20 border-green-600/50'
                : 'bg-stone-800/50 border-stone-700 hover:bg-stone-700/50 hover:border-amber-500/50'
            } ${gameState !== 'playing' ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-white text-sm leading-relaxed flex-1">{option.text}</p>
              {selected === option.id && (
                gameState === 'won' ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                )
              )}
              {gameState !== 'playing' && option.id === scenario.bestChoice && (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              )}
            </div>
            {gameState !== 'playing' && (
              <p className={`text-xs mt-2 italic ${
                option.id === scenario.bestChoice ? 'text-green-300' : 'text-stone-400'
              }`}>
                {option.reason}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {gameState !== 'playing' && (
        <div className={`p-4 rounded-lg mb-4 ${
          gameState === 'won'
            ? 'bg-green-900/30 border border-green-500/50'
            : 'bg-red-900/30 border border-red-500/50'
        }`}>
          <div className="flex items-start gap-3">
            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              gameState === 'won' ? 'text-green-400' : 'text-red-400'
            }`} />
            <p className={`text-sm ${
              gameState === 'won' ? 'text-green-200' : 'text-red-200'
            }`}>
              {gameState === 'won'
                ? '✓ Perfect! You captured both the what and the why in one clear sentence.'
                : '✗ Not quite. The best summary explains the mechanism, not just the conclusion.'}
            </p>
          </div>
        </div>
      )}

      {/* Retry Button */}
      {gameState === 'lost' && (
        <button
          onClick={handleRetry}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
        >
          Try Another Explanation
        </button>
      )}

      {/* Hint */}
      {gameState === 'playing' && (
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
          <p className="text-blue-300 text-xs">
            💡 Tip: Good summaries capture both WHAT (the phenomenon) and WHY (the mechanism). Avoid summaries that are too vague or just restate conclusions.
          </p>
        </div>
      )}
    </div>
  );
};

export default LogicCompression;
