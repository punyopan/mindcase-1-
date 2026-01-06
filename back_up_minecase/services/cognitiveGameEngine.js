/**
 * COGNITIVE RESTORATION GAME ENGINE
 *
 * A brain-training system designed to rebuild critical thinking skills
 * atrophied by AI dependency. This is NOT a reward system - it's a
 * cognitive resistance mechanism.
 *
 * CORE PRINCIPLES:
 * 1. Opacity of Correctness - Never reveal if answers are "right"
 * 2. Evidence-First Architecture - Force observation before interpretation
 * 3. Productive Discomfort - Cognitive ease is the enemy
 * 4. No Speed Incentives - Never reward rapid decisions
 * 5. Adversarial Assistance - Help users attack their own arguments
 */

const CognitiveGameEngine = (function() {
  'use strict';

  // ============================================================================
  // GAME TYPE DEFINITIONS
  // ============================================================================

  const GAME_TYPES = {
    SIGNAL_FIELD: {
      id: 'signal_field',
      name: 'Signal Field',
      description: 'Detect patterns in noisy data without jumping to conclusions',
      cognitiveTargets: ['evidence_gathering', 'hypothesis_formation', 'uncertainty_tolerance'],
      phases: ['observation', 'hypothesis', 'testing', 'synthesis'],
      minObservationTime: 60, // 1 minute minimum before analysis
      dataPoints: { min: 40, max: 60 }
    },
    FORENSIC_NARRATIVE: {
      id: 'forensic_narrative',
      name: 'Forensic Narrative',
      description: 'Build explanations from fragmented evidence while handling contradictions',
      cognitiveTargets: ['causal_reasoning', 'ambiguity_tolerance', 'belief_revision'],
      phases: ['evidence_review', 'narrative_building', 'adversarial_challenge', 'defense'],
      minEvidenceReview: 45, // 45 seconds minimum
      contradictionDensity: 0.3 // 30% of evidence should contradict
    },
    VARIABLE_MANIFOLD: {
      id: 'variable_manifold',
      name: 'Variable Manifold',
      description: 'Navigate complex systems where interventions have multi-variable consequences',
      cognitiveTargets: ['systems_thinking', 'tradeoff_analysis', 'second_order_effects'],
      phases: ['system_exploration', 'intervention', 'consequence_mapping', 'tension_articulation'],
      variables: { min: 6, max: 8 },
      hasWinState: false // Critical: No win state, only trade-offs
    },
    // PREMIUM GAMES
    ASSUMPTION_EXCAVATOR: {
      id: 'assumption_excavator',
      name: 'Assumption Excavator',
      description: 'Uncover hidden assumptions that claims depend on',
      cognitiveTargets: ['premise_identification', 'foundational_skepticism', 'critical_analysis'],
      phases: ['briefing', 'excavation', 'testing', 'foundation'],
      premium: true
    },
    COUNTERFACTUAL_ENGINE: {
      id: 'counterfactual_engine',
      name: 'Counterfactual Engine',
      description: 'Explore alternative histories and understand contingency',
      cognitiveTargets: ['counterfactual_thinking', 'causal_reasoning', 'contingency_awareness'],
      phases: ['briefing', 'mapping', 'counterfactual', 'analysis'],
      premium: true
    },
    PERSPECTIVE_PRISM: {
      id: 'perspective_prism',
      name: 'Perspective Prism',
      description: 'Analyze situations from multiple stakeholder viewpoints',
      cognitiveTargets: ['perspective_taking', 'empathy', 'conflict_recognition'],
      phases: ['briefing', 'perspectives', 'tensions', 'synthesis'],
      premium: true
    }
  };

  // ============================================================================
  // COGNITIVE PRIMITIVES - What we're training
  // ============================================================================

  const COGNITIVE_PRIMITIVES = {
    ambiguity_tolerance: {
      name: 'Ambiguity Tolerance',
      description: 'Ability to function effectively when information is incomplete',
      indicators: {
        positive: ['expresses uncertainty', 'asks clarifying questions', 'holds multiple possibilities'],
        negative: ['demands clear answers', 'forces premature closure', 'ignores contradictions']
      }
    },
    evidence_patience: {
      name: 'Evidence-Gathering Patience',
      description: 'Willingness to collect sufficient data before concluding',
      indicators: {
        positive: ['extends observation phase', 'seeks disconfirming evidence', 'tests assumptions'],
        negative: ['jumps to conclusions', 'selects confirming evidence only', 'skips observation']
      }
    },
    metacognitive_awareness: {
      name: 'Metacognitive Awareness',
      description: 'Ability to observe and articulate own reasoning process',
      indicators: {
        positive: ['explains reasoning steps', 'identifies uncertainty sources', 'recognizes biases'],
        negative: ['cannot explain reasoning', 'unaware of assumptions', 'defensive about conclusions']
      }
    },
    revision_willingness: {
      name: 'Revision Willingness',
      description: 'Openness to changing beliefs when evidence warrants',
      indicators: {
        positive: ['updates beliefs with evidence', 'acknowledges errors', 'considers alternatives'],
        negative: ['rigid defense of initial view', 'dismisses contradictory evidence', 'anchors on first impression']
      }
    },
    causal_skepticism: {
      name: 'Causal Skepticism',
      description: 'Healthy doubt about claimed cause-effect relationships',
      indicators: {
        positive: ['distinguishes correlation from causation', 'seeks mechanisms', 'considers confounds'],
        negative: ['accepts causal claims uncritically', 'ignores alternative explanations', 'post-hoc reasoning']
      }
    }
  };

  // ============================================================================
  // DIAGNOSTIC ASSESSMENT SCENARIOS
  // ============================================================================

  const DIAGNOSTIC_SCENARIOS = [
    {
      id: 'revenue_spike',
      scenario: "A company's revenue increased 40% after launching a new marketing campaign. The CEO credits the campaign's success.",
      question: "What's your assessment process?",
      targets: ['causal_skepticism', 'evidence_patience'],
      evaluation: {
        seeking_more_data: 2,
        considering_alternatives: 2,
        expressing_uncertainty: 1,
        recognizing_confounds: 2,
        accepting_claim: -2
      }
    },
    {
      id: 'expert_claim',
      scenario: "A widely-followed expert on social media claims that a new study 'definitively proves' their controversial position. The post has 100,000 likes.",
      question: "How would you evaluate this claim?",
      targets: ['evidence_patience', 'metacognitive_awareness'],
      evaluation: {
        checking_source: 2,
        examining_methodology: 2,
        noting_social_proof_irrelevance: 1,
        seeking_contrary_evidence: 2,
        accepting_at_face_value: -2
      }
    },
    {
      id: 'policy_deadline',
      scenario: "Your organization must decide between two options by tomorrow. Option A has complete data showing modest benefits. Option B has incomplete data but potentially larger benefits. The deadline was set by someone who wants Option A.",
      question: "How would you approach this decision?",
      targets: ['ambiguity_tolerance', 'revision_willingness'],
      evaluation: {
        questioning_deadline: 2,
        requesting_more_time: 1,
        acknowledging_uncertainty: 2,
        considering_who_set_deadline: 2,
        choosing_option_with_complete_data: 0,
        accepting_artificial_urgency: -2
      }
    }
  ];

  // ============================================================================
  // SIGNAL FIELD SCENARIO GENERATOR
  // ============================================================================

  function generateSignalFieldScenario(difficulty = 'medium', domain = null) {
    const domains = ['education', 'health', 'business', 'technology', 'environment'];
    const selectedDomain = domain || domains[Math.floor(Math.random() * domains.length)];

    const scenarios = {
      education: generateEducationSignalField(difficulty),
      health: generateHealthSignalField(difficulty),
      business: generateBusinessSignalField(difficulty),
      technology: generateTechSignalField(difficulty),
      environment: generateEnvironmentSignalField(difficulty)
    };

    return scenarios[selectedDomain];
  }

  function generateEducationSignalField(difficulty) {
    const dataPointCount = difficulty === 'easy' ? 40 : difficulty === 'medium' ? 50 : 60;
    const noiseLevel = difficulty === 'easy' ? 0.2 : difficulty === 'medium' ? 0.35 : 0.45;

    // Generate student performance data with hidden patterns
    const students = [];
    const hiddenPattern = Math.random() > 0.5 ? 'seating' : 'time_of_day';

    for (let i = 0; i < dataPointCount; i++) {
      const baseScore = 65 + Math.random() * 20;
      const seatPosition = Math.floor(Math.random() * 5); // 0-4 rows
      const classTime = ['morning', 'midday', 'afternoon'][Math.floor(Math.random() * 3)];
      const attendance = 70 + Math.random() * 30;
      const studyHours = Math.random() * 15;
      const priorGrade = 50 + Math.random() * 50;

      // Hidden pattern influence
      let patternEffect = 0;
      if (hiddenPattern === 'seating') {
        patternEffect = (4 - seatPosition) * 3; // Front seats slightly better
      } else {
        patternEffect = classTime === 'morning' ? 5 : classTime === 'midday' ? 0 : -5;
      }

      // Add confounding: prior grade strongly correlates with seat choice
      const confoundEffect = (priorGrade - 50) * 0.3;

      // Add noise
      const noise = (Math.random() - 0.5) * 2 * noiseLevel * 30;

      students.push({
        id: `S${i + 1}`,
        testScore: Math.min(100, Math.max(0, baseScore + patternEffect + confoundEffect + noise)),
        seatPosition: ['Front', 'Front-Mid', 'Middle', 'Back-Mid', 'Back'][seatPosition],
        classTime,
        attendance: Math.round(attendance),
        reportedStudyHours: Math.round(studyHours),
        priorGradeLevel: Math.round(priorGrade),
        extraCurricular: Math.random() > 0.6,
        partTimeJob: Math.random() > 0.7,
        parentsEducation: ['high_school', 'college', 'graduate'][Math.floor(Math.random() * 3)]
      });
    }

    return {
      type: 'signal_field',
      domain: 'education',
      title: 'Student Performance Analysis',
      briefing: "You've been given performance data from a class. School administrators believe they've identified what's causing score differences and want to implement policy changes. Examine the data before they act.",
      dataPoints: students,
      hiddenPatterns: [hiddenPattern],
      redHerrings: ['study_hours', 'extracurricular'], // Appear meaningful but aren't
      confounds: ['prior_grade_affects_seating'],
      correctInsight: "The apparent pattern is confounded by pre-existing differences",
      testingBudget: 3, // Limited number of analyses they can request
      difficulty
    };
  }

  function generateHealthSignalField(difficulty) {
    const dataPointCount = difficulty === 'easy' ? 40 : difficulty === 'medium' ? 50 : 60;
    const noiseLevel = difficulty === 'easy' ? 0.2 : difficulty === 'medium' ? 0.35 : 0.45;

    // Generate health outcome data with hidden patterns
    const patients = [];
    const hiddenPattern = 'time_to_treatment'; // The real factor

    for (let i = 0; i < dataPointCount; i++) {
      const age = 25 + Math.floor(Math.random() * 55);
      const baseOutcome = 70 - (age - 25) * 0.3;
      const treatmentType = ['A', 'B', 'C'][Math.floor(Math.random() * 3)];
      const timeToTreatment = Math.random() * 48; // Hours
      const hospitalSize = ['small', 'medium', 'large'][Math.floor(Math.random() * 3)];
      const insurance = Math.random() > 0.3;

      // Hidden pattern: time to treatment is what really matters
      const patternEffect = (48 - timeToTreatment) * 0.5;

      // Red herring: treatment type appears different but isn't (selection bias)
      const treatmentConfound = treatmentType === 'C' ? 5 : 0; // C used on healthier patients

      // Add noise
      const noise = (Math.random() - 0.5) * 2 * noiseLevel * 25;

      patients.push({
        id: `P${i + 1}`,
        recoveryScore: Math.min(100, Math.max(0, baseOutcome + patternEffect + treatmentConfound + noise)),
        age,
        treatmentType,
        hoursToTreatment: Math.round(timeToTreatment * 10) / 10,
        hospitalSize,
        hasInsurance: insurance,
        comorbidities: Math.floor(Math.random() * 4),
        doctorExperience: Math.floor(Math.random() * 30) + 1
      });
    }

    return {
      type: 'signal_field',
      domain: 'health',
      title: 'Treatment Outcome Analysis',
      briefing: "A hospital board is about to mandate Treatment C based on their analysis showing it has the best outcomes. You have access to the full dataset. What's actually going on?",
      dataPoints: patients,
      hiddenPatterns: ['time_to_treatment'],
      redHerrings: ['treatment_type', 'hospital_size'],
      confounds: ['healthier_patients_get_treatment_C'],
      correctInsight: "Treatment selection is confounded by patient severity",
      testingBudget: 3,
      difficulty
    };
  }

  function generateBusinessSignalField(difficulty) {
    const dataPointCount = difficulty === 'easy' ? 40 : difficulty === 'medium' ? 50 : 60;
    const noiseLevel = difficulty === 'easy' ? 0.2 : difficulty === 'medium' ? 0.35 : 0.45;

    const employees = [];
    const hiddenPattern = 'manager_quality'; // The real factor

    for (let i = 0; i < dataPointCount; i++) {
      const baseProductivity = 60 + Math.random() * 20;
      const workLocation = Math.random() > 0.5 ? 'remote' : 'office';
      const tenure = Math.random() * 10;
      const managerQuality = Math.random() * 100;
      const teamSize = Math.floor(Math.random() * 10) + 2;

      // Hidden pattern: manager quality drives productivity
      const patternEffect = (managerQuality - 50) * 0.3;

      // Confound: good managers more likely to approve remote work
      const remoteConfound = workLocation === 'remote' && managerQuality > 70 ? 5 : 0;

      // Add noise
      const noise = (Math.random() - 0.5) * 2 * noiseLevel * 20;

      employees.push({
        id: `E${i + 1}`,
        productivityScore: Math.min(100, Math.max(0, baseProductivity + patternEffect + remoteConfound + noise)),
        workLocation,
        yearsAtCompany: Math.round(tenure * 10) / 10,
        teamSize,
        meetingsPerWeek: Math.floor(Math.random() * 15) + 1,
        performanceReviews: Math.floor(Math.random() * 5) + 1,
        department: ['engineering', 'sales', 'marketing', 'operations'][Math.floor(Math.random() * 4)],
        managerId: `M${Math.floor(Math.random() * 10) + 1}`,
        trainingHours: Math.floor(Math.random() * 40)
      });
    }

    return {
      type: 'signal_field',
      domain: 'business',
      title: 'Remote Work Productivity Study',
      briefing: "The CEO wants to end remote work because office workers appear more productive. HR has provided this dataset. Analyze it before the policy announcement.",
      dataPoints: employees,
      hiddenPatterns: ['manager_quality'],
      redHerrings: ['work_location', 'meetings_per_week'],
      confounds: ['good_managers_approve_remote'],
      correctInsight: "Work location differences are explained by management quality",
      testingBudget: 3,
      difficulty
    };
  }

  function generateTechSignalField(difficulty) {
    return generateBusinessSignalField(difficulty); // Placeholder - extend later
  }

  function generateEnvironmentSignalField(difficulty) {
    return generateEducationSignalField(difficulty); // Placeholder - extend later
  }

  // ============================================================================
  // FORENSIC NARRATIVE GENERATOR
  // ============================================================================

  // ============================================================================
  // FORENSIC NARRATIVE GENERATOR (PROCEDURAL)
  // ============================================================================

  function generateForensicNarrativeScenario(difficulty = 'medium') {
    const themes = [
      { type: 'corporate', title: 'The Insider Trade', entity: 'TechCorp', asset: 'Merge Data' },
      { type: 'school', title: 'The Exam Leak', entity: 'Oak High', asset: 'Finals Key' },
      { type: 'science', title: 'The Lab Sabotage', entity: 'BioLabs', asset: 'Vaccine Sample' },
      { type: 'community', title: 'The Fund Embezzlement', entity: 'HOA Board', asset: 'Reserve Funds' }
    ];

    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    const suspects = ['Suspect A', 'Suspect B', 'Suspect C'];
    
    // Core truth (hidden from user)
    const culprit = suspects[Math.floor(Math.random() * suspects.length)];
    const complexity = difficulty === 'hard' ? 0.6 : difficulty === 'medium' ? 0.4 : 0.2; // Probability of misleading evidence

    // Generate evidence chain
    const evidenceCount = difficulty === 'hard' ? 12 : difficulty === 'medium' ? 9 : 7;
    const evidence = [];

    // 1. Direct Incriminating Evidence (True but maybe low reliability)
    evidence.push({
      id: 'E1',
      type: 'witness',
      source: 'Key Witness',
      content: `I saw ${culprit} near the ${selectedTheme.asset} storage location around the time of the incident.`,
      reliability: 0.6 + (Math.random() * 0.3), // 0.6 - 0.9
      category: 'placement'
    });

    // 2. Alibis (Some false, some true)
    suspects.forEach((suspect, idx) => {
      const isCulprit = suspect === culprit;
      const hasSolidAlibi = !isCulprit && Math.random() > 0.3;
      
      evidence.push({
        id: `E${idx + 2}`,
        type: 'statement',
        source: suspect,
        content: isCulprit 
          ? `I was nowhere near the ${selectedTheme.asset}. I was working late alone.` // Lie
          : `I was at the cafeteria with colleagues.`, // Truth (usually)
        reliability: 0.5,
        category: 'testimony'
      });

      // 3. Contradiction/Corroboration
      if (hasSolidAlibi) {
        evidence.push({
          id: `E${evidence.length + 10}`,
          type: 'log',
          source: 'Security System',
          content: `${suspect} badge scan confirmed at Cafeteria at time of incident.`,
          reliability: 0.95,
          category: 'physical',
          supports: `E${idx + 2}`
        });
      } else if (isCulprit) {
         // Create contradiction for the culprit
         evidence.push({
          id: `E${evidence.length + 10}`,
          type: 'digital_trace',
          source: 'Server Logs',
          content: `Login detected from ${suspect}'s terminal accessing ${selectedTheme.asset} 5 mins before incident.`,
          reliability: 0.85,
          category: 'digital',
          contradicts: `E${idx + 2}` // Contradicts their alibi statement
        });
      }
    });

    // 4. Red Herrings (Ambiguous evidence pointing elsewhere)
    const redHerringSuspect = suspects.find(s => s !== culprit);
    evidence.push({
      id: 'RX1',
      type: 'circumstantial',
      source: 'HR Records',
      content: `${redHerringSuspect} was recently denied a promotion and was heard complaining.`,
      reliability: 0.4, // Low relevance
      category: 'motive'
    });

    // 5. Procedural Gaps
    const gaps = [
      "No direct video footage of the event itself",
      "Timeline gap of 15 minutes unaccounted for",
      "Potential shared credentials used"
    ];

    // Shuffle evidence
    const shuffledEvidence = evidence.sort(() => Math.random() - 0.5);

    return {
      type: 'forensic_narrative',
      title: selectedTheme.title,
      briefing: `An incident occurred at ${selectedTheme.entity} involving the ${selectedTheme.asset}. Identify the most likely sequence of events.`,
      evidence: shuffledEvidence,
      suspects: suspects,
      gaps: gaps, // Static list for now, could be dynamic
      possibleNarratives: suspects.map(s => `${s} is responsible`),
      adversarialChallenges: [
         "What makes your primary suspect more likely than the others?",
         "Which piece of evidence are you relying on most? Is it reliable?",
         "Could the evidence pointing to your suspect be explained another way?"
      ],
      difficulty
    };
  }

  // ============================================================================
  // VARIABLE MANIFOLD GENERATOR
  // ============================================================================

  // ============================================================================
  // VARIABLE MANIFOLD GENERATOR (PROCEDURAL)
  // ============================================================================

  function generateVariableManifoldScenario(difficulty = 'medium') {
    const themes = [
      {
        id: 'city',
        title: 'Urban Policy Simulator',
        variables: ['Education', 'Police', 'Housing', 'Transit', 'Parks'],
        outcomes: ['Crime Rate', 'GDP Growth', 'Public Health', 'Approval'],
        units: 'M$'
      },
      {
        id: 'ecosystem',
        title: 'Ecosystem Balance',
        variables: ['Predators', 'Herbivores', 'Vegetation', 'Water', 'Insects'],
        outcomes: ['Biodiversity', 'Soil Health', 'Carbon Capture', 'Stability'],
        units: 'Pop'
      },
      {
        id: 'corp',
        title: 'Corporate Strategy',
        variables: ['R&D', 'Marketing', 'Salaries', 'Dividends', 'Ops'],
        outcomes: ['Stock Price', 'Employee Morale', 'Innovation', 'Market Share'],
        units: 'k$'
      }
    ];

    const theme = themes[Math.floor(Math.random() * themes.length)];
    const varCount = difficulty === 'hard' ? 7 : difficulty === 'medium' ? 6 : 5;
    
    // Select subset of variables
    const activeVars = theme.variables.sort(() => Math.random() - 0.5).slice(0, varCount);
    
    // Generate Variables
    const variables = activeVars.map(name => ({
      id: name.toLowerCase().replace(/\s/g, '_'),
      name: name,
      currentValue: 40 + Math.floor(Math.random() * 40),
      range: [0, 100],
      unit: theme.units,
      description: `Resource allocation for ${name}`,
      connections: [] // To be filled
    }));

    // Generate Outcomes (Outputs)
    const outcomes = theme.outcomes.slice(0, 3).map(name => ({
      id: name.toLowerCase().replace(/\s/g, '_'),
      name: name,
      currentValue: 50,
      range: [0, 100],
      unit: 'Index',
      description: `System indicator: ${name}`,
      isOutcome: true,
      connections: []
    }));

    const allNodes = [...variables, ...outcomes];
    const interventionEffects = {};

    // Generate procedural relationships
    variables.forEach(v => {
      interventionEffects[v.id] = {};
      
      // Affects 1-2 other input variables (Trade-offs)
      const otherInput = variables.find(v2 => v2.id !== v.id);
      if (otherInput && Math.random() > 0.3) {
        interventionEffects[v.id][otherInput.id] = (Math.random() - 0.5) * 0.5; // Small interaction
        v.connections.push(otherInput.id);
      }

      // Affects 2-3 outcomes
      outcomes.forEach(o => {
        if (Math.random() > 0.4) {
          const effect = (Math.random() * 1.5) - 0.5; // -0.5 to +1.0 (mostly positive but some tradeoffs)
          interventionEffects[v.id][o.id] = parseFloat(effect.toFixed(2));
          v.connections.push(o.id);
        }
      });
    });

    return {
      type: 'variable_manifold',
      title: theme.title,
      briefing: `You are managing a complex ${theme.id} system. Interventions in one area will cascade to others. Find a stable configuration.`,
      variables: allNodes,
      interventionEffects: interventionEffects,
      constraints: [
        { type: 'resource', limit: variables.reduce((sum, v) => sum + v.currentValue, 0) + 20, description: 'Total resources limited' }
      ],
      tensions: [
        { pair: [variables[0].id, outcomes[0].id], nature: 'Direct Trade-off' },
        { pair: [variables[1].id, variables[0].id], nature: 'Resource Competition' }
      ],
      irresolvableTensions: [
         "Maximizing all outcomes is mathematically impossible.",
         "Rapid changes may destabilize the system."
      ],
      difficulty
    };
  }

  // ============================================================================
  // ASSUMPTION EXCAVATOR GENERATOR (PREMIUM)
  // ============================================================================

  function generateAssumptionExcavatorScenario(difficulty = 'medium') {
    const scenarios = [
      {
        claim: "Companies that adopt AI will outperform their competitors within 5 years.",
        source: "Tech Industry Report, 2024",
        domain: "business",
        hiddenAssumptions: [
          { type: 'factual', text: 'AI technology will continue to improve at current rates' },
          { type: 'causal', text: 'AI adoption directly causes competitive advantage' },
          { type: 'scope', text: 'All industries benefit equally from AI' },
          { type: 'temporal', text: '5 years is sufficient time for AI benefits to materialize' },
          { type: 'definitional', text: '"Outperform" is measured by traditional financial metrics' }
        ]
      },
      {
        claim: "Remote work is here to stay and will become the dominant work model.",
        source: "Future of Work Study",
        domain: "work",
        hiddenAssumptions: [
          { type: 'factual', text: 'Technology infrastructure will support widespread remote work' },
          { type: 'value', text: 'Workers prefer flexibility over in-person collaboration' },
          { type: 'causal', text: 'Productivity remains equal or higher when remote' },
          { type: 'scope', text: 'Most jobs can be done remotely' },
          { type: 'temporal', text: 'Current trends will continue indefinitely' }
        ]
      },
      {
        claim: "Investing in education is the best way to reduce inequality.",
        source: "Economic Policy Brief",
        domain: "policy",
        hiddenAssumptions: [
          { type: 'causal', text: 'Education directly leads to economic mobility' },
          { type: 'definitional', text: 'Inequality primarily means income inequality' },
          { type: 'scope', text: 'All forms of education are equally effective' },
          { type: 'value', text: 'Reducing inequality should be a primary goal' },
          { type: 'factual', text: 'Jobs requiring education will be available' }
        ]
      },
      {
        claim: "Eating organic food is healthier and better for the environment.",
        source: "Wellness Magazine",
        domain: "health",
        hiddenAssumptions: [
          { type: 'factual', text: 'Organic food has higher nutritional value' },
          { type: 'causal', text: 'Organic farming practices improve environmental outcomes' },
          { type: 'scope', text: 'All organic certifications maintain equal standards' },
          { type: 'definitional', text: '"Healthy" means the same thing for everyone' },
          { type: 'value', text: 'Environmental and health benefits outweigh cost differences' }
        ]
      },
      {
        claim: "Social media is destroying democracy by spreading misinformation.",
        source: "Political Analysis",
        domain: "society",
        hiddenAssumptions: [
          { type: 'causal', text: 'Social media causes belief change rather than reinforcing existing beliefs' },
          { type: 'temporal', text: 'Democracy was healthier before social media' },
          { type: 'definitional', text: 'Misinformation is objectively identifiable' },
          { type: 'scope', text: 'Social media effects are uniform across platforms and demographics' },
          { type: 'factual', text: 'Traditional media was more reliable' }
        ]
      }
    ];

    const selected = scenarios[Math.floor(Math.random() * scenarios.length)];

    return {
      type: 'assumption_excavator',
      title: 'Assumption Excavation',
      claim: selected.claim,
      source: selected.source,
      domain: selected.domain,
      hiddenAssumptions: selected.hiddenAssumptions,
      difficulty
    };
  }

  // ============================================================================
  // COUNTERFACTUAL ENGINE GENERATOR (PREMIUM)
  // ============================================================================

  function generateCounterfactualEngineScenario(difficulty = 'medium') {
    const scenarios = [
      {
        outcome: "Netflix became the dominant streaming platform, disrupting the entire entertainment industry.",
        context: "In 2007, Netflix shifted from DVD rentals to streaming. Blockbuster declined its offer to buy Netflix for $50 million.",
        domain: "business",
        keyDependencies: [
          { factor: 'Broadband internet adoption', type: 'enabling' },
          { factor: 'Netflix original content investment', type: 'contributing' },
          { factor: 'Blockbuster rejection of acquisition', type: 'necessary' },
          { factor: 'Smartphone/smart TV proliferation', type: 'accelerating' }
        ]
      },
      {
        outcome: "The 2008 financial crisis became a global recession, affecting millions of lives.",
        context: "A combination of subprime mortgage lending, complex financial instruments, and regulatory gaps led to systemic failure.",
        domain: "economics",
        keyDependencies: [
          { factor: 'Deregulation of financial derivatives', type: 'enabling' },
          { factor: 'Housing bubble formation', type: 'necessary' },
          { factor: 'Rating agency failures', type: 'contributing' },
          { factor: 'Lehman Brothers bankruptcy', type: 'accelerating' }
        ]
      },
      {
        outcome: "The COVID-19 pandemic transformed how the world works, learns, and socializes.",
        context: "A novel coronavirus emerged in late 2019 and spread globally within months.",
        domain: "society",
        keyDependencies: [
          { factor: 'Initial outbreak response delays', type: 'accelerating' },
          { factor: 'Global interconnected travel', type: 'enabling' },
          { factor: 'Novel pathogen with specific characteristics', type: 'necessary' },
          { factor: 'Pre-existing technology for remote work', type: 'enabling' }
        ]
      },
      {
        outcome: "SpaceX successfully landed reusable rockets, transforming the economics of space travel.",
        context: "After multiple failures, SpaceX achieved the first successful orbital rocket landing in 2015.",
        domain: "technology",
        keyDependencies: [
          { factor: 'Elon Musk continued funding despite failures', type: 'necessary' },
          { factor: 'NASA commercial contracts', type: 'enabling' },
          { factor: 'Engineering team persistence', type: 'contributing' },
          { factor: 'Advances in autonomous control systems', type: 'enabling' }
        ]
      },
      {
        outcome: "Brexit happened - the UK voted to leave the European Union.",
        context: "In 2016, 52% of UK voters chose to leave the EU, leading to years of political upheaval.",
        domain: "politics",
        keyDependencies: [
          { factor: 'David Cameron calling referendum', type: 'necessary' },
          { factor: 'Economic anxiety and immigration concerns', type: 'contributing' },
          { factor: 'Leave campaign messaging', type: 'contributing' },
          { factor: 'Low youth voter turnout', type: 'contributing' }
        ]
      }
    ];

    const selected = scenarios[Math.floor(Math.random() * scenarios.length)];

    return {
      type: 'counterfactual_engine',
      title: 'Counterfactual Analysis',
      outcome: selected.outcome,
      context: selected.context,
      domain: selected.domain,
      keyDependencies: selected.keyDependencies,
      difficulty
    };
  }

  // ============================================================================
  // PERSPECTIVE PRISM GENERATOR (PREMIUM)
  // ============================================================================

  function generatePerspectivePrismScenario(difficulty = 'medium') {
    const scenarios = [
      {
        title: "The Factory Closure",
        situation: "A multinational corporation announces it will close a factory employing 500 workers in a small town to move production overseas. The town's economy depends heavily on this factory.",
        stakeholders: [
          {
            name: "Factory Worker",
            role: "20-year employee facing layoff",
            emoji: "👷",
            background: "Has a mortgage, kids in local school, aging parents to support. Skills are specific to this industry."
          },
          {
            name: "CEO",
            role: "Corporate executive",
            emoji: "👔",
            background: "Responsible to shareholders for profitability. Competitor just moved production overseas and prices are dropping."
          },
          {
            name: "Mayor",
            role: "Town leader",
            emoji: "🏛️",
            background: "Elected to protect community interests. Tax revenue from factory funds local services. Facing re-election."
          },
          {
            name: "Consumer",
            role: "Product buyer",
            emoji: "🛒",
            background: "Wants affordable products. Has limited budget. May not know where products are made."
          }
        ]
      },
      {
        title: "The Gentrification Dilemma",
        situation: "A historically low-income neighborhood is experiencing rapid development. New restaurants, tech offices, and luxury apartments are replacing older businesses. Rents are rising sharply.",
        stakeholders: [
          {
            name: "Long-term Resident",
            role: "30-year neighborhood resident",
            emoji: "🏠",
            background: "Renting on fixed income. Established community ties. Facing possible displacement."
          },
          {
            name: "Developer",
            role: "Real estate investor",
            emoji: "🏗️",
            background: "Sees opportunity to revitalize neglected area. Taking financial risk. Creating jobs and improving infrastructure."
          },
          {
            name: "New Resident",
            role: "Young professional newcomer",
            emoji: "💼",
            background: "Attracted by urban living and improving amenities. Paying high rent. Contributing to local economy."
          },
          {
            name: "Small Business Owner",
            role: "Local shop owner for 15 years",
            emoji: "🏪",
            background: "Seeing new customers but also rising commercial rent. Uncertain whether to stay or sell."
          }
        ]
      },
      {
        title: "The Vaccine Mandate",
        situation: "A company announces a COVID-19 vaccine mandate for all employees. Those who refuse will be terminated. The company provides essential services.",
        stakeholders: [
          {
            name: "Vaccinated Employee",
            role: "Supports the mandate",
            emoji: "💉",
            background: "Worried about health risks from unvaccinated colleagues. Has immunocompromised family member at home."
          },
          {
            name: "Vaccine-Hesitant Employee",
            role: "Refuses vaccination",
            emoji: "🚫",
            background: "Has concerns about vaccine safety or personal beliefs. Been loyal employee for 10 years. Faces losing livelihood."
          },
          {
            name: "HR Director",
            role: "Policy implementer",
            emoji: "📋",
            background: "Must balance legal requirements, employee relations, and operational continuity. Facing staff shortages."
          },
          {
            name: "Customer",
            role: "Service recipient",
            emoji: "👥",
            background: "Wants reliable service. May have health concerns. May have opinions on company policy."
          }
        ]
      },
      {
        title: "The AI Replacement",
        situation: "A company plans to replace its customer service team with AI chatbots. The technology can handle 80% of queries and operate 24/7 at a fraction of the cost.",
        stakeholders: [
          {
            name: "Customer Service Rep",
            role: "Employee being replaced",
            emoji: "🎧",
            background: "Single parent with limited other job options. Has specialized skills in customer relations."
          },
          {
            name: "CTO",
            role: "Technology decision maker",
            emoji: "🖥️",
            background: "Believes AI will improve efficiency and customer satisfaction. Under pressure to modernize."
          },
          {
            name: "Customer",
            role: "Regular service user",
            emoji: "📞",
            background: "Values quick resolution. Sometimes needs human understanding for complex issues."
          },
          {
            name: "Investor",
            role: "Shareholder",
            emoji: "📈",
            background: "Wants returns on investment. Comparing company efficiency to competitors."
          }
        ]
      }
    ];

    const selected = scenarios[Math.floor(Math.random() * scenarios.length)];

    return {
      type: 'perspective_prism',
      title: selected.title,
      situation: selected.situation,
      stakeholders: selected.stakeholders,
      difficulty
    };
  }

  // ============================================================================
  // PLAYER STATE TRACKING
  // ============================================================================

  function createPlayerState(userId) {
    return {
      userId,
      diagnostic: {
        completed: false,
        scores: {},
        weakestPrimitives: [],
        assessmentDate: null
      },
      cognitiveProfile: {
        ambiguity_tolerance: { score: 50, sessions: 0, trend: 'unknown' },
        evidence_patience: { score: 50, sessions: 0, trend: 'unknown' },
        metacognitive_awareness: { score: 50, sessions: 0, trend: 'unknown' },
        revision_willingness: { score: 50, sessions: 0, trend: 'unknown' },
        causal_skepticism: { score: 50, sessions: 0, trend: 'unknown' }
      },
      sessionHistory: [],
      currentScenario: null,
      observationLog: [],
      hypothesisHistory: [],
      beliefRevisions: []
    };
  }

  function loadPlayerState(userId) {
    try {
      const stored = localStorage.getItem(`cognitive_state_${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load cognitive state:', e);
    }
    return createPlayerState(userId);
  }

  function savePlayerState(state) {
    try {
      localStorage.setItem(`cognitive_state_${state.userId}`, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save cognitive state:', e);
    }
  }

  // ============================================================================
  // REASONING EVALUATOR - Process over outcomes
  // ============================================================================

  function evaluateReasoningProcess(response, context) {
    const evaluation = {
      observationEvidence: 0, // Did they reference specific data?
      uncertaintyExpression: 0, // Did they express what they don't know?
      alternativesConsidered: 0, // Did they think of other explanations?
      assumptionsIdentified: 0, // Did they name their assumptions?
      evidenceToClaimRatio: 0, // More evidence than claims?
      prematureCommitment: false, // Did they decide too fast?
      processQuality: 0,
      feedback: []
    };

    const text = response.toLowerCase();
    const wordCount = response.split(/\s+/).length;

    // Check for evidence references
    const dataReferences = (text.match(/\b(data|student|patient|employee|point|case|example|instance|evidence|shows|indicates)\b/g) || []).length;
    evaluation.observationEvidence = Math.min(100, dataReferences * 15);

    // Check for uncertainty expression
    const uncertaintyMarkers = [
      /\b(uncertain|unclear|don't know|not sure|might|could|possibly|perhaps|may|seems)\b/gi,
      /\b(need more|missing|incomplete|insufficient|unknown)\b/gi,
      /\b\?/g
    ];
    const uncertaintyCount = uncertaintyMarkers.reduce((sum, pattern) => sum + (text.match(pattern) || []).length, 0);
    evaluation.uncertaintyExpression = Math.min(100, uncertaintyCount * 20);

    // Check for alternatives
    const alternativeMarkers = (text.match(/\b(alternatively|or|another|other|instead|could also|might also|different)\b/gi) || []).length;
    evaluation.alternativesConsidered = Math.min(100, alternativeMarkers * 25);

    // Check for assumption identification
    const assumptionMarkers = (text.match(/\b(assumes?|assuming|presuming|taking for granted|if we accept)\b/gi) || []).length;
    evaluation.assumptionsIdentified = Math.min(100, assumptionMarkers * 30);

    // Evidence to claim ratio
    const claimMarkers = (text.match(/\b(therefore|thus|clearly|obviously|definitely|must be|is the cause|proves)\b/gi) || []).length;
    if (claimMarkers > 0) {
      evaluation.evidenceToClaimRatio = Math.min(100, (dataReferences / claimMarkers) * 25);
    } else {
      evaluation.evidenceToClaimRatio = dataReferences > 0 ? 70 : 30;
    }

    // Check for premature commitment (strong claims without evidence)
    const strongClaims = (text.match(/\b(clearly|obviously|definitely|certainly|must be|is the answer|the cause is)\b/gi) || []).length;
    if (strongClaims > 0 && dataReferences < 3) {
      evaluation.prematureCommitment = true;
      evaluation.feedback.push("You've made strong claims without referencing much specific evidence. What data supports this conclusion?");
    }

    // Calculate overall process quality
    const weights = {
      observationEvidence: 0.25,
      uncertaintyExpression: 0.2,
      alternativesConsidered: 0.2,
      assumptionsIdentified: 0.15,
      evidenceToClaimRatio: 0.2
    };

    evaluation.processQuality = Math.round(
      evaluation.observationEvidence * weights.observationEvidence +
      evaluation.uncertaintyExpression * weights.uncertaintyExpression +
      evaluation.alternativesConsidered * weights.alternativesConsidered +
      evaluation.assumptionsIdentified * weights.assumptionsIdentified +
      evaluation.evidenceToClaimRatio * weights.evidenceToClaimRatio
    );

    // Generate feedback based on weaknesses
    if (evaluation.uncertaintyExpression < 30) {
      evaluation.feedback.push("Your response expresses more certainty than the evidence warrants. What don't you know?");
    }
    if (evaluation.alternativesConsidered < 30) {
      evaluation.feedback.push("You haven't considered alternative explanations. What else could explain this pattern?");
    }
    if (evaluation.assumptionsIdentified < 20) {
      evaluation.feedback.push("What assumptions are you making? Try to name them explicitly.");
    }
    if (evaluation.observationEvidence < 40) {
      evaluation.feedback.push("Reference specific data points to support your reasoning.");
    }

    return evaluation;
  }

  // ============================================================================
  // ADVERSARIAL ASSISTANCE
  // ============================================================================

  function generateAdversarialChallenge(hypothesis, scenario, context) {
    const challenges = [];

    // Challenge based on scenario type
    if (scenario.type === 'signal_field') {
      challenges.push(
        `You found a pattern involving ${hypothesis.variable}. What confounding factors could explain this same pattern?`,
        `How many data points support this vs. contradict it? Did you count?`,
        `If this pattern is real, what would you expect to see in other variables? Do you see it?`
      );
    } else if (scenario.type === 'forensic_narrative') {
      challenges.push(
        `What evidence directly contradicts this narrative?`,
        `You're weighting some evidence more than others. Why? What makes that evidence more reliable?`,
        `If you're wrong, what's the most likely alternative?`
      );
    } else if (scenario.type === 'variable_manifold') {
      challenges.push(
        `You've improved ${hypothesis.variable}, but at what cost to other variables?`,
        `Who loses in this configuration? Have you considered their perspective?`,
        `What happens if your assumptions about the relationships are wrong?`
      );
    }

    // Add generic metacognitive challenges
    challenges.push(
      "What would change your mind about this conclusion?",
      "On a scale of 1-10, how confident are you? What would make you more confident?",
      "What's the strongest argument against your position?"
    );

    return challenges[Math.floor(Math.random() * challenges.length)];
  }

  // ============================================================================
  // REFLECTIVE SYNTHESIS
  // ============================================================================

  function generateReflectiveQuestions(sessionData) {
    return [
      {
        question: "What did you believe at the start of this scenario? How did your belief change?",
        purpose: 'Track belief revision',
        evaluates: 'revision_willingness'
      },
      {
        question: "Which piece of evidence most influenced your thinking? Why that one specifically?",
        purpose: 'Identify evidence weighting',
        evaluates: 'metacognitive_awareness'
      },
      {
        question: "Where were you most certain during this scenario? Looking back, should you have been more uncertain?",
        purpose: 'Calibration awareness',
        evaluates: 'ambiguity_tolerance'
      },
      {
        question: "If you replayed this scenario, what would you investigate first? What would you investigate differently?",
        purpose: 'Process improvement',
        evaluates: 'evidence_patience'
      }
    ];
  }

  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================

  function startSession(userId, gameType = null) {
    const state = loadPlayerState(userId);

    // Determine appropriate game type based on weakest cognitive primitive
    if (!gameType && state.diagnostic.completed) {
      const weakest = state.diagnostic.weakestPrimitives[0];
      gameType = recommendGameType(weakest);
    }

    // Default to signal field if no other selection
    gameType = gameType || 'signal_field';

    // Generate scenario
    let scenario;
    switch (gameType) {
      case 'signal_field':
        scenario = generateSignalFieldScenario('medium');
        break;
      case 'forensic_narrative':
        scenario = generateForensicNarrativeScenario('medium');
        break;
      case 'variable_manifold':
        scenario = generateVariableManifoldScenario('medium');
        break;
      default:
        scenario = generateSignalFieldScenario('medium');
    }

    state.currentScenario = scenario;
    state.sessionHistory.push({
      startTime: Date.now(),
      gameType,
      scenario: scenario.title
    });

    savePlayerState(state);

    return {
      scenario,
      state
    };
  }

  function recommendGameType(weakPrimitive) {
    const recommendations = {
      'ambiguity_tolerance': 'forensic_narrative',
      'evidence_patience': 'signal_field',
      'metacognitive_awareness': 'forensic_narrative',
      'revision_willingness': 'forensic_narrative',
      'causal_skepticism': 'signal_field'
    };
    return recommendations[weakPrimitive] || 'signal_field';
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  return {
    // Types and constants
    GAME_TYPES,
    COGNITIVE_PRIMITIVES,
    DIAGNOSTIC_SCENARIOS,

    // Generators
    generateSignalFieldScenario,
    generateForensicNarrativeScenario,
    generateVariableManifoldScenario,
    // Premium Generators
    generateAssumptionExcavatorScenario,
    generateCounterfactualEngineScenario,
    generatePerspectivePrismScenario,

    // Player state
    createPlayerState,
    loadPlayerState,
    savePlayerState,

    // Session management
    startSession,
    recommendGameType,

    // Evaluation
    evaluateReasoningProcess,
    generateAdversarialChallenge,
    generateReflectiveQuestions
  };
})();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CognitiveGameEngine };
}

// Make available globally
if (typeof window !== 'undefined') {
  window.CognitiveGameEngine = CognitiveGameEngine;
}
