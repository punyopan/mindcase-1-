import React, { useState, useEffect, useMemo } from 'react';
import { X, Lock, CheckCircle, Trophy, Star, ChevronDown, ChevronUp } from '../icon';
import LogicGrid from './LogicGrid';
import WordCipher from './WordCipher';
import VisualMatching from './VisualMatching';
import ColorSequence from './ColorSequence';
import MathPuzzle from './MathPuzzle';
import QuickMath from './QuickMath';
import EvidenceWeight from './EvidenceWeight';
import LogicCompression from './LogicCompression';
import RuleDrift from './RuleDrift';
import MissingConstraint from './MissingConstraint';
import MemoryConstellation from './MemoryConstellation';
import ColorChaosKitchen from './ColorChaosKitchen';
import ShadowDetective from './ShadowDetective';
import EmotionGarden from './EmotionGarden';
import PathPainter from './PathPainter';
import RhythmReef from './RhythmReef';
import GravityGuess from './GravityGuess';
import FaceFusion from './FaceFusion';

const DailyMinigame = ({ onClose, userSubscription, onOpenSubscription }) => {
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [completedGames, setCompletedGames] = useState([]);
  const [dailyProgress, setDailyProgress] = useState(null);
  const [userTokens, setUserTokens] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [minigameStartTime, setMinigameStartTime] = useState(Date.now()); // Track start time for analytics
  const [showCompletedList, setShowCompletedList] = useState(true);

  // All available minigames
  const allMinigames = useMemo(() => [
    { name: 'Color Sequence', component: ColorSequence, difficulty: 'easy', icon: '🎨' },
    { name: 'Memory Constellation', component: MemoryConstellation, difficulty: 'easy', icon: '⭐' },
    { name: 'Emotion Garden', component: EmotionGarden, difficulty: 'easy', icon: '🌸' },
    { name: 'Logic Grid', component: LogicGrid, difficulty: 'medium', icon: '🔍' },
    { name: 'Word Cipher', component: WordCipher, difficulty: 'medium', icon: '🔐' },
    { name: 'Evidence Weight', component: EvidenceWeight, difficulty: 'medium', icon: '⚖️' },
    { name: 'Rule Drift', component: RuleDrift, difficulty: 'medium', icon: '🔄' },
    { name: 'Missing Constraint', component: MissingConstraint, difficulty: 'medium', icon: '🔍' },
    { name: 'Color Chaos Kitchen', component: ColorChaosKitchen, difficulty: 'medium', icon: '🍳' },
    { name: 'Shadow Detective', component: ShadowDetective, difficulty: 'medium', icon: '🔍' },
    { name: 'Path Painter', component: PathPainter, difficulty: 'hard', icon: '🎨' },
    { name: 'Rhythm Reef', component: RhythmReef, difficulty: 'hard', icon: '🌊' },
    { name: 'Gravity Guess', component: GravityGuess, difficulty: 'hard', icon: '🎯' },
    { name: 'Face Fusion', component: FaceFusion, difficulty: 'hard', icon: '🎭' },
    { name: 'Math Puzzle', component: MathPuzzle, difficulty: 'hard', icon: '➗' },
    { name: 'Visual Matching', component: VisualMatching, difficulty: 'hard', icon: '🧩' },
    { name: 'Quick Math', component: QuickMath, difficulty: 'hard', icon: '⏱️' },
    { name: 'Logic Compression', component: LogicCompression, difficulty: 'hard', icon: '📝' }
  ], []);

  // Get today's date string for seed
  const getTodayString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  const isSubscribed = userSubscription?.status === 'active';

  // Generate minigames for today
  const todaysMinigames = useMemo(() => {
    // Premium users get all minigames
    if (isSubscribed) {
      return allMinigames;
    }

    // Free users get 3 random minigames per day
    const dateString = getTodayString();
    const seed = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Seeded random function
    const seededRandom = (index) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };

    // Shuffle array with seeded random
    const shuffled = [...allMinigames].sort((a, b) => seededRandom(a.name.charCodeAt(0)) - seededRandom(b.name.charCodeAt(0)));

    // Take first 3 games
    return shuffled.slice(0, 3);
  }, [allMinigames, isSubscribed]);

  // Load daily progress from localStorage
  useEffect(() => {
    const storedProgress = localStorage.getItem('daily_minigame_progress');
    if (storedProgress) {
      const progress = JSON.parse(storedProgress);
      // Check if it's from today
      if (progress.date === getTodayString()) {
        setDailyProgress(progress);
        setCompletedGames(progress.completed || []);
      } else {
        // New day, reset progress
        const newProgress = {
          date: getTodayString(),
          completed: [],
          scores: []
        };
        localStorage.setItem('daily_minigame_progress', JSON.stringify(newProgress));
        setDailyProgress(newProgress);
      }
    } else {
      // First time
      const newProgress = {
        date: getTodayString(),
        completed: [],
        scores: []
      };
      localStorage.setItem('daily_minigame_progress', JSON.stringify(newProgress));
      setDailyProgress(newProgress);
    }

    // Load user tokens
    try {
      const userId = localStorage.getItem('userId') || 'default_user';
      const tokens = window.UserProgressService?.getTokens(userId);
      setUserTokens(tokens?.tokens || 0);
    } catch (e) {
      console.warn('Failed to load tokens:', e);
    }
  }, []);

  const handleMinigameComplete = (result) => {
    // Mark game as completed
    const newCompleted = [...completedGames, currentGameIndex];
    setCompletedGames(newCompleted);

    // Calculate time spent (in minutes)
    const timeSpent = Math.floor((Date.now() - minigameStartTime) / 60000);

    // Update localStorage
    const updatedProgress = {
      date: getTodayString(),
      completed: newCompleted,
      scores: [...(dailyProgress?.scores || []), { game: todaysMinigames[currentGameIndex].name, ...result }]
    };
    localStorage.setItem('daily_minigame_progress', JSON.stringify(updatedProgress));
    setDailyProgress(updatedProgress);

    // Award token (1 token per minigame completion)
    try {
      const userId = localStorage.getItem('userId') || 'default_user';
      const tokenResult = window.UserProgressService?.awardTokens(userId, 1);

      if (tokenResult?.success) {
        // Update token display
        setUserTokens(tokenResult.tokens);

        // Show token reward notification
        setTimeout(() => {
          alert(`🎉 Minigame complete! +1 token earned\n\nTotal tokens: ${tokenResult.tokens}\nToday: ${tokenResult.tokensEarnedToday}/${tokenResult.dailyLimit}`);
        }, 500);
      } else if (tokenResult?.reason === 'daily_limit_reached') {
        setTimeout(() => {
          alert('🎉 Minigame complete!\n\n⚠️ Daily token limit reached. Come back tomorrow for more tokens!');
        }, 500);
      }

      // Record minigame completion for analytics (Advanced Analytics tracking)
      try {
        const gameName = todaysMinigames[currentGameIndex].name;
        const success = result?.success !== false; // Assume success unless explicitly false

        window.UserProgressService?.recordMinigameCompletion(
          userId,
          gameName,
          timeSpent,
          success
        );
      } catch (e) {
        console.warn('Failed to record minigame analytics:', e);
      }
    } catch (e) {
      console.warn('Token award failed:', e);
    }

    // Show completion message (only for free users completing 3 games)
    const totalGames = isSubscribed ? todaysMinigames.length : 3;
    if (newCompleted.length === totalGames && !isSubscribed) {
      setTimeout(() => {
        const userId = localStorage.getItem('userId') || 'default_user';
        const tokens = window.UserProgressService?.getTokens(userId);
        alert(`🎉 All daily minigames complete!\n\n💰 Total tokens: ${tokens?.tokens || 0}\n📅 Come back tomorrow for new challenges.`);
      }, 1500);
    }

    // Reset start time for next game
    setMinigameStartTime(Date.now());
  };

  const selectGame = (index) => {
    // Premium users can play any game, free users must play in order
    if (isSubscribed) {
      setCurrentGameIndex(index);
      setMinigameStartTime(Date.now()); // Reset timer when switching games
    } else {
      // Free users can only play in order or already completed ones
      if (index <= completedGames.length) {
        setCurrentGameIndex(index);
        setMinigameStartTime(Date.now()); // Reset timer when switching games
      }
    }
  };

  const currentGame = todaysMinigames[currentGameIndex];
  const CurrentGameComponent = currentGame?.component;

  if (!dailyProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-stone-900/60 border-2 border-amber-700/50 rounded-2xl p-8 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-white">Loading today's challenges...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const allCompleted = completedGames.length === (isSubscribed ? todaysMinigames.length : 3);

  return (
    <div className="h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 overflow-hidden flex flex-col relative pb-20">
      {/* Animated Background Light Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Compact Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-stone-700/50 relative z-10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-1 hover:bg-stone-800 rounded transition-colors"
            title="Back to main menu"
          >
            <X className="w-4 h-4 text-stone-400" />
          </button>
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-stone-300 text-xs font-medium">
              {completedGames.length}/{isSubscribed ? allMinigames.length : 3}
            </span>
          </div>
        </div>
        {!isSubscribed && (
          <button
            onClick={() => {
              onClose();
              onOpenSubscription?.();
            }}
            className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded font-medium transition-colors"
          >
            ⭐ Upgrade
          </button>
        )}
      </div>

      {/* Main Content - Fixed Height Grid */}
      <div className="flex-1 grid md:grid-cols-3 gap-4 p-4 overflow-hidden relative z-10 max-h-[calc(100vh-5rem)]">
        {/* Game Selector - Left Column with Scrollable List */}
        <div className="flex flex-col h-full overflow-hidden">
          <h3 className="text-white font-bold mb-2 flex items-center gap-2 text-sm">
            <span>🎯</span> Today's Challenges
          </h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {todaysMinigames.map((game, index) => {
              const isCompleted = completedGames.includes(index);
              // Premium users can access all games, free users must play in order
              const isLocked = !isSubscribed && index > completedGames.length;
              const isCurrent = index === currentGameIndex;

              return (
                <button
                  key={index}
                  onClick={() => selectGame(index)}
                  disabled={isLocked}
                  className={`w-full p-2 rounded-lg border transition-all text-left ${
                    isCurrent
                      ? 'border-amber-500 bg-amber-900/30 shadow-lg'
                      : isCompleted
                      ? 'border-green-700 bg-green-900/20'
                      : isLocked
                      ? 'border-stone-700 bg-stone-900/40 cursor-not-allowed opacity-50'
                      : 'border-stone-700 bg-stone-900/60 hover:border-amber-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg">{game.icon}</span>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4 text-stone-600" />
                    ) : (
                      <Star className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className="text-white font-medium text-xs">{game.name}</div>
                  <div className={`text-[10px] mt-0.5 capitalize ${
                    game.difficulty === 'easy' ? 'text-green-400' :
                    game.difficulty === 'medium' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {game.difficulty}
                  </div>
                </button>
              );
            })}

            {/* Progress Bar */}
            <div className="bg-stone-900/60 border border-stone-700 rounded-lg p-2 mt-2">
              <div className="text-stone-300 text-[10px] mb-1">Progress:</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-stone-800 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-green-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(completedGames.length / (isSubscribed ? allMinigames.length : 3)) * 100}%` }}
                  />
                </div>
                <span className="text-amber-400 font-bold text-[10px]">
                  {completedGames.length}/{isSubscribed ? allMinigames.length : 3}
                </span>
              </div>
            </div>

            {/* Subscription Prompt */}
            {!isSubscribed && (
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-2 mt-2">
                <p className="text-blue-300 text-[10px] mb-1">
                  ⭐ Premium: All {allMinigames.length} games!
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenSubscription?.();
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold py-1 px-2 rounded hover:from-blue-500 hover:to-purple-500 transition-all"
                >
                  Upgrade
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Current Minigame - Middle/Right Columns */}
        <div className="md:col-span-2 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-hidden flex flex-col">
            {!allCompleted ? (
              <>
              {/* Difficulty Selector */}
              <div className="bg-stone-900/60 border border-stone-700 rounded-xl p-3 mb-3 flex-shrink-0">
              <h4 className="text-white font-semibold mb-2 text-xs">Difficulty:</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedDifficulty('easy')}
                  className={`py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                    selectedDifficulty === 'easy'
                      ? 'bg-green-600 text-white'
                      : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                  }`}
                >
                  Easy
                </button>
                <button
                  onClick={() => setSelectedDifficulty('medium')}
                  className={`py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                    selectedDifficulty === 'medium'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setSelectedDifficulty('hard')}
                  className={`py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                    selectedDifficulty === 'hard'
                      ? 'bg-red-600 text-white'
                      : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                  }`}
                >
                  Hard
                </button>
              </div>
            </div>

            {/* Current Game */}
            <div className="flex-1 overflow-hidden flex items-center justify-center">
              <div className="w-full h-full max-h-full overflow-y-auto">
                {CurrentGameComponent && (
                  <CurrentGameComponent
                    key={`${currentGameIndex}-${selectedDifficulty}`}
                    onComplete={handleMinigameComplete}
                    difficulty={selectedDifficulty}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gradient-to-br from-green-900/30 to-amber-900/30 border-2 border-green-500/50 rounded-xl p-8 text-center">
            <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">All Done for Today! 🎉</h3>
            <p className="text-green-200 mb-4">
              You've completed all 3 daily minigames. Come back tomorrow for new challenges!
            </p>
            <div className="bg-black/30 border border-amber-600/30 rounded-lg p-4 mt-4">
              <p className="text-amber-200 text-sm">
                📅 Next reset: <strong>Tomorrow at midnight</strong>
              </p>
            </div>
          </div>
        )}

        {/* Completion Summary */}
        {completedGames.length > 0 && !allCompleted && (
          <div className="mt-6 bg-stone-900/60 border border-stone-700 rounded-xl p-4">
            <button
              onClick={() => setShowCompletedList(!showCompletedList)}
              className="w-full text-white font-semibold mb-3 flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Completed Today ({completedGames.length})</span>
              {showCompletedList ? (
                <ChevronUp className="w-4 h-4 text-stone-400 ml-auto" />
              ) : (
                <ChevronDown className="w-4 h-4 text-stone-400 ml-auto" />
              )}
            </button>
            {showCompletedList && (
              <div className="space-y-2">
                {completedGames.map((gameIndex) => {
                  const game = todaysMinigames[gameIndex];
                  return (
                    <div key={gameIndex} className="flex items-center gap-3 text-sm text-stone-300">
                      <span className="text-xl">{game.icon}</span>
                      <span>{game.name}</span>
                      <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                    </div>
                  );
                })}
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

export default DailyMinigame;
