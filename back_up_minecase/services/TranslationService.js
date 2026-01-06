/**
 * Translation Service
 * Handles loading locales, managing selected language, and translating keys.
 * Implements Singleton pattern.
 */
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

    _TranslationService.instance = this;
  }

  /**
   * Initialize with language data
   * @param {Object} initialData - Object containing locale data { English: {...}, Spanish: {...} }
   * @param {string} defaultLang - Default language to start with
   */
  init(initialData = {}, defaultLang = 'English') {
    this.translations = initialData;
    this.currentLang = defaultLang;
    // Update supported languages based on initialization data
    this.supportedLanguages = Object.keys(initialData);
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
   * Set the current language
   * @param {string} lang 
   */
  setLanguage(lang) {
    if (this.supportedLanguages.includes(lang)) {
      this.currentLang = lang;
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
    
    // Return key if still missing
    if (!value) {
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
}

// Create and export singleton instance
const TranslationService = new _TranslationService();
export default TranslationService;
