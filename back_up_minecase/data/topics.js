export const topics = [
  {
    id: 0,
    name: "Riddle Marathon",
    icon: "🧩",
    color: "from-amber-500 via-orange-600 to-red-600",
    borderColor: "border-amber-400",
    description: "Classic brain teasers & interview puzzles - test your logic with the world's most famous riddles!",
    unlocked: true,
    featured: true,
    puzzles: [
      {
        id: 100,
        title: "The 3 Bulbs & 3 Switches",
        icon: "💡",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-yellow-500 to-amber-600",
        image: "puzzles/puzzle_100.webp",
        question: "You are outside a room with 3 switches, each controlling one of 3 light bulbs inside the room. Once you enter the room, you cannot return to the switches. The door is closed, so you cannot see inside from where the switches are.\n\nHow can you determine which switch controls which bulb?",
        idealAnswer: "Turn switch 1 ON and wait 10 minutes. Turn switch 1 OFF, then turn switch 2 ON. Enter the room immediately. The bulb that is ON is controlled by switch 2. The bulb that is OFF but WARM is controlled by switch 1. The bulb that is OFF and COLD is controlled by switch 3. The key insight is using heat as a second dimension of information beyond just on/off state.",
        keyPrinciples: [
          "Think beyond binary states",
          "Use multiple dimensions of information",
          "Physical properties can encode data",
          "Creative problem-solving"
        ]
      },
      {
        id: 101,
        title: "The 8 Balls Problem",
        icon: "⚖️",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-blue-500 to-indigo-600",
        image: "puzzles/puzzle_101.webp",
        question: "You have 8 balls that look identical. 7 of them weigh exactly the same, but one is slightly heavier. You have a balance scale that you can use only TWICE.\n\nHow do you find the heavy ball?",
        idealAnswer: "Divide the balls into 3 groups: 3, 3, and 2 balls. First weighing: Compare the two groups of 3 balls. If they balance, the heavy ball is in the group of 2 - weigh them against each other to find it. If they don't balance, take the heavier group of 3. Second weighing: From the heavy group of 3, weigh any 2 balls against each other. If they balance, the third ball is heavy. If they don't, the heavier one is the answer. This ternary search approach is optimal.",
        keyPrinciples: [
          "Divide and conquer strategy",
          "Information theory optimization",
          "Balance elimination (ternary vs binary)",
          "Worst-case analysis"
        ]
      },
      {
        id: 102,
        title: "Two Eggs and 100 Floors",
        icon: "🥚",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-orange-400 to-red-500",
        image: "puzzles/puzzle_102.png",
        question: "You have 2 identical eggs. You need to find the highest floor in a 100-story building from which an egg can be dropped without breaking. If an egg breaks, you can't use it again. If it survives, you can reuse it.\n\nWhat is the minimum number of drops required in the worst case to find the critical floor?",
        idealAnswer: "The answer is 14 drops. Start at floor 14. If it breaks, test floors 1-13 (13 more drops max = 14 total). If it survives, go to floor 27 (14+13). If it breaks, test 15-26 (12 more = 14 total). Continue: 39, 50, 60, 69, 77, 84, 90, 95, 99, 100. The pattern is: first drop from N, then N-1 floors gap, then N-2, etc. Where N+(N-1)+(N-2)+...+1 >= 100, so N=14. This minimizes the worst case by equalizing risk at each step.",
        keyPrinciples: [
          "Minimize worst-case scenarios",
          "Dynamic gap adjustment",
          "Resource constraint optimization",
          "Triangular number series"
        ]
      },
      {
        id: 103,
        title: "The Monty Hall Problem",
        icon: "🚪",
        skillFocus: "Decision Making",
        skillType: "decision",
        color: "from-purple-500 to-pink-600",
        image: "puzzles/puzzle_103.webp",
        question: "You're on a game show with 3 doors. Behind one door is a car; behind the others, goats. You pick door #1. The host, who knows what's behind each door, opens door #3 to reveal a goat. He then asks: 'Do you want to switch to door #2?'\n\nShould you switch, stay, or does it not matter?",
        idealAnswer: "You should ALWAYS switch! Switching wins 2/3 of the time, staying wins only 1/3. Here's why: Initially, you have 1/3 chance of picking the car. That means 2/3 chance the car is behind one of the other doors. When the host opens a goat door, that 2/3 probability concentrates entirely on the remaining door. The host's action provides information - he MUST open a goat door, which transfers probability. Many people's intuition says 50/50, but that ignores the host's constrained choice.",
        keyPrinciples: [
          "Conditional probability",
          "Information changes odds",
          "Counter-intuitive probability",
          "Bayesian reasoning"
        ]
      },
      {
        id: 104,
        title: "The Burning Rope Timer",
        icon: "🔥",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-red-500 to-orange-600",
        image: "puzzles/puzzle_104.webp",
        question: "You have two ropes and a lighter. Each rope takes exactly 60 minutes to burn completely, but they burn at inconsistent rates (the first half might burn in 5 minutes, the second half in 55 minutes).\n\nHow do you measure exactly 45 minutes?",
        idealAnswer: "Light rope A from BOTH ends and rope B from ONE end simultaneously. Rope A will burn out in exactly 30 minutes (since burning from both ends halves the time regardless of inconsistent rate). At that moment, light the OTHER end of rope B. Rope B had 30 minutes left, but lighting both ends halves that to 15 more minutes. Total: 30 + 15 = 45 minutes. The key insight is that lighting both ends always halves remaining time, even with non-uniform burn rates.",
        keyPrinciples: [
          "Simultaneous events",
          "Halving by dual sources",
          "Non-uniform rate handling",
          "Sequential operations"
        ]
      },
      {
        id: 105,
        title: "Pirates and Gold Coins",
        icon: "🏴‍☠️",
        skillFocus: "Decision Making",
        skillType: "decision",
        color: "from-slate-600 to-slate-800",
        image: "puzzles/puzzle_105.webp",
        question: "5 pirates (A, B, C, D, E in order of seniority) must divide 100 gold coins. The most senior pirate proposes a distribution. All pirates vote, and if at least 50% accept, the coins are distributed. Otherwise, the proposer is thrown overboard and the next pirate proposes.\n\nPirates are perfectly logical, want to maximize their gold, and prefer throwing others overboard if indifferent. What distribution should Pirate A propose?",
        idealAnswer: "Pirate A proposes: A=98, B=0, C=1, D=0, E=1. Working backwards: If only D and E remain, D takes all 100 (50% vote from himself). If C, D, E remain, C offers E just 1 coin (E prefers 1 to 0 when D proposes). If B, C, D, E remain, B offers D just 1 coin. So A needs 3 votes (including his own). He bribes C and E with 1 coin each - they'd get 0 if B proposes. A's greedy but logical solution wins 3-2.",
        keyPrinciples: [
          "Backward induction",
          "Game theory rationality",
          "Minimum viable coalition",
          "Self-interest prediction"
        ]
      },
      {
        id: 106,
        title: "The Poisoned Wine",
        icon: "🍷",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-rose-600 to-red-800",
        image: "puzzles/puzzle_106.webp",
        question: "A king has 1000 bottles of wine, and exactly one is poisoned. The poison kills in exactly 24 hours. The king has 10 prisoners he can use as testers, and the royal party is in 24 hours.\n\nHow can he identify the poisoned bottle with certainty using only 10 prisoners?",
        idealAnswer: "Use binary encoding! Number bottles 0-999. Assign each prisoner to a binary digit position (2^0 through 2^9). Each prisoner drinks from all bottles where their position has a 1. After 24 hours, the pattern of dead prisoners gives a binary number identifying the poisoned bottle. For example, if prisoners 1, 3, and 5 die, the bottle number is 2^0 + 2^2 + 2^4 = 1 + 4 + 16 = 21. With 10 prisoners, you can identify up to 2^10 = 1024 bottles.",
        keyPrinciples: [
          "Binary encoding",
          "Information theory (log2)",
          "Parallel testing",
          "Combinatorial optimization"
        ]
      },
      {
        id: 107,
        title: "100 Prisoners & Hat Colors",
        icon: "🎩",
        skillFocus: "Adaptive Learning",
        skillType: "adaptive",
        color: "from-gray-700 to-black",
        image: "puzzles/puzzle_107.webp",
        question: "100 prisoners stand in a line, each wearing a red or black hat. Each prisoner can see all hats in front of them but not their own or those behind. Starting from the back, each must guess their hat color. If correct, they're freed.\n\nPrisoners can strategize beforehand. What strategy guarantees saving at least 99 prisoners?",
        idealAnswer: "The prisoner at the back counts all red hats he sees. If odd, he says 'Red'; if even, he says 'Black.' This encodes parity information. The next prisoner counts red hats ahead - comparing to the parity signal tells him his own hat. Each subsequent prisoner tracks the running parity based on previous answers and what they see. This guarantees 99 are saved. The first prisoner has 50/50 odds (no information about his own hat), but his sacrifice provides a parity baseline for everyone else.",
        keyPrinciples: [
          "Parity encoding",
          "Information transfer through constraints",
          "Cooperative optimization",
          "Sacrifice for collective good"
        ]
      },
      {
        id: 108,
        title: "The Water Jug Puzzle",
        icon: "🫗",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-cyan-500 to-blue-600",
        image: "puzzles/puzzle_108.webp",
        question: "You have two jugs - one holds exactly 3 liters, the other holds exactly 5 liters. Neither has measurement markings. You have unlimited water from a tap.\n\nHow do you measure exactly 4 liters?",
        idealAnswer: "Step 1: Fill the 5L jug completely. Step 2: Pour from 5L jug into 3L jug until full (5L jug now has 2L). Step 3: Empty the 3L jug. Step 4: Pour the 2L from the 5L jug into the 3L jug. Step 5: Fill the 5L jug again. Step 6: Pour from 5L into 3L jug until full (3L jug had 2L, needs 1L more). Now the 5L jug has exactly 4 liters! The key is creating intermediate remainders through the difference between jug sizes.",
        keyPrinciples: [
          "State space exploration",
          "GCD and achievable measurements",
          "Working backwards from goal",
          "Intermediate state creation"
        ]
      },
      {
        id: 109,
        title: "The Fox, Chicken, and Grain",
        icon: "🦊",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-amber-600 to-orange-700",
        image: "puzzles/puzzle_109.webp",
        question: "A farmer needs to cross a river with a fox, a chicken, and a bag of grain. His boat can only carry him plus one item at a time. If left alone together: the fox will eat the chicken, or the chicken will eat the grain.\n\nHow does he get everything across safely?",
        idealAnswer: "1) Take chicken across (fox and grain are safe together). 2) Return alone. 3) Take fox across. 4) Bring chicken BACK (key insight!). 5) Take grain across (leave chicken). 6) Return alone. 7) Take chicken across. Done! The counterintuitive step is bringing something back. Many people get stuck assuming all movement must be forward. The solution requires 7 trips total, and the chicken makes 3 crossings because it's incompatible with both other items.",
        keyPrinciples: [
          "Constraint satisfaction",
          "Backward moves can be necessary",
          "Identifying incompatible pairs",
          "State transition planning"
        ]
      },
      {
        id: 110,
        title: "Cheryl's Birthday",
        icon: "🎂",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-pink-500 to-rose-600",
        image: "puzzles/puzzle_110.webp",
        question: "Cheryl gives Albert and Bernard a list of 10 possible birthdates:\nMay 15, May 16, May 19\nJune 17, June 18\nJuly 14, July 16\nAugust 14, August 15, August 17\n\nShe tells Albert the MONTH and Bernard the DAY.\n\nAlbert: 'I don't know, but I know Bernard doesn't know either.'\nBernard: 'I didn't know, but now I do.'\nAlbert: 'Now I know too.'\n\nWhen is Cheryl's birthday?",
        idealAnswer: "July 16. Step 1: Albert knows Bernard doesn't know. Bernard would know only if the day was unique (18 or 19). Albert is certain Bernard doesn't know, so the month can't be May or June (which contain 18 and 19). Remaining: July 14, July 16, August 14, August 15, August 17. Step 2: Bernard now knows. The day must be unique among remaining dates. 14 appears twice, so Bernard's day is 15, 16, or 17. He knows, so his day is unique to one month: July 16, August 15, or August 17. Step 3: Albert now knows, meaning the month has only one remaining option. August has two (15 and 17), July has one (16). Answer: July 16.",
        keyPrinciples: [
          "Knowledge about others' knowledge",
          "Elimination through meta-reasoning",
          "Sequential deduction",
          "Unique identifier isolation"
        ]
      },
      {
        id: 111,
        title: "The Bridge and Torch",
        icon: "🌉",
        skillFocus: "Decision Making",
        skillType: "decision",
        color: "from-indigo-600 to-purple-700",
        image: "puzzles/puzzle_111.webp",
        question: "Four people must cross a bridge at night. They have one torch that must be used for any crossing. The bridge holds maximum 2 people at once. Each person has different crossing speeds: A=1 min, B=2 min, C=5 min, D=10 min. When two cross together, they go at the slower person's speed.\n\nWhat's the minimum time to get everyone across?",
        idealAnswer: "The answer is 17 minutes. Counterintuitively, don't have the fastest person shuttle everyone! Optimal: 1) A and B cross (2 min). 2) A returns with torch (1 min). 3) C and D cross together (10 min - key insight!). 4) B returns with torch (2 min). 5) A and B cross (2 min). Total: 2+1+10+2+2 = 17 min. The naive approach (A shuttles everyone) takes 19 min. The trick is pairing the two slowest together and having the second-fastest do a return trip.",
        keyPrinciples: [
          "Non-greedy optimization",
          "Pairing slow elements together",
          "Counter-intuitive best solutions",
          "Total cost vs. step cost"
        ]
      },
      {
        id: 112,
        title: "The Mislabeled Jars",
        icon: "🏺",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-emerald-500 to-teal-600",
        image: "puzzles/puzzle_112.webp",
        question: "You have 3 jars containing: Apples, Oranges, or Mixed (apples and oranges). All three labels are WRONG - no jar has its correct label. You can only reach into ONE jar (without looking) and pull out ONE fruit.\n\nHow do you correctly label all three jars?",
        idealAnswer: "Pick from the jar labeled 'Mixed.' Since all labels are wrong, this jar contains ONLY apples OR only oranges. Suppose you pull an apple - this jar contains only Apples. Now, the jar labeled 'Apples' can't contain apples (labels are wrong), and we know where the apples are, so it must contain the Mixed fruits. The remaining jar (labeled 'Oranges') must contain only Oranges. The key insight is starting with the 'Mixed' label, which gives maximum information from a single sample.",
        keyPrinciples: [
          "Start with highest information gain",
          "Use constraints to propagate certainty",
          "All-wrong guarantee exploitation",
          "Process of elimination"
        ]
      },
      {
        id: 113,
        title: "The Airplane Seat Problem",
        icon: "✈️",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-sky-500 to-blue-600",
        image: "puzzles/puzzle_113.png",
        question: "100 passengers board a plane with 100 seats. The first passenger lost their ticket and sits in a random seat. Each subsequent passenger sits in their assigned seat if available, otherwise picks a random empty seat.\n\nWhat's the probability that passenger #100 gets their correct seat?",
        idealAnswer: "Exactly 50% (1/2). The elegant proof: Only two seats ever matter for passenger #100 - seat #1 and seat #100. Every other seat gets filled correctly or leads to a chain that eventually resolves to someone taking seat #1 or seat #100. If anyone takes seat #1, the chain ends and #100 gets their seat. If someone takes seat #100 first, passenger #100 is displaced. By symmetry, these are equally likely. This beautiful result holds regardless of the number of passengers!",
        keyPrinciples: [
          "Reduction to essential states",
          "Symmetry arguments",
          "Markov chain steady state",
          "Elegant mathematical insight"
        ]
      },
      {
        id: 114,
        title: "25 Horses Race",
        icon: "🐎",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-amber-700 to-yellow-600",
        image: "puzzles/puzzle_114.webp",
        question: "You have 25 horses and a racetrack that fits 5 horses at a time. You cannot use a stopwatch - you can only observe relative finishing order within each race.\n\nWhat's the minimum number of races needed to find the 3 FASTEST horses?",
        idealAnswer: "7 races. First, run 5 races with 5 horses each (5 races). Label winners A1, B1, C1, D1, E1 (where A1 > B1 > C1 in their race, etc.). Race 6: Race all 5 winners. Say order is A1, B1, C1, D1, E1. Now A1 is definitely fastest overall. Candidates for 2nd/3rd: A2, A3 (could only lose to A1), B1, B2 (could only lose to A1 or B1), and C1 (could only lose to A1, B1). Race 7: Race these 5 horses (A2, A3, B1, B2, C1). Top 2 finishers are 2nd and 3rd overall. D1, E1, and their heats are eliminated because they lost to C1 who can at best be 3rd.",
        keyPrinciples: [
          "Tournament bracket analysis",
          "Elimination logic",
          "Candidate set reduction",
          "Information-optimal testing"
        ]
      },
      {
        id: 115,
        title: "Gold Bar Payment",
        icon: "🪙",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-yellow-600 to-amber-700",
        image: "puzzles/puzzle_115.webp",
        question: "You have a gold bar that represents 7 days of work. You must pay an employee 1/7th of the bar each day. The employee won't work unless paid daily.\n\nYou can only make 2 cuts to the gold bar. How do you ensure the employee gets 1/7th each day?",
        idealAnswer: "Cut the bar into pieces of 1/7, 2/7, and 4/7. Day 1: Give 1/7. Day 2: Give 2/7, take back 1/7. Day 3: Give 1/7 (employee now has 2/7). Day 4: Give 4/7, take back 1/7 and 2/7. Day 5: Give 1/7. Day 6: Give 2/7, take back 1/7. Day 7: Give 1/7. The key is binary representation: any number 1-7 can be made with combinations of 1, 2, and 4. Trading pieces back and forth achieves daily payment with minimal cuts.",
        keyPrinciples: [
          "Binary number system",
          "Minimal operations",
          "Trading/exchange strategy",
          "Powers of 2 representation"
        ]
      },
      {
        id: 116,
        title: "The Ant and Triangle",
        icon: "🐜",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-green-600 to-teal-700",
        image: "puzzles/puzzle_116_v2.png",
        question: "Three ants are sitting at the three corners of an equilateral triangle. Each ant randomly picks a direction and starts moving along the edge of the triangle.\n\nWhat is the probability that none of the ants collide?",
        idealAnswer: "The probability is 1/4 (or 25%). Each ant has 2 choices: clockwise or counterclockwise. Total possibilities = 2Â³ = 8. Ants won't collide only if ALL move clockwise OR ALL move counterclockwise (they'll never meet). That's 2 favorable outcomes out of 8. Probability = 2/8 = 1/4. Alternatively, probability of collision = 1 - 1/4 = 3/4 (75%). The same logic extends to n-sided polygons: probability of no collision = 2/2â¿ = 1/2^(n-1).",
        keyPrinciples: [
          "Combinatorial probability",
          "Independent events",
          "Complementary counting",
          "Geometric symmetry"
        ]
      },
      {
        id: 117,
        title: "1000 Doors Problem",
        icon: "🚪",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-stone-600 to-stone-800",
        image: "puzzles/puzzle_117_v2.png",
        question: "You have 1000 doors in a row, all initially closed. You make 1000 passes. On pass i, you toggle every i-th door (open if closed, close if open).\n\nAfter all 1000 passes, which doors are open?",
        idealAnswer: "Only doors with perfect square numbers (1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400, 441, 484, 529, 576, 625, 676, 729, 784, 841, 900, 961) are open - that's 31 doors. A door is toggled once for each of its divisors. Most numbers have an even number of divisors (they come in pairs), so they end up closed. Perfect squares have an odd number of divisors (the square root pairs with itself), so they end up open.",
        keyPrinciples: [
          "Divisor properties",
          "Perfect squares",
          "Parity of toggles",
          "Number theory"
        ]
      },
      {
        id: 118,
        title: "The Josephus Problem",
        icon: "⚔️",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-red-700 to-rose-800",
        image: "puzzles/puzzle_118.png",
        question: "100 people stand in a circle. Starting with person 1, every second person is eliminated (1 eliminates 2, 3 eliminates 4, etc.) going around the circle repeatedly until one person remains.\n\nIf you want to survive, which position should you stand in?",
        idealAnswer: "Position 73. The pattern follows: for n people, if n = 2^m + L where 2^m is the largest power of 2 â‰¤ n, then survivor position = 2L + 1. For n=100: 100 = 64 + 36, so L = 36, and survivor = 2(36) + 1 = 73. Alternatively, write n in binary, rotate left by 1 position. 100 = 1100100 in binary. Rotate left: 1001001 = 73. This elegant pattern emerges from how eliminations propagate through powers of 2.",
        keyPrinciples: [
          "Recursive patterns",
          "Binary representation",
          "Mathematical induction",
          "Historical problem-solving"
        ]
      },
      {
        id: 119,
        title: "Measuring 6L with 4L and 9L",
        icon: "🪣",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-blue-500 to-cyan-600",
        image: "puzzles/puzzle_119.png",
        question: "You have a 4-liter jug and a 9-liter jug. Neither has any markings. You have unlimited water supply.\n\nHow do you measure exactly 6 liters?",
        idealAnswer: "Method 1: Fill 9L jug. Pour into 4L jug (9L has 5L left). Empty 4L. Pour 5L into 4L (1L left in 9L). Empty 4L. Pour 1L into 4L. Fill 9L. Pour into 4L until full (4L needs 3L, so 9L now has 6L). Method 2: Fill 4L twice into 9L (8L in 9L). Fill 4L, pour 1L into 9L to fill it. 4L jug now has 3L. Empty 9L. Pour 3L into 9L. Fill 4L, add to 9L. Now 9L has 7L. Fill 4L, pour 2L to fill 9L. 4L has 2L. Empty 9L. Pour 2L in. Fill 4L, add. Now 6L.",
        keyPrinciples: [
          "State space search",
          "GCD relationships",
          "Multiple solution paths",
          "BÃ©zout's identity"
        ]
      },
      {
        id: 120,
        title: "Two Hourglasses Timer",
        icon: "⏳",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-amber-600 to-yellow-700",
        image: "puzzles/puzzle_120.png",
        question: "You have a 7-minute hourglass and an 11-minute hourglass.\n\nHow do you measure exactly 15 minutes?",
        idealAnswer: "Start both hourglasses. When 7-min finishes (at t=7), flip it immediately. When 11-min finishes (at t=11), flip the 7-min glass again (it had 4 minutes of sand in bottom). The 7-min glass now has 4 minutes remaining. When it runs out: 11 + 4 = 15 minutes. Alternative: Start both. At t=7, flip 7-min. At t=11, start your timer. At t=14, 7-min runs out (7+7=14), flip it. At t=21, 7-min runs out again - but you only need 4 more minutes from t=11. Wait for 7-min to show 4 minutes passed = 15 minutes from start.",
        keyPrinciples: [
          "Parallel timing",
          "State tracking",
          "Difference calculations",
          "Event synchronization"
        ]
      },
      {
        id: 121,
        title: "Calculate Bee's Distance",
        icon: "🐝",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-yellow-500 to-amber-600",
        image: "puzzles/puzzle_121.png",
        question: "Two trains are 100 km apart on the same track, heading toward each other at 50 km/h each. A bee starts at one train and flies toward the other at 75 km/h. When it reaches the other train, it turns around and flies back. It continues until the trains collide.\n\nHow far does the bee travel in total?",
        idealAnswer: "The bee travels 75 km. Don't calculate each back-and-forth trip - that's infinitely complex! Instead: The trains approach at combined 100 km/h, so they meet in 1 hour (100km Ã· 100km/h). The bee flies for exactly 1 hour at 75 km/h = 75 km. The complexity of the bee's path is irrelevant - total distance = speed Ã— time. This puzzle tests whether you can find the elegant solution rather than getting lost in infinite series calculations.",
        keyPrinciples: [
          "Avoid overcomplicated approaches",
          "Focus on total time",
          "Relative velocity",
          "Elegant simplification"
        ]
      },
      {
        id: 122,
        title: "Heaven and Hell",
        icon: "😇",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-sky-500 to-indigo-600",
        image: "puzzles/puzzle_122.webp",
        question: "You're at a fork with two doors - one leads to Heaven, one to Hell. Two guards stand there: one ALWAYS lies, one ALWAYS tells the truth. You don't know which is which.\n\nYou can ask ONE question to ONE guard to find the door to Heaven. What do you ask?",
        idealAnswer: "Ask either guard: 'If I asked the OTHER guard which door leads to Heaven, what would he say?' Then go through the OPPOSITE door. Here's why: If you ask the truth-teller, he'll truthfully report the liar's lie - pointing to Hell. If you ask the liar, he'll lie about the truth-teller's truthful answer - also pointing to Hell. Either way, you get the wrong door, so go through the other one. The meta-question cancels out the uncertainty.",
        keyPrinciples: [
          "Meta-questions",
          "Double negation",
          "Logical symmetry",
          "Self-referential reasoning"
        ]
      },
      {
        id: 123,
        title: "The Camel and Bananas",
        icon: "🐪",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-amber-700 to-orange-700",
        image: "puzzles/puzzle_123.webp",
        question: "A camel must transport 3000 bananas across a 1000 km desert. It can carry maximum 1000 bananas at once and eats 1 banana per km traveled.\n\nWhat's the maximum number of bananas you can get across?",
        idealAnswer: "Maximum is 533 bananas. Strategy: Create depots. First, shuttle bananas to 200km point: 5 trips Ã— 200km = use 1000 bananas (eating) + have 2000 at 200km point. From 200km, shuttle to 533.33km: 3 trips needed for 2000 bananas, use 1000 bananas, have 1000 at 533.33km. Finally, one trip from 533.33km to 1000km (466.67km), eating 467 bananas. Remaining: 1000 - 467 â‰ˆ 533. The key is knowing when to reduce trips as bananas decrease.",
        keyPrinciples: [
          "Depot optimization",
          "Diminishing returns",
          "Trip reduction points",
          "Resource management"
        ]
      },
      {
        id: 124,
        title: "Snail Climbing a Wall",
        icon: "🐌",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-green-600 to-emerald-700",
        image: "puzzles/puzzle_124.png",
        question: "A snail is at the bottom of a 30-foot well. Each day it climbs 3 feet, but each night it slides back 2 feet.\n\nHow many days does it take the snail to reach the top?",
        idealAnswer: "28 days. Common mistake: (30 feet)/(1 foot net per day) = 30 days. Wrong! The snail makes NET 1 foot per day, but once it reaches the top during daytime, it doesn't slide back. After 27 days: 27 Ã— 1 = 27 feet progress. On day 28, it climbs 3 feet from 27 feet, reaching 30 feet before night. It escapes and doesn't slide back. The trap is not considering the final day differently when the goal is reached during the climb.",
        keyPrinciples: [
          "Boundary conditions",
          "Final step analysis",
          "Don't average the endpoint",
          "Progress vs. net progress"
        ]
      },
      {
        id: 125,
        title: "Handshake Problem",
        icon: "🤝",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-blue-600 to-indigo-700",
        image: "puzzles/puzzle_125.png",
        question: "At a party, 5 couples attend. Everyone shakes hands with everyone else EXCEPT their spouse. One person asks each of the other 9 people how many hands they shook.\n\nAll 9 people give DIFFERENT answers. How many hands did that person's spouse shake?",
        idealAnswer: "The spouse shook 4 hands. Since there are 8 people other than your spouse, possible handshakes are 0-8, but you can't shake your spouse's hand, so max is 8. The 9 different answers must be 0,1,2,3,4,5,6,7,8. The person who shook 8 hands shook everyone except spouse - their spouse shook 0 (only excluded by one person). Similarly, 7-shaker's spouse is 1-shaker, 6-shaker's spouse is 2-shaker, 5-shaker's spouse is 3-shaker. The remaining answer is 4, which must belong to the questioner's spouse.",
        keyPrinciples: [
          "Pigeonhole principle",
          "Symmetric pairing",
          "Constraint satisfaction",
          "Elimination"
        ]
      },
      {
        id: 126,
        title: "12 Balls Problem",
        icon: "⚖️",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-purple-600 to-violet-700",
        image: "puzzles/puzzle_126.png",
        question: "You have 12 balls that look identical. One ball is either heavier OR lighter than the rest (you don't know which). Using a balance scale exactly 3 times, find the odd ball AND determine if it's heavier or lighter.",
        idealAnswer: "Divide into groups of 4 (A, B, C). Weigh A vs B. Case 1: They balance - odd ball is in C. Weigh 3 from C vs 3 known normal balls. If balance, remaining C ball is odd; weigh vs normal to determine heavy/light. If unbalanced, you know if odd is heavy or light from direction. Case 2: A vs B unbalanced. The 4 in C are normal. Mark A balls as 'potentially heavy' and B as 'potentially light' (or vice versa). Complex but solvable weighings using this information. Each weighing has 3 outcomes, 3Â³=27 possibilities covers 24 cases (12 balls Ã— 2 possibilities).",
        keyPrinciples: [
          "Ternary information",
          "Marking/tracking states",
          "Worst-case optimization",
          "Information-theoretic bounds"
        ]
      },
      {
        id: 127,
        title: "Red and Blue Marbles",
        icon: "🔴",
        skillFocus: "Decision Making",
        skillType: "decision",
        color: "from-red-500 to-blue-600",
        image: "puzzles/puzzle_127.webp",
        question: "You have 50 red marbles and 50 blue marbles, and two empty jars. You must put ALL marbles into the jars (at least one marble per jar). Then one jar is picked randomly, and one marble is drawn randomly from that jar.\n\nHow do you arrange marbles to MAXIMIZE the chance of drawing a red marble?",
        idealAnswer: "Put 1 red marble in jar A, put remaining 49 red + 50 blue in jar B. Probability = (1/2)(1/1) + (1/2)(49/99) = 0.5 + 0.247 = 0.747 or about 74.7%. If you split evenly (25 each in both jars), probability = 50% - same as the baseline. The optimal strategy exploits the jar selection randomness by creating a 'guaranteed win' jar while accepting slightly worse odds in the other. This is better than any other distribution.",
        keyPrinciples: [
          "Conditional probability",
          "Optimization strategy",
          "Weighted averages",
          "Asymmetric distribution"
        ]
      },
      {
        id: 128,
        title: "Two Candle Timer",
        icon: "🕯️",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-orange-500 to-red-600",
        image: "puzzles/puzzle_128_v2.png",
        question: "You have two candles. Each takes exactly 60 minutes to burn completely, but they burn non-uniformly (different parts burn at different rates).\n\nHow do you measure exactly 15 minutes?",
        idealAnswer: "Light candle A from BOTH ends, and candle B from ONE end. When candle A burns out (30 minutes), immediately light the OTHER end of candle B. Candle B now burns from both ends with 30 minutes of wax remaining. Burning from both ends halves the remaining time to 15 minutes. Total measured: wait for candle A (30 min), then wait for candle B (15 more min). But we want just 15 min - so the 15 min is measured from when A finishes to when B finishes. Start timing when A burns out.",
        keyPrinciples: [
          "Simultaneous burning",
          "Non-uniform rate handling",
          "Halving principle",
          "Event-based timing"
        ]
      },
      {
        id: 129,
        title: "Minimum Cuts for Cake",
        icon: "🎂",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-pink-500 to-rose-600",
        image: "puzzles/puzzle_129.png",
        question: "You have a round cake. Using exactly 3 straight cuts (no rearranging pieces between cuts), what's the MAXIMUM number of pieces you can create?",
        idealAnswer: "Maximum is 8 pieces (with 3D thinking) or 7 pieces (2D only). For 2D: Each new cut can intersect all previous cuts at most once. Cut 1: 2 pieces. Cut 2: crosses cut 1 once = +2 = 4 pieces. Cut 3: crosses cuts 1 and 2 = +3 = 7 pieces. Formula: n cuts = (nÂ² + n + 2)/2 pieces max. For 3D: First make a horizontal cut (parallel to table) dividing cake in half height-wise. Then 2 vertical cuts as before (each creating 4 on top and bottom) = 8 pieces. The insight is thinking beyond the obvious 2D plane.",
        keyPrinciples: [
          "Geometric optimization",
          "Intersection maximization",
          "2D vs 3D thinking",
          "Recurrence relations"
        ]
      },
      {
        id: 134,
        title: "Coin Flip Probability",
        icon: "🪙",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-yellow-600 to-amber-700",
        image: "puzzles/puzzle_134_v2.png",
        question: "You flip a fair coin repeatedly until you get two consecutive heads (HH). Let X be the expected number of flips needed.\n\nWhat is the expected number of flips?",
        idealAnswer: "The expected number is 6 flips. Let E = expected flips from start. After flip 1: if Tails (prob 1/2), we restart, so E = 1 + E. If Heads (prob 1/2), flip again: if Tails, we restart, E = 2 + E. If Heads, we're done, E = 2. So: E = (1/2)(1 + E) + (1/2)[(1/2)(2 + E) + (1/2)(2)] = (1/2)(1 + E) + (1/4)(2 + E) + (1/4)(2). Solving: E = 1/2 + E/2 + 1/2 + E/4 + 1/2. E - 3E/4 = 3/2. E/4 = 3/2. E = 6.",
        keyPrinciples: [
          "Recursive expectation",
          "State transitions",
          "Solving recurrence",
          "Markov chains"
        ]
      },
      {
        id: 136,
        title: "Girl or Boy Probability",
        icon: "👶",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-pink-500 to-purple-600",
        image: "puzzles/puzzle_136.png",
        question: "A family has two children. You learn that at least one child is a boy.\n\nWhat's the probability that BOTH children are boys?",
        idealAnswer: "The probability is 1/3 (not 1/2!). All equally likely birth orders: {BB, BG, GB, GG}. Given 'at least one boy,' we eliminate GG. Remaining: {BB, BG, GB} - 3 equally likely outcomes. Only BB has two boys. Probability = 1/3. Common mistake: 'The other child is boy or girl with 50/50 odds' - this ignores the conditional probability structure. Note: If told 'the OLDER child is a boy,' then probability is 1/2 (only {BB, BG} possible). The wording changes the sample space dramatically.",
        keyPrinciples: [
          "Conditional probability",
          "Sample space enumeration",
          "Wording sensitivity",
          "Common probability traps"
        ]
      },

      {
        id: 140,
        title: "Rope Around the Earth",
        icon: "🌍",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-green-600 to-teal-700",
        image: "puzzles/puzzle_140.png",
        question: "A rope fits tightly around Earth's equator (circumference ≈ 40,000 km). Now add just 1 meter to the rope's length and lift it uniformly above the surface.\n\nHow high above Earth's surface will the rope rise?",
        idealAnswer: "The rope rises about 16 cm (0.16 m) uniformly! This is counterintuitively large given Earth's size. Math: Original circumference C = 2πR. New circumference C + 1 = 2π(R + h), where h is the height. So: 1 = 2πh, giving h = 1/(2π) ≈ 0.159 meters ≈ 16 cm. Amazingly, this result is INDEPENDENT of R (Earth's radius). Adding 1 meter to a rope around a basketball would also raise it ~16 cm! The Earth's actual size is irrelevant - only the added length matters.",
        keyPrinciples: [
          "Circumference formula",
          "Algebraic simplification",
          "Counter-intuitive results",
          "Scale independence"
        ]
      },
      {
        id: 141,
        title: "Filling a Truck",
        icon: "🚚",
        skillFocus: "Decision Making",
        skillType: "decision",
        color: "from-blue-600 to-indigo-700",
        image: "puzzles/puzzle_141.png",
        question: "You have boxes of three sizes: small (1 kg, $5), medium (3 kg, $12), and large (5 kg, $18). Your truck can carry exactly 10 kg.\n\nWhat combination of boxes maximizes your profit?",
        idealAnswer: "Optimal: 2 large boxes + nothing else = 10 kg, $36. Check all options: 10 small = $50 (10 kg) - BEST; 3 medium + 1 small = $41 (10 kg); 2 large = $36 (10 kg); 1 large + 1 medium + 2 small = $35 (10 kg); etc. Wait - 10 small = $50 is actually best! Value per kg: small = $5/kg, medium = $4/kg, large = $3.60/kg. Small has highest value density. Greedy by value density: use 10 small boxes. This is a variation of the bounded knapsack problem where the greedy approach works due to weight divisibility.",
        keyPrinciples: [
          "Value density calculation",
          "Knapsack optimization",
          "Greedy algorithm validity",
          "Exhaustive checking"
        ]
      },
      {
        id: 142,
        title: "The Pill Puzzle",
        icon: "💊",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-red-500 to-pink-600",
        image: "puzzles/puzzle_142.png",
        question: "You must take exactly one pill from bottle A and one pill from bottle B daily. They look identical. You accidentally pour 2 pills from bottle A into your hand, then 1 pill from bottle B. All 3 pills look the same. The pills are very expensive.\n\nHow do you take your proper dose today without wasting any pills?",
        idealAnswer: "Add one more pill from bottle B to your hand (now you have 2A + 2B = 4 pills). Cut ALL 4 pills in half. Take one half from each pill today (totaling 1A + 1B). Save the remaining halves for tomorrow (another 1A + 1B dose). No waste! The key insight is that adding to the 'contaminated' set allows you to divide equally. This generalizes: if you have n pills of type A and m pills of type B, add pills to make counts equal, cut all in half, and take the appropriate portions.",
        keyPrinciples: [
          "Balance restoration",
          "Symmetry creation",
          "Resource conservation",
          "Division strategy"
        ]
      },

      {
        id: 144,
        title: "Making Change",
        icon: "🪙",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-amber-600 to-yellow-700",
        image: "puzzles/puzzle_144_v2.png",
        question: "Using exactly 4 coins from {1¢, 5¢, 10¢, 25¢, 50¢}, what's the MAXIMUM value you CAN'T make exactly? Assume you have unlimited coins of each type and must use exactly 4 coins.\n\nWith exactly 4 coins, what amounts between 4¢ and 200¢ are impossible to make?",
        idealAnswer: "The question asks what's impossible with exactly 4 coins. You can make: 4¢ (4×1), 7¢ (1+1+1+5), etc. The maximum impossible value is tricky - you can make most values. Key insight: with 4 coins, max = 4×50 = 200¢. Min = 4¢. Many combinations possible. Impossible values include: none above 8¢ are impossible! With coins 1,5,10,25,50 and 4 coins, you can make any value from 4¢ to 200¢ by adjusting the mix. Values 1,2,3 are impossible (need fewer than 4 coins). So maximum 'impossible' value is 3¢.",
        keyPrinciples: [
          "Coin combinations",
          "Constraint satisfaction",
          "Boundary analysis",
          "Frobenius number variant"
        ]
      },
      {
        id: 146,
        title: "Game of Nim",
        icon: "🎯",
        skillFocus: "Decision Making",
        skillType: "decision",
        color: "from-gray-700 to-slate-800",
        image: "puzzles/puzzle_146.png",
        question: "Three piles have 3, 4, and 5 stones respectively. Two players alternate turns. On each turn, a player removes any number of stones (â‰¥1) from a single pile. The player who takes the last stone wins.\n\nYou move first. What's your winning strategy?",
        idealAnswer: "Take 2 stones from the pile of 5, leaving (3,4,3). To win at Nim, leave your opponent with a 'losing position' where XOR of all pile sizes = 0. Initial: 3 XOR 4 XOR 5 = 011 XOR 100 XOR 101 = 010 (=2, non-zero, good for first player). To make XOR = 0: change 5 to 3 (011 XOR 100 XOR 011 = 000). So remove 2 from the 5-pile. Now (3,4,3): 011 XOR 100 XOR 011 = 100 XOR 011 = 111... wait, let me recalculate. Actually (3,4,3): any move opponent makes leaves XOR non-zero, and you can always respond to restore XOR=0.",
        keyPrinciples: [
          "Nim XOR strategy",
          "Game theory",
          "Winning vs losing positions",
          "Binary operations"
        ]
      },
      {
        id: 148,
        title: "Egg Drop Optimization",
        icon: "🥚",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-orange-500 to-red-600",
        image: "puzzles/puzzle_148.png",
        question: "You have 3 eggs and a 100-story building. You need to find the highest safe floor (from which eggs don't break when dropped). Broken eggs can't be reused.\n\nWhat's the minimum number of drops needed in the worst case?",
        idealAnswer: "Minimum is 9 drops. With 3 eggs, use a triangular/tetrahedral approach. With n drops and 3 eggs, you can test up to C(n,1) + C(n,2) + C(n,3) floors = n + n(n-1)/2 + n(n-1)(n-2)/6 floors. For n=9: 9 + 36 + 84 = 129 â‰¥ 100. Strategy: First egg tests floors that create equal-sized subproblems. If first egg breaks, you have 2 eggs for subproblem. The recurrence: T(f,e) = 1 + min over x of max{T(x-1, e-1), T(f-x, e)}. Working backwards gives optimal drop points.",
        keyPrinciples: [
          "Dynamic programming",
          "Worst-case minimization",
          "Recurrence relations",
          "Binomial coefficients"
        ]
      },
      {
        id: 149,
        title: "The Warden's Challenge",
        icon: "🎰",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-red-700 to-rose-800",
        image: "puzzles/puzzle_149.png",
        question: "A warden places 100 boxes in a row. 100 prisoners are each assigned a random, unique target number (1-100). Each prisoner can open up to 50 boxes to find their number. Prisoners cannot communicate during or after their attempts. All 100 must find their number to win.\n\nWhat strategy gives better than (1/2)^100 odds?",
        idealAnswer: "The Loop Strategy gives ~31% success! Each prisoner starts at box number = their target number. Open it, see a number, go to that box number, repeat until finding their number or hitting 50 attempts. The permutation of numbers in boxes forms cycles. A prisoner succeeds iff their cycle length â‰¤ 50. Probability that the longest cycle in a random permutation of 100 is â‰¤ 50 is about 31%. All prisoners simultaneously succeed if all cycle lengths â‰¤ 50. This transforms near-zero odds to ~31% through correlated behavior!",
        keyPrinciples: [
          "Permutation cycles",
          "Coordinated strategy",
          "Correlated outcomes",
          "Probability amplification"
        ]
      },
      {
        id: 150,
        title: "Two Circles Overlap",
        icon: "⭕",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-blue-500 to-indigo-600",
        image: "puzzles/puzzle_150.png",
        question: "Two circles with radius 1 each. The center of each circle lies on the circumference of the other.\n\nWhat is the area of their overlapping region (the 'vesica piscis' or fish-bladder shape)?",
        idealAnswer: "The area is (2Ï€/3 - âˆš3/2) â‰ˆ 1.228. The overlap is two circular segments. Each segment is a circular sector minus a triangle. The circles intersect at points where they're distance 1 from both centers. By geometry, the chord connecting intersection points has length âˆš3 (equilateral triangles form). Each sector angle is 120Â° = 2Ï€/3 radians. Sector area = (1/2)rÂ²Î¸ = (1/2)(1)(2Ï€/3) = Ï€/3. Triangle area = (âˆš3/4)(1)Â² = âˆš3/4. Segment = Ï€/3 - âˆš3/4. Total overlap = 2 segments = 2Ï€/3 - âˆš3/2.",
        keyPrinciples: [
          "Circular segment area",
          "Geometric construction",
          "Sector and triangle",
          "Vesica piscis"
        ]
      },
      {
        id: 151,
        title: "Broken Calculator",
        icon: "🔢",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-gray-600 to-slate-700",
        image: "puzzles/puzzle_151.png",
        question: "Your calculator only has buttons: 7, ×, and = (starting display shows 1). You can only multiply by 7.\n\nHow do you display the number 343 with the fewest button presses?",
        idealAnswer: "Press: 7 × = = (4 presses). Start with 1 on display. Press 7: enters 7. Press ×: prepares multiplication. Press = once: computes 7 × 7 = 49. Press = again: computes 49 × 7 = 343. Most calculators repeat the last operation when you press = again. So 7 × = = gives 7 × 7 × 7 = 343. Note that 343 = 7³, so you need exactly 3 multiplications by 7. The 'trick' is knowing the = key repeats the multiplication.",
        keyPrinciples: [
          "Calculator behavior",
          "Power calculation",
          "Repeat function",
          "Minimal operations"
        ]
      },
      {
        id: 152,
        title: "The Round Table",
        icon: "🪑",
        skillFocus: "Decision Making",
        skillType: "decision",
        color: "from-amber-700 to-brown-800",
        image: "puzzles/puzzle_152.png",
        question: "Two players take turns placing identical coins flat on a circular table. Coins cannot overlap or hang off the edge. The player who cannot place a coin loses.\n\nIf you go first, what's your winning strategy?",
        idealAnswer: "First player wins by placing the first coin EXACTLY at the center of the table. Then, for every coin opponent places, you place yours at the point diametrically opposite (mirror across center). Since opponent could place there, you always can too. Opponent will always run out of space first because you're symmetrically mirroring every move. The key insight is that the center point is the 'axis of symmetry' - once claimed, you control the symmetry. If you don't take center first, opponent can use this strategy against you.",
        keyPrinciples: [
          "Symmetry strategy",
          "Center control",
          "Mirroring moves",
          "First-mover advantage"
        ]
      },
      {
        id: 153,
        title: "Four Colored Hats",
        icon: "🎭",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-purple-600 to-pink-700",
        image: "puzzles/puzzle_153.png",
        question: "4 prisoners stand in a line (A-B-C-D). A wall separates C,D from A,B. They can only see people in front: D sees C; C sees nothing but wall; B sees wall from behind; A sees B. Each wears a hat: 2 black, 2 white (unknown distribution). If anyone correctly calls their color, all go free. They cannot see their own hats.\n\nCan they guarantee freedom?",
        idealAnswer: "Yes! Strategy: D can see C's hat. If D sees C has SAME color as what D knows about A (from B's reaction), D knows their own is different. Wait - D can't see A. Let me reconsider: A sees B, D sees C. Neither B nor C sees anyone. If D sees C's hat same as B's (which A would react to), D can deduce. Actual solution: Wait 1 minute. If D saw C with same color as D, D can't know D's color. But if A sees B, and after silence, A knows hats are distributed so A and D have same color. Complex deduction required.",
        keyPrinciples: [
          "Information from silence",
          "Deductive reasoning",
          "Time-based signaling",
          "Limited visibility logic"
        ]
      },
      {
        id: 154,
        title: "Splitting a Cake Fairly",
        icon: "🍰",
        skillFocus: "Decision Making",
        skillType: "decision",
        color: "from-pink-500 to-red-600",
        image: "puzzles/puzzle_154.png",
        question: "Two children want to share a cake fairly. Neither trusts the other. Each values different parts differently (one might prefer frosting, the other prefers the inside).\n\nDesign a procedure that guarantees each child believes they got AT LEAST half the cake's value (by their own assessment).",
        idealAnswer: "The 'I cut, you choose' protocol: Child A cuts the cake into two pieces they consider exactly equal (by their own valuation). Child B then chooses whichever piece they prefer. Child A is guaranteed at least 50% (they cut equally). Child B is guaranteed at least 50% (they chose the better piece by their valuation). Neither can complain - A set the portions, B chose first. This is envy-free for 2 people. For n people, more complex protocols exist (Selfridge-Conway, Brams-Taylor). The key is incentive-compatible design.",
        keyPrinciples: [
          "Incentive-compatible mechanisms",
          "Envy-free division",
          "Cut-and-choose protocol",
          "Game theory fairness"
        ]
      },


      {
        id: 157,
        title: "Probability of Same Birthday",
        icon: "🎂",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-pink-500 to-purple-600",
        image: "puzzles/puzzle_157.png",
        question: "In a room of 23 people, what's the probability that at least two people share a birthday? (Assume 365 days, uniform distribution, ignore leap years)\n\nIs it closer to 10%, 25%, 50%, or 75%?",
        idealAnswer: "About 50% (actually 50.7%)! This counterintuitively high probability is called the 'Birthday Paradox.' Calculate probability of NO shared birthday: P(no match) = (365/365) Ã— (364/365) Ã— (363/365) Ã— ... Ã— (343/365) = 365!/[342! Ã— 365Â²Â³] â‰ˆ 0.493. So P(at least one match) = 1 - 0.493 â‰ˆ 0.507 = 50.7%. The key insight: with 23 people, there are C(23,2) = 253 pairs to compare, many opportunities for a match. At 50 people, probability exceeds 97%. At 70 people, it's 99.9%.",
        keyPrinciples: [
          "Birthday paradox",
          "Complementary probability",
          "Pairwise comparisons",
          "Counterintuitive probability"
        ]
      },
      {
        id: 158,
        title: "Two Ropes and Fire",
        icon: "🔥",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-orange-600 to-red-700",
        image: "puzzles/puzzle_158.png",
        question: "You have two ropes. Each takes exactly 1 hour to burn completely, but they burn non-uniformly (different sections burn at different rates). You have matches.\n\nHow do you measure exactly 15 minutes?",
        idealAnswer: "Light rope A from BOTH ends AND light rope B from ONE end simultaneously. Rope A will burn out in exactly 30 minutes (burning from both ends halves total time, regardless of non-uniformity). When A finishes, immediately light the OTHER end of rope B. At that moment, B has 30 minutes of rope left. Burning from both ends now, B will finish in 15 more minutes. The 15 minutes is measured from when A finishes to when B finishes. Total time from start: 30 + 15 = 45 minutes, but you measure the last 15 minutes specifically.",
        keyPrinciples: [
          "Dual-end burning halves time",
          "Non-uniform rate handling",
          "Sequential timing",
          "Event synchronization"
        ]
      },
      {
        id: 159,
        title: "The Hundred-Door Problem",
        icon: "🚪",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-gray-700 to-slate-800",
        image: "puzzles/puzzle_159_v2.png",
        question: "100 closed doors in a hallway. You make 100 passes. On pass i, you toggle every i-th door (close if open, open if closed). Starting from pass 1 (toggle all), pass 2 (toggle every 2nd), etc.\n\nAfter all passes, how many doors are open?",
        idealAnswer: "Exactly 10 doors are open (doors 1, 4, 9, 16, 25, 36, 49, 64, 81, 100). A door is toggled once for each of its divisors. Door n is toggled by passes 1, 2, ..., n only if n is divisible by that number. Most numbers have an EVEN number of divisors (they come in pairs: 12 = 1Ã—12 = 2Ã—6 = 3Ã—4). Even toggles = closed. Perfect squares have ODD divisors (the square root pairs with itself: 9 = 1Ã—9 = 3Ã—3). Odd toggles = open. Perfect squares â‰¤ 100: 1,4,9,16,25,36,49,64,81,100 = 10 doors.",
        keyPrinciples: [
          "Divisor counting",
          "Perfect square property",
          "Parity analysis",
          "Toggle mechanics"
        ]
      },
      {
        id: 160,
        title: "Burning Island Escape",
        icon: "🏝️",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-orange-600 to-amber-700",
        image: "puzzles/puzzle_160.png",
        question: "You're on a small island. A fire starts at the east end and burns westward (wind blows west). The fire burns 1 meter per minute. You can run 2 meters per minute, but the ocean surrounds you.\n\nHow do you survive?",
        idealAnswer: "Light a NEW fire at your location (or slightly to your west). This second fire will burn EASTWARD initially (less wind there) or with the wind toward the main fire. When they meet, that area is already burnt. Run into the freshly burned zone from your fire - no fuel remains to burn, so you're safe even when the main fire arrives. The key insight is that fire needs fuel, and burned ground can't re-burn. Create a 'safe zone' by pre-burning it yourself. Counter-intuitive: start MORE fire to escape fire.",
        keyPrinciples: [
          "Counter-fire technique",
          "Fuel depletion",
          "Creating safe zones",
          "Counterintuitive survival"
        ]
      },
      {
        id: 161,
        title: "Maximum Rainfall",
        icon: "🌧️",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-blue-600 to-indigo-700",
        image: "puzzles/puzzle_161.png",
        question: "Three buildings of heights 3, 5, and 2 units (in that order) are in a row. It rains, and water collects between buildings.\n\nHow much water can be trapped?",
        idealAnswer: "4 units of water. For each position, water level = min(max_left, max_right). Position of height 3: no water (leftmost). Position of height 5: no water (highest). Position of height 2: water level = min(max_left=5, max_right=2) = 2. Wait - I miscounted. Let me reconsider with indices: heights[0]=3, heights[1]=5, heights[2]=2. For heights[0]: max_left=0, max_right=5, water = min(0,5)-3 = negative, so 0. For heights[2]: max_left=5, max_right=0, water = min(5,0)-2 = negative, so 0. Actually no water trapped! Heights are [3,5,2] - water would flow off both sides.",
        keyPrinciples: [
          "Water trapping algorithm",
          "Two-pointer technique",
          "Min of maxes",
          "Elevation profiles"
        ]
      },
      {
        id: 162,
        title: "Three Dice Problem",
        icon: "🎲",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-red-600 to-pink-700",
        image: "puzzles/puzzle_162_v2.png",
        question: "You roll three fair dice. What's the probability that the sum is divisible by 3?",
        idealAnswer: "Probability is exactly 1/3. Each die mod 3 gives 0, 1, or 2 with probability 1/3 each (dice faces 3,6â†’0; 1,4â†’1; 2,5â†’2). For sum â‰¡ 0 (mod 3), we need (0,0,0), (0,1,2), (0,2,1), (1,0,2), (1,1,1), (1,2,0), (2,0,1), (2,1,0), (2,2,2) - that's 9 outcomes. Total outcomes = 3Â³ = 27. Probability = 9/27 = 1/3. Alternatively, by symmetry: sum mod 3 is equally likely to be 0, 1, or 2. So probability of any specific residue = 1/3. Elegant symmetry argument!",
        keyPrinciples: [
          "Modular arithmetic",
          "Symmetry argument",
          "Residue classes",
          "Dice probability"
        ]
      },
      {
        id: 163,
        title: "Splitting Linked Chains",
        icon: "🔗",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-gray-600 to-slate-700",
        image: "puzzles/puzzle_163.png",
        question: "You have a chain of 21 links. Opening a link costs $1, closing a link costs $2. You want to cut the chain into pieces of 1, 2, 3, 4, 5, and 6 links.\n\nWhat's the minimum cost?",
        idealAnswer: "Minimum cost is $6. Don't cut into exact pieces - be clever! Open ONE link (cost $1). This one link can now connect pieces of different sizes as needed, or the remaining chain (20 links) can be cut once more. Actually, let's reconsider: we need pieces of 1,2,3,4,5,6 links (total = 21). Open link at position 4 to get (3,open,17). Open link at position 10 (in the 17-section) to get (3,open,5,open,11). Continue strategically. Best: open 3 links total for $3, use them to rejoin if needed for $6 each... The optimal solution needs careful analysis of which links to open to minimize total operations.",
        keyPrinciples: [
          "Link manipulation costs",
          "Optimize cut positions",
          "Rejoining strategy",
          "Chain reconstruction"
        ]
      },
      {
        id: 164,
        title: "The Coin Triplets",
        icon: "🪙",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-yellow-600 to-amber-700",
        image: "puzzles/puzzle_164.png",
        question: "You flip a fair coin until you get HHT or HTT (whichever comes first). Person A wins if HHT appears first. Person B wins if HTT appears first.\n\nWho has the advantage, and what's the probability each wins?",
        idealAnswer: "Person B (HTT) wins with probability 2/3! After H: both patterns need HT or TT next. If TT, HHT is impossible without T to 'reset,' while HTT just needs one H before T. Analysis: Let P = P(HTT wins from start). After first flip: If T (prob 1/2), restart. If H (prob 1/2), now at state 'H'. From H: If H, we're at HH (good for HHT). If T, we're at HT. From HT: next flip decides! If H, it's HTH, back to 'H'. If T, HTT wins! Working through: P(HHT wins) = 1/3, P(HTT wins) = 2/3. This is the Penney's game phenomenon.",
        keyPrinciples: [
          "Non-transitive sequences",
          "Penney's game",
          "Markov chain analysis",
          "Pattern racing"
        ]
      },


      {
        id: 167,
        title: "Chameleons Go on a Date",
        icon: "🦎",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-indigo-500 to-purple-600",
        image: "puzzles/puzzle_167.webp",
        question: "On an island, there are 13 red, 15 green, and 17 blue chameleons. When two chameleons of different colors meet, they both change to the third color (e.g., if red meets blue, both become green). Can all chameleons ever become the same color?",
        idealAnswer: "No, they cannot. The key is in the remainders when dividing by 3. Current counts: 13, 15, 17. Remainders mod 3: 1, 0, 2. When two chameleons change color (e.g., -1 Red, -1 Green, +2 Blue), the difference between any two color counts either stays the same mod 3 or changes by 0 mod 3. For all to be one color, the counts would be (45,0,0), meaning remainders (0,0,0). You can never reach state (0,0,0) from state (1,0,2). The 'invariant' (difference between counts mod 3) is preserved.",
        keyPrinciples: [
          "Invariants",
          "Modular arithmetic",
          "State space analysis",
          "Impossibility proofs"
        ]
      },

      {
        id: 169,
        title: "The Lion and the Unicorn",
        icon: "🦁",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-amber-600 to-yellow-700",
        image: "puzzles/puzzle_169.webp",
        question: "The Lion lies on Mondays, Tuesdays, and Wednesdays but tells the truth on other days. The Unicorn lies on Thursdays, Fridays, and Saturdays but tells the truth on other days. One day they both said 'Yesterday was one of my lying days.' What day is it today?",
        idealAnswer: "Today is Thursday. Analysis: Lion says 'Yesterday I lied' -> True only if today is Thursday (since he lied Wednesday) or Monday (since he lied Sunday - impossible as he tells truth Sun). Unicorn says 'Yesterday I lied' -> True only if today is Sunday (lied Sat) or Thursday (lied Wed - impossible as he tells truth Wed). Wait, Unicorn lies Thu, Fri, Sat. If today is Thursday, Unicorn lies. He says 'Yesterday (Wed) I lied'. Wed he tells TRUTH. So 'Yesterday I lied' is a LIE. This matches his behavior on Thursday! Lion tells truth on Thursday, says 'Yesterday (Wed) I lied' (which is true). So both conditions met.",
        keyPrinciples: [
          "Truth tables",
          "Case analysis",
          "Logical consistency",
          "Self-reference"
        ]
      },
      {
        id: 170,
        title: "6x6 Grid Paths",
        icon: "🕸️",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-slate-600 to-slate-800",
        image: "puzzles/puzzle_170.webp",
        question: "You are at the top-left corner of a 6x6 grid. You can only move right or down. How many different paths can you take to reach the bottom-right corner of the grid?",
        idealAnswer: "The answer is 252. To traverse a 6x6 grid (which has 6 blocks per side, so 6+1=7 points or just 6 steps x 6 steps? Usually '6x6 grid' implies 6 cells, not 6 lines. Assuming 6 cells: 5 steps right, 5 steps down. Wait, standard problem is NxN grid of cells requiring N steps right, N steps down. Total steps = 12? No, if 6x6 cells, you need 6 R moves and 6 D moves. Total 12. C(12,6) = 924. IF grid means 6x6 POINTS (5x5 cells), it's C(10,5)=252. The prompt likely refers to '6x6 grid of lines' meaning 5x5 squares, or it's a 6x6 square board (like slightly larger chess) needing 6 moves. Let's assume standard 'Grid of size 6x6' usually means 6x6 squares, so 6 moves R, 6 moves D. C(12,6) = 924. Re-reading typical interview questions: '6x6 grid' often implies 6x6 NODES (5x5 squares) -> 252. Let's provide the Combinatorics formula logic so the user understands.",
        keyPrinciples: [
          "Combinatorics",
          "Pascal's Triangle",
          "Pathfinding",
          "Binomial coefficients"
        ]
      },
      {
        id: 171,
        title: "10 Coins Puzzle",
        icon: "🪙",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-yellow-600 to-amber-700",
        image: "puzzles/puzzle_171.webp",
        question: "You are blindfolded, and 10 coins are placed in front of you on the table. You are allowed to touch the coins, but can't tell which way up they are by feel. You are told that there are 5 coins heads up, and 5 coins tails up, but not which ones are which.\n\nCan you make two piles of coins, each with the same number of heads up? You can flip the coins any number of times.",
        idealAnswer: "Divide the coins into two equal piles (5 coins each). Then, flip all the coins in one of the piles. This guarantees both piles have the same number of heads. Proof: Pile 1 has 'h' heads and '5-h' tails. Pile 2 has '5-h' heads (since total heads=5). If you flip Pile 1, its 'h' heads become tails, and '5-h' tails become heads. So Pile 1 now has '5-h' heads, matching Pile 2.",
        keyPrinciples: [
          "Invariant properties",
          "Blind operations",
          "Complementary counting",
          "State transformation"
        ]
      },
      {
        id: 172,
        title: "Contaminated Pills",
        icon: "💊",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-green-600 to-teal-700",
        image: "puzzles/puzzle_172.png",
        question: "You have 5 jars of pills. Each pill in a jar normally weighs 10 grams, but one of the jars is contaminated, and every pill in that jar weighs 9 grams instead of 10. You are allowed to use a digital weighing scale only once.\n\nHow can you determine which jar contains the contaminated pills?",
        idealAnswer: "Take 1 pill from jar 1, 2 pills from jar 2, 3 from jar 3, 4 from jar 4, and 5 from jar 5. Weigh all 15 pills together. Expected weight if normal = 15 × 10g = 150g. The actual weight will be 150 - N, where N is the jar number. Example: If weight is 147g, 150-147=3, so Jar 3 is contaminated. The difference directly encodes the jar index.",
        keyPrinciples: [
          "Weighted checksums",
          "Information encoding",
          "Linear combination",
          "Single measurement identification"
        ]
      },
      {
        id: 173,
        title: "2-Player Coin Game",
        icon: "🎮",
        skillFocus: "Game Theory",
        skillType: "logical",
        color: "from-blue-600 to-indigo-700",
        image: "puzzles/puzzle_173.png",
        question: "There is a row of an even number of coins with different values. Two players take turns picking a coin from either end. The goal is to collect the maximum total value.\n\nDevise a strategy for the first player to GUARANTEE they never lose (win or tie).",
        idealAnswer: "Sum values at odd positions (1st, 3rd...) and even positions (2nd, 4th...). If Sum(Odd) > Sum(Even), pick the first coin (odd position). This forces opponent to pick an even coin, exposing another odd coin for you. You can guarantee getting ALL odd coins. If Sum(Even) > Sum(Odd), pick the last coin (even position) to force the same pattern. You guarantee capturing the richer parity set.",
        keyPrinciples: [
          "Parity partitioning",
          "Game theory dominance",
          "Global optimum vs greedy",
          "Forcing moves"
        ]
      },
      {
        id: 174,
        title: "Chessboard and Dominos",
        icon: "♟️",
        skillFocus: "Visual Logic",
        skillType: "logical",
        color: "from-gray-700 to-slate-900",
        image: "puzzles/puzzle_174.webp",
        question: "An 8x8 chessboard has two diagonally opposite corners removed. You have 31 dominos, each covering exactly two squares.\n\nCan you cover the entire board with these dominos?",
        idealAnswer: "No, it's impossible. A standard chessboard has 32 white and 32 black squares. Diagonally opposite corners are the SAME color (e.g., both white). Removing them leaves 32 black and 30 white squares. Each domino MUST cover one white and one black square. 31 dominos require 31 white and 31 black squares. The parity mismatch makes it impossible.",
        keyPrinciples: [
          "Parity/Coloring arguments",
          "Invariant analysis",
          "Impossibility proof",
          "Visual constraints"
        ]
      },
      {
        id: 175,
        title: "Find the Last Ball",
        icon: "🔴",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-red-600 to-rose-700",
        image: "puzzles/puzzle_175.webp",
        question: "Bag contains 20 Red and 16 Blue balls. You pull 2 balls. Same color -> replace with Blue. Different colors -> replace with Red.\n\nWhat is the color of the very last ball remaining?",
        idealAnswer: "The last ball is Blue. Track the parity of Red balls. -2 Reds (replaced by Blue) -> red count -2. -2 Blues (replaced by Blue) -> red count unchanged. -1 Red, -1 Blue (replaced by Red) -> red count unchanged. The number of Red balls always changes by 0 or -2. It starts even (20). It must stay even. It can never reach 1. Thus, the last ball cannot be Red. It must be Blue.",
        keyPrinciples: [
          "Invariant parity",
          "State transition analysis",
          "Process of elimination",
          "Conserved quantities"
        ]
      },
      {
        id: 176,
        title: "Six Houses Logic",
        icon: "🏘️",
        skillFocus: "Deductive Reasoning",
        skillType: "logical",
        color: "from-orange-500 to-amber-600",
        image: "puzzles/puzzle_176.webp",
        question: "Six houses (P, Q, R, S, T, U) of different colors (Red, Blue, Green, Orange, Yellow, White) and heights are on two sides of a road.\n- T (tallest) is opposite Red.\n- Shortest is opposite Green.\n- U (Orange) is between P and S.\n- R (Yellow) is opposite P.\n- Q (Green) is opposite U.\n- P (White) is taller than R but shorter than S and Q.\n\nWhat is the color of the tallest house?",
        idealAnswer: "The tallest house (T) is Blue. U is Orange. R is Yellow. Q is Green. P is White. T is opposite Red (S must be Red). The only color left for T is Blue.",
        keyPrinciples: [
          "Constraint satisfaction",
          "Process of elimination",
          "Spatial arrangement",
          "Attribute mapping"
        ]
      },
      {
        id: 177,
        title: "Blind Man and Pills",
        icon: "🕶️",
        skillFocus: "Creative Thinking",
        skillType: "logical",
        color: "from-indigo-600 to-violet-800",
        image: "puzzles/puzzle_177.webp",
        question: "A blind man has 2 red and 2 blue pills, identical in shape/size. He must take exactly 1 red and 1 blue pill or he dies.\n\nHow can he guarantee the correct dose?",
        idealAnswer: "Break every pill in half. Make two piles. Put one half of EACH pill in pile A, and the other half in pile B. Each pile now contains exactly (1/2 Red + 1/2 Red + 1/2 Blue + 1/2 Blue) = 1 Red + 1 Blue total content. Take one entire pile. Alternatively, crush all pills to powder, mix thoroughly, and take half the powder.",
        keyPrinciples: [
          "Symmetry creation",
          "Compositional invariance",
          "Lateral thinking",
          "Risk mitigation"
        ]
      }
    ]
  },
  {
    id: 1,
    name: "School Mysteries",
    icon: "🏫",
    color: "from-blue-700 to-indigo-900",
    borderColor: "border-blue-500",
    description: "Investigate educational scenarios",
    unlocked: true,
    puzzles: [
      {
        id: 1,
        title: "The Missing Money",
        icon: "💰",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-amber-600 to-amber-800",
        image: "puzzles/new_default.png",
        question: "School fundraiser money ($500) is missing. Timeline: 3pm - money confirmed in office, 3:15pm - Teacher A left building, 4pm - Janitor B cleaned office, 5pm - Principal C locked up, 5:15pm - money discovered missing. Everyone is panicking and your colleague wants to interrogate all three suspects immediately.\n\nWhat should you investigate FIRST and why?",
        idealAnswer: "First, check if theft actually happened before blaming anyone. Was the money really there at 3pm? Who else could access the office? Could it have been moved for a legitimate reason? This matters because jumping to conclusions wastes time interrogating innocent people while the real answer might be simple. Many 'mysteries' dissolve when we verify basic facts first.",
        keyPrinciples: [
          "Question assumptions before investigating",
          "Validate the premise/starting conditions",
          "Consider alternative explanations",
          "Don't jump to conclusions about suspects"
        ]
      },
      {
        id: 2,
        title: "The Identical Essays",
        icon: "📄",
        skillFocus: "Decision Making",
        skillType: "decision",
        color: "from-red-600 to-red-800",
        image: "puzzles/puzzle_2.png",
        question: "Two students submitted word-for-word identical essays. Your colleague is furious and wants to fail both immediately - 'Clear evidence of cheating!' You have 24 hours before grades are due. Both students have clean records.\n\nHow would you approach this decision?",
        idealAnswer: "Don't rush this decision. First, talk to both students separately. Check who submitted first. Search online - maybe both copied from the same website. They might have studied together legitimately. This is important because failing students destroys their academic future, so we need to know what actually happened. Could be plagiarism, could be collaboration, could be a shared source. Investigate before punishing.",
        keyPrinciples: [
          "Avoid hasty decisions under pressure",
          "Gather evidence before acting",
          "Consider multiple explanations",
          "Recognize irreversible consequences need higher evidence standards"
        ]
      },
      {
        id: 3,
        title: "The Back Row Pattern",
        icon: "📊",
        skillFocus: "Adaptive Learning",
        skillType: "adaptive",
        color: "from-purple-600 to-purple-800",
        image: "puzzles/puzzle_3.png",
        question: "You notice students who sit in the back consistently score 15% lower on average. A veteran teacher declares: 'This proves back-seaters are lazy and unmotivated. We should assign seats.'\n\nWhat's wrong with this conclusion?",
        idealAnswer: "This conclusion is wrong because correlation doesn't mean causation. Maybe struggling students choose back seats to hide, not the other way around. Or maybe students with vision problems sit far back AND can't see the board. The teacher sees a pattern and assumes seating causes bad grades, but it could be reversed or explained by other factors. To actually prove seating matters, you'd need to randomly assign seats and compare results.",
        keyPrinciples: [
          "Correlation does not equal causation",
          "Consider reverse causation",
          "Look for third variables/confounders",
          "Recognize the same logical pattern across different contexts"
        ]
      },
      {
        id: 4,
        title: "The Budget Crisis",
        icon: "💸",
        skillFocus: "Decision Making",
        skillType: "decision",
        color: "from-green-600 to-green-800",
        image: "puzzles/puzzle_4.png",
        question: "School must cut $50,000 from budget by Friday. You have three options with incomplete data: Option A saves $50k but affects 200 students' programs, Option B saves $40k affecting only 50 students, Option C saves $50k but impact data is 'still being compiled.' The superintendent is pressuring for a decision TODAY.\n\nHow should you handle this?",
        idealAnswer: "Push back on this rushed deadline. We need complete data on Option C before deciding anything. The problem is that missing information could show Option C is best - or worst. We don't know because the data isn't ready. Waiting two days for critical information is better than making a permanent mistake that affects hundreds of students. When decisions can't be reversed and stakes are high, demand the full picture first.",
        keyPrinciples: [
          "Artificial deadlines don't justify incomplete analysis",
          "Irreversible decisions need higher evidence standards",
          "Missing information could change the optimal choice",
          "Push back on pressure when stakes are high"
        ]
      },
      {
        id: 5,
        title: "The Wonder Method",
        icon: "🎓",
        skillFocus: "Source Evaluation",
        skillType: "source",
        color: "from-indigo-600 to-indigo-800",
        image: "puzzles/puzzle_5.png",
        question: "A vendor presents 'Method X' showing 20% improvement in test scores. Your principal is excited and wants school-wide adoption. But you notice: it was tested only on honors students, lasted just 2 weeks, and compared results to the OLD curriculum (not your current one).\n\nWhat are the problems with this evidence?",
        idealAnswer: "This evidence has major problems. First, they only tested honors students - results won't apply to average students. Second, two weeks is too short to show if it actually works long-term. Third, they compared it to the OLD curriculum, not our current one. So we don't even know if it's better than what we're already doing. These flaws make the evidence useless for deciding whether to adopt school-wide.",
        keyPrinciples: [
          "Identify multiple flaws in research",
          "Representative samples matter",
          "Short timeframes show novelty effects not lasting impact",
          "Comparison groups must be appropriate"
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Digital Deception",
    icon: "📱",
    color: "from-pink-700 to-rose-900",
    borderColor: "border-pink-500",
    description: "Analyze online information",
    unlocked: true,
    puzzles: [
      {
        id: 6,
        title: "The Viral Statistic",
        icon: "📈",
        skillFocus: "Source Evaluation",
        skillType: "source",
        color: "from-cyan-600 to-cyan-800",
        image: "puzzles/puzzle_2.png",
        question: "'90% of students using AI tools score lower on creativity tests' - This post has 50,000 shares, an anonymous author, and no link to any study. Your school board member wants to ban AI tools based on this.\n\nWhat's wrong with using this as evidence for policy?",
        idealAnswer: "This is terrible evidence for policy. No source means we can't verify if the study even exists. Anonymous authormeans no one is accountable. 50,000 shares doesn't make it true - it just means it spread. Even if a study exists, we don't know how they measured 'creativity' or if struggling students just use AI more. Banning tools based on unverified social media posts is wrong because policies need real evidence, not viral claims.",
        keyPrinciples: [
          "Viral spread doesn't indicate truth",
          "No source means no verification possible",
          "Anonymous claims lack accountability",
          "Distinguish correlation from causation even in cited statistics"
        ]
      },
      {
        id: 7,
        title: "The Principal Video",
        icon: "🎬",
        skillFocus: "Bias Detection",
        skillType: "bias",
        color: "from-red-600 to-red-800",
        image: "puzzles/puzzle_7.png",
        question: "A video surfaces showing your school principal making extremely controversial statements. It's spreading rapidly on social media. Students are organizing protests. Parents are calling the school. You have 2 hours before an emergency board meeting.\n\nWhat should be your priority?",
        idealAnswer: "Verify first, act later. Contact the principal directly - is it real or fake? Check where the video first appeared. Look for editing signs or deepfake artifacts. Find the full context - maybe it's clipped to mislead. This matters because acting on a fake video destroys someone's reputation permanently. Two hours is enough to do basic checks. When stakes are this high, verification is MORE important, not less.",
        keyPrinciples: [
          "Verify before acting, especially under pressure",
          "High stakes require more verification, not less",
          "Deepfakes and manipulated media exist",
          "Direct confirmation from source is essential"
        ]
      },
      {
        id: 8,
        title: "The Expert Influencer",
        icon: "⭐",
        skillFocus: "Source Evaluation",
        skillType: "source",
        color: "from-purple-600 to-purple-800",
        image: "puzzles/puzzle_8.png",
        question: "A verified education influencer with 500,000 followers enthusiastically recommends a new learning technique. They have a blue checkmark, professional-looking videos, and thousands of positive comments.\n\nHow should you evaluate whether to implement their recommendation?",
        idealAnswer: "Blue checkmark just means verified identity, not expertise. 500k followers means popular, not correct. First, check their actual credentials - are they qualified? Look for real research backing their claims. Search for critics, not just fans. Test it small before adopting school-wide. The problem is confusing popularity with expertise - just because many people follow someone doesn't mean they're right about education.",
        keyPrinciples: [
          "Verification badges confirm identity not expertise",
          "Popularity doesn't equal correctness",
          "Check actual credentials and evidence",
          "Test small before adopting fully"
        ]
      },
      {
        id: 9,
        title: "The Comment Consensus",
        icon: "💬",
        skillFocus: "Bias Detection",
        skillType: "bias",
        color: "from-green-600 to-green-800",
        image: "puzzles/puzzle_9.png",
        question: "A post about your school's homework policy has 200 comments. 180 comments (90%) say 'Homework is harmful and should be banned!' A parent presents this at a board meeting as 'overwhelming community consensus.'\n\nIs this actually evidence of community consensus?",
        idealAnswer: "No, this is selection bias. Angry people are way more likely to comment - satisfied parents just scroll past. This is like asking only people at a complaint desk if they're happy. The 70% who didn't comment aren't represented. The problem is that comment sections only show opinions from people motivated to speak up, usually negative. Real consensus needs surveys sent to everyone randomly, not just whoever chooses to comment.",
        keyPrinciples: [
          "Comment sections are self-selected, not representative",
          "People with strong opinions are more likely to engage",
          "Silent majority may feel differently",
          "True consensus requires random/representative sampling"
        ]
      },
      {
        id: 10,
        title: "The Algorithm Echo",
        icon: "🔄",
        skillFocus: "Bias Detection",
        skillType: "bias",
        color: "from-orange-600 to-orange-800",
        image: "puzzles/puzzle_10.png",
        question: "You're researching 'Method X' for your school. Your social media feed shows 10 articles all praising it as 'revolutionary.' You can't find any criticism anywhere you look. You're about to propose school-wide adoption.\n\nWhat's the hidden risk here?",
        idealAnswer: "This is an algorithm filter bubble. The system shows me more of what I've clicked, creating fake consensus. Just because MY feed agrees doesn't mean experts agree. The problem is the algorithm hides criticism from me. I should search specifically for 'Method X problems', 'Method X failed', or 'Method X criticism'. Check different platforms or incognito mode. The absence of negative content in my feed doesn't mean it doesn't exist - it means it's being filtered out.",
        keyPrinciples: [
          "Algorithms create echo chambers by design",
          "Actively search for disconfirming evidence",
          "Use critical search terms to find opposing views",
          "Your feed's agreement doesn't equal actual consensus"
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Workplace Whodunit",
    icon: "💼",
    color: "from-slate-700 to-slate-900",
    borderColor: "border-slate-500",
    description: "Navigate professional puzzles",
    unlocked: true,
    puzzles: [
      {
        id: 11,
        title: "The Remote Work Blame",
        icon: "👥",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-blue-600 to-blue-800",
        image: "puzzles/puzzle_3.png",
        question: "Team A (fully remote) consistently misses deadlines. Team B (in-office) consistently meets them. Your manager concludes: 'Remote work causes poor performance. Everyone back to office.'\n\nWhat's missing from this analysis?",
        idealAnswer: "This ignores confounding variables. Many factors could explain the difference: Team A might have harder projects, less experienced members, worse management, fewer resources, more demanding clients, or different workload. The correlation (remote + delays) doesn't prove remote work CAUSES the delays. To actually test remote work's effect, you'd need the SAME team doing SIMILAR work in both conditions, controlling for other factors. Making everyone return to office won't fix the real issues if remote work isn't actually the cause.",
        keyPrinciples: [
          "Identify confounding variables",
          "Correlation doesn't prove causation",
          "Need to isolate the variable being tested",
          "Policy based on flawed analysis won't fix real problems"
        ]
      },
      {
        id: 12,
        title: "The Promotion Puzzle",
        icon: "📈",
        skillFocus: "Decision Making",
        skillType: "decision",
        color: "from-green-600 to-green-800",
        image: "puzzles/puzzle_12.png",
        question: "Two candidates for a critical promotion. Candidate A: outstanding metrics, but you heard 'concerning gossip' from a colleague. Candidate B: decent metrics, extremely likable, everyone's friend. Decision due tomorrow.\n\nHow should you approach this decision?",
        idealAnswer: "I should not let gossip or likability drive this career-altering decision. Steps: 1) Verify the gossip - who said what specifically? Is there documentation? What do A's direct reports and clients actually say? 2) Pull objective performance data for both candidates. 3) Conduct structured interviews with consistent questions. Gossip is hearsay, not evidence. Likability creates bias (halo effect). One day's delay to gather facts is worth it for a decision affecting someone's career. Promotions require evidence standards, not popularity contests or rumors.",
        keyPrinciples: [
          "Gossip is hearsay, not evidence",
          "Likability creates halo effect bias",
          "Career decisions need evidence standards",
          "Delay to verify is worth it for irreversible decisions"
        ]
      },
      {
        id: 13,
        title: "The Meeting Paradox",
        icon: "⏰",
        skillFocus: "Adaptive Learning",
        skillType: "adaptive",
        color: "from-purple-600 to-purple-800",
        image: "puzzles/puzzle_149.png",
        question: "You analyze company data and find: weeks with more meetings correlate with lower team productivity. Your CEO wants to mandate 'meeting-free weeks' to boost productivity.\n\nWhat's the flaw in this reasoning?",
        idealAnswer: "This is reverse causation. When projects face problems and struggle, teams call MORE meetings to troubleshoot and coordinate. The meetings are a RESPONSE to low productivity, not the CAUSE. It's like observing that hospitals have more sick people and concluding hospitals cause illness. If you ban meetings, the underlying problems remain - you've just removed a troubleshooting tool. The right question is: what's causing projects to struggle in the first place? Address root causes, not symptoms.",
        keyPrinciples: [
          "Consider reverse causation",
          "Correlation can flow either direction",
          "Symptoms vs root causes",
          "Removing the response doesn't fix the underlying problem"
        ]
      },
      {
        id: 14,
        title: "The AI Vendor Pitch",
        icon: "🤖",
        skillFocus: "Source Evaluation",
        skillType: "source",
        color: "from-red-600 to-red-800",
        image: "puzzles/puzzle_2.png",
        question: "A vendor demonstrates their AI tool, claiming it 'increased productivity 40% at Company X.' The demo is slick and impressive. They're offering a 'limited time' discount if you sign this week. They want your decision by Friday.\n\nWhat should make you skeptical?",
        idealAnswer: "Multiple red flags: 1) Cherry-picked success story - why only Company X? What about failures? 2) No timeframe mentioned - novelty effect? 3) No control group - compared to what baseline? 4) 'Limited time' is a pressure tactic to prevent due diligence. 5) Demos are controlled theater, not real-world conditions. I would: ask for 5+ references I can contact independently, look for peer-reviewed studies, request a trial period before commitment. Sales pressure + impressive claims = maximum skepticism needed.",
        keyPrinciples: [
          "Recognize cherry-picked success stories",
          "Time pressure is a sales tactic",
          "Demos don't reflect real-world performance",
          "Demand independent verification and references"
        ]
      },
      {
        id: 15,
        title: "The Survey Trap",
        icon: "📊",
        skillFocus: "Bias Detection",
        skillType: "bias",
        color: "from-amber-600 to-amber-800",
        image: "puzzles/puzzle_15.png",
        question: "Employee satisfaction survey results: 60% report being unhappy with leadership. HR recommends immediate leadership changes. The survey had a 30% response rate.\n\nWhat critical question should you ask before acting?",
        idealAnswer: "The key question: what about the 70% who didn't respond? This is non-response bias. Unhappy employees are more motivated to voice complaints in surveys. Satisfied employees often think 'everything's fine, why bother?' and don't respond. The silent 70% might feel very differently. Before major changes: 1) Why was response rate so low? 2) Can we reach non-responders through different methods? 3) What do exit interviews from people who left satisfied show? 4) Are the 30% who responded representative? Making organizational changes based on a potentially biased 30% is risky.",
        keyPrinciples: [
          "Non-response bias skews results",
          "Unhappy people more likely to respond",
          "Low response rates make data unrepresentative",
          "Consider who ISN'T represented in the data"
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Health & Headlines",
    icon: "🔬",
    color: "from-emerald-700 to-teal-900",
    borderColor: "border-emerald-500",
    description: "Evaluate health claims critically",
    unlocked: true,
    puzzles: [
      {
        id: 16,
        title: "The Miracle Supplement",
        icon: "💊",
        skillFocus: "Source Evaluation",
        skillType: "source",
        color: "from-green-600 to-green-800",
        image: "puzzles/puzzle_142.png",
        question: "A headline reads: 'New Study Shows Supplement X Doubles Memory!' The study: 20 participants, 4 weeks long, funded by the supplement manufacturer, no placebo control group. Your friend wants to spend $200/month on it.\n\nWhat would you tell them about this evidence?",
        idealAnswer: "I'd point out the stacked red flags: 1) 20 participants is far too few for reliable results - random variation dominates. 2) 4 weeks can't show lasting effects or long-term safety. 3) Manufacturer funding creates publication bias - negative results get buried. 4) No placebo means expectation effects aren't controlled - people often improve just believing they're taking something. Each flaw alone is concerning. Together? This study tells us almost nothing. Wait for large, independent, placebo-controlled, long-term trials before spending money.",
        keyPrinciples: [
          "Small sample sizes are unreliable",
          "Short timeframes miss long-term effects",
          "Funding source creates bias",
          "Placebo controls are essential"
        ]
      },
      {
        id: 17,
        title: "The Diet Debate",
        icon: "🥗",
        skillFocus: "Adaptive Learning",
        skillType: "adaptive",
        color: "from-orange-600 to-orange-800",
        image: "puzzles/puzzle_17.png",
        question: "Study A (500 participants): 'Low-carb diets reduce heart disease.' Study B (500 participants): 'Low-carb diets increase heart disease.' Both in respected journals. A health influencer says 'science is useless - just eat what feels right.'\n\nHow should you interpret these contradictory findings?",
        idealAnswer: "Contradictory findings aren't science failing - they're science WORKING by revealing complexity. I'd look deeper: What populations were studied? (Study A might be athletes, Study B diabetics). What timeframes? How was 'low-carb' defined? (Could mean different things). How was 'heart disease' measured? These contradictions often mean 'it depends on specific circumstances' - which is valuable information. The influencer's conclusion that science is useless is wrong. The real lesson is that nutrition is complex and context-dependent.",
        keyPrinciples: [
          "Contradictory studies reveal complexity, not failure",
          "Dig into methodology differences",
          "Results often depend on specific populations and conditions",
          "Science is a process of refinement, not absolute answers"
        ]
      },
      {
        id: 18,
        title: "The Breakfast Study",
        icon: "📉",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-blue-600 to-blue-800",
        image: "puzzles/puzzle_18.png",
        question: "A viral article claims: 'People who eat breakfast live 5 years longer!' It's based on a large observational study of 100,000 people. Your coworker, who skips breakfast, is now worried.\n\nWhat should you explain to them?",
        idealAnswer: "This is the classic correlation trap. Observational studies show correlation, not causation. Breakfast eaters might also: exercise more, smoke less, have better healthcare access, be wealthier, less stressed, more health-conscious overall. The study doesn't prove BREAKFAST causes longer life - it might just be a marker for a healthier lifestyle package. To prove causation, you'd need a randomized trial assigning breakfast vs. no breakfast randomly and controlling for other factors. Your coworker shouldn't panic based on observational correlation.",
        keyPrinciples: [
          "Observational studies show correlation, not causation",
          "Many healthy behaviors cluster together",
          "Need randomized controlled trials for causal claims",
          "Large sample size doesn't fix the correlation problem"
        ]
      },
      {
        id: 19,
        title: "The Success Stories",
        icon: "🗣️",
        skillFocus: "Bias Detection",
        skillType: "bias",
        color: "from-purple-600 to-purple-800",
        image: "puzzles/puzzle_15.png",
        question: "A treatment has been shown in large trials to work 30% of the time. Your online community has 50 people sharing dramatic success stories. Someone says 'Real experiences matter more than cold statistics.'\n\nHow do you think about this apparent contradiction?",
        idealAnswer: "This is survivorship bias. If 100 people try the treatment: 30 succeed and might post enthusiastically sharing their stories. 70 fail and move on silently - embarrassed, disappointed, or trying other things. Online communities self-select for success stories. The 'cold statistic' of 30% actually INCLUDES everyone - successes AND failures. The 50 anecdotes only represent the 30% who had good outcomes. Real experiences are valuable but are selected, not representative. Both perspectives have value, but statistics capture the full picture.",
        keyPrinciples: [
          "People who fail don't share stories",
          "Online communities select for success",
          "Statistics include everyone, anecdotes are selected",
          "Both qualitative and quantitative data have roles"
        ]
      },
      {
        id: 20,
        title: "The Natural Label",
        icon: "🌿",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-lime-600 to-lime-800",
        image: "puzzles/puzzle_20.png",
        question: "A product advertises: 'All-natural ingredients - because natural is always safer than synthetic chemicals!' Your parent wants to switch all household products to 'natural' alternatives based on this principle.\n\nWhat's the flaw in this reasoning?",
        idealAnswer: "This is the appeal to nature fallacy. 'Natural' tells you nothing about safety. Arsenic, poison ivy, snake venom, mercury, botulinum toxin - all natural, all dangerous. Meanwhile, many synthetic medications save millions of lives. Safety depends on the specific properties of the substance, not its origin. 'Natural' is a marketing term, not a safety standard. I'd advise evaluating specific ingredients' actual properties and research, not labels. The feeling of 'natural' being safer is emotionally compelling but logically flawed.",
        keyPrinciples: [
          "Appeal to nature fallacy",
          "Natural substances can be harmful",
          "Synthetic substances can be safe and beneficial",
          "Evaluate specific properties, not origin labels"
        ]
      }
    ]
  },
  {
    id: 5,
    name: "Money Mysteries",
    icon: "💰",
    color: "from-amber-700 to-yellow-900",
    borderColor: "border-amber-500",
    description: "Financial decision reasoning",
    unlocked: true,
    puzzles: [
      {
        id: 21,
        title: "The Hot Stock Tip",
        icon: "📈",
        skillFocus: "Bias Detection",
        skillType: "bias",
        color: "from-green-600 to-green-800",
        image: "puzzles/puzzle_5.png",
        question: "Your coworker brags about tripling their money on a stock pick from a YouTube channel. 'This guy's picks always go up!' The channel shows a history of 10 winning predictions in a row.\n\nShould you follow the next tip?",
        idealAnswer: "No - this is survivorship bias. If thousands of people make random predictions, purely by chance some will have impressive streaks. The failed predictors quit, delete their channels, or get ignored. You only SEE the survivors. Key questions: What's the FULL track record including failures? How does it compare to just investing in an index fund? What about predictions that weren't shown? One person's success might be luck, not skill. Even 10 right predictions could be chance with enough predictors. Don't confuse surviving luck with genuine ability.",
        keyPrinciples: [
          "You only see successful predictors (survivors)",
          "Random chance creates impressive-looking streaks",
          "Ask about the full track record including failures",
          "Past success doesn't guarantee future performance"
        ]
      },
      {
        id: 22,
        title: "The Course Dilemma",
        icon: "🎰",
        skillFocus: "Decision Making",
        skillType: "decision",
        color: "from-red-600 to-red-800",
        image: "puzzles/puzzle_22.png",
        question: "You bought a $500 course that you've completed 80% of, but you're realizing it's not useful for your career goals. A better, free course just became available. Your thinking: 'I already spent $500, I should finish what I started.'\n\nIs this good reasoning?",
        idealAnswer: "No - this is the sunk cost fallacy. The $500 is gone regardless of what you do now - it's spent whether you finish or not. The only relevant question is: what's the best use of your FUTURE time? If the free course is better for your goals, every additional hour on the worse course is a NEW cost (opportunity cost of time). Past investments shouldn't trap you into future bad decisions. The 'I should finish what I started' instinct is understandable but leads to throwing good time after bad money.",
        keyPrinciples: [
          "Sunk costs are gone regardless of future choices",
          "Only future costs and benefits are relevant",
          "Past investments shouldn't dictate future decisions",
          "Opportunity cost of continuing matters"
        ]
      },
      {
        id: 23,
        title: "The Car Deal",
        icon: "🚗",
        skillFocus: "Bias Detection",
        skillType: "bias",
        color: "from-purple-600 to-purple-800",
        image: "puzzles/puzzle_23.png",
        question: "A car is listed at $40,000. The dealer offers to 'cut' it to $32,000 - an $8,000 discount! You feel like you're getting an amazing deal. Your friend says you're being manipulated.\n\nWhat's happening psychologically?",
        idealAnswer: "This is anchoring bias. The $40,000 'anchor' was set artificially high specifically to make $32,000 FEEL like a bargain - even if the car is only worth $28,000. Your brain compares to the first number it sees, not to actual market value. Dealers set high anchors intentionally. Defense: research market prices BEFORE seeing the sticker. Compare to independent valuations, not the dealer's anchor. Ignore their starting price entirely. The 'discount' is theater - the real question is: what's this car actually worth compared to alternatives?",
        keyPrinciples: [
          "First numbers anchor our perception",
          "Anchors are often set strategically",
          "Discounts from artificial anchors aren't real savings",
          "Research independent valuations before negotiating"
        ]
      },
      {
        id: 24,
        title: "The Tech Portfolio",
        icon: "📊",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-blue-600 to-blue-800",
        image: "puzzles/puzzle_24.png",
        question: "Your friend proudly shows their 'diversified' portfolio: 5 different tech stock funds. 'I'm protected because I didn't put all my eggs in one basket!'\n\nWhat do you notice about this 'diversification'?",
        idealAnswer: "This is false diversification. Having 5 things isn't diversified if they're all the same TYPE of thing. When tech crashes, ALL five funds crash together - they're highly correlated. Real diversification means assets that DON'T move in lockstep: different sectors (tech + healthcare + utilities), different asset classes (stocks + bonds + real estate), different geographies (US + international). The number of funds matters less than how correlated they are. Five tech funds is essentially one big bet on tech with extra fees. Different names â‰  different risks.",
        keyPrinciples: [
          "True diversification requires uncorrelated assets",
          "Multiple similar investments aren't diversified",
          "Correlation matters more than number of holdings",
          "Diversify across sectors, asset classes, geographies"
        ]
      },
      {
        id: 25,
        title: "The Raise Decision",
        icon: "🏠",
        skillFocus: "Adaptive Learning",
        skillType: "adaptive",
        color: "from-amber-600 to-amber-800",
        image: "puzzles/puzzle_25.png",
        question: "You just got a $20,000 raise. You're deciding between: upgrading to a nicer apartment for $800/month more, or keeping your current place and investing the difference. Your coworker says 'You earned it, treat yourself!'\n\nHow should you think about this decision?",
        idealAnswer: "I'd reframe to see the true cost. '$800/month more for a nicer place' sounds small. But compound it: $800/month invested for 30 years at 7% return = potentially $500,000+ at retirement. The 'upgrade' might cost half a million dollars in foregone growth. This isn't about never upgrading - it's about seeing the TRUE size of the decision before choosing. 'Lifestyle creep' happens when each 'small' upgrade compounds without recognizing long-term opportunity costs. Frame decisions in terms of what you're giving up, not just what you're getting.",
        keyPrinciples: [
          "Small recurring costs compound dramatically",
          "Reframe decisions to see true long-term costs",
          "Lifestyle creep accumulates invisibly",
          "Consider opportunity cost of foregone investment"
        ]
      }
    ]
  },
  {
    id: 6,
    name: "Health & Wellness",
    icon: "🏥",
    color: "from-cyan-700 to-blue-900",
    borderColor: "border-cyan-500",
    description: "Critical thinking about medical claims",
    unlocked: true,
    puzzles: [
      {
        id: 26,
        title: "The Screening Test Paradox",
        icon: "🩺",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-cyan-600 to-cyan-800",
        image: "puzzles/puzzle_6.png",
        question: "A disease affects 1 in 1,000 people. A test is 99% accurate. You test positive. A doctor says 'You almost certainly have the disease - the test is 99% accurate!' Your family panics.\n\nWhat's wrong with the doctor's reasoning?",
        idealAnswer: "The doctor is ignoring base rates (how rare the disease is). If 1,000 people are tested: 1 person has it (and likely tests positive), but 999 don't have it - and 1% of those (about 10 people) will get false positives. So 11 positive tests total, but only 1 is real. Even with a positive test, there's only about a 1 in 11 (9%) chance you actually have the disease! The test's 99% accuracy doesn't mean 99% chance of having the disease. This is why doctors order confirmatory tests before treating rare diseases.",
        keyPrinciples: [
          "Consider base rates (how common the condition is)",
          "False positives are common for rare diseases even with accurate tests",
          "Test accuracy â‰  probability of having the disease",
          "Bayes' theorem applies to medical testing"
        ]
      },
      {
        id: 27,
        title: "The Vaccination Correlation",
        icon: "💉",
        skillFocus: "Bias Detection",
        skillType: "bias",
        color: "from-green-600 to-green-800",
        image: "puzzles/puzzle_27.png",
        question: "A parent posts: 'My son got vaccinated at 18 months and was diagnosed with autism at 24 months. The vaccine caused it!' The post goes viral with thousands sharing similar stories.\n\nWhat cognitive bias is at work here?",
        idealAnswer: "This is the post hoc fallacy ('after this, therefore because of this'). Children get vaccinated around the same age when autism symptoms first become noticeable - correlation by developmental timing, not causation. If millions of kids are vaccinated, thousands WILL coincidentally develop autism shortly after, purely by chance timing. The pattern looks meaningful to individuals but is explained by: (1) when vaccines are given overlaps with (2) when autism is typically diagnosed. Massive studies comparing vaccinated vs. unvaccinated populations show no causal link - the timing is coincidental.",
        keyPrinciples: [
          "Temporal correlation doesn't prove causation",
          "Developmental milestones create coincidental timing",
          "Individual anecdotes can't establish causation",
          "Large population studies control for coincidence"
        ]
      },
      {
        id: 28,
        title: "The Celebrity Cure",
        icon: "⭐",
        skillFocus: "Source Evaluation",
        skillType: "source",
        color: "from-purple-600 to-purple-800",
        image: "puzzles/puzzle_28.png",
        question: "A famous celebrity credits an alternative treatment for curing their serious illness. They share their journey on social media with millions of followers. Medical associations warn it's unproven. Your sick relative wants to try it.\n\nHow should you evaluate the celebrity's claim?",
        idealAnswer: "Celebrity testimonials are terrible medical evidence. Key problems: (1) Did they ONLY do the alternative treatment, or also conventional medicine? (2) Did they even have the disease, or was it misdiagnosed? (3) Would they have recovered anyway (spontaneous remission)? (4) How many people tried it and FAILED but aren't famous? (5) Celebrities are paid endorsers, not medical experts. The plural of anecdote is not data. For life-threatening illness, demand: peer-reviewed studies, controlled trials, expert consensus - not celebrity stories. Hope is powerful but shouldn't override evidence standards when lives are at stake.",
        keyPrinciples: [
          "Celebrity status doesn't confer medical expertise",
          "Single success stories don't prove treatment efficacy",
          "Consider selection bias (failures aren't publicized)",
          "Life-threatening decisions require rigorous evidence"
        ]
      },
      {
        id: 29,
        title: "The Painkiller Study",
        icon: "💊",
        skillFocus: "Decision Making",
        skillType: "decision",
        color: "from-red-600 to-red-800",
        image: "puzzles/puzzle_29.png",
        question: "Drug X reduces pain by 50% compared to placebo in a 6-month trial of 100 patients. Drug Y reduces pain by 30% in a 10-year trial of 10,000 patients. Your doctor recommends Y despite the 'worse' numbers.\n\nWhy might your doctor be right?",
        idealAnswer: "Sample size and timeframe matter enormously. Drug X's impressive 50% might be: (1) luck from small sample (100 people), (2) novelty effect that fades, (3) hiding side effects that appear after 6 months. Drug Y's 30% is more reliable because: 10,000 patients reduce random variation, and 10 years reveal long-term safety and sustained effectiveness. A smaller but more reliable benefit is often better than a larger but uncertain one. Especially for chronic conditions requiring long-term use. Big short-term results can be flashy but misleading. Consistent long-term moderate results are often the better choice.",
        keyPrinciples: [
          "Larger samples provide more reliable results",
          "Long-term studies reveal sustained effects and safety",
          "Impressive short-term results may not hold",
          "Moderate reliable benefits often beat uncertain large ones"
        ]
      },
      {
        id: 30,
        title: "The Fitness Tracker Fallacy",
        icon: "⌚",
        skillFocus: "Adaptive Learning",
        skillType: "adaptive",
        color: "from-orange-600 to-orange-800",
        image: "puzzles/puzzle_30.png",
        question: "A study finds: 'People who use fitness trackers exercise 30% more.' A health company concludes: 'Give everyone trackers to increase exercise!' They distribute 10,000 free trackers but 6 months later see no population-level exercise increase.\n\nWhat went wrong?",
        idealAnswer: "This is selection bias meeting reality. The original study compared tracker users to non-users, but PEOPLE WHO BUY TRACKERS ARE ALREADY MORE MOTIVATED TO EXERCISE. The tracker didn't cause the exercise difference - exercise motivation caused tracker purchase. When you give trackers to random people (not self-selected fitness enthusiasts), the correlation disappears. This same pattern applies to: diet apps, educational tools, productivity software. Products that 'work' for motivated early adopters often fail when deployed to unmotivated populations. Correlation in observational data doesn't predict intervention results.",
        keyPrinciples: [
          "Self-selection bias in who adopts products",
          "Motivated users aren't representative of general population",
          "Observational correlations don't predict intervention effects",
          "Same pattern applies across health/education/productivity tools"
        ]
      }
    ]
  },
  {
    id: 7,
    name: "Environmental Science",
    icon: "🌍",
    color: "from-green-700 to-emerald-900",
    borderColor: "border-green-500",
    description: "Analyze climate and ecology claims",
    unlocked: true,
    puzzles: [
      {
        id: 31,
        title: "The Cold Winter Argument",
        icon: "❄️",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-blue-600 to-blue-800",
        image: "puzzles/puzzle_7.png",
        question: "It's an unusually cold winter with record snowfall. Someone posts: 'So much for global warming! Look at all this snow - climate change is a hoax!'\n\nWhat's the flaw in this reasoning?",
        idealAnswer: "This confuses weather with climate. Weather is day-to-day or seasonal variation; climate is long-term trends over decades. One cold winter doesn't disprove global warming any more than one hot day proves it. In fact, climate change can cause MORE extreme weather in both directions - including intense snowstorms. The logic is like saying 'the stock market went up today, so the 2008 crash never happened.' Short-term variation doesn't erase long-term trends. Climate scientists look at global temperatures over decades, not local weather over days.",
        keyPrinciples: [
          "Weather is short-term, climate is long-term trends",
          "Single data points don't disprove trends",
          "Climate change affects variability and extremes",
          "Local conditions don't represent global patterns"
        ]
      },
      {
        id: 32,
        title: "The Recycling Contradiction",
        icon: "♻️",
        skillFocus: "Decision Making",
        skillType: "decision",
        color: "from-green-600 to-green-800",
        image: "puzzles/puzzle_32.png",
        question: "An investigation reveals that 70% of recycling in your city is actually sent to landfills due to contamination. A friend concludes: 'Recycling is a lie - I'm done sorting trash.'\n\nIs this the right response to this information?",
        idealAnswer: "No - this is all-or-nothing thinking. The finding shows the CURRENT system is broken, not that recycling itself is worthless. Better responses: (1) Learn what CAN be effectively recycled (clean paper, certain plastics), (2) Reduce contamination by rinsing containers, (3) Advocate for better systems/infrastructure, (4) Focus more on 'reduce' and 'reuse' than 'recycle.' The existence of a broken system doesn't mean the concept is invalid. Also, even 30% actually recycled is better than 0%. Perfect shouldn't be the enemy of good. Fix systems, don't abandon goals.",
        keyPrinciples: [
          "Broken implementation doesn't invalidate the concept",
          "All-or-nothing thinking misses improvement opportunities",
          "Focus on what you can control (contamination reduction)",
          "System problems require system solutions, not individual abandonment"
        ]
      },
      {
        id: 33,
        title: "The Corporate Pledge",
        icon: "🏢",
        skillFocus: "Source Evaluation",
        skillType: "source",
        color: "from-cyan-600 to-cyan-800",
        image: "puzzles/puzzle_33.png",
        question: "A major corporation announces 'We're now carbon neutral!' with a big PR campaign. Digging deeper, you find: they bought carbon offsets from a forestry project but didn't actually reduce their emissions.\n\nWhat's the problem here?",
        idealAnswer: "This is greenwashing through accounting tricks. 'Carbon neutral' sounds like they stopped polluting, but they just paid to shift the numbers on paper. Problems: (1) They're still emitting the same amount, (2) Carbon offsets are hard to verify and often overestimate impact, (3) Forest projects might have happened anyway, (4) It's cheaper to buy offsets than reduce emissions, so there's no incentive to change. Real climate action means REDUCING emissions, not offsetting them. Offsets can complement reductions but shouldn't replace them. Watch for vague pledges, check actual emission data, and be skeptical of solutions that are suspiciously easy.",
        keyPrinciples: [
          "Distinguish accounting neutrality from actual emission reduction",
          "Carbon offsets are often overestimated or non-additional",
          "PR campaigns may obscure lack of real action (greenwashing)",
          "Verify specific actions, not just pledges"
        ]
      },
      {
        id: 34,
        title: "The Plastic Straw Ban",
        icon: "🥤",
        skillFocus: "Adaptive Learning",
        skillType: "adaptive",
        color: "from-purple-600 to-purple-800",
        image: "puzzles/puzzle_34.png",
        question: "Your city bans plastic straws to 'save the ocean.' Analysis shows straws are 0.02% of ocean plastic, while fishing nets are 46%. Critics say the ban is 'meaningless virtue signaling.'\n\nHow do you evaluate both the policy and the criticism?",
        idealAnswer: "Both sides have points. The policy IS disproportionate to impact - fishing gear matters vastly more. However: (1) Straw bans are politically easier than regulating fishing industries, (2) They raise awareness and can be a 'gateway' to bigger changes, (3) Small visible actions can shift norms and culture. BUT: (4) We shouldn't stop at easy symbolic wins, (5) Resources spent on straws could target bigger sources, (6) False sense of accomplishment can prevent real action. The criticism isn't wrong, but the question is: does this enable or substitute for real action? Context matters. Use this pattern: celebrate small wins, but don't declare victory. Keep pushing for proportionate responses to big problems.",
        keyPrinciples: [
          "Evaluate actions proportionate to actual impact",
          "Symbolic actions can enable OR substitute for real change",
          "Political feasibility vs. environmental impact tradeoffs",
          "Small wins are fine if they don't prevent bigger necessary changes"
        ]
      },
      {
        id: 35,
        title: "The Local Food Movement",
        icon: "🚜",
        skillFocus: "Bias Detection",
        skillType: "bias",
        color: "from-amber-600 to-amber-800",
        image: "puzzles/puzzle_35.png",
        question: "'Buy local food to reduce your carbon footprint!' But studies show: greenhouse-grown local tomatoes in winter have 10x the emissions of imported tomatoes grown outdoors in warm climates and shipped.\n\nWhat bias makes 'food miles' misleading?",
        idealAnswer: "This is the 'what you see is obvious' bias - transportation is visible, but production emissions are invisible. The MAJORITY of food's carbon footprint is in PRODUCTION (farming, heating greenhouses, fertilizer), not transportation. A local heated greenhouse can emit far more than growing outdoors naturally + shipping. 'Food miles' feels intuitive but often misleads. Better metrics: HOW food is produced (organic vs. conventional, greenhouse vs. field, beef vs. plants) matters more than WHERE. The lesson: visible factors aren't always the most important ones. Check full lifecycle analysis, not just the obvious visible part.",
        keyPrinciples: [
          "Visible factors (transport) aren't always the biggest impacts",
          "Production methods matter more than distance",
          "Full lifecycle analysis reveals hidden impacts",
          "Intuitive solutions can be wrong when systems are complex"
        ]
      }
    ]
  },
  {
    id: 8,
    name: "Legal & Justice",
    icon: "⚖️",
    color: "from-gray-700 to-slate-900",
    borderColor: "border-gray-500",
    description: "Evaluate legal reasoning and fairness",
    unlocked: true,
    puzzles: [
      {
        id: 36,
        title: "The Eyewitness Confidence",
        icon: "👁️",
        skillFocus: "Source Evaluation",
        skillType: "source",
        color: "from-blue-600 to-blue-800",
        image: "puzzles/puzzle_8.png",
        question: "A robbery witness testifies: 'I'm 100% certain that's the man I saw. I'll never forget that face.' The jury is convinced by their confidence. But research shows confident eyewitnesses are wrong 30% of the time.\n\nWhy is confidence misleading here?",
        idealAnswer: "Confidence and accuracy are poorly correlated in memory. Witnesses can be confidently wrong because: (1) Memory is reconstructive - we fill gaps with assumptions, (2) Repeated questioning strengthens false memories, (3) Stress during crimes impairs encoding, (4) Cross-racial identification is especially unreliable, (5) Confident delivery is persuasive but not diagnostic of truth. Juries overweight confidence because it FEELS like certainty. Better evidence: corroborating physical evidence, multiple independent witnesses, video footage. The lesson applies beyond courts: conviction in delivery doesn't equal accuracy of content. Confidence is a feeling, not a fact.",
        keyPrinciples: [
          "Confidence doesn't correlate well with accuracy",
          "Memory is reconstructive and malleable",
          "Stress and suggestion create false memories",
          "Persuasive delivery â‰  reliable information"
        ]
      },
      {
        id: 37,
        title: "The Recidivism Algorithm",
        icon: "🤖",
        skillFocus: "Bias Detection",
        skillType: "bias",
        color: "from-red-600 to-red-800",
        image: "puzzles/puzzle_37.png",
        question: "An AI predicts who will re-offend to help judges set bail. It's 70% accurate overall. Investigation reveals: it's 80% accurate for white defendants but only 60% accurate for Black defendants, with higher false positive rates for Black defendants.\n\nWhat's the problem and why does it matter?",
        idealAnswer: "This is algorithmic bias and disparate impact. The AI was trained on historical data reflecting existing biases in policing and prosecution - Black defendants are more likely to be arrested and charged for the same behaviors. The algorithm learned and amplified these biases. Higher false positives mean innocent Black defendants are incorrectly labeled high-risk and denied bail. This creates feedback loops: denied bail â†’ lose jobs â†’ worse outcomes â†’ validates algorithm's prediction. The overall 70% accuracy hides the unequal error distribution. When AI decisions affect freedom, fairness across groups matters more than aggregate accuracy. Bias in training data produces biased predictions.",
        keyPrinciples: [
          "Algorithms can encode and amplify existing biases",
          "Overall accuracy can hide disparate impact across groups",
          "Training data reflects historical injustices",
          "False positives have severe consequences for individuals"
        ]
      },
      {
        id: 38,
        title: "The Plea Bargain Pressure",
        icon: "⚖️",
        skillFocus: "Decision Making",
        skillType: "decision",
        color: "from-purple-600 to-purple-800",
        image: "puzzles/puzzle_38.png",
        question: "You're innocent but charged with a crime. Prosecutor offers: plead guilty, get 1 year; go to trial and if convicted (which they claim is likely), get 10 years. You can't afford a good lawyer. Trial is in 2 weeks.\n\nWhat makes this decision ethically problematic?",
        idealAnswer: "This is coercion masquerading as choice. The 'option' to go to trial is illusory when: (1) The penalty gap is so extreme it terrorizes rational people into pleading, (2) You can't afford adequate defense (wealth determines justice), (3) Even innocent people plead guilty to avoid risk, (4) Prosecutors have overwhelming power to threaten, (5) This bypasses trial by jury entirely. The problem: systems designed to avoid trial congestion create pressure that extracts guilty pleas from innocents. When 'options' are structured with extreme consequences, choice isn't really free. This applies beyond legal contexts - any 'choice' made under duress or massive power imbalances isn't truly voluntary.",
        keyPrinciples: [
          "Extreme consequence gaps create coercion, not choice",
          "Economic inequality determines access to justice",
          "System design can pressure innocent people to plead guilty",
          "Power imbalances negate meaningful consent"
        ]
      },
      {
        id: 39,
        title: "The Tough-on-Crime Law",
        icon: "🔒",
        skillFocus: "Adaptive Learning",
        skillType: "adaptive",
        color: "from-orange-600 to-orange-800",
        image: "puzzles/puzzle_39.png",
        question: "A state passes mandatory minimum sentences to 'reduce crime by being tough.' Crime initially drops 15%. Politicians declare success. But a study comparing to neighboring states shows they also had 15% drops without the law.\n\nWhat does this reveal about the policy?",
        idealAnswer: "This shows the importance of control groups and regional trends. The crime drop likely wasn't CAUSED by the law - it was happening everywhere due to other factors (economy, demographics, technology). Without the comparison, politicians falsely attributed natural trends to their policy. This is the 'post hoc' fallacy at scale. The same pattern appears in: education reforms, business changes, medical treatments. Things often improve or worsen regardless of our interventions. To actually prove causation, you need: what happened WITH the intervention vs. what would have happened WITHOUT it. Otherwise you're just taking credit for (or blaming yourself for) natural variation.",
        keyPrinciples: [
          "Need control groups to establish causation",
          "Regional/temporal trends affect all areas similarly",
          "Post hoc fallacy applies to policy evaluation",
          "Compare to counterfactual: what would have happened anyway?"
        ]
      },
      {
        id: 40,
        title: "The Torture Ticking Bomb",
        icon: "💣",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-red-600 to-red-800",
        image: "puzzles/puzzle_40.png",
        question: "'If torturing one terrorist could save a city from a ticking time bomb, wouldn't it be justified?' This hypothetical is used to argue for torture policies.\n\nWhat makes this hypothetical misleading for real policy?",
        idealAnswer: "This is a constructed hypothetical that stacks unrealistic assumptions to force a conclusion. Problems: (1) You KNOW they have info (in reality, often wrong person), (2) You KNOW torture will work (evidence shows it produces false confessions), (3) There's a specific deadline (real threats are ambiguous), (4) It's one person vs. many (creates false dichotomy). The scenario is designed to make torture seem rational by removing all real-world uncertainties. But policies aren't implemented in perfect-knowledge scenarios - they're applied messily by fallible humans to ambiguous situations. The logic trick: construct an impossible scenario where X seems justified, then use it to justify X in messy reality. Reject hypotheticals engineered to smuggle conclusions.",
        keyPrinciples: [
          "Extreme hypotheticals smuggle assumptions that don't hold in reality",
          "Policy operates in uncertainty, not perfect knowledge",
          "Torture produces unreliable information",
          "Don't let edge cases determine general rules"
        ]
      }
    ]
  },
  {
    id: 9,
    name: "Technology & Privacy",
    icon: "🔍",
    color: "from-violet-700 to-purple-900",
    borderColor: "border-violet-500",
    description: "Navigate digital rights and data ethics",
    unlocked: true,
    puzzles: [
      {
        id: 41,
        title: "The Free App Deal",
        icon: "📱",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-pink-600 to-pink-800",
        image: "puzzles/puzzle_9.png",
        question: "A popular app is free and convenient. Your friend says: 'Who cares if they collect my data? I have nothing to hide!' Terms of service allow the company to: track location 24/7, read messages, access contacts, sell data to third parties.\n\nWhat's wrong with the 'nothing to hide' argument?",
        idealAnswer: "The 'nothing to hide' argument misunderstands privacy rights and risks. Problems: (1) You might have nothing to hide NOW, but data is permanent - future governments/employers could use it against you, (2) Privacy isn't about hiding wrongdoing - it's about autonomy and boundaries, (3) Data aggregation reveals intimate details you didn't knowingly share (political views, health, relationships), (4) You can't predict future misuse, (5) 'Nothing to hide' assumes those with power are trustworthy forever. Even innocuous data becomes dangerous in wrong hands. Privacy is like insurance - you don't need it until you desperately do, and then it's too late.",
        keyPrinciples: [
          "Privacy is a right, not contingent on having 'something to hide'",
          "Data is permanent but contexts change",
          "Aggregated data reveals more than individual pieces",
          "Can't predict future misuse by unknown parties"
        ]
      },
      {
        id: 42,
        title: "The Smart Home Hack",
        icon: "🏠",
        skillFocus: "Decision Making",
        skillType: "decision",
        color: "from-blue-600 to-blue-800",
        image: "puzzles/puzzle_42.png",
        question: "Smart home devices are incredibly convenient - voice control, automation, energy savings. But a security report shows 68% of smart home devices have vulnerabilities. Your family wants to install them everywhere.\n\nHow should you think about this tradeoff?",
        idealAnswer: "This requires risk-benefit analysis with threat modeling. Questions: (1) What's at stake if hacked? (Locks/cameras = high risk, lightbulbs = low risk), (2) How attractive a target are you? (3) What's the cost of mitigation? (separate networks, regular updates), (4) What are alternatives? (manual controls as backup). Don't accept all-or-nothing framing. Nuanced approach: secure critical devices well (cameras, locks on isolated network, strong passwords), accept risk for low-stakes convenience (smart lights), keep manual backups. The lesson: convenience-security tradeoffs require granular analysis, not blanket acceptance or rejection. Different risks warrant different responses.",
        keyPrinciples: [
          "Risk-benefit analysis depends on what's at stake",
          "Not all risks are equal - prioritize high-stakes security",
          "Mitigation strategies exist between all-or-nothing",
          "Keep manual backups for critical functions"
        ]
      },
      {
        id: 43,
        title: "The Encrypted Message Debate",
        icon: "🔒",
        skillFocus: "Adaptive Learning",
        skillType: "adaptive",
        color: "from-green-600 to-green-800",
        image: "puzzles/puzzle_43.png",
        question: "After a crime, police say: 'End-to-end encryption helps criminals communicate secretly. We need backdoors to access messages for investigations.' Tech companies respond: 'Backdoors make everyone vulnerable to hackers.'\n\nHow do you evaluate this debate?",
        idealAnswer: "This is a genuine tradeoff with no perfect solution, requiring careful analysis. Law enforcement perspective has merit: criminals DO use encryption. But technical reality: (1) 'Backdoors for good guys only' is mathematically impossible - any backdoor can be exploited by bad actors, (2) Weakening encryption endangers billions of innocent users, (3) Sophisticated criminals will use foreign or custom encryption anyway, (4) Alternatives exist: metadata analysis, traditional investigation. The security-surveillance tradeoff is real, but backdoors don't actually solve the law enforcement problem while creating massive security vulnerabilities. This pattern applies elsewhere: complex tradeoffs where neither side is simply wrong, but one solution has critical technical flaws.",
        keyPrinciples: [
          "Security backdoors can't distinguish authorized from unauthorized access",
          "Weakening security for all to catch few is poor tradeoff",
          "Sophisticated adversaries will circumvent weakened systems",
          "Real tradeoffs exist but some 'solutions' don't actually work technically"
        ]
      },
      {
        id: 44,
        title: "The Personalized Feed",
        icon: "🎯",
        skillFocus: "Bias Detection",
        skillType: "bias",
        color: "from-purple-600 to-purple-800",
        image: "puzzles/puzzle_44.png",
        question: "You notice your social media feed perfectly aligns with your views - everyone seems to agree with you on politics, values, everything. You feel validated and informed. But research shows you're in a 'filter bubble.'\n\nWhat are the hidden costs of personalized content?",
        idealAnswer: "Personalized feeds create epistemic closure with severe costs: (1) You're unaware of what you're NOT seeing (invisible gaps), (2) False consensus effect - thinking your bubble's views are universal, (3) Inability to understand opposition (they're not crazy, you just never see their best arguments), (4) Extreme polarization when bubbles never intersect, (5) Difficulty detecting your own biases (need friction and disagreement). The algorithm maximizes engagement, not truth or understanding. Antidotes: actively seek disagreement, follow people you disagree with, use chronological feeds, recognize that comfort = potential epistemic danger. Feeling validated is pleasant but might signal you're in an echo chamber.",
        keyPrinciples: [
          "Personalization creates invisible information gaps",
          "Engagement optimization doesn't align with truth-seeking",
          "Echo chambers prevent understanding of opposing views",
          "Intellectual discomfort is epistemically healthy"
        ]
      },
      {
        id: 45,
        title: "The Deepfake Evidence",
        icon: "🎬",
        skillFocus: "Source Evaluation",
        skillType: "source",
        color: "from-red-600 to-red-800",
        image: "puzzles/puzzle_45.png",
        question: "Deepfake technology can now create realistic fake videos of anyone saying anything. A friend argues: 'Video evidence is now worthless - we can't trust anything we see anymore.'\n\nIs this the right conclusion about video evidence?",
        idealAnswer: "No - this is catastrophizing that ignores verification methods. Reality: (1) Deepfakes aren't perfect - forensic analysis can detect them (artifacts, lighting inconsistencies, blinking patterns), (2) Provenance matters - direct from trusted source vs. random social media, (3) Context verification - does it align with other evidence?, (4) Expert authentication exists and improves, (5) Most video is still real - deepfakes require effort. Better framing: treat video like any evidence - verify source, check for manipulation signs, corroborate with independent evidence, consult experts for high-stakes decisions. The lesson: new deception methods don't make all evidence worthless; they require better verification standards. Adapt methods, don't abandon evidence.",
        keyPrinciples: [
          "New deception tech requires better verification, not abandoning evidence",
          "Forensic methods can detect manipulation",
          "Source provenance matters",
          "Most content is still authentic - don't catastrophize"
        ]
      },
      {
        id: 165,
        title: "Pay Employee with Gold Rod",
        icon: "🧩",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-indigo-500 to-purple-600",
        image: "puzzles/puzzle_165.webp",
        question: "Pay Employee with Gold Rod",
        idealAnswer: "Think step by step and consider all possibilities.",
        keyPrinciples: [
          "Logical deduction",
          "Pattern recognition"
        ]
      },
      {
        id: 166,
        title: "Injection for Anesthesia",
        icon: "🧩",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-indigo-500 to-purple-600",
        image: "puzzles/puzzle_166.webp",
        question: "Injection for Anesthesia",
        idealAnswer: "Think step by step and consider all possibilities.",
        keyPrinciples: [
          "Logical deduction",
          "Pattern recognition"
        ]
      },
      {
        id: 167,
        title: "Jar with Contaminated Pills",
        icon: "🧩",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-indigo-500 to-purple-600",
        image: "puzzles/puzzle_167.png",
        question: "Jar with Contaminated Pills",
        idealAnswer: "Think step by step and consider all possibilities.",
        keyPrinciples: [
          "Logical deduction",
          "Pattern recognition"
        ]
      },
      {
        id: 168,
        title: "10 Coins Puzzle",
        icon: "🧩",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-indigo-500 to-purple-600",
        image: "puzzles/puzzle_168.webp",
        question: "10 Coins Puzzle",
        idealAnswer: "Think step by step and consider all possibilities.",
        keyPrinciples: [
          "Logical deduction",
          "Pattern recognition"
        ]
      },
      {
        id: 169,
        title: "Prisoner and Policeman",
        icon: "🧩",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-indigo-500 to-purple-600",
        image: "puzzles/puzzle_169.webp",
        question: "Prisoner and Policeman",
        idealAnswer: "Think step by step and consider all possibilities.",
        keyPrinciples: [
          "Logical deduction",
          "Pattern recognition"
        ]
      },
      {
        id: 170,
        title: "Chameleons Go on a Date",
        icon: "🧩",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-indigo-500 to-purple-600",
        image: "puzzles/puzzle_170.webp",
        question: "Chameleons Go on a Date",
        idealAnswer: "Think step by step and consider all possibilities.",
        keyPrinciples: [
          "Logical deduction",
          "Pattern recognition"
        ]
      },
      {
        id: 171,
        title: "The Lion and the Unicorn",
        icon: "🧩",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-indigo-500 to-purple-600",
        image: "puzzles/puzzle_171.webp",
        question: "The Lion and the Unicorn",
        idealAnswer: "Think step by step and consider all possibilities.",
        keyPrinciples: [
          "Logical deduction",
          "Pattern recognition"
        ]
      },
      {
        id: 172,
        title: "Blind Man and Pills",
        icon: "🧩",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-indigo-500 to-purple-600",
        image: "puzzles/puzzle_172.webp",
        question: "Blind Man and Pills",
        idealAnswer: "Think step by step and consider all possibilities.",
        keyPrinciples: [
          "Logical deduction",
          "Pattern recognition"
        ]
      },
      {
        id: 173,
        title: "Circle of Lights",
        icon: "🧩",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-indigo-500 to-purple-600",
        image: "puzzles/puzzle_173.jpg",
        question: "Circle of Lights",
        idealAnswer: "Think step by step and consider all possibilities.",
        keyPrinciples: [
          "Logical deduction",
          "Pattern recognition"
        ]
      },
      {
        id: 174,
        title: "9 Students and Red Black Hats",
        icon: "🧩",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-indigo-500 to-purple-600",
        image: "puzzles/puzzle_174.webp",
        question: "9 Students and Red Black Hats",
        idealAnswer: "Think step by step and consider all possibilities.",
        keyPrinciples: [
          "Logical deduction",
          "Pattern recognition"
        ]
      },
      {
        id: 175,
        title: "50 Red Marbles and 50 Blue Marbles",
        icon: "🧩",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-indigo-500 to-purple-600",
        image: "puzzles/puzzle_175.webp",
        question: "50 Red Marbles and 50 Blue Marbles",
        idealAnswer: "Think step by step and consider all possibilities.",
        keyPrinciples: [
          "Logical deduction",
          "Pattern recognition"
        ]
      },
      {
        id: 176,
        title: "6x6 Grid: How Many Ways?",
        icon: "🧩",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-indigo-500 to-purple-600",
        image: "puzzles/puzzle_176.webp",
        question: "6x6 Grid: How Many Ways?",
        idealAnswer: "Think step by step and consider all possibilities.",
        keyPrinciples: [
          "Logical deduction",
          "Pattern recognition"
        ]
      }
    ]
  }
]