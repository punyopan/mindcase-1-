import React, { useState, useEffect, useCallback } from 'react';
import SignalField from './SignalField';
import ForensicNarrative from './ForensicNarrative';
import VariableManifold from './VariableManifold';
import AnalysisPhase from './AnalysisPhase';
// Premium Cognitive Training Games
import AssumptionExcavator from './AssumptionExcavator';
import CounterfactualEngine from './CounterfactualEngine';
import PerspectivePrism from './PerspectivePrism';
import TranslationService from '../../services/TranslationService';
import { CognitiveTranslator } from '../../services/CognitiveTranslator';

/**
 * COGNITIVE TRAINER - Main Orchestration Component
 *
 * Manages the sequential cognitive training experience:
 * 1. Intro & Briefing
 * 2. Stage 1: Signal Field (Observation)
 * 3. Stage 2: Forensic Narrative (Hypothesis)
 * 4. Stage 3: Variable Manifold (Decision/System)
 * 5. Stage 4: Analysis Phase (Metacognition)
 *
 * THIS IS NOT A GAMIFIED EXPERIENCE - it's cognitive resistance training
 */

const CognitiveTrainer = ({ userId, onClose }) => {
  // Session storage key
  const SESSION_STORAGE_KEY = `cognitive_session_${userId}`;

  // Application State
  // 0: Intro/StageSelect, 1: SignalField, 2: ForensicNarrative, 3: VariableManifold, 4: Analysis
  const [stage, setStage] = useState(0);
  const [showIntermission, setShowIntermission] = useState(false);
  const [sessionPortfolio, setSessionPortfolio] = useState({}); // Stores data from all stages

  // Premium Stage Selection State
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null); // null = full circuit, 1/2/3 = single stage

  // Session persistence state
  const [hasSavedSession, setHasSavedSession] = useState(false);

  // Game Scenarios (loaded on mount)
  const [scenarios, setScenarios] = useState({
    signal: null,
    forensic: null,
    variable: null,
    // Premium game scenarios
    assumption: null,
    counterfactual: null,
    perspective: null
  });

  // Save session state to localStorage
  const saveSessionState = useCallback(() => {
    try {
      const sessionState = {
        stage,
        showIntermission,
        sessionPortfolio,
        selectedStage,
        scenarios,
        savedAt: Date.now()
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionState));
    } catch (e) {
      console.warn('Failed to save cognitive session:', e);
    }
  }, [stage, showIntermission, sessionPortfolio, selectedStage, scenarios, SESSION_STORAGE_KEY]);

  // Load saved session state from localStorage
  const loadSavedSession = useCallback(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const sessionState = JSON.parse(saved);
        // Only restore if session is less than 24 hours old
        if (Date.now() - sessionState.savedAt < 24 * 60 * 60 * 1000) {
          return sessionState;
        } else {
          // Clear expired session
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }
    } catch (e) {
      console.warn('Failed to load cognitive session:', e);
    }
    return null;
  }, [SESSION_STORAGE_KEY]);

  // Clear saved session
  const clearSavedSession = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      setHasSavedSession(false);
    } catch (e) {
      console.warn('Failed to clear cognitive session:', e);
    }
  }, [SESSION_STORAGE_KEY]);

  // Reset training progress
  const handleResetProgress = () => {
    clearSavedSession();
    setStage(0);
    setShowIntermission(false);
    setSessionPortfolio({});
    setSelectedStage(null);
    // Regenerate scenarios
    const engine = window.CognitiveGameEngine;
    if (engine) {
      setScenarios({
        signal: engine.generateSignalFieldScenario('medium'),
        forensic: engine.generateForensicNarrativeScenario('medium'),
        variable: engine.generateVariableManifoldScenario('medium'),
        // Premium game scenarios
        assumption: engine.generateAssumptionExcavatorScenario?.('medium'),
        counterfactual: engine.generateCounterfactualEngineScenario?.('medium'),
        perspective: engine.generatePerspectivePrismScenario?.('medium')
      });
    }
  };

  // Handle abort with session save
  const handleAbort = () => {
    // Only save if user has made progress (stage > 0)
    if (stage > 0) {
      saveSessionState();
    }
    onClose();
  };

  // Load scenarios and check user status on mount
  useEffect(() => {
    // Check for saved session first
    const savedSession = loadSavedSession();

    // Function to translate scenarios
    const translateScenarios = async (rawScenarios) => {
      const currentLang = TranslationService.getLanguage();
      
      // No translation needed for English
      if (currentLang === 'English' || !currentLang) {
        return rawScenarios;
      }

      const translatedScenarios = { ...rawScenarios };
      try {
        const keys = Object.keys(rawScenarios);
        await Promise.all(keys.map(async (key) => {
          if (rawScenarios[key]) {
            const scenarioWithType = { ...rawScenarios[key], type: key };
            translatedScenarios[key] = await CognitiveTranslator.getTranslatedScenario(scenarioWithType, currentLang);
          }
        }));
      } catch (err) {
        console.warn('Cognitive scenario translation failed:', err);
      }
      return translatedScenarios;
    };

    if (savedSession && savedSession.stage > 0) {
      // Restore saved session
      setStage(savedSession.stage);
      setShowIntermission(savedSession.showIntermission);
      setSessionPortfolio(savedSession.sessionPortfolio);
      setSelectedStage(savedSession.selectedStage);
      setHasSavedSession(true);
      
      // Translate saved scenarios
      translateScenarios(savedSession.scenarios).then(translated => {
        setScenarios(translated);
      });
    } else {
      // Generate new scenarios
      const engine = window.CognitiveGameEngine;
      if (engine) {
        const rawScenarios = {
          signal: engine.generateSignalFieldScenario('medium'),
          forensic: engine.generateForensicNarrativeScenario('medium'),
          variable: engine.generateVariableManifoldScenario('medium'),
          assumption: engine.generateAssumptionExcavatorScenario?.('medium'),
          counterfactual: engine.generateCounterfactualEngineScenario?.('medium'),
          perspective: engine.generatePerspectivePrismScenario?.('medium')
        };

        translateScenarios(rawScenarios).then(translated => {
          setScenarios(translated);
        });
      }
    }

    // Check if returning user (has completed at least one session)
    const hasCompleted = window.UserProgressService?.hasCompletedCognitiveTraining?.(userId) || false;
    setIsReturningUser(hasCompleted);

    // Check premium status (async)
    const checkPremium = async () => {
      const premium = await window.PaymentService?.isPremium?.(userId) || false;
      setIsPremium(premium);
    };
    checkPremium();
  }, [userId, loadSavedSession]);


  // Handle completion of a micro-game
  const handleStageComplete = (gameKey, data) => {
    console.log(`Completed ${gameKey}`, data);
    
    // 1. Update Portfolio
    const updatedPortfolio = {
      ...sessionPortfolio,
      [gameKey]: data
    };
    setSessionPortfolio(updatedPortfolio);

    // 2. Check if single-stage mode
    if (selectedStage !== null) {
      // Single stage mode: go directly to analysis
      setStage(4);
    } else {
      // Full circuit mode: show intermission
      setShowIntermission(true);
    }
  };

  const handleIntermissionProceed = () => {
    setShowIntermission(false);
    setStage(prev => prev + 1);
  };
  
  // Handle stage selection for returning premium users
  const handleStageSelect = (stageNumber) => {
    setSelectedStage(stageNumber);
    setStage(stageNumber);
  };
  
  // Start full circuit (for returning users who want the full experience)
  const handleStartFullCircuit = () => {
    setSelectedStage(null);
    setStage(1);
  };

  // Handle final session completion (after Analysis Phase)
  const handleSessionComplete = (analysisData) => {
    // Construct full session record
    const fullSessionRecord = {
      timestamp: Date.now(),
      stages: sessionPortfolio,
      analysis: analysisData,
      overallScore: analysisData.aggregateScore
    };

    // Save to user history
    if (window.UserProgressService?.recordCognitiveTrainingSession) {
      window.UserProgressService.recordCognitiveTrainingSession(userId, fullSessionRecord);
    } else {
        console.warn("UserProgressService.recordCognitiveTrainingSession not found - analytics may not be saved.");
    }
    
    // Close trainer
    onClose();
  };

  // RENDERERS
  
  const renderIntermission = () => {
    let title = "";
    let sub = "";
    let next = "";
    let icon = "";

    if (stage === 1) {
        title = TranslationService.t('cognitive.observation_concluded');
        sub = TranslationService.t('cognitive.initializing_hypothesis');
        next = TranslationService.t('cognitive.stage_forensic');
        icon = "🔍";
    } else if (stage === 2) {
        title = TranslationService.t('cognitive.hypothesis_concluded');
        sub = TranslationService.t('cognitive.initializing_system');
        next = TranslationService.t('cognitive.stage_variable');
        icon = "⚙️";
    } else if (stage === 3) {
        title = TranslationService.t('cognitive.training_complete');
        sub = TranslationService.t('cognitive.compiling_analysis');
        next = TranslationService.t('cognitive.stage_analysis');
        icon = "🧠";
    }

    return (
        <div className="text-center space-y-8 animate-fadeIn max-w-2xl mx-auto">
             <div className="text-6xl mb-4 animate-pulse">{icon}</div>
             <div>
                <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
                <p className="text-stone-400">{sub}</p>
             </div>

             <div className="bg-stone-800/50 p-6 rounded-xl border border-stone-700">
                <div className="text-sm text-stone-500 uppercase tracking-widest mb-2">{TranslationService.t('cognitive.preparing_next')}</div>
                <div className="text-2xl font-bold text-amber-400">{next}</div>
             </div>

             <button
                onClick={handleIntermissionProceed}
                className="px-10 py-4 bg-stone-700 hover:bg-stone-600 text-white font-bold rounded-xl transition-all"
             >
                {TranslationService.t('cognitive.proceed')}
             </button>
        </div>
    );
  };


  // RENDERERS
  
  const renderIntro = () => (
    <div className="text-center space-y-6 animate-fadeIn">
      <div className="text-6xl mb-4">🧠</div>
      <h1 className="text-3xl font-bold text-white">{TranslationService.t('cognitive.title')}</h1>
      <p className="text-stone-400 max-w-xl mx-auto">
        {TranslationService.t('cognitive.subtitle')}
      </p>

      <div className="flex flex-col gap-4 max-w-lg mx-auto mt-8 text-left">
        <div className="flex items-center gap-4 bg-stone-800/50 p-4 rounded-xl border border-stone-700">
           <div className="bg-amber-900/50 p-3 rounded-lg text-xl">📊</div>
           <div>
             <div className="text-amber-400 font-bold">1. {TranslationService.t('cognitive.signal_detection')}</div>
             <div className="text-stone-400 text-sm">{TranslationService.t('cognitive.signal_detection_desc')}</div>
           </div>
        </div>
        <div className="w-0.5 h-6 bg-stone-700 mx-8"></div>
        <div className="flex items-center gap-4 bg-stone-800/50 p-4 rounded-xl border border-stone-700">
           <div className="bg-amber-900/50 p-3 rounded-lg text-xl">🔍</div>
           <div>
             <div className="text-amber-400 font-bold">2. {TranslationService.t('cognitive.forensic_reconstruction')}</div>
             <div className="text-stone-400 text-sm">{TranslationService.t('cognitive.forensic_reconstruction_desc')}</div>
           </div>
        </div>
         <div className="w-0.5 h-6 bg-stone-700 mx-8"></div>
        <div className="flex items-center gap-4 bg-stone-800/50 p-4 rounded-xl border border-stone-700">
           <div className="bg-amber-900/50 p-3 rounded-lg text-xl">⚙️</div>
           <div>
             <div className="text-amber-400 font-bold">3. {TranslationService.t('cognitive.system_intervention_title')}</div>
             <div className="text-stone-400 text-sm">{TranslationService.t('cognitive.system_intervention_desc')}</div>
           </div>
        </div>
      </div>

      <button
        onClick={() => setStage(1)}
        className="px-10 py-4 mt-8 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-xl text-lg hover:from-amber-500 hover:to-red-500 transition-all shadow-lg shadow-amber-900/20"
      >
        {TranslationService.t('cognitive.enter_lab')}
      </button>
    </div>
  );

  // Stage Selection UI for returning users
  const renderStageSelection = () => {
    // All available stages
    const allStages = [
      {
        id: 1,
        name: 'Signal Detection',
        icon: '📊',
        description: 'Train your pattern recognition. Observe data streams and identify meaningful signals from noise.',
        color: 'from-blue-600 to-cyan-600',
        hoverColor: 'from-blue-500 to-cyan-500',
        premium: false
      },
      {
        id: 2,
        name: 'Forensic Reconstruction',
        icon: '🔍',
        description: 'Build hypotheses from fragments. Analyze evidence and construct coherent narratives.',
        color: 'from-purple-600 to-pink-600',
        hoverColor: 'from-purple-500 to-pink-500',
        premium: false
      },
      {
        id: 3,
        name: 'System Intervention',
        icon: '⚙️',
        description: 'Manage complex trade-offs. Balance variables in dynamic interconnected systems.',
        color: 'from-amber-600 to-red-600',
        hoverColor: 'from-amber-500 to-red-500',
        premium: false
      },
      {
        id: 5,
        name: 'Assumption Excavator',
        icon: '🪨',
        description: 'Unearth hidden assumptions beneath claims. Identify what must be true for arguments to hold.',
        color: 'from-emerald-600 to-teal-600',
        hoverColor: 'from-emerald-500 to-teal-500',
        badge: 'Deep Analysis',
        premium: true
      },
      {
        id: 6,
        name: 'Counterfactual Engine',
        icon: '🔀',
        description: 'Explore alternative histories. Understand causality by mapping what could have been different.',
        color: 'from-indigo-600 to-violet-600',
        hoverColor: 'from-indigo-500 to-violet-500',
        badge: 'Causal Thinking',
        premium: true
      },
      {
        id: 7,
        name: 'Perspective Prism',
        icon: '💎',
        description: 'See through multiple lenses. Analyze situations from different stakeholder viewpoints.',
        color: 'from-rose-600 to-orange-600',
        hoverColor: 'from-rose-500 to-orange-500',
        badge: 'Empathy Training',
        premium: true
      }
    ];

    return (
      <div className="text-center space-y-8 animate-fadeIn max-w-6xl mx-auto">
        <div>
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Training Focus</h1>
          <p className="text-stone-400">
            Select a specific cognitive module to train.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allStages.map((stageInfo) => {
            const isLocked = stageInfo.premium && !isPremium;
            
            return (
              <button
                key={stageInfo.id}
                onClick={() => !isLocked && handleStageSelect(stageInfo.id)}
                disabled={isLocked}
                className={`group relative text-left transition-all duration-300 rounded-2xl p-6 border overflow-hidden ${
                   isLocked 
                     ? 'bg-stone-900/50 border-stone-800 opacity-70 cursor-not-allowed' 
                     : `bg-stone-800/60 hover:bg-stone-700/80 border-stone-700 hover:border-stone-500 hover:scale-[1.02] hover:shadow-xl`
                }`}
              >
                 {/* Premium Glow for unlocked premium items */}
                 {!isLocked && stageInfo.premium && (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 )}

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {stageInfo.icon}
                    </div>
                    {stageInfo.premium && (
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${
                        isLocked 
                          ? 'bg-stone-800 border-stone-600 text-stone-500' 
                          : 'bg-amber-900/40 border-amber-700/50 text-amber-400'
                      }`}>
                        {isLocked ? '🔒 Premium' : '⭐ Premium'}
                      </span>
                    )}
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${isLocked ? 'text-stone-500' : 'text-white'}`}>
                    {stageInfo.name}
                  </h3>
                  <p className="text-stone-400 text-sm mb-4 leading-relaxed min-h-[60px]">
                    {stageInfo.description}
                  </p>
                  
                  <div className={`inline-flex items-center text-xs font-bold uppercase tracking-wider ${
                    isLocked 
                      ? 'text-stone-600' 
                      : `text-transparent bg-clip-text bg-gradient-to-r ${stageInfo.color}`
                  }`}>
                    {isLocked ? 'Locked' : 'Initialize Module →'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Full Circuit Option */}
        <div className="pt-8 mt-8 border-t border-stone-800">
          <button
            onClick={handleStartFullCircuit}
            className="px-8 py-3 bg-stone-800 hover:bg-stone-700 text-white font-medium rounded-xl transition-all inline-flex items-center gap-2 border border-stone-700 group"
          >
            <span className="group-hover:rotate-180 transition-transform duration-500">🔄</span>
            Run Full 3-Stage Circuit
          </button>
          <p className="text-stone-500 text-sm mt-3">Complete the classic sequence for comprehensive analysis</p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-stone-950 z-50 overflow-y-auto font-sans">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px] opacity-60 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-red-700/10 rounded-full blur-[120px] opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="min-h-screen py-8 px-4 relative z-10">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧠</span>
            <div className="flex flex-col">
                 <span className="text-lg font-bold text-white leading-none">Cognitive Trainer</span>
                 <span className="text-xs text-stone-500 font-mono tracking-wider">SESSION ID: {Date.now().toString().slice(-6)}</span>
            </div>
            {hasSavedSession && stage > 0 && (
              <span className="ml-2 px-2 py-1 bg-green-900/50 border border-green-700/50 text-green-400 text-xs rounded-lg">
                Resumed
              </span>
            )}
          </div>
          
          {/* Progress Steps - Only show during active training */}
          {stage > 0 && (
            <div className="hidden md:flex items-center gap-2">
              {/* Premium standalone game indicator */}
              {stage >= 5 && stage <= 7 && (
                <>
                  <div className={`h-2 w-16 rounded-full transition-all ${
                    stage >= 5 ? 'bg-amber-500' : 'bg-stone-800'
                  }`} />
                  <div className={`h-2 w-16 rounded-full transition-all ${
                    stage === 4 ? 'bg-purple-500' : 'bg-stone-800'
                  }`} />
                </>
              )}
              {/* Core circuit progress */}
              {(stage < 5 ) && (
                <>
                  {[1, 2, 3].map(step => (
                      <div key={step} className={`h-2 w-12 rounded-full transition-all ${
                          stage === step ? 'bg-amber-500' :
                          stage > step && stage <= 4 ? 'bg-green-600' : 'bg-stone-800'
                      }`} />
                  ))}
                  <div key="analysis" className={`h-2 w-12 rounded-full transition-all ${
                        stage === 4 ? 'bg-purple-500' :
                        stage > 4 ? 'bg-green-600' : 'bg-stone-800'
                    }`} />
                </>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Reset Progress Button - only show if user has made progress */}
            {stage > 0 && (
              <button
                onClick={handleResetProgress}
                className="px-4 py-2 text-red-400 hover:text-red-300 transition-colors border border-transparent hover:border-red-700/50 rounded-lg text-sm"
                title="Reset all training progress and start fresh"
              >
                Reset
              </button>
            )}
            <button
              onClick={handleAbort}
              className="px-4 py-2 text-stone-400 hover:text-white transition-colors border border-transparent hover:border-stone-700 rounded-lg"
            >
              {stage > 0 ? 'Save & Exit' : 'Exit'}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-6xl mx-auto min-h-[600px] flex flex-col justify-center">
          {showIntermission ? renderIntermission() : (
            <>
              {stage === 0 && (
                isReturningUser ? renderStageSelection() : renderIntro()
              )}
              
              {stage === 1 && (
                <div className="animate-slideUp">
                    <div className="mb-4 text-center">
                        <h2 className="text-xl text-amber-500 font-bold uppercase tracking-widest text-sm">Phase 1: Observation</h2>
                    </div>
                    <SignalField 
                        scenario={scenarios.signal || window.CognitiveGameEngine?.generateSignalFieldScenario('medium')} 
                        userId={userId} 
                        onComplete={(data) => handleStageComplete('signal_field', data)} 
                    />
                </div>
              )}
              
              {stage === 2 && (
                <div className="animate-slideUp">
                    <div className="mb-4 text-center">
                        <h2 className="text-xl text-amber-500 font-bold uppercase tracking-widest text-sm">Phase 2: Hypothesis</h2>
                    </div>
                    <ForensicNarrative 
                        scenario={scenarios.forensic || window.CognitiveGameEngine?.generateForensicNarrativeScenario('medium')} 
                        userId={userId} 
                        onComplete={(data) => handleStageComplete('forensic_narrative', data)} 
                    />
                </div>
              )}
              
              {stage === 3 && (
                <div className="animate-slideUp">
                    <div className="mb-4 text-center">
                        <h2 className="text-xl text-amber-500 font-bold uppercase tracking-widest text-sm">Phase 3: Integration</h2>
                    </div>
                    <VariableManifold 
                        scenario={scenarios.variable || window.CognitiveGameEngine?.generateVariableManifoldScenario('medium')} 
                        userId={userId} 
                        onComplete={(data) => handleStageComplete('variable_manifold', data)} 
                    />
                </div>
              )}

              {stage === 4 && (
                <AnalysisPhase
                    sessionPortfolio={sessionPortfolio}
                    userId={userId}
                    onComplete={handleSessionComplete}
                />
              )}

              {/* Premium Training Games */}
              {stage === 5 && (
                <div className="animate-slideUp">
                    <div className="mb-4 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-900/30 border border-amber-700/50 rounded-full mb-2">
                          <span className="text-amber-400 text-xs">⭐ Premium</span>
                        </div>
                        <h2 className="text-xl text-emerald-500 font-bold uppercase tracking-widest text-sm">Assumption Excavator</h2>
                    </div>
                    <AssumptionExcavator
                        scenario={scenarios.assumption || window.CognitiveGameEngine?.generateAssumptionExcavatorScenario?.('medium')}
                        userId={userId}
                        onComplete={(data) => handleStageComplete('assumption_excavator', data)}
                    />
                </div>
              )}

              {stage === 6 && (
                <div className="animate-slideUp">
                    <div className="mb-4 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-900/30 border border-amber-700/50 rounded-full mb-2">
                          <span className="text-amber-400 text-xs">⭐ Premium</span>
                        </div>
                        <h2 className="text-xl text-indigo-500 font-bold uppercase tracking-widest text-sm">Counterfactual Engine</h2>
                    </div>
                    <CounterfactualEngine
                        scenario={scenarios.counterfactual || window.CognitiveGameEngine?.generateCounterfactualEngineScenario?.('medium')}
                        userId={userId}
                        onComplete={(data) => handleStageComplete('counterfactual_engine', data)}
                    />
                </div>
              )}

              {stage === 7 && (
                <div className="animate-slideUp">
                    <div className="mb-4 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-900/30 border border-amber-700/50 rounded-full mb-2">
                          <span className="text-amber-400 text-xs">⭐ Premium</span>
                        </div>
                        <h2 className="text-xl text-rose-500 font-bold uppercase tracking-widest text-sm">Perspective Prism</h2>
                    </div>
                    <PerspectivePrism
                        scenario={scenarios.perspective || window.CognitiveGameEngine?.generatePerspectivePrismScenario?.('medium')}
                        userId={userId}
                        onComplete={(data) => handleStageComplete('perspective_prism', data)}
                    />
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default CognitiveTrainer;
