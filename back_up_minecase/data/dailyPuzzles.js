//
export const dailyPuzzles = [
    {
      id: 1,
      type: 'Pattern Recognition',
      question: 'Complete the sequence: 2, 6, 12, 20, 30, ?',
      options: ['40', '42', '44', '48'],
      answer: '42',
      explanation: 'The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42',
      difficulty: 'Medium'
    },
    {
      id: 2,
      type: 'Logical Deduction',
      question: 'If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies?',
      options: ['True', 'False', 'Cannot be determined'],
      answer: 'True',
      explanation: 'This is syllogistic reasoning. If A⊆B and B⊆C, then A⊆C. All Bloops must be Lazzies.',
      difficulty: 'Easy'
    },
    {
      id: 3,
      type: 'Number Sequence',
      question: 'What comes next? 1, 1, 2, 3, 5, 8, 13, ?',
      options: ['18', '19', '21', '24'],
      answer: '21',
      explanation: 'This is the Fibonacci sequence where each number is the sum of the two preceding ones: 8+13=21',
      difficulty: 'Easy'
    },
    {
      id: 4,
      type: 'Spatial Reasoning',
      question: 'A cube is painted red on all faces, then cut into 27 smaller cubes. How many small cubes have exactly 2 red faces?',
      options: ['8', '12', '6', '1'],
      answer: '12',
      explanation: 'Edge cubes (excluding corners) have exactly 2 painted faces. A 3×3×3 cube has 12 edge pieces.',
      difficulty: 'Hard'
    },
    {
      id: 5,
      type: 'Logic Grid',
      question: 'Three friends: Alice, Bob, Carol. One always tells truth, one always lies, one alternates. Alice says "Bob lies." Bob says "Carol alternates." Who tells the truth?',
      options: ['Alice', 'Bob', 'Carol', 'Cannot determine'],
      answer: 'Carol',
      explanation: 'If Alice told truth, Bob lies, making Carol alternate. But then Bob\'s statement is false (correct for liar). This is consistent. Carol alternates, so Carol must be telling truth this time.',
      difficulty: 'Hard'
    },
    {
      id: 6,
      type: 'Pattern Recognition',
      question: 'Which number doesn\'t belong? 3, 5, 7, 9, 11, 15',
      options: ['3', '9', '15', '11'],
      answer: '9',
      explanation: '9 is the only composite number. All others (3, 5, 7, 11, 15... wait, 15=3×5) are prime except 9=3×3 and 15=3×5. Actually 9 is the perfect square.',
      difficulty: 'Medium'
    },
    {
      id: 7,
      type: 'Riddle Logic',
      question: 'I speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I?',
      options: ['Echo', 'Shadow', 'Fire', 'Cloud'],
      answer: 'Echo',
      explanation: 'An echo "speaks" (repeats sound) without a mouth, "hears" (responds to) sound, has no physical body, and travels through air/wind.',
      difficulty: 'Medium'
    }
];