const fs = require('fs');
const path = require('path');

const topicsPath = path.join(__dirname, '../data/topics.js');
let topicsContent = fs.readFileSync(topicsPath, 'utf8');
const puzzlesDir = path.join(__dirname, '../puzzles');
const files = fs.readdirSync(puzzlesDir);

// For each puzzle ID from 100 to 164 (Marathon Mode)
let updatedCount = 0;
for (let id = 100; id <= 164; id++) {
    // Find matching file
    const match = files.find(f => f.startsWith(`puzzle_${id}.`));
    
    if (match) {
        // Regex to find the puzzle block and update its image
        // We look for "id: [id]," then somewhere after "image: ..."
        // This is tricky with regex. Better to replace specific lines if strict structure.
        // Assuming strict structure from previous view:  image: "...",
        
        // Safer: Find the block for this ID
        const idRegex = new RegExp(`id:\\s*${id},[\\s\\S]*?image:\\s*"([^"]+)"`, 'g');
        
        if (idRegex.test(topicsContent)) {
            topicsContent = topicsContent.replace(idRegex, (fullMatch, oldImg) => {
                const newImg = `puzzles/${match}`;
                if (oldImg !== newImg) {
                    updatedCount++;
                    // Replace only the image part in the match
                    return fullMatch.replace(`image: "${oldImg}"`, `image: "${newImg}"`);
                }
                return fullMatch;
            });
        }
    } else {
        // Optional: Set to default if missing? 
        // User asked to "download... so it loads reliably".
        // If we failed to download, pointing to a verified local default is better than a broken URL.
        const idRegex = new RegExp(`id:\\s*${id},[\\s\\S]*?image:\\s*"([^"]+)"`, 'g');
         topicsContent = topicsContent.replace(idRegex, (fullMatch, oldImg) => {
             // Only replace if it looks like an external URL
             if (oldImg.startsWith('http')) {
                 updatedCount++;
                 return fullMatch.replace(`image: "${oldImg}"`, `image: "puzzles/default_puzzle.webp"`);
             }
             return fullMatch;
        });
    }
}

fs.writeFileSync(topicsPath, topicsContent);
console.log(`Updated ${updatedCount} puzzles in topics.js`);
