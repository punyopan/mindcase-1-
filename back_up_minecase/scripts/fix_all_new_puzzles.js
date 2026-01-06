const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TOPICS_PATH = path.join(__dirname, '../data/topics.js');
const PUZZLES_DIR = path.join(__dirname, '../puzzles');

// Step 1: Remove all puzzles with ID >= 165
console.log("Step 1: Removing puzzles with ID >= 165...");
let topicsContent = fs.readFileSync(TOPICS_PATH, 'utf8');
let topicsClean = topicsContent.replace('export const topics =', 'const topics =');
let topics = eval(topicsClean + "; topics;");
let marathonTopic = topics.find(t => t.id === 0);

const beforeCount = marathonTopic.puzzles.length;
marathonTopic.puzzles = marathonTopic.puzzles.filter(p => p.id < 165);
const afterCount = marathonTopic.puzzles.length;
console.log(`Removed ${beforeCount - afterCount} puzzles. Now have ${afterCount}.`);

// Serialize and save
topicsContent = 'export const topics = ' + JSON.stringify(topics, null, 2).replace(/"([^"]+)":/g, '$1:');
fs.writeFileSync(TOPICS_PATH, topicsContent);

// Step 2: Curated puzzles with their GFG URLs
const puzzlesToAdd = [
    {
        url: "https://www.geeksforgeeks.org/aptitude/puzzle-15-camel-and-banana-puzzle/",
        title: "Camel and Banana Puzzle",
        question: "A person has 3000 bananas and a camel. The person wants to transport the maximum number of bananas to a destination that is 1000 km away, using only the camel. The camel cannot carry more than 1000 bananas at a time and eats a banana every km it travels. What is the maximum number of bananas that can be transferred to the destination?"
    },
    {
        url: "https://www.geeksforgeeks.org/aptitude/puzzle-34-prisoner-and-policeman-puzzle/",
        title: "Prisoner and Policeman",
        question: "A policeman caught a thief but there was no way to take him back to the police station. There was a 100m bridge in between, which can only hold 2 people at a time. There was also a bomb set at the bridge which would go off in 17 minutes. The policeman takes 1 minute to cross, the thief takes 2 minutes, a heavy man takes 5 minutes, and a thin man takes 10 minutes. Can they all cross the bridge before the bomb explodes?"
    },
    {
        url: "https://www.geeksforgeeks.org/aptitude/puzzle-chameleons-go-on-a-date/",
        title: "Chameleons Go on a Date",
        question: "On an island, there are 13 red, 15 green, and 17 blue chameleons. When two chameleons of different colors meet, they both change to the third color (e.g., if red meets blue, both become green). Can all chameleons ever become the same color?"
    },
    {
        url: "https://www.geeksforgeeks.org/aptitude/puzzle-heaven-hell/",
        title: "Heaven and Hell",
        question: "You are standing before two doors. One leads to Heaven and one to Hell. There are two guards, one in front of each door. One guard always tells the truth and the other always lies. You do not know which guard is which or which door leads where. You can ask only ONE question to ONE guard. What should you ask to find the door to Heaven?"
    },
    {
        url: "https://www.geeksforgeeks.org/aptitude/puzzle-the-lion-and-the-unicorn/",
        title: "The Lion and the Unicorn",
        question: "The Lion lies on Mondays, Tuesdays, and Wednesdays but tells the truth on other days. The Unicorn lies on Thursdays, Fridays, and Saturdays but tells the truth on other days. One day they both said 'Yesterday was one of my lying days.' What day is it today?"
    },
    {
        url: "https://www.geeksforgeeks.org/aptitude/puzzle-6x6-grid-how-many-ways/",
        title: "6x6 Grid Paths",
        question: "You are at the top-left corner of a 6x6 grid. You can only move right or down. How many different paths can you take to reach the bottom-right corner of the grid?"
    }
];

console.log("\nStep 2: Adding puzzles with proper content...");

function fetchContent(url) {
    try {
        return execSync(`curl -L -s -A "Mozilla/5.0" "${url}"`, { maxBuffer: 10 * 1024 * 1024 }).toString();
    } catch (e) {
        return "";
    }
}

// Re-read topics
topicsContent = fs.readFileSync(TOPICS_PATH, 'utf8');
topicsClean = topicsContent.replace('export const topics =', 'const topics =');
topics = eval(topicsClean + "; topics;");
marathonTopic = topics.find(t => t.id === 0);
const maxId = Math.max(...marathonTopic.puzzles.map(p => p.id));
let nextId = maxId + 1;

const addedPuzzles = [];

for (const puzzle of puzzlesToAdd) {
    console.log(`Processing: ${puzzle.title}`);
    
    const articleHtml = fetchContent(puzzle.url);
    if (!articleHtml) {
        console.log("   -> Failed to fetch, using manual question");
    }
    
    // Find image
    let bestImage = null;
    if (articleHtml) {
        const imgRegex = /<img[^>]+src="(https:\/\/media\.geeksforgeeks\.org\/wp-content\/uploads\/[^"]+\.(png|jpg|jpeg|webp|gif))"/gi;
        let imgMatch;
        while ((imgMatch = imgRegex.exec(articleHtml)) !== null) {
            const imgUrl = imgMatch[1];
            if (imgUrl.includes('gfg-gg-logo') || imgUrl.includes('avatar') || imgUrl.includes('gfg_200X200')) continue;
            bestImage = imgUrl;
            break;
        }
    }
    
    let imagePath = "puzzles/new_default.png";
    
    if (bestImage) {
        const ext = path.extname(bestImage).split('?')[0] || '.png';
        const localFileName = `puzzle_${nextId}${ext}`;
        const localPath = path.join(PUZZLES_DIR, localFileName);
        
        try {
            execSync(`curl -L -s -A "Mozilla/5.0" -o "${localPath}" "${bestImage}"`);
            const stat = fs.statSync(localPath);
            if (stat.size > 2000) {
                imagePath = `puzzles/${localFileName}`;
                console.log(`   -> Downloaded image: ${localFileName} (${stat.size} bytes)`);
            } else {
                fs.unlinkSync(localPath);
            }
        } catch (e) {}
    }
    
    addedPuzzles.push({
        id: nextId,
        title: puzzle.title,
        icon: "🧩",
        skillFocus: "Logical Reasoning",
        skillType: "logical",
        color: "from-indigo-500 to-purple-600",
        image: imagePath,
        question: puzzle.question,
        idealAnswer: "Think step by step and consider all possibilities.",
        keyPrinciples: ["Logical deduction", "Pattern recognition"]
    });
    
    console.log(`   -> Added with question: "${puzzle.question.substring(0, 50)}..."`);
    nextId++;
}

// Add to topics
marathonTopic.puzzles.push(...addedPuzzles);

// Save
const finalContent = 'export const topics = ' + JSON.stringify(topics, null, 2).replace(/"([^"]+)":/g, '$1:');
fs.writeFileSync(TOPICS_PATH, finalContent);

console.log(`\nDone! Added ${addedPuzzles.length} puzzles. Total: ${marathonTopic.puzzles.length}`);
