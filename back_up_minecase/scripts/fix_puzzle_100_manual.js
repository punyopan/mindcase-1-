const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const url = "https://media.geeksforgeeks.org/wp-content/uploads/20250806161756545491/how_do_match_3_switches_to_3_light_bulbs_.webp";
const dest = path.join(__dirname, '../puzzles/puzzle_100.webp');

console.log(`Downloading ${url}...`);
try {
    execSync(`curl -L -s -o "${dest}" "${url}"`);
    const stats = fs.statSync(dest);
    console.log(`Downloaded size: ${stats.size} bytes`);
    
    if (stats.size > 5000 && stats.size !== 12522 && stats.size !== 20638) {
        console.log("Size looks improved. Updating topics.js...");
        
        const topicsPath = path.join(__dirname, '../data/topics.js');
        let content = fs.readFileSync(topicsPath, 'utf8');
        
        // Find puzzle 100 block and force image update
        // We know structure: id: 100, ... image: "..."
        // Simple regex replace for ID 100 specifically
        const regex = /(id:\s*100,[\s\S]*?image:\s*")([^"]+)(")/;
        
        if (regex.test(content)) {
            content = content.replace(regex, '$1puzzles/puzzle_100.webp$3');
            fs.writeFileSync(topicsPath, content);
            console.log("topics.js updated for Puzzle 100.");
        } else {
            console.log("Could not find Puzzle 100 block in topics.js");
        }
    } else {
        console.log("Downloaded file seems generic or too small.");
    }
} catch (e) {
    console.error("Download failed:", e.message);
}
