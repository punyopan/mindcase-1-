import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * ASSUMPTION EXCAVATOR - Premium Cognitive Training Game
 *
 * Present a confident claim, decision, or conclusion.
 * Force users to dig backwards and uncover the hidden assumptions.
 *
 * Phases:
 * 1. Briefing - Read the claim
 * 2. Excavation - Identify hidden assumptions
 * 3. Testing - Stress-test each assumption
 * 4. Foundation Report - Synthesize and rate claim fragility
 *
 * Trains: Identifying unstated premises, questioning foundations,
 *         recognizing that conclusions depend on invisible supports
 */

const AssumptionExcavator = ({ scenario, userId, onComplete }) => {
  // Game phases
  const [phase, setPhase] = useState('briefing');
  const [excavationStarted, setExcavationStarted] = useState(false);

  // Assumption tracking
  const [assumptions, setAssumptions] = useState([]);
  const [currentAssumption, setCurrentAssumption] = useState('');
  const [assumptionCategory, setAssumptionCategory] = useState('factual');
  const [testedAssumptions, setTestedAssumptions] = useState({});

  // Foundation analysis
  const [fragilityRating, setFragilityRating] = useState(50);
  const [fragilityReasoning, setFragilityReasoning] = useState('');
  const [keyVulnerability, setKeyVulnerability] = useState('');
  const [wouldStillBelieve, setWouldStillBelieve] = useState(null);

  // Hint system for excavation
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState(null);

  // Tracking
  const [interactions, setInteractions] = useState([]);
  const startTimeRef = useRef(Date.now());

  const ASSUMPTION_CATEGORIES = [
    { id: 'factual', label: 'Factual', description: 'Assumes certain facts are true' },
    { id: 'causal', label: 'Causal', description: 'Assumes X causes Y' },
    { id: 'value', label: 'Value/Priority', description: 'Assumes what matters or should matter' },
    { id: 'definitional', label: 'Definitional', description: 'Assumes meaning of terms' },
    { id: 'scope', label: 'Scope/Boundary', description: 'Assumes what is/isn\'t included' },
    { id: 'temporal', label: 'Temporal', description: 'Assumes timing, sequence, or duration' }
  ];

  const EXCAVATION_PROMPTS = [
    "What must be true about the WORLD for this claim to hold?",
    "What must be true about PEOPLE for this to work?",
    "What does this claim IGNORE or leave out?",
    "What DEFINITIONS are being assumed?",
    "What CAUSE-EFFECT relationships are implied?",
    "What VALUES or PRIORITIES are embedded?",
    "What TIME assumptions are made?",
    "Who BENEFITS if we accept this claim uncritically?"
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

  // Add assumption
  const addAssumption = () => {
    if (currentAssumption.trim().length < 10) return;

    const newAssumption = {
      id: assumptions.length + 1,
      text: currentAssumption.trim(),
      category: assumptionCategory,
      timestamp: Date.now() - startTimeRef.current,
      tested: false,
      testResult: null
    };

    setAssumptions(prev => [...prev, newAssumption]);
    setCurrentAssumption('');
    logInteraction('add_assumption', {
      text: currentAssumption.substring(0, 50),
      category: assumptionCategory
    });
  };

  // Remove assumption
  const removeAssumption = (id) => {
    setAssumptions(prev => prev.filter(a => a.id !== id));
    logInteraction('remove_assumption', { id });
  };

  // Get hint
  const getHint = () => {
    const unusedPrompts = EXCAVATION_PROMPTS.filter((_, idx) =>
      !interactions.some(i => i.type === 'hint_used' && i.details.promptIndex === idx)
    );

    if (unusedPrompts.length > 0) {
      const promptIndex = EXCAVATION_PROMPTS.indexOf(unusedPrompts[0]);
      setCurrentHint(unusedPrompts[0]);
      setHintsUsed(prev => prev + 1);
      logInteraction('hint_used', { promptIndex, hint: unusedPrompts[0] });
    }
  };

  // Test assumption - evaluate how critical it is
  const testAssumption = (assumptionId, testData) => {
    setTestedAssumptions(prev => ({
      ...prev,
      [assumptionId]: testData
    }));

    setAssumptions(prev => prev.map(a =>
      a.id === assumptionId
        ? { ...a, tested: true, testResult: testData }
        : a
    ));

    logInteraction('test_assumption', { assumptionId, ...testData });
  };

  // Evaluate session
  const evaluateSession = () => {
    const evaluation = {
      assumptionsFound: assumptions.length,
      categoriesUsed: new Set(assumptions.map(a => a.category)).size,
      assumptionsTested: Object.keys(testedAssumptions).length,
      hintsUsed,
      fragilityRating,
      timeSpent: Date.now() - startTimeRef.current,
      processQuality: 0,
      cognitiveGrowth: [],
      feedback: []
    };

    let score = 0;

    // Found multiple assumptions
    if (assumptions.length >= 4) {
      score += 20;
      evaluation.cognitiveGrowth.push('premise_identification');
    } else if (assumptions.length >= 2) {
      score += 10;
    } else {
      evaluation.feedback.push("Most claims rest on multiple hidden assumptions. Try to find at least 4.");
    }

    // Used multiple categories
    if (evaluation.categoriesUsed >= 3) {
      score += 15;
      evaluation.cognitiveGrowth.push('multi_dimensional_analysis');
    } else {
      evaluation.feedback.push("Assumptions come in different types - factual, causal, value-based. Explore different categories.");
    }

    // Tested assumptions
    if (evaluation.assumptionsTested >= 3) {
      score += 20;
      evaluation.cognitiveGrowth.push('critical_testing');
    }

    // Critical evaluation of fragility
    const criticalAssumptions = Object.values(testedAssumptions).filter(t => t.criticality >= 4).length;
    if (criticalAssumptions > 0) {
      score += 15;
      evaluation.cognitiveGrowth.push('vulnerability_detection');
    }

    // Justified fragility rating
    if (fragilityReasoning.length >= 50) {
      score += 15;
    }

    // Identified key vulnerability
    if (keyVulnerability.length >= 30) {
      score += 15;
      evaluation.cognitiveGrowth.push('foundational_skepticism');
    }

    evaluation.processQuality = score;
    return evaluation;
  };

  // Complete session
  const completeSession = () => {
    const evaluation = evaluateSession();

    const sessionData = {
      scenario: scenario.title,
      claim: scenario.claim,
      duration: Date.now() - startTimeRef.current,
      assumptions,
      testedAssumptions,
      fragilityAnalysis: {
        rating: fragilityRating,
        reasoning: fragilityReasoning,
        keyVulnerability,
        wouldStillBelieve
      },
      hintsUsed,
      interactions,
      evaluation
    };

    onComplete?.(sessionData);
  };

  // Render assumption card
  const renderAssumptionCard = (assumption) => {
    const testData = testedAssumptions[assumption.id];
    const category = ASSUMPTION_CATEGORIES.find(c => c.id === assumption.category);

    return (
      <div
        key={assumption.id}
        className={`bg-stone-800/50 border rounded-xl p-4 transition-all ${
          testData ? 'border-green-700/50' : 'border-stone-700'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <span className={`px-2 py-1 text-xs rounded-lg ${
            assumption.category === 'factual' ? 'bg-blue-900/50 text-blue-300' :
            assumption.category === 'causal' ? 'bg-purple-900/50 text-purple-300' :
            assumption.category === 'value' ? 'bg-amber-900/50 text-amber-300' :
            assumption.category === 'definitional' ? 'bg-cyan-900/50 text-cyan-300' :
            assumption.category === 'scope' ? 'bg-pink-900/50 text-pink-300' :
            'bg-green-900/50 text-green-300'
          }`}>
            {category?.label}
          </span>
          {!testData && phase === 'excavation' && (
            <button
              onClick={() => removeAssumption(assumption.id)}
              className="text-stone-500 hover:text-red-400 text-sm"
            >
              Remove
            </button>
          )}
        </div>

        <p className="text-stone-200 text-sm mb-3">{assumption.text}</p>

        {phase === 'testing' && !testData && (
          <AssumptionTester
            assumption={assumption}
            onTest={(data) => testAssumption(assumption.id, data)}
          />
        )}

        {testData && (
          <div className="mt-3 pt-3 border-t border-stone-700">
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-stone-500">Criticality: </span>
                <span className={`font-bold ${
                  testData.criticality >= 4 ? 'text-red-400' :
                  testData.criticality >= 3 ? 'text-amber-400' : 'text-green-400'
                }`}>
                  {testData.criticality}/5
                </span>
              </div>
              <div>
                <span className="text-stone-500">Likely True: </span>
                <span className="text-stone-300">{testData.likelihood}%</span>
              </div>
            </div>
            {testData.reasoning && (
              <p className="text-stone-400 text-xs mt-2 italic">"{testData.reasoning}"</p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render phase content
  const renderPhaseContent = () => {
    switch (phase) {
      case 'briefing':
        return (
          <div className="space-y-6 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-amber-400">Assumption Excavator</h2>

            <div className="bg-stone-800/50 rounded-xl p-6 text-left">
              <div className="text-stone-400 text-sm uppercase tracking-wider mb-2">The Claim</div>
              <p className="text-xl text-white font-medium leading-relaxed">
                "{scenario?.claim}"
              </p>
              {scenario?.source && (
                <p className="text-stone-500 text-sm mt-3">— {scenario.source}</p>
              )}
            </div>

            <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-4">
              <h4 className="font-bold text-amber-400 mb-2">Your Mission</h4>
              <p className="text-stone-300 text-sm">
                Every claim rests on hidden assumptions. Your job is to excavate them.
                What must be TRUE for this claim to be valid? What is being ASSUMED but not stated?
              </p>
            </div>

            <div className="bg-stone-800/30 border border-stone-700 rounded-xl p-4">
              <h4 className="font-bold text-white mb-3">How This Works</h4>
              <ul className="text-stone-300 text-sm space-y-2 text-left">
                <li>1. <strong>Excavate</strong> - Identify the hidden assumptions</li>
                <li>2. <strong>Categorize</strong> - What type of assumption is it?</li>
                <li>3. <strong>Test</strong> - How critical is each assumption? How likely is it true?</li>
                <li>4. <strong>Report</strong> - How fragile is the original claim?</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setPhase('excavation');
                setExcavationStarted(true);
              }}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-xl hover:from-amber-500 hover:to-red-500 transition-all"
            >
              Begin Excavation
            </button>
          </div>
        );

      case 'excavation':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Excavate Assumptions</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={getHint}
                  disabled={hintsUsed >= EXCAVATION_PROMPTS.length}
                  className="px-3 py-1 bg-stone-700 text-stone-300 text-sm rounded-lg hover:bg-stone-600 disabled:opacity-50"
                >
                  Get Prompt ({EXCAVATION_PROMPTS.length - hintsUsed} left)
                </button>
                <span className="text-stone-400 text-sm">
                  Found: <span className="text-amber-400 font-bold">{assumptions.length}</span>
                </span>
              </div>
            </div>

            {/* The Claim - Always visible */}
            <div className="bg-stone-800/30 border border-stone-700 rounded-xl p-4">
              <div className="text-stone-500 text-xs uppercase mb-1">The Claim</div>
              <p className="text-stone-200">"{scenario?.claim}"</p>
            </div>

            {/* Hint display */}
            {currentHint && (
              <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-4 animate-fadeIn">
                <div className="text-purple-400 text-sm font-bold mb-1">Excavation Prompt:</div>
                <p className="text-purple-200">{currentHint}</p>
              </div>
            )}

            {/* Add assumption form */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <div className="text-amber-400 font-bold text-sm mb-3">Add Hidden Assumption</div>

              <div className="flex flex-wrap gap-2 mb-3">
                {ASSUMPTION_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setAssumptionCategory(cat.id)}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                      assumptionCategory === cat.id
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                    }`}
                    title={cat.description}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentAssumption}
                  onChange={(e) => setCurrentAssumption(e.target.value)}
                  placeholder="This claim assumes that..."
                  className="flex-1 bg-stone-900 border border-stone-600 rounded-lg px-3 py-2 text-white placeholder-stone-500"
                  onKeyPress={(e) => e.key === 'Enter' && addAssumption()}
                />
                <button
                  onClick={addAssumption}
                  disabled={currentAssumption.trim().length < 10}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Assumptions list */}
            {assumptions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-white font-bold">Discovered Assumptions:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {assumptions.map(a => renderAssumptionCard(a))}
                </div>
              </div>
            )}

            {assumptions.length >= 2 && (
              <button
                onClick={() => setPhase('testing')}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-xl hover:from-amber-500 hover:to-red-500 transition-all"
              >
                Proceed to Testing ({assumptions.length} assumptions)
              </button>
            )}

            {assumptions.length < 2 && (
              <p className="text-center text-stone-500 text-sm">
                Find at least 2 assumptions before proceeding
              </p>
            )}
          </div>
        );

      case 'testing':
        const untestedCount = assumptions.filter(a => !testedAssumptions[a.id]).length;

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Test Assumptions</h3>
              <div className="text-stone-400 text-sm">
                Tested: <span className="text-green-400 font-bold">
                  {Object.keys(testedAssumptions).length}/{assumptions.length}
                </span>
              </div>
            </div>

            <div className="bg-stone-800/30 border border-stone-700 rounded-xl p-4">
              <div className="text-stone-500 text-xs uppercase mb-1">The Claim</div>
              <p className="text-stone-200">"{scenario?.claim}"</p>
            </div>

            <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-4 text-sm">
              <p className="text-amber-200">
                For each assumption, evaluate: <strong>How CRITICAL</strong> is it to the claim?
                And <strong>How LIKELY</strong> is it to actually be true?
              </p>
            </div>

            <div className="space-y-4">
              {assumptions.map(a => renderAssumptionCard(a))}
            </div>

            {untestedCount === 0 && (
              <button
                onClick={() => setPhase('foundation')}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-xl hover:from-amber-500 hover:to-red-500 transition-all"
              >
                Generate Foundation Report
              </button>
            )}
          </div>
        );

      case 'foundation':
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white text-center">Foundation Report</h3>

            <div className="bg-stone-800/30 border border-stone-700 rounded-xl p-4">
              <div className="text-stone-500 text-xs uppercase mb-1">The Claim</div>
              <p className="text-stone-200">"{scenario?.claim}"</p>
            </div>

            {/* Summary of findings */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <h4 className="text-amber-400 font-bold text-sm mb-3">Excavation Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{assumptions.length}</div>
                  <div className="text-stone-400 text-xs">Assumptions Found</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">
                    {Object.values(testedAssumptions).filter(t => t.criticality >= 4).length}
                  </div>
                  <div className="text-stone-400 text-xs">Critical Dependencies</div>
                </div>
              </div>
            </div>

            {/* Fragility Rating */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-amber-400 font-bold mb-4">
                How FRAGILE is this claim's foundation?
              </label>
              <div className="flex items-center gap-4">
                <span className="text-green-400 text-sm">Solid</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fragilityRating}
                  onChange={(e) => setFragilityRating(parseInt(e.target.value))}
                  className="flex-1 accent-amber-500"
                />
                <span className="text-red-400 text-sm">Fragile</span>
              </div>
              <div className="text-center text-2xl font-bold text-amber-400 mt-2">
                {fragilityRating}%
              </div>
            </div>

            {/* Reasoning */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-amber-400 font-bold mb-2">
                Why this fragility rating?
              </label>
              <textarea
                value={fragilityReasoning}
                onChange={(e) => setFragilityReasoning(e.target.value)}
                placeholder="The claim is fragile/solid because..."
                className="w-full h-24 bg-stone-900 border border-stone-600 rounded-lg p-3 text-white placeholder-stone-500 resize-none"
              />
            </div>

            {/* Key vulnerability */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-amber-400 font-bold mb-2">
                What is the SINGLE biggest vulnerability?
              </label>
              <textarea
                value={keyVulnerability}
                onChange={(e) => setKeyVulnerability(e.target.value)}
                placeholder="If one thing could break this claim, it would be..."
                className="w-full h-20 bg-stone-900 border border-stone-600 rounded-lg p-3 text-white placeholder-stone-500 resize-none"
              />
            </div>

            {/* Final verdict */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-amber-400 font-bold mb-3">
                After excavating these assumptions, do you still believe the claim?
              </label>
              <div className="flex gap-3">
                {['yes', 'partially', 'no'].map(option => (
                  <button
                    key={option}
                    onClick={() => setWouldStillBelieve(option)}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                      wouldStillBelieve === option
                        ? option === 'yes' ? 'bg-green-600 text-white' :
                          option === 'partially' ? 'bg-amber-600 text-white' :
                          'bg-red-600 text-white'
                        : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                    }`}
                  >
                    {option === 'yes' ? 'Yes, Still Believe' :
                     option === 'partially' ? 'Partially' :
                     'No, Now Skeptical'}
                  </button>
                ))}
              </div>
            </div>

            {fragilityReasoning.length >= 30 && keyVulnerability.length >= 20 && wouldStillBelieve && (
              <button
                onClick={completeSession}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all"
              >
                Complete Excavation
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
        {['briefing', 'excavation', 'testing', 'foundation'].map((p, idx) => (
          <div
            key={p}
            className={`flex-1 h-2 rounded-full ${
              phase === p ? 'bg-amber-500' :
              ['briefing', 'excavation', 'testing', 'foundation'].indexOf(phase) > idx
                ? 'bg-green-600' : 'bg-stone-700'
            }`}
          />
        ))}
      </div>

      {renderPhaseContent()}
    </div>
  );
};

// Sub-component for testing assumptions
const AssumptionTester = ({ assumption, onTest }) => {
  const [criticality, setCriticality] = useState(3);
  const [likelihood, setLikelihood] = useState(50);
  const [reasoning, setReasoning] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleTest = () => {
    onTest({
      criticality,
      likelihood,
      reasoning
    });
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full py-2 bg-amber-900/30 border border-amber-700/50 text-amber-400 rounded-lg text-sm hover:bg-amber-900/50 transition-colors"
      >
        Test This Assumption
      </button>
    );
  }

  return (
    <div className="space-y-3 mt-3 pt-3 border-t border-stone-700 animate-fadeIn">
      <div>
        <label className="text-stone-400 text-xs block mb-1">
          How CRITICAL is this to the claim? (1=minor, 5=essential)
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setCriticality(n)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                criticality === n
                  ? n >= 4 ? 'bg-red-600 text-white' :
                    n >= 3 ? 'bg-amber-600 text-white' : 'bg-green-600 text-white'
                  : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-stone-400 text-xs block mb-1">
          How LIKELY is this assumption to be true?
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={likelihood}
          onChange={(e) => setLikelihood(parseInt(e.target.value))}
          className="w-full accent-amber-500"
        />
        <div className="text-center text-amber-400 font-bold">{likelihood}%</div>
      </div>

      <div>
        <input
          type="text"
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          placeholder="Brief reasoning (optional)"
          className="w-full bg-stone-900 border border-stone-600 rounded-lg px-3 py-2 text-sm text-white placeholder-stone-500"
        />
      </div>

      <button
        onClick={handleTest}
        className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-500 transition-colors"
      >
        Confirm Test
      </button>
    </div>
  );
};

export default AssumptionExcavator;
