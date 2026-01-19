import { X, Puzzle, Calendar, CheckCircle } from '../icon';

const DailyPuzzleModal = ({
  showDailyPuzzle,
  currentDailyPuzzle,
  dailyPuzzleStreak,
  dailyPuzzleTimer,
  dailyPuzzleCompleted,
  dailyPuzzleAnswer,
  setDailyPuzzleAnswer,
  setShowDailyPuzzle,
  submitDailyPuzzle
}) => {
  if (!showDailyPuzzle || !currentDailyPuzzle) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl border-2 border-amber-700/50 max-w-2xl w-full shadow-2xl animate-[fadeInScale_0.3s_ease-out]">
        {/* Header */}
        <div className="border-b border-amber-700/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-amber-600 rounded-lg flex items-center justify-center">
                <Puzzle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Daily Logic Puzzle</h3>
                <p className="text-stone-400 text-sm">{currentDailyPuzzle.type} • {currentDailyPuzzle.difficulty}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowDailyPuzzle(false);
                setDailyPuzzleAnswer('');
              }}
              className="bg-stone-700 hover:bg-stone-600 rounded-lg p-2 transition-colors"
            >
              <X className="w-5 h-5 text-amber-400" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-stone-900/60 rounded-lg px-3 py-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span className="text-white text-sm font-medium">{dailyPuzzleStreak} day streak</span>
            </div>
            <div className="flex items-center gap-2 bg-stone-900/60 rounded-lg px-3 py-2">
              <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span className="text-white text-sm font-medium">{formatTime(dailyPuzzleTimer)}</span>
            </div>
            {dailyPuzzleCompleted && (
              <div className="flex items-center gap-2 bg-green-900/60 rounded-lg px-3 py-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-bold">Completed!</span>
              </div>
            )}
          </div>
        </div>

        {/* Puzzle Content */}
        <div className="p-6">
          {!dailyPuzzleCompleted ? (
            <>
              {/* Question */}
              <div className="bg-stone-900/60 rounded-xl border border-stone-700 p-5 mb-6">
                <p className="text-white text-lg leading-relaxed">{currentDailyPuzzle.question}</p>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentDailyPuzzle.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setDailyPuzzleAnswer(option)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      dailyPuzzleAnswer === option
                        ? 'border-amber-600 bg-amber-900/30'
                        : 'border-stone-700 bg-stone-800/60 hover:border-amber-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        dailyPuzzleAnswer === option ? 'border-amber-500 bg-amber-600' : 'border-stone-600'
                      }`}>
                        {dailyPuzzleAnswer === option && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-white font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <button
                onClick={submitDailyPuzzle}
                disabled={!dailyPuzzleAnswer}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                  dailyPuzzleAnswer
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500'
                    : 'bg-stone-700 cursor-not-allowed opacity-50'
                }`}
              >
                Submit Answer
              </button>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="bg-green-900/30 border-2 border-green-600/50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-green-400">Correct!</h4>
                    <p className="text-green-300">Great logical thinking</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-lg p-4">
                  <p className="text-green-200 text-sm font-semibold mb-2">✓ Correct Answer:</p>
                  <p className="text-white font-bold text-lg mb-3">{currentDailyPuzzle.answer}</p>
                  <p className="text-green-100 text-sm leading-relaxed">{currentDailyPuzzle.explanation}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-stone-800/60 rounded-xl p-4 text-center border border-stone-700">
                  <div className="text-2xl font-bold text-amber-400">{formatTime(dailyPuzzleTimer)}</div>
                  <div className="text-stone-400 text-xs">Time Taken</div>
                </div>
                <div className="bg-stone-800/60 rounded-xl p-4 text-center border border-stone-700">
                  <div className="text-2xl font-bold text-red-400">{dailyPuzzleStreak}</div>
                  <div className="text-stone-400 text-xs">Day Streak</div>
                </div>
                <div className="bg-stone-800/60 rounded-xl p-4 text-center border border-stone-700">
                  <div className="text-2xl font-bold text-green-400">+10</div>
                  <div className="text-stone-400 text-xs">Points Earned</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowDailyPuzzle(false);
                  setDailyPuzzleAnswer('');
                }}
                className="w-full mt-6 py-3 rounded-xl font-bold bg-stone-700 hover:bg-stone-600 text-white transition-all"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyPuzzleModal;
