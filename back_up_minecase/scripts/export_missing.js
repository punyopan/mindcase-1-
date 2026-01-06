const fs = require('fs');
const path = require('path');

const topicsPath = path.join(__dirname, '../data/topics.js');
let topicsContent = fs.readFileSync(topicsPath, 'utf8');

const topicsClean = topicsContent.replace('export const topics =', 'const topics =');
const topics = eval(topicsClean + "; topics;");
const marathonPuzzles = topics.find(t => t.id === 0).puzzles;

const missing = [];
marathonPuzzles.forEach(p => {
    if (p.image.includes('default_puzzle.webp')) {
        missing.push({id: p.id, title: p.title});
    }
});

fs.writeFileSync('missing_list.json', JSON.stringify(missing, null, 2));
console.log(`Found ${missing.length} missing.`);
