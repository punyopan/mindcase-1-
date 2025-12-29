import React, { useState, useMemo, useRef } from 'react';
import { X, Lock, CheckCircle, ChevronRight } from '../icon';
import { puzzleEvidence } from '../../data/puzzleEvidence';
import MemoryPattern from './MemoryPattern';
import LogicGrid from './LogicGrid';
import WordCipher from './WordCipher';
import VisualMatching from './VisualMatching';
import ColorSequence from './ColorSequence';
import MathPuzzle from './MathPuzzle';
import WordScramble from './WordScramble';
import QuickMath from './QuickMath';
import ChainBreaker from './ChainBreaker';
import EvidenceWeight from './EvidenceWeight';
import BestTradeOff from './BestTradeOff';
import LogicCompression from './LogicCompression';
import LogicTiles from './LogicTiles';
import SignalVsNoise from './SignalVsNoise';
import CauseEffectFlow from './CauseEffectFlow';
import MinimalProof from './MinimalProof';

const MinigameManager = ({ puzzle, onClose, onEvidenceUnlock }) => {
  // Use ref to track completed minigames synchronously
  const completedMinigamesRef = useRef([]);
  // All 20 available minigames with progressive difficulty (NEW: visual reasoning games)
  const allMinigames = useMemo(() => [
    // Easy games - visual/pattern
    { name: 'Color Sequence', component: ColorSequence, difficulty: 'easy', icon: '🎨' },
    { name: 'Word Scramble', component: WordScramble, difficulty: 'easy', icon: '🔤' },
    { name: 'Logic Tiles', component: LogicTiles, difficulty: 'easy', icon: '🔷' },
    { name: 'Signal vs Noise', component: SignalVsNoise, difficulty: 'easy', icon: '📊' },
    { name: 'Memory Pattern', component: MemoryPattern, difficulty: 'easy', icon: '🧠' },
    // Medium games - reasoning & analysis
    { name: 'Logic Grid', component: LogicGrid, difficulty: 'medium', icon: '🔍' },
    { name: 'Word Cipher', component: WordCipher, difficulty: 'medium', icon: '🔐' },
    { name: 'Evidence Weight', component: EvidenceWeight, difficulty: 'medium', icon: '⚖️' },
    { name: 'Cause Effect Flow', component: CauseEffectFlow, difficulty: 'medium', icon: '🔀' },
    { name: 'Minimal Proof', component: MinimalProof, difficulty: 'medium', icon: '🎯' },
    // Hard games - reasoning & critical thinking
    { name: 'Math Puzzle', component: MathPuzzle, difficulty: 'hard', icon: '➗' },
    { name: 'Visual Matching', component: VisualMatching, difficulty: 'hard', icon: '🧩' },
    { name: 'Quick Math', component: QuickMath, difficulty: 'hard', icon: '⏱️' },
    { name: 'Chain Breaker', component: ChainBreaker, difficulty: 'hard', icon: '🔗' },
    { name: 'Best Trade-Off', component: BestTradeOff, difficulty: 'hard', icon: '🎯' },
    { name: 'Logic Compression', component: LogicCompression, difficulty: 'hard', icon: '📝' },
    { name: 'Memory Pattern 2', component: MemoryPattern, difficulty: 'hard', icon: '🧠' }
  ], []);

  // Select 3 minigames with escalating difficulty (easy→medium→hard)
  const selectedMinigames = useMemo(() => {
    const seed = String(puzzle.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (index) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };

    // Separate by difficulty
    const easyGames = allMinigames.filter(g => g.difficulty === 'easy');
    const mediumGames = allMinigames.filter(g => g.difficulty === 'medium');
    const hardGames = allMinigames.filter(g => g.difficulty === 'hard');

    // Pick one from each difficulty level
    const selectedEasy = easyGames[Math.floor(random(1) * easyGames.length)];
    const selectedMedium = mediumGames[Math.floor(random(2) * mediumGames.length)];
    const selectedHard = hardGames[Math.floor(random(3) * hardGames.length)];

    return [selectedEasy, selectedMedium, selectedHard];
  }, [puzzle.id, allMinigames]);

  const [currentMinigameIndex, setCurrentMinigameIndex] = useState(0);
  const [completedMinigames, setCompletedMinigames] = useState([]);
  const [unlockedEvidence, setUnlockedEvidence] = useState([]);

  // Get specific evidence for this puzzle from database
  const evidencePieces = useMemo(() => {
    const puzzleData = puzzleEvidence[puzzle.id];

    if (puzzleData && puzzleData.clues) {
      return puzzleData.clues;
    }

    // Fallback for puzzles without specific evidence
    return [
      {
        title: 'Initial Observation',
        content: `Key details about ${puzzle.title.toLowerCase()} have been discovered.`,
        icon: '📋'
      },
      {
        title: 'Further Evidence',
        content: `Additional information reveals important patterns in this case.`,
        icon: '🔬'
      },
      {
        title: 'Final Clue',
        content: `You now have all evidence needed to analyze: "${puzzle.title}"`,
        icon: '📄'
      }
    ];
  }, [puzzle]);

  const currentMinigame = selectedMinigames[currentMinigameIndex];
  const CurrentGameComponent = currentMinigame.component;

  const handleMinigameComplete = (result) => {
    // Prevent duplicate completions using ref for immediate synchronous check
    if (completedMinigamesRef.current.includes(currentMinigameIndex)) {
      return;
    }

    // Mark minigame as completed in ref FIRST for immediate protection
    completedMinigamesRef.current = [...completedMinigamesRef.current, currentMinigameIndex];

    // Then update state for UI
    const newCompleted = [...completedMinigames, currentMinigameIndex];
    setCompletedMinigames(newCompleted);

    // Unlock evidence
    const evidence = evidencePieces[currentMinigameIndex];
    const newUnlocked = [...unlockedEvidence, evidence];
    setUnlockedEvidence(newUnlocked);

    // Notify parent
    if (onEvidenceUnlock) {
      onEvidenceUnlock(evidence, newCompleted.length, selectedMinigames.length);
    }

    // Check if all minigames completed
    if (newCompleted.length === selectedMinigames.length) {
      setTimeout(() => {
        alert(`🎉 All evidence collected for "${puzzle.title}"!\n\nYou can now analyze this case using the unlocked evidence. Click the "🔍 Analyze" button on the case card to begin your analysis.`);
      }, 1500);
    }
  };

  const selectMinigame = (index) => {
    // Can only play in order or already completed ones
    if (index <= completedMinigames.length) {
      setCurrentMinigameIndex(index);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 border-2 border-amber-700/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 to-amber-900 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                🕵️ Evidence Collection: {puzzle.icon} {puzzle.title}
              </h2>
              <p className="text-amber-200 text-sm">Complete minigames (Easy → Medium → Hard) to unlock evidence</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Case Brief */}
          {puzzleEvidence[puzzle.id] && (
            <div className="bg-black/30 border border-amber-600/30 rounded-lg p-3">
              <p className="text-amber-100 text-sm font-medium">
                📋 Case Brief: {puzzleEvidence[puzzle.id].brief}
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 p-6 max-h-[calc(90vh-100px)] overflow-auto">
          {/* Minigame Selector - Left Column */}
          <div className="space-y-3">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>🎮</span> Minigames (3 Random)
            </h3>
            {selectedMinigames.map((game, index) => {
              const isCompleted = completedMinigames.includes(index);
              const isLocked = index > completedMinigames.length;
              const isCurrent = index === currentMinigameIndex;

              return (
                <button
                  key={index}
                  onClick={() => selectMinigame(index)}
                  disabled={isLocked}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    isCurrent
                      ? 'border-amber-500 bg-amber-900/30'
                      : isCompleted
                      ? 'border-green-700 bg-green-900/20'
                      : isLocked
                      ? 'border-stone-700 bg-stone-900/40 cursor-not-allowed opacity-50'
                      : 'border-stone-700 bg-stone-900/60 hover:border-amber-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{game.icon}</span>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 text-stone-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                  <div className="text-white font-medium text-sm">{game.name}</div>
                  <div className="text-stone-400 text-xs mt-1 capitalize">{game.difficulty}</div>
                </button>
              );
            })}

            {/* Progress */}
            <div className="bg-stone-900/60 border border-stone-700 rounded-xl p-4 mt-4">
              <div className="text-stone-300 text-sm mb-2">Overall Progress:</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-stone-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(completedMinigames.length / selectedMinigames.length) * 100}%` }}
                  />
                </div>
                <span className="text-amber-400 font-bold text-sm">
                  {completedMinigames.length}/{selectedMinigames.length}
                </span>
              </div>
            </div>
          </div>

          {/* Current Minigame - Middle Column */}
          <div className="md:col-span-2">
            <CurrentGameComponent
              onComplete={handleMinigameComplete}
              difficulty={currentMinigame.difficulty}
            />

            {/* Unlocked Evidence */}
            {unlockedEvidence.length > 0 && (
              <div className="mt-6">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span>📂</span> Unlocked Evidence ({unlockedEvidence.length}/3)
                </h3>
                <div className="space-y-2">
                  {unlockedEvidence.map((evidence) => (
                    <div
                      key={evidence.id}
                      className="bg-green-900/20 border border-green-700/50 rounded-lg p-3 animate-[fadeInScale_0.5s_ease-out]"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{evidence.icon}</span>
                        <div>
                          <div className="text-green-300 font-medium text-sm">{evidence.title}</div>
                          <div className="text-green-400/80 text-xs mt-1">{evidence.content}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {completedMinigames.length === selectedMinigames.length && (
                  <div className="mt-4 bg-amber-900/30 border border-amber-600/50 rounded-lg p-4">
                    <p className="text-amber-200 text-sm text-center">
                      ✅ All evidence collected! Close this window and click <strong>🔍 Analyze</strong> on the case card to use your evidence.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinigameManager;
