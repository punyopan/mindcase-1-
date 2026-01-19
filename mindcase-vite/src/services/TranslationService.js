/**
 * Translation Service
 * Handles loading locales, managing selected language, and translating keys.
 * Implements Singleton pattern with localStorage persistence.
 */
const STORAGE_KEY = 'mindcase_language_preference';

class _TranslationService {
  constructor() {
    if (_TranslationService.instance) {
      return _TranslationService.instance;
    }

    this.currentLang = 'English';
    this.fallbackLang = 'English';
    this.translations = {};
    this.subscribers = [];
    
    // Default supported languages
    this.supportedLanguages = [
      'English', 'Spanish', 'French', 'German', 
      'Chinese', 'Japanese', 'Korean', 'Portuguese'
    ];

    // Load saved preference
    this._loadSavedLanguage();

    _TranslationService.instance = this;
  }

  /**
   * Load saved language preference from localStorage
   */
  _loadSavedLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && this.supportedLanguages.includes(saved)) {
        this.currentLang = saved;
      }
    } catch (e) {
      // localStorage not available
    }
  }

  /**
   * Save language preference to localStorage
   */
  _saveLanguagePreference() {
    try {
      localStorage.setItem(STORAGE_KEY, this.currentLang);
    } catch (e) {
      // localStorage not available
    }
  }

  /**
   * Initialize with language data
   * @param {Object} initialData - Object containing locale data { English: {...}, Spanish: {...} }
   * @param {string} defaultLang - Default language to start with (only if no saved pref)
   */
  init(initialData = {}, defaultLang = 'English') {
    this.translations = initialData;
    this.supportedLanguages = Object.keys(initialData);
    
    // Check if saved language is still valid
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && this.supportedLanguages.includes(saved)) {
      this.currentLang = saved;
    } else {
      this.currentLang = defaultLang;
    }
  }

  /**
   * Subscribe to language changes
   * @param {Function} callback 
   * @returns {Function} unsubscribe function
   */
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all subscribers of a change
   */
  notifySubscribers() {
    this.subscribers.forEach(cb => cb(this.currentLang));
  }

  /**
   * Set the current language (with persistence)
   * @param {string} lang 
   */
  setLanguage(lang) {
    if (this.supportedLanguages.includes(lang)) {
      this.currentLang = lang;
      this._saveLanguagePreference();
      this.notifySubscribers();
      return true;
    }
    console.warn(`Language ${lang} not supported`);
    return false;
  }

  /**
   * Get current language
   */
  getLanguage() {
    return this.currentLang;
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  /**
   * Translate a key
   * @param {string} key - Dot notation key (e.g., 'menu.title')
   * @param {Object} params - Interpolation parameters
   */
  t(key, params = {}) {
    const keys = key.split('.');
    
    // Try current language
    let value = this.getValue(this.currentLang, keys);
    
    // Fallback to English if missing
    if (!value) {
      value = this.getValue(this.fallbackLang, keys);
    }
    
    // Return default value or key if still missing
    if (!value) {
      if (params && params.defaultValue) {
        return params.defaultValue;
      }
      return key;
    }
    
    // Interpolate parameters
    return this.interpolate(value, params);
  }

  /**
   * Helper to traverse object by keys
   */
  getValue(lang, keys) {
    let current = this.translations[lang];
    if (!current) return null;

    for (const k of keys) {
      if (current[k] === undefined) {
        return null;
      }
      current = current[k];
    }
    return current;
  }

  /**
   * Helper to interpolate string with params
   * e.g., "Hello {name}" -> "Hello World"
   */
  interpolate(str, params) {
    if (typeof str !== 'string') return str;
    
    return str.replace(/{(\w+)}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  /**
   * Check if a key exists
   */
  hasKey(key) {
    const keys = key.split('.');
    return this.getValue(this.currentLang, keys) !== null || 
           this.getValue(this.fallbackLang, keys) !== null;
  }
}

// Create and export singleton instance
const TranslationService = new _TranslationService();

// Expose to window for non-module legacy code (like CognitiveGameEngine)
if (typeof window !== 'undefined') {
  window.TranslationService = TranslationService;
}

export default TranslationService;

