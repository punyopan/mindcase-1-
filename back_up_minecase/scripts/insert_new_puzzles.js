const fs = require('fs');
const path = require('path');

const TOPICS_PATH = path.join(__dirname, '../data/topics.js');
const PUZZLES_DIR = path.join(__dirname, '../puzzles');

// Puzzle mapping based on downloaded files
const newPuzzleData = [
    { id: 165, title: "Pay Employee with Gold Rod", image: "puzzles/puzzle_165.webp" },
    { id: 166, title: "Injection for Anesthesia", image: "puzzles/puzzle_166.webp" },
    { id: 167, title: "Camel and Banana", image: "puzzles/puzzle_167.png" },
    { id: 168, title: "Jar with Contaminated Pills", image: "puzzles/puzzle_168.webp" },
    { id: 169, title: "10 Coins Puzzle", image: "puzzles/puzzle_169.webp" },
    { id: 170, title: "Prisoner and Policeman", image: "puzzles/puzzle_170.webp" },
    { id: 171, title: "Chameleons Go on a Date", image: "puzzles/puzzle_171.webp" },
    { id: 172, title: "Heaven and Hell", image: "puzzles/puzzle_172.webp" },
    { id: 174, title: "Blind Man and Pills", image: "puzzles/puzzle_174.webp" },
    { id: 175, title: "Red Hat vs Blue Hat", image: "puzzles/puzzle_175.webp" },
    { id: 176, title: "50 Red and 50 Blue Marbles", image: "puzzles/puzzle_176.webp" }
];

// Verify files exist and filter
const validPuzzles = newPuzzleData.filter(p => {
    const imgPath = path.join(__dirname, '..', p.image);
    const exists = fs.existsSync(imgPath);
    if (!exists) console.log(`[SKIP] ${p.title} - image not found: ${p.image}`);
    return exists;
});

console.log(`${validPuzzles.length} puzzles with valid images.`);

let topicsContent = fs.readFileSync(TOPICS_PATH, 'utf8');

// Find the closing bracket of the puzzles array in the first topic
// Pattern: Look for the last puzzle entry's closing brace `}` followed by line with `]`
// Then insert before that `]`

// A more reliable approach: Find `puzzles: [` and then find its matching `]`
const puzzlesStart = topicsContent.indexOf('puzzles: [');
if (puzzlesStart === -1) {
    console.error("Could not find 'puzzles: [' in topics.js");
    process.exit(1);
}

// Find the matching closing bracket by counting braces
let depth = 0;
let inArray = false;
let closingIdx = -1;
for (let i = puzzlesStart; i < topicsContent.length; i++) {
    const char = topicsContent[i];
    if (char === '[') {
        depth++;
        inArray = true;
    } else if (char === ']') {
        depth--;
        if (inArray && depth === 0) {
            closingIdx = i;
            break;
        }
    }
}

if (closingIdx === -1) {
    console.error("Could not find closing bracket of puzzles array");
    process.exit(1);
}

// Generate new puzzle entries
const puzzleStrings = validPuzzles.map(p => `
        {
          id: ${p.id},
          title: "${p.title}",
          icon: "🧩",
          skillFocus: "Logical Reasoning",
          skillType: "logical",
          color: "from-indigo-500 to-purple-600",
          image: "${p.image}",
          question: "${p.title}",
          idealAnswer: "Think step by step and consider all possibilities.",
          keyPrinciples: ["Logical deduction", "Pattern recognition"]
        }`).join(',');

// Insert before the closing bracket
const before = topicsContent.substring(0, closingIdx);
const after = topicsContent.substring(closingIdx);

// Check if we need a comma
const needsComma = before.trim().endsWith('}');
const newContent = before + (needsComma ? ',' : '') + puzzleStrings + '\n      ' + after;

fs.writeFileSync(TOPICS_PATH, newContent);
console.log(`Successfully added ${validPuzzles.length} new puzzles!`);

// Verify
const verifyContent = fs.readFileSync(TOPICS_PATH, 'utf8');
const verifyClean = verifyContent.replace('export const topics =', 'const topics =');
try {
    const verifyTopics = eval(verifyClean + "; topics;");
    const count = verifyTopics.find(t => t.id === 0).puzzles.length;
    console.log(`Verification: ${count} puzzles in Marathon Mode.`);
} catch (e) {
    console.error("Syntax error in topics.js!", e.message);
}
