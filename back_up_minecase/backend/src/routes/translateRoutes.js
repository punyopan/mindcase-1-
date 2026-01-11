/**
 * Translation Routes
 * 
 * API endpoints for puzzle and feedback translation.
 */

const express = require('express');
const router = express.Router();
const translationService = require('../services/TranslationService');

/**
 * POST /api/translate/puzzle
 * Translate a single puzzle to target language
 */
router.post('/puzzle', async (req, res) => {
  try {
    const { puzzleId, title, question, idealAnswer, keyPrinciples, targetLanguage } = req.body;

    if (!targetLanguage || targetLanguage === 'English') {
      return res.json({ title, question, idealAnswer, keyPrinciples });
    }

    if (!question) {
      return res.status(400).json({ error: 'Missing required field: question' });
    }

    const translated = await translationService.translatePuzzle({
      puzzleId,
      title,
      question,
      idealAnswer,
      keyPrinciples
    }, targetLanguage);

    res.json(translated);
  } catch (error) {
    console.error('Puzzle translation error:', error);
    res.status(500).json({ error: 'Translation failed', details: error.message });
  }
});

/**
 * POST /api/translate/batch
 * Translate multiple puzzles in batch
 */
router.post('/batch', async (req, res) => {
  try {
    const { puzzles, targetLanguage } = req.body;

    if (!targetLanguage || targetLanguage === 'English') {
      return res.json({ translations: puzzles });
    }

    if (!Array.isArray(puzzles) || puzzles.length === 0) {
      return res.status(400).json({ error: 'puzzles must be a non-empty array' });
    }

    // Limit batch size to prevent timeout
    const maxBatch = 10;
    if (puzzles.length > maxBatch) {
      return res.status(400).json({ 
        error: `Batch size exceeds limit of ${maxBatch}. Please make multiple requests.` 
      });
    }

    const translations = await translationService.translateBatch(puzzles, targetLanguage);

    res.json({ translations });
  } catch (error) {
    console.error('Batch translation error:', error);
    res.status(500).json({ error: 'Batch translation failed', details: error.message });
  }
});

/**
 * POST /api/translate/feedback
 * Translate grader feedback
 */
router.post('/feedback', async (req, res) => {
  try {
    const { feedback, targetLanguage } = req.body;

    if (!targetLanguage || targetLanguage === 'English') {
      return res.json({ translatedFeedback: feedback });
    }

    if (!feedback) {
      return res.status(400).json({ error: 'Missing required field: feedback' });
    }

    const translatedFeedback = await translationService.translateFeedback(feedback, targetLanguage);

    res.json({ translatedFeedback });
  } catch (error) {
    console.error('Feedback translation error:', error);
    res.status(500).json({ error: 'Feedback translation failed', details: error.message });
  }
});

/**
 * POST /api/translate/cognitive
 * Translate cognitive training scenario
 */
router.post('/cognitive', async (req, res) => {
  try {
    const { scenario, targetLanguage } = req.body;

    if (!targetLanguage || targetLanguage === 'English') {
      return res.json(scenario);
    }

    if (!scenario || !scenario.type) {
      return res.status(400).json({ error: 'Missing required field: scenario with type' });
    }

    const translated = await translationService.translateCognitiveScenario(scenario, targetLanguage);

    res.json(translated);
  } catch (error) {
    console.error('Cognitive translation error:', error);
    res.status(500).json({ error: 'Cognitive translation failed', details: error.message });
  }
});

module.exports = router;
