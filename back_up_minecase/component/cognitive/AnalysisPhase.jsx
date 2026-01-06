import React, { useState, useEffect } from 'react';

/**
 * ANALYSIS PHASE
 * 
 * The final stage of the cognitive training loop.
 * Aggregates data from all 3 mini-games to show the user their thinking patterns.
 * Focuses on metacognition: thinking about thinking.
 * 
 * NOW POWERED BY: CognitiveGradingEngine
 */
const AnalysisPhase = ({ sessionPortfolio, userId, onComplete }) => {
  const [currentSection, setCurrentSection] = useState('init'); // init, profile, timeline, reflection
  const [analysis, setAnalysis] = useState(null);
  const [startAnimation, setStartAnimation] = useState(false);
  const [finalReflection, setFinalReflection] = useState('');

  // Run analysis on mount
  useEffect(() => {
    const engine = window.CognitiveGradingEngine;
    if (engine && sessionPortfolio) {
        // Fetch history first
        let sessionHistory = [];
        if (window.UserProgressService && userId) {
            const history = window.UserProgressService.getAdvancedAnalytics(userId);
            sessionHistory = history?.cognitiveTraining?.sessionHistory || [];
        }

        // Prepare data structure for the engine
        const sessionData = {
            stages: sessionPortfolio,
            timestamp: Date.now()
        };
        const result = engine.analyzeSession(sessionData, sessionHistory);
        setAnalysis(result);
        
        // Start animation sequence
        setTimeout(() => setCurrentSection('profile'), 1000);
        setTimeout(() => setStartAnimation(true), 1500);
    }
  }, [sessionPortfolio, userId]);

  if (!analysis) {
      return (
          <div className="text-center p-10 animate-pulse">
              <div className="text-6xl mb-4">🧠</div>
              <h2 className="text-xl text-stone-400">Synthesizing Cognitive Profile...</h2>
          </div>
      );
  }

  const { metrics, patterns, reflectionPrompt, insights } = analysis;

  const renderMetricBar = (label, value, description) => (
      <div className="mb-4">
          <div className="flex justify-between items-end mb-1">
              <span className="text-stone-300 font-bold text-sm">{label}</span>
              <span className="text-amber-400 font-mono text-xs">{Math.round(value)}/100</span>
          </div>
          <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000 ease-out"
                style={{ width: startAnimation ? `${value}%` : '0%' }}
              />
          </div>
          <p className="text-xs text-stone-500 mt-1">{description}</p>
      </div>
  );

  const renderInsights = () => (
      <div className="mt-8 space-y-3">
          <h4 className="text-purple-400 font-bold uppercase tracking-widest text-xs mb-2">Meta-Analysis Insights</h4>
          {insights && insights.length > 0 ? (
              insights.map((insight, idx) => (
                  <div key={idx} className={`p-3 rounded-lg text-sm border ${
                      insight.type === 'improvement' ? 'bg-green-900/20 border-green-700/30 text-green-300' :
                      insight.type === 'habit' ? 'bg-amber-900/20 border-amber-700/30 text-amber-300' :
                      insight.type === 'regression' ? 'bg-red-900/20 border-red-700/30 text-red-300' :
                      'bg-purple-900/20 border-purple-700/30 text-purple-300'
                  }`}>
                      {insight.text}
                  </div>
              ))
          ) : (
              <div className="text-stone-500 text-sm italic">
                  Complete more sessions to unlock long-term trend analysis.
              </div>
          )}
      </div>
  );

  const renderProfile = () => (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Cognitive Profile</h3>
        <p className="text-stone-400 text-sm">Based on your decision traces, not your answers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-stone-800/30 p-6 rounded-xl border border-stone-700">
              <h4 className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-6">Process Metrics</h4>
              {renderMetricBar("Signal Discrimination", metrics.signal_discrimination, "Focusing on relevant data vs noise")}
              {renderMetricBar("Evidence Diversity", metrics.evidence_diversity, "Exploring multiple types of information")}
              {renderMetricBar("Revision Elasticity", metrics.revision_elasticity, "Willingness to update beliefs")}
              {renderInsights()}
          </div>

          <div className="bg-stone-800/30 p-6 rounded-xl border border-stone-700">
              <h4 className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-6">Metacognition</h4>
              {renderMetricBar("Confidence Calibration", metrics.confidence_calibration, "Alignment of certainty with evidence")}
              {renderMetricBar("Uncertainty Tolerance", metrics.uncertainty_tolerance || 50, "Operating effectively without full data")}
              
              <div className="mt-8 p-4 bg-stone-900/50 rounded-lg">
                  <div className="text-xs text-stone-500 uppercase mb-2">Dominant Pattern Detected</div>
                  <div className="text-lg font-bold text-white">
                      {patterns[0]?.name || "Balanced Inquiry"}
                  </div>
                  <div className="text-sm text-stone-300 mt-1">
                      {patterns[0]?.description}
                  </div>
              </div>
          </div>
      </div>

      <button
        onClick={() => setCurrentSection('timeline')}
        className="w-full py-4 bg-stone-700 text-white font-bold rounded-xl hover:bg-stone-600 transition-all"
      >
        View Timeline Analysis
      </button>
    </div>
  );

  const renderTimeline = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-bold text-amber-400 mb-4 text-center">Session Timeline</h3>
      
      <div className="relative border-l-2 border-stone-700 ml-4 space-y-8 py-2">
        {/* Step 1: Signal Field */}
        <div className="relative pl-8">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-stone-600 border-2 border-stone-900"></div>
          <div className="bg-stone-800/50 p-4 rounded-lg border border-stone-700">
            <h4 className="font-bold text-white">1. Signal Field</h4>
            <div className="text-sm text-stone-400 mt-1">
                Hypotheses: {sessionPortfolio?.signal_field?.hypotheses?.length || 0} | 
                Revisions: {sessionPortfolio?.signal_field?.hypotheses?.length > 1 ? 'Yes' : 'No'}
            </div>
          </div>
        </div>

        {/* Step 2: Forensic Narrative */}
        <div className="relative pl-8">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-stone-600 border-2 border-stone-900"></div>
          <div className="bg-stone-800/50 p-4 rounded-lg border border-stone-700">
             <h4 className="font-bold text-white">2. Forensic Narrative</h4>
             <div className="text-sm text-stone-400 mt-1">
                Evidence Cited: {sessionPortfolio?.forensic_narrative?.evaluation?.evidenceToClaimRatio > 50 ? 'High' : 'Low'}
            </div>
          </div>
        </div>

        {/* Step 3: Variable Manifold */}
        <div className="relative pl-8">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-stone-600 border-2 border-stone-900"></div>
          <div className="bg-stone-800/50 p-4 rounded-lg border border-stone-700">
             <h4 className="font-bold text-white">3. Variable Manifold</h4>
             <div className="text-sm text-stone-400 mt-1">
                System Awareness: {sessionPortfolio?.variable_manifold?.evaluation?.processQuality > 60 ? 'Active' : 'Developing'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
            onClick={() => setCurrentSection('profile')}
            className="flex-1 py-3 bg-stone-700 text-white font-bold rounded-xl hover:bg-stone-600 transition-all"
        >
            Back to Profile
        </button>
        <button
            onClick={() => setCurrentSection('reflection')}
            className="flex-1 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-500 transition-all"
        >
            Final Reflection
        </button>
      </div>
    </div>
  );

  const renderReflection = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-bold text-amber-400 mb-2 text-center">Guided Reflection</h3>
      <p className="text-center text-stone-400 text-sm mb-6 max-w-lg mx-auto">
          Deep learning happens when you articulate your own mental process.
      </p>
      
      <div className="bg-gradient-to-b from-stone-800 to-stone-900 p-6 rounded-xl border border-amber-900/30 shadow-lg">
        <label className="block text-amber-200 font-serif text-lg mb-4 leading-relaxed">
            "{reflectionPrompt}"
        </label>
        <textarea
            value={finalReflection}
            onChange={(e) => setFinalReflection(e.target.value)}
            placeholder="I think..."
            className="w-full h-32 bg-black/20 border border-stone-700 rounded-lg p-3 text-white placeholder-stone-600 resize-none text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all outline-none"
        />
      </div>

      <button
        onClick={() => onComplete({
            ...analysis,
            finalReflection,
            // Pass simple aggregate score for backward compatibility if needed, 
            // but the real value is in 'metrics'
            aggregateScore: Math.round(
                (metrics.signal_discrimination + metrics.evidence_diversity + metrics.confidence_calibration) / 3
            )
        })}
        disabled={finalReflection.length < 20}
        className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        Complete Session & Save Profile
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8">
        {currentSection === 'profile' && renderProfile()}
        {currentSection === 'timeline' && renderTimeline()}
        {currentSection === 'reflection' && renderReflection()}
    </div>
  );
};

export default AnalysisPhase;
