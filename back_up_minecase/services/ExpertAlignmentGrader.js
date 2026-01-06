
/**
 * EXPERT ALIGNMENT GRADER
 *
 * Grading system for Riddle Marathon mode that evaluates how accurately
 * a user's answer aligns with the expert analysis using PUZZLE-SPECIFIC answer keys.
 *
 * This is SEPARATE from CognitiveEvaluator which evaluates reasoning PROCESS.
 * This grader evaluates CONTENT ACCURACY and SOLUTION CORRECTNESS.
 *
 * Scoring:
 * - Required Concepts (20%): Must mention key terms/ideas
 * - Core Answer Elements (50%): Solution components with individual weights
 * - Correct Conclusion (20%): Got the final answer right
 * - Bonus Insights (10%): Extra credit for deeper understanding
 *
 * Also detects common wrong answers and provides targeted feedback.
 */

import { getAnswerKey } from '../data/riddleAnswerKeys.js';

export class ExpertAlignmentGrader {

  static WEIGHTS = {
    requiredConcepts: 0.20,
    coreAnswer: 0.50,
    correctConclusion: 0.20,
    bonusInsights: 0.10
  };

  static GRADE_THRESHOLDS = {
    expert: 85,       // Near-perfect understanding
    proficient: 70,   // Strong understanding, minor gaps
    developing: 50,   // Partial understanding
    emerging: 30,     // Some relevant ideas
    novice: 0         // Minimal alignment
  };

  // Wrapper to expose the imported function if needed, or used directly
  static getAnswerKey(id) {
    return getAnswerKey(id);
  }

  // ============================================================================
  // PUZZLE CONTEXT VALIDATION
  // ============================================================================

  /**
   * Validate that the user is answering the correct puzzle
   * by checking for puzzle-specific context terms.
   */
  static validatePuzzleContext(lowerAnswer, answerKey, puzzleId) {
    // If no puzzleContext defined, use title words as fallback
    const contextTerms = answerKey.puzzleContext ||
      this.extractContextFromTitle(answerKey.title);

    if (!contextTerms || contextTerms.length === 0) {
      // No context to validate, assume valid but with warning
      return { valid: true, score: 100, matched: [], expected: [], feedback: '' };
    }

    // Check how many context terms appear in the answer
    const matched = [];
    contextTerms.forEach(term => {
      const termLower = term.toLowerCase();
      if (lowerAnswer.includes(termLower)) {
        matched.push(term);
      }
    });

    // Calculate context match percentage
    const matchRatio = matched.length / contextTerms.length;
    const score = Math.round(matchRatio * 100);

    // Determine if this is likely the wrong puzzle
    // Threshold: At least 1 context term should match, or 20% for longer lists
    const minMatches = Math.max(1, Math.ceil(contextTerms.length * 0.2));
    const valid = matched.length >= minMatches;

    // Try to detect if answering a different puzzle
    let possiblePuzzle = null;
    let feedback = '';

    if (!valid) {
      possiblePuzzle = this.detectPossiblePuzzle(lowerAnswer);
      if (possiblePuzzle) {
        feedback = `Your answer seems to be about "${possiblePuzzle}" instead of "${answerKey.title}".`;
      } else {
        feedback = `Your answer doesn't mention key terms from this puzzle (${answerKey.title}).`;
      }
    }

    return {
      valid,
      score,
      matched,
      expected: contextTerms,
      feedback,
      possiblePuzzle
    };
  }

  /**
   * Extract context terms from puzzle title as fallback
   */
  static extractContextFromTitle(title) {
    if (!title) return [];
    // Extract meaningful words from title (ignore common words)
    const stopWords = ['the', 'and', 'a', 'an', 'of', 'in', 'to', 'for', 'with', 'problem', 'puzzle'];
    return title
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));
  }

  /**
   * Detect if the user might be answering a different puzzle
   * by checking for distinctive keywords from other puzzles
   */
  static detectPossiblePuzzle(lowerAnswer) {
    const puzzleSignatures = {
      "Monty Hall": ["door", "goat", "car", "host", "switch door"],
      "3 Bulbs": ["bulb", "switch", "light", "warm", "heat"],
      "8 Balls": ["ball", "weigh", "heavy", "scale", "balance"],
      "Burning Rope": ["rope", "burn", "fuse", "45 minute"],
      "Egg Drop": ["egg", "floor", "drop", "break", "building"],
      "Pirates": ["pirate", "gold", "coin", "vote", "captain"],
      "Poisoned Wine": ["wine", "bottle", "poison", "prisoner"],
      "Prisoner Hats": ["hat", "prisoner", "color", "red", "black", "parity"],
      "Water Jug": ["jug", "water", "pour", "liter", "gallon"],
      "Fox Chicken Grain": ["fox", "chicken", "grain", "river", "boat"],
      "Bridge and Torch": ["bridge", "torch", "flashlight", "cross", "night"],
      "Cheryl's Birthday": ["cheryl", "birthday", "albert", "bernard"],
      "Airplane Seat": ["airplane", "seat", "passenger", "random"],
      "25 Horses": ["horse", "race", "fastest", "track"],
      "Josephus": ["josephus", "circle", "count", "eliminate"],
      "Birthday Paradox": ["birthday", "23 people", "same birthday"],
      "100 Doors": ["100 door", "toggle", "pass", "perfect square"],
      "Chessboard Domino": ["chessboard", "domino", "corner", "cover"],
      "Nim": ["nim", "pile", "stone", "take", "xor"],
      "Coin Flip": ["coin", "flip", "heads", "tails", "hh"],
      "Snail Wall": ["snail", "climb", "wall", "slide", "feet"],
      "Handshake": ["handshake", "shake", "couple", "spouse"],
      "Marbles Jar": ["marble", "red", "blue", "jar", "probability"],
      "Contaminated Pills": ["pill", "jar", "contaminated", "weigh"],
      "Blind Pills": ["blind", "pill", "red", "blue", "half"]
    };

    let bestMatch = null;
    let bestScore = 0;

    for (const [puzzle, keywords] of Object.entries(puzzleSignatures)) {
      let matchCount = 0;
      for (const keyword of keywords) {
        if (lowerAnswer.includes(keyword)) {
          matchCount++;
        }
      }
      if (matchCount > bestScore && matchCount >= 2) {
        bestScore = matchCount;
        bestMatch = puzzle;
      }
    }

    return bestMatch;
  }

  // ============================================================================
  // MAIN GRADING FUNCTION
  // ============================================================================

  /**
   * Grade user answer against puzzle-specific answer key
   *
   * @param {string} userAnswer - The user's submitted answer
   * @param {number} puzzleId - The puzzle ID to get specific answer key
   * @param {object} options - Additional options (fallback expertAnswer, keyPrinciples)
   * @returns {object} Grading result with score, breakdown, and feedback
   */
  static gradeAnswer(userAnswer, puzzleId, options = {}) {
    if (!userAnswer || userAnswer.trim().length === 0) {
      return this.createEmptyResult();
    }

    // Get puzzle-specific answer key
    const answerKey = getAnswerKey(puzzleId);

    if (!answerKey) {
      // Fallback to generic grading if no specific key exists
      return this.gradeGeneric(userAnswer, options.expertAnswer || '', options);
    }

    const lowerAnswer = userAnswer.toLowerCase();

    // =========================================================================
    // STEP 1: PUZZLE CONTEXT VALIDATION (Critical!)
    // Check if user is actually answering THIS puzzle
    // =========================================================================
    const contextResult = this.validatePuzzleContext(lowerAnswer, answerKey, puzzleId);

    if (!contextResult.valid) {
      // User is likely answering a DIFFERENT puzzle
      return {
        puzzleId,
        puzzleTitle: answerKey.title,
        alignmentScore: Math.min(15, contextResult.score), // Cap at 15 for wrong puzzle
        gradeLevel: 'Wrong Puzzle',
        breakdown: {
          puzzleContext: {
            score: contextResult.score,
            weight: 1.0,
            weighted: contextResult.score,
            matched: contextResult.matched,
            expected: contextResult.expected,
            description: 'Answer must reference this specific puzzle'
          }
        },
        feedback: contextResult.feedback,
        feedbackTips: ['Make sure you are answering the correct puzzle', `This puzzle is about: ${answerKey.title}`],
        strengths: [],
        gaps: [`Your answer doesn't reference: ${contextResult.expected.slice(0, 3).join(', ')}`],
        wrongPuzzleDetected: true,
        possiblePuzzle: contextResult.possiblePuzzle,
        timestamp: new Date().toISOString()
      };
    }

    // =========================================================================
    // STEP 2: Score each dimension (only if context is valid)
    // =========================================================================
    const requiredScore = this.scoreRequiredConcepts(lowerAnswer, answerKey.requiredConcepts);
    const coreScore = this.scoreCoreAnswer(lowerAnswer, answerKey.coreAnswer);
    const conclusionScore = this.scoreConclusion(lowerAnswer, answerKey.correctConclusion);
    const bonusScore = this.scoreBonusInsights(lowerAnswer, answerKey.bonusInsights);

    // Check for wrong answer patterns
    const wrongAnswerFeedback = this.checkWrongAnswers(lowerAnswer, answerKey.wrongAnswerPatterns);

    // Calculate weighted total
    let totalScore = Math.round(
      requiredScore.score * this.WEIGHTS.requiredConcepts +
      coreScore.score * this.WEIGHTS.coreAnswer +
      conclusionScore.score * this.WEIGHTS.correctConclusion +
      bonusScore.score * this.WEIGHTS.bonusInsights
    );

    // Penalty for detected wrong answers
    if (wrongAnswerFeedback) {
      totalScore = Math.max(0, totalScore - 15);
    }

    // Determine grade level
    const gradeLevel = this.getGradeLevel(totalScore);

    // Generate feedback
    const feedback = this.generateFeedback(totalScore, {
      required: requiredScore,
      core: coreScore,
      conclusion: conclusionScore,
      bonus: bonusScore
    }, wrongAnswerFeedback, answerKey);

    return {
      puzzleId,
      puzzleTitle: answerKey.title,
      alignmentScore: totalScore,
      gradeLevel,
      breakdown: {
        requiredConcepts: {
          score: requiredScore.score,
          weight: this.WEIGHTS.requiredConcepts,
          weighted: Math.round(requiredScore.score * this.WEIGHTS.requiredConcepts),
          matched: requiredScore.matched,
          total: requiredScore.total,
          description: 'Key terms and concepts mentioned'
        },
        coreAnswer: {
          score: coreScore.score,
          weight: this.WEIGHTS.coreAnswer,
          weighted: Math.round(coreScore.score * this.WEIGHTS.coreAnswer),
          matchedElements: coreScore.matchedElements,
          missedElements: coreScore.missedElements,
          description: 'Solution components identified'
        },
        correctConclusion: {
          score: conclusionScore.score,
          weight: this.WEIGHTS.correctConclusion,
          weighted: Math.round(conclusionScore.score * this.WEIGHTS.correctConclusion),
          found: conclusionScore.found,
          description: 'Correct final answer'
        },
        bonusInsights: {
          score: bonusScore.score,
          weight: this.WEIGHTS.bonusInsights,
          weighted: Math.round(bonusScore.score * this.WEIGHTS.bonusInsights),
          matched: bonusScore.matched,
          description: 'Deeper understanding shown'
        }
      },
      feedback: feedback.main,
      feedbackTips: feedback.tips,
      strengths: this.generateStrengths(requiredScore, coreScore, conclusionScore, bonusScore),
      gaps: this.generateGaps(requiredScore, coreScore, conclusionScore, answerKey),
      wrongAnswerDetected: wrongAnswerFeedback,
      timestamp: new Date().toISOString()
    };
  }

  // ============================================================================
  // REQUIRED CONCEPTS SCORING
  // ============================================================================

  /**
   * Score whether user mentioned required concepts (any synonym match counts)
   */
  static scoreRequiredConcepts(lowerAnswer, requiredConcepts) {
    if (!requiredConcepts || requiredConcepts.length === 0) {
      return { score: 100, matched: 0, total: 0 };
    }

    let matchedCount = 0;
    const matchedConcepts = [];

    requiredConcepts.forEach(conceptGroup => {
      // Each group is an array of synonyms - match any one
      const synonyms = Array.isArray(conceptGroup) ? conceptGroup : [conceptGroup];
      const found = synonyms.some(synonym => {
        const pattern = new RegExp(synonym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        return pattern.test(lowerAnswer);
      });

      if (found) {
        matchedCount++;
        matchedConcepts.push(synonyms[0]); // Record first synonym as representative
      }
    });

    const score = Math.round((matchedCount / requiredConcepts.length) * 100);

    return {
      score,
      matched: matchedCount,
      total: requiredConcepts.length,
      matchedConcepts
    };
  }

  // ============================================================================
  // CORE ANSWER SCORING
  // ============================================================================

  /**
   * Score individual solution elements with their weights
   */
  static scoreCoreAnswer(lowerAnswer, coreAnswer) {
    if (!coreAnswer || coreAnswer.length === 0) {
      return { score: 100, matchedElements: [], missedElements: [] };
    }

    let totalWeight = 0;
    let earnedWeight = 0;
    const matchedElements = [];
    const missedElements = [];

    coreAnswer.forEach(element => {
      totalWeight += element.weight;

      // Check if any pattern matches
      const matched = element.patterns.some(pattern => {
        try {
          const regex = new RegExp(pattern, 'i');
          return regex.test(lowerAnswer);
        } catch (e) {
          // If regex fails, do simple string match
          return lowerAnswer.includes(pattern.toLowerCase());
        }
      });

      if (matched) {
        earnedWeight += element.weight;
        matchedElements.push(element.element);
      } else {
        missedElements.push(element.element);
      }
    });

    const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

    return {
      score,
      matchedElements,
      missedElements,
      earnedWeight,
      totalWeight
    };
  }

  // ============================================================================
  // CONCLUSION SCORING
  // ============================================================================

  /**
   * Score whether user got the final answer/conclusion correct
   */
  static scoreConclusion(lowerAnswer, correctConclusion) {
    if (!correctConclusion || !correctConclusion.patterns) {
      return { score: 100, found: true };
    }

    const found = correctConclusion.patterns.some(pattern => {
      try {
        const regex = new RegExp(pattern, 'i');
        return regex.test(lowerAnswer);
      } catch (e) {
        return lowerAnswer.includes(pattern.toLowerCase());
      }
    });

    return {
      score: found ? 100 : 0,
      found,
      expected: correctConclusion.description
    };
  }

  // ============================================================================
  // BONUS INSIGHTS SCORING
  // ============================================================================

  /**
   * Score extra insights for deeper understanding
   */
  static scoreBonusInsights(lowerAnswer, bonusInsights) {
    if (!bonusInsights || bonusInsights.length === 0) {
      return { score: 0, matched: [] };
    }

    const matched = [];
    bonusInsights.forEach(insight => {
      if (lowerAnswer.includes(insight.toLowerCase())) {
        matched.push(insight);
      }
    });

    // Partial credit for bonus insights
    const score = Math.min(100, matched.length * 35);

    return { score, matched };
  }

  // ============================================================================
  // WRONG ANSWER DETECTION
  // ============================================================================

  /**
   * Check if user gave a common wrong answer
   */
  static checkWrongAnswers(lowerAnswer, wrongAnswerPatterns) {
    if (!wrongAnswerPatterns || wrongAnswerPatterns.length === 0) {
      return null;
    }

    for (const wrong of wrongAnswerPatterns) {
      try {
        const regex = new RegExp(wrong.pattern, 'i');
        if (regex.test(lowerAnswer)) {
          return wrong.feedback;
        }
      } catch (e) {
        if (lowerAnswer.includes(wrong.pattern.toLowerCase())) {
          return wrong.feedback;
        }
      }
    }

    return null;
  }

  // ============================================================================
  // GRADE LEVEL
  // ============================================================================

  static getGradeLevel(score) {
    if (score >= this.GRADE_THRESHOLDS.expert) return 'Expert';
    if (score >= this.GRADE_THRESHOLDS.proficient) return 'Proficient';
    if (score >= this.GRADE_THRESHOLDS.developing) return 'Developing';
    if (score >= this.GRADE_THRESHOLDS.emerging) return 'Emerging';
    return 'Novice';
  }

  // ============================================================================
  // FEEDBACK GENERATION
  // ============================================================================

  static generateFeedback(totalScore, dimScores, wrongAnswerFeedback, answerKey) {
    const tips = [];
    let main = '';

    // Main feedback based on score
    if (totalScore >= 85) {
      main = 'Excellent! You identified the key solution and explained it thoroughly.';
    } else if (totalScore >= 70) {
      main = 'Strong understanding! You got the main idea but missed some details.';
    } else if (totalScore >= 50) {
      main = 'Good attempt. You understood part of the solution but missed key elements.';
    } else if (totalScore >= 30) {
      main = 'You have some relevant ideas but the core solution is different.';
    } else {
      main = 'Your approach differs from the intended solution. Review the expert analysis.';
    }

    // Wrong answer feedback takes priority
    if (wrongAnswerFeedback) {
      tips.push(wrongAnswerFeedback);
    }

    // Specific tips based on what was missed
    if (dimScores.conclusion.score === 0) {
      tips.push(`The correct answer: ${dimScores.conclusion.expected || 'See expert analysis'}`);
    }

    if (dimScores.required.matched < dimScores.required.total) {
      tips.push('Missing some key concepts from the solution');
    }

    if (dimScores.core.missedElements && dimScores.core.missedElements.length > 0) {
      const missed = dimScores.core.missedElements.slice(0, 2).join('; ');
      tips.push(`Key elements to include: ${missed}`);
    }

    return { main, tips: tips.slice(0, 3) };
  }

  // ============================================================================
  // STRENGTHS & GAPS
  // ============================================================================

  static generateStrengths(required, core, conclusion, bonus) {
    const strengths = [];

    if (conclusion.found) {
      strengths.push('Identified the correct answer');
    }

    if (core.matchedElements && core.matchedElements.length > 0) {
      core.matchedElements.slice(0, 2).forEach(el => {
        strengths.push(`✓ ${el}`);
      });
    }

    if (required.matched === required.total && required.total > 0) {
      strengths.push('Mentioned all key concepts');
    }

    if (bonus.matched && bonus.matched.length > 0) {
      strengths.push(`Bonus insight: ${bonus.matched[0]}`);
    }

    return strengths.slice(0, 4);
  }

  static generateGaps(_required, core, conclusion, answerKey) {
    const gaps = [];

    if (!conclusion.found && answerKey) {
      gaps.push(`Expected: ${conclusion.expected || answerKey.correctConclusion?.description}`);
    } else if (!conclusion.found) {
      gaps.push(`Expected: ${conclusion.expected || 'See expert analysis'}`);
    }

    if (core.missedElements && core.missedElements.length > 0) {
      core.missedElements.slice(0, 3).forEach(el => {
        gaps.push(`Missing: ${el}`);
      });
    }

    return gaps.slice(0, 4);
  }

  // ============================================================================
  // EMPTY RESULT
  // ============================================================================

  static createEmptyResult() {
    return {
      puzzleId: null,
      puzzleTitle: null,
      alignmentScore: 0,
      gradeLevel: 'No Response',
      breakdown: {
        requiredConcepts: { score: 0, weight: this.WEIGHTS.requiredConcepts, weighted: 0, matched: 0, total: 0 },
        coreAnswer: { score: 0, weight: this.WEIGHTS.coreAnswer, weighted: 0, matchedElements: [], missedElements: [] },
        correctConclusion: { score: 0, weight: this.WEIGHTS.correctConclusion, weighted: 0, found: false },
        bonusInsights: { score: 0, weight: this.WEIGHTS.bonusInsights, weighted: 0, matched: [] }
      },
      feedback: 'Please provide your answer to receive grading.',
      feedbackTips: [],
      strengths: [],
      gaps: [],
      wrongAnswerDetected: null,
      timestamp: new Date().toISOString()
    };
  }

  // ============================================================================
  // GENERIC FALLBACK GRADING
  // ============================================================================

  /**
   * Fallback grading when no specific answer key exists
   * Uses simple word overlap comparison with expert answer
   */
  static gradeGeneric(userAnswer, expertAnswer, options = {}) {
    if (!expertAnswer) {
      return this.createEmptyResult();
    }

    const userWords = new Set(
      userAnswer.toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 3)
    );

    const expertWords = new Set(
      expertAnswer.toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 3)
    );

    // Calculate overlap
    let matchCount = 0;
    userWords.forEach(word => {
      if (expertWords.has(word)) matchCount++;
    });

    const overlapScore = expertWords.size > 0
      ? Math.round((matchCount / expertWords.size) * 100)
      : 0;

    // Check key principles if provided
    let principleScore = 0;
    if (options.keyPrinciples && options.keyPrinciples.length > 0) {
      const lowerAnswer = userAnswer.toLowerCase();
      let matched = 0;
      options.keyPrinciples.forEach(principle => {
        const words = principle.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const found = words.filter(w => lowerAnswer.includes(w)).length;
        if (found >= words.length * 0.4) matched++;
      });
      principleScore = (matched / options.keyPrinciples.length) * 100;
    }

    const totalScore = Math.round(overlapScore * 0.6 + principleScore * 0.4);

    return {
      puzzleId: null,
      puzzleTitle: 'Generic Grading',
      alignmentScore: totalScore,
      gradeLevel: this.getGradeLevel(totalScore),
      breakdown: {
        wordOverlap: { score: overlapScore, description: 'Word overlap with expert answer' },
        principleMatch: { score: Math.round(principleScore), description: 'Key principles mentioned' }
      },
      feedback: totalScore >= 70
        ? 'Good alignment with the expert analysis.'
        : 'Your answer differs from the expert analysis. Compare carefully.',
      feedbackTips: [],
      strengths: matchCount > 5 ? ['Good use of relevant terminology'] : [],
      gaps: matchCount < 5 ? ['Consider the specific terminology from the problem'] : [],
      wrongAnswerDetected: null,
      isGenericGrading: true,
      timestamp: new Date().toISOString()
    };
  }

  // ============================================================================
  // UTILITY: QUICK SCORE CHECK
  // ============================================================================

  /**
   * Quick check if answer hits the main points (for progress tracking)
   */
  static quickCheck(userAnswer, puzzleId) {
    const answerKey = getAnswerKey(puzzleId);
    if (!answerKey) return { passed: false, score: 0 };

    const lowerAnswer = userAnswer.toLowerCase();

    // Check if conclusion is correct
    const conclusionPassed = answerKey.correctConclusion?.patterns?.some(pattern => {
      try {
        return new RegExp(pattern, 'i').test(lowerAnswer);
      } catch {
        return lowerAnswer.includes(pattern.toLowerCase());
      }
    }) || false;

    // Check core answer coverage
    let coreMatched = 0;
    answerKey.coreAnswer?.forEach(element => {
      if (element.patterns.some(p => {
        try { return new RegExp(p, 'i').test(lowerAnswer); }
        catch { return lowerAnswer.includes(p.toLowerCase()); }
      })) {
        coreMatched++;
      }
    });

    const coreRatio = answerKey.coreAnswer
      ? coreMatched / answerKey.coreAnswer.length
      : 0;

    return {
      passed: conclusionPassed && coreRatio >= 0.5,
      conclusionCorrect: conclusionPassed,
      coreAnswerRatio: coreRatio,
      score: Math.round((conclusionPassed ? 50 : 0) + (coreRatio * 50))
    };
  }
}

// Make available globally (legacy/browser compatibility)
if (typeof window !== 'undefined') {
  window.ExpertAlignmentGrader = ExpertAlignmentGrader;
}
