const fs = require('fs');
let content = fs.readFileSync('data/topics.js', 'utf8');
content = content.replace("export const topics =", "");
// Remove any imports if they exist. 
// Just in case, although view didn't show any.
content = content.replace(/import .*?;/g, "");
// Eval
const topics = eval("(" + content + ")"); 
const allPuzzles = [];
topics.forEach(t => {
  if(t.puzzles) {
    t.puzzles.forEach(p => {
       allPuzzles.push({ topicId: t.id, puzzleId: p.id, title: p.title });
    });
  }
});
console.log(JSON.stringify(allPuzzles, null, 2));
