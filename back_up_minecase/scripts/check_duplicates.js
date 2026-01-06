const fs = require('fs');
const path = require('path');

const topicsPath = path.join(__dirname, '../data/topics.js');
let topicsContent = fs.readFileSync(topicsPath, 'utf8');
const topicsClean = topicsContent.replace('export const topics =', 'const topics =');
const topics = eval(topicsClean + "; topics;");
const marathonPuzzles = topics.find(t => t.id === 0).puzzles;

console.log("Checking for explicit duplicate references to puzzle_100...");

marathonPuzzles.forEach(p => {
    // Check if it uses puzzle_100 but isn't puzzle 100
    if (p.id !== 100 && (p.image.includes('puzzle_100.webp') || p.image.includes('puzzle_100.png'))) {
        console.log(`[DUPLICATE REF] ID: ${p.id} uses ${p.image}`);
    }
});
