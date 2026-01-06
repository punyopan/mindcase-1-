const fs = require('fs');
const path = require('path');

const topicsPath = path.join(__dirname, '../data/topics.js');
let topicsContent = fs.readFileSync(topicsPath, 'utf8');

// Parse topics
const topicsClean = topicsContent.replace('export const topics =', 'const topics =');
const topics = eval(topicsClean + "; topics;");
const marathonPuzzles = topics.find(t => t.id === 0).puzzles;
const puzzlesDir = path.join(__dirname, '../puzzles');

let updateCount = 0;

// Ensure default exists
const defaultPath = path.join(puzzlesDir, 'default_puzzle.webp');
if (!fs.existsSync(defaultPath)) {
    // If default is missing, copy one of the existing valid ones or create a dummy
    // We see puzzle_100.webp exists.
    if (fs.existsSync(path.join(puzzlesDir, 'puzzle_100.webp'))) {
        fs.copyFileSync(path.join(puzzlesDir, 'puzzle_100.webp'), defaultPath);
    }
}

marathonPuzzles.forEach(p => {
    // Current image path from data
    const imgRelPath = p.image;
    // content referenced: "puzzles/puzzle_X.png"
    // We need absolute path to check existence
    const imgAbsPath = path.join(__dirname, '../', imgRelPath);

    if (!fs.existsSync(imgAbsPath)) {
        console.log(`[MISSING] Puzzle ${p.id}: ${imgRelPath} not found.`);
        
        // Update to default
        // Regex to safe replace
        const regex = new RegExp(`(id:\\s*${p.id},[\\s\\S]*?image:\\s*")([^"]+)(")`);
        if (regex.test(topicsContent)) {
            topicsContent = topicsContent.replace(regex, `$1puzzles/default_puzzle.webp$3`);
            updateCount++;
            console.log(`   -> Remapped to default_puzzle.webp`);
        }
    }
});

if (updateCount > 0) {
    fs.writeFileSync(topicsPath, topicsContent);
    console.log(`Fixed ${updateCount} broken image links in topics.js`);
} else {
    console.log("No broken links found.");
}
