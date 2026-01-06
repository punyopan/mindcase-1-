const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TOPICS_PATH = path.join(__dirname, '../data/topics.js');
const PUZZLES_DIR = path.join(__dirname, '../puzzles');

// Curated list of GFG puzzles with images (from the index page)
const targetPuzzles = [
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-4-pay-an-employee-using-a-gold-rod-of-7-units/", title: "Pay Employee with Gold Rod" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-5-finding-the-injection-for-anesthesia/", title: "Injection for Anesthesia" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-15-camel-and-banana-puzzle/", title: "Camel and Banana" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-7-find-the-jar-with-contaminated-pills/", title: "Jar with Contaminated Pills" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-24-10-coins-puzzle/", title: "10 Coins Puzzle" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-34-prisoner-and-policeman-puzzle/", title: "Prisoner and Policeman" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-chameleons-go-on-a-date/", title: "Chameleons Go on a Date" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-heaven-hell/", title: "Heaven and Hell" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-the-lion-and-the-unicorn/", title: "The Lion and the Unicorn" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-blind-man-and-pills/", title: "Blind Man and Pills" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-47-red-hat-vs-blue-hat/", title: "Red Hat vs Blue Hat" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-the-circle-of-lights/", title: "Circle of Lights" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-9-students-and-red-black-hats/", title: "9 Students and Red Black Hats" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-50-red-marbles-and-50-blue-marbles/", title: "50 Red Marbles and 50 Blue Marbles" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-6x6-grid-how-many-ways/", title: "6x6 Grid: How Many Ways?" }
];

// Load existing puzzles
console.log("Loading existing puzzles...");
let topicsContent = fs.readFileSync(TOPICS_PATH, 'utf8');
const topicsClean = topicsContent.replace('export const topics =', 'const topics =');
const topics = eval(topicsClean + "; topics;");
const marathonTopic = topics.find(t => t.id === 0);
const existingPuzzles = marathonTopic.puzzles;
const existingTitlesLower = existingPuzzles.map(p => p.title.toLowerCase().trim());
const maxId = Math.max(...existingPuzzles.map(p => p.id));
console.log(`Found ${existingPuzzles.length} existing puzzles. Max ID: ${maxId}`);

function fetchContent(url) {
    try {
        return execSync(`curl -L -s -A "Mozilla/5.0" "${url}"`, { maxBuffer: 10 * 1024 * 1024 }).toString();
    } catch (e) {
        return "";
    }
}

function isSimilar(t1, t2) {
    const a = t1.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    const b = t2.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    return a === b || a.includes(b) || b.includes(a);
}

// Filter duplicates
const newPuzzles = targetPuzzles.filter(p => {
    for (const existing of existingTitlesLower) {
        if (isSimilar(p.title, existing)) return false;
    }
    return true;
});
console.log(`${newPuzzles.length} new puzzles to add.`);

const puzzlesToAdd = [];
let nextId = maxId + 1;

for (const puzzle of newPuzzles) {
    console.log(`Processing: ${puzzle.title}`);
    const articleHtml = fetchContent(puzzle.url);
    if (!articleHtml) { console.log("   -> Failed to fetch"); continue; }

    // Find image
    const imgRegex = /<img[^>]+src="(https:\/\/media\.geeksforgeeks\.org\/wp-content\/uploads\/[^"]+\.(png|jpg|jpeg|webp|gif))"/gi;
    let imgMatch;
    let bestImage = null;
    while ((imgMatch = imgRegex.exec(articleHtml)) !== null) {
        const imgUrl = imgMatch[1];
        if (imgUrl.includes('gfg-gg-logo') || imgUrl.includes('avatar') || imgUrl.includes('gfg_200X200')) continue;
        bestImage = imgUrl;
        break;
    }

    if (!bestImage) { console.log("   -> No image found"); continue; }

    const ext = path.extname(bestImage).split('?')[0] || '.png';
    const localFileName = `puzzle_${nextId}${ext}`;
    const localPath = path.join(PUZZLES_DIR, localFileName);

    try {
        execSync(`curl -L -s -A "Mozilla/5.0" -o "${localPath}" "${bestImage}"`);
        const stat = fs.statSync(localPath);
        if (stat.size < 1000) {
            console.log(`   -> Image too small (${stat.size} bytes)`);
            fs.unlinkSync(localPath);
            continue;
        }
        console.log(`   -> Downloaded: ${localFileName} (${stat.size} bytes)`);
    } catch (e) {
        console.log("   -> Download failed");
        continue;
    }

    puzzlesToAdd.push({
        id: nextId,
        title: puzzle.title,
        icon: "🧩",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-indigo-500 to-purple-600",
        image: `puzzles/${localFileName}`,
        question: puzzle.title,
        idealAnswer: "Think step by step and consider all possibilities.",
        keyPrinciples: ["Logical deduction", "Pattern recognition"]
    });
    nextId++;
}

console.log(`\nFound ${puzzlesToAdd.length} puzzles with images.`);

if (puzzlesToAdd.length > 0) {
    // Find the last puzzle closing brace and insert before it
    const lastPuzzleEnd = topicsContent.lastIndexOf('keyPrinciples:');
    const insertAfter = topicsContent.indexOf(']', lastPuzzleEnd);
    const closingBrace = topicsContent.indexOf('}', insertAfter);
    const insertIdx = closingBrace + 1;
    
    const puzzleStrings = puzzlesToAdd.map(p => `
        {
          id: ${p.id},
          title: "${p.title.replace(/"/g, '\\"')}",
          icon: "${p.icon}",
          skillFocus: "${p.skillFocus}",
          skillType: "${p.skillType}",
          color: "${p.color}",
          image: "${p.image}",
          question: "${p.question.replace(/"/g, '\\"')}",
          idealAnswer: "${p.idealAnswer}",
          keyPrinciples: ${JSON.stringify(p.keyPrinciples)}
        }`).join(',');

    const newContent = topicsContent.substring(0, insertIdx) + ',' + puzzleStrings + topicsContent.substring(insertIdx);
    fs.writeFileSync(TOPICS_PATH, newContent);
    console.log("Successfully updated topics.js!");
}

console.log("Done!");
