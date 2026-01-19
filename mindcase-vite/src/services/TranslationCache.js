/**
 * Translation Cache Service
 * 
 * Manages IndexedDB storage for translated puzzle content.
 * Provides persistent caching with 30-day TTL to minimize API calls.
 */

const DB_NAME = 'mindcase_translations';
const DB_VERSION = 1;
const STORE_NAME = 'puzzle_translations';
const CACHE_TTL_DAYS = 30;

class TranslationCacheClass {
  constructor() {
    this.db = null;
    this.isInitialized = false;
    this.initPromise = null;
  }

  /**
   * Initialize IndexedDB connection
   * @returns {Promise<IDBDatabase>}
   */
  async init() {
    if (this.isInitialized && this.db) {
      return this.db;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported, falling back to memory cache');
        this.fallbackCache = new Map();
        this.isInitialized = true;
        resolve(null);
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        this.fallbackCache = new Map();
        this.isInitialized = true;
        resolve(null);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'cacheKey' });
          store.createIndex('puzzleId', 'puzzleId', { unique: false });
          store.createIndex('language', 'language', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  /**
   * Generate cache key from puzzle ID and language
   */
  _getCacheKey(puzzleId, language) {
    return `${puzzleId}_${language.toLowerCase()}`;
  }

  /**
   * Check if cache entry is expired
   */
  _isExpired(timestamp) {
    const now = Date.now();
    const ttlMs = CACHE_TTL_DAYS * 24 * 60 * 60 * 1000;
    return (now - timestamp) > ttlMs;
  }

  /**
   * Get translated puzzle from cache
   * @param {number} puzzleId 
   * @param {string} language 
   * @returns {Promise<object|null>}
   */
  async get(puzzleId, language) {
    await this.init();

    const cacheKey = this._getCacheKey(puzzleId, language);

    // Fallback to memory cache
    if (!this.db) {
      const cached = this.fallbackCache?.get(cacheKey);
      if (cached && !this._isExpired(cached.timestamp)) {
        return cached;
      }
      return null;
    }

    return new Promise((resolve) => {
      try {
        const transaction = this.db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(cacheKey);

        request.onsuccess = () => {
          const result = request.result;
          if (result && !this._isExpired(result.timestamp)) {
            resolve(result);
          } else {
            // Delete expired entry
            if (result) {
              this.delete(puzzleId, language);
            }
            resolve(null);
          }
        };

        request.onerror = () => {
          console.error('Cache get error:', request.error);
          resolve(null);
        };
      } catch (e) {
        console.error('Cache get exception:', e);
        resolve(null);
      }
    });
  }

  /**
   * Store translated puzzle in cache
   * @param {number} puzzleId 
   * @param {string} language 
   * @param {object} translatedPuzzle - { question, idealAnswer, keyPrinciples, title }
   * @returns {Promise<boolean>}
   */
  async set(puzzleId, language, translatedPuzzle) {
    await this.init();

    const cacheKey = this._getCacheKey(puzzleId, language);
    const entry = {
      cacheKey,
      puzzleId,
      language: language.toLowerCase(),
      timestamp: Date.now(),
      ...translatedPuzzle
    };

    // Fallback to memory cache
    if (!this.db) {
      this.fallbackCache?.set(cacheKey, entry);
      return true;
    }

    return new Promise((resolve) => {
      try {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(entry);

        request.onsuccess = () => resolve(true);
        request.onerror = () => {
          console.error('Cache set error:', request.error);
          resolve(false);
        };
      } catch (e) {
        console.error('Cache set exception:', e);
        resolve(false);
      }
    });
  }

  /**
   * Delete cache entry
   */
  async delete(puzzleId, language) {
    await this.init();

    const cacheKey = this._getCacheKey(puzzleId, language);

    if (!this.db) {
      this.fallbackCache?.delete(cacheKey);
      return true;
    }

    return new Promise((resolve) => {
      try {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(cacheKey);

        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  /**
   * Get all cached translations for a language
   * @param {string} language 
   * @returns {Promise<object[]>}
   */
  async getAllForLanguage(language) {
    await this.init();

    if (!this.db) {
      const results = [];
      this.fallbackCache?.forEach((value, key) => {
        if (value.language === language.toLowerCase()) {
          results.push(value);
        }
      });
      return results;
    }

    return new Promise((resolve) => {
      try {
        const transaction = this.db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('language');
        const request = index.getAll(language.toLowerCase());

        request.onsuccess = () => {
          const results = request.result.filter(r => !this._isExpired(r.timestamp));
          resolve(results);
        };

        request.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  }

  /**
   * Clear all translations for a language
   */
  async clearLanguage(language) {
    await this.init();

    const translations = await this.getAllForLanguage(language);
    for (const t of translations) {
      await this.delete(t.puzzleId, language);
    }
    return true;
  }

  /**
   * Clear all expired entries
   */
  async clearExpired() {
    await this.init();

    if (!this.db) {
      this.fallbackCache?.forEach((value, key) => {
        if (this._isExpired(value.timestamp)) {
          this.fallbackCache.delete(key);
        }
      });
      return;
    }

    return new Promise((resolve) => {
      try {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.openCursor();

        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            if (this._isExpired(cursor.value.timestamp)) {
              cursor.delete();
            }
            cursor.continue();
          } else {
            resolve(true);
          }
        };

        request.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  /**
   * Get cache statistics
   */
  async getStats() {
    await this.init();

    if (!this.db) {
      return {
        totalEntries: this.fallbackCache?.size || 0,
        languages: [],
        usingFallback: true
      };
    }

    return new Promise((resolve) => {
      try {
        const transaction = this.db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          const entries = request.result;
          const languages = [...new Set(entries.map(e => e.language))];
          resolve({
            totalEntries: entries.length,
            languages,
            usingFallback: false
          });
        };

        request.onerror = () => resolve({ totalEntries: 0, languages: [], usingFallback: false });
      } catch (e) {
        resolve({ totalEntries: 0, languages: [], usingFallback: false });
      }
    });
  }
}

// Singleton instance
const TranslationCache = new TranslationCacheClass();

export { TranslationCache };
export default TranslationCache;
