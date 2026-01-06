const fs = require('fs');
const path = require('path');

const topicsPath = path.join(__dirname, '../data/topics.js');
const content = fs.readFileSync(topicsPath, 'utf8');
const lines = content.split('\n');

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

console.log("Finding lines...");
lines.forEach((line, index) => {
    const lineLower = line.toLowerCase();
    const match = blacklist.find(b => lineLower.includes(`title: "`) && lineLower.includes(b));
    if (match) {
        console.log(`Line ${index + 1}: ${line.trim()} (Match: ${match})`);
    }
});
