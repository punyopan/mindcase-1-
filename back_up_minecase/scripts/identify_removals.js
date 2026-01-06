const fs = require('fs');
const path = require('path');

const topicsPath = path.join(__dirname, '../data/topics.js');
let topicsContent = fs.readFileSync(topicsPath, 'utf8');

const topicsClean = topicsContent.replace('export const topics =', 'const topics =');
const topics = eval(topicsClean + "; topics;");
const marathonPuzzles = topics.find(t => t.id === 0).puzzles;

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

const matches = [];
marathonPuzzles.forEach(p => {
    const titleLower = p.title.toLowerCase();
    const match = blacklist.find(b => titleLower.includes(b));
    if (match) {
        matches.push(p.id);
        console.log(`[MATCH] ID: ${p.id}, Title: "${p.title}"`);
    }
});
fs.writeFileSync('removals.json', JSON.stringify(matches));
console.log(`Found ${matches.length} items to remove.`);

