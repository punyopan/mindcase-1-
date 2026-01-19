/**
 * RIDDLE MARATHON ANSWER KEYS
 *
 * Puzzle-specific grading criteria for accurate evaluation.
 * Each puzzle defines what elements MUST be present for full credit.
 *
 * Structure:
 * - requiredConcepts: Keywords that MUST appear (any match = points)
 * - coreAnswer: The essential solution elements (weighted heavily)
 * - correctConclusion: The final answer/number/result
 * - bonusInsights: Extra credit for deeper understanding
 * - wrongAnswerPatterns: Common mistakes to detect
 */

export const riddleAnswerKeys = {
  // ============================================================================
  // PUZZLE 100: The 3 Bulbs & 3 Switches
  // ============================================================================
  100: {
    title: "The 3 Bulbs & 3 Switches",
    // PUZZLE CONTEXT: Terms that indicate user is answering THIS puzzle (not another)
    puzzleContext: ["bulb", "switch", "light", "room"],
    requiredConcepts: [
      ["heat", "warm", "hot", "temperature"],  // Must use heat dimension
      ["on", "off"],                            // Binary state
      ["wait", "leave", "time", "minutes"]      // Time element
    ],
    coreAnswer: [
      { element: "turn one switch on and wait", patterns: ["turn.*on.*wait", "leave.*on", "switch.*on.*time"], weight: 25 },
      { element: "turn it off before entering", patterns: ["turn.*off", "switch.*off.*enter", "off.*then"], weight: 15 },
      { element: "turn second switch on", patterns: ["second.*on", "another.*on", "turn.*2.*on", "switch 2"], weight: 15 },
      { element: "warm bulb = first switch", patterns: ["warm.*switch", "hot.*first", "warm.*1", "heat.*switch 1"], weight: 20 },
      { element: "on bulb = second switch", patterns: ["on.*switch 2", "lit.*second", "on.*2"], weight: 15 },
      { element: "cold/off = third switch", patterns: ["cold.*3", "cold.*third", "off.*cold"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["heat", "warm", "temperature", "second dimension", "beyond binary", "physical propert"],
      description: "Uses heat as second dimension of information"
    },
    bonusInsights: ["multiple dimensions", "physical properties", "encode", "creative"],
    wrongAnswerPatterns: [
      { pattern: "50.*50|fifty.*fifty|guess", feedback: "This puzzle has a deterministic solution - no guessing needed" },
      { pattern: "can't be done|impossible", feedback: "There is a clever solution using a physical property of bulbs" }
    ]
  },

  // ============================================================================
  // PUZZLE 101: The 8 Balls Problem
  // ============================================================================
  101: {
    title: "The 8 Balls Problem",
    puzzleContext: ["ball", "8 ball", "eight ball", "heavy", "heavier", "scale", "balance"],
    requiredConcepts: [
      ["divide", "group", "split", "separate"],
      ["3", "three"],
      ["weigh", "balance", "scale"]
    ],
    coreAnswer: [
      { element: "divide into groups of 3, 3, 2", patterns: ["3.*3.*2", "three.*three.*two", "groups? of 3"], weight: 30 },
      { element: "weigh 3 vs 3 first", patterns: ["weigh.*3.*3", "compare.*3.*3", "3 against 3", "balance.*two groups"], weight: 25 },
      { element: "if balanced, heavy in group of 2", patterns: ["balance.*group of 2", "equal.*2", "balanced.*remaining"], weight: 15 },
      { element: "if unbalanced, take heavier group", patterns: ["heavier.*group", "unbalanced.*heavy", "tips.*heavy"], weight: 15 },
      { element: "second weigh: 1 vs 1 from heavy group", patterns: ["1.*vs.*1", "one.*against.*one", "weigh.*2.*from.*3", "compare.*two.*ball"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["2 weighings", "two weighings", "ternary", "divide.*3", "three way"],
      description: "Solved in exactly 2 weighings using ternary division"
    },
    bonusInsights: ["ternary", "information theory", "divide and conquer", "optimal", "log base 3"],
    wrongAnswerPatterns: [
      { pattern: "4 groups|divide.*4|binary", feedback: "Binary division requires more weighings. Think about dividing into 3 groups." },
      { pattern: "3 weighings|three weighings", feedback: "It can be done in just 2 weighings with the right approach." }
    ]
  },

  // ============================================================================
  // PUZZLE 102: Two Eggs and 100 Floors
  // ============================================================================
  102: {
    title: "Two Eggs and 100 Floors",
    puzzleContext: ["egg", "floor", "building", "drop", "break", "100 floor"],
    requiredConcepts: [
      ["14", "fourteen"],
      ["drop", "floor", "level"]
    ],
    coreAnswer: [
      { element: "answer is 14 drops", patterns: ["14 drops", "fourteen drops", "answer.*14", "minimum.*14"], weight: 35 },
      { element: "start at floor 14", patterns: ["floor 14", "start.*14", "first.*14", "drop.*14"], weight: 20 },
      { element: "decreasing intervals", patterns: ["decreas", "14.*13.*12", "reduce.*gap", "n-1", "one less"], weight: 20 },
      { element: "triangular number logic", patterns: ["triangular", "14\\+13\\+12", "n\\(n\\+1\\)/2", "sum.*1 to 14"], weight: 15 },
      { element: "worst case analysis", patterns: ["worst case", "maximum", "guarantee"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["14", "fourteen"],
      description: "14 drops minimum in worst case"
    },
    bonusInsights: ["triangular number", "equalize risk", "dynamic", "optimization"],
    wrongAnswerPatterns: [
      { pattern: "binary|half|50", feedback: "Binary search doesn't work optimally with limited eggs. Consider triangular numbers." },
      { pattern: "10 drops|7 drops|less than 14", feedback: "The mathematical minimum for 100 floors with 2 eggs is 14 drops." }
    ]
  },

  // ============================================================================
  // PUZZLE 103: The Monty Hall Problem
  // ============================================================================
  103: {
    title: "The Monty Hall Problem",
    puzzleContext: ["door", "monty", "goat", "car", "host", "game show", "prize"],
    requiredConcepts: [
      ["switch", "change", "swap"],
      ["2/3", "two.?third", "67", "66"]
    ],
    coreAnswer: [
      { element: "always switch", patterns: ["always switch", "should switch", "switch door", "change.*door"], weight: 30 },
      { element: "switching wins 2/3", patterns: ["2/3", "two.?thirds?", "67%", "66\\.?6"], weight: 25 },
      { element: "staying wins only 1/3", patterns: ["1/3.*stay", "stay.*1/3", "one.?third.*stay", "33%"], weight: 15 },
      { element: "initial pick 1/3 chance", patterns: ["initial.*1/3", "first.*1/3", "pick.*1/3", "start.*1/3"], weight: 15 },
      { element: "host's action transfers probability", patterns: ["host.*know", "host.*reveal", "transfer.*prob", "concentrate"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["switch", "2/3", "two third", "always switch"],
      description: "Always switch - wins 2/3 of the time"
    },
    bonusInsights: ["conditional probability", "bayesian", "information", "host.*constraint"],
    wrongAnswerPatterns: [
      { pattern: "50.*50|fifty.*fifty|doesn't matter|same chance|equal", feedback: "Common mistake! The probabilities are NOT 50/50. The host's knowledge changes the odds." },
      { pattern: "stay|don't switch|keep", feedback: "Staying only wins 1/3 of the time. Switching doubles your chances to 2/3." }
    ]
  },

  // ============================================================================
  // PUZZLE 104: The Burning Rope Timer
  // ============================================================================
  104: {
    title: "The Burning Rope Timer",
    puzzleContext: ["rope", "burn", "fuse", "fire", "light", "timer", "minute"],
    requiredConcepts: [
      ["both ends", "two ends"],
      ["45", "forty.?five"],
      ["30", "15", "thirty", "fifteen"]
    ],
    coreAnswer: [
      { element: "light rope A from both ends", patterns: ["rope.*both ends", "light.*both", "both ends.*first", "A.*both"], weight: 25 },
      { element: "light rope B from one end simultaneously", patterns: ["rope B.*one end", "B.*one.*same time", "simultaneously", "at the same time"], weight: 20 },
      { element: "rope A burns in 30 minutes", patterns: ["30 minutes", "half hour", "A.*30", "burns.*30"], weight: 15 },
      { element: "when A done, light other end of B", patterns: ["when.*done.*light.*B", "A.*out.*B.*both", "then.*light.*other end"], weight: 25 },
      { element: "30 + 15 = 45", patterns: ["30.*15.*45", "30\\+15", "thirty.*fifteen.*forty"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["45 minute", "both ends.*halve", "30.*15"],
      description: "30 minutes + 15 minutes = 45 minutes total"
    },
    bonusInsights: ["halves remaining time", "non-uniform rate", "independent of burn rate"],
    wrongAnswerPatterns: [
      { pattern: "cut.*rope|measure.*half", feedback: "You can't measure or cut - the ropes burn at non-uniform rates!" },
      { pattern: "3/4|three quarter", feedback: "You can't measure 3/4 directly because of non-uniform burn rates. Use both ends!" }
    ]
  },

  // ============================================================================
  // PUZZLE 105: Pirates and Gold Coins
  // ============================================================================
  105: {
    title: "Pirates and Gold Coins",
    puzzleContext: ["pirate", "gold", "coin", "vote", "treasure", "captain"],
    requiredConcepts: [
      ["98", "ninety.?eight"],
      ["backward", "reverse", "work.*back", "last.*first"]
    ],
    coreAnswer: [
      { element: "A gets 98 coins", patterns: ["A.*98", "98.*coins.*A", "pirate A.*98", "98 for A"], weight: 30 },
      { element: "B gets 0", patterns: ["B.*0", "B.*nothing", "B gets 0", "zero.*B"], weight: 10 },
      { element: "C gets 1", patterns: ["C.*1", "C gets 1", "1 coin.*C", "one.*C"], weight: 15 },
      { element: "E gets 1", patterns: ["E.*1", "E gets 1", "1 coin.*E", "one.*E"], weight: 15 },
      { element: "work backwards from 2 pirates", patterns: ["backward", "work.*back", "if only.*2", "D and E.*remain", "start.*end"], weight: 20 },
      { element: "needs 3 votes including own", patterns: ["3 votes", "three votes", "own vote", "50%", "majority"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["98.*0.*1.*0.*1", "A=98", "98, 0, 1, 0, 1"],
      description: "Distribution: A=98, B=0, C=1, D=0, E=1"
    },
    bonusInsights: ["backward induction", "game theory", "minimum coalition", "rational"],
    wrongAnswerPatterns: [
      { pattern: "20.*20.*20|equal|fair|split", feedback: "Pirates are selfish and logical! They won't accept equal splits when they can get more." },
      { pattern: "100.*A|A takes all", feedback: "A needs votes from others. He can't take everything without being thrown overboard." }
    ]
  },

  // ============================================================================
  // PUZZLE 106: The Poisoned Wine
  // ============================================================================
  106: {
    title: "The Poisoned Wine",
    puzzleContext: ["wine", "bottle", "poison", "prisoner", "king", "drink"],
    requiredConcepts: [
      ["binary", "bit", "digit"],
      ["10 prisoners", "ten prisoners"],
      ["1024", "2^10", "2\\^10"]
    ],
    coreAnswer: [
      { element: "use binary encoding", patterns: ["binary", "binary encoding", "binary number", "base 2"], weight: 30 },
      { element: "number bottles 0-999", patterns: ["number.*bottles", "label.*bottles", "0.*999", "1000 bottles"], weight: 15 },
      { element: "each prisoner = binary digit", patterns: ["prisoner.*bit", "prisoner.*digit", "assign.*position", "2\\^0.*2\\^9"], weight: 20 },
      { element: "prisoner drinks if their bit is 1", patterns: ["drinks?.*bit.*1", "1.*drink", "position.*has.*1"], weight: 20 },
      { element: "dead prisoners reveal binary number", patterns: ["dead.*binary", "pattern.*dead", "which.*die.*number"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["binary", "10 prisoners.*1024", "2\\^10", "1024 bottles"],
      description: "Binary encoding - 10 prisoners can identify 1024 bottles"
    },
    bonusInsights: ["information theory", "log2", "parallel testing", "combinatorial"],
    wrongAnswerPatterns: [
      { pattern: "one.*prisoner.*one.*bottle|test.*each", feedback: "That would need 1000 prisoners! Think about binary representation." },
      { pattern: "divide.*groups|split.*100", feedback: "The optimal solution uses binary encoding, not sequential grouping." }
    ]
  },

  // ============================================================================
  // PUZZLE 107: 100 Prisoners & Hat Colors
  // ============================================================================
  107: {
    title: "100 Prisoners & Hat Colors",
    puzzleContext: ["hat", "prisoner", "red", "black", "color", "line", "see"],
    requiredConcepts: [
      ["parity", "odd", "even"],
      ["99", "ninety.?nine"],
      ["count", "number of"]
    ],
    coreAnswer: [
      { element: "first prisoner counts and encodes parity", patterns: ["count.*red", "parity", "odd.*red", "even.*red", "first.*count"], weight: 30 },
      { element: "says color based on odd/even", patterns: ["odd.*say.*red", "even.*say.*black", "parity.*signal"], weight: 20 },
      { element: "each prisoner deduces from parity", patterns: ["deduce.*parity", "figure.*parity", "track.*parity", "compare.*count"], weight: 20 },
      { element: "99 guaranteed saved", patterns: ["99", "ninety.?nine", "all but.*first", "guarantee.*99"], weight: 20 },
      { element: "first prisoner sacrifices (50/50)", patterns: ["first.*50", "sacrifice", "first.*random", "back.*50%"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["99", "parity", "odd/even encoding"],
      description: "Parity encoding guarantees 99 saved"
    },
    bonusInsights: ["information transfer", "cooperative", "sacrifice", "encode"],
    wrongAnswerPatterns: [
      { pattern: "all.*saved|100.*saved", feedback: "The first prisoner has no information about their own hat - at best 50/50." },
      { pattern: "agree.*color|everyone say", feedback: "They can only say their own hat color. Think about encoding information." }
    ]
  },

  // ============================================================================
  // PUZZLE 108: The Water Jug Puzzle
  // ============================================================================
  108: {
    title: "The Water Jug Puzzle",
    puzzleContext: ["jug", "water", "liter", "pour", "fill", "empty", "gallon"],
    requiredConcepts: [
      ["4 liters", "4L", "four liters"],
      ["pour", "fill", "empty"],
      ["5", "3", "five", "three"]
    ],
    coreAnswer: [
      { element: "fill 5L jug", patterns: ["fill.*5", "fill.*five", "5L.*full"], weight: 15 },
      { element: "pour into 3L until full (leaves 2L)", patterns: ["pour.*3", "2L.*left", "2.*remain", "5-3=2"], weight: 20 },
      { element: "empty 3L jug", patterns: ["empty.*3", "dump.*3", "pour out.*3"], weight: 10 },
      { element: "transfer 2L to 3L jug", patterns: ["2L.*into.*3", "pour.*2.*into", "transfer.*2"], weight: 15 },
      { element: "fill 5L again", patterns: ["fill.*5.*again", "refill.*5", "5L.*again"], weight: 15 },
      { element: "pour into 3L (needs 1L, leaves 4L)", patterns: ["pour.*3.*full", "1L.*more", "leaves.*4", "4L.*remain"], weight: 25 }
    ],
    correctConclusion: {
      patterns: ["4 liters?", "exactly 4", "4L"],
      description: "Achieves exactly 4 liters in the 5L jug"
    },
    bonusInsights: ["state space", "intermediate states", "GCD", "difference"],
    wrongAnswerPatterns: [
      { pattern: "can't|impossible", feedback: "It's definitely possible! Use intermediate states." }
    ]
  },

  // ============================================================================
  // PUZZLE 109: The Fox, Chicken, and Grain
  // ============================================================================
  109: {
    title: "The Fox, Chicken, and Grain",
    puzzleContext: ["fox", "chicken", "grain", "river", "boat", "cross", "farmer"],
    requiredConcepts: [
      ["chicken", "hen"],
      ["back", "return", "bring back"]
    ],
    coreAnswer: [
      { element: "take chicken first", patterns: ["chicken first", "take chicken", "start.*chicken", "1.*chicken"], weight: 20 },
      { element: "return alone", patterns: ["return alone", "go back", "come back empty"], weight: 10 },
      { element: "take fox across", patterns: ["take fox", "fox across", "bring.*fox"], weight: 15 },
      { element: "bring chicken BACK (key insight)", patterns: ["chicken back", "bring.*chicken.*back", "return.*chicken", "take chicken back"], weight: 30 },
      { element: "take grain across", patterns: ["take grain", "grain across", "bring.*grain"], weight: 10 },
      { element: "return and get chicken", patterns: ["return.*chicken", "finally.*chicken", "last.*chicken"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["7 trips?", "bring.*back", "chicken.*back"],
      description: "7 trips total - key is bringing chicken back"
    },
    bonusInsights: ["backward move", "counterintuitive", "constraint satisfaction", "incompatible pairs"],
    wrongAnswerPatterns: [
      { pattern: "fox.*first|grain.*first", feedback: "Starting with fox or grain leaves dangerous pairs! Start with chicken." },
      { pattern: "can't|impossible|no solution", feedback: "It's solvable! The trick is bringing something back." }
    ]
  },

  // ============================================================================
  // PUZZLE 110: Cheryl's Birthday
  // ============================================================================
  110: {
    title: "Cheryl's Birthday",
    puzzleContext: ["cheryl", "birthday", "albert", "bernard", "month", "day", "date"],
    requiredConcepts: [
      ["july", "16"],
      ["eliminate", "rule out", "can't be"]
    ],
    coreAnswer: [
      { element: "answer is July 16", patterns: ["july 16", "july.*16", "16.*july", "answer.*july"], weight: 35 },
      { element: "eliminate May and June (18, 19 unique)", patterns: ["eliminate may", "eliminate june", "not may", "not june", "18.*19.*unique"], weight: 20 },
      { element: "Bernard knows = day is unique after elimination", patterns: ["bernard.*knows", "day.*unique", "only one.*month"], weight: 15 },
      { element: "Albert knows = month has only one option left", patterns: ["albert.*knows", "one.*in.*month", "july.*only one"], weight: 15 },
      { element: "14 eliminated (appears twice)", patterns: ["14.*twice", "14.*both", "eliminate.*14", "not 14"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["july 16", "july.*16"],
      description: "July 16"
    },
    bonusInsights: ["meta-reasoning", "knowledge about knowledge", "sequential deduction"],
    wrongAnswerPatterns: [
      { pattern: "august", feedback: "August has two remaining options (15, 17), so Albert couldn't know for certain." },
      { pattern: "may|june", feedback: "May and June are eliminated because they contain unique days (18, 19)." }
    ]
  },

  // ============================================================================
  // PUZZLE 111: The Bridge and Torch
  // ============================================================================
  111: {
    title: "The Bridge and Torch",
    puzzleContext: ["bridge", "torch", "flashlight", "cross", "night", "minute", "person"],
    requiredConcepts: [
      ["17", "seventeen"],
      ["slow.*together", "C.*D together", "5.*10 together"]
    ],
    coreAnswer: [
      { element: "answer is 17 minutes", patterns: ["17 minute", "17 min", "answer.*17", "total.*17"], weight: 30 },
      { element: "A and B cross first (2 min)", patterns: ["A.*B.*first", "1.*2.*cross", "A and B.*2 min"], weight: 15 },
      { element: "A returns (1 min)", patterns: ["A return", "A.*back.*1", "1 min.*return"], weight: 10 },
      { element: "C and D cross together (10 min)", patterns: ["C.*D.*together", "C and D.*10", "slow.*together", "5.*10.*cross"], weight: 25 },
      { element: "B returns (2 min)", patterns: ["B return", "B.*back.*2"], weight: 10 },
      { element: "A and B cross again (2 min)", patterns: ["A.*B.*again", "finally.*A.*B", "A and B.*2"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["17", "2\\+1\\+10\\+2\\+2"],
      description: "17 minutes total"
    },
    bonusInsights: ["non-greedy", "counter-intuitive", "pair slow together", "not shuttle"],
    wrongAnswerPatterns: [
      { pattern: "19|18|20|21", feedback: "The optimal is 17 minutes. Pair the slow people together!" },
      { pattern: "A.*shuttle|fastest.*escort", feedback: "Shuttling with fastest isn't optimal. Pair C and D together!" }
    ]
  },

  // ============================================================================
  // PUZZLE 112: The Mislabeled Jars
  // ============================================================================
  112: {
    title: "The Mislabeled Jars",
    puzzleContext: ["jar", "label", "apple", "orange", "fruit", "pick", "mislabel"],
    requiredConcepts: [
      ["mixed", "mixed jar", "labeled mixed"],
      ["one fruit", "single fruit", "one sample"]
    ],
    coreAnswer: [
      { element: "pick from Mixed-labeled jar", patterns: ["pick.*mixed", "draw.*mixed", "sample.*mixed", "mixed.*jar"], weight: 35 },
      { element: "Mixed jar has only one type (all labels wrong)", patterns: ["only.*apple", "only.*orange", "can't be mixed", "pure"], weight: 20 },
      { element: "deduce other jars by elimination", patterns: ["eliminat", "therefore", "must be", "other.*must"], weight: 20 },
      { element: "maximum information from one sample", patterns: ["one sample", "maximum info", "most info", "one pick"], weight: 15 },
      { element: "all labels wrong constraint", patterns: ["all.*wrong", "all.*incorrect", "none.*correct", "every label.*wrong"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["mixed.*jar", "start.*mixed", "pick.*mixed"],
      description: "Pick from Mixed-labeled jar for maximum information"
    },
    bonusInsights: ["information gain", "certainty propagation", "constraint exploitation"],
    wrongAnswerPatterns: [
      { pattern: "apple.*jar.*first|orange.*jar.*first", feedback: "Starting with Apples or Oranges jar gives less information. Start with Mixed!" },
      { pattern: "two picks|multiple samples", feedback: "You only need ONE pick from the Mixed-labeled jar!" }
    ]
  },

  // ============================================================================
  // PUZZLE 113: The Airplane Seat Problem
  // ============================================================================
  113: {
    title: "The Airplane Seat Problem",
    puzzleContext: ["airplane", "seat", "passenger", "board", "random", "100 passenger"],
    requiredConcepts: [
      ["50%", "1/2", "half", "fifty"],
      ["symmetr", "equal"]
    ],
    coreAnswer: [
      { element: "probability is 50% / 1/2", patterns: ["50%", "1/2", "one half", "50 percent", "half"], weight: 35 },
      { element: "only seat 1 and seat 100 matter", patterns: ["seat 1.*seat 100", "first.*last", "only two.*matter", "#1.*#100"], weight: 25 },
      { element: "chain resolves to one of two seats", patterns: ["chain", "eventually", "resolves", "ends.*with"], weight: 15 },
      { element: "symmetry argument", patterns: ["symmetr", "equally likely", "same chance", "by symmetry"], weight: 15 },
      { element: "works for any number of passengers", patterns: ["any number", "regardless of", "works for n"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["50%", "1/2", "half"],
      description: "Exactly 50% probability"
    },
    bonusInsights: ["markov chain", "elegant", "reduction to essential states"],
    wrongAnswerPatterns: [
      { pattern: "1/100|1%|very low", feedback: "It's not 1/100. The probability is actually 50% due to symmetry!" },
      { pattern: "99/100|99%|almost certain", feedback: "It's not that high. By symmetry, it's exactly 50%." }
    ]
  },

  // ============================================================================
  // PUZZLE 114: 25 Horses Race
  // ============================================================================
  114: {
    title: "25 Horses Race",
    puzzleContext: ["horse", "race", "track", "fastest", "25 horse", "lane"],
    requiredConcepts: [
      ["7", "seven"],
      ["race.*winner", "winners race", "5 winners"]
    ],
    coreAnswer: [
      { element: "answer is 7 races", patterns: ["7 race", "seven race", "answer.*7", "minimum.*7"], weight: 30 },
      { element: "first 5 races with 5 horses each", patterns: ["5 race.*5 horse", "25.*5.*5", "first.*5 race"], weight: 20 },
      { element: "race 6: race all 5 winners", patterns: ["race.*winner", "6th.*winner", "winner.*race", "5 winners"], weight: 20 },
      { element: "race 7: A2, A3, B1, B2, C1", patterns: ["A2.*A3.*B1", "second.*third.*winner", "5 candidates"], weight: 20 },
      { element: "elimination logic for candidates", patterns: ["eliminat", "can only lose to", "at best.*third"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["7 race", "seven race"],
      description: "7 races minimum"
    },
    bonusInsights: ["tournament", "bracket", "candidate elimination", "information optimal"],
    wrongAnswerPatterns: [
      { pattern: "6 race|5 race", feedback: "6 races isn't enough to identify top 3 with certainty. You need 7." },
      { pattern: "8 race|10 race", feedback: "7 races is sufficient with optimal strategy." }
    ]
  },

  // ============================================================================
  // PUZZLE 115: Gold Bar Payment
  // ============================================================================
  115: {
    title: "Gold Bar Payment",
    puzzleContext: ["gold", "bar", "worker", "day", "week", "pay", "cut"],
    requiredConcepts: [
      ["1/7", "2/7", "4/7", "1, 2, 4"],
      ["2 cuts", "two cuts"],
      ["trade", "exchange", "take back", "give back"]
    ],
    coreAnswer: [
      { element: "cut into 1/7, 2/7, 4/7", patterns: ["1.*2.*4", "1/7.*2/7.*4/7", "pieces.*1.*2.*4"], weight: 35 },
      { element: "binary representation", patterns: ["binary", "powers of 2", "1\\+2\\+4", "base 2"], weight: 20 },
      { element: "trade pieces back and forth", patterns: ["trade", "exchange", "take back", "give back", "return"], weight: 25 },
      { element: "2 cuts only", patterns: ["2 cuts", "two cuts", "only 2"], weight: 10 },
      { element: "any day's payment possible", patterns: ["any.*1-7", "any day", "all 7 days"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["1.*2.*4", "binary", "powers of 2"],
      description: "1/7, 2/7, 4/7 pieces using binary representation"
    },
    bonusInsights: ["binary number system", "powers of 2", "minimal cuts"],
    wrongAnswerPatterns: [
      { pattern: "7 pieces|cut.*7", feedback: "You can only make 2 cuts! Think binary: 1, 2, 4." },
      { pattern: "3 cuts|4 cuts", feedback: "Only 2 cuts needed! Use 1+2+4=7 and trade pieces." }
    ]
  },

  // ============================================================================
  // PUZZLE 116: The Ant and Triangle
  // ============================================================================
  116: {
    title: "The Ant and Triangle",
    puzzleContext: ["ant", "triangle", "corner", "vertex", "edge", "walk", "collide"],
    requiredConcepts: [
      ["1/4", "25%", "one.?fourth"],
      ["clockwise", "counterclockwise", "same direction"]
    ],
    coreAnswer: [
      { element: "probability is 1/4 or 25%", patterns: ["1/4", "25%", "one.?fourth", "one quarter", "0\\.25"], weight: 35 },
      { element: "8 total possibilities (2^3)", patterns: ["8 possibilit", "2\\^3", "2 × 2 × 2", "eight.*outcome"], weight: 20 },
      { element: "2 favorable outcomes (all same direction)", patterns: ["2 favorable", "all clockwise.*all counter", "same direction"], weight: 25 },
      { element: "no collision = all go same way", patterns: ["same.*direction", "all.*clockwise", "all.*counter", "no collision"], weight: 15 },
      { element: "collision probability = 3/4", patterns: ["3/4.*collision", "75%.*collision", "collision.*3/4"], weight: 5 }
    ],
    correctConclusion: {
      patterns: ["1/4", "25%", "2/8"],
      description: "1/4 (25%) probability of no collision"
    },
    bonusInsights: ["combinatorial", "complementary counting", "extends to n-gon"],
    wrongAnswerPatterns: [
      { pattern: "1/2|50%", feedback: "Not 50%. Count all 8 possibilities - only 2 avoid collision." },
      { pattern: "1/8|12\\.5%", feedback: "Not 1/8. All clockwise OR all counterclockwise = 2/8 = 1/4." }
    ]
  },

  // ============================================================================
  // PUZZLE 117: 1000 Doors Problem
  // ============================================================================
  117: {
    title: "1000 Doors Problem",
    puzzleContext: ["door", "1000 door", "open", "close", "toggle", "pass", "hallway"],
    requiredConcepts: [
      ["perfect square", "square number"],
      ["31", "thirty.?one"],
      ["divisor", "factor"]
    ],
    coreAnswer: [
      { element: "perfect squares stay open", patterns: ["perfect square", "square.*open", "1.*4.*9.*16"], weight: 35 },
      { element: "31 doors open", patterns: ["31 door", "31 open", "thirty.?one"], weight: 25 },
      { element: "squares have odd number of divisors", patterns: ["odd.*divisor", "odd.*factor", "unpaired"], weight: 20 },
      { element: "other numbers have even divisors (toggle even times)", patterns: ["even.*divisor", "pairs?.*divisor", "toggle.*even"], weight: 15 },
      { element: "1, 4, 9, 16... pattern", patterns: ["1.*4.*9", "n\\^2", "n squared"], weight: 5 }
    ],
    correctConclusion: {
      patterns: ["31", "perfect square", "square number"],
      description: "31 doors (perfect squares only)"
    },
    bonusInsights: ["divisor properties", "number theory", "parity of toggles"],
    wrongAnswerPatterns: [
      { pattern: "all open|all closed|500", feedback: "Not all open/closed. Only perfect squares remain open (31 doors)." },
      { pattern: "prime|odd number", feedback: "It's not primes or odd numbers - it's perfect squares!" }
    ]
  },

  // ============================================================================
  // PUZZLE 118: The Josephus Problem
  // ============================================================================
  118: {
    title: "The Josephus Problem",
    puzzleContext: ["josephus", "circle", "soldier", "eliminate", "count", "survive", "position"],
    requiredConcepts: [
      ["73", "seventy.?three"],
      ["binary", "2^", "power of 2", "64"]
    ],
    coreAnswer: [
      { element: "position 73", patterns: ["73", "seventy.?three", "position.*73"], weight: 35 },
      { element: "formula: 2L + 1", patterns: ["2L.*1", "2.*L.*\\+.*1", "twice.*plus.*1"], weight: 20 },
      { element: "100 = 64 + 36", patterns: ["64.*36", "2\\^6.*36", "100.*=.*64"], weight: 20 },
      { element: "find largest power of 2 ≤ n", patterns: ["largest.*power.*2", "2\\^6.*64", "biggest.*2\\^"], weight: 15 },
      { element: "binary rotation trick", patterns: ["binary.*rotat", "bit.*rotat", "rotate.*left"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["73"],
      description: "Stand at position 73"
    },
    bonusInsights: ["recursive pattern", "mathematical induction", "binary representation"],
    wrongAnswerPatterns: [
      { pattern: "position 1|first|start", feedback: "Position 1 is not safe! The answer is 73." },
      { pattern: "50|last|100", feedback: "Not 50 or 100. Use the formula 2L+1 where 100=64+L." }
    ]
  },

  // ============================================================================
  // PUZZLE 119: Measuring 6L with 4L and 9L
  // ============================================================================
  119: {
    title: "Measuring 6L with 4L and 9L",
    puzzleContext: ["jug", "liter", "4L", "9L", "pour", "measure", "water"],
    requiredConcepts: [
      ["6 liter", "6L", "six liter"],
      ["pour", "fill", "empty"]
    ],
    coreAnswer: [
      { element: "achieve exactly 6 liters", patterns: ["6 liter", "6L", "exactly 6", "6.*jug"], weight: 30 },
      { element: "use fill and pour operations", patterns: ["fill.*pour", "pour.*fill", "transfer"], weight: 20 },
      { element: "create intermediate amounts", patterns: ["intermediate", "remainder", "left over"], weight: 20 },
      { element: "multiple solution paths exist", patterns: ["multiple.*way", "alternative", "another.*method"], weight: 15 },
      { element: "GCD relationship", patterns: ["GCD", "gcd\\(4,9\\)", "relatively prime", "coprime"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["6 liter", "exactly 6", "6L"],
      description: "Achieves exactly 6 liters"
    },
    bonusInsights: ["state space", "bezout's identity", "GCD"],
    wrongAnswerPatterns: [
      { pattern: "impossible|can't", feedback: "It's possible! GCD(4,9)=1, so any integer amount can be measured." }
    ]
  },

  // ============================================================================
  // PUZZLE 120: Two Hourglasses Timer
  // ============================================================================
  120: {
    title: "Two Hourglasses Timer",
    puzzleContext: ["hourglass", "sand", "timer", "7 minute", "11 minute", "flip"],
    requiredConcepts: [
      ["15 minute", "fifteen"],
      ["7", "11", "seven", "eleven"],
      ["flip", "turn over"]
    ],
    coreAnswer: [
      { element: "start both hourglasses", patterns: ["start both", "both.*same time", "simultaneously", "begin.*both"], weight: 20 },
      { element: "at 7 min, flip the 7-min glass", patterns: ["at 7.*flip", "7.*flip.*7", "when.*7.*flip"], weight: 20 },
      { element: "at 11 min, flip the 7-min glass again", patterns: ["at 11.*flip", "11.*flip", "when.*11"], weight: 20 },
      { element: "7-min glass has 4 minutes remaining at t=11", patterns: ["4 minute.*remain", "4.*left", "4 min.*sand"], weight: 20 },
      { element: "total: 11 + 4 = 15", patterns: ["11.*4.*15", "11\\+4", "11 plus 4"], weight: 20 }
    ],
    correctConclusion: {
      patterns: ["15 minute", "11.*4"],
      description: "15 minutes total using state tracking"
    },
    bonusInsights: ["parallel timing", "state tracking", "event synchronization"],
    wrongAnswerPatterns: [
      { pattern: "7\\+7\\+7|21|7\\+8", feedback: "7+7+7=21, not 15. Use the interaction between both glasses!" }
    ]
  },

  // ============================================================================
  // PUZZLE 121: Calculate Bee's Distance
  // ============================================================================
  121: {
    title: "Calculate Bee's Distance",
    puzzleContext: ["bee", "train", "fly", "distance", "toward", "travel"],
    requiredConcepts: [
      ["75", "seventy.?five"],
      ["1 hour", "one hour", "time"]
    ],
    coreAnswer: [
      { element: "bee travels 75 km", patterns: ["75 km", "75.*kilometer", "seventy.?five.*km"], weight: 35 },
      { element: "trains meet in 1 hour", patterns: ["1 hour", "one hour", "meet.*1.*hour", "100.*100.*km/h"], weight: 25 },
      { element: "total time = distance / relative speed", patterns: ["100.*100", "combined.*100", "relative.*100"], weight: 15 },
      { element: "bee flies for full hour at 75 km/h", patterns: ["75.*1 hour", "75 km/h.*1", "speed.*time"], weight: 20 },
      { element: "don't calculate each trip", patterns: ["don't.*each", "ignore.*back.*forth", "simple", "elegant"], weight: 5 }
    ],
    correctConclusion: {
      patterns: ["75 km", "75 kilometer"],
      description: "75 km - just speed × time!"
    },
    bonusInsights: ["elegant simplification", "avoid overcomplication", "total time focus"],
    wrongAnswerPatterns: [
      { pattern: "infinite series|sum of", feedback: "Don't calculate each trip! Just use: distance = speed × time." },
      { pattern: "37\\.5|50|100", feedback: "The bee flies for 1 hour at 75 km/h = 75 km total." }
    ]
  },

  // ============================================================================
  // PUZZLE 122: Heaven and Hell
  // ============================================================================
  122: {
    title: "Heaven and Hell",
    puzzleContext: ["guard", "heaven", "hell", "door", "truth", "lie", "liar"],
    requiredConcepts: [
      ["other guard", "other one"],
      ["opposite", "other door"]
    ],
    coreAnswer: [
      { element: "ask about what OTHER guard would say", patterns: ["other guard", "if I ask.*other", "what would.*other.*say"], weight: 35 },
      { element: "go to OPPOSITE door", patterns: ["opposite door", "other door", "go.*opposite", "choose.*other"], weight: 25 },
      { element: "double negation cancels out", patterns: ["double.*negat", "cancel", "both.*wrong", "always.*wrong"], weight: 15 },
      { element: "truth-teller reports liar's lie", patterns: ["truth.*report.*lie", "truthful.*about.*liar"], weight: 10 },
      { element: "liar lies about truth-teller", patterns: ["liar.*lie.*about", "lie.*about.*truth"], weight: 10 },
      { element: "meta-question strategy", patterns: ["meta", "self-referent", "refer.*other"], weight: 5 }
    ],
    correctConclusion: {
      patterns: ["other guard.*opposite", "ask.*other.*opposite", "what would.*other"],
      description: "Ask about other guard, then choose opposite door"
    },
    bonusInsights: ["meta-question", "double negation", "logical symmetry"],
    wrongAnswerPatterns: [
      { pattern: "which door.*heaven|point.*heaven|ask.*direct", feedback: "Direct questions won't work - you don't know who's lying! Use meta-question." },
      { pattern: "ask both|two question", feedback: "You can only ask ONE question to ONE guard!" }
    ]
  },

  // ============================================================================
  // PUZZLE 123: The Camel and Bananas
  // ============================================================================
  123: {
    title: "The Camel and Bananas",
    requiredConcepts: [
      ["533", "depot", "station"],
      ["trip", "shuttle", "carry"]
    ],
    coreAnswer: [
      { element: "answer is 533 bananas", patterns: ["533", "five.*hundred.*thirty", "~530"], weight: 35 },
      { element: "create depots/stations", patterns: ["depot", "station", "stop", "stockpile", "cache"], weight: 25 },
      { element: "shuttle bananas in stages", patterns: ["shuttle", "multiple trips", "back and forth", "stages"], weight: 20 },
      { element: "reduce trips as bananas decrease", patterns: ["reduce trips", "fewer trips", "trip reduction"], weight: 15 },
      { element: "camel eats 1 banana per km", patterns: ["1.*per.*km", "eat.*banana.*km", "consumes"], weight: 5 }
    ],
    correctConclusion: {
      patterns: ["533", "~530", "five hundred thirty"],
      description: "Maximum 533 bananas delivered"
    },
    bonusInsights: ["diminishing returns", "optimization", "depot strategy"],
    wrongAnswerPatterns: [
      { pattern: "1000|2000|0", feedback: "You need a multi-stage depot strategy to maximize delivery." },
      { pattern: "impossible", feedback: "It's possible with a clever depot strategy - you can deliver 533 bananas." }
    ]
  },

  // ============================================================================
  // PUZZLE 124: Snail Climbing a Wall
  // ============================================================================
  124: {
    title: "Snail Climbing a Wall",
    requiredConcepts: [
      ["28", "twenty.?eight"],
      ["day", "climb"]
    ],
    coreAnswer: [
      { element: "answer is 28 days", patterns: ["28 day", "twenty.?eight day", "answer.*28"], weight: 35 },
      { element: "net progress 1 foot per day", patterns: ["net.*1", "1 foot.*day", "3-2=1"], weight: 15 },
      { element: "after 27 days at 27 feet", patterns: ["27 day.*27 feet", "27.*feet.*27.*day"], weight: 20 },
      { element: "day 28 climbs 3 feet to reach 30", patterns: ["day 28.*3.*30", "28.*reach.*top", "escapes.*day 28"], weight: 20 },
      { element: "doesn't slide back after reaching top", patterns: ["doesn't slide", "no slide.*top", "escape.*before night"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["28 day", "twenty.?eight"],
      description: "28 days - escapes on day 28 before sliding back"
    },
    bonusInsights: ["boundary condition", "final step", "endpoint analysis"],
    wrongAnswerPatterns: [
      { pattern: "30 day|thirty day", feedback: "Common mistake! On day 28, the snail reaches the top during the day and doesn't slide back." },
      { pattern: "27 day", feedback: "After 27 days, the snail is at 27 feet. It needs one more day to climb the final 3 feet." }
    ]
  },

  // ============================================================================
  // PUZZLE 125: Handshake Problem
  // ============================================================================
  125: {
    title: "Handshake Problem",
    requiredConcepts: [
      ["4", "four"],
      ["spouse", "pair"]
    ],
    coreAnswer: [
      { element: "answer is 4 handshakes", patterns: ["4 hand", "four hand", "spouse.*4", "answer.*4"], weight: 35 },
      { element: "9 different answers: 0-8", patterns: ["0.*8", "0,1,2.*8", "nine different", "0 to 8"], weight: 20 },
      { element: "8-shaker's spouse is 0-shaker", patterns: ["8.*spouse.*0", "8 and 0.*married", "0.*spouse.*8"], weight: 15 },
      { element: "pairs: (0,8), (1,7), (2,6), (3,5)", patterns: ["0.*8.*1.*7", "pair.*spouse", "symmetric"], weight: 15 },
      { element: "4 remains for questioner's spouse", patterns: ["4.*remain", "4.*questioner", "left.*4"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["4 hand", "four hand", "spouse.*4"],
      description: "The spouse shook 4 hands"
    },
    bonusInsights: ["pigeonhole", "symmetric pairing", "elimination"],
    wrongAnswerPatterns: [
      { pattern: "8|0", feedback: "These are other guests' answers. The questioner's spouse must be 4 (the middle value)." }
    ]
  },

  // ============================================================================
  // PUZZLE 126: 12 Balls Problem
  // ============================================================================
  126: {
    title: "12 Balls Problem",
    requiredConcepts: [
      ["3", "three"],
      ["heavier", "lighter"],
      ["weigh", "balance"]
    ],
    coreAnswer: [
      { element: "3 weighings needed", patterns: ["3 weigh", "three weigh", "exactly 3"], weight: 25 },
      { element: "divide into groups of 4", patterns: ["4.*4.*4", "groups of 4", "divide.*4"], weight: 20 },
      { element: "first weigh 4 vs 4", patterns: ["4 vs 4", "4 against 4", "weigh.*4.*4"], weight: 20 },
      { element: "track potentially heavy/light", patterns: ["potentially heavy", "potentially light", "mark.*heavy", "mark.*light"], weight: 20 },
      { element: "determine heavy or light", patterns: ["heavy or light", "which.*heavier.*lighter", "identify.*direction"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["3 weigh", "find.*odd.*heavy.*light"],
      description: "3 weighings to find odd ball AND determine if heavier/lighter"
    },
    bonusInsights: ["ternary information", "3^3=27 outcomes", "marking states"],
    wrongAnswerPatterns: [
      { pattern: "4 weigh|5 weigh", feedback: "It can be done in exactly 3 weighings with careful tracking." },
      { pattern: "can't determine", feedback: "You CAN determine both the odd ball and whether it's heavier or lighter in 3 weighings." }
    ]
  },

  // ============================================================================
  // PUZZLE 127: Red and Blue Marbles
  // ============================================================================
  127: {
    title: "Red and Blue Marbles",
    requiredConcepts: [
      ["1 red", "one red", "single red"],
      ["74", "75", "3/4"]
    ],
    coreAnswer: [
      { element: "put 1 red in jar A", patterns: ["1 red.*jar", "one red.*jar", "single red"], weight: 35 },
      { element: "put 49 red + 50 blue in jar B", patterns: ["49 red.*50 blue", "remaining.*jar B", "99.*jar B"], weight: 25 },
      { element: "probability ~74.7%", patterns: ["74", "75%", "74\\.7", "3/4"], weight: 25 },
      { element: "jar A guarantees red", patterns: ["guarantee.*red", "100%.*jar A", "always red.*jar A"], weight: 10 },
      { element: "asymmetric distribution", patterns: ["asymmetric", "uneven", "not equal"], weight: 5 }
    ],
    correctConclusion: {
      patterns: ["74%", "75%", "3/4", "1 red.*one jar"],
      description: "~74.7% probability with 1 red in one jar, rest in other"
    },
    bonusInsights: ["conditional probability", "optimization", "weighted average"],
    wrongAnswerPatterns: [
      { pattern: "50%|equal|25 each", feedback: "Equal split gives only 50%! Put 1 red in one jar for ~75% chance." }
    ]
  },

  // ============================================================================
  // PUZZLE 128: Two Candle Timer
  // ============================================================================
  128: {
    title: "Two Candle Timer",
    requiredConcepts: [
      ["both ends", "two ends"],
      ["15", "fifteen"]
    ],
    coreAnswer: [
      { element: "light candle A from both ends", patterns: ["A.*both ends", "both ends.*A", "first.*both"], weight: 25 },
      { element: "light candle B from one end", patterns: ["B.*one end", "one end.*B", "single end"], weight: 20 },
      { element: "A burns out in 30 minutes", patterns: ["A.*30", "30 min.*A", "burns out.*30"], weight: 15 },
      { element: "when A finishes, light other end of B", patterns: ["A.*finish.*B.*other", "light.*other end.*B", "then.*B.*both"], weight: 25 },
      { element: "15 minutes measured from A finish to B finish", patterns: ["15 min.*after", "last 15", "final 15"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["15 minute", "fifteen minute"],
      description: "15 minutes measured between candle burnouts"
    },
    bonusInsights: ["halving principle", "non-uniform rate", "event timing"],
    wrongAnswerPatterns: [
      { pattern: "1/4|quarter", feedback: "You can't measure 1/4 directly. Use both-ends halving twice!" }
    ]
  },

  // ============================================================================
  // PUZZLE 129: Minimum Cuts for Cake
  // ============================================================================
  129: {
    title: "Minimum Cuts for Cake",
    requiredConcepts: [
      ["8", "7", "eight", "seven"],
      ["cut", "pieces"]
    ],
    coreAnswer: [
      { element: "maximum 8 pieces (3D) or 7 (2D)", patterns: ["8 piece", "7 piece", "eight.*piece", "seven.*piece"], weight: 35 },
      { element: "horizontal cut through middle", patterns: ["horizontal", "parallel.*table", "through.*middle", "height"], weight: 20 },
      { element: "each cut intersects previous cuts", patterns: ["intersect", "cross.*previous", "maximiz.*intersection"], weight: 20 },
      { element: "formula for 2D: (n²+n+2)/2", patterns: ["formula", "n.*squared", "recurrence"], weight: 15 },
      { element: "3D thinking doubles result", patterns: ["3D", "three.*dimension", "horizontal.*vertical"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["8 piece", "7 piece"],
      description: "8 pieces (3D) or 7 pieces (2D only)"
    },
    bonusInsights: ["3D thinking", "intersection maximization", "geometric optimization"],
    wrongAnswerPatterns: [
      { pattern: "6 piece|4 piece", feedback: "You can get more! Maximize intersections between cuts." }
    ]
  },

  // ============================================================================
  // PUZZLE 134: Coin Flip Probability
  // ============================================================================
  134: {
    title: "Coin Flip Probability",
    requiredConcepts: [
      ["6", "six"],
      ["expected", "average"]
    ],
    coreAnswer: [
      { element: "expected number is 6 flips", patterns: ["6 flip", "six flip", "expected.*6", "answer.*6"], weight: 40 },
      { element: "recursive expectation", patterns: ["recursive", "recurrence", "E.*=.*E"], weight: 20 },
      { element: "state transitions", patterns: ["state", "transition", "after.*H", "after.*T"], weight: 20 },
      { element: "solve equation for E", patterns: ["solve.*E", "E.*=.*6", "equation"], weight: 15 },
      { element: "restart on T", patterns: ["restart", "reset", "T.*start over"], weight: 5 }
    ],
    correctConclusion: {
      patterns: ["6 flip", "expected.*6"],
      description: "Expected 6 flips to get HH"
    },
    bonusInsights: ["markov chain", "recurrence relation", "state machine"],
    wrongAnswerPatterns: [
      { pattern: "4 flip|2 flip", feedback: "The expected value is 6, not 4 or 2. Use recursive expectation." }
    ]
  },

  // ============================================================================
  // PUZZLE 136: Girl or Boy Probability
  // ============================================================================
  136: {
    title: "Girl or Boy Probability",
    requiredConcepts: [
      ["1/3", "one.?third", "33"],
      ["conditional", "given"]
    ],
    coreAnswer: [
      { element: "probability is 1/3", patterns: ["1/3", "one.?third", "33%", "0\\.33"], weight: 40 },
      { element: "sample space: BB, BG, GB (not GG)", patterns: ["BB.*BG.*GB", "three.*outcome", "eliminate.*GG"], weight: 25 },
      { element: "only BB has two boys", patterns: ["only BB", "BB.*two boy", "one.*three"], weight: 20 },
      { element: "conditional probability changes odds", patterns: ["conditional", "given.*at least", "changes.*odds"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["1/3", "33%", "one.?third"],
      description: "1/3 probability (not 1/2!)"
    },
    bonusInsights: ["conditional probability", "sample space", "wording matters"],
    wrongAnswerPatterns: [
      { pattern: "1/2|50%|half", feedback: "Common mistake! It's 1/3, not 1/2. The sample space is {BB, BG, GB}." }
    ]
  },

  // ============================================================================
  // PUZZLE 140: Rope Around the Earth
  // ============================================================================
  140: {
    title: "Rope Around the Earth",
    requiredConcepts: [
      ["16", "0.16", "16 cm"],
      ["circumference", "2.*pi", "radius"]
    ],
    coreAnswer: [
      { element: "rope rises about 16 cm", patterns: ["16 cm", "16.*centimeter", "0\\.16.*m", "~16"], weight: 40 },
      { element: "h = 1/(2π) meters", patterns: ["1/.*2.*pi", "1.*2π", "h.*="], weight: 25 },
      { element: "result is independent of Earth's size", patterns: ["independent", "regardless.*size", "doesn't matter.*radius"], weight: 20 },
      { element: "circumference formula C = 2πR", patterns: ["C.*2.*π.*R", "circumference.*formula", "2.*pi.*r"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["16 cm", "0\\.16", "16.*centimeter"],
      description: "~16 cm - surprisingly independent of Earth's size!"
    },
    bonusInsights: ["scale independence", "counterintuitive", "algebraic simplification"],
    wrongAnswerPatterns: [
      { pattern: "tiny|microscopic|0\\.0", feedback: "Surprisingly, it's about 16 cm! Earth's size doesn't matter." },
      { pattern: "kilometer|mile|huge", feedback: "It's only about 16 cm. The formula simplifies to 1/(2π) meters." }
    ]
  },

  // ============================================================================
  // PUZZLE 141: Filling a Truck
  // ============================================================================
  141: {
    title: "Filling a Truck",
    requiredConcepts: [
      ["small", "1 kg", "$5"],
      ["value.*density", "dollar.*kg", "$/kg"]
    ],
    coreAnswer: [
      { element: "10 small boxes = $50", patterns: ["10 small", "10.*$50", "$50.*small", "ten small"], weight: 35 },
      { element: "small has highest value density", patterns: ["$5/kg", "highest.*density", "best.*ratio", "small.*best"], weight: 25 },
      { element: "calculate value per kg", patterns: ["per kg", "$/kg", "value.*density", "ratio"], weight: 20 },
      { element: "greedy by density works here", patterns: ["greedy", "highest.*first", "maximize.*density"], weight: 15 },
      { element: "medium = $4/kg, large = $3.60/kg", patterns: ["$4/kg", "$3\\.60", "medium.*4", "large.*3"], weight: 5 }
    ],
    correctConclusion: {
      patterns: ["$50", "10 small", "fifty dollar"],
      description: "10 small boxes for $50 (highest value density)"
    },
    bonusInsights: ["knapsack problem", "value density", "greedy algorithm"],
    wrongAnswerPatterns: [
      { pattern: "$36|2 large|large box", feedback: "Large boxes have lowest value density ($3.60/kg). Use small boxes for $5/kg!" }
    ]
  },

  // ============================================================================
  // PUZZLE 142: The Pill Puzzle
  // ============================================================================
  142: {
    title: "The Pill Puzzle",
    requiredConcepts: [
      ["cut", "half", "split"],
      ["add", "another", "more"]
    ],
    coreAnswer: [
      { element: "add one more pill from bottle B", patterns: ["add.*B", "one more.*B", "another.*B", "4 pills"], weight: 30 },
      { element: "cut all 4 pills in half", patterns: ["cut.*4.*half", "all.*half", "split.*half", "4 pill.*half"], weight: 30 },
      { element: "take one half of each pill", patterns: ["one half.*each", "half.*each.*pill", "today.*half"], weight: 20 },
      { element: "save other halves for tomorrow", patterns: ["tomorrow", "save.*half", "other half.*later"], weight: 15 },
      { element: "no waste", patterns: ["no waste", "use all", "nothing.*lost"], weight: 5 }
    ],
    correctConclusion: {
      patterns: ["add.*B.*cut", "4 pill.*half", "half.*each"],
      description: "Add 1 more from B, cut all 4 in half, take half of each"
    },
    bonusInsights: ["symmetry creation", "balance restoration", "no waste"],
    wrongAnswerPatterns: [
      { pattern: "throw away|discard|waste", feedback: "No need to waste! Add a pill to balance, then cut all in half." }
    ]
  },

  // ============================================================================
  // PUZZLE 144: Making Change
  // ============================================================================
  144: {
    title: "Making Change",
    requiredConcepts: [
      ["4 coins", "exactly 4"],
      ["impossible", "can't make"]
    ],
    coreAnswer: [
      { element: "values 1, 2, 3 are impossible", patterns: ["1.*2.*3.*impossible", "can't make.*1.*2.*3", "less than 4"], weight: 40 },
      { element: "minimum with 4 coins is 4¢", patterns: ["minimum.*4", "lowest.*4", "4.*cents.*min"], weight: 25 },
      { element: "maximum is 200¢ (4×50)", patterns: ["200", "4.*50", "max.*200"], weight: 20 },
      { element: "maximum impossible is 3¢", patterns: ["3.*maximum.*impossible", "max.*impossible.*3", "answer.*3"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["3.*impossible", "1.*2.*3"],
      description: "Maximum impossible value is 3¢ (need fewer than 4 coins)"
    },
    bonusInsights: ["constraint satisfaction", "boundary analysis", "Frobenius"],
    wrongAnswerPatterns: []
  },

  // ============================================================================
  // PUZZLE 146: Game of Nim
  // ============================================================================
  146: {
    title: "Game of Nim",
    requiredConcepts: [
      ["XOR", "exclusive or", "nim-sum"],
      ["2", "take 2", "remove 2"]
    ],
    coreAnswer: [
      { element: "take 2 from pile of 5", patterns: ["2.*from.*5", "remove 2.*5", "take 2.*5.pile"], weight: 35 },
      { element: "leave XOR = 0 position", patterns: ["XOR.*0", "nim-sum.*0", "xor.*zero"], weight: 25 },
      { element: "leaves (3,4,3)", patterns: ["3.*4.*3", "three.*four.*three"], weight: 20 },
      { element: "winning position has XOR ≠ 0", patterns: ["non-zero.*win", "XOR.*not.*0.*first"], weight: 15 },
      { element: "3 XOR 4 XOR 5 = 2", patterns: ["3.*XOR.*4.*XOR.*5", "initial.*XOR.*2"], weight: 5 }
    ],
    correctConclusion: {
      patterns: ["take 2.*5", "leave.*3.*4.*3"],
      description: "Take 2 from pile of 5, leaving (3,4,3)"
    },
    bonusInsights: ["nim strategy", "game theory", "binary operations"],
    wrongAnswerPatterns: [
      { pattern: "random|any pile|guess", feedback: "There's a guaranteed winning strategy using XOR!" }
    ]
  },

  // ============================================================================
  // PUZZLE 148: Egg Drop Optimization (3 eggs)
  // ============================================================================
  148: {
    title: "Egg Drop Optimization (3 eggs)",
    requiredConcepts: [
      ["9", "nine"],
      ["3 egg", "three egg"]
    ],
    coreAnswer: [
      { element: "minimum is 9 drops", patterns: ["9 drop", "nine drop", "answer.*9", "minimum.*9"], weight: 40 },
      { element: "with 3 eggs, use triangular approach", patterns: ["3 egg", "triangular", "tetrahedral"], weight: 20 },
      { element: "n + C(n,2) + C(n,3) ≥ 100", patterns: ["C\\(n", "binomial", "combination", "formula"], weight: 20 },
      { element: "dynamic programming approach", patterns: ["dynamic", "recurrence", "recursive"], weight: 15 },
      { element: "9 + 36 + 84 = 129 ≥ 100", patterns: ["129", "36.*84", "covers 100"], weight: 5 }
    ],
    correctConclusion: {
      patterns: ["9 drop", "nine drop"],
      description: "9 drops minimum with 3 eggs"
    },
    bonusInsights: ["binomial coefficient", "worst-case minimization", "DP"],
    wrongAnswerPatterns: [
      { pattern: "14|7", feedback: "With 3 eggs, you can do better than 2 eggs. Answer is 9." }
    ]
  },

  // ============================================================================
  // PUZZLE 149: The Warden's Challenge
  // ============================================================================
  149: {
    title: "The Warden's Challenge",
    requiredConcepts: [
      ["31%", "30%", "loop", "cycle"],
      ["box.*number", "follow"]
    ],
    coreAnswer: [
      { element: "loop/cycle strategy gives ~31%", patterns: ["31%", "30%", "loop strategy", "cycle strategy"], weight: 35 },
      { element: "start at box with your number", patterns: ["start.*own.*number", "box.*=.*target", "begin.*your number"], weight: 20 },
      { element: "follow the chain of numbers", patterns: ["follow.*chain", "go to.*box", "next box.*number"], weight: 20 },
      { element: "success if cycle length ≤ 50", patterns: ["cycle.*50", "loop.*50", "length.*≤.*50"], weight: 15 },
      { element: "correlated outcomes help", patterns: ["correlat", "all succeed.*together", "not independent"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["31%", "loop", "cycle strategy"],
      description: "Loop strategy gives ~31% success rate"
    },
    bonusInsights: ["permutation cycles", "correlated probability", "coordination"],
    wrongAnswerPatterns: [
      { pattern: "random|individual|1/2\\^100", feedback: "Random strategy gives (1/2)^100 ≈ 0%. Use the loop strategy for 31%!" }
    ]
  },

  // ============================================================================
  // PUZZLE 150: Two Circles Overlap
  // ============================================================================
  150: {
    title: "Two Circles Overlap",
    requiredConcepts: [
      ["2π/3", "120", "sector"],
      ["√3", "triangle"]
    ],
    coreAnswer: [
      { element: "area = 2π/3 - √3/2", patterns: ["2π/3.*√3/2", "2pi/3.*sqrt.*3", "π/3.*triangle"], weight: 40 },
      { element: "each segment is sector minus triangle", patterns: ["sector.*minus.*triangle", "segment.*=.*sector"], weight: 25 },
      { element: "sector angle is 120° or 2π/3", patterns: ["120", "2π/3", "2.*pi.*3"], weight: 20 },
      { element: "vesica piscis shape", patterns: ["vesica", "fish", "lens"], weight: 10 },
      { element: "two identical segments", patterns: ["two segment", "double", "2.*segment"], weight: 5 }
    ],
    correctConclusion: {
      patterns: ["2π/3.*√3", "1\\.228", "segment.*area"],
      description: "Area = 2π/3 - √3/2 ≈ 1.228"
    },
    bonusInsights: ["circular segment", "geometric construction", "vesica piscis"],
    wrongAnswerPatterns: []
  },

  // ============================================================================
  // PUZZLE 151: Broken Calculator
  // ============================================================================
  151: {
    title: "Broken Calculator",
    requiredConcepts: [
      ["343", "7^3", "7 cubed"],
      ["=.*=", "repeat"]
    ],
    coreAnswer: [
      { element: "press 7 × = = (4 presses)", patterns: ["7.*×.*=.*=", "4 press", "four press"], weight: 40 },
      { element: "343 = 7³", patterns: ["7.*3", "7 cubed", "7\\^3", "7×7×7"], weight: 25 },
      { element: "= repeats last operation", patterns: ["=.*repeat", "repeat.*operation", "=.*again"], weight: 20 },
      { element: "7 × 7 = 49, then 49 × 7 = 343", patterns: ["49", "7.*7.*49", "49.*7.*343"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["7.*×.*=.*=", "4 press", "343"],
      description: "7 × = = gives 343 in 4 presses"
    },
    bonusInsights: ["calculator behavior", "repeat function", "power calculation"],
    wrongAnswerPatterns: [
      { pattern: "7.*×.*7.*×.*7", feedback: "Use the = repeat trick! Just 7 × = = works." }
    ]
  },

  // ============================================================================
  // PUZZLE 152: The Round Table
  // ============================================================================
  152: {
    title: "The Round Table",
    requiredConcepts: [
      ["center", "middle"],
      ["mirror", "opposite", "symmetric"]
    ],
    coreAnswer: [
      { element: "place first coin at center", patterns: ["center", "middle", "exact center", "centre"], weight: 40 },
      { element: "mirror opponent's moves", patterns: ["mirror", "opposite", "diametrically", "symmetric"], weight: 30 },
      { element: "first player wins with this strategy", patterns: ["first.*win", "win.*first", "guaranteed"], weight: 15 },
      { element: "opponent runs out of space first", patterns: ["opponent.*out", "run out", "no space"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["center.*mirror", "middle.*symmetric"],
      description: "First player wins by taking center and mirroring"
    },
    bonusInsights: ["symmetry strategy", "first-mover advantage", "center control"],
    wrongAnswerPatterns: [
      { pattern: "second player|can't win", feedback: "First player WINS by placing at center and mirroring!" }
    ]
  },

  // ============================================================================
  // PUZZLE 153: Four Colored Hats
  // ============================================================================
  153: {
    title: "Four Colored Hats",
    requiredConcepts: [
      ["silence", "wait", "time"],
      ["deduce", "figure out"]
    ],
    coreAnswer: [
      { element: "use silence/waiting as information", patterns: ["silence", "wait", "no one speak", "time.*pass"], weight: 35 },
      { element: "if someone could know, they'd speak", patterns: ["would.*speak", "could.*know", "obvious.*speak"], weight: 25 },
      { element: "D sees C's hat", patterns: ["D see.*C", "D.*can see.*C"], weight: 15 },
      { element: "A sees B's hat", patterns: ["A see.*B", "A.*can see.*B"], weight: 15 },
      { element: "deduction from others' behavior", patterns: ["deduc", "infer", "figure out", "logic"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["silence.*informat", "wait.*deduc", "yes.*guarantee"],
      description: "Yes - use silence as information to deduce"
    },
    bonusInsights: ["information from silence", "time-based signaling", "meta-reasoning"],
    wrongAnswerPatterns: [
      { pattern: "impossible|can't|no way", feedback: "It IS possible! Silence carries information." }
    ]
  },

  // ============================================================================
  // PUZZLE 154: Splitting a Cake Fairly
  // ============================================================================
  154: {
    title: "Splitting a Cake Fairly",
    requiredConcepts: [
      ["cut", "divide"],
      ["choose", "pick", "select"]
    ],
    coreAnswer: [
      { element: "I cut, you choose protocol", patterns: ["cut.*choose", "one cut.*other choose", "i cut.*you choose"], weight: 45 },
      { element: "cutter makes equal portions (by their view)", patterns: ["equal.*portion", "cutter.*equal", "50.*50"], weight: 25 },
      { element: "chooser picks preferred piece", patterns: ["choose.*prefer", "pick.*better", "select.*want"], weight: 20 },
      { element: "both guaranteed ≥50%", patterns: ["both.*50", "guarantee.*half", "at least half"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["cut.*choose", "i cut.*you choose"],
      description: "One cuts, other chooses - both get ≥50%"
    },
    bonusInsights: ["envy-free", "incentive-compatible", "game theory fairness"],
    wrongAnswerPatterns: [
      { pattern: "measure|ruler|exact", feedback: "No measurement needed! Use 'I cut, you choose' protocol." }
    ]
  },

  // ============================================================================
  // PUZZLE 157: Probability of Same Birthday
  // ============================================================================
  157: {
    title: "Probability of Same Birthday",
    requiredConcepts: [
      ["50%", "50.7", "half"],
      ["23", "twenty.?three"]
    ],
    coreAnswer: [
      { element: "about 50% probability", patterns: ["50%", "50\\.7", "half", "~50"], weight: 35 },
      { element: "birthday paradox", patterns: ["birthday paradox", "paradox", "counterintuitive"], weight: 20 },
      { element: "calculate complement (no match)", patterns: ["complement", "no match", "1 - P", "all different"], weight: 20 },
      { element: "23 people = 253 pairs", patterns: ["253 pair", "C\\(23.*2\\)", "23.*22.*2"], weight: 15 },
      { element: "product of (365-k)/365 terms", patterns: ["365/365.*364/365", "product", "multiply"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["50%", "~50", "half"],
      description: "~50.7% probability with 23 people"
    },
    bonusInsights: ["birthday paradox", "pairwise comparisons", "counterintuitive probability"],
    wrongAnswerPatterns: [
      { pattern: "1/365|0\\.3%|very low", feedback: "The birthday paradox! With 23 people, it's ~50%, not 1/365." }
    ]
  },

  // ============================================================================
  // PUZZLE 158: Two Ropes and Fire
  // ============================================================================
  158: {
    title: "Two Ropes and Fire",
    requiredConcepts: [
      ["both ends", "two ends"],
      ["15", "fifteen"]
    ],
    coreAnswer: [
      { element: "light rope A from both ends", patterns: ["A.*both ends", "both ends.*A", "first.*both"], weight: 25 },
      { element: "light rope B from one end", patterns: ["B.*one end", "one end.*B"], weight: 20 },
      { element: "A burns out in 30 minutes", patterns: ["A.*30", "30.*A", "half hour"], weight: 15 },
      { element: "when A done, light other end of B", patterns: ["A.*done.*B", "light.*other.*B", "then.*B.*both"], weight: 25 },
      { element: "measure 15 minutes between events", patterns: ["15 min", "last 15", "final 15"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["15 minute", "fifteen"],
      description: "15 minutes measured from A burnout to B burnout"
    },
    bonusInsights: ["halving principle", "non-uniform handling", "event timing"],
    wrongAnswerPatterns: []
  },

  // ============================================================================
  // PUZZLE 159: The Hundred-Door Problem
  // ============================================================================
  159: {
    title: "The Hundred-Door Problem",
    requiredConcepts: [
      ["10", "ten"],
      ["perfect square", "square number"]
    ],
    coreAnswer: [
      { element: "10 doors are open", patterns: ["10 door", "ten door", "10 open"], weight: 35 },
      { element: "perfect squares stay open", patterns: ["perfect square", "square.*open", "1,4,9,16"], weight: 30 },
      { element: "squares have odd number of divisors", patterns: ["odd.*divisor", "odd.*factor"], weight: 20 },
      { element: "1,4,9,16,25,36,49,64,81,100", patterns: ["1.*4.*9.*16", "100.*square", "perfect.*≤100"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["10 door", "perfect square"],
      description: "10 doors open (perfect squares 1-100)"
    },
    bonusInsights: ["divisor counting", "parity analysis", "toggle mechanics"],
    wrongAnswerPatterns: [
      { pattern: "50|all|none", feedback: "Only perfect squares (10 of them) stay open!" }
    ]
  },

  // ============================================================================
  // PUZZLE 160: Burning Island Escape
  // ============================================================================
  160: {
    title: "Burning Island Escape",
    requiredConcepts: [
      ["start", "light", "set"],
      ["burn", "fire"]
    ],
    coreAnswer: [
      { element: "start a new fire yourself", patterns: ["start.*fire", "light.*fire", "set.*fire", "create.*fire"], weight: 40 },
      { element: "move to burned area (no fuel)", patterns: ["burned.*area", "no fuel", "already.*burn", "safe zone"], weight: 30 },
      { element: "fire needs fuel to burn", patterns: ["fuel", "can't re-burn", "nothing.*burn"], weight: 20 },
      { element: "counter-intuitive: more fire = safety", patterns: ["counter.*intuitive", "more fire", "fight fire"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["start.*fire.*safe", "burn.*then.*move"],
      description: "Start counter-fire, move to burned safe zone"
    },
    bonusInsights: ["counter-fire technique", "fuel depletion", "counterintuitive survival"],
    wrongAnswerPatterns: [
      { pattern: "run|swim|faster", feedback: "You can't outrun fire or swim! Start a counter-fire." }
    ]
  },

  // ============================================================================
  // PUZZLE 161: Maximum Rainfall
  // ============================================================================
  161: {
    title: "Maximum Rainfall",
    requiredConcepts: [
      ["trap", "collect", "hold"],
      ["min", "max"]
    ],
    coreAnswer: [
      { element: "water level = min(max_left, max_right)", patterns: ["min.*max", "minimum.*maximum", "lower.*wall"], weight: 40 },
      { element: "for each position, check boundaries", patterns: ["each position", "left.*right", "both sides"], weight: 25 },
      { element: "water = level - height", patterns: ["level.*height", "subtract.*height", "minus.*ground"], weight: 20 },
      { element: "analyze the specific heights given", patterns: ["3.*5.*2", "heights"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["water.*trap", "units.*water"],
      description: "Calculate water trapped using min-of-maxes"
    },
    bonusInsights: ["water trapping algorithm", "two-pointer technique", "elevation profile"],
    wrongAnswerPatterns: []
  },

  // ============================================================================
  // PUZZLE 162: Three Dice Problem
  // ============================================================================
  162: {
    title: "Three Dice Problem",
    requiredConcepts: [
      ["1/3", "one.?third", "33"],
      ["mod 3", "divisible"]
    ],
    coreAnswer: [
      { element: "probability is 1/3", patterns: ["1/3", "one.?third", "33%", "0\\.33"], weight: 40 },
      { element: "each die mod 3 equally distributed", patterns: ["mod 3", "residue", "remainder"], weight: 25 },
      { element: "by symmetry, sum mod 3 is uniform", patterns: ["symmetry", "equally likely", "uniform"], weight: 20 },
      { element: "9 favorable out of 27", patterns: ["9.*27", "9/27", "27 total"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["1/3", "33%"],
      description: "Exactly 1/3 probability by symmetry"
    },
    bonusInsights: ["modular arithmetic", "symmetry argument", "residue classes"],
    wrongAnswerPatterns: []
  },

  // ============================================================================
  // PUZZLE 163: Splitting Linked Chains
  // ============================================================================
  163: {
    title: "Splitting Linked Chains",
    requiredConcepts: [
      ["open", "cut", "break"],
      ["close", "rejoin"]
    ],
    coreAnswer: [
      { element: "strategic link opening", patterns: ["open.*link", "cut.*link", "break.*link"], weight: 30 },
      { element: "use opened links to rejoin", patterns: ["rejoin", "close", "connect", "reattach"], weight: 30 },
      { element: "minimize total operations", patterns: ["minimize", "fewest", "minimum cost"], weight: 20 },
      { element: "pieces: 1,2,3,4,5,6 = 21 links", patterns: ["1.*2.*3.*4.*5.*6", "21 link", "total 21"], weight: 20 }
    ],
    correctConclusion: {
      patterns: ["$6", "minimum cost", "optimal"],
      description: "Minimum cost through strategic cutting and rejoining"
    },
    bonusInsights: ["chain manipulation", "optimization", "cut positions"],
    wrongAnswerPatterns: []
  },

  // ============================================================================
  // PUZZLE 164: The Coin Triplets
  // ============================================================================
  164: {
    title: "The Coin Triplets",
    requiredConcepts: [
      ["2/3", "two.?third", "HTT"],
      ["1/3", "HHT"]
    ],
    coreAnswer: [
      { element: "HTT wins with probability 2/3", patterns: ["HTT.*2/3", "2/3.*HTT", "B.*win.*2/3"], weight: 40 },
      { element: "HHT wins with probability 1/3", patterns: ["HHT.*1/3", "1/3.*HHT", "A.*win.*1/3"], weight: 25 },
      { element: "Penney's game phenomenon", patterns: ["Penney", "non-transitive", "pattern racing"], weight: 20 },
      { element: "state transition analysis", patterns: ["state", "transition", "after H", "Markov"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["HTT.*2/3", "B.*win", "2/3"],
      description: "Person B (HTT) wins with 2/3 probability"
    },
    bonusInsights: ["Penney's game", "Markov chain", "pattern racing"],
    wrongAnswerPatterns: [
      { pattern: "50.*50|equal|same", feedback: "NOT 50/50! HTT has a 2/3 advantage due to state transitions." }
    ]
  },

  // ============================================================================
  // PUZZLE 167: Chameleons Go on a Date
  // ============================================================================
  167: {
    title: "Chameleons Go on a Date",
    requiredConcepts: [
      ["no", "impossible", "cannot"],
      ["mod 3", "remainder", "invariant"]
    ],
    coreAnswer: [
      { element: "no, they cannot all be same color", patterns: ["no", "cannot", "impossible", "never"], weight: 35 },
      { element: "differences mod 3 are invariant", patterns: ["mod 3", "remainder", "invariant", "difference"], weight: 30 },
      { element: "initial remainders: 1, 0, 2", patterns: ["13.*15.*17", "1.*0.*2", "remainders?"], weight: 20 },
      { element: "can never reach (0,0,0) from (1,0,2)", patterns: ["0.*0.*0", "can't reach", "impossible.*state"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["no", "impossible", "cannot"],
      description: "Impossible - mod 3 invariant prevents it"
    },
    bonusInsights: ["invariants", "modular arithmetic", "impossibility proof"],
    wrongAnswerPatterns: [
      { pattern: "yes|possible|can.*same", feedback: "Impossible! The mod 3 differences are invariant." }
    ]
  },

  // ============================================================================
  // PUZZLE 169: The Lion and the Unicorn
  // ============================================================================
  169: {
    title: "The Lion and the Unicorn",
    requiredConcepts: [
      ["Thursday", "Thurs"],
      ["lie", "truth"]
    ],
    coreAnswer: [
      { element: "today is Thursday", patterns: ["Thursday", "Thurs", "answer.*Thursday"], weight: 40 },
      { element: "Lion tells truth on Thursday", patterns: ["Lion.*truth.*Thurs", "Lion.*true.*Thu"], weight: 20 },
      { element: "Unicorn lies on Thursday", patterns: ["Unicorn.*lie.*Thurs", "Unicorn.*false.*Thu"], weight: 20 },
      { element: "both statements consistent only on Thursday", patterns: ["both.*Thursday", "only.*Thursday", "consistent"], weight: 20 }
    ],
    correctConclusion: {
      patterns: ["Thursday"],
      description: "Today is Thursday"
    },
    bonusInsights: ["truth tables", "case analysis", "logical consistency"],
    wrongAnswerPatterns: [
      { pattern: "Sunday|Monday|Tuesday|Wednesday|Friday|Saturday", feedback: "Only Thursday makes both statements consistent!" }
    ]
  },

  // ============================================================================
  // PUZZLE 170: 6x6 Grid Paths
  // ============================================================================
  170: {
    title: "6x6 Grid Paths",
    requiredConcepts: [
      ["252", "924"],
      ["combination", "C(", "choose"]
    ],
    coreAnswer: [
      { element: "252 paths (5×5 squares) or 924 (6×6 cells)", patterns: ["252", "924", "C\\(10.*5\\)", "C\\(12.*6\\)"], weight: 40 },
      { element: "use combinations C(n,k)", patterns: ["combination", "choose", "binomial", "C\\("], weight: 25 },
      { element: "total steps = right + down moves", patterns: ["right.*down", "R.*D", "total.*step"], weight: 20 },
      { element: "Pascal's triangle approach", patterns: ["Pascal", "triangle", "recursive"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["252", "924"],
      description: "252 (for 6×6 points) or 924 (for 6×6 cells)"
    },
    bonusInsights: ["combinatorics", "Pascal's triangle", "binomial coefficient"],
    wrongAnswerPatterns: []
  },

  // ============================================================================
  // PUZZLE 171: 10 Coins Puzzle
  // ============================================================================
  171: {
    title: "10 Coins Puzzle",
    requiredConcepts: [
      ["5", "five", "equal"],
      ["flip", "turn over"]
    ],
    coreAnswer: [
      { element: "divide into two piles of 5", patterns: ["two pile.*5", "5.*each", "divide.*equal"], weight: 35 },
      { element: "flip all coins in one pile", patterns: ["flip.*one pile", "turn over.*pile", "flip all.*5"], weight: 35 },
      { element: "now both piles have same heads", patterns: ["same.*head", "equal.*head", "match"], weight: 20 },
      { element: "if pile 1 has h heads, pile 2 has 5-h", patterns: ["5-h", "complement", "remaining"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["divide.*5.*flip", "two pile.*flip"],
      description: "Split into 5+5, flip one entire pile"
    },
    bonusInsights: ["invariant properties", "complementary counting", "blind operations"],
    wrongAnswerPatterns: [
      { pattern: "impossible|can't.*blind", feedback: "It IS possible! Divide into 5+5 and flip one entire pile." }
    ]
  },

  // ============================================================================
  // PUZZLE 172: Contaminated Pills
  // ============================================================================
  172: {
    title: "Contaminated Pills",
    requiredConcepts: [
      ["1", "2", "3", "4", "5"],
      ["weigh", "scale"]
    ],
    coreAnswer: [
      { element: "take 1 from jar 1, 2 from jar 2, etc.", patterns: ["1.*from.*1.*2.*from.*2", "1,2,3,4,5", "increasing"], weight: 40 },
      { element: "weigh all 15 pills together", patterns: ["15 pill", "all.*together", "one weighing"], weight: 25 },
      { element: "expected weight 150g, actual 150-N", patterns: ["150", "150-N", "difference.*jar"], weight: 25 },
      { element: "difference tells you which jar", patterns: ["difference", "tells.*jar", "identify"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["1.*2.*3.*4.*5", "150.*difference"],
      description: "Take 1,2,3,4,5 pills, weigh together, difference = jar number"
    },
    bonusInsights: ["weighted checksum", "information encoding", "single measurement"],
    wrongAnswerPatterns: [
      { pattern: "weigh each|5 weighing", feedback: "Only ONE weighing needed! Use 1,2,3,4,5 pills encoding." }
    ]
  },

  // ============================================================================
  // PUZZLE 173: 2-Player Coin Game
  // ============================================================================
  173: {
    title: "2-Player Coin Game",
    requiredConcepts: [
      ["odd", "even"],
      ["parity", "position"]
    ],
    coreAnswer: [
      { element: "sum values at odd vs even positions", patterns: ["odd.*even", "parity", "position.*sum"], weight: 35 },
      { element: "first player can guarantee getting one parity set", patterns: ["guarantee", "force", "control"], weight: 25 },
      { element: "pick end to force opponent to take other parity", patterns: ["force.*opponent", "pick.*end", "control.*parity"], weight: 25 },
      { element: "first player never loses", patterns: ["never lose", "guarantee.*win", "at worst.*tie"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["odd.*even.*sum", "parity.*strategy"],
      description: "Sum odd vs even positions, force opponent to take the lesser"
    },
    bonusInsights: ["parity partitioning", "game theory", "forcing moves"],
    wrongAnswerPatterns: [
      { pattern: "greedy|largest|maximum each", feedback: "Greedy doesn't work! Use parity strategy to guarantee winning." }
    ]
  },

  // ============================================================================
  // PUZZLE 174: Chessboard and Dominos
  // ============================================================================
  174: {
    title: "Chessboard and Dominos",
    requiredConcepts: [
      ["no", "impossible", "cannot"],
      ["color", "black", "white"]
    ],
    coreAnswer: [
      { element: "no, impossible to cover", patterns: ["no", "impossible", "cannot", "can't"], weight: 40 },
      { element: "opposite corners are same color", patterns: ["same color", "both white", "both black", "diagonal"], weight: 25 },
      { element: "each domino covers one black, one white", patterns: ["one black.*one white", "each domino.*cover"], weight: 20 },
      { element: "32 black, 30 white (or vice versa)", patterns: ["32.*30", "unequal", "mismatch"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["impossible", "cannot", "no"],
      description: "Impossible - color parity mismatch"
    },
    bonusInsights: ["coloring argument", "invariant", "impossibility proof"],
    wrongAnswerPatterns: [
      { pattern: "yes|possible|can cover", feedback: "Impossible! Opposite corners are same color, creating parity mismatch." }
    ]
  },

  // ============================================================================
  // PUZZLE 175: Find the Last Ball
  // ============================================================================
  175: {
    title: "Find the Last Ball",
    requiredConcepts: [
      ["blue", "Blue"],
      ["parity", "even", "odd"]
    ],
    coreAnswer: [
      { element: "last ball is Blue", patterns: ["blue", "Blue", "answer.*blue"], weight: 40 },
      { element: "red count parity is invariant", patterns: ["parity.*red", "red.*even", "red.*invariant"], weight: 30 },
      { element: "red starts at 20 (even)", patterns: ["20.*even", "start.*even", "initial.*even"], weight: 15 },
      { element: "red count changes by 0 or -2", patterns: ["0 or.*2", "change.*even", "stays even"], weight: 15 }
    ],
    correctConclusion: {
      patterns: ["blue", "Blue"],
      description: "Blue - red count can never reach 1 (always even)"
    },
    bonusInsights: ["invariant parity", "state transition", "conservation"],
    wrongAnswerPatterns: [
      { pattern: "red|Red", feedback: "Red count is always even (starts at 20). It can never be 1. Answer is Blue!" }
    ]
  },

  // ============================================================================
  // PUZZLE 176: Six Houses Logic
  // ============================================================================
  176: {
    title: "Six Houses Logic",
    requiredConcepts: [
      ["blue", "Blue"],
      ["tallest", "T"]
    ],
    coreAnswer: [
      { element: "tallest house T is Blue", patterns: ["T.*blue", "tallest.*blue", "Blue.*tallest"], weight: 45 },
      { element: "eliminate known colors", patterns: ["eliminat", "process.*eliminat", "not.*orange.*yellow"], weight: 25 },
      { element: "T is opposite Red (S)", patterns: ["T.*opposite.*red", "S.*red"], weight: 20 },
      { element: "only Blue remains for T", patterns: ["only.*blue", "blue.*remain", "must be blue"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["blue", "Blue"],
      description: "The tallest house is Blue"
    },
    bonusInsights: ["constraint satisfaction", "elimination", "logic grid"],
    wrongAnswerPatterns: []
  },

  // ============================================================================
  // PUZZLE 177: Blind Man and Pills
  // ============================================================================
  177: {
    title: "Blind Man and Pills",
    requiredConcepts: [
      ["half", "split", "cut"],
      ["each", "all"]
    ],
    coreAnswer: [
      { element: "break every pill in half", patterns: ["half.*every", "all.*half", "each.*half", "cut.*all"], weight: 40 },
      { element: "make two piles with one half of each", patterns: ["two pile", "one half.*each", "divide.*half"], weight: 30 },
      { element: "each pile has 1R + 1B content", patterns: ["1.*red.*1.*blue", "equal.*content", "each pile.*same"], weight: 20 },
      { element: "take one entire pile", patterns: ["take.*pile", "consume.*pile"], weight: 10 }
    ],
    correctConclusion: {
      patterns: ["half.*each", "break.*all.*half"],
      description: "Break all in half, make two piles, take one pile"
    },
    bonusInsights: ["symmetry creation", "lateral thinking", "compositional invariance"],
    wrongAnswerPatterns: [
      { pattern: "impossible|can't|die", feedback: "It IS possible! Break all pills in half and divide evenly." }
    ]
  }
};

// Helper function to get answer key by puzzle ID
export function getAnswerKey(puzzleId) {
  return riddleAnswerKeys[puzzleId] || null;
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { riddleAnswerKeys, getAnswerKey };
}
