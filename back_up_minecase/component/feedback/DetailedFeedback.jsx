import { BarChart2, TrendingUp, AlertCircle } from '../icon';

/**
 * Detailed Feedback Component
 * Shows semantic reasoning action breakdown
 */
const DetailedFeedback = ({ evaluation, onClose }) => {
  if (!evaluation) return null;

  // Detect evaluation type
  const isStructural = evaluation.components && evaluation.model;
  const isSemantic = !isStructural && evaluation.actions && evaluation.schema;
  const isExpert = evaluation.breakdown && evaluation.breakdown.requiredConcepts;

  // For structural evaluation, convert components to dimensions display
  // For expert evaluation (Riddles), use the specific breakdown
  let dimensions = [];

  if (isExpert) {
     const b = evaluation.breakdown;
     dimensions = [
        {
           name: 'Required Concepts',
           score: b.requiredConcepts.score,
           max: 100, // Normalized to 100 in grader
           percentage: b.requiredConcepts.score,
           feedback: b.requiredConcepts.description,
           color: 'blue',
           icon: '🔑'
        },
        {
           name: 'Core Solution',
           score: b.coreAnswer.score,
           max: 100, 
           percentage: b.coreAnswer.score,
           feedback: b.coreAnswer.description,
           color: 'purple',
           icon: '🧩'
        },
        {
           name: 'Conclusion',
           score: b.correctConclusion.score,
           max: 100,
           percentage: b.correctConclusion.score,
           feedback: b.correctConclusion.description,
           color: 'green',
           icon: '✅'
        },
        {
           name: 'Bonus Insights',
           score: b.bonusInsights.score,
           max: 100,
           percentage: b.bonusInsights.score,
           feedback: b.bonusInsights.description,
           color: 'amber',
           icon: '✨'
        }
     ];
  } else if (isStructural) {
     dimensions = Object.entries(evaluation.components).map(([compId, compData]) => ({
        name: compData.label,
        score: compData.score,
        max: compData.maxScore,
        percentage: Math.round((compData.score / compData.maxScore) * 100),
        feedback: compData.present
          ? `${compData.quality === 2 ? 'Clear & Complete' : compData.quality === 1 ? 'Partial' : 'Missing'}: ${compData.label}`
          : `Missing: ${compData.label}`,
        color: compData.present ? (compData.quality === 2 ? 'green' : 'amber') : 'red',
        icon: compData.present ? (compData.quality === 2 ? '✓✓' : '✓') : '○',
        required: compData.required
      }));
  } else if (isSemantic) {
     dimensions = Object.entries(evaluation.actions).map(([actionId, actionData]) => ({
        name: actionData.label,
        score: actionData.score,
        max: actionData.maxScore,
        percentage: Math.round((actionData.score / actionData.maxScore) * 100),
        feedback: actionData.present
          ? `${actionData.clarity === 2 ? 'Clear' : actionData.clarity === 1 ? 'Partial' : 'Unclear'}: ${actionData.label}`
          : `Not detected: ${actionData.label}`,
        color: actionData.present ? (actionData.clarity === 2 ? 'green' : 'amber') : 'red',
        icon: actionData.present ? '✓' : '○'
      }));
  } else {
     dimensions = [
        {
          name: 'Claim Identification',
          score: evaluation.claimIdentification?.score || 0,
          max: evaluation.claimIdentification?.maxScore || 15,
          percentage: evaluation.claimIdentification?.percentage || 0,
          feedback: evaluation.claimIdentification?.feedback || '',
          color: 'amber',
          icon: '🎯'
        },
        {
          name: 'Evidence Evaluation',
          score: evaluation.evidenceEvaluation?.score || 0,
          max: evaluation.evidenceEvaluation?.maxScore || 25,
          percentage: evaluation.evidenceEvaluation?.percentage || 0,
          feedback: evaluation.evidenceEvaluation?.feedback || '',
          color: 'blue',
          icon: '🔍'
        },
        {
          name: 'Reasoning & Logic',
          score: evaluation.reasoningLogic?.score || 0,
          max: evaluation.reasoningLogic?.maxScore || 30,
          percentage: evaluation.reasoningLogic?.percentage || 0,
          feedback: evaluation.reasoningLogic?.feedback || '',
          color: 'purple',
          icon: '🧠'
        },
        {
          name: 'Bias & Reliability Awareness',
          score: evaluation.biasAwareness?.score || 0,
          max: evaluation.biasAwareness?.maxScore || 20,
          percentage: evaluation.biasAwareness?.percentage || 0,
          feedback: evaluation.biasAwareness?.feedback || '',
          color: 'green',
          icon: '⚖️'
        },
        {
          name: 'Clarity & Coherence',
          score: evaluation.clarityCoherence?.score || 0,
          max: evaluation.clarityCoherence?.maxScore || 10,
          percentage: evaluation.clarityCoherence?.percentage || 0,
          feedback: evaluation.clarityCoherence?.feedback || '',
          color: 'pink',
          icon: '✨'
        }
      ];
  }

  const getColorClass = (color, type = 'bg') => {
    const colorMap = {
      amber: { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500' },
      blue: { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500' },
      green: { bg: 'bg-green-500', text: 'text-green-400', border: 'border-green-500' },
      pink: { bg: 'bg-pink-500', text: 'text-pink-400', border: 'border-pink-500' }
    };
    return colorMap[color]?.[type] || '';
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 85) return 'text-green-400';
    if (percentage >= 70) return 'text-blue-400';
    if (percentage >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-4">
      {/* Overall Performance Header */}
      <div className="bg-gradient-to-r from-stone-800 to-stone-900 border-2 border-amber-600/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-amber-500" />
            <div>
              <h3 className="text-xl font-bold text-white">Performance Analysis</h3>
              <p className="text-stone-400 text-sm">{evaluation.performanceLevel}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-white">{evaluation.totalScore}</div>
            <div className="text-stone-400 text-sm">out of 100</div>
          </div>
        </div>
        <p className="text-stone-300 text-sm leading-relaxed">
          {evaluation.overallFeedback}
        </p>
      </div>

      {/* Dimension Breakdown */}
      <div className="bg-stone-800/80 border border-stone-600/50 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-5 h-5 text-amber-500" />
          <h4 className="font-bold text-amber-400">Dimension Breakdown</h4>
        </div>

        <div className="space-y-4">
          {dimensions.map((dimension, index) => (
            <div key={index} className="space-y-2">
              {/* Dimension Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{dimension.icon}</span>
                  <span className="font-semibold text-white text-sm">{dimension.name}</span>
                </div>
                <div className={`font-bold ${getPerformanceColor(dimension.percentage)}`}>
                  {dimension.score}/{dimension.max}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-stone-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${getColorClass(dimension.color, 'bg')} transition-all duration-500 ease-out`}
                  style={{ width: `${dimension.percentage}%` }}
                />
              </div>

              {/* Feedback */}
              <p className="text-stone-400 text-xs leading-relaxed pl-7">
                {dimension.feedback}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Metrics (Structural Evaluation Only) */}
      {isStructural && evaluation.validations && (
        <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="w-full">
              <h4 className="font-bold text-blue-400 mb-3 text-sm">Quality Analysis</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-stone-800/40 p-3 rounded">
                  <div className="text-stone-400 mb-1">Word Count</div>
                  <div className="text-white font-bold">{evaluation.wordCount} words</div>
                  <div className={`text-xs mt-1 ${evaluation.wordCount >= 60 && evaluation.wordCount <= 80 ? 'text-green-400' : evaluation.wordCount > 100 ? 'text-amber-400' : 'text-blue-400'}`}>
                    {evaluation.wordCount >= 60 && evaluation.wordCount <= 80 ? '✓ Perfect length' : evaluation.wordCount > 100 ? '⚠ Too verbose' : 'Can be more detailed'}
                  </div>
                </div>
                <div className="bg-stone-800/40 p-3 rounded">
                  <div className="text-stone-400 mb-1">Quality Multiplier</div>
                  <div className="text-white font-bold">×{evaluation.qualityMultiplier}</div>
                  <div className={`text-xs mt-1 ${parseFloat(evaluation.qualityMultiplier) > 1.0 ? 'text-green-400' : parseFloat(evaluation.qualityMultiplier) < 1.0 ? 'text-amber-400' : 'text-blue-400'}`}>
                    {parseFloat(evaluation.qualityMultiplier) > 1.0 ? '✓ Quality bonus applied' : parseFloat(evaluation.qualityMultiplier) < 1.0 ? 'Penalties applied' : 'Standard scoring'}
                  </div>
                </div>
              </div>
              {evaluation.validations.concisenessBonus > 1.0 && (
                <div className="mt-3 text-green-300 text-xs">
                  ✨ Conciseness Bonus: Your answer is well-structured and to the point!
                </div>
              )}
              {evaluation.validations.verbosityPenalty < 1.0 && (
                <div className="mt-3 text-amber-300 text-xs">
                  ⚠ Verbosity Penalty: Try to be more concise. Aim for 60-80 words.
                </div>
              )}
              {evaluation.validations.keywordStuffingPenalty < 1.0 && (
                <div className="mt-3 text-amber-300 text-xs">
                  ⚠ Keyword Repetition Detected: Focus on reasoning, not repeating terms.
                </div>
              )}
              {evaluation.validations.genericResponsePenalty < 1.0 && (
                <div className="mt-3 text-amber-300 text-xs">
                  ⚠ Generic Phrasing: Be more specific to the question asked.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* How Scoring Works */}
      <div className="bg-stone-900/60 border border-stone-700 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-400 mb-2 text-sm">
              {isExpert ? 'How We Grade: Expert Alignment' : isStructural ? `How We Grade: ${evaluation.model}` : 'How We Grade Your Reasoning'}
            </h4>
            <div className="text-stone-400 text-xs space-y-1.5">
              {isExpert ? (
                 <>
                  <p>• <strong>Required Concepts (20%):</strong> Do you mention the key terms related to the puzzle?</p>
                  <p>• <strong>Core Solution (50%):</strong> Do you identify and explain the main solution components?</p>
                  <p>• <strong>Conclusion (20%):</strong> Is your final answer correct based on the constraints?</p>
                  <p>• <strong>Bonus Insights (10%):</strong> Do you demonstrate deeper understanding of the principles?</p>
                 </>
              ) : isStructural ? (
                <>
                  <p className="mb-2">We evaluate the <strong>structure of your reasoning</strong>, not just keywords:</p>
                  {dimensions.filter(d => d.required).map((d, i) => (
                    <p key={i}>• <strong>{d.name} ({d.max} pts):</strong> {d.required ? 'Required' : 'Bonus'}</p>
                  ))}
                  <p className="mt-2 text-blue-300">
                    <strong>Anti-Gaming:</strong> Concise answers (60-80 words) score best. Keyword stuffing and verbosity are penalized.
                  </p>
                </>
              ) : (
                <>
                  <p>• <strong>Claim Identification (15 pts):</strong> Do you identify what claim is being made?</p>
                  <p>• <strong>Evidence Evaluation (25 pts):</strong> Do you question the quality and reliability of evidence?</p>
                  <p>• <strong>Reasoning & Logic (30 pts):</strong> Do you explain your thinking with clear logical connections?</p>
                  <p>• <strong>Bias & Reliability (20 pts):</strong> Do you recognize bias, credibility issues, or logical fallacies?</p>
                  <p>• <strong>Clarity & Coherence (10 pts):</strong> Is your analysis well-organized and easy to follow?</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
        <p className="text-blue-300 text-xs leading-relaxed">
          <strong>📝 Remember:</strong> We grade based on the <em>quality of your reasoning</em>, not whether you agree or disagree with any particular position. Well-reasoned arguments on either side can score highly!
        </p>
      </div>
    </div>
  );
};

export default DetailedFeedback;
