const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = path.join('c:/Users/k4opu/.gemini/antigravity/brain/6613ecf4-927c-4a22-bcaf-1d111cc22a2c');
const PUZZLES_DIR = path.join(__dirname, '../puzzles');
const TOPICS_PATH = path.join(__dirname, '../data/topics.js');

// List of IDs we successfully generated images for in this session
const generatedIds = [102, 113, 117, 118, 119, 120, 121, 124, 125, 126, 129];

let topicsContent = fs.readFileSync(TOPICS_PATH, 'utf8');
let updateCount = 0;

generatedIds.forEach(id => {
    const files = fs.readdirSync(ARTIFACTS_DIR);
    // Find file that matches puzzle_ID_TIMESTAMP.png
    const genFile = files.find(f => f.startsWith(`puzzle_${id}_`) && f.endsWith('.png'));
    
    if (genFile) {
        const srcPath = path.join(ARTIFACTS_DIR, genFile);
        const destPath = path.join(PUZZLES_DIR, `puzzle_${id}.png`);
        
        console.log(`Copying ${genFile} to puzzles/puzzle_${id}.png`);
        fs.copyFileSync(srcPath, destPath);
        
        const regex = new RegExp(`(id:\\s*${id},[\\s\\S]*?image:\\s*")([^"]+)(")`);
        if (regex.test(topicsContent)) {
            topicsContent = topicsContent.replace(regex, `$1puzzles/puzzle_${id}.png$3`);
            updateCount++;
            console.log(`   -> Updated topics.js for ${id}`);
        }
    } else {
        console.log(`[WARN] Could not find generated artifact for ${id}`);
    }
});

if (updateCount > 0) {
    fs.writeFileSync(TOPICS_PATH, topicsContent);
    console.log(`Successfully deployed ${updateCount} new images.`);
}
