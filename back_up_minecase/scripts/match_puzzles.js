const fs = require('fs');
const path = require('path');

// Read topics.js content (hacky parsing since it's ES6 export)
const topicsPath = path.join(__dirname, '../data/topics.js');
let topicsContent = fs.readFileSync(topicsPath, 'utf8');

// Extract the puzzles array from the file content
// We look for the "Riddle Marathon" topic (id: 0) and its puzzles
const puzzleBlockMatch = topicsContent.match(/id:\s*0[\s\S]*?puzzles:\s*\[([\s\S]*?)\]\s*\},/);

if (!puzzleBlockMatch) {
    console.error("Could not find Riddle Marathon puzzles block");
    process.exit(1);
}

const puzzlesBlock = puzzleBlockMatch[1];
// Match individual puzzle objects simplified
const puzzleRegex = /id:\s*(\d+),[\s\S]*?title:\s*"([^"]+)"/g;
let match;
const puzzles = [];

while ((match = puzzleRegex.exec(puzzlesBlock)) !== null) {
    puzzles.push({
        id: parseInt(match[1]),
        title: match[2]
    });
}

// List available image files
const puzzlesDir = path.join(__dirname, '../puzzles');
const files = fs.readdirSync(puzzlesDir);

const updates = [];
const missing = [];

puzzles.forEach(p => {
    // Strategy 1: Match by ID (puzzle_100.png)
    // Strategy 2: Match by GFG number guessing? (puzzle_7.png for "3 Bulbs") - hard.
    
    // Let's rely on the file listing we saw earlier.
    // We saw puzzle_139, puzzle_156, etc. which seem to match IDs.
    
    const possibleFiles = [
        `puzzle_${p.id}.png`,
        `puzzle_${p.id}.webp`,
        `puzzle_${p.id}.jpg`,
        // Try simple number match if ID is 100+ but file is small number?
        // No, keep it simple first.
    ];

    let found = files.find(f => possibleFiles.includes(f));

    if (found) {
        updates.push({
            id: p.id,
            image: `puzzles/${found}`
        });
    } else {
        missing.push(p);
    }
});

console.log(JSON.stringify({ found: updates.length, missing: missing.length, updates, missing }, null, 2));
