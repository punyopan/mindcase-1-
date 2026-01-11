/**
 * Content Translator Service
 * 
 * Frontend orchestrator for translating puzzle content on-demand.
 * Uses TranslationCache for persistence and backend API for translation.
 */

import TranslationCache from './TranslationCache.js';
import TranslationService from './TranslationService.js';

// Get API URL from global config (loaded in config.js)
const getApiUrl = () => window.AppConfig?.API_URL || 'http://localhost:3000/api';

class ContentTranslatorClass {
  constructor() {
    this.pendingTranslations = new Map(); // Prevent duplicate requests
    this.isInitialized = false;
  }

  /**
   * Initialize the translator
   */
  async init() {
    if (this.isInitialized) return;
    await TranslationCache.init();
    this.isInitialized = true;
  }

  /**
   * Get translated puzzle content
   * Returns cached version if available, otherwise fetches from API
   * 
   * @param {object} puzzle - Original puzzle object
   * @param {string} language - Target language (e.g., 'Spanish', 'Chinese')
   * @returns {Promise<object>} - Translated puzzle with same structure
   */
  async getTranslatedPuzzle(puzzle, language) {
    await this.init();

    // No translation needed for English
    if (language === 'English' || !language) {
      return puzzle;
    }

    const puzzleId = puzzle.id;

    // Check cache first
    const cached = await TranslationCache.get(puzzleId, language);
    if (cached) {
      return this._mergePuzzle(puzzle, cached);
    }

    // Check if translation is already in progress
    const pendingKey = `${puzzleId}_${language}`;
    if (this.pendingTranslations.has(pendingKey)) {
      return this.pendingTranslations.get(pendingKey);
    }

    // Fetch translation from API
    const translationPromise = this._fetchTranslation(puzzle, language);
    this.pendingTranslations.set(pendingKey, translationPromise);

    try {
      const translated = await translationPromise;
      this.pendingTranslations.delete(pendingKey);
      return translated;
    } catch (error) {
      this.pendingTranslations.delete(pendingKey);
      console.error('Translation failed, returning original:', error);
      return puzzle; // Fallback to English
    }
  }

  /**
   * Fetch translation from backend API
   */
  async _fetchTranslation(puzzle, language) {
    const response = await fetch(`${getApiUrl()}/translate/puzzle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        puzzleId: puzzle.id,
        title: puzzle.title,
        question: puzzle.question,
        idealAnswer: puzzle.idealAnswer,
        keyPrinciples: puzzle.keyPrinciples,
        targetLanguage: language
      })
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();

    // Cache the translation ONLY if it's not a fallback
    if (!data._isFallback) {
      await TranslationCache.set(puzzle.id, language, {
        title: data.title,
        question: data.question,
        idealAnswer: data.idealAnswer,
        keyPrinciples: data.keyPrinciples
      });
    } else {
      console.warn(`[ContentTranslator] Received fallback for puzzle ${puzzle.id}, NOT caching.`);
    }

    return this._mergePuzzle(puzzle, data);
  }

  /**
   * Merge translated content with original puzzle structure
   */
  _mergePuzzle(original, translated) {
    return {
      ...original,
      title: translated.title || original.title,
      question: translated.question || original.question,
      idealAnswer: translated.idealAnswer || original.idealAnswer,
      keyPrinciples: translated.keyPrinciples || original.keyPrinciples,
      _translated: true,
      _originalLanguage: 'English'
    };
  }

  /**
   * Batch translate multiple puzzles (for pre-caching)
   * @param {object[]} puzzles - Array of puzzle objects
   * @param {string} language - Target language
   * @param {function} onProgress - Callback for progress updates
   * @returns {Promise<object[]>} - Translated puzzles
   */
  async batchTranslate(puzzles, language, onProgress = null) {
    await this.init();

    if (language === 'English') {
      return puzzles;
    }

    const results = [];
    const toTranslate = [];

    // Check cache for each puzzle
    for (const puzzle of puzzles) {
      const cached = await TranslationCache.get(puzzle.id, language);
      if (cached) {
        results.push({ puzzle, translated: this._mergePuzzle(puzzle, cached), fromCache: true });
      } else {
        toTranslate.push(puzzle);
      }
    }

    // Batch translate uncached puzzles
    if (toTranslate.length > 0) {
      try {
        const response = await fetch(`${getApiUrl()}/translate/batch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            puzzles: toTranslate.map(p => ({
              puzzleId: p.id,
              title: p.title,
              question: p.question,
              idealAnswer: p.idealAnswer,
              keyPrinciples: p.keyPrinciples
            })),
            targetLanguage: language
          })
        });

        if (response.ok) {
          const data = await response.json();
          
          for (let i = 0; i < toTranslate.length; i++) {
            const original = toTranslate[i];
            const translated = data.translations[i];

            // Cache each translation ONLY if it's not a fallback
            if (!translated._isFallback) {
              await TranslationCache.set(original.id, language, {
                title: translated.title,
                question: translated.question,
                idealAnswer: translated.idealAnswer,
                keyPrinciples: translated.keyPrinciples
              });
            }

            results.push({
              puzzle: original,
              translated: this._mergePuzzle(original, translated),
              fromCache: false
            });

            if (onProgress) {
              onProgress(results.length, puzzles.length);
            }
          }
        }
      } catch (error) {
        console.error('Batch translation failed:', error);
        // Return originals for failed translations
        for (const puzzle of toTranslate) {
          results.push({ puzzle, translated: puzzle, fromCache: false, failed: true });
        }
      }
    }

    return results.map(r => r.translated);
  }

  /**
   * Pre-cache translations for a topic when user changes language
   * @param {object} topic - Topic object containing puzzles
   * @param {string} language - Target language
   */
  async preCacheTopic(topic, language) {
    if (!topic.puzzles || language === 'English') {
      return;
    }

    // Run in background, don't block
    this.batchTranslate(topic.puzzles, language).catch(err => {
      console.warn('Background pre-caching failed:', err);
    });
  }

  /**
   * Translate grader feedback
   * @param {object} feedback - Grader feedback object
   * @param {string} language - Target language
   * @returns {Promise<object>} - Translated feedback
   */
  async translateFeedback(feedback, language) {
    if (language === 'English' || !language) {
      return feedback;
    }

    try {
      const response = await fetch(`${getApiUrl()}/translate/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          feedback,
          targetLanguage: language
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.translatedFeedback;
      }
    } catch (error) {
      console.error('Feedback translation failed:', error);
    }

    return feedback; // Fallback to original
  }

  /**
   * Get current language from TranslationService
   */
  getCurrentLanguage() {
    return TranslationService.getLanguage();
  }

  /**
   * Clear cache for a specific language
   */
  async clearLanguageCache(language) {
    return TranslationCache.clearLanguage(language);
  }

  /**
   * Get cache statistics
   */
  async getCacheStats() {
    return TranslationCache.getStats();
  }
}

// Singleton instance
const ContentTranslator = new ContentTranslatorClass();

export { ContentTranslator };
export default ContentTranslator;
