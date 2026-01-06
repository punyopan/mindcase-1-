import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * COUNTERFACTUAL ENGINE - Premium Cognitive Training Game
 *
 * Present an outcome and force users to explore alternative histories.
 * What HAD to be true for this to happen? What would change it?
 *
 * Phases:
 * 1. Briefing - Understand the outcome
 * 2. Dependency Mapping - What factors led to this?
 * 3. Counterfactual Exploration - What if X was different?
 * 4. Fragility Analysis - How easily could this have gone differently?
 *
 * Trains: Counterfactual thinking, causal reasoning, understanding contingency,
 *         recognizing that outcomes are not inevitable
 */

const CounterfactualEngine = ({ scenario, userId, onComplete }) => {
  // Game phases
  const [phase, setPhase] = useState('briefing');

  // Dependency mapping
  const [dependencies, setDependencies] = useState([]);
  const [currentDependency, setCurrentDependency] = useState('');
  const [dependencyType, setDependencyType] = useState('necessary');

  // Counterfactuals
  const [counterfactuals, setCounterfactuals] = useState([]);
  const [currentCounterfactual, setCurrentCounterfactual] = useState({
    change: '',
    outcome: '',
    confidence: 50
  });

  // Analysis
  const [pivotalMoment, setPivotalMoment] = useState('');
  const [inevitabilityRating, setInevitabilityRating] = useState(50);
  const [inevitabilityReasoning, setInvitabilityReasoning] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');

  // Tracking
  const [interactions, setInteractions] = useState([]);
  const startTimeRef = useRef(Date.now());

  const DEPENDENCY_TYPES = [
    { id: 'necessary', label: 'Necessary', description: 'Without this, outcome couldn\'t happen', color: 'red' },
    { id: 'sufficient', label: 'Sufficient', description: 'This alone could cause the outcome', color: 'purple' },
    { id: 'contributing', label: 'Contributing', description: 'Helped make outcome more likely', color: 'amber' },
    { id: 'enabling', label: 'Enabling', description: 'Created conditions for outcome', color: 'blue' },
    { id: 'accelerating', label: 'Accelerating', description: 'Made outcome happen faster', color: 'green' }
  ];

  const COUNTERFACTUAL_PROMPTS = [
    "What if the timing had been different?",
    "What if a key person had made a different choice?",
    "What if resources had been allocated differently?",
    "What if information had been available (or hidden)?",
    "What if external circumstances had changed?",
    "What if the sequence of events had been different?"
  ];

  // Log interaction
  const logInteraction = useCallback((type, details) => {
    setInteractions(prev => [...prev, {
      type,
      details,
      timestamp: Date.now() - startTimeRef.current,
      phase
    }]);
  }, [phase]);

  // Add dependency
  const addDependency = () => {
    if (currentDependency.trim().length < 10) return;

    const newDep = {
      id: dependencies.length + 1,
      factor: currentDependency.trim(),
      type: dependencyType,
      timestamp: Date.now() - startTimeRef.current
    };

    setDependencies(prev => [...prev, newDep]);
    setCurrentDependency('');
    logInteraction('add_dependency', { factor: currentDependency.substring(0, 50), type: dependencyType });
  };

  // Remove dependency
  const removeDependency = (id) => {
    setDependencies(prev => prev.filter(d => d.id !== id));
    logInteraction('remove_dependency', { id });
  };

  // Add counterfactual
  const addCounterfactual = () => {
    if (currentCounterfactual.change.length < 10 || currentCounterfactual.outcome.length < 10) return;

    const newCF = {
      id: counterfactuals.length + 1,
      ...currentCounterfactual,
      timestamp: Date.now() - startTimeRef.current
    };

    setCounterfactuals(prev => [...prev, newCF]);
    setCurrentCounterfactual({ change: '', outcome: '', confidence: 50 });
    logInteraction('add_counterfactual', {
      change: currentCounterfactual.change.substring(0, 50),
      confidence: currentCounterfactual.confidence
    });
  };

  // Remove counterfactual
  const removeCounterfactual = (id) => {
    setCounterfactuals(prev => prev.filter(c => c.id !== id));
    logInteraction('remove_counterfactual', { id });
  };

  // Evaluate session
  const evaluateSession = () => {
    const evaluation = {
      dependenciesIdentified: dependencies.length,
      dependencyTypesUsed: new Set(dependencies.map(d => d.type)).size,
      counterfactualsExplored: counterfactuals.length,
      avgCounterfactualConfidence: counterfactuals.length > 0
        ? Math.round(counterfactuals.reduce((sum, c) => sum + c.confidence, 0) / counterfactuals.length)
        : 0,
      inevitabilityRating,
      timeSpent: Date.now() - startTimeRef.current,
      processQuality: 0,
      cognitiveGrowth: [],
      feedback: []
    };

    let score = 0;

    // Found multiple dependencies
    if (dependencies.length >= 4) {
      score += 15;
      evaluation.cognitiveGrowth.push('causal_mapping');
    } else if (dependencies.length >= 2) {
      score += 8;
    } else {
      evaluation.feedback.push("Outcomes typically depend on multiple factors. Try to identify at least 4.");
    }

    // Used multiple dependency types
    if (evaluation.dependencyTypesUsed >= 3) {
      score += 15;
      evaluation.cognitiveGrowth.push('nuanced_causation');
    } else {
      evaluation.feedback.push("Different factors play different causal roles. Explore necessary, sufficient, and contributing factors.");
    }

    // Explored multiple counterfactuals
    if (counterfactuals.length >= 3) {
      score += 20;
      evaluation.cognitiveGrowth.push('counterfactual_thinking');
    } else {
      evaluation.feedback.push("Exploring more 'what if' scenarios reveals how contingent outcomes really are.");
    }

    // Varied confidence levels (not all high or all low)
    const confidences = counterfactuals.map(c => c.confidence);
    const hasVariedConfidence = confidences.length >= 2 &&
      Math.max(...confidences) - Math.min(...confidences) >= 30;
    if (hasVariedConfidence) {
      score += 10;
      evaluation.cognitiveGrowth.push('uncertainty_calibration');
    }

    // Identified pivotal moment
    if (pivotalMoment.length >= 30) {
      score += 15;
      evaluation.cognitiveGrowth.push('leverage_point_identification');
    }

    // Provided reasoning for inevitability
    if (inevitabilityReasoning.length >= 50) {
      score += 15;
    }

    // Extracted lessons
    if (lessonsLearned.length >= 40) {
      score += 10;
      evaluation.cognitiveGrowth.push('meta_learning');
    }

    evaluation.processQuality = score;
    return evaluation;
  };

  // Complete session
  const completeSession = () => {
    const evaluation = evaluateSession();

    const sessionData = {
      scenario: scenario.title,
      outcome: scenario.outcome,
      duration: Date.now() - startTimeRef.current,
      dependencies,
      counterfactuals,
      analysis: {
        pivotalMoment,
        inevitabilityRating,
        inevitabilityReasoning,
        lessonsLearned
      },
      interactions,
      evaluation
    };

    onComplete?.(sessionData);
  };

  // Render dependency card
  const renderDependencyCard = (dep) => {
    const typeInfo = DEPENDENCY_TYPES.find(t => t.id === dep.type);

    return (
      <div
        key={dep.id}
        className="bg-stone-800/50 border border-stone-700 rounded-xl p-3 flex items-start gap-3"
      >
        <span className={`px-2 py-1 text-xs rounded-lg shrink-0 ${
          dep.type === 'necessary' ? 'bg-red-900/50 text-red-300' :
          dep.type === 'sufficient' ? 'bg-purple-900/50 text-purple-300' :
          dep.type === 'contributing' ? 'bg-amber-900/50 text-amber-300' :
          dep.type === 'enabling' ? 'bg-blue-900/50 text-blue-300' :
          'bg-green-900/50 text-green-300'
        }`}>
          {typeInfo?.label}
        </span>
        <p className="text-stone-200 text-sm flex-1">{dep.factor}</p>
        {phase === 'mapping' && (
          <button
            onClick={() => removeDependency(dep.id)}
            className="text-stone-500 hover:text-red-400 text-sm"
          >
            ×
          </button>
        )}
      </div>
    );
  };

  // Render counterfactual card
  const renderCounterfactualCard = (cf) => (
    <div
      key={cf.id}
      className="bg-stone-800/50 border border-stone-700 rounded-xl p-4"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="text-purple-400 text-sm font-bold">What If...</div>
        {phase === 'counterfactual' && (
          <button
            onClick={() => removeCounterfactual(cf.id)}
            className="text-stone-500 hover:text-red-400 text-sm"
          >
            Remove
          </button>
        )}
      </div>
      <p className="text-white mb-2">{cf.change}</p>
      <div className="text-stone-400 text-sm mb-2">
        <span className="text-amber-400">Then:</span> {cf.outcome}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-stone-500 text-xs">Confidence:</span>
        <div className="flex-1 h-2 bg-stone-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
            style={{ width: `${cf.confidence}%` }}
          />
        </div>
        <span className="text-amber-400 text-xs font-bold">{cf.confidence}%</span>
      </div>
    </div>
  );

  // Render phase content
  const renderPhaseContent = () => {
    switch (phase) {
      case 'briefing':
        return (
          <div className="space-y-6 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🔄</div>
            <h2 className="text-2xl font-bold text-purple-400">Counterfactual Engine</h2>

            <div className="bg-stone-800/50 rounded-xl p-6 text-left">
              <div className="text-stone-400 text-sm uppercase tracking-wider mb-2">The Outcome</div>
              <p className="text-xl text-white font-medium leading-relaxed">
                {scenario?.outcome}
              </p>
              {scenario?.context && (
                <p className="text-stone-400 text-sm mt-3">{scenario.context}</p>
              )}
            </div>

            <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-4">
              <h4 className="font-bold text-purple-400 mb-2">Your Mission</h4>
              <p className="text-stone-300 text-sm">
                This outcome happened. But was it inevitable?
                Explore the causal web that led here, and imagine how things could have gone differently.
              </p>
            </div>

            <div className="bg-stone-800/30 border border-stone-700 rounded-xl p-4">
              <h4 className="font-bold text-white mb-3">How This Works</h4>
              <ul className="text-stone-300 text-sm space-y-2 text-left">
                <li>1. <strong>Map Dependencies</strong> - What factors led to this outcome?</li>
                <li>2. <strong>Explore Counterfactuals</strong> - What if things had been different?</li>
                <li>3. <strong>Analyze Fragility</strong> - Was this outcome inevitable or contingent?</li>
              </ul>
            </div>

            <button
              onClick={() => setPhase('mapping')}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all"
            >
              Begin Mapping
            </button>
          </div>
        );

      case 'mapping':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Map Dependencies</h3>
              <span className="text-stone-400 text-sm">
                Factors: <span className="text-purple-400 font-bold">{dependencies.length}</span>
              </span>
            </div>

            {/* The Outcome */}
            <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-4">
              <div className="text-purple-400 text-xs uppercase mb-1">The Outcome</div>
              <p className="text-white">{scenario?.outcome}</p>
            </div>

            <div className="bg-stone-800/30 border border-stone-700 rounded-xl p-4 text-sm text-stone-400">
              <strong>Question:</strong> What factors HAD to be true for this outcome to occur?
              What was necessary? What just contributed? What enabled the conditions?
            </div>

            {/* Add dependency form */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <div className="text-purple-400 font-bold text-sm mb-3">Add Causal Factor</div>

              <div className="flex flex-wrap gap-2 mb-3">
                {DEPENDENCY_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setDependencyType(type.id)}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                      dependencyType === type.id
                        ? type.id === 'necessary' ? 'bg-red-600 text-white' :
                          type.id === 'sufficient' ? 'bg-purple-600 text-white' :
                          type.id === 'contributing' ? 'bg-amber-600 text-white' :
                          type.id === 'enabling' ? 'bg-blue-600 text-white' :
                          'bg-green-600 text-white'
                        : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                    }`}
                    title={type.description}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentDependency}
                  onChange={(e) => setCurrentDependency(e.target.value)}
                  placeholder="This outcome depended on..."
                  className="flex-1 bg-stone-900 border border-stone-600 rounded-lg px-3 py-2 text-white placeholder-stone-500"
                  onKeyPress={(e) => e.key === 'Enter' && addDependency()}
                />
                <button
                  onClick={addDependency}
                  disabled={currentDependency.trim().length < 10}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Dependencies list */}
            {dependencies.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-white font-bold">Identified Dependencies:</h4>
                <div className="space-y-2">
                  {dependencies.map(d => renderDependencyCard(d))}
                </div>
              </div>
            )}

            {dependencies.length >= 3 && (
              <button
                onClick={() => setPhase('counterfactual')}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all"
              >
                Explore Counterfactuals
              </button>
            )}

            {dependencies.length < 3 && (
              <p className="text-center text-stone-500 text-sm">
                Identify at least 3 dependencies before proceeding
              </p>
            )}
          </div>
        );

      case 'counterfactual':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Counterfactual Exploration</h3>
              <span className="text-stone-400 text-sm">
                Scenarios: <span className="text-purple-400 font-bold">{counterfactuals.length}</span>
              </span>
            </div>

            {/* The Outcome */}
            <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-4">
              <div className="text-purple-400 text-xs uppercase mb-1">Actual Outcome</div>
              <p className="text-white">{scenario?.outcome}</p>
            </div>

            {/* Prompts */}
            <div className="bg-stone-800/30 border border-stone-700 rounded-xl p-4">
              <div className="text-stone-400 text-sm mb-2">Consider these prompts:</div>
              <div className="flex flex-wrap gap-2">
                {COUNTERFACTUAL_PROMPTS.map((prompt, idx) => (
                  <span key={idx} className="px-2 py-1 bg-stone-700 text-stone-300 text-xs rounded-lg">
                    {prompt}
                  </span>
                ))}
              </div>
            </div>

            {/* Add counterfactual form */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4 space-y-3">
              <div className="text-purple-400 font-bold text-sm">Create Counterfactual</div>

              <div>
                <label className="text-stone-400 text-xs block mb-1">If this had been different...</label>
                <input
                  type="text"
                  value={currentCounterfactual.change}
                  onChange={(e) => setCurrentCounterfactual(prev => ({ ...prev, change: e.target.value }))}
                  placeholder="What if [X] had been different..."
                  className="w-full bg-stone-900 border border-stone-600 rounded-lg px-3 py-2 text-white placeholder-stone-500"
                />
              </div>

              <div>
                <label className="text-stone-400 text-xs block mb-1">Then the outcome would have been...</label>
                <input
                  type="text"
                  value={currentCounterfactual.outcome}
                  onChange={(e) => setCurrentCounterfactual(prev => ({ ...prev, outcome: e.target.value }))}
                  placeholder="The outcome would likely be..."
                  className="w-full bg-stone-900 border border-stone-600 rounded-lg px-3 py-2 text-white placeholder-stone-500"
                />
              </div>

              <div>
                <label className="text-stone-400 text-xs block mb-1">
                  How confident are you in this counterfactual?
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentCounterfactual.confidence}
                    onChange={(e) => setCurrentCounterfactual(prev => ({
                      ...prev,
                      confidence: parseInt(e.target.value)
                    }))}
                    className="flex-1 accent-purple-500"
                  />
                  <span className="text-purple-400 font-bold w-12 text-right">
                    {currentCounterfactual.confidence}%
                  </span>
                </div>
              </div>

              <button
                onClick={addCounterfactual}
                disabled={currentCounterfactual.change.length < 10 || currentCounterfactual.outcome.length < 10}
                className="w-full py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
              >
                Add Counterfactual
              </button>
            </div>

            {/* Counterfactuals list */}
            {counterfactuals.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-white font-bold">Alternative Histories:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {counterfactuals.map(cf => renderCounterfactualCard(cf))}
                </div>
              </div>
            )}

            {counterfactuals.length >= 2 && (
              <button
                onClick={() => setPhase('analysis')}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all"
              >
                Proceed to Analysis
              </button>
            )}

            {counterfactuals.length < 2 && (
              <p className="text-center text-stone-500 text-sm">
                Create at least 2 counterfactuals before proceeding
              </p>
            )}
          </div>
        );

      case 'analysis':
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white text-center">Fragility Analysis</h3>

            {/* Summary */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-400">{dependencies.length}</div>
                  <div className="text-stone-400 text-xs">Dependencies</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-400">{counterfactuals.length}</div>
                  <div className="text-stone-400 text-xs">Counterfactuals</div>
                </div>
              </div>
            </div>

            {/* Pivotal moment */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-purple-400 font-bold mb-2">
                What was the PIVOTAL moment or decision?
              </label>
              <p className="text-stone-400 text-xs mb-2">
                If you could change ONE thing to alter the outcome, what would it be?
              </p>
              <textarea
                value={pivotalMoment}
                onChange={(e) => setPivotalMoment(e.target.value)}
                placeholder="The most critical decision point was..."
                className="w-full h-24 bg-stone-900 border border-stone-600 rounded-lg p-3 text-white placeholder-stone-500 resize-none"
              />
            </div>

            {/* Inevitability rating */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-purple-400 font-bold mb-4">
                How INEVITABLE was this outcome?
              </label>
              <div className="flex items-center gap-4">
                <span className="text-green-400 text-sm">Could easily<br/>have differed</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={inevitabilityRating}
                  onChange={(e) => setInevitabilityRating(parseInt(e.target.value))}
                  className="flex-1 accent-purple-500"
                />
                <span className="text-red-400 text-sm">Was<br/>inevitable</span>
              </div>
              <div className="text-center text-2xl font-bold text-purple-400 mt-2">
                {inevitabilityRating}%
              </div>
            </div>

            {/* Reasoning */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-purple-400 font-bold mb-2">
                Why this inevitability rating?
              </label>
              <textarea
                value={inevitabilityReasoning}
                onChange={(e) => setInvitabilityReasoning(e.target.value)}
                placeholder="This outcome was contingent/inevitable because..."
                className="w-full h-24 bg-stone-900 border border-stone-600 rounded-lg p-3 text-white placeholder-stone-500 resize-none"
              />
            </div>

            {/* Lessons */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-purple-400 font-bold mb-2">
                What does this teach about causation and contingency?
              </label>
              <textarea
                value={lessonsLearned}
                onChange={(e) => setLessonsLearned(e.target.value)}
                placeholder="This exercise reveals that..."
                className="w-full h-24 bg-stone-900 border border-stone-600 rounded-lg p-3 text-white placeholder-stone-500 resize-none"
              />
            </div>

            {pivotalMoment.length >= 20 && inevitabilityReasoning.length >= 30 && (
              <button
                onClick={completeSession}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all"
              >
                Complete Analysis
              </button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-stone-900/90 border border-stone-700 rounded-2xl p-6 min-h-[500px]">
      {/* Phase indicator */}
      <div className="flex items-center gap-2 mb-6">
        {['briefing', 'mapping', 'counterfactual', 'analysis'].map((p, idx) => (
          <div
            key={p}
            className={`flex-1 h-2 rounded-full ${
              phase === p ? 'bg-purple-500' :
              ['briefing', 'mapping', 'counterfactual', 'analysis'].indexOf(phase) > idx
                ? 'bg-green-600' : 'bg-stone-700'
            }`}
          />
        ))}
      </div>

      {renderPhaseContent()}
    </div>
  );
};

export default CounterfactualEngine;
