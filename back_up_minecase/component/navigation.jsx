import { Home, FolderOpen, Puzzle, Play, User, Settings, Brain } from './icon';

const NavigationBar = ({
  showNavBar,
  screen,
  selectedTopic,
  dailyPuzzleCompleted,
  lastOpenedPuzzle,
  showProfilePanel,
  showCognitiveTrainer,
  setScreen,
  setSelectedTopic,
  navigateTo,
  setDailyPuzzleTimer,
  continueLastPuzzle,
  setShowProfilePanel,
  setShowCognitiveTrainer
}) => {
  if (!showNavBar) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-stone-900/95 backdrop-blur-sm border-t-2 border-amber-700/50 z-40 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-around items-center">
          <button
            onClick={() => {
              setShowCognitiveTrainer(true);
            }}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
              showCognitiveTrainer ? 'bg-purple-700/30 text-purple-400' : 'text-stone-400 hover:text-amber-400'
            }`}
          >
            <Brain className="w-6 h-6" />
            <span className="text-xs font-medium">Training</span>
          </button>

          <button
            onClick={() => navigateTo('topics', null)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
              screen === 'topics' && !selectedTopic ? 'bg-red-700/30 text-red-400' : 'text-stone-400 hover:text-amber-400'
            }`}
          >
            <FolderOpen className="w-6 h-6" />
            <span className="text-xs font-medium">Case Files</span>
          </button>

          <button
            onClick={() => {
              setScreen('dailyMinigames');
              setDailyPuzzleTimer(0);
            }}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all relative ${
              screen === 'dailyMinigames' ? 'bg-red-700/30 text-red-400' : 'text-stone-400 hover:text-amber-400'
            }`}
          >
            {!dailyPuzzleCompleted && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
            <Puzzle className="w-6 h-6" />
            <span className="text-xs font-medium">Daily</span>
          </button>

          <button
            onClick={continueLastPuzzle}
            disabled={!lastOpenedPuzzle}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
              !lastOpenedPuzzle ? 'opacity-40 cursor-not-allowed text-stone-600' : 'text-stone-400 hover:text-amber-400'
            }`}
          >
            <Play className="w-6 h-6" />
            <span className="text-xs font-medium">Continue</span>
          </button>

          <button
            onClick={() => setShowProfilePanel(true)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
              showProfilePanel ? 'bg-red-700/30 text-red-400' : 'text-stone-400 hover:text-amber-400'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </button>

          <button
            onClick={() => setScreen('settings')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
              screen === 'settings' ? 'bg-red-700/30 text-red-400' : 'text-stone-400 hover:text-amber-400'
            }`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
