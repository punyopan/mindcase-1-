import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * PERSPECTIVE PRISM - Premium Cognitive Training Game
 *
 * Present a complex situation and force users to analyze it from
 * multiple stakeholder perspectives, then reconcile the tensions.
 *
 * Phases:
 * 1. Briefing - Understand the situation
 * 2. Perspective Adoption - Analyze from each stakeholder's view
 * 3. Tension Mapping - Identify where perspectives conflict
 * 4. Synthesis - Reconcile or acknowledge irreconcilable differences
 *
 * Trains: Perspective-taking, empathy without agreement, understanding that
 *         "right" depends on position, intellectual humility
 */

const PerspectivePrism = ({ scenario, userId, onComplete }) => {
  // Game phases
  const [phase, setPhase] = useState('briefing');

  // Perspective tracking
  const [perspectives, setPerspectives] = useState([]);
  const [currentPerspectiveIndex, setCurrentPerspectiveIndex] = useState(0);
  const [perspectiveAnalyses, setPerspectiveAnalyses] = useState({});

  // Current perspective analysis form
  const [currentAnalysis, setCurrentAnalysis] = useState({
    wants: '',
    fears: '',
    values: '',
    sees: '',
    wouldSay: ''
  });

  // Tension mapping
  const [tensions, setTensions] = useState([]);
  const [currentTension, setCurrentTension] = useState({
    perspective1: '',
    perspective2: '',
    issue: '',
    canResolve: null,
    resolution: ''
  });

  // Synthesis
  const [personalPosition, setPersonalPosition] = useState('');
  const [whatChanged, setWhatChanged] = useState('');
  const [remainingUncertainty, setRemainingUncertainty] = useState('');
  const [empathyGained, setEmpathyGained] = useState([]);

  // Tracking
  const [interactions, setInteractions] = useState([]);
  const startTimeRef = useRef(Date.now());

  // Initialize perspectives from scenario
  useEffect(() => {
    if (scenario?.stakeholders) {
      setPerspectives(scenario.stakeholders.map((s, idx) => ({
        id: idx + 1,
        name: s.name,
        role: s.role,
        emoji: s.emoji || '👤',
        background: s.background
      })));
    }
  }, [scenario]);

  // Log interaction
  const logInteraction = useCallback((type, details) => {
    setInteractions(prev => [...prev, {
      type,
      details,
      timestamp: Date.now() - startTimeRef.current,
      phase
    }]);
  }, [phase]);

  // Save perspective analysis
  const savePerspectiveAnalysis = () => {
    const perspective = perspectives[currentPerspectiveIndex];
    if (!perspective) return;

    const filledFields = Object.values(currentAnalysis).filter(v => v.trim().length >= 10).length;
    if (filledFields < 3) return; // Require at least 3 fields

    setPerspectiveAnalyses(prev => ({
      ...prev,
      [perspective.id]: {
        ...currentAnalysis,
        timestamp: Date.now() - startTimeRef.current
      }
    }));

    logInteraction('save_perspective', {
      perspectiveId: perspective.id,
      perspectiveName: perspective.name,
      filledFields
    });

    // Move to next perspective or phase
    if (currentPerspectiveIndex < perspectives.length - 1) {
      setCurrentPerspectiveIndex(prev => prev + 1);
      setCurrentAnalysis({ wants: '', fears: '', values: '', sees: '', wouldSay: '' });
    }
  };

  // Add tension
  const addTension = () => {
    if (!currentTension.perspective1 || !currentTension.perspective2 ||
        currentTension.issue.length < 10) return;

    const newTension = {
      id: tensions.length + 1,
      ...currentTension,
      timestamp: Date.now() - startTimeRef.current
    };

    setTensions(prev => [...prev, newTension]);
    setCurrentTension({
      perspective1: '',
      perspective2: '',
      issue: '',
      canResolve: null,
      resolution: ''
    });

    logInteraction('add_tension', {
      perspectives: [currentTension.perspective1, currentTension.perspective2],
      canResolve: currentTension.canResolve
    });
  };

  // Toggle empathy gained
  const toggleEmpathy = (perspectiveId) => {
    setEmpathyGained(prev =>
      prev.includes(perspectiveId)
        ? prev.filter(id => id !== perspectiveId)
        : [...prev, perspectiveId]
    );
  };

  // Evaluate session
  const evaluateSession = () => {
    const analysesCompleted = Object.keys(perspectiveAnalyses).length;
    const avgFieldsPerAnalysis = analysesCompleted > 0
      ? Object.values(perspectiveAnalyses).reduce((sum, analysis) => {
          return sum + Object.values(analysis).filter(v => typeof v === 'string' && v.length >= 10).length;
        }, 0) / analysesCompleted
      : 0;

    const evaluation = {
      perspectivesAnalyzed: analysesCompleted,
      totalPerspectives: perspectives.length,
      avgFieldsPerPerspective: Math.round(avgFieldsPerAnalysis * 10) / 10,
      tensionsIdentified: tensions.length,
      resolvableTensions: tensions.filter(t => t.canResolve === true).length,
      irresolvableTensions: tensions.filter(t => t.canResolve === false).length,
      empathyGainedCount: empathyGained.length,
      timeSpent: Date.now() - startTimeRef.current,
      processQuality: 0,
      cognitiveGrowth: [],
      feedback: []
    };

    let score = 0;

    // Analyzed all perspectives
    if (analysesCompleted === perspectives.length) {
      score += 20;
      evaluation.cognitiveGrowth.push('complete_perspective_taking');
    } else if (analysesCompleted >= perspectives.length / 2) {
      score += 10;
    }

    // Deep analysis (multiple fields per perspective)
    if (avgFieldsPerAnalysis >= 4) {
      score += 15;
      evaluation.cognitiveGrowth.push('deep_empathy');
    } else if (avgFieldsPerAnalysis < 3) {
      evaluation.feedback.push("Try to fill out more fields for each perspective to truly understand their position.");
    }

    // Identified tensions
    if (tensions.length >= 2) {
      score += 15;
      evaluation.cognitiveGrowth.push('conflict_recognition');
    } else {
      evaluation.feedback.push("Most multi-stakeholder situations involve conflicts. Look for where interests clash.");
    }

    // Recognized both resolvable and irresolvable tensions
    if (evaluation.resolvableTensions > 0 && evaluation.irresolvableTensions > 0) {
      score += 15;
      evaluation.cognitiveGrowth.push('nuanced_conflict_analysis');
    }

    // Gained empathy for multiple perspectives
    if (empathyGained.length >= 2) {
      score += 10;
      evaluation.cognitiveGrowth.push('expanded_empathy');
    }

    // Articulated personal position with nuance
    if (personalPosition.length >= 50) {
      score += 10;
    }

    // Acknowledged change in thinking
    if (whatChanged.length >= 30) {
      score += 10;
      evaluation.cognitiveGrowth.push('intellectual_flexibility');
    }

    // Acknowledged remaining uncertainty
    if (remainingUncertainty.length >= 30) {
      score += 5;
      evaluation.cognitiveGrowth.push('epistemic_humility');
    }

    evaluation.processQuality = score;
    return evaluation;
  };

  // Complete session
  const completeSession = () => {
    const evaluation = evaluateSession();

    const sessionData = {
      scenario: scenario.title,
      situation: scenario.situation,
      duration: Date.now() - startTimeRef.current,
      perspectives: perspectives.map(p => ({
        ...p,
        analysis: perspectiveAnalyses[p.id]
      })),
      tensions,
      synthesis: {
        personalPosition,
        whatChanged,
        remainingUncertainty,
        empathyGained: empathyGained.map(id => perspectives.find(p => p.id === id)?.name)
      },
      interactions,
      evaluation
    };

    onComplete?.(sessionData);
  };

  // Check if current perspective is complete
  const isCurrentPerspectiveComplete = () => {
    const filledFields = Object.values(currentAnalysis).filter(v => v.trim().length >= 10).length;
    return filledFields >= 3;
  };

  // Check if all perspectives are analyzed
  const allPerspectivesAnalyzed = () => {
    return Object.keys(perspectiveAnalyses).length === perspectives.length;
  };

  // Render perspective card
  const renderPerspectiveCard = (perspective, isActive = false, isComplete = false) => {
    return (
      <div
        key={perspective.id}
        className={`p-4 rounded-xl border transition-all ${
          isActive
            ? 'bg-cyan-900/30 border-cyan-700/50'
            : isComplete
              ? 'bg-green-900/20 border-green-700/50'
              : 'bg-stone-800/50 border-stone-700'
        }`}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{perspective.emoji}</span>
          <div>
            <div className="font-bold text-white">{perspective.name}</div>
            <div className="text-stone-400 text-xs">{perspective.role}</div>
          </div>
          {isComplete && <span className="ml-auto text-green-400">✓</span>}
        </div>
        {perspective.background && (
          <p className="text-stone-400 text-sm">{perspective.background}</p>
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
            <div className="text-6xl mb-4">🔮</div>
            <h2 className="text-2xl font-bold text-cyan-400">Perspective Prism</h2>

            <div className="bg-stone-800/50 rounded-xl p-6 text-left">
              <div className="text-stone-400 text-sm uppercase tracking-wider mb-2">The Situation</div>
              <p className="text-white leading-relaxed">{scenario?.situation}</p>
            </div>

            <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-xl p-4">
              <h4 className="font-bold text-cyan-400 mb-2">Your Mission</h4>
              <p className="text-stone-300 text-sm">
                Step into each stakeholder's shoes. Understand what they want, fear, and value.
                Then map the tensions between them. There may be no "right" answer - only trade-offs.
              </p>
            </div>

            {/* Stakeholders preview */}
            <div className="bg-stone-800/30 border border-stone-700 rounded-xl p-4">
              <h4 className="font-bold text-white mb-3">The Stakeholders</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {perspectives.map(p => (
                  <div key={p.id} className="text-center p-3 bg-stone-800/50 rounded-lg">
                    <div className="text-2xl mb-1">{p.emoji}</div>
                    <div className="text-white text-sm font-medium">{p.name}</div>
                    <div className="text-stone-500 text-xs">{p.role}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setPhase('perspectives')}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all"
            >
              Begin Perspective Analysis
            </button>
          </div>
        );

      case 'perspectives':
        const currentPerspective = perspectives[currentPerspectiveIndex];

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Adopt Perspectives</h3>
              <span className="text-stone-400 text-sm">
                {Object.keys(perspectiveAnalyses).length}/{perspectives.length} Complete
              </span>
            </div>

            {/* Perspective tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {perspectives.map((p, idx) => {
                const isComplete = !!perspectiveAnalyses[p.id];
                const isCurrent = idx === currentPerspectiveIndex;

                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      if (isComplete || idx <= currentPerspectiveIndex) {
                        setCurrentPerspectiveIndex(idx);
                        if (perspectiveAnalyses[p.id]) {
                          setCurrentAnalysis(perspectiveAnalyses[p.id]);
                        } else {
                          setCurrentAnalysis({ wants: '', fears: '', values: '', sees: '', wouldSay: '' });
                        }
                      }
                    }}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                      isCurrent
                        ? 'bg-cyan-600 text-white'
                        : isComplete
                          ? 'bg-green-900/50 text-green-300'
                          : 'bg-stone-700 text-stone-400'
                    }`}
                    disabled={!isComplete && idx > currentPerspectiveIndex}
                  >
                    <span>{p.emoji}</span>
                    <span>{p.name}</span>
                    {isComplete && <span className="text-green-400">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Current perspective */}
            {currentPerspective && (
              <div className="bg-cyan-900/20 border border-cyan-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{currentPerspective.emoji}</span>
                  <div>
                    <div className="text-xl font-bold text-white">{currentPerspective.name}</div>
                    <div className="text-cyan-400">{currentPerspective.role}</div>
                  </div>
                </div>
                {currentPerspective.background && (
                  <p className="text-stone-300 text-sm">{currentPerspective.background}</p>
                )}
              </div>
            )}

            {/* Analysis form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
                <label className="text-cyan-400 font-bold text-sm block mb-2">
                  What does {currentPerspective?.name} WANT?
                </label>
                <textarea
                  value={currentAnalysis.wants}
                  onChange={(e) => setCurrentAnalysis(prev => ({ ...prev, wants: e.target.value }))}
                  placeholder="Their primary goals and desires..."
                  className="w-full h-20 bg-stone-900 border border-stone-600 rounded-lg p-2 text-white placeholder-stone-500 resize-none text-sm"
                />
              </div>

              <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
                <label className="text-cyan-400 font-bold text-sm block mb-2">
                  What does {currentPerspective?.name} FEAR?
                </label>
                <textarea
                  value={currentAnalysis.fears}
                  onChange={(e) => setCurrentAnalysis(prev => ({ ...prev, fears: e.target.value }))}
                  placeholder="Their concerns and worries..."
                  className="w-full h-20 bg-stone-900 border border-stone-600 rounded-lg p-2 text-white placeholder-stone-500 resize-none text-sm"
                />
              </div>

              <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
                <label className="text-cyan-400 font-bold text-sm block mb-2">
                  What does {currentPerspective?.name} VALUE?
                </label>
                <textarea
                  value={currentAnalysis.values}
                  onChange={(e) => setCurrentAnalysis(prev => ({ ...prev, values: e.target.value }))}
                  placeholder="Their core values and principles..."
                  className="w-full h-20 bg-stone-900 border border-stone-600 rounded-lg p-2 text-white placeholder-stone-500 resize-none text-sm"
                />
              </div>

              <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
                <label className="text-cyan-400 font-bold text-sm block mb-2">
                  How does {currentPerspective?.name} SEE the situation?
                </label>
                <textarea
                  value={currentAnalysis.sees}
                  onChange={(e) => setCurrentAnalysis(prev => ({ ...prev, sees: e.target.value }))}
                  placeholder="Their interpretation of what's happening..."
                  className="w-full h-20 bg-stone-900 border border-stone-600 rounded-lg p-2 text-white placeholder-stone-500 resize-none text-sm"
                />
              </div>
            </div>

            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="text-cyan-400 font-bold text-sm block mb-2">
                What would {currentPerspective?.name} SAY to justify their position?
              </label>
              <textarea
                value={currentAnalysis.wouldSay}
                onChange={(e) => setCurrentAnalysis(prev => ({ ...prev, wouldSay: e.target.value }))}
                placeholder="In their own words, their argument would be..."
                className="w-full h-24 bg-stone-900 border border-stone-600 rounded-lg p-3 text-white placeholder-stone-500 resize-none"
              />
            </div>

            <div className="flex gap-4">
              {!perspectiveAnalyses[currentPerspective?.id] && (
                <button
                  onClick={savePerspectiveAnalysis}
                  disabled={!isCurrentPerspectiveComplete()}
                  className="flex-1 py-3 bg-cyan-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-500 transition-colors"
                >
                  Save & {currentPerspectiveIndex < perspectives.length - 1 ? 'Next Perspective' : 'Continue'}
                </button>
              )}

              {allPerspectivesAnalyzed() && (
                <button
                  onClick={() => setPhase('tensions')}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all"
                >
                  Map Tensions
                </button>
              )}
            </div>
          </div>
        );

      case 'tensions':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Map Tensions</h3>
              <span className="text-stone-400 text-sm">
                Tensions: <span className="text-cyan-400 font-bold">{tensions.length}</span>
              </span>
            </div>

            <div className="bg-stone-800/30 border border-stone-700 rounded-xl p-4 text-sm text-stone-400">
              <strong>Question:</strong> Where do these perspectives CONFLICT?
              Which disagreements can be resolved, and which represent fundamental differences in values?
            </div>

            {/* Add tension form */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4 space-y-4">
              <div className="text-cyan-400 font-bold text-sm">Identify a Tension</div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-stone-400 text-xs block mb-1">Perspective 1</label>
                  <select
                    value={currentTension.perspective1}
                    onChange={(e) => setCurrentTension(prev => ({ ...prev, perspective1: e.target.value }))}
                    className="w-full bg-stone-900 border border-stone-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="">Select...</option>
                    {perspectives.map(p => (
                      <option key={p.id} value={p.name}>{p.emoji} {p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-stone-400 text-xs block mb-1">Perspective 2</label>
                  <select
                    value={currentTension.perspective2}
                    onChange={(e) => setCurrentTension(prev => ({ ...prev, perspective2: e.target.value }))}
                    className="w-full bg-stone-900 border border-stone-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="">Select...</option>
                    {perspectives.filter(p => p.name !== currentTension.perspective1).map(p => (
                      <option key={p.id} value={p.name}>{p.emoji} {p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-stone-400 text-xs block mb-1">What is the core tension/conflict?</label>
                <textarea
                  value={currentTension.issue}
                  onChange={(e) => setCurrentTension(prev => ({ ...prev, issue: e.target.value }))}
                  placeholder="They disagree about..."
                  className="w-full h-20 bg-stone-900 border border-stone-600 rounded-lg p-3 text-white placeholder-stone-500 resize-none"
                />
              </div>

              <div>
                <label className="text-stone-400 text-xs block mb-2">Can this tension be resolved?</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentTension(prev => ({ ...prev, canResolve: true }))}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      currentTension.canResolve === true
                        ? 'bg-green-600 text-white'
                        : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                    }`}
                  >
                    Yes, resolvable
                  </button>
                  <button
                    onClick={() => setCurrentTension(prev => ({ ...prev, canResolve: false }))}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      currentTension.canResolve === false
                        ? 'bg-red-600 text-white'
                        : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                    }`}
                  >
                    No, fundamental
                  </button>
                </div>
              </div>

              {currentTension.canResolve === true && (
                <div>
                  <label className="text-stone-400 text-xs block mb-1">How could it be resolved?</label>
                  <input
                    type="text"
                    value={currentTension.resolution}
                    onChange={(e) => setCurrentTension(prev => ({ ...prev, resolution: e.target.value }))}
                    placeholder="A possible resolution would be..."
                    className="w-full bg-stone-900 border border-stone-600 rounded-lg px-3 py-2 text-white placeholder-stone-500"
                  />
                </div>
              )}

              <button
                onClick={addTension}
                disabled={!currentTension.perspective1 || !currentTension.perspective2 ||
                          currentTension.issue.length < 10 || currentTension.canResolve === null}
                className="w-full py-2 bg-cyan-600 text-white rounded-lg disabled:opacity-50"
              >
                Add Tension
              </button>
            </div>

            {/* Tensions list */}
            {tensions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-white font-bold">Identified Tensions:</h4>
                {tensions.map(t => (
                  <div
                    key={t.id}
                    className={`p-4 rounded-xl border ${
                      t.canResolve
                        ? 'bg-green-900/20 border-green-700/50'
                        : 'bg-red-900/20 border-red-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-white">{t.perspective1}</span>
                      <span className="text-stone-500">vs</span>
                      <span className="font-bold text-white">{t.perspective2}</span>
                      <span className={`ml-auto px-2 py-1 text-xs rounded ${
                        t.canResolve ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                      }`}>
                        {t.canResolve ? 'Resolvable' : 'Fundamental'}
                      </span>
                    </div>
                    <p className="text-stone-300 text-sm">{t.issue}</p>
                    {t.resolution && (
                      <p className="text-green-400 text-sm mt-2">
                        Resolution: {t.resolution}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {tensions.length >= 1 && (
              <button
                onClick={() => setPhase('synthesis')}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all"
              >
                Proceed to Synthesis
              </button>
            )}
          </div>
        );

      case 'synthesis':
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white text-center">Synthesis</h3>

            {/* Summary */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-cyan-400">{perspectives.length}</div>
                  <div className="text-stone-400 text-xs">Perspectives</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {tensions.filter(t => t.canResolve).length}
                  </div>
                  <div className="text-stone-400 text-xs">Resolvable</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">
                    {tensions.filter(t => !t.canResolve).length}
                  </div>
                  <div className="text-stone-400 text-xs">Fundamental</div>
                </div>
              </div>
            </div>

            {/* Empathy gained */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-cyan-400 font-bold mb-3">
                Which perspectives do you now have more empathy for?
              </label>
              <div className="flex flex-wrap gap-2">
                {perspectives.map(p => (
                  <button
                    key={p.id}
                    onClick={() => toggleEmpathy(p.id)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      empathyGained.includes(p.id)
                        ? 'bg-cyan-600 text-white'
                        : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                    }`}
                  >
                    <span>{p.emoji}</span>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Personal position */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-cyan-400 font-bold mb-2">
                After seeing all perspectives, what is YOUR position?
              </label>
              <textarea
                value={personalPosition}
                onChange={(e) => setPersonalPosition(e.target.value)}
                placeholder="My position is... because..."
                className="w-full h-28 bg-stone-900 border border-stone-600 rounded-lg p-3 text-white placeholder-stone-500 resize-none"
              />
            </div>

            {/* What changed */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-cyan-400 font-bold mb-2">
                How has your thinking changed through this exercise?
              </label>
              <textarea
                value={whatChanged}
                onChange={(e) => setWhatChanged(e.target.value)}
                placeholder="Before I thought... Now I understand..."
                className="w-full h-24 bg-stone-900 border border-stone-600 rounded-lg p-3 text-white placeholder-stone-500 resize-none"
              />
            </div>

            {/* Remaining uncertainty */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-cyan-400 font-bold mb-2">
                What are you still uncertain about?
              </label>
              <textarea
                value={remainingUncertainty}
                onChange={(e) => setRemainingUncertainty(e.target.value)}
                placeholder="I'm still unsure about..."
                className="w-full h-20 bg-stone-900 border border-stone-600 rounded-lg p-3 text-white placeholder-stone-500 resize-none"
              />
            </div>

            {personalPosition.length >= 30 && whatChanged.length >= 20 && (
              <button
                onClick={completeSession}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all"
              >
                Complete Session
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
        {['briefing', 'perspectives', 'tensions', 'synthesis'].map((p, idx) => (
          <div
            key={p}
            className={`flex-1 h-2 rounded-full ${
              phase === p ? 'bg-cyan-500' :
              ['briefing', 'perspectives', 'tensions', 'synthesis'].indexOf(phase) > idx
                ? 'bg-green-600' : 'bg-stone-700'
            }`}
          />
        ))}
      </div>

      {renderPhaseContent()}
    </div>
  );
};

export default PerspectivePrism;
