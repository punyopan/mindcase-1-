const fs = require('fs');
const content = fs.readFileSync('data/topics.js', 'utf8');

const puzzles = [];
const regex = /id:\s*(\d+),[\s\S]*?title:\s*"([^"]+)"/g;
let match;

while ((match = regex.exec(content)) !== null) {
  puzzles.push({ id: match[1], title: match[2] });
}

console.log(JSON.stringify(puzzles, null, 2));
