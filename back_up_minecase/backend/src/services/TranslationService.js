/**
 * Translation Service (Backend)
 * 
 * Handles AI-powered translation of puzzle content and grader feedback.
 * Uses PostgreSQL for server-side caching (shared across all users).
 * Falls back to in-memory cache if DB unavailable.
 */

const db = require('../db');

const TRANSLATION_PROMPT = `You are a professional translator. Translate the following content from English to {targetLanguage}.

IMPORTANT RULES:
1. Maintain the exact meaning and nuance
2. Keep the same tone (educational, puzzle-like)
3. Preserve any technical terms that are better kept in English
4. For JSON arrays, translate each string while keeping the array structure
5. Return ONLY valid JSON with the translated fields

Content to translate:
{content}

Return as JSON:
{
  "title": "translated title",
  "question": "translated question",
  "idealAnswer": "translated ideal answer",
  "keyPrinciples": ["translated principle 1", "translated principle 2", ...]
}`;

const FEEDBACK_PROMPT = `Translate the following grading feedback from English to {targetLanguage}.
Keep the same tone (constructive, educational). Preserve any technical terms if needed.

Feedback:
{feedback}

Return the translated feedback as plain text.`;

class TranslationService {
  constructor() {
    this.memoryCache = new Map(); // Fallback for feedback (not stored in DB)
  }

  /**
   * Get AI provider configuration
   */
  _getAIConfig() {
    if (process.env.GEMINI_API_KEY) {
      return {
        provider: 'gemini',
        apiKey: process.env.GEMINI_API_KEY,
        model: 'gemini-2.5-flash-lite'
      };
    }
    if (process.env.OPENAI_API_KEY) {
      return {
        provider: 'openai',
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-3.5-turbo'
      };
    }
    throw new Error('No AI provider configured. Set GEMINI_API_KEY or OPENAI_API_KEY');
  }

  /**
   * Call AI API for translation
   */
  async _callAI(prompt) {
    const config = this._getAIConfig();
    
    // Strict Rate Limiting for Free Tier
    // Free tier = 15 RPM = 1 request every 4 seconds
    // We enforce 4.5s delay between calls to be safe
    const MIN_INTERVAL = 4500; 
    const now = Date.now();
    const timeSinceLastCall = now - (this.lastCallTime || 0);
    
    if (timeSinceLastCall < MIN_INTERVAL) {
      const waitTime = MIN_INTERVAL - timeSinceLastCall;
      console.log(`[Translation] Rate limit: Waiting ${Math.round(waitTime)}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastCallTime = Date.now();

    try {
      return config.provider === 'gemini' 
        ? await this._callGemini(prompt, config) 
        : await this._callOpenAI(prompt, config);
    } catch (error) {
       // Auto-Retry Logic for 429 (Rate Limit)
       if (error.message.includes('429')) {
         console.warn('[Translation] Hit 429 Rate Limit. Retrying in 10s...');
         await new Promise(resolve => setTimeout(resolve, 10000));
         this.lastCallTime = Date.now(); // Reset timer
         return config.provider === 'gemini' 
          ? await this._callGemini(prompt, config) 
          : await this._callOpenAI(prompt, config);
       }
       throw error;
    }
  }

  async _callGemini(prompt, config) {
    // Use v1 endpoint for stable API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;
    
    console.log('[Translation] Calling Gemini API...');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 4096 }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Throw specific error for 429 so _callAI catches it
      if (response.status === 429) {
          throw new Error(`Gemini API error: 429 - Quota Exceeded`);
      }
      console.error('[Translation] Gemini error response:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  async _callOpenAI(prompt, config) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 4096
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  /**
   * Check database cache for existing translation
   */
  async _getFromCache(puzzleId, language) {
    try {
      const result = await db.query(
        `SELECT title, question, ideal_answer, key_principles 
         FROM t_translation_cache 
         WHERE puzzle_id = $1 AND language = $2`,
        [puzzleId, language.toLowerCase()]
      );
      
      if (result.rows.length > 0) {
        const row = result.rows[0];
        return {
          title: row.title,
          question: row.question,
          idealAnswer: row.ideal_answer,
          keyPrinciples: row.key_principles
        };
      }
    } catch (err) {
      console.warn('DB cache read failed:', err.message);
    }
    return null;
  }

  /**
   * Store translation in database cache
   */
  async _saveToCache(puzzleId, language, translated) {
    try {
      await db.query(
        `INSERT INTO t_translation_cache (puzzle_id, language, title, question, ideal_answer, key_principles)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (puzzle_id, language) 
         DO UPDATE SET title = $3, question = $4, ideal_answer = $5, key_principles = $6, updated_at = CURRENT_TIMESTAMP`,
        [
          puzzleId,
          language.toLowerCase(),
          translated.title,
          translated.question,
          translated.idealAnswer,
          JSON.stringify(translated.keyPrinciples)
        ]
      );
    } catch (err) {
      console.warn('DB cache write failed:', err.message);
    }
  }

  /**
   * Translate a single puzzle (with DB cache)
   */
  async translatePuzzle(puzzle, targetLanguage) {
    // Check DB cache first (shared across ALL users)
    const cached = await this._getFromCache(puzzle.puzzleId, targetLanguage);
    if (cached) {
      // Self-healing: If cached question matches original English question, it's a bad cache (fallback was stored).
      // Ignore it and re-translate.
      const isIdentical = cached.question.trim() === puzzle.question.trim();
      if (isIdentical && targetLanguage !== 'English') {
        console.warn(`[Translation] Detected bad cache (English content) for puzzle ${puzzle.puzzleId}. Re-translating...`);
      } else {
        console.log(`[Translation] Cache HIT: puzzle ${puzzle.puzzleId} in ${targetLanguage}`);
        return cached;
      }
    }

    console.log(`[Translation] Cache MISS: translating puzzle ${puzzle.puzzleId} to ${targetLanguage}`);

    const content = JSON.stringify({
      title: puzzle.title,
      question: puzzle.question,
      idealAnswer: puzzle.idealAnswer,
      keyPrinciples: puzzle.keyPrinciples
    }, null, 2);

    const prompt = TRANSLATION_PROMPT
      .replace('{targetLanguage}', targetLanguage)
      .replace('{content}', content);

    try {
      const response = await this._callAI(prompt);
      console.log(`[Translation] AI response received, length: ${response.length}`);
      
      // Parse JSON from response
      let jsonStr = response;
      if (response.includes('```json')) {
        jsonStr = response.split('```json')[1].split('```')[0];
      } else if (response.includes('```')) {
        jsonStr = response.split('```')[1].split('```')[0];
      }

      const translated = JSON.parse(jsonStr.trim());
      console.log(`[Translation] Parsed successfully, saving to cache...`);
      
      // Save to DB cache for all future users
      await this._saveToCache(puzzle.puzzleId, targetLanguage, translated);
      
      return translated;
    } catch (error) {
      console.error('[Translation] FAILED for puzzle:', puzzle.puzzleId);
      console.error('[Translation] Error:', error.message);
      console.error('[Translation] Stack:', error.stack);
      // Return original as fallback
      return {
        title: puzzle.title,
        question: puzzle.question,
        idealAnswer: puzzle.idealAnswer,
        keyPrinciples: puzzle.keyPrinciples,
        _isFallback: true
      };
    }
  }

  /**
   * Batch translate multiple puzzles
   */
  async translateBatch(puzzles, targetLanguage) {
    const results = [];
    for (const puzzle of puzzles) {
      const translated = await this.translatePuzzle(puzzle, targetLanguage);
      results.push(translated);
    }
    return results;
  }

  /**
   * Translate grader feedback (memory cache only - too dynamic for DB)
   */
  async translateFeedback(feedback, targetLanguage) {
    const feedbackStr = typeof feedback === 'string' ? feedback : JSON.stringify(feedback);
    const cacheKey = `fb_${feedbackStr.substring(0, 50)}_${targetLanguage}`;
    
    if (this.memoryCache.has(cacheKey)) {
      return this.memoryCache.get(cacheKey);
    }

    const prompt = FEEDBACK_PROMPT
      .replace('{targetLanguage}', targetLanguage)
      .replace('{feedback}', feedbackStr);

    try {
      const response = await this._callAI(prompt);
      let translated = response.trim();
      
      // Handle JSON feedback
      if (typeof feedback !== 'string') {
        try {
          let jsonStr = response;
          if (response.includes('```')) {
            jsonStr = response.split('```')[1].split('```')[0];
            if (jsonStr.startsWith('json')) jsonStr = jsonStr.slice(4);
          }
          translated = JSON.parse(jsonStr.trim());
        } catch {
          // Keep as string if not valid JSON
        }
      }

      this.memoryCache.set(cacheKey, translated);
      return translated;
    } catch (error) {
      console.error('Feedback translation failed:', error);
      return feedback;
    }
  }

  /**
   * Translate cognitive training scenario
   * @param {object} scenario - Cognitive scenario object
   * @param {string} targetLanguage - Target language
   * @returns {Promise<object>} - Translated scenario
   */
  async translateCognitiveScenario(scenario, targetLanguage) {
    const crypto = require('crypto');
    const scenarioType = scenario.type || 'unknown';
    
    // Create hash of original content for cache key
    const contentToHash = JSON.stringify({
      title: scenario.title,
      briefing: scenario.briefing,
      correctInsight: scenario.correctInsight
    });
    const scenarioHash = crypto.createHash('sha256').update(contentToHash).digest('hex').substring(0, 64);

    // Check DB cache first
    try {
      const cached = await db.query(
        `SELECT title, briefing, correct_insight, evidence_json, variables_json, stakeholders_json, claim, outcome, context
         FROM t_cognitive_translation_cache 
         WHERE scenario_type = $1 AND scenario_hash = $2 AND language = $3`,
        [scenarioType, scenarioHash, targetLanguage.toLowerCase()]
      );
      
      if (cached.rows.length > 0) {
        console.log(`[Translation] Cognitive cache HIT: ${scenarioType} in ${targetLanguage}`);
        const row = cached.rows[0];
        return {
          ...scenario,
          title: row.title || scenario.title,
          briefing: row.briefing || scenario.briefing,
          correctInsight: row.correct_insight || scenario.correctInsight,
          evidence: row.evidence_json || scenario.evidence,
          variables: row.variables_json || scenario.variables,
          stakeholders: row.stakeholders_json || scenario.stakeholders,
          claim: row.claim || scenario.claim,
          outcome: row.outcome || scenario.outcome,
          context: row.context || scenario.context,
          _translated: true
        };
      }
    } catch (err) {
      console.warn('Cognitive cache read failed:', err.message);
    }

    console.log(`[Translation] Cognitive cache MISS: translating ${scenarioType} to ${targetLanguage}`);

    // Build prompt for cognitive scenario translation
    const COGNITIVE_PROMPT = `You are a professional translator. Translate the following cognitive training scenario from English to ${targetLanguage}.

IMPORTANT RULES:
1. Maintain the exact meaning and educational value
2. Keep technical/domain terms that are better in English
3. Translate ALL text fields while preserving structure
4. Return ONLY valid JSON

Scenario content:
${JSON.stringify({
  title: scenario.title,
  briefing: scenario.briefing,
  correctInsight: scenario.correctInsight,
  claim: scenario.claim,
  outcome: scenario.outcome,
  context: scenario.context,
  evidence: scenario.evidence?.slice(0, 5), // Limit for token efficiency
  stakeholders: scenario.stakeholders?.slice(0, 4)
}, null, 2)}

Return as JSON with same structure but translated values.`;

    try {
      const response = await this._callAI(COGNITIVE_PROMPT);
      
      let jsonStr = response;
      if (response.includes('```json')) {
        jsonStr = response.split('```json')[1].split('```')[0];
      } else if (response.includes('```')) {
        jsonStr = response.split('```')[1].split('```')[0];
      }

      const translated = JSON.parse(jsonStr.trim());

      // Save to cache
      try {
        await db.query(
          `INSERT INTO t_cognitive_translation_cache 
           (scenario_type, scenario_hash, language, title, briefing, correct_insight, evidence_json, variables_json, stakeholders_json, claim, outcome, context)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           ON CONFLICT (scenario_type, scenario_hash, language) 
           DO UPDATE SET title = $4, briefing = $5, correct_insight = $6, evidence_json = $7, variables_json = $8, stakeholders_json = $9, claim = $10, outcome = $11, context = $12, updated_at = CURRENT_TIMESTAMP`,
          [
            scenarioType,
            scenarioHash,
            targetLanguage.toLowerCase(),
            translated.title,
            translated.briefing,
            translated.correctInsight,
            JSON.stringify(translated.evidence),
            JSON.stringify(translated.variables),
            JSON.stringify(translated.stakeholders),
            translated.claim,
            translated.outcome,
            translated.context
          ]
        );
      } catch (err) {
        console.warn('Cognitive cache write failed:', err.message);
      }

      return {
        ...scenario,
        ...translated,
        _translated: true
      };
    } catch (error) {
      console.error('[Translation] Cognitive translation failed:', error.message);
      return { ...scenario, _isFallback: true };
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats() {
    try {
      const result = await db.query(
        `SELECT language, COUNT(*) as count FROM t_translation_cache GROUP BY language`
      );
      return {
        byLanguage: result.rows,
        memoryCache: this.memoryCache.size
      };
    } catch {
      return { byLanguage: [], memoryCache: this.memoryCache.size };
    }
  }
}

module.exports = new TranslationService();
