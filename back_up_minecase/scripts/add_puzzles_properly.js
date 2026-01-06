const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TOPICS_PATH = path.join(__dirname, '../data/topics.js');
const PUZZLES_DIR = path.join(__dirname, '../puzzles');

// Curated list of GFG puzzles - only ones NOT already in the app
const targetPuzzles = [
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-4-pay-an-employee-using-a-gold-rod-of-7-units/", title: "Pay Employee with Gold Rod" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-15-camel-and-banana-puzzle/", title: "Camel and Banana Puzzle" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-34-prisoner-and-policeman-puzzle/", title: "Prisoner and Policeman" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-chameleons-go-on-a-date/", title: "Chameleons Go on a Date" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-heaven-hell/", title: "Heaven and Hell" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-the-lion-and-the-unicorn/", title: "The Lion and the Unicorn" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-blind-man-and-pills/", title: "Blind Man and Pills" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-47-red-hat-vs-blue-hat/", title: "Red Hat vs Blue Hat" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-50-red-marbles-and-50-blue-marbles/", title: "50 Red Marbles 50 Blue Marbles" },
    { url: "https://www.geeksforgeeks.org/aptitude/puzzle-6x6-grid-how-many-ways/", title: "6x6 Grid: How Many Ways?" }
];

// Load existing puzzles for duplicate check
console.log("Loading existing puzzles...");
let topicsContent = fs.readFileSync(TOPICS_PATH, 'utf8');
const topicsClean = topicsContent.replace('export const topics =', 'const topics =');
const topics = eval(topicsClean + "; topics;");
const marathonTopic = topics.find(t => t.id === 0);
const existingPuzzles = marathonTopic.puzzles;
const existingTitlesLower = existingPuzzles.map(p => p.title.toLowerCase());
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
    if (a === b) return true;
    if (a.includes(b) || b.includes(a)) return true;
    // Check key words
    const words1 = a.split(/\s+/).filter(w => w.length > 3);
    const words2 = b.split(/\s+/).filter(w => w.length > 3);
    const matches = words1.filter(w => words2.includes(w)).length;
    return matches >= 2;
}

// Filter duplicates
const newPuzzles = targetPuzzles.filter(p => {
    for (const existing of existingTitlesLower) {
        if (isSimilar(p.title, existing)) {
            console.log(`[SKIP DUPLICATE] "${p.title}" similar to existing`);
            return false;
        }
    }
    return true;
});
console.log(`${newPuzzles.length} new puzzles to process.`);

const puzzlesToAdd = [];
let nextId = maxId + 1;

for (const puzzle of newPuzzles) {
    console.log(`\nProcessing: ${puzzle.title}`);
    const articleHtml = fetchContent(puzzle.url);
    if (!articleHtml) { console.log("   -> Failed to fetch"); continue; }

    // Extract puzzle question from article content
    // Look for text after "Problem:" or first substantial paragraph
    let questionText = "";
    
    // Try to find the main content section
    const contentMatch = articleHtml.match(/<div[^>]*class="[^"]*text[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    if (contentMatch) {
        // Extract paragraphs
        const paragraphs = contentMatch[1].match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
        for (const p of paragraphs) {
            const text = p.replace(/<[^>]+>/g, '').trim();
            if (text.length > 80 && text.length < 1000 && !text.includes('GeeksforGeeks')) {
                questionText = text;
                break;
            }
        }
    }
    
    // Fallback: try meta description
    if (!questionText) {
        const metaMatch = articleHtml.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
        if (metaMatch && metaMatch[1].length > 50) {
            questionText = metaMatch[1];
        }
    }
    
    if (!questionText || questionText.length < 50) {
        console.log("   -> Could not extract puzzle question");
        continue;
    }
    
    // Find matching image
    const imgRegex = /<img[^>]+src="(https:\/\/media\.geeksforgeeks\.org\/wp-content\/uploads\/[^"]+\.(png|jpg|jpeg|webp|gif))"/gi;
    let imgMatch;
    let bestImage = null;
    while ((imgMatch = imgRegex.exec(articleHtml)) !== null) {
        const imgUrl = imgMatch[1];
        if (imgUrl.includes('gfg-gg-logo') || imgUrl.includes('avatar') || imgUrl.includes('gfg_200X200')) continue;
        bestImage = imgUrl;
        break;
    }

    if (!bestImage) { console.log("   -> No suitable image"); continue; }

    // Download image
    const ext = path.extname(bestImage).split('?')[0] || '.png';
    const localFileName = `puzzle_${nextId}${ext}`;
    const localPath = path.join(PUZZLES_DIR, localFileName);

    try {
        execSync(`curl -L -s -A "Mozilla/5.0" -o "${localPath}" "${bestImage}"`);
        const stat = fs.statSync(localPath);
        if (stat.size < 2000) {
            console.log(`   -> Image too small (${stat.size} bytes)`);
            fs.unlinkSync(localPath);
            continue;
        }
        console.log(`   -> Downloaded: ${localFileName} (${stat.size} bytes)`);
        console.log(`   -> Question: ${questionText.substring(0, 80)}...`);
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
        question: questionText.replace(/"/g, '\\"').replace(/\n/g, ' '),
        idealAnswer: "Think step by step and consider all possibilities.",
        keyPrinciples: ["Logical deduction", "Pattern recognition"]
    });
    nextId++;
}

console.log(`\n${puzzlesToAdd.length} puzzles ready to add.`);

if (puzzlesToAdd.length > 0) {
    // Find insertion point
    const puzzlesStart = topicsContent.indexOf('puzzles: [');
    let depth = 0, inArray = false, closingIdx = -1;
    for (let i = puzzlesStart; i < topicsContent.length; i++) {
        if (topicsContent[i] === '[') { depth++; inArray = true; }
        else if (topicsContent[i] === ']') {
            depth--;
            if (inArray && depth === 0) { closingIdx = i; break; }
        }
    }

    if (closingIdx === -1) {
        console.error("Could not find insertion point");
        process.exit(1);
    }

    const puzzleStrings = puzzlesToAdd.map(p => `
        {
          id: ${p.id},
          title: "${p.title}",
          icon: "${p.icon}",
          skillFocus: "${p.skillFocus}",
          skillType: "${p.skillType}",
          color: "${p.color}",
          image: "${p.image}",
          question: "${p.question}",
          idealAnswer: "${p.idealAnswer}",
          keyPrinciples: ${JSON.stringify(p.keyPrinciples)}
        }`).join(',');

    const before = topicsContent.substring(0, closingIdx);
    const after = topicsContent.substring(closingIdx);
    const needsComma = before.trim().endsWith('}');
    const newContent = before + (needsComma ? ',' : '') + puzzleStrings + '\n      ' + after;

    fs.writeFileSync(TOPICS_PATH, newContent);
    console.log("Successfully updated topics.js!");
    
    // Verify
    const verify = fs.readFileSync(TOPICS_PATH, 'utf8').replace('export const topics =', 'const topics =');
    const verifyTopics = eval(verify + "; topics;");
    console.log(`Verification: ${verifyTopics.find(t => t.id === 0).puzzles.length} puzzles`);
}
