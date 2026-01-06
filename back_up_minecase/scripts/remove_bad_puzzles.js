const fs = require('fs');
const path = require('path');

const TOPICS_PATH = path.join(__dirname, '../data/topics.js');

let topicsContent = fs.readFileSync(TOPICS_PATH, 'utf8');
const topicsClean = topicsContent.replace('export const topics =', 'const topics =');
const topics = eval(topicsClean + "; topics;");
const marathonTopic = topics.find(t => t.id === 0);

// Remove puzzles with ID >= 165
const originalCount = marathonTopic.puzzles.length;
marathonTopic.puzzles = marathonTopic.puzzles.filter(p => p.id < 165);
const newCount = marathonTopic.puzzles.length;

console.log(`Removed ${originalCount - newCount} puzzles (IDs >= 165)`);

// Serialize back
const newContent = 'export const topics = ' + JSON.stringify(topics, null, 2)
    .replace(/"([^"]+)":/g, '$1:') // Remove quotes from keys
    .replace(/\\n/g, '\\n'); // Keep newlines escaped

fs.writeFileSync(TOPICS_PATH, newContent);
console.log(`Updated topics.js. Now has ${newCount} puzzles in Marathon Mode.`);
