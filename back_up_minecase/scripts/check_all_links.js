const fs = require('fs');
const path = require('path');

const topicsPath = path.join(__dirname, '../data/topics.js');
const puzzlesDir = path.join(__dirname, '../puzzles');

let topicsContent = fs.readFileSync(topicsPath, 'utf8');
const topicsClean = topicsContent.replace('export const topics =', 'const topics =');
const topics = eval(topicsClean + "; topics;");
const marathonPuzzles = topics.find(t => t.id === 0).puzzles;

console.log("Checking " + marathonPuzzles.length + " puzzles for broken images...");

let brokenCount = 0;
marathonPuzzles.forEach(p => {
    // p.image is like "puzzles/puzzle_100.webp"
    // We need to resolve this relative to the project root or verify strictly
    // The script is in /scripts, puzzles is in /puzzles.
    // p.image usually starts with "puzzles/"
    
    let relPath = p.image;
    let fileName = path.basename(relPath);
    let fullPath = path.join(puzzlesDir, fileName);
    
    if (!fs.existsSync(fullPath)) {
        console.log(`[MISSING] ID: ${p.id}, Title: "${p.title}", Path: ${p.image}`);
        brokenCount++;
    }
});

console.log(`Total broken links: ${brokenCount}`);
