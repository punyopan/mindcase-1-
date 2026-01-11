import React, { useState, useEffect, useCallback, useRef } from 'react';
import TranslationService from '../../services/TranslationService';

/**
 * SIGNAL FIELD - Cognitive Training Game
 *
 * Present a complex data system with patterns hidden in noise.
 * Force users to:
 * 1. Observe before analyzing (enforced minimum time)
 * 2. Form multiple hypotheses
 * 3. Test with limited budget
 * 4. Articulate uncertainty
 *
 * NO CORRECT/INCORRECT FEEDBACK - only reasoning quality assessment
 */

const SignalField = ({ scenario, userId, onComplete }) => {
  // Game phases: observation -> hypothesis -> testing -> synthesis
  const [phase, setPhase] = useState('briefing');
  const [observationTimeRemaining, setObservationTimeRemaining] = useState(scenario?.minObservationTime || 60);
  const [observationComplete, setObservationComplete] = useState(false);

  // Player inputs
  const [hypotheses, setHypotheses] = useState([]);
  const [currentHypothesis, setCurrentHypothesis] = useState('');
  const [testingBudget, setTestingBudget] = useState(scenario?.testingBudget || 5);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [selectedVariables, setSelectedVariables] = useState([]);
  const [synthesisResponse, setSynthesisResponse] = useState('');
  const [uncertaintyLevel, setUncertaintyLevel] = useState(50);
  const [uncertaintyReasoning, setUncertaintyReasoning] = useState('');

  // UI state
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterActive, setFilterActive] = useState(null);
  const [selectedDataPoints, setSelectedDataPoints] = useState(new Set());
  const [showChallenge, setShowChallenge] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState('');

  // Tracking
  const [dataInteractions, setDataInteractions] = useState([]);
  const [timeInPhase, setTimeInPhase] = useState({});
  const startTimeRef = useRef(Date.now());

  // Timer for observation phase
  useEffect(() => {
    if (phase === 'observation' && observationTimeRemaining > 0) {
      const timer = setInterval(() => {
        setObservationTimeRemaining(prev => {
          if (prev <= 1) {
            setObservationComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase, observationTimeRemaining]);

  // Track time in each phase
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeInPhase(prev => ({
        ...prev,
        [phase]: (prev[phase] || 0) + 1
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // Log data interaction
  const logInteraction = useCallback((type, details) => {
    setDataInteractions(prev => [...prev, {
      type,
      details,
      timestamp: Date.now() - startTimeRef.current,
      phase
    }]);
  }, [phase]);

  // Handle data point selection
  const toggleDataPoint = (id) => {
    logInteraction('select_data_point', { id });
    setSelectedDataPoints(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Handle sorting
  const handleSort = (field) => {
    logInteraction('sort', { field, order: sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc' });
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Add hypothesis
  const addHypothesis = () => {
    if (currentHypothesis.trim().length > 10) {
      const newHypothesis = {
        id: hypotheses.length + 1,
        text: currentHypothesis.trim(),
        timestamp: Date.now() - startTimeRef.current,
        testedWith: [],
        status: 'untested'
      };
      setHypotheses(prev => [...prev, newHypothesis]);
      setCurrentHypothesis('');
      logInteraction('add_hypothesis', { hypothesis: currentHypothesis });
    }
  };

  // Request analysis (spend testing budget)
  const requestAnalysis = (analysisType, variables) => {
    if (testingBudget <= 0) return;

    setTestingBudget(prev => prev - 1);
    logInteraction('request_analysis', { type: analysisType, variables });

    // Simulate analysis result
    const result = generateAnalysisResult(analysisType, variables, scenario);
    setAnalysisResults(prev => [...prev, result]);

    // Update hypothesis if applicable
    if (selectedVariables.length > 0) {
      setHypotheses(prev => prev.map(h =>
        selectedVariables.includes(h.id.toString())
          ? { ...h, testedWith: [...h.testedWith, analysisType], status: 'tested' }
          : h
      ));
    }
  };

  // Generate analysis result based on scenario hidden patterns
  const generateAnalysisResult = (type, variables, scenario) => {
    const result = {
      id: analysisResults.length + 1,
      type,
      variables,
      timestamp: Date.now() - startTimeRef.current
    };

    if (type === 'correlation') {
      // Generate correlation based on whether it's a real pattern, red herring, or random
      const var1 = variables[0];
      const var2 = variables[1];
      const isRealPattern = scenario.hiddenPatterns?.includes(var1) || scenario.hiddenPatterns?.includes(var2);
      const isRedHerring = scenario.redHerrings?.includes(var1) || scenario.redHerrings?.includes(var2);

      let correlation;
      if (isRealPattern) {
        correlation = 0.3 + Math.random() * 0.4; // Moderate real correlation
      } else if (isRedHerring) {
        correlation = 0.4 + Math.random() * 0.3; // Misleading strong correlation
      } else {
        correlation = -0.15 + Math.random() * 0.3; // Weak/none
      }

      result.finding = `Correlation between ${var1} and ${var2}: r = ${correlation.toFixed(2)}`;
      result.interpretation = correlation > 0.3
        ? "Moderate positive relationship detected"
        : correlation < -0.3
          ? "Moderate negative relationship detected"
          : "No strong relationship detected";
      result.warning = "Correlation does not establish causation. Consider confounding factors.";
    } else if (type === 'group_comparison') {
      result.finding = `Groups differ by approximately ${(10 + Math.random() * 20).toFixed(1)} points on average`;
      result.interpretation = "Difference may or may not be statistically meaningful";
      result.warning = "Selection effects may explain group differences.";
    } else if (type === 'trend') {
      result.finding = `Trend analysis shows ${Math.random() > 0.5 ? 'increasing' : 'decreasing'} pattern over time`;
      result.interpretation = "Direction detected but cause unknown";
      result.warning = "Temporal patterns may reflect broader changes, not specific variables.";
    } else if (type === 'outlier_detection') {
      const outlierCount = Math.floor(Math.random() * 5) + 1;
      result.finding = `Detected ${outlierCount} potential outliers (${(outlierCount / (scenario.dataPoints?.length || 50) * 100).toFixed(1)}% of data)`;
      result.interpretation = "Outliers may represent errors, edge cases, or the most interesting data";
      result.warning = "Removing outliers can bias analysis. Investigate why they exist first.";
    } else if (type === 'distribution_analysis') {
      const skew = Math.random() > 0.5 ? 'right' : 'left';
      const isNormal = Math.random() > 0.6;
      result.finding = isNormal
        ? "Distribution appears approximately normal"
        : `Distribution shows ${skew}-skew with potential multimodal structure`;
      result.interpretation = isNormal
        ? "Standard statistical tests may be appropriate"
        : "Non-normal distribution suggests distinct subpopulations or processes";
      result.warning = "Distribution shape alone doesn't reveal causation.";
    } else if (type === 'subgroup_comparison') {
      const subgroupDiff = (15 + Math.random() * 25).toFixed(1);
      result.finding = `Selected subgroup shows ${subgroupDiff}% ${Math.random() > 0.5 ? 'higher' : 'lower'} values than others`;
      result.interpretation = "Subgroup characteristics may explain overall patterns";
      result.warning = "Subgroup selection can be arbitrary. Are you cherry-picking?";
    } else if (type === 'interaction_effects') {
      const hasInteraction = Math.random() > 0.4;
      result.finding = hasInteraction
        ? "Variables show interaction: effect of one depends on level of the other"
        : "No significant interaction detected between selected variables";
      result.interpretation = hasInteraction
        ? "Simple main effects may be misleading - context matters"
        : "Variables appear to operate independently";
      result.warning = "Interaction effects are often confounded with other unmeasured variables.";
    } else if (type === 'temporal_clustering') {
      const clusterCount = Math.floor(Math.random() * 3) + 2;
      result.finding = `Identified ${clusterCount} distinct time-based clusters in the data`;
      result.interpretation = "Temporal patterns suggest event-driven or phase-based processes";
      result.warning = "Time-based clusters may reflect data collection artifacts, not real phenomena.";
    }

    return result;
  };

  // Submit synthesis
  const submitSynthesis = () => {
    // Evaluate reasoning process
    const evaluation = evaluateReasoningProcess();

    // Generate adversarial challenge if appropriate
    if (evaluation.processQuality < 70) {
      const challenge = generateChallenge();
      setCurrentChallenge(challenge);
      setShowChallenge(true);
    } else {
      completeSession(evaluation);
    }
  };

  // Evaluate the user's reasoning process (not correctness!)
  const evaluateReasoningProcess = () => {
    const evaluation = {
      hypothesesFormed: hypotheses.length,
      hypothesesTested: hypotheses.filter(h => h.status === 'tested').length,
      analysesRequested: analysisResults.length,
      dataPointsExamined: selectedDataPoints.size,
      uncertaintyExpressed: uncertaintyLevel < 80, // Did they express uncertainty?
      uncertaintyJustified: uncertaintyReasoning.length > 30,
      observationTimeUsed: timeInPhase.observation || 0,
      synthesisLength: synthesisResponse.length,
      processQuality: 0,
      feedback: []
    };

    // Score process quality
    let score = 0;

    // Did they form multiple hypotheses?
    if (hypotheses.length >= 2) {
      score += 15;
    } else {
      evaluation.feedback.push("Consider forming multiple competing hypotheses before committing to one.");
    }

    // Did they test hypotheses?
    if (evaluation.hypothesesTested > 0) {
      score += 15;
    }

    // Did they examine enough data?
    if (evaluation.dataPointsExamined >= 10) {
      score += 15;
    } else {
      evaluation.feedback.push("You examined relatively few individual data points. What patterns might you have missed?");
    }

    // Did they express appropriate uncertainty?
    if (evaluation.uncertaintyExpressed) {
      score += 15;
    } else {
      evaluation.feedback.push("Your confidence level is high. What would change your mind?");
    }

    // Did they justify their uncertainty?
    if (evaluation.uncertaintyJustified) {
      score += 15;
    }

    // Did they spend enough time observing?
    if (evaluation.observationTimeUsed >= 60) {
      score += 10;
    } else {
      evaluation.feedback.push("You moved quickly through the observation phase. What might you have noticed with more time?");
    }

    // Is their synthesis substantive?
    if (evaluation.synthesisLength >= 100) {
      score += 15;
    }

    evaluation.processQuality = score;
    return evaluation;
  };

  // Generate adversarial challenge
  const generateChallenge = () => {
    const challenges = [
      "You've identified a pattern. What confounding factors could create this same pattern without your explanation being true?",
      "How many data points support your conclusion vs. contradict it? Did you count?",
      "If your interpretation is wrong, what's the most likely alternative?",
      "What evidence would change your mind?",
      "You seem confident. On what basis? What are you uncertain about?"
    ];
    return challenges[Math.floor(Math.random() * challenges.length)];
  };

  // Complete the session
  const completeSession = (evaluation) => {
    const sessionData = {
      scenario: scenario.title,
      duration: Date.now() - startTimeRef.current,
      hypotheses,
      analysisResults,
      synthesis: synthesisResponse,
      uncertainty: { level: uncertaintyLevel, reasoning: uncertaintyReasoning },
      dataInteractions,
      timeInPhase,
      evaluation
    };

    onComplete?.(sessionData);
  };

  // Get sorted and filtered data
  const getDisplayData = () => {
    let data = [...(scenario?.dataPoints || [])];

    if (sortBy) {
      data.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        const comparison = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return data;
  };

  // Render data table
  const renderDataTable = () => {
    const data = getDisplayData();
    if (!data.length) return null;

    const columns = Object.keys(data[0]).filter(k => k !== 'id');

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-stone-800/50">
              <th className="px-2 py-2 text-left text-stone-400">#</th>
              {columns.map(col => (
                <th
                  key={col}
                  className="px-2 py-2 text-left text-stone-400 cursor-pointer hover:text-amber-400 transition-colors"
                  onClick={() => handleSort(col)}
                >
                  {col.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                  {sortBy === col && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row.id}
                className={`border-b border-stone-700/50 cursor-pointer transition-colors ${selectedDataPoints.has(row.id)
                    ? 'bg-amber-900/30'
                    : 'hover:bg-stone-800/30'
                  }`}
                onClick={() => toggleDataPoint(row.id)}
              >
                <td className="px-2 py-1 text-stone-500">{idx + 1}</td>
                {columns.map(col => (
                  <td key={col} className="px-2 py-1 text-stone-300">
                    {typeof row[col] === 'boolean'
                      ? (row[col] ? 'Yes' : 'No')
                      : typeof row[col] === 'number'
                        ? Number(row[col]).toFixed(1)
                        : row[col]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render phase content
  const renderPhaseContent = () => {
    switch (phase) {
      case 'briefing':
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold text-amber-400">{scenario?.title}</h2>
            <div className="bg-stone-800/50 rounded-xl p-6 text-left">
              <p className="text-stone-200 leading-relaxed">{scenario?.briefing}</p>
            </div>
            <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4">
              <h4 className="font-bold text-amber-400 mb-2">{TranslationService.t('cognitive.how_this_works')}</h4>
              <ul className="text-stone-300 text-sm space-y-2 text-left">
                <li>1. {TranslationService.t('cognitive.instructions_text')}</li>
                <li>2. {TranslationService.t('cognitive.hypothesis_prompt')}</li>
                <li>3. {TranslationService.t('cognitive.limited_resources')}</li>
                <li>4. {TranslationService.t('cognitive.explain_reasoning')}</li>
              </ul>
            </div>
            <button
              onClick={() => setPhase('observation')}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-xl hover:from-amber-500 hover:to-red-500 transition-all"
            >
              {TranslationService.t('cognitive.begin_observation')}
            </button>
          </div>
        );

      case 'observation':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{TranslationService.t('cognitive.observation_phase')}</h3>
              <div className={`px-4 py-2 rounded-lg font-mono ${observationComplete
                  ? 'bg-green-900/50 text-green-400'
                  : 'bg-stone-800 text-amber-400'
                }`}>
                {observationComplete
                  ? TranslationService.t('cognitive.analysis_unlocked')
                  : `${TranslationService.t('cognitive.observe_timer')}: ${Math.floor(observationTimeRemaining / 60)}:${String(observationTimeRemaining % 60).padStart(2, '0')}`
                }
              </div>
            </div>

            <div className="bg-stone-800/30 border border-stone-700 rounded-xl p-4 text-sm text-stone-400 mb-4">
              <strong>{TranslationService.t('cognitive.instructions')}:</strong> {TranslationService.t('cognitive.instructions_text')}
              {!observationComplete && ` ${TranslationService.t('cognitive.analysis_unlock_note')}`}
            </div>

            <div className="bg-stone-900/50 border border-stone-700 rounded-xl p-4 max-h-96 overflow-y-auto">
              {renderDataTable()}
            </div>

            {observationComplete && (
              <button
                onClick={() => setPhase('hypothesis')}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-xl hover:from-amber-500 hover:to-red-500 transition-all"
              >
                {TranslationService.t('cognitive.proceed_hypothesis')}
              </button>
            )}

            <div className="text-center text-stone-500 text-sm">
              {selectedDataPoints.size} {TranslationService.t('cognitive.data_points_marked')}
            </div>
          </div>
        );

      case 'hypothesis':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">{TranslationService.t('cognitive.form_hypotheses')}</h3>
            <p className="text-stone-400 text-sm">
              {TranslationService.t('cognitive.hypothesis_prompt')}
            </p>

            <div className="bg-stone-900/50 border border-stone-700 rounded-xl p-4">
              <textarea
                value={currentHypothesis}
                onChange={(e) => setCurrentHypothesis(e.target.value)}
                placeholder={TranslationService.t('cognitive.hypothesis_placeholder')}
                className="w-full h-24 bg-stone-800 border border-stone-600 rounded-lg p-3 text-white placeholder-stone-500 resize-none"
              />
              <button
                onClick={addHypothesis}
                disabled={currentHypothesis.trim().length < 10}
                className="mt-2 px-4 py-2 bg-amber-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {TranslationService.t('cognitive.add_hypothesis')}
              </button>
            </div>

            {hypotheses.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-amber-400">{TranslationService.t('cognitive.your_hypotheses')}:</h4>
                {hypotheses.map((h, idx) => (
                  <div key={h.id} className="bg-stone-800/50 rounded-lg p-3 flex items-start gap-3">
                    <span className="text-amber-500 font-bold">{idx + 1}.</span>
                    <span className="text-stone-200">{h.text}</span>
                    <span className={`ml-auto text-xs px-2 py-1 rounded ${h.status === 'tested' ? 'bg-green-900/50 text-green-400' : 'bg-stone-700 text-stone-400'
                      }`}>
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {hypotheses.length >= 2 && (
              <button
                onClick={() => setPhase('testing')}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-xl hover:from-amber-500 hover:to-red-500 transition-all"
              >
                {TranslationService.t('cognitive.proceed_testing')}
              </button>
            )}

            {hypotheses.length < 2 && (
              <p className="text-center text-stone-500 text-sm">
                {TranslationService.t('cognitive.min_hypotheses')}
              </p>
            )}
          </div>
        );

      case 'testing':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{TranslationService.t('cognitive.test_hypotheses')}</h3>
              <div className="px-4 py-2 bg-stone-800 rounded-lg">
                <span className="text-stone-400">{TranslationService.t('cognitive.analysis_budget')}:</span>
                <span className="ml-2 font-bold text-amber-400">{testingBudget}</span>
              </div>
            </div>

            <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-4 text-sm">
              <p className="text-amber-200">
                <strong>{TranslationService.t('cognitive.limited_resources')}:</strong> {TranslationService.t('cognitive.analysis_budget')}: {scenario?.testingBudget || 3}
              </p>
            </div>

            {/* Analysis Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => requestAnalysis('correlation', ['var1', 'var2'])}
                disabled={testingBudget <= 0}
                className="p-3 bg-stone-800/50 border border-stone-700 rounded-xl text-left hover:border-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-amber-400 font-bold mb-1 text-sm">{TranslationService.t('cognitive.correlation_analysis')}</div>
                <div className="text-stone-400 text-xs">{TranslationService.t('cognitive.correlation_desc')}</div>
              </button>

              <button
                onClick={() => requestAnalysis('group_comparison', ['group'])}
                disabled={testingBudget <= 0}
                className="p-3 bg-stone-800/50 border border-stone-700 rounded-xl text-left hover:border-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-amber-400 font-bold mb-1 text-sm">{TranslationService.t('cognitive.group_comparison')}</div>
                <div className="text-stone-400 text-xs">{TranslationService.t('cognitive.group_comparison_desc')}</div>
              </button>

              <button
                onClick={() => requestAnalysis('trend', ['time'])}
                disabled={testingBudget <= 0}
                className="p-3 bg-stone-800/50 border border-stone-700 rounded-xl text-left hover:border-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-amber-400 font-bold mb-1 text-sm">{TranslationService.t('cognitive.trend_analysis')}</div>
                <div className="text-stone-400 text-xs">{TranslationService.t('cognitive.trend_desc')}</div>
              </button>

              <button
                onClick={() => requestAnalysis('outlier_detection', ['values'])}
                disabled={testingBudget <= 0}
                className="p-3 bg-stone-800/50 border border-stone-700 rounded-xl text-left hover:border-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-amber-400 font-bold mb-1 text-sm">{TranslationService.t('cognitive.outlier_detection')}</div>
                <div className="text-stone-400 text-xs">{TranslationService.t('cognitive.outlier_desc')}</div>
              </button>

              <button
                onClick={() => requestAnalysis('distribution_analysis', ['variable'])}
                disabled={testingBudget <= 0}
                className="p-3 bg-stone-800/50 border border-stone-700 rounded-xl text-left hover:border-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-amber-400 font-bold mb-1 text-sm">{TranslationService.t('cognitive.distribution_analysis')}</div>
                <div className="text-stone-400 text-xs">{TranslationService.t('cognitive.distribution_desc')}</div>
              </button>

              <button
                onClick={() => requestAnalysis('subgroup_comparison', ['subgroup'])}
                disabled={testingBudget <= 0}
                className="p-3 bg-stone-800/50 border border-stone-700 rounded-xl text-left hover:border-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-amber-400 font-bold mb-1 text-sm">{TranslationService.t('cognitive.subgroup_comparison')}</div>
                <div className="text-stone-400 text-xs">{TranslationService.t('cognitive.subgroup_desc')}</div>
              </button>

              <button
                onClick={() => requestAnalysis('interaction_effects', ['var1', 'var2'])}
                disabled={testingBudget <= 0}
                className="p-3 bg-stone-800/50 border border-stone-700 rounded-xl text-left hover:border-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-amber-400 font-bold mb-1 text-sm">{TranslationService.t('cognitive.interaction_effects')}</div>
                <div className="text-stone-400 text-xs">{TranslationService.t('cognitive.interaction_desc')}</div>
              </button>

              <button
                onClick={() => requestAnalysis('temporal_clustering', ['time'])}
                disabled={testingBudget <= 0}
                className="p-3 bg-stone-800/50 border border-stone-700 rounded-xl text-left hover:border-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-amber-400 font-bold mb-1 text-sm">{TranslationService.t('cognitive.temporal_clustering')}</div>
                <div className="text-stone-400 text-xs">{TranslationService.t('cognitive.temporal_desc')}</div>
              </button>
            </div>

            {/* Analysis Results */}
            {analysisResults.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-white">{TranslationService.t('cognitive.analysis_results')}:</h4>
                {analysisResults.map((result) => (
                  <div key={result.id} className="bg-stone-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-amber-400 font-bold">{result.type}</span>
                    </div>
                    <p className="text-stone-200 mb-2">{result.finding}</p>
                    <p className="text-stone-400 text-sm mb-2">{result.interpretation}</p>
                    <p className="text-amber-300/70 text-xs italic">{result.warning}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setPhase('synthesis')}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-xl hover:from-amber-500 hover:to-red-500 transition-all"
            >
              {TranslationService.t('cognitive.proceed_synthesis')}
            </button>
          </div>
        );

      case 'synthesis':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">{TranslationService.t('cognitive.synthesize_understanding')}</h3>

            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-amber-400 font-bold mb-2">
                {TranslationService.t('cognitive.interpretation_prompt')}
              </label>
              <textarea
                value={synthesisResponse}
                onChange={(e) => setSynthesisResponse(e.target.value)}
                placeholder={TranslationService.t('cognitive.interpretation_placeholder')}
                className="w-full h-40 bg-stone-900 border border-stone-600 rounded-lg p-3 text-white placeholder-stone-500 resize-none"
              />
              <p className="text-stone-500 text-sm mt-2">
                {TranslationService.t('cognitive.explain_reasoning')}
              </p>
            </div>

            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-amber-400 font-bold mb-4">
                {TranslationService.t('cognitive.confidence_prompt')}
              </label>
              <div className="flex items-center gap-4">
                <span className="text-red-400 text-sm">{TranslationService.t('cognitive.very_uncertain')}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={uncertaintyLevel}
                  onChange={(e) => setUncertaintyLevel(parseInt(e.target.value))}
                  className="flex-1 accent-amber-500"
                />
                <span className="text-green-400 text-sm">{TranslationService.t('cognitive.very_confident')}</span>
              </div>
              <div className="text-center text-2xl font-bold text-amber-400 mt-2">
                {uncertaintyLevel}%
              </div>
            </div>

            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-amber-400 font-bold mb-2">
                What are you uncertain about and why?
              </label>
              <textarea
                value={uncertaintyReasoning}
                onChange={(e) => setUncertaintyReasoning(e.target.value)}
                placeholder="I'm uncertain about... because the data doesn't clearly show..."
                className="w-full h-24 bg-stone-900 border border-stone-600 rounded-lg p-3 text-white placeholder-stone-500 resize-none"
              />
            </div>

            <button
              onClick={submitSynthesis}
              disabled={synthesisResponse.length < 50}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-xl hover:from-amber-500 hover:to-red-500 transition-all disabled:opacity-50"
            >
              Submit Synthesis
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // Adversarial Challenge Modal
  const renderChallengeModal = () => {
    if (!showChallenge) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-stone-900 border border-amber-700/50 rounded-xl p-6 max-w-lg w-full">
          <h3 className="text-xl font-bold text-amber-400 mb-4">Challenge Your Reasoning</h3>
          <p className="text-stone-200 mb-6">{currentChallenge}</p>

          <textarea
            placeholder="Respond to this challenge..."
            className="w-full h-32 bg-stone-800 border border-stone-600 rounded-lg p-3 text-white placeholder-stone-500 resize-none mb-4"
          />

          <button
            onClick={() => {
              setShowChallenge(false);
              completeSession(evaluateReasoningProcess());
            }}
            className="w-full py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-500 transition-all"
          >
            Complete Session
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-stone-900/90 border border-stone-700 rounded-2xl p-6 min-h-[500px]">
      {/* Phase indicator */}
      <div className="flex items-center gap-2 mb-6">
        {['briefing', 'observation', 'hypothesis', 'testing', 'synthesis'].map((p, idx) => (
          <div
            key={p}
            className={`flex-1 h-2 rounded-full ${phase === p
                ? 'bg-amber-500'
                : ['briefing', 'observation', 'hypothesis', 'testing', 'synthesis'].indexOf(phase) > idx
                  ? 'bg-green-600'
                  : 'bg-stone-700'
              }`}
          />
        ))}
      </div>

      {renderPhaseContent()}
      {renderChallengeModal()}
    </div>
  );
};

export default SignalField;
