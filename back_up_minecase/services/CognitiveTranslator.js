/**
 * Cognitive Translator Service
 * 
 * Frontend orchestrator for translating cognitive training scenarios on-demand.
 * Uses TranslationCache for persistence and backend API for translation.
 */

import TranslationCache from './TranslationCache.js';
import TranslationService from './TranslationService.js';

// Use getApiUrl from ContentTranslator (already loaded in bundle)
// If not available, fallback to default
const getCognitiveApiUrl = () => window.AppConfig?.API_URL || 'http://localhost:3000/api';

class CognitiveTranslatorClass {
  constructor() {
    this.pendingTranslations = new Map();
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    await TranslationCache.init();
    this.isInitialized = true;
  }

  /**
   * Get translated cognitive scenario
   * @param {object} scenario - Original scenario object from CognitiveGameEngine
   * @param {string} language - Target language
   * @returns {Promise<object>} - Translated scenario
   */
  async getTranslatedScenario(scenario, language) {
    await this.init();

    // No translation needed for English
    if (language === 'English' || !language) {
      return scenario;
    }

    const scenarioType = scenario.type || 'unknown';
    const cacheKey = `cognitive_${scenarioType}_${this._hashScenario(scenario)}`;

    // Check cache first
    const cached = await TranslationCache.get(cacheKey, language);
    if (cached) {
      return this._mergeScenario(scenario, cached);
    }

    // Check if translation is already in progress
    const pendingKey = `${cacheKey}_${language}`;
    if (this.pendingTranslations.has(pendingKey)) {
      return this.pendingTranslations.get(pendingKey);
    }

    // Fetch translation from API
    const translationPromise = this._fetchTranslation(scenario, language, cacheKey);
    this.pendingTranslations.set(pendingKey, translationPromise);

    try {
      const translated = await translationPromise;
      this.pendingTranslations.delete(pendingKey);
      return translated;
    } catch (error) {
      this.pendingTranslations.delete(pendingKey);
      console.error('Cognitive translation failed, returning original:', error);
      return scenario;
    }
  }

  /**
   * Create simple hash of scenario for cache key
   */
  _hashScenario(scenario) {
    const str = JSON.stringify({
      title: scenario.title,
      briefing: scenario.briefing?.substring(0, 50)
    });
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Fetch translation from backend API
   */
  async _fetchTranslation(scenario, language, cacheKey) {
    const response = await fetch(`${getCognitiveApiUrl()}/translate/cognitive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        scenario,
        targetLanguage: language
      })
    });

    if (!response.ok) {
      throw new Error(`Cognitive translation API error: ${response.status}`);
    }

    const translated = await response.json();

    // Cache the translation if not a fallback
    if (!translated._isFallback) {
      await TranslationCache.set(cacheKey, language, translated);
    }

    return this._mergeScenario(scenario, translated);
  }

  /**
   * Merge translated content with original scenario structure
   */
  _mergeScenario(original, translated) {
    return {
      ...original,
      title: translated.title || original.title,
      briefing: translated.briefing || original.briefing,
      correctInsight: translated.correctInsight || original.correctInsight,
      claim: translated.claim || original.claim,
      outcome: translated.outcome || original.outcome,
      context: translated.context || original.context,
      evidence: translated.evidence || original.evidence,
      stakeholders: translated.stakeholders || original.stakeholders,
      _translated: true,
      _originalLanguage: 'English'
    };
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    return TranslationService.getLanguage();
  }
}

// Singleton
const CognitiveTranslator = new CognitiveTranslatorClass();
export { CognitiveTranslator };
export default CognitiveTranslator;
