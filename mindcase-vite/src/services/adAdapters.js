/**
 * Ad Adapters
 * Interface and Implementations for different Ad Networks
 */

class AdAdapter {
    constructor(config = {}) {
        this.config = config;
        this.name = 'GenericAdapter';
    }

    async init() {
        throw new Error('init() must be implemented');
    }

    async isAvailable() {
        return false;
    }

    async showRewardedAd() {
        throw new Error('showRewardedAd() must be implemented');
    }
}

/**
 * Test Adapter (Simulator)
 */
class TestAdAdapter extends AdAdapter {
    constructor(config) {
        super(config);
        this.name = 'TestAdapter';
    }

    async init() {
        console.log('[TestAdAdapter] Initialized');
        return true;
    }

    async isAvailable() {
        return true;
    }

    async showRewardedAd() {
        console.log('[TestAdAdapter] Showing Ad Overlay...');
        
        return new Promise((resolve) => {
            // Simulate 3s ad
            setTimeout(() => {
                const userSkipped = Math.random() > 0.9;
                if (userSkipped) {
                    console.log('[TestAdAdapter] User skipped ad');
                    resolve({ success: false, reason: 'skipped' });
                } else {
                    console.log('[TestAdAdapter] Ad completed');
                    resolve({ 
                        success: true, 
                        rewardId: `test_tx_${Date.now()}`,
                        signature: 'mock_signature'
                    });
                }
            }, 3000);
        });
    }
}

/**
 * AdMob Web Adapter (Mock implementation for web)
 * In a real scenario, this would wrap the Google IMA SDK or AdSense for Games
 */
class AdMobWebAdapter extends AdAdapter {
    constructor(config) {
        super(config);
        this.name = 'AdMobWeb';
    }

    async init() {
        // Load IMA SDK script if not present
        console.log('[AdMob] Initializing SDK...');
        return true;
    }

    async isAvailable() {
        // Check if ads are loaded
        return true; 
    }

    async showRewardedAd() {
        // Trigger AFG / IMA ad display
        return new Promise((resolve) => {
             // Mocking the flow
             setTimeout(() => {
                 resolve({
                     success: true,
                     rewardId: `admob_tx_${Date.now()}`,
                     signature: 'valid_signature_from_admob'
                 });
             }, 5000);
        });
    }
}

window.AdAdapters = {
    TestAdAdapter,
    AdMobWebAdapter
};

export { TestAdAdapter, AdMobWebAdapter };
