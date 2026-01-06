const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Manual mapping of Topics.js IDs to GFG Puzzle URL slugs
// Derived from the list search and common GFG patterns
const puzzleMap = {
    100: "puzzle-7-3-bulbs-and-3-switches",
    101: "puzzle-8-balls-problem",
    102: "puzzle-set-35-2-eggs-and-100-floors",
    103: "puzzle-6-monty-hall-problem",
    104: "puzzle-the-burning-candles",
    105: "puzzle-20-5-pirates-and-100-gold-coins",
    106: "puzzle-19-poison-and-rat",
    107: "puzzle-13-100-prisoners-with-redblack-hats",
    108: "puzzle-water-jug-problem",
    109: "puzzle-farmer-goat-wolf-cabbage",
    110: "cheryls-birthday-puzzle-and-solution",
    111: "puzzle-18-torch-and-bridge",
    112: "puzzle-mislabeled-jars",
    113: "puzzle-16-100-seats-on-a-plane", // Likely guess
    114: "puzzle-9-find-the-fastest-3-horses",
    115: "puzzle-4-pay-an-employee-using-a-gold-rod-of-7-units",
    116: "puzzle-ant-and-triangle-problem", // Guess
    117: "puzzle-1000-doors", // Guess, actually "puzzle-100-doors" usually? No, question says 1000. GFG has 100 doors classic.
    118: "puzzle-josephus-problem",
    119: "puzzle-measuring-6l-water-4l-9l-jug", // Guess
    120: "puzzle-27-hourglasses-puzzle",
    121: "puzzle-3-calculate-total-distance-travelled-by-bee",
    122: "puzzle-heaven-hell",
    123: "puzzle-15-camel-and-banana-puzzle",
    124: "puzzle-snail-climbing-well", // Guess
    125: "puzzle-handshake-problem", // Guess
    126: "puzzle-12-balls", // Guess
    127: "puzzle-50-red-marbles-and-50-blue-marbles",
    // ... I will implement a fuzzy searcher in the script for the rest if precise map fails
    // or just default to a generic "puzzle logic" image if not found to avoid breaking app
};

const puzzlesDir = path.join(__dirname, '../puzzles');
if (!fs.existsSync(puzzlesDir)) fs.mkdirSync(puzzlesDir);

// Helper to fetch OpenGraph Image URL
function fetchImage(id, slug) {
    if (!slug) return null;
    const url = `https://www.geeksforgeeks.org/${slug}/`;
    // Try aptitude path too if root fails
    const url2 = `https://www.geeksforgeeks.org/aptitude/${slug}/`;
    
    try {
        console.log(`Checking ${url}...`);
        // Use curl to get page content (silent, follow redirects)
        // We use a simple regex to find og:image
        const cmd = `curl -L -s "${url}"`;
        const content = execSync(cmd).toString();
        
        let match = content.match(/meta property="og:image" content="([^"]+)"/);
        if (!match) {
             console.log(`Checking ${url2}...`);
             const content2 = execSync(`curl -L -s "${url2}"`).toString();
             match = content2.match(/meta property="og:image" content="([^"]+)"/);
        }

        if (match && match[1]) {
            const imgUrl = match[1];
            // Download it
            const ext = path.extname(imgUrl.split('?')[0]) || '.png';
            const dest = path.join(puzzlesDir, `puzzle_${id}${ext}`);
            console.log(`Downloading ${imgUrl} to ${dest}`);
            execSync(`curl -L -s -o "${dest}" "${imgUrl}"`);
            return `puzzles/puzzle_${id}${ext}`;
        }
    } catch (e) {
        console.error(`Failed to fetch for ${id}: ${e.message}`);
    }
    return null;
}

// Main execution
const updates = {};
// Limit to first 5 for test, or user said "all remaining 65".
// I will do a subset first to ensure it works, effectively "Top 10" to start.
// Doing all 65 serially might take too long for one tool call.
const ids = Object.keys(puzzleMap); 

ids.forEach(id => {
    const slug = puzzleMap[id];
    const localPath = fetchImage(id, slug);
    if (localPath) {
        updates[id] = localPath;
    }
});

// Output the map for the next tool to use
console.log("UPDATES_JSON_START");
console.log(JSON.stringify(updates));
console.log("UPDATES_JSON_END");
