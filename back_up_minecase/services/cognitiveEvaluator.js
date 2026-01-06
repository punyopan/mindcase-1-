/**
 * COGNITIVE EVALUATOR
 *
 * Evaluates reasoning PROCESS, not outcome correctness.
 * Based on the Cognitive Restoration Framework:
 *
 * 1. Evidence-First: Did they reference specific data before concluding?
 * 2. Uncertainty Expression: Did they articulate what they don't know?
 * 3. Alternative Consideration: Did they consider other explanations?
 * 4. Assumption Identification: Did they name their assumptions?
 * 5. Revision Willingness: Did they show openness to being wrong?
 *
 * NEVER says "correct" or "incorrect" - only evaluates reasoning quality
 */

const CognitiveEvaluator = (function() {
  'use strict';

  // ============================================================================
  // REASONING DIMENSION DEFINITIONS
  // ============================================================================

  const REASONING_DIMENSIONS = {
    evidence_anchoring: {
      name: 'Evidence Anchoring',
      description: 'References specific data/facts before drawing conclusions',
      weight: 0.25,
      positiveIndicators: [
        /\b(based on|according to|the data shows|evidence suggests|we see that)\b/i,
        /\b(specifically|in particular|for example|such as|notably)\b/i,
        /\b(\d+%|\d+ (students?|patients?|cases?|people))\b/i, // Specific numbers
        /\b(observed|noticed|found that|shows that)\b/i
      ],
      negativeIndicators: [
        /\b(obviously|clearly|it's apparent|everyone knows)\b/i,
        /\b(always|never|definitely|certainly|must be)\b/i
      ]
    },

    uncertainty_expression: {
      name: 'Uncertainty Expression',
      description: 'Acknowledges limitations and unknowns',
      weight: 0.2,
      positiveIndicators: [
        /\b(uncertain|unclear|don't know|not sure|might|could|may|possibly)\b/i,
        /\b(need more|insufficient|incomplete|missing)\b/i,
        /\b(approximately|roughly|about|around)\b/i,
        /\b(if|assuming|depends on)\b/i,
        /\?/g // Questions show inquiry
      ],
      negativeIndicators: [
        /\b(certainly|definitely|absolutely|without doubt|clearly|obviously)\b/i,
        /\b(the answer is|this proves|this means)\b/i
      ]
    },

    alternative_consideration: {
      name: 'Alternative Consideration',
      description: 'Considers multiple possible explanations',
      weight: 0.2,
      positiveIndicators: [
        /\b(alternatively|or|another|other|instead|rather)\b/i,
        /\b(could also|might also|may also|on the other hand)\b/i,
        /\b(different|varying|multiple|several|various)\b/i,
        /\b(possibility|possibilities|explanation|explanations)\b/i
      ],
      negativeIndicators: [
        /\b(the only|must be|has to be|can only be)\b/i
      ]
    },

    assumption_identification: {
      name: 'Assumption Identification',
      description: 'Names and examines underlying assumptions',
      weight: 0.15,
      positiveIndicators: [
        /\b(assumes?|assuming|assumption|presuming|presume)\b/i,
        /\b(take for granted|given that|if we accept)\b/i,
        /\b(underlying|implicit|hidden|unstated)\b/i,
        /\b(depends on|relies on|requires that)\b/i
      ],
      negativeIndicators: []
    },

    causal_rigor: {
      name: 'Causal Rigor',
      description: 'Distinguishes correlation from causation',
      weight: 0.1,
      positiveIndicators: [
        /\b(correlation|correlate|associated|related)\b/i,
        /\b(cause|causes|causation|causal)\b/i,
        /\b(doesn't mean|not necessarily|confound|variable)\b/i,
        /\b(just because|coincidence|spurious)\b/i
      ],
      negativeIndicators: [
        /\b(proves that|shows that.*caused|led to)\b/i
      ]
    },

    revision_openness: {
      name: 'Revision Openness',
      description: 'Shows willingness to update beliefs with new evidence',
      weight: 0.1,
      positiveIndicators: [
        /\b(might be wrong|could be mistaken|open to)\b/i,
        /\b(revise|update|reconsider|change my mind)\b/i,
        /\b(if.*then|would change|what would)\b/i,
        /\b(however|but|although|yet|still)\b/i
      ],
      negativeIndicators: [
        /\b(I'm certain|I know|there's no doubt)\b/i
      ]
    }
  };

  // ============================================================================
  // COGNITIVE PATTERNS TO DETECT
  // ============================================================================

  const COGNITIVE_PATTERNS = {
    premature_commitment: {
      name: 'Premature Commitment',
      description: 'Reaching conclusions before examining sufficient evidence',
      detection: (response, wordCount) => {
        const strongClaims = (response.match(/\b(clearly|obviously|definitely|the answer is|must be)\b/gi) || []).length;
        const evidenceReferences = (response.match(/\b(data|evidence|shows|indicates|observed)\b/gi) || []).length;

        // Strong claims early without evidence references
        return strongClaims > 1 && evidenceReferences < 2;
      },
      feedback: "You've reached strong conclusions without first establishing a solid evidence base. What specific observations support this view?"
    },

    confirmation_seeking: {
      name: 'Confirmation Bias Risk',
      description: 'Only seeking evidence that supports existing beliefs',
      detection: (response) => {
        const alternatives = (response.match(/\b(alternatively|or|another|however|but)\b/gi) || []).length;
        const assertions = (response.match(/\b(is|are|was|were|will be|must be)\b/gi) || []).length;

        // Many assertions, few alternatives considered
        return assertions > 8 && alternatives < 2;
      },
      feedback: "Consider what evidence might contradict your interpretation. What would you expect to see if your explanation is wrong?"
    },

    overconfidence: {
      name: 'Overconfidence',
      description: 'Expressing more certainty than warranted by evidence',
      detection: (response) => {
        const certaintyMarkers = (response.match(/\b(certain|definitely|clearly|obviously|without doubt|must)\b/gi) || []).length;
        const uncertaintyMarkers = (response.match(/\b(might|could|possibly|uncertain|unclear|may)\b/gi) || []).length;

        return certaintyMarkers > 3 && uncertaintyMarkers < 1;
      },
      feedback: "Your response expresses high certainty. What aspects of this situation remain uncertain? What would change your confidence?"
    },

    surface_analysis: {
      name: 'Surface-Level Analysis',
      description: 'Staying at surface level without examining deeper factors',
      detection: (response, wordCount) => {
        const depthIndicators = (response.match(/\b(because|therefore|underlying|root cause|fundamental|deeper)\b/gi) || []).length;

        return wordCount > 40 && depthIndicators < 2;
      },
      feedback: "Your analysis stays at the surface. What underlying factors or mechanisms might explain what you're observing?"
    }
  };

  // ============================================================================
  // MAIN EVALUATION FUNCTION
  // ============================================================================

  function evaluateReasoning(response, context = {}) {
    if (!response || response.trim().length === 0) {
      return createEmptyEvaluation();
    }

    const text = response;
    const wordCount = response.split(/\s+/).filter(w => w.length > 0).length;
    const sentenceCount = response.split(/[.!?]+/).filter(s => s.trim().length > 5).length;

    const evaluation = {
      dimensions: {},
      patterns: [],
      processScore: 0,
      feedback: [],
      cognitiveStrengths: [],
      cognitiveGrowthAreas: [],
      reasoningLevel: '',
      timestamp: new Date().toISOString()
    };

    // Evaluate each dimension
    let totalScore = 0;

    Object.entries(REASONING_DIMENSIONS).forEach(([key, dimension]) => {
      const dimScore = evaluateDimension(text, dimension);
      evaluation.dimensions[key] = {
        name: dimension.name,
        score: dimScore,
        weight: dimension.weight,
        weighted: Math.round(dimScore * dimension.weight * 100) / 100
      };
      totalScore += dimScore * dimension.weight;

      // Track strengths and growth areas
      if (dimScore >= 70) {
        evaluation.cognitiveStrengths.push(dimension.name);
      } else if (dimScore < 40) {
        evaluation.cognitiveGrowthAreas.push(dimension.name);
      }
    });

    // Detect problematic patterns
    Object.entries(COGNITIVE_PATTERNS).forEach(([key, pattern]) => {
      if (pattern.detection(text, wordCount)) {
        evaluation.patterns.push({
          name: pattern.name,
          description: pattern.description,
          feedback: pattern.feedback
        });
        evaluation.feedback.push(pattern.feedback);

        // Reduce score for problematic patterns
        totalScore *= 0.9;
      }
    });

    // Calculate final process score
    evaluation.processScore = Math.round(Math.min(100, totalScore * 100));

    // Determine reasoning level (process-focused, not correctness)
    evaluation.reasoningLevel = getReasoningLevel(evaluation.processScore);

    // Generate overall feedback
    evaluation.overallFeedback = generateProcessFeedback(evaluation);

    return evaluation;
  }

  // ============================================================================
  // DIMENSION EVALUATION
  // ============================================================================

  function evaluateDimension(text, dimension) {
    let score = 30; // Base score

    // Check positive indicators
    dimension.positiveIndicators.forEach(pattern => {
      const matches = (text.match(pattern) || []).length;
      score += Math.min(20, matches * 10);
    });

    // Check negative indicators (reduce score)
    dimension.negativeIndicators.forEach(pattern => {
      const matches = (text.match(pattern) || []).length;
      score -= matches * 15;
    });

    return Math.max(0, Math.min(100, score));
  }

  // ============================================================================
  // REASONING LEVEL (NOT CORRECTNESS LEVEL)
  // ============================================================================

  function getReasoningLevel(score) {
    // Note: These describe reasoning quality, not answer correctness
    if (score >= 85) return 'Sophisticated Reasoning';
    if (score >= 70) return 'Solid Reasoning';
    if (score >= 55) return 'Developing Reasoning';
    if (score >= 40) return 'Emerging Reasoning';
    return 'Foundational';
  }

  // ============================================================================
  // PROCESS-FOCUSED FEEDBACK
  // ============================================================================

  function generateProcessFeedback(evaluation) {
    const parts = [];

    // Lead with what's working
    if (evaluation.cognitiveStrengths.length > 0) {
      parts.push(`Your reasoning shows strength in ${evaluation.cognitiveStrengths.slice(0, 2).join(' and ')}.`);
    }

    // Process score interpretation (not correctness!)
    const score = evaluation.processScore;
    if (score >= 85) {
      parts.push('Your response demonstrates well-structured critical thinking with multiple elements working together.');
    } else if (score >= 70) {
      parts.push('Your reasoning process is solid, with clear evidence of critical engagement.');
    } else if (score >= 55) {
      parts.push("You're developing good reasoning habits. Continue building on what's working.");
    } else {
      parts.push("Let's focus on strengthening your reasoning process.");
    }

    // Specific growth areas (process-focused)
    if (evaluation.cognitiveGrowthAreas.length > 0) {
      const area = evaluation.cognitiveGrowthAreas[0];
      const tips = {
        'Evidence Anchoring': "Try referencing specific data points before drawing conclusions.",
        'Uncertainty Expression': "Consider what you DON'T know. What information is missing?",
        'Alternative Consideration': "What other explanations might account for what you're seeing?",
        'Assumption Identification': "What assumptions are you making? Can you name them explicitly?",
        'Causal Rigor': "Be careful about cause-and-effect claims. Could this be correlation without causation?",
        'Revision Openness': "What evidence would change your mind? Show you're open to other possibilities."
      };
      if (tips[area]) {
        parts.push(tips[area]);
      }
    }

    return parts.join(' ');
  }

  // ============================================================================
  // EMPTY EVALUATION
  // ============================================================================

  function createEmptyEvaluation() {
    return {
      dimensions: {},
      patterns: [],
      processScore: 0,
      feedback: ['Please provide your reasoning to receive feedback.'],
      cognitiveStrengths: [],
      cognitiveGrowthAreas: [],
      reasoningLevel: 'No Response',
      overallFeedback: 'Enter your analysis to see reasoning feedback.',
      timestamp: new Date().toISOString()
    };
  }

  // ============================================================================
  // ADVERSARIAL PROBE GENERATION
  // ============================================================================

  function generateAdversarialProbe(response, context = {}) {
    const text = response.toLowerCase();

    // Check what they asserted and challenge it
    const probes = [];

    // If they made causal claims
    if (/\b(causes?|led to|results? in|because)\b/i.test(response)) {
      probes.push("You've identified a causal relationship. What alternative explanations could account for the same observations?");
    }

    // If they expressed high confidence
    if (/\b(clearly|obviously|definitely|certainly|must be)\b/i.test(response)) {
      probes.push("You seem confident in this interpretation. What evidence would make you reconsider?");
    }

    // If they didn't express uncertainty
    if (!/\b(might|could|possibly|uncertain|unclear|may)\b/i.test(response)) {
      probes.push("What aspects of this situation remain uncertain? What don't you know?");
    }

    // If they didn't consider alternatives
    if (!/\b(alternatively|or|another|however|on the other hand)\b/i.test(response)) {
      probes.push("What's the strongest alternative explanation to your interpretation?");
    }

    // Generic probes
    probes.push(
      "What assumptions are you making that, if wrong, would change your conclusion?",
      "If you could gather one more piece of information, what would it be and why?"
    );

    return probes[Math.floor(Math.random() * probes.length)];
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  return {
    evaluateReasoning,
    evaluateDimension,
    generateAdversarialProbe,
    getReasoningLevel,
    REASONING_DIMENSIONS,
    COGNITIVE_PATTERNS
  };
})();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CognitiveEvaluator };
}

// Make available globally
if (typeof window !== 'undefined') {
  window.CognitiveEvaluator = CognitiveEvaluator;
}
