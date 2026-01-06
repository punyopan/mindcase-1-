const fs = require('fs');
const path = require('path');

const puzzlesDir = path.join(__dirname, '../puzzles');
const files = fs.readdirSync(puzzlesDir);

console.log(`Listing ${files.length} files in puzzles/:`);
files.forEach(f => {
    const stat = fs.statSync(path.join(puzzlesDir, f));
    console.log(`${f}: ${stat.size} bytes`);
});
