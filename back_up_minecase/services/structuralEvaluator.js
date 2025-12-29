/**
 * Structural Reasoning Evaluator
 *
 * Balanced but rigorous grading system that:
 * - Evaluates REASONING PRESENCE, not complex vocabulary
 * - Rewards clear, well-developed explanations
 * - Requires multiple reasoning components for high scores
 * - Applies penalties for verbosity, keyword stuffing, and insufficient length
 * - Makes 75-85 scores achievable with strong reasoning
 * - Requires comprehensive critical thinking for 90+ scores
 */

export class StructuralEvaluator {

  /**
   * REASONING STRUCTURE MODELS
   * Define reasoning components for each question type
   */
  static REASONING_MODELS = {
    CRITICAL_EVALUATION: {
      name: 'Critical Evaluation',
      components: [
        {
          id: 'claim_identification',
          label: 'Identifies what is being claimed or argued',
          weight: 25,
          required: true,
          validations: ['basic_presence']
        },
        {
          id: 'flaw_explanation',
          label: 'Explains why something is problematic or flawed',
          weight: 40,
          required: true,
          validations: ['basic_reasoning']
        },
        {
          id: 'consequence_reasoning',
          label: 'Shows what could happen or why it matters',
          weight: 25,
          required: true,
          validations: ['causal_thinking']
        },
        {
          id: 'alternative_perspective',
          label: 'Considers other viewpoints or solutions',
          weight: 10,
          required: false,
          validations: ['depth']
        }
      ]
    },

    EVIDENCE_ANALYSIS: {
      name: 'Evidence Analysis',
      components: [
        {
          id: 'source_assessment',
          label: 'Questions who said it or where it came from',
          weight: 30,
          required: true,
          validations: ['basic_presence']
        },
        {
          id: 'methodology_critique',
          label: 'Questions how they got the information',
          weight: 30,
          required: true,
          validations: ['basic_reasoning']
        },
        {
          id: 'limitation_recognition',
          label: 'Points out what might be missing or biased',
          weight: 25,
          required: true,
          validations: ['insight']
        },
        {
          id: 'conclusion_validity',
          label: 'Questions if the conclusion makes sense',
          weight: 15,
          required: true,
          validations: ['logical_thinking']
        }
      ]
    },

    CAUSAL_REASONING: {
      name: 'Causal Reasoning',
      components: [
        {
          id: 'correlation_distinction',
          label: 'Distinguishes between things happening together vs. causing each other',
          weight: 35,
          required: true,
          validations: ['understanding']
        },
        {
          id: 'alternative_causes',
          label: 'Suggests other possible explanations',
          weight: 30,
          required: true,
          validations: ['creative_thinking']
        },
        {
          id: 'confounding_factors',
          label: 'Mentions other factors that might be involved',
          weight: 20,
          required: true,
          validations: ['depth']
        },
        {
          id: 'evidence_requirement',
          label: 'Explains what evidence would help prove causation',
          weight: 15,
          required: false,
          validations: ['insight']
        }
      ]
    },

    DECISION_MAKING: {
      name: 'Decision Making',
      components: [
        {
          id: 'information_gaps',
          label: 'Points out what information is missing',
          weight: 30,
          required: true,
          validations: ['critical_awareness']
        },
        {
          id: 'risk_analysis',
          label: 'Considers potential risks or downsides',
          weight: 30,
          required: true,
          validations: ['balanced_thinking']
        },
        {
          id: 'tradeoff_reasoning',
          label: 'Weighs pros and cons',
          weight: 25,
          required: true,
          validations: ['analytical_balance']
        },
        {
          id: 'recommendation_justification',
          label: 'Explains reasoning behind a choice or recommendation',
          weight: 15,
          required: false,
          validations: ['coherence']
        }
      ]
    }
  };

  /**
   * Select the appropriate reasoning model
   */
  static selectReasoningModel(context) {
    // Default to CRITICAL_EVALUATION (works for most puzzles)
    return this.REASONING_MODELS.CRITICAL_EVALUATION;
  }

  /**
   * Main evaluation entry point
   */
  static async evaluateResponse(response, context = {}) {
    if (!response || response.trim().length === 0) {
      return this.createEmptyEvaluation();
    }

    // Select model and extract structure
    const model = this.selectReasoningModel(context);
    const extraction = await this.extractReasoningStructure(response, model, context);

    // Validate and calculate score
    const validated = this.validateExtraction(extraction, response);
    const evaluation = this.calculateScore(validated, model, response);

    return evaluation;
  }

  /**
   * Extract reasoning structure from response
   * This is where we detect what reasoning components are present
   */
  static async extractReasoningStructure(response, model, context) {
    const extraction = {
      components: {},
      meta: {
        wordCount: response.split(/\s+/).filter(w => w.length > 0).length,
        sentenceCount: response.split(/[.!?]+/).filter(s => s.trim().length > 10).length,
        responseText: response
      }
    };

    // Extract each component with LENIENT detection
    model.components.forEach(component => {
      const extracted = this.extractComponent(
        component,
        response,
        extraction.meta,
        context
      );
      extraction.components[component.id] = extracted;
    });

    return extraction;
  }

  /**
   * Extract individual reasoning component using LENIENT detection
   * Philosophy: If the concept is there in ANY reasonable form, give credit
   */
  static extractComponent(component, response, meta, context) {
    const text = response.toLowerCase();

    // Use component-specific extraction with LENIENT patterns
    switch (component.id) {
      case 'claim_identification':
        return this.extractClaimIdentification(text, response, meta);

      case 'flaw_explanation':
        return this.extractFlawExplanation(text, response, meta);

      case 'consequence_reasoning':
        return this.extractConsequenceReasoning(text, response, meta);

      case 'alternative_perspective':
        return this.extractAlternativePerspective(text, response, meta);

      case 'source_assessment':
        return this.extractSourceAssessment(text, response, meta);

      case 'methodology_critique':
        return this.extractMethodologyCritique(text, response, meta);

      case 'limitation_recognition':
        return this.extractLimitationRecognition(text, response, meta);

      case 'conclusion_validity':
        return this.extractConclusionValidity(text, response, meta);

      case 'correlation_distinction':
        return this.extractCorrelationDistinction(text, response, meta);

      case 'alternative_causes':
        return this.extractAlternativeCauses(text, response, meta);

      case 'confounding_factors':
        return this.extractConfoundingFactors(text, response, meta);

      case 'evidence_requirement':
        return this.extractEvidenceRequirement(text, response, meta);

      case 'information_gaps':
        return this.extractInformationGaps(text, response, meta);

      case 'risk_analysis':
        return this.extractRiskAnalysis(text, response, meta);

      case 'tradeoff_reasoning':
        return this.extractTradeoffReasoning(text, response, meta);

      case 'recommendation_justification':
        return this.extractRecommendationJustification(text, response, meta);

      default:
        return { present: false, quality: 0, evidence: [] };
    }
  }

  // ============================================================================
  // LENIENT COMPONENT EXTRACTION METHODS
  // Philosophy: Simple language deserves full credit if the reasoning is there
  // ============================================================================

  static extractClaimIdentification(text, original, meta) {
    // Look for ANY indication they're addressing the topic/claim
    // Accepts: direct reference, implicit discussion, or questioning the premise

    const directPatterns = [
      /\b(claim|claims|argument|statement|says|said|suggests|believes|thinks|argues|states)\b/i,
      /\b(they|he|she|it|this|the\s+\w+)\s+(say|says|said|argue|argues|think|thinks|believe|believes|claim|claims)\b/i,
      /\b(according to|based on)\b/i,
      /\b(before|first|initially)\b/i, // Shows they're starting reasoning process
      /\b(should|would|need to|must)\s+(check|verify|validate|examine|investigate|look|ask|consider)\b/i, // Proactive questioning
      /\b(question|questions|ask|consider|examine|investigate)\b/i // Shows engagement with topic
    ];

    const hasDirectMention = directPatterns.some(p => p.test(original));

    // Also give credit if they reference the topic substantively (shows understanding)
    const hasSubstantiveDiscussion = meta.wordCount >= 15 && meta.sentenceCount >= 1;

    // Quality scoring (stricter - need clear engagement)
    let quality = 0;
    if (hasDirectMention && hasSubstantiveDiscussion) {
      quality = 2; // Full credit only for both direct mention AND substantive discussion
    } else if (hasDirectMention) {
      quality = 1; // Partial credit for just mentioning the claim
    } else if (hasSubstantiveDiscussion) {
      quality = 1; // Partial credit for just substantive discussion
    }

    return {
      present: quality > 0,
      quality: quality,
      evidence: hasDirectMention ? ['identified_claim'] : []
    };
  }

  static extractFlawExplanation(text, original, meta) {
    // Look for ANY critical analysis - either identifying problems OR questioning assumptions
    // Accepts both reactive (pointing out flaws) and proactive (asking critical questions)

    const problemIndicators = [
      /\b(wrong|incorrect|false|flaw|flawed|problem|issue|mistake|error|doesn't work|won't work|can't|cannot)\b/i,
      /\b(assuming|assumes|ignores|overlooks|misses|neglects|fails to)\b/i,
      /\b(not\s+\w+\s+enough|insufficient|inadequate|weak|questionable|doubtful)\b/i,
      /\b(question|questions|validate|verify|check)\s+(the|this|that|assumption|premise)\b/i, // Questioning assumptions
      /\b(before|first)\s+\w+\s+(assuming|concluding|deciding)\b/i, // Careful reasoning
      /\b(alternative|other|different)\s+(explanation|cause|reason|possibility)\b/i // Considering alternatives
    ];

    const reasoningIndicators = [
      /\bbecause\b/i,
      /\bsince\b/i,
      /\b(this|that|it)\s+(means|shows|proves|indicates|suggests)\b/i,
      /\b(therefore|thus|so|hence)\b/i,
      /\b(as a result|this is why|the reason)\b/i,
      /\b(should|need to|must)\s+(first|check|verify|ask|consider|examine)\b/i, // Proactive reasoning
      /\b(key question|important to|critical to)\b/i // Shows analytical thinking
    ];

    const hasProblem = problemIndicators.some(p => p.test(original));
    const hasReasoning = reasoningIndicators.some(p => p.test(original));
    const hasMultipleSentences = meta.sentenceCount >= 2;

    // Quality scoring (stricter - need both problem identification AND reasoning)
    let quality = 0;
    if (hasProblem && hasReasoning) {
      quality = 2; // Full credit: shows both problem AND reasoning
    } else if (hasProblem || hasReasoning) {
      quality = 1; // Partial credit: shows either problem OR reasoning
    } else if (hasMultipleSentences) {
      quality = 0; // No credit for just multiple sentences without critical thinking
    }

    return {
      present: quality > 0,
      quality: quality,
      evidence: (hasProblem || hasReasoning) ? ['critical_thinking'] : []
    };
  }

  static extractConsequenceReasoning(text, original, meta) {
    // Look for ANY discussion of implications, outcomes, or reasoning about why things matter
    // Accepts: predictions, questions about impact, or explanations of significance

    const consequenceWords = [
      /\b(could|would|might|may|can|will)\b/i,
      /\b(leads? to|results? in|causes?|creates?|produces?)\b/i,
      /\b(means|implies|shows|indicates|suggests)\b/i,
      /\b(consequence|result|outcome|effect|impact|problem|issue)\b/i,
      /\b(important|matters|significant|serious|affects)\b/i,
      /\b(if|when|then)\b/i,
      /\b(approach|strategy|method)\b/i, // Discussing methodology shows reasoning
      /\b(this\s+way|by doing this|this allows)\b/i, // Explaining rationale
      /\b(so that|in order to|to)\b/i // Purpose/goal reasoning
    ];

    const hasConsequenceThinking = consequenceWords.some(p => p.test(original));
    const hasForwardLooking = /\b(could|would|might|may|will|if|when|approach|before)\b/i.test(original);
    const hasImpactMention = /\b(affect|impact|consequence|result|outcome|matter|important|dissolve|prevent|help|verify)\b/i.test(original);
    const hasMethodology = /\b(approach|method|way|strategy|first|before)\b/i.test(original);

    // Quality scoring (stricter - need clear consequence reasoning)
    let quality = 0;
    if (hasConsequenceThinking && (hasForwardLooking || hasImpactMention)) {
      quality = 2; // Full credit: shows consequence thinking AND forward-looking or impact
    } else if (hasConsequenceThinking || hasImpactMention || hasMethodology) {
      quality = 1; // Partial credit: shows some consequence reasoning
    } else if (meta.sentenceCount >= 2) {
      quality = 0; // No credit for just multiple sentences
    }

    return {
      present: quality > 0,
      quality: quality,
      evidence: hasConsequenceThinking ? ['consequence_thinking'] : []
    };
  }

  static extractAlternativePerspective(text, original, meta) {
    // BONUS component - look for consideration of alternatives
    // Words like "however", "but", "could also", "alternatively" are ENOUGH

    const alternativeIndicators = [
      /\b(however|but|although|though|yet|still)\b/i,
      /\b(alternative|alternatively|instead|rather|other)\b/i,
      /\b(could also|might also|may also|also|another)\b/i,
      /\b(on the other hand|different|vary|depends)\b/i,
      /\b(maybe|perhaps|possibly|potentially)\b/i
    ];

    const hasAlternativeThinking = alternativeIndicators.some(p => p.test(original));
    const hasMultiplePoints = meta.sentenceCount >= 3;

    let quality = 0;
    if (hasAlternativeThinking && hasMultiplePoints) {
      quality = 2;
    } else if (hasAlternativeThinking) {
      quality = 1;
    }

    return {
      present: quality > 0,
      quality: quality,
      evidence: hasAlternativeThinking ? ['alternative_view'] : []
    };
  }

  static extractSourceAssessment(text, original, meta) {
    // Questions about WHO said it or WHERE it came from

    const sourceQuestions = [
      /\b(who|where|which|what)\s+(said|says|claims|source|from|study|research)\b/i,
      /\b(source|author|researcher|expert|study|report|data)\b/i,
      /\b(credible|reliable|trustworthy|biased|questionable)\b/i,
      /\b(according to)\b/i
    ];

    const hasSourceThinking = sourceQuestions.some(p => p.test(original));

    let quality = hasSourceThinking ? 2 : 0;

    return {
      present: quality > 0,
      quality: quality,
      evidence: hasSourceThinking ? ['source_awareness'] : []
    };
  }

  static extractMethodologyCritique(text, original, meta) {
    // Questions about HOW they got the information

    const methodQuestions = [
      /\b(how|method|measured|tested|collected|sample|experiment)\b/i,
      /\b(data|evidence|proof|information|facts)\b/i,
      /\b(enough|sufficient|small|large|limited)\b/i
    ];

    const hasMethodThinking = methodQuestions.some(p => p.test(original));

    let quality = hasMethodThinking ? 2 : 0;

    return {
      present: quality > 0,
      quality: quality,
      evidence: hasMethodThinking ? ['method_awareness'] : []
    };
  }

  static extractLimitationRecognition(text, original, meta) {
    // Points out what might be missing or biased

    const limitationWords = [
      /\b(limit|limited|limitation|bias|biased|missing|lack|without|doesn't include)\b/i,
      /\b(not|no|never)\s+\w+\s+(enough|sufficient|complete|comprehensive)\b/i,
      /\b(assume|assumes|assuming|overlook|ignore|neglect|miss)\b/i,
      /\b(only|just|merely)\b/i
    ];

    const hasLimitationAwareness = limitationWords.some(p => p.test(original));

    let quality = hasLimitationAwareness ? 2 : 0;

    return {
      present: quality > 0,
      quality: quality,
      evidence: hasLimitationAwareness ? ['sees_limitations'] : []
    };
  }

  static extractConclusionValidity(text, original, meta) {
    // Questions if the conclusion makes sense

    const validityWords = [
      /\b(conclude|conclusion|therefore|thus|so)\b/i,
      /\b(makes sense|logical|valid|sound|justified|warranted)\b/i,
      /\b(doesn't follow|jump|leap|assume)\b/i
    ];

    const hasValidityThinking = validityWords.some(p => p.test(original));

    let quality = hasValidityThinking ? 2 : 0;

    return {
      present: quality > 0,
      quality: quality,
      evidence: hasValidityThinking ? ['validity_check'] : []
    };
  }

  static extractCorrelationDistinction(text, original, meta) {
    // Distinguishes between correlation and causation

    const correlationWords = [
      /\b(correlation|correlate|related|relationship|connection|linked|associated)\b/i,
      /\b(cause|causes|caused|causation|why)\b/i,
      /\b(just because|doesn't mean|not necessarily)\b/i,
      /\b(happen together|at the same time|coincidence)\b/i
    ];

    const hasCorrelationThinking = correlationWords.some(p => p.test(original));

    let quality = hasCorrelationThinking ? 2 : 0;

    return {
      present: quality > 0,
      quality: quality,
      evidence: hasCorrelationThinking ? ['correlation_awareness'] : []
    };
  }

  static extractAlternativeCauses(text, original, meta) {
    // Suggests other possible explanations

    const alternativeWords = [
      /\b(other|another|alternative|different|else|also)\b/i,
      /\b(could be|might be|may be|possibly|perhaps|maybe)\b/i,
      /\b(instead|rather|or)\b/i,
      /\b(factor|reason|cause|explanation)\b/i
    ];

    const hasAlternativeThinking = alternativeWords.filter(p => p.test(original)).length >= 2;

    let quality = hasAlternativeThinking ? 2 : 0;

    return {
      present: quality > 0,
      quality: quality,
      evidence: hasAlternativeThinking ? ['alternative_causes'] : []
    };
  }

  static extractConfoundingFactors(text, original, meta) {
    // Mentions other factors that might be involved

    const confoundingWords = [
      /\b(other\s+(factor|variable|thing|reason|cause))\b/i,
      /\b(also|additionally|besides|along with)\b/i,
      /\b(confound|influence|affect|impact)\b/i,
      /\b(third|another|outside)\b/i
    ];

    const hasConfoundingAwareness = confoundingWords.some(p => p.test(original));

    let quality = hasConfoundingAwareness ? 2 : 0;

    return {
      present: quality > 0,
      quality: quality,
      evidence: hasConfoundingAwareness ? ['confounding_awareness'] : []
    };
  }

  static extractEvidenceRequirement(text, original, meta) {
    // BONUS - Explains what evidence would help

    const evidenceWords = [
      /\b(need|needed|require|necessary|should|would need)\b/i,
      /\b(evidence|proof|data|information|test|study|experiment)\b/i,
      /\b(show|prove|demonstrate|establish)\b/i
    ];

    const hasEvidenceThinking = evidenceWords.filter(p => p.test(original)).length >= 2;

    let quality = hasEvidenceThinking ? 2 : 0;

    return {
      present: quality > 0,
      quality: quality,
      evidence: hasEvidenceThinking ? ['evidence_thinking'] : []
    };
  }

  static extractInformationGaps(text, original, meta) {
    // Points out what information is missing

    const gapWords = [
      /\b(don't know|unknown|unclear|uncertain|missing|lack)\b/i,
      /\b(need to know|would need|require|necessary)\b/i,
      /\b(what|how|why|when|where|who)\b/i,
      /\b(information|detail|data|fact)\b/i
    ];

    const hasGapAwareness = gapWords.filter(p => p.test(original)).length >= 2;

    let quality = hasGapAwareness ? 2 : 0;

    return {
      present: quality > 0,
      quality: quality,
      evidence: hasGapAwareness ? ['gap_awareness'] : []
    };
  }

  static extractRiskAnalysis(text, original, meta) {
    // Considers potential risks or downsides

    const riskWords = [
      /\b(risk|danger|problem|issue|concern|downside|negative|bad)\b/i,
      /\b(could|might|may)\s+\w+\s+(wrong|fail|problem)\b/i,
      /\b(harm|damage|loss|cost)\b/i,
      /\b(careful|caution|warning|watch)\b/i
    ];

    const hasRiskThinking = riskWords.some(p => p.test(original));

    let quality = hasRiskThinking ? 2 : 0;

    return {
      present: quality > 0,
      quality: quality,
      evidence: hasRiskThinking ? ['risk_awareness'] : []
    };
  }

  static extractTradeoffReasoning(text, original, meta) {
    // Weighs pros and cons

    const tradeoffWords = [
      /\b(but|however|although|though|yet)\b/i,
      /\b(advantage|benefit|pro|positive|good|helps)\b/i,
      /\b(disadvantage|drawback|con|negative|bad|problem)\b/i,
      /\b(balance|weigh|consider|tradeoff|trade-off)\b/i,
      /\b(on the other hand|on one hand)\b/i
    ];

    const hasTradeoffThinking = tradeoffWords.filter(p => p.test(original)).length >= 2;

    let quality = hasTradeoffThinking ? 2 : 0;

    return {
      present: quality > 0,
      quality: quality,
      evidence: hasTradeoffThinking ? ['tradeoff_thinking'] : []
    };
  }

  static extractRecommendationJustification(text, original, meta) {
    // BONUS - Explains reasoning behind a choice

    const recommendationWords = [
      /\b(should|recommend|suggest|advise|best|better|prefer)\b/i,
      /\b(because|since|as|given that)\b/i,
      /\b(reason|why|therefore|thus)\b/i
    ];

    const hasRecommendationReasoning = recommendationWords.filter(p => p.test(original)).length >= 2;

    let quality = hasRecommendationReasoning ? 2 : 0;

    return {
      present: quality > 0,
      quality: quality,
      evidence: hasRecommendationReasoning ? ['recommendation'] : []
    };
  }

  /**
   * VALIDATION: Apply quality multipliers (LENIENT)
   * Only penalize extreme cases, reward good practices
   */
  static validateExtraction(extraction, response) {
    const { wordCount, sentenceCount } = extraction.meta;

    // Calculate validation multipliers (STRICTER)
    const validations = {
      // Verbosity: penalize if too long (>120 words)
      verbosityPenalty: wordCount > 120 ? 0.9 : (wordCount > 150 ? 0.85 : 1.0),

      // Keyword stuffing: stricter penalty if same word repeated 4+ times
      keywordStuffingPenalty: this.detectKeywordStuffing(response) ? 0.9 : 1.0,

      // Generic response: penalize obvious AI-like fluff more
      genericResponsePenalty: this.detectGenericResponse(response) ? 0.9 : 1.0,

      // Conciseness bonus: reward sweet spot (60-100 words) - narrower range
      concisenessBonus: (wordCount >= 60 && wordCount <= 100) ? 1.05 : 1.0,

      // Structure bonus: reward well-organized (3-5 sentences) - require more
      structuralBonus: (sentenceCount >= 3 && sentenceCount <= 5) ? 1.05 : 1.0,

      // Completeness bonus: reward substantive answers (50+ words) - higher threshold
      completenessBonus: wordCount >= 50 ? 1.05 : 1.0,

      // Minimum length penalty: penalize very short responses (<30 words)
      lengthPenalty: wordCount < 30 ? 0.9 : 1.0
    };

    // Total multiplier (multiply all)
    const totalMultiplier = Object.values(validations).reduce((a, b) => a * b, 1.0);

    return {
      ...extraction,
      validations,
      qualityMultiplier: totalMultiplier
    };
  }

  /**
   * Detect keyword stuffing (stricter - flag if word repeated too much)
   */
  static detectKeywordStuffing(text) {
    const words = text.toLowerCase().split(/\s+/);
    const wordCount = {};

    words.forEach(word => {
      if (word.length > 4) { // Only count substantial words
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    // Flag if a word appears 4+ times (stricter than before)
    return Object.values(wordCount).some(count => count >= 4);
  }

  /**
   * Detect generic AI response (only flag obvious cases)
   */
  static detectGenericResponse(text) {
    const genericPhrases = [
      /it is important to note that/i,
      /it should be noted that/i,
      /in conclusion/i,
      /in summary/i,
      /first and foremost/i,
      /last but not least/i,
      /at the end of the day/i
    ];

    // Only flag if multiple generic phrases present
    return genericPhrases.filter(p => p.test(text)).length >= 2;
  }

  /**
   * DETERMINISTIC SCORING
   * Calculate final score based on components found
   */
  static calculateScore(validated, model, response) {
    let baseScore = 0;
    const componentScores = {};

    // Score each component
    model.components.forEach(component => {
      const extracted = validated.components[component.id];

      // Quality factor: 0 = missing, 1 = partial (50%), 2 = complete (100%)
      const qualityFactor = extracted.quality === 2 ? 1.0 : (extracted.quality === 1 ? 0.5 : 0.0);

      // Component score
      const componentScore = component.weight * qualityFactor;

      componentScores[component.id] = {
        score: Math.round(componentScore),
        maxScore: component.weight,
        present: extracted.present,
        quality: extracted.quality,
        label: component.label,
        required: component.required
      };

      baseScore += componentScore;
    });

    // Apply quality multiplier
    const adjustedScore = baseScore * validated.qualityMultiplier;

    // Final score (0-100, rounded)
    const finalScore = Math.min(100, Math.round(adjustedScore));

    return {
      totalScore: finalScore,
      baseScore: Math.round(baseScore),
      qualityMultiplier: validated.qualityMultiplier.toFixed(2),
      validations: validated.validations,
      model: model.name,
      components: componentScores,
      wordCount: validated.meta.wordCount,
      sentenceCount: validated.meta.sentenceCount,
      performanceLevel: this.getPerformanceLevel(finalScore),
      overallFeedback: this.generateExplainableFeedback(finalScore, componentScores, validated),
      timestamp: new Date().toISOString()
    };
  }

  static getPerformanceLevel(score) {
    if (score >= 95) return 'Outstanding';
    if (score >= 85) return 'Excellent';
    if (score >= 75) return 'Very Good';
    if (score >= 65) return 'Good';
    if (score >= 55) return 'Developing';
    return 'Needs Improvement';
  }

  /**
   * EXPLAINABLE FEEDBACK
   * Human-readable explanation of score
   */
  static generateExplainableFeedback(score, components, validated) {
    let feedback = '';

    // Overall performance (stricter thresholds)
    if (score >= 95) {
      feedback = '🌟 Outstanding! Your response shows excellent critical thinking with all key elements clearly expressed.';
    } else if (score >= 85) {
      feedback = '✨ Excellent work! Strong reasoning with clear explanations.';
    } else if (score >= 75) {
      feedback = '👍 Very good! Your analysis demonstrates solid critical thinking.';
    } else if (score >= 65) {
      feedback = '📈 Good effort! You\'re showing critical thinking skills.';
    } else if (score >= 55) {
      feedback = '💪 You\'re on the right track! Try to include more reasoning about why and what could happen.';
    } else {
      feedback = '🎯 Keep practicing! Remember to explain why something is problematic and what might result.';
    }

    // Specific missing components (required ones)
    const missingRequired = Object.entries(components)
      .filter(([id, comp]) => comp.required && !comp.present)
      .map(([id, comp]) => comp.label);

    if (missingRequired.length > 0) {
      feedback += ` Try adding: ${missingRequired[0]}.`;
    }

    // Positive validation feedback
    if (validated.validations.completenessBonus > 1.0) {
      feedback += ' Nice substantive answer!';
    }

    if (validated.validations.concisenessBonus > 1.0) {
      feedback += ' Great length - concise yet complete!';
    }

    return feedback;
  }

  static createEmptyEvaluation() {
    return {
      totalScore: 0,
      baseScore: 0,
      qualityMultiplier: 0,
      validations: {},
      model: 'None',
      components: {},
      wordCount: 0,
      sentenceCount: 0,
      performanceLevel: 'No Response',
      overallFeedback: 'Please provide a response to receive evaluation.',
      timestamp: new Date().toISOString()
    };
  }
}

// Make available globally for browser
if (typeof window !== 'undefined') {
  window.StructuralEvaluator = StructuralEvaluator;
}
