import React, { useState, useEffect, useCallback, useRef } from 'react';
import TranslationService from '../../services/TranslationService';

/**
 * VARIABLE MANIFOLD - Cognitive Training Game
 *
 * Present a system with 6-8 interacting variables.
 * Force users to:
 * 1. Understand interconnections before intervening
 * 2. See multi-variable consequences of actions
 * 3. Accept that NO WIN STATE exists - only trade-offs
 * 4. Articulate irreducible tensions
 *
 * CRITICAL: There is no winning. Only configurations with different trade-offs.
 */

const VariableManifold = ({ scenario, userId, onComplete }) => {
  // Game phases
  const [phase, setPhase] = useState('briefing');
  const [explorationTime, setExplorationTime] = useState(0);

  // System state
  const [variables, setVariables] = useState(scenario?.variables || []);
  const [history, setHistory] = useState([]);
  const [interventionCount, setInterventionCount] = useState(0);
  const [maxInterventions] = useState(6);

  // User inputs
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [proposedValue, setProposedValue] = useState(50);
  const [interventionReason, setInterventionReason] = useState('');

  // Tension analysis
  const [identifiedTensions, setIdentifiedTensions] = useState([]);
  const [currentTension, setCurrentTension] = useState('');
  const [tradeoffAnalysis, setTradeoffAnalysis] = useState('');
  const [finalReflection, setFinalReflection] = useState('');

  // Consequence prediction
  const [predictions, setPredictions] = useState({});
  const [showConsequences, setShowConsequences] = useState(false);
  const [lastConsequences, setLastConsequences] = useState([]);

  // Tracking
  const [explorationPath, setExplorationPath] = useState([]);
  const startTimeRef = useRef(Date.now());

  // Track exploration time
  useEffect(() => {
    if (phase === 'system_exploration' || phase === 'intervention') {
      const timer = setInterval(() => {
        setExplorationTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase]);

  // Log exploration
  const logExploration = useCallback((action, details) => {
    setExplorationPath(prev => [...prev, {
      action,
      details,
      timestamp: Date.now() - startTimeRef.current,
      phase
    }]);
  }, [phase]);

  // Calculate consequences of an intervention
  const calculateConsequences = (varId, newValue) => {
    const variable = variables.find(v => v.id === varId);
    if (!variable) return [];

    const oldValue = variable.currentValue;
    const change = newValue - oldValue;
    const consequences = [];

    // Apply effects to connected variables
    const effects = scenario?.interventionEffects?.[varId] || {};

    Object.entries(effects).forEach(([targetId, multiplier]) => {
      const targetVar = variables.find(v => v.id === targetId);
      if (targetVar) {
        const effect = change * multiplier;
        consequences.push({
          variableId: targetId,
          variableName: targetVar.name,
          oldValue: targetVar.currentValue,
          effect: effect,
          newValue: Math.max(targetVar.range[0], Math.min(targetVar.range[1], targetVar.currentValue + effect)),
          direction: effect > 0 ? 'increase' : effect < 0 ? 'decrease' : 'stable'
        });
      }
    });

    // Add second-order effects (effects of effects)
    const secondaryEffects = [];
    consequences.forEach(c => {
      const secondaryMultipliers = scenario?.interventionEffects?.[c.variableId] || {};
      Object.entries(secondaryMultipliers).forEach(([targetId, mult]) => {
        if (targetId !== varId && !consequences.find(con => con.variableId === targetId)) {
          const target = variables.find(v => v.id === targetId);
          if (target) {
            const secondEffect = c.effect * mult * 0.5; // Dampened secondary effect
            if (Math.abs(secondEffect) > 0.5) {
              secondaryEffects.push({
                variableId: targetId,
                variableName: target.name,
                effect: secondEffect,
                isSecondary: true,
                source: c.variableName
              });
            }
          }
        }
      });
    });

    return [...consequences, ...secondaryEffects];
  };

  // Apply intervention
  const applyIntervention = () => {
    if (!selectedVariable || interventionCount >= maxInterventions) return;

    const consequences = calculateConsequences(selectedVariable.id, proposedValue);

    // Record history
    const intervention = {
      variableId: selectedVariable.id,
      variableName: selectedVariable.name,
      oldValue: selectedVariable.currentValue,
      newValue: proposedValue,
      reason: interventionReason,
      consequences,
      predictions: { ...predictions },
      timestamp: Date.now()
    };
    setHistory(prev => [...prev, intervention]);

    // Update variables
    setVariables(prev => {
      const updated = [...prev];

      // Update the intervened variable
      const mainIdx = updated.findIndex(v => v.id === selectedVariable.id);
      if (mainIdx >= 0) {
        updated[mainIdx] = { ...updated[mainIdx], currentValue: proposedValue };
      }

      // Apply consequences
      consequences.forEach(c => {
        const idx = updated.findIndex(v => v.id === c.variableId);
        if (idx >= 0 && c.newValue !== undefined) {
          updated[idx] = { ...updated[idx], currentValue: c.newValue };
        }
      });

      return updated;
    });

    setLastConsequences(consequences);
    setShowConsequences(true);
    setInterventionCount(prev => prev + 1);
    setSelectedVariable(null);
    setProposedValue(50);
    setInterventionReason('');
    setPredictions({});

    logExploration('intervention', {
      variable: selectedVariable.name,
      value: proposedValue,
      consequences: consequences.length
    });
  };

  // Add identified tension
  const addTension = () => {
    if (currentTension.trim().length > 20) {
      setIdentifiedTensions(prev => [...prev, currentTension.trim()]);
      setCurrentTension('');
      logExploration('identify_tension', { tension: currentTension });
    }
  };

  // Check constraints
  const checkConstraints = () => {
    const violations = [];
    scenario?.constraints?.forEach(c => {
      if (c.type === 'budget') {
        const total = variables
          .filter(v => !v.isOutcome)
          .reduce((sum, v) => sum + v.currentValue, 0);
        if (total > c.limit) {
          violations.push(`Budget exceeded: ${total}M of ${c.limit}M limit`);
        }
      } else if (c.type === 'political' || c.type === 'federal') {
        c.variables.forEach(varId => {
          const v = variables.find(vv => vv.id === varId);
          if (v && v.currentValue < c.min) {
            violations.push(`${v.name} below required minimum (${v.currentValue}M < ${c.min}M)`);
          }
        });
      }
    });
    return violations;
  };

  // Complete session
  const completeSession = () => {
    const evaluation = evaluateSession();

    const sessionData = {
      scenario: scenario.title,
      duration: Date.now() - startTimeRef.current,
      interventionHistory: history,
      finalState: variables,
      identifiedTensions,
      tradeoffAnalysis,
      finalReflection,
      explorationPath,
      evaluation
    };

    onComplete?.(sessionData);
  };

  // Evaluate session
  const evaluateSession = () => {
    const evaluation = {
      interventionsUsed: interventionCount,
      tensionsIdentified: identifiedTensions.length,
      systemsThinking: 0,
      tradeoffAwareness: 0,
      constraintViolations: checkConstraints().length,
      processQuality: 0,
      cognitiveGrowth: [],
      feedback: []
    };

    let score = 0;

    // Did they explore before intervening?
    const firstInterventionTime = history[0]?.timestamp || 0;
    if (firstInterventionTime > 60000) { // More than 60 seconds before first intervention
      score += 15;
      evaluation.cognitiveGrowth.push('systems_thinking');
    } else if (history.length > 0) {
      evaluation.feedback.push("You intervened quickly. More exploration might reveal hidden connections.");
    }

    // Did they provide reasoning for interventions?
    const reasonedInterventions = history.filter(h => h.reason && h.reason.length > 20).length;
    if (reasonedInterventions >= 3) {
      score += 15;
    } else {
      evaluation.feedback.push("Articulating WHY you're making each change helps clarify your thinking.");
    }

    // Did they identify meaningful tensions?
    if (identifiedTensions.length >= 3) {
      score += 20;
      evaluation.cognitiveGrowth.push('tradeoff_analysis');
    } else {
      evaluation.feedback.push("This system has fundamental tensions. Try to name more of them.");
    }

    // Did they try to predict consequences?
    const predictionAttempts = history.filter(h => Object.keys(h.predictions || {}).length > 0).length;
    if (predictionAttempts >= 2) {
      score += 15;
      evaluation.cognitiveGrowth.push('consequence_thinking');
    }

    // Quality of tradeoff analysis
    if (tradeoffAnalysis.length >= 100) {
      score += 15;
      // Check if they acknowledge no win state
      if (tradeoffAnalysis.toLowerCase().includes('cannot') ||
          tradeoffAnalysis.toLowerCase().includes('impossible') ||
          tradeoffAnalysis.toLowerCase().includes('trade-off') ||
          tradeoffAnalysis.toLowerCase().includes('sacrifice')) {
        score += 10;
        evaluation.cognitiveGrowth.push('accepting_tradeoffs');
      }
    }

    // Constraint awareness
    if (evaluation.constraintViolations === 0) {
      score += 10;
    } else {
      evaluation.feedback.push("Your final configuration violates some constraints.");
    }

    evaluation.processQuality = score;
    return evaluation;
  };

  // Render variable card
  const renderVariableCard = (variable, isInteractive = false) => {
    const isSelected = selectedVariable?.id === variable.id;
    const recentChange = lastConsequences.find(c => c.variableId === variable.id);

    return (
      <div
        key={variable.id}
        onClick={() => isInteractive && !variable.isOutcome && setSelectedVariable(variable)}
        className={`p-4 rounded-xl border transition-all ${variable.isOutcome
            ? 'bg-stone-900/50 border-stone-700 cursor-default'
            : isSelected
              ? 'bg-amber-900/50 border-amber-500 cursor-pointer'
              : 'bg-stone-800/50 border-stone-700 hover:border-amber-600 cursor-pointer'
          } ${recentChange ? 'ring-2 ring-amber-500/50' : ''}`}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-white font-bold">{variable.name}</div>
            <div className="text-stone-400 text-xs">{variable.description}</div>
          </div>
          {variable.isOutcome && (
            <span className="text-xs px-2 py-1 bg-purple-900/50 text-purple-300 rounded">{TranslationService.t('cognitive.outcome')}</span>
          )}
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-stone-400">{TranslationService.t('cognitive.current')}</span>
            <span className={`font-bold ${recentChange
                ? recentChange.direction === 'increase'
                  ? 'text-green-400'
                  : 'text-red-400'
                : 'text-amber-400'
              }`}>
              {variable.currentValue.toFixed(1)} {variable.unit}
              {recentChange && (
                <span className="ml-2 text-xs">
                  ({recentChange.effect > 0 ? '+' : ''}{recentChange.effect.toFixed(1)})
                </span>
              )}
            </span>
          </div>
          <div className="bg-stone-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${variable.isOutcome ? 'bg-purple-500' : 'bg-amber-500'}`}
              style={{
                width: `${((variable.currentValue - variable.range[0]) / (variable.range[1] - variable.range[0])) * 100}%`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-stone-500 mt-1">
            <span>{variable.range[0]}</span>
            <span>{variable.range[1]}</span>
          </div>
        </div>
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

            <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-4">
              <h4 className="font-bold text-red-400 mb-2">{TranslationService.t('cognitive.critical_notice')}</h4>
              <p className="text-stone-300 text-sm">
                {TranslationService.t('cognitive.no_win_state')}
              </p>
            </div>

            <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4">
              <h4 className="font-bold text-amber-400 mb-2">{TranslationService.t('cognitive.how_this_works')}</h4>
              <ul className="text-stone-300 text-sm space-y-2 text-left">
                <li>1. {TranslationService.t('cognitive.variable_step_1')}</li>
                <li>2. {TranslationService.t('cognitive.variable_step_2')}</li>
                <li>3. {TranslationService.t('cognitive.variable_step_3')}</li>
                <li>4. {TranslationService.t('cognitive.variable_step_4')}</li>
                <li>5. {TranslationService.t('cognitive.variable_step_5')}</li>
              </ul>
            </div>

            <button
              onClick={() => setPhase('system_exploration')}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-xl hover:from-amber-500 hover:to-red-500 transition-all"
            >
              {TranslationService.t('cognitive.explore_system')}
            </button>
          </div>
        );

      case 'system_exploration':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{TranslationService.t('cognitive.system_exploration')}</h3>
              <div className="px-4 py-2 bg-stone-800 rounded-lg text-stone-400">
                {TranslationService.t('cognitive.exploring')}: {Math.floor(explorationTime / 60)}:{String(explorationTime % 60).padStart(2, '0')}
              </div>
            </div>

            <div className="bg-stone-800/30 border border-stone-700 rounded-xl p-4 text-sm text-stone-400 mb-4">
              <strong>{TranslationService.t('cognitive.instructions')}:</strong> {TranslationService.t('cognitive.exploration_instructions')}
            </div>

            {/* System diagram placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {variables.map(v => renderVariableCard(v, false))}
            </div>

            {/* Constraints */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <h4 className="font-bold text-amber-400 mb-2">{TranslationService.t('cognitive.system_constraints')}</h4>
              <ul className="space-y-2">
                {scenario?.constraints?.map((c, idx) => (
                  <li key={idx} className="text-stone-300 text-sm flex items-center gap-2">
                    <span className="text-red-400">!</span>
                    {c.description}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tensions hint */}
            <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-4">
              <h4 className="font-bold text-amber-400 mb-2">{TranslationService.t('cognitive.known_tensions')}</h4>
              <ul className="space-y-1">
                {scenario?.tensions?.slice(0, 2).map((t, idx) => (
                  <li key={idx} className="text-stone-300 text-sm">
                    {t.nature}
                  </li>
                ))}
                <li className="text-stone-500 text-sm italic">{TranslationService.t('cognitive.more_tensions')}</li>
              </ul>
            </div>

            {explorationTime >= 30 && (
              <button
                onClick={() => setPhase('intervention')}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-xl hover:from-amber-500 hover:to-red-500 transition-all"
              >
                {TranslationService.t('cognitive.begin_interventions')}
              </button>
            )}

            {explorationTime < 30 && (
              <p className="text-center text-stone-500 text-sm">
                {TranslationService.t('cognitive.explore_minimum')}
              </p>
            )}
          </div>
        );

      case 'intervention':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{TranslationService.t('cognitive.make_interventions')}</h3>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-stone-800 rounded-lg">
                  <span className="text-stone-400">{TranslationService.t('cognitive.interventions_label')}:</span>
                  <span className="ml-2 font-bold text-amber-400">{interventionCount}/{maxInterventions}</span>
                </div>
              </div>
            </div>

            {/* Consequence display */}
            {showConsequences && lastConsequences.length > 0 && (
              <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-amber-400">{TranslationService.t('cognitive.ripple_effects')}</h4>
                  <button
                    onClick={() => setShowConsequences(false)}
                    className="text-stone-400 hover:text-white text-sm"
                  >
                    {TranslationService.t('cognitive.dismiss')}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {lastConsequences.map((c, idx) => (
                    <div
                      key={idx}
                      className={`px-3 py-2 rounded-lg text-sm ${c.direction === 'increase'
                          ? 'bg-green-900/30 text-green-300'
                          : 'bg-red-900/30 text-red-300'
                        }`}
                    >
                      {c.variableName}: {c.effect > 0 ? '+' : ''}{c.effect.toFixed(1)}
                      {c.isSecondary && <span className="text-xs ml-1">(via {c.source})</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Constraint violations */}
            {checkConstraints().length > 0 && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 mb-4">
                <h4 className="font-bold text-red-400 mb-2">{TranslationService.t('cognitive.constraint_violations')}</h4>
                <ul className="space-y-1">
                  {checkConstraints().map((v, idx) => (
                    <li key={idx} className="text-red-300 text-sm">{v}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Variables grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {variables.map(v => renderVariableCard(v, true))}
            </div>

            {/* Intervention panel */}
            {selectedVariable && (
              <div className="bg-stone-800/50 border border-amber-700/50 rounded-xl p-4">
                <h4 className="font-bold text-amber-400 mb-3">
                  {TranslationService.t('cognitive.adjusting')}: {selectedVariable.name}
                </h4>

                <div className="mb-4">
                  <label className="block text-stone-400 text-sm mb-2">
                    {TranslationService.t('cognitive.new_value')}: {proposedValue} {selectedVariable.unit}
                  </label>
                  <input
                    type="range"
                    min={selectedVariable.range[0]}
                    max={selectedVariable.range[1]}
                    value={proposedValue}
                    onChange={(e) => setProposedValue(parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="flex justify-between text-xs text-stone-500">
                    <span>{selectedVariable.range[0]}</span>
                    <span>{TranslationService.t('cognitive.current')}: {selectedVariable.currentValue}</span>
                    <span>{selectedVariable.range[1]}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-stone-400 text-sm mb-2">
                    {TranslationService.t('cognitive.change_reason')}
                  </label>
                  <input
                    type="text"
                    value={interventionReason}
                    onChange={(e) => setInterventionReason(e.target.value)}
                    placeholder={TranslationService.t('cognitive.change_placeholder')}
                    className="w-full bg-stone-900 border border-stone-600 rounded-lg px-3 py-2 text-white placeholder-stone-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-stone-400 text-sm mb-2">
                    {TranslationService.t('cognitive.predict_consequences')}:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {variables.filter(v => v.id !== selectedVariable.id).slice(0, 4).map(v => (
                      <div key={v.id} className="flex items-center gap-2">
                        <span className="text-stone-300 text-sm truncate">{v.name}:</span>
                        <select
                          value={predictions[v.id] || ''}
                          onChange={(e) => setPredictions(prev => ({ ...prev, [v.id]: e.target.value }))}
                          className="flex-1 bg-stone-800 border border-stone-600 rounded px-2 py-1 text-sm text-white"
                        >
                          <option value="">?</option>
                          <option value="increase">{TranslationService.t('cognitive.increase')}</option>
                          <option value="decrease">{TranslationService.t('cognitive.decrease')}</option>
                          <option value="stable">{TranslationService.t('cognitive.no_change')}</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={applyIntervention}
                  disabled={interventionCount >= maxInterventions}
                  className="w-full py-2 bg-amber-600 text-white font-bold rounded-lg disabled:opacity-50"
                >
                  {TranslationService.t('cognitive.apply_intervention')}
                </button>
              </div>
            )}

            {interventionCount >= 2 && (
              <button
                onClick={() => setPhase('tension_articulation')}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-xl hover:from-amber-500 hover:to-red-500 transition-all"
              >
                {TranslationService.t('cognitive.articulate_tensions')}
              </button>
            )}
          </div>
        );

      case 'tension_articulation':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">{TranslationService.t('cognitive.irreducible_tensions')}</h3>
            <p className="text-stone-400 text-sm">
              {TranslationService.t('cognitive.tensions_explanation')}
            </p>

            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-amber-400 font-bold mb-2">
                {TranslationService.t('cognitive.tensions_discovered')}
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={currentTension}
                  onChange={(e) => setCurrentTension(e.target.value)}
                  placeholder={TranslationService.t('cognitive.tension_placeholder')}
                  className="flex-1 bg-stone-900 border border-stone-600 rounded-lg px-3 py-2 text-white placeholder-stone-500"
                />
                <button
                  onClick={addTension}
                  disabled={currentTension.trim().length < 20}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg disabled:opacity-50"
                >
                  {TranslationService.t('cognitive.add')}
                </button>
              </div>

              {identifiedTensions.length > 0 && (
                <ul className="space-y-2">
                  {identifiedTensions.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-stone-200 text-sm bg-stone-900/50 rounded-lg p-3">
                      <span className="text-amber-500">{idx + 1}.</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Hint: known tensions */}
            <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-4">
              <h4 className="font-bold text-amber-400 mb-2">{TranslationService.t('cognitive.hint_tensions')}</h4>
              <ul className="space-y-1 text-stone-400 text-sm">
                {scenario?.irresolvableTensions?.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-amber-400 font-bold mb-2">
                {TranslationService.t('cognitive.analyze_tradeoffs')}:
              </label>
              <textarea
                value={tradeoffAnalysis}
                onChange={(e) => setTradeoffAnalysis(e.target.value)}
                placeholder={TranslationService.t('cognitive.tradeoff_placeholder')}
                className="w-full h-32 bg-stone-900 border border-stone-600 rounded-lg p-3 text-white placeholder-stone-500 resize-none"
              />
            </div>

            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-amber-400 font-bold mb-2">
                {TranslationService.t('cognitive.final_reflection_prompt')}
              </label>
              <textarea
                value={finalReflection}
                onChange={(e) => setFinalReflection(e.target.value)}
                placeholder={TranslationService.t('cognitive.defensible_placeholder')}
                className="w-full h-32 bg-stone-900 border border-stone-600 rounded-lg p-3 text-white placeholder-stone-500 resize-none"
              />
            </div>

            {identifiedTensions.length >= 2 && tradeoffAnalysis.length >= 50 && (
              <button
                onClick={completeSession}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all"
              >
                {TranslationService.t('cognitive.complete_session')}
              </button>
            )}

            {(identifiedTensions.length < 2 || tradeoffAnalysis.length < 50) && (
              <p className="text-center text-stone-500 text-sm">
                {TranslationService.t('cognitive.tensions_minimum')}
              </p>
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
        {['briefing', 'system_exploration', 'intervention', 'tension_articulation'].map((p, idx) => (
          <div
            key={p}
            className={`flex-1 h-2 rounded-full ${phase === p
                ? 'bg-amber-500'
                : ['briefing', 'system_exploration', 'intervention', 'tension_articulation'].indexOf(phase) > idx
                  ? 'bg-green-600'
                  : 'bg-stone-700'
              }`}
          />
        ))}
      </div>

      {renderPhaseContent()}
    </div>
  );
};

export default VariableManifold;
