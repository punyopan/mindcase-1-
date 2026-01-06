const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = path.join('c:/Users/k4opu/.gemini/antigravity/brain/6613ecf4-927c-4a22-bcaf-1d111cc22a2c');
const PUZZLES_DIR = path.join(__dirname, '../puzzles');
const TOPICS_PATH = path.join(__dirname, '../data/topics.js');

const generatedIds = [149, 150, 153, 154, 156, 157, 158, 160, 163, 164];

let topicsContent = fs.readFileSync(TOPICS_PATH, 'utf8');
let updateCount = 0;

generatedIds.forEach(id => {
    // Find the generated file (it includes timestamp, so check specifically)
    const files = fs.readdirSync(ARTIFACTS_DIR);
    const genFile = files.find(f => f.startsWith(`puzzle_${id}_`) && f.endsWith('.png'));
    
    if (genFile) {
        const srcPath = path.join(ARTIFACTS_DIR, genFile);
        const destPath = path.join(PUZZLES_DIR, `puzzle_${id}.png`);
        
        console.log(`Copying ${genFile} to puzzles/puzzle_${id}.png`);
        fs.copyFileSync(srcPath, destPath);
        
        // Update topics.js
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
