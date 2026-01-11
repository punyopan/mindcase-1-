
import React, { useState, useMemo, useEffect } from 'react';
import { topics } from './data/topics';
import { dailyPuzzles } from './data/dailyPuzzles';
import { puzzleEvidence } from './data/puzzleEvidence';
import { AuthService } from './services/auth';
import { ProgressService } from './services/progress';
import { PaymentService } from './services/payment';
import { StructuralEvaluator } from './services/structuralEvaluator';
import { SoundService } from './services/sound';
import { ExpertAlignmentGrader } from './services/ExpertAlignmentGrader';
import { ReminderService } from './services/reminder';
import SkillRadarChart from './component/skillradarchart';
import NavigationBar from './component/navigation';
import PuzzleModal from './component/puzzles/puzzlemodel';
import DailyPuzzleModal from './component/puzzles/dailypuzzle';
import LoginForm from './component/auth/LoginForm';
import SignupForm from './component/auth/SignupForm';
import SecuritySettings from './component/settings/SecuritySettings';
import SessionsHistory from './component/settings/SessionsHistory';
import DataManagement from './component/settings/DataManagement';
import SoundSettings from './component/settings/SoundSettings';
import ReminderSettings from './component/settings/ReminderSettings';
import MinigameManager from './component/minigames/MinigameManager';
import DailyMinigame from './component/minigames/DailyMinigame';
import StripeCheckout from './component/payment/StripeCheckout';
import TokenShop from './component/TokenShop';
import AdvancedAnalytics from './component/AdvancedAnalytics';
import TopicUnlockModal from './component/TopicUnlockModal';
import WatchAdModal from './component/WatchAdModal';
import CognitiveTrainer from './component/cognitive/CognitiveTrainer';
import {
  Brain,
  Lock,
  CheckCircle,
  Lightbulb,
  X,
  ChevronRight,
  ChevronLeft,
  Star,
  Trophy,
  User,
  Bell,
  CreditCard,
  Shield,
  LogOut,
  LogIn,
  Settings
} from './component/icon';
import TranslationService from './services/TranslationService';
import ContentTranslator from './services/ContentTranslator';
import enLocale from './locales/en.json';
import esLocale from './locales/es.json';
import zhLocale from './locales/zh.json';

// Initialize translation service with imported locales
TranslationService.init({
  'English': enLocale,
  'Spanish': esLocale,
  'Chinese': zhLocale
}, 'English');

// Make puzzleEvidence globally available for grading system
if (typeof window !== 'undefined') {
  window.puzzleEvidence = puzzleEvidence;
}

const MindCaseApp = () => {
  // Auth state
  const [authView, setAuthView] = useState('checking'); // 'checking', 'login', 'signup', 'authenticated'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Screen and navigation state
  const [screen, setScreen] = useState('menu');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const [showNavBar, setShowNavBar] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionDuration = 300;

  // Puzzle interaction state
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimating, setModalAnimating] = useState(false);

  // Progress state (loaded from ProgressService)
  const [completedPuzzles, setCompletedPuzzles] = useState(new Set());
  const [puzzleScores, setPuzzleScores] = useState({});
  const [totalScore, setTotalScore] = useState(0);

  // Settings and UI state
  const [showSettings, setShowSettings] = useState(false);
  const [settingsView, setSettingsView] = useState('main');
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  // Initialize language from service or default
  const [selectedLanguage, setSelectedLanguage] = useState(TranslationService.getLanguage());
  // Force update trigger for translations
  const [langUpdate, setLangUpdate] = useState(0);

  useEffect(() => {
    // Subscribe to language changes
    const unsubscribe = TranslationService.subscribe((lang) => {
      setSelectedLanguage(lang);
      setLangUpdate(prev => prev + 1); // Force re-render
    });
    return () => unsubscribe();
  }, []);

  const handleLanguageChange = (lang) => {
    TranslationService.setLanguage(lang);
    // Persist to server if user is logged in
    if (user?.id) {
       ProgressService.updateSettings(user.id, { selectedLanguage: lang, reminderEnabled });
    }
  };

  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [lastOpenedPuzzle, setLastOpenedPuzzle] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showRetryPrompt, setShowRetryPrompt] = useState(false);
  const [puzzleStartTime, setPuzzleStartTime] = useState(null); // Track when puzzle was opened for time analytics

  // Daily puzzle state
  const [dailyPuzzleStreak, setDailyPuzzleStreak] = useState(0);
  const [currentDailyPuzzle, setCurrentDailyPuzzle] = useState(null);
  const [dailyPuzzleAnswer, setDailyPuzzleAnswer] = useState('');
  const [dailyPuzzleCompleted, setDailyPuzzleCompleted] = useState(false);
  const [dailyPuzzleTimer, setDailyPuzzleTimer] = useState(0);

  // Minigame state
  const [showMinigames, setShowMinigames] = useState(false);
  const [selectedPuzzleForMinigame, setSelectedPuzzleForMinigame] = useState(null);

  // Token and unlock state
  const [userTokens, setUserTokens] = useState(0);
  const [showTopicUnlock, setShowTopicUnlock] = useState(false);
  const [lockedTopic, setLockedTopic] = useState(null);
  const [showWatchAdModal, setShowWatchAdModal] = useState(false);
  const [adModalType, setAdModalType] = useState('token');

  // Payment state
  const [showPaymentCheckout, setShowPaymentCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userSubscription, setUserSubscription] = useState(null);

  // Token shop and analytics state
  const [showTokenShop, setShowTokenShop] = useState(false);
  const [lockedPuzzle, setLockedPuzzle] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCognitiveTrainer, setShowCognitiveTrainer] = useState(false);
  const [unlockedPuzzles, setUnlockedPuzzles] = useState(new Set());



  // Check authentication on mount and load user progress
  useEffect(() => {
    // Initialize sound service (requires user interaction, will auto-init on first interaction)
    const handleFirstInteraction = () => {
      try {
        SoundService.initialize();
      } catch (e) {
        console.warn('Sound initialization failed:', e);
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    // Initialize reminder service
    try {
      ReminderService.init();
    } catch (e) {
      console.warn('Reminder service initialization failed:', e);
    }

    const initSession = async () => {
        const currentUser = await AuthService.checkSession();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          setAuthView('authenticated');

          // Load user progress
          const progress = ProgressService.getUserProgress(currentUser.id);
          setCompletedPuzzles(new Set(progress.completedPuzzles));
          setPuzzleScores(progress.puzzleScores);
          setTotalScore(progress.totalScore);
          setDailyPuzzleStreak(progress.dailyPuzzle.currentStreak);
          setReminderEnabled(progress.settings.reminderEnabled);
          // Don't overwrite language from server progress - prioritize local device preference (TranslationService)
          // valid: setSelectedLanguage(progress.settings.selectedLanguage);

          // Check URL params for OAuth or Payment callbacks
          const urlParams = new URLSearchParams(window.location.search);

          // Handle OAuth callback (Google/Apple login)
          const authSuccess = urlParams.get('auth');
          if (authSuccess === 'success') {
             console.log('OAuth login successful, refreshing session...');
             window.history.replaceState({}, document.title, window.location.pathname);
             // Session is already refreshed via cookie, just continue loading
          }

          // Load Payment Status (Check for Stripe Return)
          const sessionId = urlParams.get('session_id');
          if (sessionId) {
             console.log('Verifying payment session:', sessionId);
             try {
                // Remove query params to prevent re-verification
                window.history.replaceState({}, document.title, window.location.pathname);

                // Use imported PaymentService, not window.PaymentService
                const verifyResult = await PaymentService.verifySession(sessionId);
                console.log('Verify result:', verifyResult);
                
                if (verifyResult?.success) {
                   alert('🎉 Premium upgrade successful! Welcome to the club.');
                } else {
                   console.warn('Payment verification returned:', verifyResult);
                }
             } catch (e) {
                console.error('Payment verification failed:', e);
             }
          }

          // Load user subscription (async - must await) after verification
          const subscription = await PaymentService.getUserSubscription(currentUser.id);
          setUserSubscription(subscription);

          // Load user tokens
          try {
            const tokenData = await window.UserProgressService?.getTokens(currentUser.id);
            setUserTokens(tokenData?.tokens || 0);
            // Load unlocked puzzles
            const unlocked = window.UserProgressService?.getUnlockedPuzzles(currentUser.id) || [];
            setUnlockedPuzzles(new Set(unlocked));
          } catch (e) {
            console.warn('Failed to load tokens:', e);
          }
        } else {
          setAuthView('login');
        }
    };
    
    initSession();

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);



  // Sync tokens and unlocked puzzles whenever user changes
  useEffect(() => {
    if (user?.id) {
      // Fetch fresh tokens and unlocked puzzles for the new user
      const fetchUserData = async () => {
        try {
          const tokenData = await window.UserProgressService?.getTokens(user.id);
          setUserTokens(tokenData?.tokens || 0);
          const unlocked = window.UserProgressService?.getUnlockedPuzzles(user.id) || [];
          setUnlockedPuzzles(new Set(unlocked));
        } catch (e) {
          console.warn('Failed to sync tokens:', e);
          setUserTokens(0);
          setUnlockedPuzzles(new Set());
        }
      };
      fetchUserData();
    } else {
      // Reset tokens if no user
      setUserTokens(0);
      setUnlockedPuzzles(new Set());
    }
  }, [user?.id]);

  // Auth handlers
  const handleLogin = async (credentials) => {
    console.log('[MindCase] handleLogin called with:', credentials.email);
    const result = await AuthService.login(credentials);
    console.log('[MindCase] AuthService.login result:', result.success);
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
      setAuthView('authenticated');

      // Load user progress
      const progress = ProgressService.getUserProgress(result.user.id);
      setCompletedPuzzles(new Set(progress.completedPuzzles));
      setPuzzleScores(progress.puzzleScores);
      setTotalScore(progress.totalScore);
      setDailyPuzzleStreak(progress.dailyPuzzle.currentStreak);

      // Load user tokens
      const tokenData = await window.UserProgressService?.getTokens(result.user.id);
      setUserTokens(tokenData?.tokens || 0);

      // Load user subscription (async - must await)
      const subscription = await PaymentService.getUserSubscription(result.user.id);
      setUserSubscription(subscription);

      // Track activity (session/login history is handled internally by AuthService)
      ProgressService.recordActivity(result.user.id, 'login');
    }
    return result;
  };

  const handleSignup = async (userData) => {
    const result = await AuthService.register(userData);
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
      setAuthView('authenticated');

      // Initialize progress for new user
      ProgressService.getUserProgress(result.user.id);
      ProgressService.recordActivity(result.user.id, 'signup');
    }
    return result;
  };

  const handleLogout = () => {
    if (user) {
      // Save current progress before logout
      const progress = {
        completedPuzzles: Array.from(completedPuzzles),
        puzzleScores,
        totalScore,
        dailyPuzzle: {
          currentStreak: dailyPuzzleStreak,
          bestStreak: dailyPuzzleStreak,
          lastCompleted: dailyPuzzleCompleted ? new Date().toDateString() : null,
          totalCompleted: dailyPuzzleCompleted ? 1 : 0
        },
        stats: {
          totalCompleted: completedPuzzles.size,
          averageScore: completedPuzzles.size > 0 ? Math.round(totalScore / completedPuzzles.size) : 0,
          recentActivity: []
        },
        settings: {
          reminderEnabled,
          transitionDuration,
          selectedLanguage
        }
      };
      ProgressService.saveUserProgress(user.id, progress);
      ProgressService.recordActivity(user.id, 'logout');
    }

    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setAuthView('login');

    // Reset progress state
    setCompletedPuzzles(new Set());
    setPuzzleScores({});
    setTotalScore(0);
    setDailyPuzzleStreak(0);
    setUserTokens(0); // Clear leaked tokens
    setScreen('menu');
    setShowNavBar(false);
  };

  const handleSkipAuth = async () => {
    const result = await AuthService.loginAsGuest();
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
      setAuthView('authenticated');

      // Initialize/Load tokens for guest
      const tokenData = await window.UserProgressService?.getTokens(result.user.id);
      setUserTokens(tokenData?.tokens || 0);
    }
  };

  // Get today's puzzle
  const getTodaysPuzzle = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return dailyPuzzles[dayOfYear % dailyPuzzles.length];
  };

  // Initialize daily puzzle
  React.useEffect(() => {
    if (!currentDailyPuzzle) {
      setCurrentDailyPuzzle(getTodaysPuzzle());
    }
  }, [currentDailyPuzzle]);

  // Timer for daily puzzle
  React.useEffect(() => {
    let interval;
    if (screen === 'dailyMinigames' && !dailyPuzzleCompleted) {
      interval = setInterval(() => {
        setDailyPuzzleTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [screen, dailyPuzzleCompleted]);

  // Handle daily puzzle submission
  const submitDailyPuzzle = () => {
    if (dailyPuzzleAnswer === currentDailyPuzzle.answer) {
      setDailyPuzzleCompleted(true);
      setDailyPuzzleStreak(prev => prev + 1);

      // Save daily puzzle completion for authenticated users
      if (isAuthenticated && user) {
        ProgressService.completeDailyPuzzle(user.id, currentDailyPuzzle.id);
        ProgressService.recordActivity(user.id, 'daily_puzzle_completed', {
          puzzleId: currentDailyPuzzle.id,
          time: dailyPuzzleTimer
        });
      }
    } else {
      // Wrong answer, show feedback
      alert('Not quite! Try again or see the explanation.');
    }
  };

  // Handle puzzle selection with animation and translation
  const openPuzzle = async (puzzle) => {
    setLastOpenedPuzzle(puzzle);
    setAttemptCount(0);
    setPuzzleStartTime(Date.now()); // Track start time for analytics
    setModalAnimating(true);

    // Translate puzzle content if not English
    const currentLang = TranslationService.getLanguage();
    let displayPuzzle = puzzle;
    
    if (currentLang !== 'English') {
      try {
        displayPuzzle = await ContentTranslator.getTranslatedPuzzle(puzzle, currentLang);
      } catch (err) {
        console.warn('Translation failed, using original:', err);
      }
    }

    setSelectedPuzzle(displayPuzzle);
    setTimeout(() => {
      setModalVisible(true);
      setModalAnimating(false);
    }, 50);
  };

  // Continue to last puzzle
  const continueLastPuzzle = () => {
    if (lastOpenedPuzzle) {
      const topic = topics.find(t => t.puzzles.some(p => p.id === lastOpenedPuzzle.id));
      if (topic) {
        setSelectedTopic(topic);
        setScreen('topics');
        setTimeout(() => openPuzzle(lastOpenedPuzzle), 100);
      }
    }
  };


  const closePuzzle = () => {
    setModalAnimating(true);
    setModalVisible(false);
    setTimeout(() => {
      setSelectedPuzzle(null);
      setUserAnswer('');
      setShowFeedback(false);
      setFeedbackData(null);
      setModalAnimating(false);
    }, 300);
  };

  // Minigame handlers
  const openMinigames = (puzzle) => {
    setSelectedPuzzleForMinigame(puzzle);
    setShowMinigames(true);
  };

  const closeMinigames = () => {
    setShowMinigames(false);
    setSelectedPuzzleForMinigame(null);
  };

  const handleEvidenceUnlock = (evidence, completed, total) => {
    // Update progress when evidence is unlocked
    if (user && selectedPuzzleForMinigame) {
      const progress = ProgressService.getUserProgress(user.id);
      // Store minigame progress
      if (!progress.minigameProgress) {
        progress.minigameProgress = {};
      }
      progress.minigameProgress[selectedPuzzleForMinigame.id] = {
        completed,
        total,
        lastPlayed: new Date().toISOString()
      };
      ProgressService.saveUserProgress(user.id, progress);
    }
  };

  // Payment handlers
  const handleSubscribeClick = (planId) => {
    if (!user) {
      alert('Please log in to subscribe');
      return;
    }

    const plan = PaymentService.PLANS[planId.toUpperCase()];
    if (!plan) return;

    setSelectedPlan(plan);
    setShowPaymentCheckout(true);
  };

  const handlePaymentSuccess = (subscription) => {
    // Update user subscription in state
    setUserSubscription(subscription);
    setShowPaymentCheckout(false);
    setSelectedPlan(null);

    // Update user object with new subscription
    if (user) {
      const updatedUser = { ...user, subscription: subscription.plan };
      setUser(updatedUser);
    }

    // Show success message
    alert('🎉 Subscription activated! You now have access to all premium features.');
  };

  const handleCancelSubscription = async () => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to cancel your premium subscription?\n\nYou will retain access until the end of your current billing period, but will lose access to premium features afterwards.')) {
      return;
    }

    try {
      const result = await PaymentService.cancelSubscription(user.id);
      if (result.success) {
        alert(result.message || 'Subscription canceled successfully.');
        // Refresh subscription status
        const subscription = await PaymentService.getUserSubscription(user.id);
        setUserSubscription(subscription);
      } else {
         alert('Could not cancel subscription. Please try again later.');
      }
    } catch (e) {
      console.error('Cancellation error:', e);
      alert('Failed to cancel subscription. Please check your connection and try again.');
    }
  };

  // Smooth page transition handler with crossfade
  const navigateTo = (newScreen, topic = null) => {
    // Play appropriate sound
    try {
      if (topic) {
        SoundService.play('topicSelect');
      } else if (newScreen === 'topics') {
        SoundService.play('caseOpen');
      } else {
        SoundService.play('navClick');
      }
    } catch (e) {
      // Sound service not yet initialized
    }

    setIsTransitioning(true);

    // Fade out duration is half of total transition
    const fadeOutDuration = transitionDuration / 2;

    setTimeout(() => {
      setScreen(newScreen);
      if (topic !== undefined) {
        setSelectedTopic(topic);
      }

      // Fade in after screen change
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, fadeOutDuration);
  };

  // Calculate skill levels based on completed puzzles
  const calculateSkills = useMemo(() => {
    const skillCounts = { logical: 0, decision: 0, adaptive: 0, source: 0, bias: 0 };
    const skillTotals = { logical: 0, decision: 0, adaptive: 0, source: 0, bias: 0 };
    
    topics.forEach(topic => {
      topic.puzzles.forEach(puzzle => {
        skillTotals[puzzle.skillType]++;
        if (completedPuzzles.has(puzzle.id)) {
          const score = puzzleScores[puzzle.id] || 60;
          skillCounts[puzzle.skillType] += score;
        }
      });
    });

    return {
      logical: skillTotals.logical > 0 ? Math.round((skillCounts.logical / (skillTotals.logical * 100)) * 100) : 0,
      decision: skillTotals.decision > 0 ? Math.round((skillCounts.decision / (skillTotals.decision * 100)) * 100) : 0,
      adaptive: skillTotals.adaptive > 0 ? Math.round((skillCounts.adaptive / (skillTotals.adaptive * 100)) * 100) : 0,
      source: skillTotals.source > 0 ? Math.round((skillCounts.source / (skillTotals.source * 100)) * 100) : 0,
      bias: skillTotals.bias > 0 ? Math.round((skillCounts.bias / (skillTotals.bias * 100)) * 100) : 0,
    };
  }, [completedPuzzles, puzzleScores]);

  // Calculate stats
  const calculateStats = () => {
    let totalPuzzles = 0;
    let solvedPuzzles = completedPuzzles.size;
    topics.forEach(topic => {
      if (topic.unlocked) {
        totalPuzzles += topic.puzzles.length;
      }
    });
    return {
      solved: solvedPuzzles,
      total: totalPuzzles,
      percentage: totalPuzzles > 0 ? Math.round((solvedPuzzles / totalPuzzles) * 100) : 0
    };
  };

  const stats = calculateStats();

  // Generate fixed positions for evidence board - computed once per topic
  const boardPositions = useMemo(() => {
    if (!selectedTopic) return [];
    
    const positions = [];
    const cols = 3;
    const cardWidth = 280;
    const cardHeight = 340;
    const gapX = 60;
    const gapY = 80;
    
    selectedTopic.puzzles.forEach((_, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      // Base position in grid
      const baseX = col * (cardWidth + gapX) + 40;
      const baseY = row * (cardHeight + gapY) + 20;
      
      // Add fixed random offset based on index (deterministic)
      const seed = index * 12345;
      const offsetX = ((seed % 40) - 20);
      const offsetY = (((seed * 7) % 30) - 15);
      const rotation = (((seed * 13) % 10) - 5);
      
      positions.push({
        left: baseX + offsetX,
        top: baseY + offsetY,
        rotation: rotation,
      });
    });
    
    return positions;
  }, [selectedTopic?.id]);

  // NEW: Structural evaluation using StructuralEvaluator (reasoning structure-based)
  // PLUS: Expert Alignment Grader for riddles with specific answer keys
  const evaluateAnswer = async () => {
    if (!userAnswer.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setAttemptCount(prev => prev + 1);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let score, isCorrect, strengths, gaps, feedback, keyInsight, evaluation;

    // Check if we have an expert alignment grading key for this puzzle
    // This allows for high-precision grading on specific riddles based on CONTENT
    const expertKey = ExpertAlignmentGrader.getAnswerKey(selectedPuzzle.id);

    if (expertKey) {
      // Use Expert Alignment Grader
      const expertResult = ExpertAlignmentGrader.gradeAnswer(userAnswer, selectedPuzzle.id);
      
      score = expertResult.alignmentScore;
      isCorrect = score >= 60;
      
      strengths = expertResult.strengths;
      gaps = expertResult.gaps;
      feedback = expertResult.feedback;
      keyInsight = selectedPuzzle.keyPrinciples?.[0] || "Focus on the specific details of the riddle.";
      
      // Adapt expert result to evaluation format expected by UI
      evaluation = {
        ...expertResult,
        totalScore: score,
        overallFeedback: feedback,
        performanceLevel: expertResult.gradeLevel,
        // Map breakdown to match what DetailedFeedback might expect, or simply pass it through
        // The UI seems to handle `evaluation` generically or we might need to verify DetailedFeedback
        components: {
            contentAlignment: { score: score, label: 'Content Alignment', present: true, quality: score > 70 ? 2 : 1 }
        }
      };
      
    } else {
      // Fallback: Use the StructuralEvaluator service (analyzes reasoning structure)
      evaluation = await StructuralEvaluator.evaluateResponse(userAnswer, {
        puzzle: selectedPuzzle,
        idealAnswer: selectedPuzzle.idealAnswer,
        keyPrinciples: selectedPuzzle.keyPrinciples
      });

      score = evaluation.totalScore;
      isCorrect = score >= 60;

      // Build strengths and gaps from reasoning components
      strengths = [];
      gaps = [];

      Object.entries(evaluation.components || {}).forEach(([componentId, componentData]) => {
        if (componentData.present && componentData.quality >= 1) {
          strengths.push(`✓ ${componentData.label}`);
        } else if (componentData.required) {
          gaps.push(`→ ${componentData.label}`);
        }
      });

      // If no actions (fallback), add generic feedback
      if (strengths.length === 0 && gaps.length === 0) {
        if (score >= 70) {
          strengths.push('Demonstrates good critical thinking');
        }
        gaps.push('Continue developing analytical reasoning');
      }
      
      feedback = evaluation.overallFeedback;
      keyInsight = selectedPuzzle.keyPrinciples[0] || "Critical thinking requires questioning assumptions and considering multiple perspectives.";
    }

    setFeedbackData({
      score: score,
      isCorrect: isCorrect,
      strengths: strengths.slice(0, 3), // Show top 3
      gaps: gaps.slice(0, 3), // Show top 3
      feedback: feedback,
      keyInsight: keyInsight,
      evaluation: evaluation, // Store full evaluation for detailed feedback
      performanceLevel: evaluation.performanceLevel
    });

    // If score is low, offer retry
    if (score < 60 && attemptCount < 3) {
      setShowRetryPrompt(true);
    } else {
      setShowFeedback(true);

      // Mark as completed if passing score
      if (isCorrect && !completedPuzzles.has(selectedPuzzle.id)) {
        setCompletedPuzzles(prev => new Set([...prev, selectedPuzzle.id]));
        setPuzzleScores(prev => ({ ...prev, [selectedPuzzle.id]: score }));
        setTotalScore(prev => prev + score);

        // Save progress for authenticated users with component scores
        if (isAuthenticated && user) {
          // Build component scores object (supports new structural evaluation format)
          const componentScores = evaluation.components
            ? {
                // New structural evaluation format - extract component scores
                ...Object.fromEntries(
                  Object.entries(evaluation.components).map(([compId, compData]) => [
                    compId,
                    compData.score
                  ])
                ),
                performanceLevel: evaluation.performanceLevel,
                timestamp: evaluation.timestamp,
                model: evaluation.model,
                qualityMultiplier: evaluation.qualityMultiplier,
                wordCount: evaluation.wordCount
              }
            : evaluation.actions
            ? {
                // Semantic evaluation format
                ...Object.fromEntries(
                  Object.entries(evaluation.actions).map(([actionId, actionData]) => [
                    actionId,
                    actionData.score
                  ])
                ),
                performanceLevel: evaluation.performanceLevel,
                timestamp: evaluation.timestamp,
                schema: evaluation.schema
              }
            : {
                // Old legacy evaluation format
                claimIdentification: evaluation.claimIdentification?.score || 0,
                evidenceEvaluation: evaluation.evidenceEvaluation?.score || 0,
                reasoningLogic: evaluation.reasoningLogic?.score || 0,
                biasAwareness: evaluation.biasAwareness?.score || 0,
                clarityCoherence: evaluation.clarityCoherence?.score || 0,
                performanceLevel: evaluation.performanceLevel,
                timestamp: evaluation.timestamp
              };

          ProgressService.completePuzzle(user.id, selectedPuzzle.id, score, componentScores);
          ProgressService.recordActivity(user.id, 'puzzle_completed', {
            puzzleId: selectedPuzzle.id,
            score,
            topicId: selectedTopic?.id,
            evaluation: evaluation
          });

          // Record answer for analytics (Advanced Analytics tracking)
          try {
            // Calculate time spent (from when puzzle opened to now)
            const timeSpent = puzzleStartTime ? Math.floor((Date.now() - puzzleStartTime) / 60000) : 0; // minutes

            window.UserProgressService?.recordAnswer(
              user.id,
              selectedPuzzle.id,
              selectedTopic?.id || 'general',
              score,
              timeSpent
            );
          } catch (e) {
            console.warn('Failed to record analytics:', e);
          }
        }
      }
    }

    setIsAnalyzing(false);
  };

  // Retry without showing answer
  const handleRetry = () => {
    // Use a retry if we have the RetryManager
    if (selectedPuzzle && user && window.RetryManager) {
      const userId = user.id || 'default_user';
      const retryManager = new window.RetryManager(userId);
      const result = retryManager.useRetry(selectedPuzzle.id);

      if (!result.success) {
        alert('No retries remaining for this puzzle.');
        return;
      }
    }

    setShowRetryPrompt(false);
    setUserAnswer('');
    setFeedbackData(null);
    setShowFeedback(false);
  };

  // Show answer after declining retry
  const handleShowAnswer = () => {
    setShowRetryPrompt(false);
    setShowFeedback(true);
  };

  const renderMenu = () => (
    <div className={`relative w-full min-h-screen pb-20 overflow-hidden bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 transition-opacity ease-in-out ${
      isTransitioning ? 'opacity-0' : 'opacity-100'
    }`} style={{ transitionDuration: `${transitionDuration / 2}ms` }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-red-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Logo */}
        <div className="mb-6 animate-[fadeIn_0.8s_ease-out]">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 blur-3xl opacity-30 animate-pulse" />
            <img 
              src="app_icon.png" 
              alt="MindCase Logo" 
              className="relative w-36 h-36 rounded-3xl shadow-2xl border-2 border-red-600/40" 
            />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8 animate-[fadeIn_1s_ease-out]">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-red-400 mb-3 tracking-tight">
            MINDCASE
          </h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-500" />
            <p className="text-xl md:text-2xl text-amber-400 font-bold tracking-widest uppercase">
              {TranslationService.t('menu.title_sub')}
            </p>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-500" />
          </div>
          <p className="text-stone-400 text-lg max-w-xl mx-auto leading-relaxed">
            {TranslationService.t('menu.description').split(' ').map((word, i) => {
               if (word.includes('question') || word.includes('cuestionar')) return <span key={i} className="text-red-400 font-semibold">{word} </span>;
               if (word.includes('analyze') || word.includes('analizar')) return <span key={i} className="text-amber-400 font-semibold">{word} </span>;
               if (word.includes('validate') || word.includes('validar')) return <span key={i} className="text-red-400 font-semibold">{word} </span>;
               return word + ' ';
            })}
          </p>
        </div>

        {/* Progress Overview */}
        <div className="w-full max-w-2xl mb-8 animate-[fadeIn_1.1s_ease-out]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Solved */}
            <div className="bg-stone-900/60 backdrop-blur-sm border border-red-700/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-red-400 mb-1">{stats.solved}</div>
              <div className="text-xs text-stone-400 uppercase tracking-wide">{TranslationService.t('menu.cases_solved')}</div>
            </div>

            {/* Total Score */}
            <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-amber-400 mb-1">{totalScore}</div>
              <div className="text-xs text-stone-400 uppercase tracking-wide">{TranslationService.t('menu.total_score')}</div>
            </div>

            {/* Tokens (Free Users) OR Completion Percentage (Premium) */}
            {userSubscription?.status !== 'active' ? (
              <button
                onClick={() => {
                  setAdModalType('token');
                  setShowWatchAdModal(true);
                }}
                className="bg-stone-900/60 backdrop-blur-sm border border-blue-700/30 hover:border-blue-600 rounded-xl p-4 text-center transition-all hover:bg-stone-800/80 cursor-pointer"
                title="Click to watch ads for tokens"
              >
                <div className="text-3xl font-bold text-blue-400 mb-1">💰 {userTokens}</div>
                <div className="text-xs text-stone-400 uppercase tracking-wide">{TranslationService.t('menu.tokens')}</div>
              </button>
            ) : (
              <div className="bg-stone-900/60 backdrop-blur-sm border border-green-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">{stats.percentage}%</div>
                <div className="text-xs text-stone-400 uppercase tracking-wide">{TranslationService.t('menu.complete')}</div>
              </div>
            )}

            {/* Daily Streak */}
            <div className="bg-stone-900/60 backdrop-blur-sm border border-purple-700/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">{dailyPuzzleStreak}</div>
              <div className="text-xs text-stone-400 uppercase tracking-wide">{TranslationService.t('menu.day_streak')}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-stone-300 font-medium">{TranslationService.t('menu.overall_progress')}</span>
              <span className="text-sm text-amber-400 font-bold">{stats.solved} / {stats.total} {TranslationService.t('menu.puzzles')}</span>
            </div>
            <div className="w-full bg-stone-800 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500 transition-all duration-1000 ease-out"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-[fadeIn_1.4s_ease-out]">
          {/* Start button */}
          <button
            onClick={() => {
              setShowNavBar(true);
              navigateTo('topics', null);
            }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-amber-600 rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 px-10 py-4 rounded-xl font-bold text-xl text-white shadow-xl transform group-hover:scale-105 transition-all flex items-center gap-3 border border-red-500/40">
              {TranslationService.t('menu.open_case_files')}
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Cognitive Training button */}
          {user && (
            <button
              onClick={() => setShowCognitiveTrainer(true)}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-600 hover:to-purple-700 px-10 py-4 rounded-xl font-bold text-xl text-white shadow-xl transform group-hover:scale-105 transition-all flex items-center gap-3 border border-purple-500/40">
                <Lightbulb className="w-6 h-6" />
                {TranslationService.t('menu.cognitive_training')}
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderTopics = () => (
    <div className={`min-h-screen pb-20 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 transition-opacity ease-in-out relative ${
      isTransitioning ? 'opacity-0' : 'opacity-100'
    }`} style={{ transitionDuration: `${transitionDuration / 2}ms` }}>
      {/* Ambient dim lighting effect */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 20%, rgba(251,191,36,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 60%, rgba(239,68,68,0.05) 0%, transparent 40%)',
        zIndex: 0
      }} />

      {/* Vignette effect */}
      <div className="fixed inset-0 pointer-events-none" style={{
        boxShadow: 'inset 0 0 200px 60px rgba(0,0,0,0.6)',
        zIndex: 0
      }} />

      {/* Header */}
      <div className="sticky top-0 z-20 bg-stone-950/95 backdrop-blur-sm border-b border-amber-800/30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigateTo('menu', null)}
            className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Main Menu</span>
          </button>
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-red-500" />
            <span className="text-xl font-bold text-white">Case Files</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-stone-800 border border-amber-700/50 rounded-lg px-3 py-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="text-white font-bold">{totalScore}</span>
            </div>
            <button
              onClick={() => {
                const isFreeUser = !userSubscription || userSubscription.status !== 'active';
                console.log('Token button clicked!', { userSubscription, isFreeUser });
                console.log('Current userTokens state:', userTokens);
                console.log('User ID:', user?.id);
                // Check actual token balance from service
                const tokenData = window.UserProgressService?.getTokens(user?.id);
                console.log('Actual token data from service:', tokenData);
                // Only free users can watch ads for tokens
                if (isFreeUser) {
                  console.log('Opening WatchAdModal for tokens');
                  setAdModalType('token');
                  setShowWatchAdModal(true);
                } else {
                  console.log('Premium user - ads not available');
                }
              }}
              className={`flex items-center gap-2 border border-amber-700/50 rounded-lg px-3 py-2 transition-all ${
                !userSubscription || userSubscription.status !== 'active'
                  ? 'bg-stone-800 hover:bg-stone-700 hover:border-amber-600 cursor-pointer'
                  : 'bg-stone-800 cursor-default'
              }`}
              title={!userSubscription || userSubscription.status !== 'active' ? 'Click to watch ads for tokens' : 'Token balance'}
            >
              <span className="text-amber-400 font-bold">💰</span>
              <span className="text-white font-bold">{userTokens}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Topics grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Select Your Investigation</h2>
          <p className="text-stone-400">Each case file contains puzzles. Write your reasoning, get AI feedback.</p>
        </div>

        {/* Featured Topic - Riddle Marathon Banner */}
        {topics.filter(t => t.featured).map((topic) => {
          const topicCompleted = topic.puzzles.filter(p => completedPuzzles.has(p.id)).length;
          // Premium users have full access based on already-loaded subscription state
          const isPremiumUser = userSubscription?.status === 'active';
          const canAccess = isPremiumUser ? true : true; // Featured topic always accessible

          return (
            <div
              key={`featured-${topic.id}`}
              onClick={() => canAccess ? navigateTo('topics', topic) : null}
              className="mb-8 cursor-pointer group"
            >
              {/* Glowing border effect */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-all duration-500 animate-pulse" />

                <div className={`relative bg-gradient-to-r ${topic.color} rounded-xl border-2 ${topic.borderColor} p-6 overflow-hidden transform group-hover:scale-[1.02] transition-all duration-300`} style={{
                  boxShadow: '0 10px 40px rgba(251,146,60,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                }}>
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
                    }} />
                  </div>

                  {/* Sparkle effects */}
                  <div className="absolute top-4 right-8 w-2 h-2 bg-white rounded-full animate-ping opacity-75" />
                  <div className="absolute top-12 right-20 w-1.5 h-1.5 bg-amber-200 rounded-full animate-ping opacity-60" style={{animationDelay: '0.5s'}} />
                  <div className="absolute bottom-8 right-12 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-50" style={{animationDelay: '1s'}} />

                  {/* NEW badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                    NEW!
                  </div>

                  {/* FEATURED stamp */}
                  <div className="absolute top-4 left-4 border-2 border-amber-300/50 text-amber-200/70 px-3 py-1 text-xs font-bold tracking-widest" style={{
                    fontFamily: 'monospace'
                  }}>
                    FEATURED CHALLENGE
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-6 pt-6">
                    {/* Large icon with glow */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-xl animate-pulse" />
                      <div className="relative text-7xl md:text-8xl transform group-hover:rotate-12 transition-transform duration-300">{topic.icon}</div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                        {topic.name}
                      </h3>
                      <p className="text-white/90 text-lg mb-4 max-w-2xl">
                        {topic.description}
                      </p>

                      {/* Stats row */}
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                        <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                          <span className="text-2xl">🎯</span>
                          <span className="text-white font-semibold">{topic.puzzles.length} Classic Puzzles</span>
                        </div>
                        <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                          <span className="text-2xl">🏆</span>
                          <span className="text-amber-300 font-semibold">{topicCompleted}/{topic.puzzles.length} Solved</span>
                        </div>
                        <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                          <span className="text-2xl">⭐</span>
                          <span className="text-yellow-300 font-semibold">Interview Favorites</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="bg-black/40 rounded-full h-3 overflow-hidden max-w-md mx-auto md:mx-0">
                        <div
                          className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 h-full rounded-full transition-all duration-500 relative"
                          style={{ width: `${(topicCompleted / topic.puzzles.length) * 100}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="flex-shrink-0">
                      <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-3 text-lg border border-white/30 hover:border-white/50 group-hover:scale-105 shadow-xl">
                        <span>Start Marathon</span>
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Regular Topics Label */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-600 to-transparent" />
          <span className="text-stone-400 text-sm font-medium uppercase tracking-wider">Case Files</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-600 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.filter(t => !t.featured).map((topic, index) => {
            const topicCompleted = topic.puzzles.filter(p => completedPuzzles.has(p.id)).length;

            // Check topic access - premium users have full access
            const isPremiumUser = userSubscription?.status === 'active';
            // Free users get first 2 topics, premium users get all
            const canAccess = isPremiumUser ? true : index < 2;
            const isLockedBySubscription = !canAccess;

            const handleTopicClick = () => {
              if (canAccess) {
                navigateTo('topics', topic);
              } else if (isLockedBySubscription) {
                setLockedTopic(topic);
                setShowTopicUnlock(true);
              }
            };

            return (
              <div
                key={topic.id}
                onClick={handleTopicClick}
                className={`${canAccess ? 'cursor-pointer hover:scale-105 hover:-translate-y-1' : isLockedBySubscription ? 'cursor-pointer hover:scale-102' : 'opacity-50 cursor-not-allowed'} transition-all duration-300 opacity-0 animate-fadeInUp relative`}
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                {/* Stacked paper layers (back to front) */}
                <div className="absolute top-3 left-2 w-full h-full bg-amber-100/40 rounded-sm" style={{
                  boxShadow: '2px 3px 8px rgba(0,0,0,0.3)'
                }} />
                <div className="absolute top-1.5 left-1 w-full h-full bg-amber-100/60 rounded-sm" style={{
                  boxShadow: '1px 2px 4px rgba(0,0,0,0.2)'
                }} />

                {/* Dim spotlight effect */}
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none" style={{
                  background: 'radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%)',
                  filter: 'blur(30px)',
                  zIndex: 0
                }} />

                {/* Main case file folder */}
                <div className={`relative bg-gradient-to-br ${topic.color} rounded-sm border-2 ${topic.borderColor} p-6 h-full overflow-hidden`} style={{
                  boxShadow: '4px 6px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 50px rgba(251,191,36,0.15)'
                }}>
                  {/* Paper texture overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-5" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px)'
                  }} />

                  {/* CLASSIFIED stamp */}
                  <div className="absolute top-2 right-2 border-2 border-red-600/30 text-red-600/40 px-3 py-1 text-xs font-bold tracking-widest rotate-12" style={{
                    fontFamily: 'monospace'
                  }}>
                    CASE FILE
                  </div>

                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full" />

                  {canAccess ? (
                    <>
                      <div className="text-5xl mb-4">{topic.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{topic.name}</h3>
                      <p className="text-white/70 text-sm mb-4">{topic.description}</p>
                      
                      <div className="bg-black/30 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/80 text-xs font-medium">Progress</span>
                          <span className="text-amber-300 text-sm font-bold">{topicCompleted}/{topic.puzzles.length}</span>
                        </div>
                        <div className="bg-black/40 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-red-400 to-amber-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(topicCompleted / topic.puzzles.length) * 100}%` }}
                          />
                        </div>
                      </div>

                      <button className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                        Open Case File
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  ) : isLockedBySubscription ? (
                    <>
                      <div className="text-5xl mb-4 opacity-70">{topic.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{topic.name}</h3>
                      <p className="text-white/60 text-sm mb-4">{topic.description}</p>
                      <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-center gap-2 text-amber-300 text-xs mb-2">
                          <Lock className="w-4 h-4" />
                          <span className="font-medium">Locked Case File</span>
                        </div>
                        <p className="text-white/60 text-xs text-center">
                          Unlock 1 puzzle for <strong className="text-amber-400">3 tokens</strong><br/>
                          or get <strong className="text-blue-400">Premium</strong> for unlimited access
                        </p>
                      </div>
                      <button className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm">
                        <Lock className="w-4 h-4" />
                        Unlock Case
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-5xl mb-4 opacity-50">{topic.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{topic.name}</h3>
                      <p className="text-white/50 text-sm mb-4">{topic.description}</p>
                      <div className="flex items-center justify-center gap-2 text-white/50 py-2">
                        <Lock className="w-5 h-5" />
                        <span className="text-sm">Complete previous cases</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderDetectiveBoard = () => {
    if (!selectedTopic) return null;

    const topicCompleted = selectedTopic.puzzles.filter(p => completedPuzzles.has(p.id)).length;
    const boardHeight = Math.ceil(selectedTopic.puzzles.length / 3) * 420 + 100;

    return (
      <div className={`min-h-screen pb-20 transition-opacity ease-in-out ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`} style={{
        transitionDuration: `${transitionDuration / 2}ms`,
        background: `
          linear-gradient(135deg, #5c4033 0%, #8b6914 50%, #654321 100%)
        `
      }}>
        {/* Cork board texture overlay */}
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")
          `,
          opacity: 0.15,
          mixBlendMode: 'overlay'
        }} />
        
        {/* Wood frame shadow */}
        <div className="fixed inset-0 pointer-events-none" style={{
          boxShadow: 'inset 0 0 100px 40px rgba(0,0,0,0.5), inset 0 0 20px 10px rgba(0,0,0,0.3)'
        }} />

        {/* Header */}
        <div className="sticky top-0 z-20 bg-amber-950/95 backdrop-blur-sm border-b-4 border-amber-900" style={{
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
        }}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => navigateTo('topics', null)}
              className="flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Case Files</span>
            </button>
            
            <div className="flex items-center gap-3 bg-amber-900/80 border-2 border-amber-700 rounded-lg px-4 py-2">
              <span className="text-2xl">{selectedTopic.icon}</span>
              <span className="text-lg font-bold text-amber-100">{selectedTopic.name}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-amber-900/80 border-2 border-amber-700 rounded-lg px-3 py-2">
              <Star className="w-5 h-5 text-amber-400" filled />
              <span className="text-amber-100 font-bold">{topicCompleted}/{selectedTopic.puzzles.length}</span>
            </div>
          </div>
        </div>

        {/* Evidence board area */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-2 drop-shadow-lg">Evidence Board</h2>
            <p className="text-amber-200/70">Click a case to write your analysis</p>
          </div>

          {/* Fixed position board container */}
          <div className="relative mx-auto" style={{ 
            height: `${boardHeight}px`,
            maxWidth: '1000px'
          }}>
            {/* Red strings connecting some cards */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              {boardPositions.length >= 2 && (
                <>
                  <line 
                    x1={boardPositions[0]?.left + 140} 
                    y1={boardPositions[0]?.top + 170} 
                    x2={boardPositions[1]?.left + 140} 
                    y2={boardPositions[1]?.top + 170}
                    stroke="#dc2626"
                    strokeWidth="2"
                    opacity="0.4"
                  />
                  {boardPositions.length >= 3 && (
                    <line 
                      x1={boardPositions[1]?.left + 140} 
                      y1={boardPositions[1]?.top + 170} 
                      x2={boardPositions[2]?.left + 140} 
                      y2={boardPositions[2]?.top + 170}
                      stroke="#dc2626"
                      strokeWidth="2"
                      opacity="0.4"
                    />
                  )}
                </>
              )}
            </svg>

            {selectedTopic.puzzles.map((puzzle, index) => {
              const isCompleted = completedPuzzles.has(puzzle.id);
              const pos = boardPositions[index];

              // Check if all 3 minigames are completed
              // For featured topics (Riddle Marathon), bypass minigame requirement
              const isFeaturedTopic = selectedTopic.featured === true;
              const progress = user ? ProgressService.getUserProgress(user.id) : {};
              const minigameProgress = progress.minigameProgress?.[puzzle.id];
              const hasCompletedMinigames = isFeaturedTopic || (minigameProgress?.completed === minigameProgress?.total && minigameProgress?.total === 3);

              // Check access control - premium users have full access
              const isPremiumUser = userSubscription?.status === 'active';
              // Check if unlocked with tokens
              const isUnlockedWithTokens = unlockedPuzzles.has(puzzle.id);
              // Premium users have full access, free users limited to first 10 puzzles or unlocked with tokens
              const canAccess = isPremiumUser ? true : (index < 10 || isUnlockedWithTokens);
              const isLocked = !canAccess;
              // Token cost for locked puzzles (free users)
              const requiresTokens = 3;
              const currentTokens = userTokens;

              if (!pos) return null;
              
              return (
                <div
                  key={puzzle.id}
                  className="absolute transition-all duration-300 hover:scale-105 hover:z-10 opacity-0 animate-cardAppear"
                  style={{
                    left: `${pos.left}px`,
                    top: `${pos.top}px`,
                    '--rotation': `${pos.rotation}deg`,
                    transform: `rotate(${pos.rotation}deg)`,
                    width: '280px',
                    zIndex: 1,
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'forwards',
                  }}
                >
                  {/* Push pin */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-7 h-7 rounded-full shadow-xl relative" style={{
                      background: 'radial-gradient(circle at 30% 30%, #ef4444, #7f1d1d)',
                      boxShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}>
                      <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-red-300/70 rounded-full" />
                    </div>
                  </div>
                  
                  {/* Completed badge */}
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 z-20">
                      <div className="w-11 h-11 bg-green-600 rounded-full border-3 border-green-400 flex items-center justify-center shadow-xl">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Locked badge (for token-gated puzzles) */}
                  {isLocked && (
                    <div className="absolute -top-2 -right-2 z-20">
                      <div className="w-11 h-11 bg-red-600 rounded-full border-3 border-red-400 flex items-center justify-center shadow-xl">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Card - add opacity for locked puzzles */}
                  <div className={`relative bg-amber-50 rounded-sm shadow-2xl overflow-hidden ${isLocked ? 'opacity-75' : ''}`} style={{
                    boxShadow: '4px 6px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.5)'
                  }}>
                    {/* Lock overlay for locked puzzles */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm z-30 flex items-center justify-center">
                        <div className="text-center text-white p-4">
                          <Lock className="w-12 h-12 mx-auto mb-2 text-amber-400" />
                          <p className="font-bold text-sm mb-1">Locked Puzzle</p>
                          <p className="text-xs mb-2">{requiresTokens} tokens to unlock</p>
                          <p className="text-xs text-amber-300 mb-3">You have: {currentTokens}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLockedPuzzle({ ...puzzle, name: puzzle.title });
                              setShowTokenShop(true);
                            }}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                              currentTokens >= requiresTokens
                                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-white shadow-lg'
                                : 'bg-stone-600 text-stone-300 cursor-not-allowed'
                            }`}
                          >
                            {currentTokens >= requiresTokens ? `🔓 Unlock (${requiresTokens} tokens)` : `Need ${requiresTokens - currentTokens} more tokens`}
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Image area */}
                    <div className="h-32 overflow-hidden relative">
                      <img
                        src={puzzle.image}
                        alt={puzzle.title}
                        className="w-full h-full object-cover"
                        style={{ filter: 'sepia(20%) contrast(1.1)' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-50/80" />
                      <div className="absolute top-2 left-2 text-4xl drop-shadow-lg">{puzzle.icon}</div>
                    </div>
                    
                    {/* Content area */}
                    <div className="p-4">
                      <h3 className="text-stone-800 font-bold text-base mb-2 leading-tight">{puzzle.title}</h3>

                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-block text-xs px-2 py-1 bg-amber-200 rounded text-amber-800 font-medium">
                          {puzzle.skillFocus}
                        </span>
                        {minigameProgress && !isFeaturedTopic && (
                          <span className={`text-xs px-2 py-1 rounded font-medium ${
                            hasCompletedMinigames
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            🎮 {minigameProgress.completed}/{minigameProgress.total}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-amber-200">
                        {isLocked ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLockedPuzzle({ ...puzzle, name: puzzle.title });
                              setShowTokenShop(true);
                            }}
                            className="flex-1 text-xs font-medium py-2 px-3 rounded transition-colors bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            💰 Unlock ({requiresTokens} tokens)
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!hasCompletedMinigames && !isCompleted) {
                                  alert('🔒 Complete all 3 minigames first to unlock the Analyze button!\n\nClick "🎮 Evidence" to collect evidence through minigames.');
                                  return;
                                }
                                openPuzzle(puzzle);
                              }}
                              disabled={!hasCompletedMinigames && !isCompleted}
                              className={`${isFeaturedTopic ? 'w-full' : 'flex-1'} text-xs font-medium py-2 px-3 rounded transition-colors ${
                                !hasCompletedMinigames && !isCompleted
                                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-60'
                                  : isFeaturedTopic
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                                    : 'text-stone-700 hover:text-stone-900 bg-amber-100 hover:bg-amber-200'
                              }`}
                            >
                              {isCompleted ? '📋 Review' : isFeaturedTopic ? '🧩 Solve Riddle' : hasCompletedMinigames ? '🔍 Analyze' : '🔒 Locked'}
                            </button>
                            {!isFeaturedTopic && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openMinigames(puzzle);
                                }}
                                className="flex-1 text-red-700 hover:text-red-900 text-xs font-medium py-2 px-3 bg-red-100 hover:bg-red-200 rounded transition-colors"
                              >
                                🎮 Evidence
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Paper texture lines */}
                    <div className="absolute inset-0 pointer-events-none opacity-10" style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, #8b6914 28px, #8b6914 29px)'
                    }} />
                    
                    {/* Aged paper effect */}
                    <div className="absolute bottom-0 right-0 w-16 h-16 bg-amber-100/50 rounded-tl-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderRetryPrompt = () => {
    if (!showRetryPrompt || !feedbackData || !selectedPuzzle) return null;

    // Get retry info for this puzzle
    const userId = user?.id || 'default_user';

    // Default retry stats if RetryManager is not available
    let retryStats = { freeRetries: 2, adRetries: 0, totalRetries: 2 };
    let canRetry = true;

    if (window.RetryManager) {
      const retryManager = new window.RetryManager(userId);
      retryStats = retryManager.getStats(selectedPuzzle.id);
      canRetry = retryManager.canRetry(selectedPuzzle.id);
    }

    const isFreeUser = !userSubscription || userSubscription === 'free';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl border-2 border-amber-700/50 max-w-md w-full p-6 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-amber-400 mb-2">Score: {feedbackData.score}/100</h3>
            <p className="text-stone-300">{feedbackData.feedback}</p>
          </div>

          {feedbackData.strengths.length > 0 && (
            <div className="mb-4 bg-green-900/20 border border-green-700/30 rounded-lg p-3">
              <p className="text-green-400 font-semibold text-sm mb-2">What you got right:</p>
              <ul className="text-green-300/80 text-sm space-y-1">
                {feedbackData.strengths.map((s, i) => (
                  <li key={i}>✓ {s}</li>
                ))}
              </ul>
            </div>
          )}

          {feedbackData.gaps.length > 0 && (
            <div className="mb-6 bg-amber-900/20 border border-amber-700/30 rounded-lg p-3">
              <p className="text-amber-400 font-semibold text-sm mb-2">To improve:</p>
              <ul className="text-amber-300/80 text-sm space-y-1">
                {feedbackData.gaps.map((g, i) => (
                  <li key={i}>→ {g}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Retry info */}
          <div className="mb-6 bg-stone-800/50 border border-stone-700 rounded-lg p-3 text-center">
            <p className="text-stone-400 text-sm mb-2">
              Retries remaining: {retryStats.totalRetries}
              {isFreeUser && (
                <span className="text-stone-500 block text-xs mt-1">
                  ({retryStats.freeRetries} free + {retryStats.adRetries} from ads)
                </span>
              )}
            </p>
          </div>

          <div className="flex gap-3">
            {canRetry ? (
              <button
                onClick={handleRetry}
                className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-white transition-all"
              >
                Try Again
              </button>
            ) : isFreeUser ? (
              <button
                onClick={() => {
                  setShowRetryPrompt(false);
                  setAdModalType({ type: 'retry', puzzleId: selectedPuzzle.id });
                  setShowWatchAdModal(true);
                }}
                className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white transition-all"
              >
                Watch Ad for Retry
              </button>
            ) : (
              <button
                disabled
                className="flex-1 py-3 rounded-xl font-bold bg-stone-700 text-stone-500 cursor-not-allowed"
              >
                No Retries Left
              </button>
            )}
            <button
              onClick={handleShowAnswer}
              className="flex-1 py-3 rounded-xl font-bold bg-stone-700 hover:bg-stone-600 text-white transition-all"
            >
              Show Answer
            </button>
          </div>
        </div>
      </div>
    );
  };



  const renderProfilePanel = () => {
    const skillDescriptions = {
      logical: "Logical Reasoning: Your ability to identify flaws in arguments, recognize patterns, and draw valid conclusions from given information.",
      decision: "Decision Making: Your skill in evaluating options, considering consequences, and making well-reasoned choices under pressure or uncertainty.",
      adaptive: "Adaptive Learning: Your capacity to recognize the same logical patterns across different contexts and apply learned principles to new situations.",
      source: "Source Evaluation: Your proficiency in assessing the credibility, reliability, and validity of information sources and research claims.",
      bias: "Bias Detection: Your awareness of cognitive biases, logical fallacies, and how they can distort reasoning and decision-making processes."
    };

    if (!showProfilePanel) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
            showProfilePanel ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setShowProfilePanel(false)}
        />

        {/* Side Panel */}
        <div className={`fixed top-0 right-0 h-full w-full md:w-[500px] bg-gradient-to-br from-stone-900 to-stone-950 border-l-2 border-amber-700/50 shadow-2xl z-50 overflow-y-auto transition-transform duration-300 ease-out ${
          showProfilePanel ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-stone-900/95 backdrop-blur-sm pb-4 -mt-6 pt-6 -mx-6 px-6 border-b border-amber-700/30">
              <h3 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
                <User className="w-7 h-7" />
                Profile
              </h3>
              <button
                onClick={() => setShowProfilePanel(false)}
                className="bg-stone-800 hover:bg-stone-700 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5 text-amber-400" />
              </button>
            </div>

            {/* User Info */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-700 to-red-900 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-amber-600/50">
                <User className="w-10 h-10 text-amber-200" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{user?.name || 'Detective'}</h2>
              <p className="text-stone-400 text-sm">{user?.email || 'guest@mindcase.com'}</p>
              {user && (
                <p className="text-stone-500 text-xs mt-1">Member since {user.joinDate}</p>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-stone-800/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-4 text-center">
                <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-400 mb-1">{stats.solved}</div>
                <div className="text-stone-400 text-xs">Cases Solved</div>
              </div>
              <div className="bg-stone-800/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-4 text-center">
                <Star className="w-8 h-8 text-amber-500 mx-auto mb-2" filled />
                <div className="text-2xl font-bold text-amber-400 mb-1">{totalScore}</div>
                <div className="text-stone-400 text-xs">Total Points</div>
              </div>
            </div>

            {/* Advanced Analytics Button */}
            <div className="mb-6">
              <button
                onClick={() => {
                  if (userSubscription?.status === 'active') {
                    setShowProfilePanel(false);
                    setShowAnalytics(true);
                  } else {
                    // Redirect to subscription page for free users
                    setShowProfilePanel(false);
                    setScreen('settings');
                    setSettingsView('subscription');
                  }
                }}
                className={`w-full font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${
                  userSubscription?.status === 'active'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                    : 'bg-stone-700 text-stone-400 cursor-not-allowed'
                }`}
              >
                {userSubscription?.status !== 'active' && <Lock className="w-4 h-4" />}
                <BarChart2 className="w-5 h-5" />
                View Advanced Analytics
              </button>
              <p className="text-center text-stone-500 text-xs mt-2">
                {userSubscription?.status === 'active' ? '✨ Premium Feature' : '🔒 Premium Feature - Upgrade to unlock'}
              </p>
            </div>

            {/* Skill Chart */}
            <div className="bg-stone-800/60 backdrop-blur-sm border border-amber-700/30 rounded-2xl p-5 mb-6">
              <h3 className="text-lg font-bold text-amber-400 mb-4 text-center">Your Skill Profile</h3>
              <div className="w-full max-w-sm mx-auto mb-4">
                <SkillRadarChart skills={calculateSkills} />
              </div>

              {/* Skill Details */}
              <div className="space-y-3">
                {Object.entries(skillDescriptions).map(([key, description]) => {
                  const skillValue = calculateSkills[key];
                  return (
                    <div key={key} className="bg-stone-900/60 rounded-lg p-3 border border-stone-700/50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-amber-300 text-sm">{description.split(':')[0]}</h4>
                        <span className="text-red-400 font-bold">{skillValue}%</span>
                      </div>
                      <div className="bg-stone-950 rounded-full h-2 mb-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-red-500 to-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${skillValue}%` }}
                        />
                      </div>
                      <p className="text-stone-400 text-xs leading-relaxed">{description.split(':')[1]}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Token Balance (for free users) */}
            {userSubscription?.status !== 'active' && (
              <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/20 border-2 border-amber-600/50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-amber-300 font-bold">Token Balance</h4>
                  <span className="text-2xl">💰</span>
                </div>
                <div className="text-3xl font-bold text-amber-400 mb-1">
                  {window.UserProgressService?.getTokens(user?.id || 'default_user')?.tokens || 0}
                </div>
                <p className="text-amber-200/70 text-xs">
                  Earn tokens by completing daily minigames. Use 5 tokens to unlock a new puzzle!
                </p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderSettings = () => {
    const renderMainSettings = () => (
      <div className="space-y-3">
        {!isAuthenticated ? (
          <button
            onClick={() => setSettingsView('login')}
            className="w-full flex items-center justify-between p-4 bg-stone-800/80 hover:bg-stone-700/80 rounded-xl border border-stone-700 transition-all"
          >
            <div className="flex items-center gap-3">
              <LogIn className="w-6 h-6 text-amber-500" />
              <span className="text-white font-medium">Login / Sign Up</span>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-500" />
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 bg-red-900/30 hover:bg-red-900/50 rounded-xl border border-red-700/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-6 h-6 text-red-400" />
              <span className="text-white font-medium">Logout</span>
            </div>
          </button>
        )}

        <button
          onClick={() => setSettingsView('subscription')}
          className="w-full flex items-center justify-between p-4 bg-stone-800/80 hover:bg-stone-700/80 rounded-xl border border-stone-700 transition-all"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-amber-500" />
            <div className="text-left">
              <div className="text-white font-medium">Subscription</div>
              <div className="text-stone-400 text-sm">{user?.subscription || 'Free'} Plan</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-500" />
        </button>

        <button
          onClick={() => setSettingsView('security')}
          className="w-full flex items-center justify-between p-4 bg-stone-800/80 hover:bg-stone-700/80 rounded-xl border border-stone-700 transition-all"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-amber-500" />
            <span className="text-white font-medium">Security</span>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-500" />
        </button>

        <button
          onClick={() => setSettingsView('sessions')}
          className="w-full flex items-center justify-between p-4 bg-stone-800/80 hover:bg-stone-700/80 rounded-xl border border-stone-700 transition-all"
        >
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            <span className="text-white font-medium">Sessions & History</span>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-500" />
        </button>

        <button
          onClick={() => {
            setSettingsView('sound');
            try { SoundService.play('buttonClick'); } catch (e) {}
          }}
          className="w-full flex items-center justify-between p-4 bg-stone-800/80 hover:bg-stone-700/80 rounded-xl border border-stone-700 transition-all"
        >
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
            <span className="text-white font-medium">Sound & Music</span>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-500" />
        </button>

        {isAuthenticated && user && (
          <button
            onClick={() => setSettingsView('data')}
            className="w-full flex items-center justify-between p-4 bg-stone-800/80 hover:bg-stone-700/80 rounded-xl border border-stone-700 transition-all"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-amber-500" />
              <span className="text-white font-medium">Data Management</span>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-500" />
          </button>
        )}

        <button
          onClick={() => setSettingsView('reminders')}
          className="w-full flex items-center justify-between p-4 bg-stone-800/80 hover:bg-stone-700/80 rounded-xl border border-stone-700 transition-all"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-amber-500" />
            <div className="text-left">
              <div className="text-white font-medium">Daily Reminders</div>
              <div className="text-stone-400 text-sm">Get notified to practice critical thinking</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-400" />
        </button>

        <button
          onClick={() => setSettingsView('language')}
          className="w-full flex items-center justify-between p-4 bg-stone-800/80 hover:bg-stone-700/80 rounded-xl border border-stone-700 transition-all"
        >
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <div className="text-left">
              <div className="text-white font-medium">Language</div>
              <div className="text-stone-400 text-sm">{selectedLanguage}</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-500" />
        </button>

        <div className="p-4 bg-stone-800/60 rounded-xl border border-stone-700/50">
          <p className="text-stone-400 text-xs mb-2">Legal</p>
          <div className="flex gap-3">
            <button
              onClick={() => setSettingsView('privacy')}
              className="text-amber-400 hover:text-amber-300 text-sm underline transition-colors"
            >
              Privacy Policy
            </button>
            <span className="text-stone-600">•</span>
            <button
              onClick={() => setSettingsView('terms')}
              className="text-amber-400 hover:text-amber-300 text-sm underline transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>


      </div>
    );

    const renderLoginForm = () => (
      <div className="space-y-4">
        <button
          onClick={() => setSettingsView('main')}
          className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div>
          <label className="block text-amber-300 font-medium mb-2">Email</label>
          <input
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-white placeholder-stone-500 focus:border-amber-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-amber-300 font-medium mb-2">Password</label>
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-white placeholder-stone-500 focus:border-amber-500 outline-none transition-colors"
          />
        </div>

        <button
          onClick={() => {
            if (handleLogin(loginEmail, loginPassword)) {
              setSettingsView('main');
              setLoginEmail('');
              setLoginPassword('');
            }
          }}
          className="w-full py-3 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 rounded-lg font-bold text-white transition-all"
        >
          Login
        </button>

        <p className="text-stone-400 text-sm text-center">
          Demo: Use any email and password to login
        </p>
      </div>
    );

    const renderDetailView = (title, content) => (
      <div>
        <button
          onClick={() => setSettingsView('main')}
          className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
        <h3 className="text-xl font-bold text-amber-400 mb-4">{title}</h3>
        <div className="bg-stone-800/80 rounded-xl border border-stone-700 p-6">
          <p className="text-stone-300 text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    );

    return (
      <div className={`min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 pb-20 transition-opacity ease-in-out ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`} style={{ transitionDuration: `${transitionDuration / 2}ms` }}>
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-amber-600/50">
              <Settings className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-3xl font-bold text-white">Settings</h2>
          </div>

          <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-2xl p-6">
            {settingsView === 'main' && renderMainSettings()}
            {settingsView === 'login' && renderLoginForm()}
            {settingsView === 'subscription' && (
              <div>
                <button onClick={() => setSettingsView('main')} className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors mb-4">
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-medium">Back</span>
                </button>
                <h3 className="text-2xl font-bold text-amber-400 mb-2">Choose Your Plan</h3>

                {/* Current Plan Status */}
                {userSubscription && (
                  <div className="mb-6 bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-300 text-sm font-medium">Current Plan:</p>
                        <p className="text-white text-lg font-bold">
                          {userSubscription.plan === 'free' ? 'Free' :
                           userSubscription.plan === 'monthly_premium' ? 'Premium Monthly' :
                           'Premium Annual'}
                        </p>
                      </div>
                      {userSubscription.plan !== 'free' && (
                        <div className="text-right">
                          <p className="text-blue-300 text-xs">Renews:</p>
                          <p className="text-white text-sm">
                            {new Date(userSubscription.currentPeriodEnd).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                    {userSubscription.plan === 'monthly_premium' && (
                      <p className="text-amber-300 text-xs mt-3">
                        💡 Save 30% by upgrading to Annual plan!
                      </p>
                    )}
                    
                    {userSubscription.plan !== 'free' && (
                        <div className="mt-4 pt-4 border-t border-blue-700/30">
                            <button 
                                onClick={handleCancelSubscription}
                                className="text-red-400 hover:text-red-300 text-xs underline transition-colors"
                            >
                                Cancel Subscription
                            </button>
                        </div>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Free Plan */}
                  <div className={`p-5 rounded-xl border-2 transition-all ${user?.subscription === 'Free' ? 'border-amber-600 bg-amber-900/20' : 'border-stone-700 bg-stone-800/60'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-xl font-bold text-white">Free</h4>
                        <p className="text-stone-400 text-sm">Get started with basic features</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">$0</div>
                        <div className="text-stone-500 text-xs">forever</div>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-4">
                      <li className="text-stone-300 text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>2 case files (10 puzzles)</span>
                      </li>
                      <li className="text-stone-300 text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Basic analytics</span>
                      </li>
                      <li className="text-stone-300 text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Daily minigames (3 tokens/day)</span>
                      </li>
                      <li className="text-stone-300 text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Community support</span>
                      </li>
                    </ul>
                    {userSubscription?.plan === 'free' && (
                      <div className="text-center text-green-500 font-semibold text-sm">✓ Current Plan</div>
                    )}
                  </div>

                  {/* Monthly Plan */}
                  <div className={`p-5 rounded-xl border-2 transition-all ${selectedSubscription === 'monthly' ? 'border-amber-600 bg-amber-900/20' : 'border-stone-700 bg-stone-800/60 hover:border-amber-700/50'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-xl font-bold text-white">Premium Monthly</h4>
                        <p className="text-stone-400 text-sm">Unlock all features</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-amber-400">$5.99</div>
                        <div className="text-stone-500 text-xs">per month</div>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-4">
                      <li className="text-stone-300 text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Unlimited case files & puzzles</span>
                      </li>
                      <li className="text-stone-300 text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Advanced skill analytics</span>
                      </li>
                      <li className="text-stone-300 text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Exclusive detective challenges</span>
                      </li>
                      <li className="text-stone-300 text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Priority support</span>
                      </li>
                    </ul>
                    {userSubscription?.plan === 'monthly_premium' ? (
                      <div className="text-center text-green-500 font-semibold text-sm">✓ Current Plan</div>
                    ) : (
                      <button onClick={() => handleSubscribeClick('MONTHLY')} className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded-lg font-bold text-white transition-all">
                        Subscribe Monthly
                      </button>
                    )}
                  </div>

                  {/* Annual Plan */}
                  <div className={`p-5 rounded-xl border-2 transition-all relative ${selectedSubscription === 'annual' ? 'border-amber-600 bg-amber-900/20' : 'border-amber-600/50 bg-stone-800/60 hover:border-amber-600'}`}>
                    <div className="absolute -top-3 right-4 bg-gradient-to-r from-red-600 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      SAVE 44%
                    </div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-xl font-bold text-white">Premium Annual</h4>
                        <p className="text-stone-400 text-sm">Best value - save 44%!</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-amber-400">$39.99</div>
                        <div className="text-stone-500 text-xs">per year</div>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-4">
                      <li className="text-stone-300 text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Everything in Premium Monthly</span>
                      </li>
                      <li className="text-stone-300 text-sm flex items-start gap-2">
                        <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" filled />
                        <span className="text-amber-300 font-semibold">Early access to new content</span>
                      </li>
                      <li className="text-stone-300 text-sm flex items-start gap-2">
                        <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" filled />
                        <span className="text-amber-300 font-semibold">Downloadable certificates</span>
                      </li>
                    </ul>
                    {userSubscription?.plan === 'annual_premium' ? (
                      <div className="text-center text-green-500 font-semibold text-sm">✓ Current Plan</div>
                    ) : userSubscription?.plan === 'monthly_premium' ? (
                      <button onClick={() => handleSubscribeClick('ANNUAL')} className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 rounded-lg font-bold text-white transition-all">
                        Upgrade to Annual
                      </button>
                    ) : (
                      <button onClick={() => handleSubscribeClick('ANNUAL')} className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 rounded-lg font-bold text-white transition-all">
                        Subscribe Annually
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            {settingsView === 'security' && isAuthenticated && user && (
              <SecuritySettings user={user} onBack={() => setSettingsView('main')} />
            )}
            {settingsView === 'sessions' && isAuthenticated && user && (
              <SessionsHistory user={user} onBack={() => setSettingsView('main')} />
            )}
            {settingsView === 'sound' && (
              <SoundSettings onBack={() => setSettingsView('main')} />
            )}
            {settingsView === 'reminders' && (
              <ReminderSettings onBack={() => setSettingsView('main')} />
            )}
            {settingsView === 'data' && isAuthenticated && user && (
              <div>
                <button onClick={() => setSettingsView('main')} className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors mb-4">
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-medium">Back</span>
                </button>
                <DataManagement
                  user={user}
                  onProgressReset={() => {
                    // Reload progress state
                    const progress = ProgressService.getUserProgress(user.id);
                    setCompletedPuzzles(new Set(progress.completedPuzzles));
                    setPuzzleScores(progress.puzzleScores);
                    setTotalScore(progress.totalScore);
                    setDailyPuzzleStreak(progress.dailyPuzzle.currentStreak);
                  }}
                />
              </div>
            )}
            {settingsView === 'security-old' && (
              <div>
                <button onClick={() => setSettingsView('main')} className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors mb-4">
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-medium">Back</span>
                </button>
                <h3 className="text-xl font-bold text-amber-400 mb-6">Security Settings</h3>

                <div className="space-y-4">
                  {/* Current Account */}
                  {isAuthenticated && user && (
                    <div className="bg-stone-800/80 rounded-xl border border-stone-700 p-4">
                      <p className="text-stone-400 text-xs mb-2">Logged in as</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-700 to-red-900 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-amber-200" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.email}</div>
                          <div className="text-stone-500 text-xs">Google Account</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Password Manager */}
                  <div className="bg-stone-800/80 rounded-xl border border-stone-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-amber-500" />
                        <span className="text-white font-medium">Password Manager</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-stone-500" />
                    </div>
                    <p className="text-stone-400 text-sm">Manage your saved passwords and enable autofill</p>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="bg-stone-800/80 rounded-xl border border-stone-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-amber-500" />
                        <span className="text-white font-medium">Two-Factor Authentication</span>
                      </div>
                      <div className="text-stone-500 text-sm">Off</div>
                    </div>
                    <p className="text-stone-400 text-sm">Add an extra layer of security to your account</p>
                  </div>

                  {/* Session Management */}
                  <div className="bg-stone-800/80 rounded-xl border border-stone-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
                        </svg>
                        <span className="text-white font-medium">Active Sessions</span>
                      </div>
                      <div className="text-green-500 text-sm">1 device</div>
                    </div>
                    <p className="text-stone-400 text-sm">Manage devices and login sessions</p>
                  </div>

                  {/* Login History */}
                  <div className="bg-stone-800/80 rounded-xl border border-stone-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span className="text-white font-medium">Login History</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-stone-500" />
                    </div>
                    <p className="text-stone-400 text-sm">Review recent login activity</p>
                  </div>
                </div>
              </div>
            )}
            {settingsView === 'language' && (
              <div>
                <button onClick={() => setSettingsView('main')} className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors mb-4">
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-medium">{TranslationService.t('settings.back')}</span>
                </button>
                <h3 className="text-xl font-bold text-amber-400 mb-6">{TranslationService.t('settings.language')}</h3>

                <div className="space-y-2">
                  {TranslationService.supportedLanguages.map(lang => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`w-full p-4 rounded-xl border transition-all text-left ${
                        selectedLanguage === lang
                          ? 'border-amber-600 bg-amber-900/20'
                          : 'border-stone-700 bg-stone-800/60 hover:border-amber-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{lang}</span>
                        {selectedLanguage === lang && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {settingsView === 'privacy' && renderDetailView(
              'Privacy Policy',
              'We are committed to protecting your privacy. We collect only essential data to provide our services and never sell your information to third parties. Your puzzle answers and progress are stored securely and used only to personalize your learning experience. You have the right to access, modify, or delete your data at any time.'
            )}
            {settingsView === 'terms' && renderDetailView(
              'Terms of Service',
              'By using MindCase, you agree to our terms of service. The content provided is for educational purposes. You retain ownership of your responses and progress data. We reserve the right to modify features and content. Accounts that violate our community guidelines may be suspended. For complete terms, please visit our website.'
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSettingsPanel = () => (
    <div className={`fixed top-0 right-0 h-full w-80 bg-stone-900 border-l-2 border-amber-700/50 shadow-2xl z-50 transition-transform duration-300 ease-out ${
      showSettings ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-amber-400 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            {TranslationService.t('settings.title')}
          </h3>
          <button
            onClick={() => setShowSettings(false)}
            className="bg-stone-800 hover:bg-stone-700 rounded-lg p-2 transition-colors"
          >
            <X className="w-5 h-5 text-amber-400" />
          </button>
        </div>

        {/* Transition Speed Control */}
        <div className="space-y-4">
          <div>
            <label className="block text-amber-300 font-semibold mb-2">
              Transition Speed
            </label>
            <p className="text-stone-400 text-sm mb-3">
              Control how fast screens fade in and out
            </p>

            <div className="space-y-2">
              <input
                type="range"
                min="200"
                max="1200"
                step="100"
                value={transitionDuration}
                onChange={(e) => setTransitionDuration(Number(e.target.value))}
                className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${((transitionDuration - 200) / 1000) * 100}%, #44403c ${((transitionDuration - 200) / 1000) * 100}%, #44403c 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-stone-500">
                <span>Fast (0.2s)</span>
                <span className="text-amber-400 font-bold">{(transitionDuration / 1000).toFixed(1)}s</span>
                <span>Slow (1.2s)</span>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-stone-800 rounded-lg border border-stone-700">
            <p className="text-stone-400 text-sm mb-2">Preview:</p>
            <div className="relative h-20 bg-stone-950 rounded overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-red-700 to-amber-700 transition-opacity"
                style={{
                  transitionDuration: `${transitionDuration / 2}ms`,
                  opacity: showSettings ? 1 : 0
                }}
              >
                <div className="flex items-center justify-center h-full text-white font-bold">
                  Smooth Fade
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Show login/signup screens if not authenticated
  if (authView === 'login') {
    return <LoginForm onLogin={handleLogin} onSwitchToSignup={() => setAuthView('signup')} onSkip={handleSkipAuth} />;
  }

  if (authView === 'signup') {
    return <SignupForm onSignup={handleSignup} onSwitchToLogin={() => setAuthView('login')} onSkip={handleSkipAuth} />;
  }

  if (authView === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🧠</div>
          <p className="text-stone-400">Loading MindCase...</p>
        </div>
      </div>
    );
  }

  // Main app (authenticated or guest)
  return (
    <div className="font-sans antialiased">
      {screen === 'menu' && renderMenu()}
      {screen === 'topics' && !selectedTopic && renderTopics()}
      {screen === 'topics' && selectedTopic && renderDetectiveBoard()}
      {screen === 'dailyMinigames' && (
        <DailyMinigame
          onClose={() => setScreen('menu')}
          userSubscription={userSubscription}
          userId={user?.id}
          onOpenSubscription={() => {
            setScreen('settings');
            setSettingsView('subscription');
          }}
          onTokensChange={(newTokens) => setUserTokens(newTokens)}
        />
      )}
      {screen === 'settings' && renderSettings()}

      <PuzzleModal
        selectedPuzzle={selectedPuzzle}
        modalVisible={modalVisible}
        modalAnimating={modalAnimating}
        showFeedback={showFeedback}
        feedbackData={feedbackData}
        userAnswer={userAnswer}
        setUserAnswer={setUserAnswer}
        isAnalyzing={isAnalyzing}
        evaluateAnswer={evaluateAnswer}
        closePuzzle={closePuzzle}
      />

      {renderRetryPrompt()}

      {showMinigames && selectedPuzzleForMinigame && (
        <MinigameManager
          puzzle={selectedPuzzleForMinigame}
          onClose={closeMinigames}
          onEvidenceUnlock={handleEvidenceUnlock}
          userId={user?.id}
        />
      )}

      <NavigationBar
        showNavBar={showNavBar}
        screen={screen}
        selectedTopic={selectedTopic}
        dailyPuzzleCompleted={dailyPuzzleCompleted}
        lastOpenedPuzzle={lastOpenedPuzzle}
        showProfilePanel={showProfilePanel}
        showCognitiveTrainer={showCognitiveTrainer}
        setScreen={setScreen}
        setSelectedTopic={setSelectedTopic}
        navigateTo={navigateTo}
        setDailyPuzzleTimer={setDailyPuzzleTimer}
        continueLastPuzzle={continueLastPuzzle}
        setShowProfilePanel={setShowProfilePanel}
        setShowCognitiveTrainer={setShowCognitiveTrainer}
      />

      {renderProfilePanel()}

      {/* Payment Checkout Modal */}
      {showPaymentCheckout && selectedPlan && user && (
        <StripeCheckout
          plan={selectedPlan}
          user={user}
          onClose={() => {
            setShowPaymentCheckout(false);
            setSelectedPlan(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}



      {/* Advanced Analytics Modal */}
      {showAnalytics && user && (
        <AdvancedAnalytics
          userId={user.id}
          onClose={() => setShowAnalytics(false)}
        />
      )}

      {/* Cognitive Trainer Modal */}
      {showCognitiveTrainer && user && (
        <CognitiveTrainer
          userId={user.id}
          onClose={() => setShowCognitiveTrainer(false)}
        />
      )}

      {/* Topic Unlock Modal */}
      {showTopicUnlock && lockedTopic && user && (
        <TopicUnlockModal
          topic={lockedTopic}
          topicIndex={topics.findIndex(t => t.id === lockedTopic.id)}
          userId={user.id}
          userTokens={userTokens}
          onClose={() => {
            setShowTopicUnlock(false);
            setLockedTopic(null);
          }}
          onUnlock={async () => {
            // Reload tokens after unlock
            console.log('Topic unlocked, reloading tokens for user:', user.id);
            const tokenData = await window.UserProgressService?.getTokens(user.id);
            console.log('Token data after unlock:', tokenData);
            const newTokens = tokenData?.tokens || 0;
            console.log('Setting userTokens to:', newTokens);
            setUserTokens(newTokens);
          }}
          onSubscribe={() => {
            setShowTopicUnlock(false);
            setLockedTopic(null);
            setScreen('settings');
            setSettingsView('subscription');
            setShowSettings(true);
          }}
        />
      )}

      {/* Token Shop Modal for unlocking puzzles */}
      {showTokenShop && lockedPuzzle && (
        <TokenShop
          puzzleId={lockedPuzzle.id}
          puzzleName={lockedPuzzle.name || lockedPuzzle.title}
          userId={user?.id}
          userTokens={userTokens}
          onClose={() => {
            setShowTokenShop(false);
            setLockedPuzzle(null);
          }}
          onUnlock={async () => {
            // Reload user tokens and unlocked puzzles after unlock
            if (user) {
              const tokenData = await window.UserProgressService?.getTokens(user.id);
              setUserTokens(tokenData?.tokens || 0);
              // Refresh unlocked puzzles list
              const unlocked = window.UserProgressService?.getUnlockedPuzzles(user.id) || [];
              setUnlockedPuzzles(new Set(unlocked));
            }
            setShowTokenShop(false);
            setLockedPuzzle(null);
          }}
        />
      )}

      {/* Watch Ad Modal */}
      {showWatchAdModal && user && (
        <WatchAdModal
          type={adModalType}
          userId={user.id}
          onClose={() => {
            setShowWatchAdModal(false);
          }}
          onAdComplete={async (result) => {
            console.log('Ad completed, reloading tokens for user:', user.id);
            // Reload tokens after ad completion
            const tokenData = await window.UserProgressService?.getTokens(user.id);
            console.log('Token data from UserProgressService:', tokenData);
            const newTokens = tokenData?.tokens || 0;
            console.log('Setting userTokens to:', newTokens);
            setUserTokens(newTokens);

            // If it was a retry ad, reopen the retry prompt to show updated retry count
            if (result && (typeof adModalType === 'object' && adModalType.type === 'retry')) {
              setShowRetryPrompt(true);
            }
          }}
        />
      )}

      {/* Settings overlay backdrop */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default MindCaseApp;
