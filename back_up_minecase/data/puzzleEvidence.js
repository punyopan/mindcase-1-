// Specific evidence for each puzzle that unlocks progressively through minigames
export const puzzleEvidence = {
  // Puzzle 1: The Missing Money
  1: {
    brief: "School fundraiser money ($500) is missing.",
    clues: [
      {
        title: "Timeline - Early Afternoon",
        content: "3:00 PM - Money confirmed in office safe by Secretary Davis\n3:15 PM - Teacher A (Math teacher) left building for dentist appointment\n3:30 PM - Office was empty, no one present",
        icon: "📋"
      },
      {
        title: "Timeline - Late Afternoon",
        content: "4:00 PM - Janitor B cleaned office, noticed safe was closed\n4:30 PM - Janitor B left office, locked door behind him\n4:45 PM - No unusual activity reported",
        icon: "🔬"
      },
      {
        title: "Timeline - Evening Discovery",
        content: "5:00 PM - Principal C arrived to lock up building\n5:10 PM - Principal C opened safe for evening deposit\n5:15 PM - Money discovered missing, panic ensues\n\nKey Detail: Secretary Davis now remembers she may have miscounted at 3pm. Only counted 4 of 5 envelopes.",
        icon: "📄"
      }
    ],
    correctAnswer: "Question the initial premise - verify if money was actually confirmed at 3pm",
    answerHints: ["validate starting assumptions", "verify the premise", "question if theft occurred", "check if money was really there"]
  },

  // Puzzle 2: The Identical Essays
  2: {
    brief: "Two students submitted word-for-word identical essays.",
    clues: [
      {
        title: "Submission Records",
        content: "Student A: Submitted 11:47 PM on due date\nStudent B: Submitted 11:52 PM on same date\n\nBoth students have 4.0 GPAs and clean academic records. This is completely out of character for both.",
        icon: "📋"
      },
      {
        title: "Online Search Results",
        content: "Essay text found word-for-word on 'EssayBank.com' - a paid essay service.\n\nPosted date: 2 years ago by anonymous user 'AcademicHelper2022'\n\nThe essay has been downloaded 147 times according to site statistics.",
        icon: "🔬"
      },
      {
        title: "Student Interviews",
        content: "Student A: 'I wrote it myself using online research sources. I'm shocked it matches.'\n\nStudent B: 'I can show you my draft history and research notes. This is terrifying.'\n\nBoth provided Google Doc revision histories showing genuine writing process over 2 weeks. Grades are due in 24 hours.",
        icon: "📄"
      }
    ],
    correctAnswer: "Both likely copied from same online source unknowingly - investigate EssayBank before punishing students",
    answerHints: ["common source", "both copied unknowingly", "third party source", "investigate essay bank"]
  },

  // Puzzle 3: The Back Row Pattern
  3: {
    brief: "Back-row students score 15% lower on average.",
    clues: [
      {
        title: "Initial Observation",
        content: "Data from 120 students over semester:\n- Front rows (1-2): Average 87%\n- Middle rows (3-4): Average 81%  \n- Back rows (5-6): Average 72%\n\nPattern is consistent across all tests.",
        icon: "📋"
      },
      {
        title: "Student Survey Data",
        content: "Survey of back-row students reveals:\n- 65% report difficulty seeing board clearly\n- 48% wear glasses but don't always bring them\n- 73% say they 'prefer to stay invisible'\n- 82% report they struggle with the subject\n\nMany chose back seats BECAUSE they were already struggling.",
        icon: "🔬"
      },
      {
        title: "Vision Screening Results",
        content: "School nurse conducted vision tests:\n- Back-row students: 58% need vision correction\n- Front-row students: 22% need vision correction\n\nThose with uncorrected vision average 68% vs 84% for others. Seating choice appears to be RESULT of existing struggles, not cause.",
        icon: "📄"
      }
    ],
    correctAnswer: "Correlation not causation - struggling students choose back seats (reverse causation)",
    answerHints: ["reverse causation", "correlation not causation", "struggling students choose back", "vision problems"]
  },

  // Puzzle 4: The Budget Crisis
  4: {
    brief: "School must cut $50,000 by Friday.",
    clues: [
      {
        title: "Option A & B Details",
        content: "Option A: Cut all arts programs\n- Saves: $50,000\n- Impacts: 200 students lose programs\n- Permanent: Cannot restart programs\n\nOption B: Reduce sports funding\n- Saves: $40,000  \n- Impacts: 50 athletes affected\n- Shortfall: Still need $10,000 more",
        icon: "📋"
      },
      {
        title: "Option C - Partial Data",
        content: "Option C: Restructure admin staffing\n- Saves: $50,000 (projected)\n- Impacts: Data 'still being compiled'\n- Timeline: Complete data ready in 48 hours\n\nSuperintendent insists: 'We need a decision TODAY. Can't wait.'",
        icon: "🔬"
      },
      {
        title: "Option C - Complete Data Arrives",
        content: "Complete analysis shows Option C:\n- Saves: $52,000 through consolidation\n- Impacts: Only 3 admin positions (all voluntary early retirement)\n- Students: Zero programs affected\n- Timeline: Ready to implement\n\nWaiting 2 days revealed the best solution. Artificial deadline nearly caused unnecessary harm to 200 students.",
        icon: "📄"
      }
    ],
    correctAnswer: "Push back on deadline and demand complete data for Option C before deciding",
    answerHints: ["wait for complete data", "push back on deadline", "option c might be best", "demand information"]
  },

  // Puzzle 5: The Wonder Method
  5: {
    brief: "Vendor claims 'Method X' improves test scores 20%.",
    clues: [
      {
        title: "Study Sample Details",
        content: "Method X Study Parameters:\n- Participants: 30 honors students (top 10% of school)\n- Duration: 2 weeks  \n- Control group: None mentioned\n\nCurrent school: 60% average students, 25% below average, 15% honors",
        icon: "📋"
      },
      {
        title: "Comparison Benchmark",
        content: "Improvement claimed: 20% increase in scores\n\nCompared to: School's curriculum from 2018 (5 years ago)\n\nYour current curriculum: Updated version from 2022 (already improved)\n\nNo comparison to current methods provided.",
        icon: "🔬"
      },
      {
        title: "Long-term Follow-up",
        content: "Vendor was asked about long-term results:\n\n'We don't have data beyond 2 weeks. Students seemed very engaged initially.'\n\nResearch shows 'novelty effect' - new methods appear better short-term simply because they're new. Effect fades after 4-6 weeks.\n\nMethod was NEVER tested on average students or with current curriculum.",
        icon: "📄"
      }
    ],
    correctAnswer: "Multiple flaws: unrepresentative sample, too short timeframe, wrong comparison group",
    answerHints: ["not representative sample", "timeframe too short", "wrong comparison", "honors students only"]
  }

  // Add more puzzles as needed...
};

export default puzzleEvidence;
