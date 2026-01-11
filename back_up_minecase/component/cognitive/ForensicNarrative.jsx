import React, { useState, useEffect, useCallback, useRef } from 'react';
import TranslationService from '../../services/TranslationService';

/**
 * FORENSIC NARRATIVE - Cognitive Training Game
 *
 * Present fragmented evidence about an ambiguous event.
 * Force users to:
 * 1. Handle contradictions and gaps
 * 2. Build causal explanations by linking evidence
 * 3. Defend their narrative against adversarial challenges
 * 4. Acknowledge weaknesses in their reasoning
 *
 * THE ENGINE BECOMES THE ADVERSARY - attacking their explanations systematically
 */

const ForensicNarrative = ({ scenario, userId, onComplete }) => {
  // Game phases
  const [phase, setPhase] = useState('briefing');
  const [reviewTimeRemaining, setReviewTimeRemaining] = useState(scenario?.minEvidenceReview || 45);
  const [reviewComplete, setReviewComplete] = useState(false);

  // Evidence state
  const [unlockedEvidence, setUnlockedEvidence] = useState([]);
  const [evidenceNotes, setEvidenceNotes] = useState({});
  const [evidenceRatings, setEvidenceRatings] = useState({}); // User's reliability assessment
  const [linkedEvidence, setLinkedEvidence] = useState([]); // Connections made

  // Narrative building
  const [narrative, setNarrative] = useState('');
  const [narrativeLinks, setNarrativeLinks] = useState([]);
  const [selectedNarrativeType, setSelectedNarrativeType] = useState(null);

  // Adversarial phase
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [challengeResponse, setChallengeResponse] = useState('');
  const [challengeHistory, setChallengeHistory] = useState([]);
  const [challengeCount, setChallengeCount] = useState(0);
  const [maxChallenges] = useState(4);

  // Confidence tracking
  const [confidenceLevel, setConfidenceLevel] = useState(50);
  const [uncertainties, setUncertainties] = useState([]);
  const [currentUncertainty, setCurrentUncertainty] = useState('');

  // Tracking
  const [evidenceInteractions, setEvidenceInteractions] = useState([]);
  const [beliefRevisions, setBeliefRevisions] = useState([]);
  const startTimeRef = useRef(Date.now());

  // Timer for evidence review
  useEffect(() => {
    if (phase === 'evidence_review' && reviewTimeRemaining > 0) {
      const timer = setInterval(() => {
        setReviewTimeRemaining(prev => {
          if (prev <= 1) {
            setReviewComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase, reviewTimeRemaining]);

  // Unlock evidence progressively
  useEffect(() => {
    if (phase === 'evidence_review' && scenario?.evidence) {
      const totalEvidence = scenario.evidence.length;
      const unlockInterval = (scenario.minEvidenceReview * 1000) / totalEvidence;

      let index = 0;
      const unlockNext = () => {
        if (index < totalEvidence && scenario.evidence[index]) {
          setUnlockedEvidence(prev => [...prev, scenario.evidence[index]]);
          index++;
          setTimeout(unlockNext, unlockInterval);
        }
      };
      unlockNext();
    }
  }, [phase, scenario]);

  // Log interaction
  const logInteraction = useCallback((type, details) => {
    setEvidenceInteractions(prev => [...prev, {
      type,
      details,
      timestamp: Date.now() - startTimeRef.current,
      phase
    }]);
  }, [phase]);

  // Rate evidence reliability
  const rateEvidence = (evidenceId, rating) => {
    setEvidenceRatings(prev => ({ ...prev, [evidenceId]: rating }));
    logInteraction('rate_evidence', { evidenceId, rating });
  };

  // Add note to evidence
  const addNote = (evidenceId, note) => {
    setEvidenceNotes(prev => ({ ...prev, [evidenceId]: note }));
    logInteraction('add_note', { evidenceId, note: note.substring(0, 50) });
  };

  // Link two pieces of evidence
  const linkEvidence = (sourceId, targetId, relationship) => {
    const link = { sourceId, targetId, relationship, timestamp: Date.now() };
    setLinkedEvidence(prev => [...prev, link]);
    logInteraction('link_evidence', { sourceId, targetId, relationship });
  };

  // Track used challenge types to avoid repetition
  const [usedChallengeTypes, setUsedChallengeTypes] = useState(new Set());

  // Generate adversarial challenge based on narrative - unique each time
  const generateChallenge = () => {
    const narrativeLower = narrative.toLowerCase();
    const availableChallenges = [];

    // Get evidence the user rated highly vs poorly
    const highlyRatedEvidence = Object.entries(evidenceRatings)
      .filter(([_, rating]) => rating >= 4)
      .map(([id]) => unlockedEvidence.find(e => e.id === id))
      .filter(Boolean);

    const lowRatedEvidence = Object.entries(evidenceRatings)
      .filter(([_, rating]) => rating <= 2)
      .map(([id]) => unlockedEvidence.find(e => e.id === id))
      .filter(Boolean);

    // Challenge pool - each challenge is unique and context-aware

    // 1. Contradiction-based challenges
    if (!usedChallengeTypes.has('contradiction_source')) {
      const contradictingEvidence = unlockedEvidence.filter(e => e && e.contradicts);
      if (contradictingEvidence.length > 0) {
        const evidenceSource = contradictingEvidence[0]?.source || 'key evidence';
        availableChallenges.push({
          type: 'contradiction_source',
          text: `Evidence "${evidenceSource}" appears to contradict other testimony. How do you reconcile this conflict in your narrative?`,
          severity: 'high'
        });
      }
    }

    // 2. Reliability challenge based on user's ratings
    if (!usedChallengeTypes.has('reliability_justification') && highlyRatedEvidence.length > 0) {
      const evidenceSource = highlyRatedEvidence[0]?.source || 'key evidence';
      availableChallenges.push({
        type: 'reliability_justification',
        text: `You rated "${evidenceSource}" as highly reliable. What specifically makes this source more trustworthy than others? Could you be biased toward evidence that supports your interpretation?`,
        severity: 'medium'
      });
    }

    // 3. Ignored evidence challenge
    if (!usedChallengeTypes.has('ignored_evidence') && lowRatedEvidence.length > 0) {
      const ignoredSource = lowRatedEvidence[0]?.source || 'some evidence';
      availableChallenges.push({
        type: 'ignored_evidence',
        text: `You dismissed "${ignoredSource}" as unreliable. What if you're wrong about that? How would your narrative change if this evidence was actually accurate?`,
        severity: 'high'
      });
    }

    // 4. Alternative suspect/explanation challenge
    if (!usedChallengeTypes.has('alternative_explanation')) {
      const otherNarratives = scenario?.possibleNarratives?.filter(n => n !== selectedNarrativeType) || [];
      if (otherNarratives.length > 0) {
        const alternative = otherNarratives[Math.floor(Math.random() * otherNarratives.length)];
        availableChallenges.push({
          type: 'alternative_explanation',
          text: `Consider the alternative: "${alternative}". What evidence supports THIS interpretation? Why is your chosen narrative more likely?`,
          severity: 'high'
        });
      }
    }

    // 5. Confidence calibration challenges
    if (!usedChallengeTypes.has('overconfidence') && confidenceLevel > 75) {
      availableChallenges.push({
        type: 'overconfidence',
        text: `Your confidence is ${confidenceLevel}%. Given the contradictions and gaps in the evidence, what would need to be true for you to be THIS certain? What's one thing that could prove you wrong?`,
        severity: 'medium'
      });
    }

    if (!usedChallengeTypes.has('underconfidence') && confidenceLevel < 30) {
      availableChallenges.push({
        type: 'underconfidence',
        text: `Your confidence is only ${confidenceLevel}%. If you HAD to make a decision based on this evidence right now, what would tip the balance? What's the strongest single piece of evidence?`,
        severity: 'medium'
      });
    }

    // 6. Narrative-specific challenges based on content
    if (!usedChallengeTypes.has('motive_question') &&
        (narrativeLower.includes('motive') || narrativeLower.includes('reason') || narrativeLower.includes('why'))) {
      availableChallenges.push({
        type: 'motive_question',
        text: `You mention motive in your narrative. But having a motive doesn't prove action. What DIRECT evidence links your suspect to the actual event, not just to wanting it to happen?`,
        severity: 'high'
      });
    }

    if (!usedChallengeTypes.has('timing_challenge') &&
        (narrativeLower.includes('time') || narrativeLower.includes('when') || narrativeLower.includes('before') || narrativeLower.includes('after'))) {
      availableChallenges.push({
        type: 'timing_challenge',
        text: `Your narrative relies on timing. But timelines can be reconstructed incorrectly. What if the sequence of events was different than you assumed? Does your interpretation still hold?`,
        severity: 'medium'
      });
    }

    // 7. Evidence chain weakness
    if (!usedChallengeTypes.has('chain_weakness') && linkedEvidence.length < 4) {
      availableChallenges.push({
        type: 'chain_weakness',
        text: `You've connected ${linkedEvidence.length} pieces of evidence. But a narrative is only as strong as its weakest link. Which connection in your reasoning is most uncertain?`,
        severity: 'medium'
      });
    }

    // 8. Witness reliability
    if (!usedChallengeTypes.has('witness_reliability')) {
      const witnessEvidence = unlockedEvidence.filter(e => e && (e.type === 'witness' || e.type === 'statement'));
      if (witnessEvidence.length > 0) {
        availableChallenges.push({
          type: 'witness_reliability',
          text: `Human witnesses are notoriously unreliable. Memory is reconstructive, not reproductive. Which witness statements are you relying on, and what could cause them to be mistaken (not lying, just wrong)?`,
          severity: 'medium'
        });
      }
    }

    // 9. Digital/physical evidence challenge
    if (!usedChallengeTypes.has('evidence_tampering')) {
      const digitalEvidence = unlockedEvidence.filter(e =>
        e && (e.type === 'digital_trace' || e.type === 'log' || e.category === 'digital' || e.category === 'physical')
      );
      if (digitalEvidence.length > 0) {
        availableChallenges.push({
          type: 'evidence_tampering',
          text: `Digital and physical evidence can be planted, altered, or misinterpreted. What if the ${digitalEvidence[0]?.type || 'key evidence'} was manipulated? How would you detect that?`,
          severity: 'high'
        });
      }
    }

    // 10. Gap acknowledgment
    if (!usedChallengeTypes.has('gaps_in_story')) {
      availableChallenges.push({
        type: 'gaps_in_story',
        text: `Every narrative has gaps - things we don't know. Name the THREE biggest unknowns in this case. How do these gaps affect your certainty?`,
        severity: 'medium'
      });
    }

    // 11. Confirmation bias challenge
    if (!usedChallengeTypes.has('confirmation_bias')) {
      availableChallenges.push({
        type: 'confirmation_bias',
        text: `Confirmation bias makes us favor evidence that supports what we already believe. Looking back at your analysis, which evidence did you WANT to be true? Did that affect how you weighted it?`,
        severity: 'high'
      });
    }

    // 12. Prosecutor vs Defense view
    if (!usedChallengeTypes.has('opposite_role')) {
      availableChallenges.push({
        type: 'opposite_role',
        text: `If you were arguing the OPPOSITE position, what would be your strongest three arguments? Can you steelman the case against your own narrative?`,
        severity: 'high'
      });
    }

    // Select a challenge that hasn't been used
    let selectedChallenge;
    if (availableChallenges.length > 0) {
      selectedChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
    } else {
      // Fallback - create a dynamic challenge based on narrative content
      const narrativeWords = narrative.split(/\s+/).filter(w => w.length > 5);
      const focusWord = narrativeWords[Math.floor(Math.random() * narrativeWords.length)] || 'conclusion';
      selectedChallenge = {
        type: `dynamic_${challengeCount}`,
        text: `You used the word "${focusWord}" in your narrative. Unpack that - what exactly do you mean, and what evidence specifically supports that characterization?`,
        severity: 'medium'
      };
    }

    // Mark this challenge type as used
    setUsedChallengeTypes(prev => new Set([...prev, selectedChallenge.type]));

    return selectedChallenge;
  };

  // Submit challenge response
  const submitChallengeResponse = () => {
    const response = {
      challenge: currentChallenge,
      response: challengeResponse,
      timestamp: Date.now(),
      confidenceAfter: confidenceLevel
    };

    setChallengeHistory(prev => [...prev, response]);
    setChallengeCount(prev => prev + 1);
    setChallengeResponse('');

    // Track if they revised their beliefs
    if (response.response.toLowerCase().includes('you\'re right') ||
        response.response.toLowerCase().includes('i was wrong') ||
        response.response.toLowerCase().includes('i hadn\'t considered')) {
      setBeliefRevisions(prev => [...prev, {
        type: 'acknowledged_weakness',
        trigger: currentChallenge.text,
        timestamp: Date.now()
      }]);
    }

    // Continue with more challenges or proceed
    if (challengeCount + 1 < maxChallenges) {
      setCurrentChallenge(generateChallenge());
    } else {
      setPhase('defense');
    }
  };

  // Add uncertainty
  const addUncertainty = () => {
    if (currentUncertainty.trim().length > 10) {
      setUncertainties(prev => [...prev, currentUncertainty.trim()]);
      setCurrentUncertainty('');
      logInteraction('add_uncertainty', { text: currentUncertainty });
    }
  };

  // Complete session
  const completeSession = () => {
    const evaluation = evaluateSession();

    const sessionData = {
      scenario: scenario.title,
      duration: Date.now() - startTimeRef.current,
      narrative,
      linkedEvidence,
      evidenceRatings,
      uncertainties,
      challengeHistory,
      beliefRevisions,
      confidenceLevel,
      evidenceInteractions, // Telemetry for grading engine
      evaluation
    };

    onComplete?.(sessionData);
  };

  // Evaluate session quality
  const evaluateSession = () => {
    const evaluation = {
      evidenceExamined: unlockedEvidence.length,
      evidenceRated: Object.keys(evidenceRatings).length,
      linksCreated: linkedEvidence.length,
      uncertaintiesNamed: uncertainties.length,
      challengesEngaged: challengeHistory.length,
      beliefRevisionsShown: beliefRevisions.length,
      narrativeLength: narrative.length,
      processQuality: 0,
      cognitiveGrowth: [],
      feedback: []
    };

    let score = 0;

    // Evidence engagement
    if (evaluation.evidenceRated >= 5) {
      score += 15;
      evaluation.cognitiveGrowth.push('evidence_patience');
    } else {
      evaluation.feedback.push("Consider rating the reliability of more evidence pieces to strengthen your analysis.");
    }

    // Created meaningful links
    if (evaluation.linksCreated >= 4) {
      score += 15;
      evaluation.cognitiveGrowth.push('causal_reasoning');
    } else {
      evaluation.feedback.push("Explicitly connecting evidence helps reveal patterns and gaps.");
    }

    // Named uncertainties
    if (evaluation.uncertaintiesNamed >= 2) {
      score += 20;
      evaluation.cognitiveGrowth.push('ambiguity_tolerance');
    } else {
      evaluation.feedback.push("Naming what you DON'T know is as important as stating what you believe.");
    }

    // Engaged with challenges
    if (evaluation.challengesEngaged >= 3) {
      score += 15;
    }

    // Showed belief revision
    if (evaluation.beliefRevisionsShown > 0) {
      score += 20;
      evaluation.cognitiveGrowth.push('revision_willingness');
    }

    // Appropriate confidence
    if (confidenceLevel >= 30 && confidenceLevel <= 70) {
      score += 15; // Moderate confidence appropriate for ambiguous situation
      evaluation.cognitiveGrowth.push('calibration');
    } else if (confidenceLevel > 85) {
      evaluation.feedback.push("Very high confidence on ambiguous cases may indicate overconfidence.");
    }

    evaluation.processQuality = score;
    return evaluation;
  };

  // Render evidence card
  const renderEvidenceCard = (evidence) => {
    if (!evidence || !evidence.id) return null; // Safety check

    const rating = evidenceRatings[evidence.id];
    const note = evidenceNotes[evidence.id];

    return (
      <div
        key={evidence.id}
        className="bg-stone-800/50 border border-stone-700 rounded-xl p-4 transition-all hover:border-amber-600"
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{evidence.icon || '📋'}</span>
            <div>
              <div className="text-amber-400 font-bold text-sm">{evidence.type?.replace(/_/g, ' ').toUpperCase()}</div>
              <div className="text-stone-400 text-xs">Source: {evidence.source}</div>
            </div>
          </div>
          <div className="text-stone-500 text-xs">{evidence.timing}</div>
        </div>

        <p className="text-stone-200 text-sm mb-3 whitespace-pre-line">{evidence.content}</p>

        {/* Reliability rating */}
        <div className="mb-3">
          <div className="text-stone-400 text-xs mb-1">How reliable is this evidence?</div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(r => (
              <button
                key={r}
                onClick={() => rateEvidence(evidence.id, r)}
                className={`w-8 h-8 rounded-lg transition-colors ${rating === r
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-700 text-stone-400 hover:bg-stone-600'
                  }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <input
            type="text"
            placeholder="Add a note about this evidence..."
            value={note || ''}
            onChange={(e) => addNote(evidence.id, e.target.value)}
            className="w-full bg-stone-900 border border-stone-600 rounded-lg px-3 py-2 text-sm text-white placeholder-stone-500"
          />
        </div>

        {/* Contradiction warning if applicable */}
        {evidence.contradicts && (
          <div className="mt-2 px-2 py-1 bg-red-900/30 border border-red-700/50 rounded text-red-300 text-xs">
            May contradict other evidence
          </div>
        )}

        {/* Gap indicator */}
        {evidence.gap && (
          <div className="mt-2 px-2 py-1 bg-amber-900/30 border border-amber-700/50 rounded text-amber-300 text-xs">
            Contains gap or missing information
          </div>
        )}
      </div>
    );
  };

  // Render phase content
  const renderPhaseContent = () => {
    switch (phase) {
      case 'briefing':
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold text-amber-400">{scenario?.title}</h2>
            <div className="bg-stone-800/50 rounded-xl p-6 text-left">
              <p className="text-stone-200 leading-relaxed">{scenario?.briefing}</p>
            </div>

            <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-4">
              <h4 className="font-bold text-red-400 mb-2">{TranslationService.t('cognitive.warning')}</h4>
              <p className="text-stone-300 text-sm">
                {TranslationService.t('cognitive.evidence_contradicts')}
              </p>
            </div>

            <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4">
              <h4 className="font-bold text-amber-400 mb-2">{TranslationService.t('cognitive.how_this_works')}</h4>
              <ul className="text-stone-300 text-sm space-y-2 text-left">
                <li>1. Evidence will unlock progressively - don't rush</li>
                <li>2. Rate each evidence's reliability and take notes</li>
                <li>3. Build a narrative that explains the evidence</li>
                <li>4. I will challenge your narrative - defend or revise it</li>
                <li>5. There is no single "correct" answer</li>
              </ul>
            </div>

            <button
              onClick={() => setPhase('evidence_review')}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-xl hover:from-amber-500 hover:to-red-500 transition-all"
            >
              {TranslationService.t('cognitive.begin_evidence_review')}
            </button>
          </div>
        );

      case 'evidence_review':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{TranslationService.t('cognitive.evidence_review')}</h3>
              <div className={`px-4 py-2 rounded-lg font-mono ${reviewComplete
                  ? 'bg-green-900/50 text-green-400'
                  : 'bg-stone-800 text-amber-400'
                }`}>
                {reviewComplete
                  ? TranslationService.t('cognitive.all_evidence_revealed')
                  : `${TranslationService.t('cognitive.reviewing')}: ${Math.floor(reviewTimeRemaining / 60)}:${String(reviewTimeRemaining % 60).padStart(2, '0')}`
                }
              </div>
            </div>

            <div className="bg-stone-800/30 border border-stone-700 rounded-xl p-4 text-sm text-stone-400 mb-4">
              <strong>Instructions:</strong> Examine each piece of evidence carefully.
              Rate its reliability (1-5), note any observations, and watch for contradictions.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unlockedEvidence.map(evidence => renderEvidenceCard(evidence))}
            </div>

            {reviewComplete && Object.keys(evidenceRatings).length >= 3 && (
              <button
                onClick={() => setPhase('narrative_building')}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-xl hover:from-amber-500 hover:to-red-500 transition-all"
              >
                Build Narrative
              </button>
            )}

            {reviewComplete && Object.keys(evidenceRatings).length < 3 && (
              <p className="text-center text-stone-500 text-sm">
                Rate at least 3 pieces of evidence before proceeding
              </p>
            )}
          </div>
        );

      case 'narrative_building':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Build Your Narrative</h3>
            <p className="text-stone-400 text-sm">
              Based on the evidence, construct an interpretation of what happened.
              Link evidence pieces together to support your narrative.
            </p>

            {/* Narrative type selection */}
            {scenario?.possibleNarratives && (
              <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
                <div className="text-amber-400 font-bold text-sm mb-3">Possible Interpretations:</div>
                <div className="flex flex-wrap gap-2">
                  {scenario.possibleNarratives.map(n => (
                    <button
                      key={n}
                      onClick={() => setSelectedNarrativeType(n)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedNarrativeType === n
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                        }`}
                    >
                      {n.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Narrative text */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-amber-400 font-bold mb-2">
                Your Interpretation:
              </label>
              <textarea
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                placeholder="Based on the evidence, I believe... The key evidence supporting this is... However, I acknowledge that..."
                className="w-full h-48 bg-stone-900 border border-stone-600 rounded-lg p-3 text-white placeholder-stone-500 resize-none"
              />
              <p className="text-stone-500 text-sm mt-2">
                Reference specific evidence. Acknowledge contradictions and gaps.
              </p>
            </div>

            {/* Confidence slider */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-amber-400 font-bold mb-4">
                How confident are you in this interpretation?
              </label>
              <div className="flex items-center gap-4">
                <span className="text-red-400 text-sm">Very Uncertain</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={confidenceLevel}
                  onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
                  className="flex-1 accent-amber-500"
                />
                <span className="text-green-400 text-sm">Very Confident</span>
              </div>
              <div className="text-center text-2xl font-bold text-amber-400 mt-2">
                {confidenceLevel}%
              </div>
            </div>

            {narrative.length >= 100 && (
              <button
                onClick={() => {
                  setCurrentChallenge(generateChallenge());
                  setPhase('adversarial_challenge');
                }}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold rounded-xl hover:from-red-500 hover:to-amber-500 transition-all"
              >
                Submit for Challenge
              </button>
            )}
          </div>
        );

      case 'adversarial_challenge':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Defend Your Narrative</h3>
              <div className="px-4 py-2 bg-stone-800 rounded-lg">
                <span className="text-stone-400">Challenge</span>
                <span className="ml-2 font-bold text-amber-400">{challengeCount + 1}/{maxChallenges}</span>
              </div>
            </div>

            <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-6">
              <div className="text-red-400 font-bold mb-2">I Challenge Your Interpretation:</div>
              <p className="text-white text-lg">{currentChallenge?.text}</p>
            </div>

            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-amber-400 font-bold mb-2">
                Your Response:
              </label>
              <textarea
                value={challengeResponse}
                onChange={(e) => setChallengeResponse(e.target.value)}
                placeholder="I defend my position because... OR I acknowledge this weakness because..."
                className="w-full h-32 bg-stone-900 border border-stone-600 rounded-lg p-3 text-white placeholder-stone-500 resize-none"
              />
              <p className="text-stone-500 text-sm mt-2">
                You may defend, revise, or acknowledge weaknesses. Intellectual honesty is valued.
              </p>
            </div>

            {/* Update confidence after challenge */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <label className="block text-amber-400 font-bold mb-2">
                Has this challenge affected your confidence?
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="text-center text-amber-400 font-bold">{confidenceLevel}%</div>
            </div>

            {challengeResponse.length >= 30 && (
              <button
                onClick={submitChallengeResponse}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-xl hover:from-amber-500 hover:to-red-500 transition-all"
              >
                {challengeCount + 1 < maxChallenges ? 'Submit Response' : 'Final Response'}
              </button>
            )}
          </div>
        );

      case 'defense':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Final Reflection</h3>

            <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4">
              <h4 className="font-bold text-amber-400 mb-2">Name Your Uncertainties</h4>
              <p className="text-stone-300 text-sm mb-4">
                Good reasoning includes knowing what you DON'T know.
                List the things you remain uncertain about.
              </p>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={currentUncertainty}
                  onChange={(e) => setCurrentUncertainty(e.target.value)}
                  placeholder="I'm uncertain about..."
                  className="flex-1 bg-stone-900 border border-stone-600 rounded-lg px-3 py-2 text-white placeholder-stone-500"
                />
                <button
                  onClick={addUncertainty}
                  disabled={currentUncertainty.trim().length < 10}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg disabled:opacity-50"
                >
                  Add
                </button>
              </div>

              {uncertainties.length > 0 && (
                <ul className="space-y-2">
                  {uncertainties.map((u, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-stone-200 text-sm">
                      <span className="text-amber-500">?</span>
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Summary of challenges */}
            <div className="bg-stone-800/50 border border-stone-700 rounded-xl p-4">
              <h4 className="font-bold text-white mb-3">Challenge Summary</h4>
              <div className="space-y-3">
                {challengeHistory.map((ch, idx) => (
                  <div key={idx} className="bg-stone-900/50 rounded-lg p-3">
                    <div className="text-red-400 text-sm mb-1">{ch.challenge.text}</div>
                    <div className="text-stone-300 text-sm">{ch.response}</div>
                  </div>
                ))}
              </div>
            </div>

            {uncertainties.length >= 2 && (
              <button
                onClick={completeSession}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all"
              >
                Complete Session
              </button>
            )}

            {uncertainties.length < 2 && (
              <p className="text-center text-stone-500 text-sm">
                Name at least 2 uncertainties before completing
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-stone-900/90 border border-stone-700 rounded-2xl p-6 min-h-[500px]">
      {/* Phase indicator */}
      <div className="flex items-center gap-2 mb-6">
        {['briefing', 'evidence_review', 'narrative_building', 'adversarial_challenge', 'defense'].map((p, idx) => (
          <div
            key={p}
            className={`flex-1 h-2 rounded-full ${phase === p
                ? 'bg-amber-500'
                : ['briefing', 'evidence_review', 'narrative_building', 'adversarial_challenge', 'defense'].indexOf(phase) > idx
                  ? 'bg-green-600'
                  : 'bg-stone-700'
              }`}
          />
        ))}
      </div>

      {renderPhaseContent()}
    </div>
  );
};

export default ForensicNarrative;
