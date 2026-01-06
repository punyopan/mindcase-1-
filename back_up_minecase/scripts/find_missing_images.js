const fs = require('fs');
const path = require('path');

const topicsPath = path.join(__dirname, '../data/topics.js');
let topicsContent = fs.readFileSync(topicsPath, 'utf8');

// Replace old default with new default
if (topicsContent.includes('puzzles/default_puzzle.webp')) {
    topicsContent = topicsContent.replace(/puzzles\/default_puzzle\.webp/g, 'puzzles/new_default.png');
    fs.writeFileSync(topicsPath, topicsContent);
    console.log("Updated topics.js to use new_default.png");
} else {
    console.log("No default_puzzle.webp found to replace.");
}

