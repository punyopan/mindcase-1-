const fs = require('fs');
const content = fs.readFileSync('data/topics.js', 'utf8');

// We need to parse nested structure.
// Simple regex won't work well for nested arrays.
// We'll use a slightly more complex regex approach or just eval the file if valid JS (it is export const).
// Since it has imports/exports, we can't just eval.
// We'll try to Regex match "id: X, ... puzzles: [" blocks.

// Actually, identifying blocks by indentation is easier or matching "puzzles: \["
// Let's try matching topic blocks.

const topics = [];
const topicRegex = /id:\s*(\d+),[\s\S]*?name:\s*"([^"]+)"[\s\S]*?puzzles:\s*\[([\s\S]*?)\]\s*\},/g;

let match;
while ((match = topicRegex.exec(content)) !== null) {
  const topicId = match[1];
  const topicName = match[2];
  const puzzlesBlock = match[3];
  
  const puzzleRegex = /id:\s*(\d+),[\s\S]*?title:\s*"([^"]+)"/g;
  let pMatch;
  while ((pMatch = puzzleRegex.exec(puzzlesBlock)) !== null) {
    topics.push({
      topicId: topicId,
      puzzleId: pMatch[1],
      title: pMatch[2]
    });
  }
}

console.log(JSON.stringify(topics, null, 2));
