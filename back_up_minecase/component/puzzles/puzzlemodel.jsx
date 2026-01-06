import { X, AlertCircle, Target, Send, Loader, CheckCircle, Lightbulb, Zap, ChevronDown, ChevronUp } from '../icon';
import { useState } from 'react';
import DetailedFeedback from '../feedback/DetailedFeedback';

const PuzzleModal = ({
  selectedPuzzle,
  modalVisible,
  modalAnimating,
  showFeedback,
  feedbackData,
  userAnswer,
  setUserAnswer,
  isAnalyzing,
  evaluateAnswer,
  closePuzzle
}) => {
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);

  if (!selectedPuzzle) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto transition-all duration-300 ease-out ${
      modalVisible && !modalAnimating
        ? 'bg-black/90 backdrop-blur-sm'
        : 'bg-black/0 backdrop-blur-none'
    }`}>
      <div className={`bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl border-2 border-amber-700/50 max-w-3xl w-full my-8 shadow-2xl transition-all duration-300 ease-out ${
        modalVisible && !modalAnimating
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-8'
      }`}>
        {/* Header (Refactored for no background image) */}
        <div className="flex items-start justify-between p-6 border-b border-stone-700/50 bg-stone-900/30 rounded-t-2xl">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{selectedPuzzle.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{selectedPuzzle.title}</h2>
              <span className="inline-block text-sm px-3 py-1 bg-amber-900/40 border border-amber-700/50 rounded-full text-amber-200">
                {selectedPuzzle.skillFocus}
              </span>
            </div>
          </div>

          <button
            onClick={closePuzzle}
            className="bg-stone-800 hover:bg-stone-700 rounded-full p-2 transition-colors border border-stone-600 group"
          >
            <X className="w-6 h-6 text-stone-400 group-hover:text-white transition-colors" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!showFeedback ? (
            <>
              {/* Question */}
              <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl overflow-hidden">
                {/* Puzzle illustration image */}
                {selectedPuzzle.image && (
                  <div className="relative w-full bg-stone-900 rounded-t-xl overflow-hidden">
                    <img
                      src={selectedPuzzle.image}
                      alt={selectedPuzzle.title}
                      className="w-full h-auto object-contain opacity-90"
                    />

                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <span className="text-3xl">{selectedPuzzle.icon}</span>
                      <span className="text-amber-300 text-sm font-medium bg-black/40 px-2 py-1 rounded">
                        {selectedPuzzle.skillFocus}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-amber-400 mb-3 text-lg">CASE BRIEF</h3>
                      <p className="text-stone-200 leading-relaxed whitespace-pre-line">{selectedPuzzle.question}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text input area */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-400 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Your Analysis
                  </h4>
                  <span className="text-stone-500 text-sm">{userAnswer.length} characters</span>
                </div>

                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Write your reasoning here. What should you do? What's wrong with the given conclusion? What principles apply?&#10;&#10;Think through the problem carefully before submitting..."
                  className="w-full h-48 bg-stone-800/80 border-2 border-stone-600 focus:border-amber-500 rounded-xl p-4 text-white placeholder-stone-500 resize-none transition-colors outline-none"
                />

                <p className="text-stone-500 text-sm">
                  💡 Tip: Explain your reasoning, not just your conclusion. What assumptions are being made? What's missing?
                </p>
              </div>

              {/* Submit button */}
              <button
                onClick={evaluateAnswer}
                disabled={!userAnswer.trim() || isAnalyzing}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  userAnswer.trim() && !isAnalyzing
                    ? 'bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-white shadow-lg'
                    : 'bg-stone-700 text-stone-500 cursor-not-allowed'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Analyzing Your Reasoning...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Analysis
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {/* Feedback */}
              {feedbackData && (
                <>
                  <div className={`rounded-xl p-6 border-2 ${
                    feedbackData.isCorrect
                      ? 'bg-green-900/30 border-green-600/50'
                      : 'bg-amber-900/30 border-amber-600/50'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {feedbackData.isCorrect ? (
                          <>
                            <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-green-400">Strong Analysis!</h3>
                              <p className="text-green-300/80 text-sm">You demonstrated critical thinking</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-14 h-14 bg-amber-600 rounded-full flex items-center justify-center">
                              <Lightbulb className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-amber-400">Room to Grow</h3>
                              <p className="text-amber-300/80 text-sm">Let's strengthen your reasoning</p>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-white">{feedbackData.score}</div>
                        <div className="text-stone-400 text-sm">points</div>
                      </div>
                    </div>

                    <p className="text-white/90 mb-4">{feedbackData.feedback}</p>

                    {feedbackData.strengths.length > 0 && (
                      <div className="mb-3">
                        <p className="text-green-400 font-semibold text-sm mb-2">✓ What you got right:</p>
                        <ul className="text-green-300/80 text-sm space-y-1">
                          {feedbackData.strengths.map((s, i) => (
                            <li key={i}>• {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {feedbackData.gaps.length > 0 && (
                      <div>
                        <p className="text-amber-400 font-semibold text-sm mb-2">→ Areas to consider:</p>
                        <ul className="text-amber-300/80 text-sm space-y-1">
                          {feedbackData.gaps.map((g, i) => (
                            <li key={i}>• {g}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <Zap className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-red-400 mb-2">Key Takeaway</h4>
                        <p className="text-white/90 text-sm">{feedbackData.keyInsight}</p>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Dimension Breakdown - Toggle */}
                  {feedbackData.evaluation && (
                    <div className="bg-stone-800/60 border border-stone-700 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setShowDetailedFeedback(!showDetailedFeedback)}
                        className="w-full p-4 flex items-center justify-between hover:bg-stone-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-amber-500 font-bold">📊</span>
                          <span className="font-bold text-amber-400">View Detailed Score Breakdown</span>
                        </div>
                        {showDetailedFeedback ? (
                          <ChevronUp className="w-5 h-5 text-stone-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-stone-400" />
                        )}
                      </button>

                      {showDetailedFeedback && (
                        <div className="p-4 pt-0">
                          <DetailedFeedback evaluation={feedbackData.evaluation} />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              <div className="bg-stone-800/80 border border-stone-600/50 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-400 mb-2">Expert Analysis</h4>
                    <p className="text-stone-300 text-sm leading-relaxed">{selectedPuzzle.idealAnswer}</p>
                  </div>
                </div>
              </div>

              <div className="bg-stone-800/60 border border-stone-700 rounded-xl p-5">
                <h4 className="font-bold text-stone-300 mb-3 text-sm uppercase tracking-wide">Principles to Remember</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedPuzzle.keyPrinciples.map((principle, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-red-500 mt-0.5">✦</span>
                      <span className="text-stone-400">{principle}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={closePuzzle}
                className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-white shadow-lg transition-all"
              >
                Back to Evidence Board
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuzzleModal;
