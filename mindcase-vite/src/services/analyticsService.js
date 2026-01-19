/**
 * Analytics Service
 * Centralized event tracking for MineCase
 * Integrates with Firebase/GA4 (Mocked for now)
 */

class AnalyticsService {
    constructor() {
        this.queue = [];
        this.initialized = false;
        this.debugMode = true; // Set to false in production
    }

    init(config = {}) {
        if (this.initialized) return;
        
        console.log('[Analytics] Initializing...');
        // Initialize Firebase/GA4 here
        // firebase.analytics();
        
        this.initialized = true;
        this.processQueue();
    }

    logEvent(eventName, params = {}) {
        const event = {
            name: eventName,
            params: {
                timestamp: Date.now(),
                ...params
            }
        };

        if (this.debugMode) {
            console.log(`[Analytics] 📊 ${eventName}`, params);
        }

        if (!this.initialized) {
            this.queue.push(event);
            return;
        }

        // Send to provider
        this.sendToProvider(event);
    }

    sendToProvider(event) {
        // Mock sending to GA4/Firebase
        // firebase.analytics().logEvent(event.name, event.params);
    }

    processQueue() {
        while (this.queue.length > 0) {
            const event = this.queue.shift();
            this.sendToProvider(event);
        }
    }
}

// Singleton instance
const analyticsService = new AnalyticsService();
window.AnalyticsService = analyticsService;

export default analyticsService;
