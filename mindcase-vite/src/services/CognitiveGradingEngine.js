/**
 * COGNITIVE GRADING ENGINE
 * 
 * Analyzes user decision traces to generate "process-over-outcome" metrics
 * and identify behavioral patterns.
 * 
 * CORE PRINCIPLE: Grades represent thinking patterns, not performance scores.
 * 
 * SUPPORTED GAMES:
 * 1. Signal Field (signal_field) - Data analysis and hypothesis formation
 * 2. Forensic Narrative (forensic_narrative) - Evidence handling and narrative building
 * 3. Variable Manifold (variable_manifold) - Systems thinking and trade-off analysis
 * 4. Assumption Excavator (assumption_excavator) - Hidden assumption discovery [PREMIUM]
 * 5. Counterfactual Engine (counterfactual_engine) - Alternative outcome analysis [PREMIUM]
 * 6. Perspective Prism (perspective_prism) - Multi-stakeholder reasoning [PREMIUM]
 */

const CognitiveGradingEngine = (function() {
    'use strict';

    // ============================================================================
    // CONFIGURABLE THRESHOLDS
    // ============================================================================

    const THRESHOLDS = {
        // Time-based
        OBSERVATION_TIME_MINIMUM: 60,      // seconds
        EXPLORATION_TIME_MINIMUM: 60000,   // milliseconds before first intervention
        
        // Hypothesis & Evidence
        HYPOTHESIS_COUNT_MINIMUM: 2,
        HYPOTHESIS_COUNT_GOOD: 3,
        EVIDENCE_EXAMINED_MINIMUM: 10,
        EVIDENCE_EXAMINED_GOOD: 20,
        EVIDENCE_RATED_MINIMUM: 5,
        LINKS_CREATED_MINIMUM: 4,
        
        // Confidence calibration
        CONFIDENCE_HIGH: 80,
        CONFIDENCE_LOW: 20,
        CONFIDENCE_BALANCED_MIN: 30,
        CONFIDENCE_BALANCED_MAX: 70,
        
        // Revision and elasticity
        REVISION_ELASTICITY_HIGH: 60,
        REVISION_ELASTICITY_LOW: 20,
        
        // Behavioral patterns
        CONFIRMATION_BIAS_HIGH: 60,
        ANCHORING_BIAS_HIGH: 70,
        INFORMATION_VELOCITY_GOOD: 5,      // points per minute
        
        // Variable Manifold specific
        TENSIONS_IDENTIFIED_MINIMUM: 2,
        TENSIONS_IDENTIFIED_GOOD: 3,
        INTERVENTIONS_REASONED_MINIMUM: 3,
        TRADEOFF_ANALYSIS_LENGTH: 100,
        
        // Uncertainties
        UNCERTAINTIES_MINIMUM: 2,
        UNCERTAINTY_REASONING_LENGTH: 30,
        
        // Session duration
        LONG_SESSION_DURATION: 120000,     // 2 minutes for anchoring detection
        
        // Diversity
        EVIDENCE_DIVERSITY_TYPES: 5
    };

    // ============================================================================
    // MAIN METRIC CALCULATOR
    // ============================================================================

    const calculateMetrics = (sessionData) => {
        const metrics = {
            // Core metrics (0-100)
            signal_discrimination: 0,      // Focusing on signal vs noise
            evidence_diversity: 0,         // Breadth of data exploration
            confidence_calibration: 0,     // Alignment of confidence with evidence
            revision_elasticity: 0,        // Willingness to change mind
            uncertainty_tolerance: 0,      // Comfort with ambiguity
            
            // Behavioral telemetry
            confirmation_bias: 0,          // Higher = Ignoring contradictory evidence
            anchoring_bias: 0,             // Higher = Stuck on first impression
            information_velocity: 0,       // Points/min: Speed of gathering unique insights
            
            // Stage-specific metrics
            systems_thinking: 0,           // Understanding interconnections
            tradeoff_awareness: 0,         // Recognizing unavoidable trade-offs
            consequence_anticipation: 0,   // Predicting ripple effects
            tension_articulation: 0,       // Naming irreducible conflicts
            
            // Premium game metrics
            assumption_mining: 0,          // Uncovering hidden assumptions
            counterfactual_depth: 0,       // Alternative outcome exploration
            perspective_diversity: 0       // Multi-stakeholder consideration
        };

        const { signal_field, forensic_narrative, variable_manifold,
                assumption_excavator, counterfactual_engine, perspective_prism } = sessionData.stages || {};

        // --- SIGNAL FIELD METRICS ---
        if (signal_field) {
            Object.assign(metrics, calculateSignalFieldMetrics(signal_field));
        }

        // --- FORENSIC NARRATIVE METRICS ---
        if (forensic_narrative) {
            Object.assign(metrics, calculateForensicMetrics(forensic_narrative));
        }

        // --- VARIABLE MANIFOLD METRICS ---
        if (variable_manifold) {
            Object.assign(metrics, calculateVariableManifoldMetrics(variable_manifold));
        }

        // --- PREMIUM GAME METRICS ---
        if (assumption_excavator) {
            Object.assign(metrics, calculateAssumptionExcavatorMetrics(assumption_excavator));
        }
        if (counterfactual_engine) {
            Object.assign(metrics, calculateCounterfactualMetrics(counterfactual_engine));
        }
        if (perspective_prism) {
            Object.assign(metrics, calculatePerspectivePrismMetrics(perspective_prism));
        }

        return metrics;
    };

    // ============================================================================
    // SIGNAL FIELD METRICS
    // ============================================================================

    const calculateSignalFieldMetrics = (data) => {
        const metrics = {};
        const interactions = data.dataInteractions || [];
        const hypotheses = data.hypotheses || [];
        const analysisResults = data.analysisResults || [];
        const timeInPhase = data.timeInPhase || {};

        // 1. Signal Discrimination
        // How well did they focus on relevant data points?
        if (interactions.length > 0) {
            const usefulActions = interactions.filter(i => 
                i.context?.isRelevant || 
                (i.type === 'request_analysis' && i.details?.isUseful)
            ).length;
            metrics.signal_discrimination = Math.min(100, Math.round((usefulActions / interactions.length) * 100));
        }

        // 2. Evidence Diversity
        // Did they use multiple investigation types?
        const uniqueTypes = new Set(interactions.map(i => i.type)).size;
        metrics.evidence_diversity = Math.min(100, (uniqueTypes / THRESHOLDS.EVIDENCE_DIVERSITY_TYPES) * 100);

        // 3. Revision Elasticity
        // Did they update hypotheses as evidence emerged?
        if (hypotheses.length > 0) {
            let editCount = 0;
            for (let i = 1; i < hypotheses.length; i++) {
                if (hypotheses[i].text !== hypotheses[i-1].text) {
                    editCount++;
                }
            }
            // More hypotheses + more edits = higher elasticity
            const hypothesisBonus = Math.min(30, hypotheses.length * 10);
            const editBonus = Math.min(70, editCount * 20);
            metrics.revision_elasticity = hypothesisBonus + editBonus;
        }

        // 4. Confidence Calibration
        // Low evidence + High Confidence = Low Score
        // High evidence + appropriate confidence = High Score
        const confidence = data.uncertainty?.level || 50;
        const evidenceCount = interactions.length;
        const evidenceScore = Math.min(100, evidenceCount * 2);
        
        // Perfect calibration when confidence roughly matches evidence level
        const diff = Math.abs(confidence - evidenceScore);
        metrics.confidence_calibration = Math.max(0, 100 - diff);

        // 5. Uncertainty Tolerance
        // Did they express uncertainty appropriately?
        const hasUncertaintyReasoning = (data.uncertainty?.reasoning?.length || 0) > THRESHOLDS.UNCERTAINTY_REASONING_LENGTH;
        const expressedUncertainty = confidence < THRESHOLDS.CONFIDENCE_HIGH;
        
        if (hasUncertaintyReasoning && expressedUncertainty) {
            metrics.uncertainty_tolerance = 100;
        } else if (hasUncertaintyReasoning || expressedUncertainty) {
            metrics.uncertainty_tolerance = 60;
        } else {
            metrics.uncertainty_tolerance = 20;
        }

        // 6. Time-based quality
        const observationTime = timeInPhase.observation || 0;
        if (observationTime < THRESHOLDS.OBSERVATION_TIME_MINIMUM) {
            // Rushed observation phase - penalize slightly
            metrics.signal_discrimination = Math.max(0, metrics.signal_discrimination - 15);
        }

        return metrics;
    };

    // ============================================================================
    // FORENSIC NARRATIVE METRICS
    // ============================================================================

    const calculateForensicMetrics = (data) => {
        const metrics = {};
        const trace = data.evidenceInteractions || [];
        const beliefRevisions = data.beliefRevisions || [];
        const challengeHistory = data.challengeHistory || [];
        const uncertainties = data.uncertainties || [];
        const linkedEvidence = data.linkedEvidence || [];
        const evidenceRatings = data.evidenceRatings || {};
        const confidence = data.confidenceLevel || 50;

        // 1. Confirmation Bias Detection
        // Did they spend less time on contradictory evidence?
        const contradictoryInteractions = trace.filter(t => 
            t.details?.evidence?.contradicts || 
            (t.details?.rating && t.details.rating < 3 && t.details?.evidence?.importance === 'high')
        );
        const supportingInteractions = trace.filter(t => !t.details?.evidence?.contradicts);

        if (contradictoryInteractions.length > 0 && supportingInteractions.length > 0) {
            const ratio = supportingInteractions.length / (contradictoryInteractions.length || 1);
            metrics.confirmation_bias = Math.min(100, Math.max(0, (ratio - 1) * 20));
        }

        // 2. Anchoring Bias Detection
        // Did their narrative evolve or stay the same?
        if (beliefRevisions.length === 0 && (data.duration || 0) > THRESHOLDS.LONG_SESSION_DURATION) {
            // Long session, no revisions = High Anchoring
            metrics.anchoring_bias = 80;
        } else {
            // More revisions = Lower Anchoring
            metrics.anchoring_bias = Math.max(0, 80 - (beliefRevisions.length * 30));
        }

        // 3. Information Velocity
        // New unique evidence evaluated per minute
        const uniqueEvidenceIds = new Set(
            trace.filter(t => t.type === 'rate_evidence').map(t => t.details?.evidenceId)
        ).size;
        const durationMinutes = (data.duration || 60000) / 60000;
        metrics.information_velocity = Math.round(uniqueEvidenceIds / (durationMinutes || 1));

        // 4. Revision Elasticity (from challenges)
        const revisionsShown = beliefRevisions.length;
        if (revisionsShown > 0) {
            metrics.revision_elasticity = Math.min(100, revisionsShown * 35);
        }

        // 5. Uncertainty Tolerance
        if (uncertainties.length >= THRESHOLDS.UNCERTAINTIES_MINIMUM) {
            metrics.uncertainty_tolerance = Math.min(100, 50 + (uncertainties.length * 15));
        } else {
            metrics.uncertainty_tolerance = uncertainties.length * 25;
        }

        // 6. Evidence Diversity (links created)
        metrics.evidence_diversity = Math.min(100, (linkedEvidence.length / THRESHOLDS.LINKS_CREATED_MINIMUM) * 100);

        // 7. Confidence Calibration
        // In ambiguous cases (forensic), moderate confidence is ideal
        if (confidence >= THRESHOLDS.CONFIDENCE_BALANCED_MIN && 
            confidence <= THRESHOLDS.CONFIDENCE_BALANCED_MAX) {
            metrics.confidence_calibration = 100;
        } else if (confidence > THRESHOLDS.CONFIDENCE_HIGH) {
            // Overconfident in ambiguous case
            metrics.confidence_calibration = Math.max(0, 100 - ((confidence - THRESHOLDS.CONFIDENCE_HIGH) * 3));
        } else {
            metrics.confidence_calibration = Math.max(40, confidence);
        }

        return metrics;
    };

    // ============================================================================
    // VARIABLE MANIFOLD METRICS
    // ============================================================================

    const calculateVariableManifoldMetrics = (data) => {
        const metrics = {};
        const history = data.interventionHistory || [];
        const tensions = data.identifiedTensions || [];
        const tradeoffAnalysis = data.tradeoffAnalysis || '';
        const finalReflection = data.finalReflection || '';
        const explorationPath = data.explorationPath || [];

        // 1. Systems Thinking
        // Did they explore before intervening?
        const firstInterventionTime = history[0]?.timestamp || 0;
        if (firstInterventionTime > THRESHOLDS.EXPLORATION_TIME_MINIMUM) {
            metrics.systems_thinking = 85;
        } else if (firstInterventionTime > 30000) {
            metrics.systems_thinking = 60;
        } else if (history.length > 0) {
            metrics.systems_thinking = 30;
        } else {
            metrics.systems_thinking = 50; // No interventions - neutral
        }

        // 2. Tradeoff Awareness
        // Did they identify tensions?
        if (tensions.length >= THRESHOLDS.TENSIONS_IDENTIFIED_GOOD) {
            metrics.tradeoff_awareness = 100;
        } else if (tensions.length >= THRESHOLDS.TENSIONS_IDENTIFIED_MINIMUM) {
            metrics.tradeoff_awareness = 70;
        } else {
            metrics.tradeoff_awareness = tensions.length * 30;
        }

        // 3. Consequence Anticipation
        // Did they predict consequences?
        const predictedInterventions = history.filter(h => 
            h.predictions && Object.keys(h.predictions).length > 0
        ).length;
        metrics.consequence_anticipation = Math.min(100, predictedInterventions * 25);

        // 4. Tension Articulation
        // Quality of trade-off analysis
        const analysisLength = tradeoffAnalysis.length;
        const hasTradeoffKeywords = /trade.?off|sacrifice|cannot|impossible|give up|lose/i.test(tradeoffAnalysis);
        
        if (analysisLength >= THRESHOLDS.TRADEOFF_ANALYSIS_LENGTH && hasTradeoffKeywords) {
            metrics.tension_articulation = 100;
        } else if (analysisLength >= THRESHOLDS.TRADEOFF_ANALYSIS_LENGTH) {
            metrics.tension_articulation = 70;
        } else if (hasTradeoffKeywords) {
            metrics.tension_articulation = 50;
        } else {
            metrics.tension_articulation = Math.min(40, analysisLength / 3);
        }

        // 5. Revision Elasticity
        // Did they provide reasoning for interventions?
        const reasonedInterventions = history.filter(h => h.reason && h.reason.length > 20).length;
        if (reasonedInterventions >= THRESHOLDS.INTERVENTIONS_REASONED_MINIMUM) {
            metrics.revision_elasticity = Math.min(100, reasonedInterventions * 20);
        } else {
            metrics.revision_elasticity = reasonedInterventions * 30;
        }

        // 6. Uncertainty Tolerance
        // Do they acknowledge no win state exists?
        const acknowledgesNoWin = /no win|cannot.*all|impossible.*perfect|always.*trade|never.*satisfy/i.test(
            tradeoffAnalysis + ' ' + finalReflection
        );
        if (acknowledgesNoWin && tensions.length >= THRESHOLDS.TENSIONS_IDENTIFIED_MINIMUM) {
            metrics.uncertainty_tolerance = 100;
        } else if (acknowledgesNoWin || tensions.length >= THRESHOLDS.TENSIONS_IDENTIFIED_MINIMUM) {
            metrics.uncertainty_tolerance = 70;
        } else {
            metrics.uncertainty_tolerance = 40;
        }

        return metrics;
    };

    // ============================================================================
    // PREMIUM GAME METRICS
    // ============================================================================

    const calculateAssumptionExcavatorMetrics = (data) => {
        const metrics = {};
        const assumptions = data.identifiedAssumptions || [];
        const hiddenAssumptions = data.discoveredHiddenAssumptions || [];
        const challengeResponses = data.assumptionChallenges || [];

        // Assumption Mining
        const totalAssumptions = assumptions.length + hiddenAssumptions.length;
        metrics.assumption_mining = Math.min(100, totalAssumptions * 15);

        // Signal Discrimination (finding hidden vs obvious)
        if (totalAssumptions > 0) {
            metrics.signal_discrimination = Math.min(100, (hiddenAssumptions.length / totalAssumptions) * 150);
        }

        // Revision Elasticity (accepting challenges)
        const acceptedChallenges = challengeResponses.filter(r => r.accepted).length;
        metrics.revision_elasticity = Math.min(100, acceptedChallenges * 25);

        return metrics;
    };

    const calculateCounterfactualMetrics = (data) => {
        const metrics = {};
        const alternativeOutcomes = data.alternativeOutcomes || [];
        const pathsExplored = data.causalPaths || [];
        const pivotPoints = data.identifiedPivotPoints || [];

        // Counterfactual Depth
        const depth = alternativeOutcomes.length + pathsExplored.length;
        metrics.counterfactual_depth = Math.min(100, depth * 12);

        // Systems Thinking (multiple causal paths)
        metrics.systems_thinking = Math.min(100, pathsExplored.length * 20);

        // Signal Discrimination (finding pivot points)
        metrics.signal_discrimination = Math.min(100, pivotPoints.length * 25);

        return metrics;
    };

    const calculatePerspectivePrismMetrics = (data) => {
        const metrics = {};
        const perspectives = data.perspectivesExplored || [];
        const tensions = data.identifiedTensions || [];
        const synthesis = data.synthesis || '';

        // Perspective Diversity
        metrics.perspective_diversity = Math.min(100, perspectives.length * 20);

        // Tension Articulation
        metrics.tension_articulation = Math.min(100, tensions.length * 25);

        // Evidence Diversity (different viewpoints)
        metrics.evidence_diversity = Math.min(100, perspectives.length * 18);

        // Synthesis quality
        const hasSynthesis = synthesis.length > 100;
        const mentionsMultipleViews = (synthesis.match(/perspective|view|stakeholder|side/gi) || []).length >= 2;
        if (hasSynthesis && mentionsMultipleViews) {
            metrics.confidence_calibration = 85;
        }

        return metrics;
    };

    // ============================================================================
    // PATTERN INFERENCE
    // ============================================================================

    const PATTERN_DEFINITIONS = [
        {
            id: 'premature_closure',
            name: 'Premature Closure',
            description: 'You tended to commit to a narrative early, potentially filtering out contradictory data.',
            condition: (m, data) => {
                const signal = data.stages?.signal_field;
                if (!signal) return false;
                // High confidence, low observation time
                return (signal.uncertainty?.level > THRESHOLDS.CONFIDENCE_HIGH) && 
                       ((signal.timeInPhase?.observation || 0) < THRESHOLDS.OBSERVATION_TIME_MINIMUM);
            }
        },
        {
            id: 'adaptive_reframing',
            name: 'Adaptive Reframing',
            description: 'You demonstrated a willingness to abandon initial assumptions when new evidence emerged.',
            condition: (m, data) => m.revision_elasticity > THRESHOLDS.REVISION_ELASTICITY_HIGH
        },
        {
            id: 'linear_thinking',
            name: 'Linear Thinking',
            description: 'You focused primarily on direct cause-effect relationships, potentially missing systemic feedback loops.',
            condition: (m, data) => {
                const manifold = data.stages?.variable_manifold;
                if (!manifold) return false;
                
                // Detect linear thinking:
                // 1. Few predictions made (not anticipating ripple effects)
                // 2. Low tension identification
                // 3. Rush to intervene
                const history = manifold.interventionHistory || [];
                const tensions = manifold.identifiedTensions || [];
                const predictionsAttempted = history.filter(h => 
                    h.predictions && Object.keys(h.predictions).length > 0
                ).length;
                
                return (
                    predictionsAttempted <= 1 &&
                    tensions.length < THRESHOLDS.TENSIONS_IDENTIFIED_MINIMUM &&
                    m.systems_thinking < 50
                );
            }
        },
        {
            id: 'systems_thinker',
            name: 'Systems Thinker',
            description: 'You understood how variables interconnect and considered ripple effects before acting.',
            condition: (m, data) => {
                return m.systems_thinking >= 70 && m.consequence_anticipation >= 50;
            }
        },
        {
            id: 'anchoring_persistence',
            name: 'Anchoring Persistence',
            description: 'Your final conclusion remained very close to your initial hypothesis despite contradictory evidence.',
            condition: (m, data) => {
                const signal = data.stages?.signal_field;
                if (!signal || !signal.hypotheses || signal.hypotheses.length < 2) return false;
                return m.revision_elasticity < THRESHOLDS.REVISION_ELASTICITY_LOW;
            }
        },
        {
            id: 'prudent_hesitation',
            name: 'Prudent Hesitation',
            description: 'You maintained healthy uncertainty even after gathering significant evidence.',
            condition: (m, data) => {
                const signal = data.stages?.signal_field;
                return (signal?.uncertainty?.level || 100) < THRESHOLDS.REVISION_ELASTICITY_HIGH && 
                       m.evidence_diversity > 70;
            }
        },
        {
            id: 'confirmation_bias_detected',
            name: 'Confirmation Bias',
            description: 'You spent significantly more time on evidence that supported your view than on contradictions.',
            condition: (m) => m.confirmation_bias > THRESHOLDS.CONFIRMATION_BIAS_HIGH
        },
        {
            id: 'anchoring_trap',
            name: 'Anchoring Trap',
            description: 'You stuck to your initial interpretation despite challenges. Try to "reset" your view halfway through.',
            condition: (m) => m.anchoring_bias > THRESHOLDS.ANCHORING_BIAS_HIGH
        },
        {
            id: 'rapid_synthesis',
            name: 'Rapid Synthesis',
            description: 'You integrate new information very quickly (High Information Velocity).',
            condition: (m) => m.information_velocity > THRESHOLDS.INFORMATION_VELOCITY_GOOD
        },
        {
            id: 'tradeoff_master',
            name: 'Trade-off Master',
            description: 'You clearly articulated the unavoidable tensions and defended your choices thoughtfully.',
            condition: (m) => m.tradeoff_awareness >= 80 && m.tension_articulation >= 70
        },
        {
            id: 'assumption_detective',
            name: 'Assumption Detective',
            description: 'You successfully uncovered hidden assumptions that others might miss.',
            condition: (m) => m.assumption_mining >= 70
        },
        {
            id: 'multi_perspective',
            name: 'Multi-Perspective Thinker',
            description: 'You genuinely engaged with multiple stakeholder viewpoints before forming conclusions.',
            condition: (m) => m.perspective_diversity >= 80
        }
    ];

    const inferPatterns = (metrics, sessionData) => {
        const detectedPatterns = [];
        
        PATTERN_DEFINITIONS.forEach(pattern => {
            try {
                if (pattern.condition(metrics, sessionData)) {
                    detectedPatterns.push({
                        id: pattern.id,
                        name: pattern.name,
                        description: pattern.description,
                        confidence: 'High'
                    });
                }
            } catch (e) {
                // Skip pattern if condition throws
                console.warn(`Pattern ${pattern.id} evaluation failed:`, e);
            }
        });

        // Default if none found
        if (detectedPatterns.length === 0) {
            detectedPatterns.push({
                id: 'balanced_inquiry',
                name: 'Balanced Inquiry',
                description: 'You maintained a steady approach to evidence gathering and hypothesis formation.',
                confidence: 'Medium'
            });
        }

        return detectedPatterns;
    };

    // ============================================================================
    // REFLECTION GENERATOR
    // ============================================================================

    const generateReflectionPrompt = (metrics, patterns) => {
        // Prioritize by detected patterns
        if (patterns.some(p => p.id === 'premature_closure')) {
            return "What made you feel confident enough to stop searching for evidence early?";
        }
        if (patterns.some(p => p.id === 'adaptive_reframing')) {
            return "What specific piece of evidence convinced you to change your mind?";
        }
        if (patterns.some(p => p.id === 'linear_thinking')) {
            return "Which variables did you assume were independent that might actually be connected?";
        }
        if (patterns.some(p => p.id === 'systems_thinker')) {
            return "What unexpected ripple effects did you discover during exploration?";
        }
        if (patterns.some(p => p.id === 'confirmation_bias_detected')) {
            return "Which evidence did you dismiss too quickly? What if it was more reliable than you thought?";
        }
        if (metrics.confidence_calibration < 50) {
            return "Your confidence didn't quite match the amount of evidence you had. What influenced your certainty level?";
        }
        if (metrics.tradeoff_awareness >= 80) {
            return "You identified key tensions. Which trade-off was most difficult to accept?";
        }
        return "Which evidence felt convincing at first but turned out to be less important?";
    };

    // ============================================================================
    // META-ANALYSIS (LONG TERM VALUE)
    // ============================================================================

    const generateMetaInsights = (currentMetrics, history = []) => {
        const insights = [];
        if (!history || history.length === 0) return insights;

        // Ensure history items have metrics
        const validHistory = history.filter(h => h.metrics);
        if (validHistory.length === 0) return insights;

        const lastSession = validHistory[validHistory.length - 1];
        const lastMetrics = lastSession.metrics || {};

        // 1. Trend Detection (Improvement/Stagnation)
        const metricKeys = [
            'signal_discrimination', 'evidence_diversity', 'confidence_calibration',
            'revision_elasticity', 'systems_thinking', 'tradeoff_awareness'
        ];
        
        metricKeys.forEach(key => {
            const current = currentMetrics[key] || 0;
            const previous = lastMetrics[key] || 0;
            const diff = current - previous;
            
            if (diff > 15) {
                insights.push({
                    type: 'improvement',
                    text: `You've significantly improved your ${key.replace(/_/g, ' ')} since last session (+${Math.round(diff)} pts).`
                });
            } else if (diff < -15) {
                insights.push({
                    type: 'regression',
                    text: `Your ${key.replace(/_/g, ' ')} dropped compared to your usual baseline.`
                });
            }
        });

        // 2. Persistent Habit Detection (Last 5 sessions)
        const recentHistory = validHistory.slice(-5);
        if (recentHistory.length >= 3) {
            const patterns = recentHistory.flatMap(h => h.patterns || []);
            
            // Check for persistent patterns
            const patternCounts = {};
            patterns.forEach(p => {
                patternCounts[p.id] = (patternCounts[p.id] || 0) + 1;
            });
            
            Object.entries(patternCounts).forEach(([patternId, count]) => {
                if (count >= 3) {
                    const patternDef = PATTERN_DEFINITIONS.find(p => p.id === patternId);
                    if (patternDef) {
                        insights.push({
                            type: 'habit',
                            text: `Persistent Pattern: "${patternDef.name}" appeared in ${count} of your last ${recentHistory.length} sessions.`
                        });
                    }
                }
            });
        }

        // 3. Long-term Comparison (vs 10 sessions ago)
        if (validHistory.length >= 10) {
            const oldSession = validHistory[validHistory.length - 10];
            const oldMetrics = oldSession.metrics || {};
            
            if (currentMetrics.systems_thinking > (oldMetrics.systems_thinking || 0) + 20) {
                insights.push({
                    type: 'milestone',
                    text: "Meta-Pattern: Your systems thinking has grown significantly over the past 10 sessions."
                });
            }
            
            if (currentMetrics.revision_elasticity > (oldMetrics.revision_elasticity || 0) + 20) {
                insights.push({
                    type: 'milestone',
                    text: "Meta-Pattern: You revise your beliefs much more frequently now than 10 sessions ago."
                });
            }
        }

        return insights;
    };

    // ============================================================================
    // PUBLIC API
    // ============================================================================

    return {
        /**
         * Analyze a completed cognitive training session
         * @param {Object} sessionData - Session data from CognitiveTrainer
         * @param {Array} history - Previous session results for meta-analysis
         * @returns {Object} Complete analysis with metrics, patterns, insights
         */
        analyzeSession: (sessionData, history = []) => {
            const metrics = calculateMetrics(sessionData);
            const patterns = inferPatterns(metrics, sessionData);
            const reflection = generateReflectionPrompt(metrics, patterns);
            const insights = generateMetaInsights(metrics, history);

            return {
                timestamp: Date.now(),
                metrics,                    // The "Cognitive Profile" for this session
                patterns,                   // Human-readable behavioral tags
                reflectionPrompt: reflection,
                insights,                   // Long-term pattern detection
                traceSummary: {
                    totalDuration: 
                        (sessionData.stages?.signal_field?.duration || 0) + 
                        (sessionData.stages?.forensic_narrative?.duration || 0) +
                        (sessionData.stages?.variable_manifold?.duration || 0),
                    stagesCompleted: Object.keys(sessionData.stages || {}).length
                }
            };
        },

        /**
         * Get the configurable thresholds (for testing/debugging)
         */
        getThresholds: () => ({ ...THRESHOLDS }),

        /**
         * Get pattern definitions (for UI display)
         */
        getPatternDefinitions: () => PATTERN_DEFINITIONS.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description
        }))
    };

})();

// Export for usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CognitiveGradingEngine };
}
if (typeof window !== 'undefined') {
    window.CognitiveGradingEngine = CognitiveGradingEngine;
}
