const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const url = "https://media.geeksforgeeks.org/wp-content/uploads/20250806161756545491/how_do_match_3_switches_to_3_light_bulbs_.webp";
const dest = path.join(__dirname, '../puzzles/puzzle_100.webp');
const topicsPath = path.join(__dirname, '../data/topics.js');

console.log(`Force downloading User URL for Puzzle 100...`);
try {
    execSync(`curl -L -s -o "${dest}" "${url}"`);
    const stats = fs.statSync(dest);
    console.log(`Downloaded size: ${stats.size} bytes`);
    
    // Force update topics.js
    let content = fs.readFileSync(topicsPath, 'utf8');
    const regex = /(id:\s*100,[\s\S]*?image:\s*")([^"]+)(")/;
    if (regex.test(content)) {
        content = content.replace(regex, '$1puzzles/puzzle_100.webp$3');
        fs.writeFileSync(topicsPath, content);
        console.log("topics.js updated for Puzzle 100.");
    }
} catch (e) {
    console.error("Download failed:", e.message);
}
