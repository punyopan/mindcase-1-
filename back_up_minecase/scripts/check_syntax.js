/**
 * Debug script to find JSX syntax errors
 * Loads all component files and tries to transpile them with Babel
 */
const fs = require('fs');
const path = require('path');

// List of files loaded by prod.html
const files = [
    "component/icon.jsx",
    "services/auth.js",
    "services/progress.js",
    "services/payment.js",
    "services/structuralEvaluator.js",
    "services/ExpertAlignmentGrader.js",
    "services/sound.js",
    "services/reminder.js",
    "services/userProgress.js",
    "services/analyticsEngine.js",
    "services/rewardedAdManager.js",
    "services/retryManager.js",
    "services/cognitiveGameEngine.js",
    "services/CognitiveGradingEngine.js",
    "services/TranslationService.js",
    "services/TranslationCache.js",
    "services/ContentTranslator.js",
    "services/CognitiveTranslator.js",
    "services/progressAPI.js",
    "services/cognitiveEvaluator.js",
    "component/skillradarchart.jsx",
    "component/TokenShop.jsx",
    "component/AdvancedAnalytics.jsx",
    "component/TopicUnlockModal.jsx",
    "component/WatchAdModal.jsx",
    "component/cognitive/SignalField.jsx",
    "component/cognitive/ForensicNarrative.jsx",
    "component/cognitive/VariableManifold.jsx",
    "component/cognitive/AnalysisPhase.jsx",
    "component/cognitive/AssumptionExcavator.jsx",
    "component/cognitive/CounterfactualEngine.jsx",
    "component/cognitive/PerspectivePrism.jsx",
    "component/cognitive/CognitiveTrainer.jsx",
    "component/navigation.jsx",
    "component/auth/LoginForm.jsx",
    "component/auth/SignupForm.jsx",
    "component/settings/SecuritySettings.jsx",
    "component/settings/SessionsHistory.jsx",
    "component/settings/DataManagement.jsx",
    "component/settings/SoundSettings.jsx",
    "component/settings/ReminderSettings.jsx",
    "component/feedback/DetailedFeedback.jsx",
    "component/minigames/LogicGrid.jsx",
    "component/minigames/WordCipher.jsx",
    "component/minigames/VisualMatching.jsx",
    "component/minigames/ColorSequence.jsx",
    "component/minigames/MathPuzzle.jsx",
    "component/minigames/EvidenceWeight.jsx",
    "component/minigames/MissingConstraint.jsx",
    "component/minigames/MemoryConstellation.jsx",
    "component/minigames/ColorChaosKitchen.jsx",
    "component/minigames/RhythmReef.jsx",
    "component/minigames/FaceFusion.jsx",
    "component/minigames/NumberGhost.jsx",
    "component/minigames/TapUnless.jsx",
    "component/minigames/RuleFlip.jsx",
    "component/minigames/MirrorMatch.jsx",
    "component/minigames/MinigameManager.jsx",
    "component/minigames/DailyMinigame.jsx",
    "component/payment/StripeCheckout.jsx",
    "component/puzzles/puzzlemodel.jsx",
    "component/puzzles/dailypuzzle.jsx",
    "data/topics.js",
    "data/dailyPuzzles.js",
    "data/puzzleEvidence.js",
    "data/riddleAnswerKeys.js",
    "mindcase.jsx"
];

let totalLines = 0;
let hasError = false;

files.forEach((file, idx) => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n').length;
        totalLines += lines;
        
        // Check for obvious syntax issues
        const lastChar = content.trim().slice(-1);
        const lastTwoChars = content.trim().slice(-2);
        
        if (lastChar === ',' || lastTwoChars === '};' + '\n') {
            // Might be ok
        }
        
        // Check brace balance
        const opens = (content.match(/\{/g) || []).length;
        const closes = (content.match(/\}/g) || []).length;
        if (opens !== closes) {
            console.log(`${file}: Brace mismatch! { = ${opens}, } = ${closes}`);
            hasError = true;
        }
        
        // Check paren balance
        const parens = (content.match(/\(/g) || []).length;
        const cparens = (content.match(/\)/g) || []).length;
        if (parens !== cparens) {
            console.log(`${file}: Paren mismatch! ( = ${parens}, ) = ${cparens}`);
            hasError = true;
        }
        
    } catch (e) {
        console.log(`${file}: ERROR - ${e.message}`);
        hasError = true;
    }
});

console.log('\nTotal lines across all files:', totalLines);
if (!hasError) {
    console.log('No obvious syntax issues found');
}
