const fs = require('fs');
const path = require('path');

const topicsPath = path.join(__dirname, '../data/topics.js');
let content = fs.readFileSync(topicsPath, 'utf8');
let lines = content.split('\n');

const blacklist = [
    "divisibility rules",
    "numbers aptitude questions and answers",
    "verbal ability",
    "logical reasoning",
    "reasoning tricks to solve coding decoding",
    "venn diagrams verbal reasoning questions and answers",
    "ola cabs",
    "goldman sachs",
    "makemytrip"
];

// Identify lines to delete
const linesToDelete = new Set();
let removedCount = 0;

// Iterate backwards to avoid index shifting issues if we were modifying in place, 
// though here we mark first.
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();
    
    // Check if this line is a title line matching blacklist
    const isTitle = line.trim().startsWith('title:');
    if (!isTitle) continue;

    const match = blacklist.find(b => lineLower.includes(b));
    if (match) {
        console.log(`Found match on line ${i+1}: ${line.trim()}`);
        
        // Find start of object (backwards)
        let startIndex = i;
        let braceCount = 0;
        // Search backwards for the opening brace of this object
        // NOTE: This assumes standard formatting where { is on a previous line or same line
        while (startIndex >= 0) {
            if (lines[startIndex].includes('{')) {
                // Check if this is the start of the puzzle object
                // A puzzle object usually starts with { and contains id, title etc.
                // We assume the nearest { going back is the start.
                break;
            }
            startIndex--;
        }

        // Find end of object (forwards)
        let endIndex = i;
        braceCount = 1; // We assume we are inside one because we found the start (conceptually)
        // Actually, let's count braces from the start index properly
        
        // Better stack approach:
        // Start from startIndex. Count { as +1, } as -1. Stop when 0.
        let currentLineIdx = startIndex;
        let balance = 0;
        let foundEnd = false;
        
        while (currentLineIdx < lines.length) {
            const l = lines[currentLineIdx];
            // Simple brace counting (might break on strings containing braces, but unlikely in this file structure)
            const openMatches = (l.match(/\{/g) || []).length;
            const closeMatches = (l.match(/\}/g) || []).length;
            
            balance += openMatches;
            balance -= closeMatches;
            
            if (balance === 0 && currentLineIdx >= i) { // End must be after title
                endIndex = currentLineIdx;
                foundEnd = true;
                break;
            }
            currentLineIdx++;
        }

        if (foundEnd) {
            console.log(`   -> Marking block ${startIndex+1} to ${endIndex+1} for deletion.`);
            for (let k = startIndex; k <= endIndex; k++) {
                linesToDelete.add(k);
            }
            removedCount++;
        } else {
            console.log(`   -> [WARN] Could not find end of block for line ${i+1}`);
        }
    }
}

// Reconstruct
if (removedCount > 0) {
    const newLines = lines.filter((_, idx) => !linesToDelete.has(idx));
    fs.writeFileSync(topicsPath, newLines.join('\n'));
    console.log(`Pruned ${removedCount} items.`);
} else {
    console.log("No items found to prune.");
}
