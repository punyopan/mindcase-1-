const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TOPICS_PATH = path.join(__dirname, '../data/topics.js');

// Map of puzzle IDs to their GFG URLs for fetching proper questions
const puzzleUrls = {
    165: "https://www.geeksforgeeks.org/aptitude/puzzle-15-camel-and-banana-puzzle/",
    166: "https://www.geeksforgeeks.org/aptitude/puzzle-34-prisoner-and-policeman-puzzle/",
    167: "https://www.geeksforgeeks.org/aptitude/puzzle-chameleons-go-on-a-date/",
    168: "https://www.geeksforgeeks.org/aptitude/puzzle-heaven-hell/",
    169: "https://www.geeksforgeeks.org/aptitude/puzzle-the-lion-and-the-unicorn/",
    170: "https://www.geeksforgeeks.org/aptitude/puzzle-6x6-grid-how-many-ways/"
};

function fetchContent(url) {
    try {
        return execSync(`curl -L -s -A "Mozilla/5.0" "${url}"`, { maxBuffer: 10 * 1024 * 1024 }).toString();
    } catch (e) {
        return "";
    }
}

function extractPuzzleQuestion(html) {
    // GFG structure: The puzzle question is usually in the first significant paragraph
    // Look for text that describes the problem (often contains "?")
    
    // Try to find paragraphs with actual question content
    const pMatches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    
    for (const pTag of pMatches) {
        const text = pTag.replace(/<[^>]+>/g, '').trim();
        // Skip short or generic text
        if (text.length < 80) continue;
        if (text.includes('GeeksforGeeks') || text.includes('educational platform')) continue;
        if (text.includes('Asked in') || text.includes('Similar Reads')) continue;
        
        // Good candidate if it contains question words or problem description
        if (text.includes('?') || text.includes('find') || text.includes('determine') || 
            text.includes('how') || text.includes('what') || text.includes('want')) {
            return text.substring(0, 800); // Limit length
        }
    }
    
    // Fallback: Look for content after "Problem" or similar headers
    const problemMatch = html.match(/Problem[:\s]*<\/[^>]+>\s*<p[^>]*>([\s\S]*?)<\/p>/i);
    if (problemMatch) {
        return problemMatch[1].replace(/<[^>]+>/g, '').trim().substring(0, 800);
    }
    
    return null;
}

console.log("Loading topics.js...");
let topicsContent = fs.readFileSync(TOPICS_PATH, 'utf8');
const topicsClean = topicsContent.replace('export const topics =', 'const topics =');
const topics = eval(topicsClean + "; topics;");
const marathonTopic = topics.find(t => t.id === 0);

let updatedCount = 0;

for (const [idStr, url] of Object.entries(puzzleUrls)) {
    const id = parseInt(idStr);
    const puzzle = marathonTopic.puzzles.find(p => p.id === id);
    
    if (!puzzle) {
        console.log(`Puzzle ${id} not found, skipping.`);
        continue;
    }
    
    console.log(`Fetching question for: ${puzzle.title}`);
    const html = fetchContent(url);
    if (!html) {
        console.log(`   -> Failed to fetch`);
        continue;
    }
    
    const question = extractPuzzleQuestion(html);
    if (question && question.length > 80) {
        puzzle.question = question;
        console.log(`   -> Updated: "${question.substring(0, 60)}..."`);
        updatedCount++;
    } else {
        console.log(`   -> Could not extract proper question`);
    }
}

if (updatedCount > 0) {
    // Serialize back
    const newContent = 'export const topics = ' + JSON.stringify(topics, null, 2)
        .replace(/"([^"]+)":/g, '$1:');
    
    fs.writeFileSync(TOPICS_PATH, newContent);
    console.log(`\nUpdated ${updatedCount} puzzle questions.`);
}
