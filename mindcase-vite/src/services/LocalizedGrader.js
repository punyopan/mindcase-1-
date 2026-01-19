/**
 * Localized Grader Wrapper
 * 
 * Wraps existing graders to provide language-aware grading.
 * Strategy: Grade in English (reliable), translate feedback to user's language.
 */

import { ExpertAlignmentGrader } from './ExpertAlignmentGrader.js';
import { StructuralEvaluator } from './structuralEvaluator.js';
import ContentTranslator from './ContentTranslator.js';
import TranslationService from './TranslationService.js';

class LocalizedGraderClass {
  /**
   * Grade answer with language-aware feedback
   * 
   * @param {string} userAnswer - User's answer (in any language)
   * @param {number} puzzleId - Puzzle ID
   * @param {object} puzzle - Original puzzle object
   * @param {object} options - Additional options
   * @returns {Promise<object>} - Grading result with localized feedback
   */
  async gradeAnswer(userAnswer, puzzleId, puzzle, options = {}) {
    const language = options.language || TranslationService.getLanguage() || 'English';

    // Step 1: Grade using ExpertAlignmentGrader (works on English patterns)
    // Note: User can answer in any language, grader looks for concept presence
    const alignmentResult = ExpertAlignmentGrader.gradeAnswer(userAnswer, puzzleId, {
      expertAnswer: puzzle?.idealAnswer,
      keyPrinciples: puzzle?.keyPrinciples
    });

    // Step 2: Grade reasoning structure
    const structuralResult = await StructuralEvaluator.evaluateResponse(userAnswer, {
      puzzleId,
      question: puzzle?.question
    });

    // Step 3: Combine scores (weighted average)
    const combinedScore = Math.round(
      alignmentResult.alignmentScore * 0.6 + 
      structuralResult.totalScore * 0.4
    );

    // Step 4: Build feedback object
    const feedback = {
      mainFeedback: alignmentResult.feedback || structuralResult.overallFeedback?.main || '',
      tips: alignmentResult.feedbackTips || [],
      strengths: alignmentResult.strengths || [],
      gaps: alignmentResult.gaps || [],
      structuralFeedback: structuralResult.overallFeedback?.main || ''
    };

    // Step 5: Translate feedback if not English
    let localizedFeedback = feedback;
    if (language !== 'English') {
      try {
        localizedFeedback = await ContentTranslator.translateFeedback(feedback, language);
      } catch (err) {
        console.warn('Feedback translation failed, using English:', err);
      }
    }

    return {
      score: combinedScore,
      alignmentScore: alignmentResult.alignmentScore,
      structuralScore: structuralResult.totalScore,
      gradeLevel: alignmentResult.gradeLevel,
      performanceLevel: structuralResult.performanceLevel,
      feedback: localizedFeedback,
      breakdown: {
        alignment: alignmentResult.breakdown,
        structural: structuralResult.components
      },
      language,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Quick check for puzzle completion (lightweight, no translation)
   */
  quickCheck(userAnswer, puzzleId) {
    return ExpertAlignmentGrader.quickCheck(userAnswer, puzzleId);
  }

  /**
   * Get current language
   */
  getLanguage() {
    return TranslationService.getLanguage();
  }
}

// Singleton instance
const LocalizedGrader = new LocalizedGraderClass();

export { LocalizedGrader };
export default LocalizedGrader;

// Make available globally
if (typeof window !== 'undefined') {
  window.LocalizedGrader = LocalizedGrader;
}
