const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const INDEX_URL = "https://www.geeksforgeeks.org/aptitude/top-100-puzzles-asked-in-interviews/";
const BAD_SIZES = [12522, 2282, 13258, 4352, 5742, 20638];

// 1. Helpers
function fetchContent(url) {
    try {
        return execSync(`curl -L -s -A "Mozilla/5.0" "${url}"`).toString();
    } catch (e) {
        return "";
    }
}

function downloadImage(url, dest) {
    try {
        execSync(`curl -L -s -A "Mozilla/5.0" -o "${dest}" "${url}"`);
        const stats = fs.statSync(dest);
        if (BAD_SIZES.includes(stats.size) || stats.size < 1000) {
            console.log(`[SKIP] Bad size ${stats.size} for ${dest}`);
            fs.unlinkSync(dest);
            return false;
        }
        return true;
    } catch (e) {
        console.log(`[FAIL] Download failed: ${e.message}`);
        return false;
    }
}

// 2. Load Local Puzzles
const topicsPath = path.join(__dirname, '../data/topics.js');
let topicsContent = fs.readFileSync(topicsPath, 'utf8');
const topicsClean = topicsContent.replace('export const topics =', 'const topics =');
const topics = eval(topicsClean + "; topics;");
const marathonPuzzles = topics.find(t => t.id === 0).puzzles;

// 3. Parse Index Page
console.log(`Fetching Index: ${INDEX_URL}`);
const indexHtml = fetchContent(INDEX_URL);

// Extract links roughly: <a href="...">Title</a>
// We'll create a map of normalized title -> url
const gfgPuzzles = [];
const linkRegex = /<a href="(https:\/\/www\.geeksforgeeks\.org\/[^"]+)"[^>]*>([^<]+)<\/a>/g;
let match;
while ((match = linkRegex.exec(indexHtml)) !== null) {
    const url = match[1];
    const text = match[2].trim();
    // Filter out some garbage links
    if (url.includes('/aptitude/') || url.includes('puzzle')) {
        gfgPuzzles.push({ title: text, url: url });
    }
}
console.log(`Found ${gfgPuzzles.length} puzzles in GFG Index.`);

// 4. Fuzzy Match & Process
const updates = {};
const puzzlesDir = path.join(__dirname, '../puzzles');

function normalize(str) {
    return str.toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .replace('puzzle', '')
        .replace('problem', '');
}

marathonPuzzles.forEach((p, idx) => {
    // Basic fuzzy match
    const pTitleNorm = normalize(p.title);
    
    // Find best match in GFG list
    const bestMatch = gfgPuzzles.find(g => {
        const gTitleNorm = normalize(g.title);
        return gTitleNorm.includes(pTitleNorm) || pTitleNorm.includes(gTitleNorm);
    });

    if (bestMatch) {
        console.log(`[MATCH] ${p.id}: "${p.title}" -> "${bestMatch.title}"`);
        
        // Check if we already have a valid image?
        // Actually, user wants us to USE this source, so let's check/re-download if generic.
        // But for time, only download if we don't have a good one OR if we suspect current is bad.
        // Let's enforce the new source check.
        
        const destBase = path.join(puzzlesDir, `puzzle_${p.id}`);
        // If file exists and > 25KB, assume it's good (maybe from manual fix)
        // Except user specifically said "use this source", implies current ones might be wrong.
        // But re-downloading 60 images takes time.
        // Let's do it if size is in suspicious range (around 20KB or <15KB)
        /*
        let existingSize = 0;
        if (fs.existsSync(destBase + '.webp')) existingSize = fs.statSync(destBase + '.webp').size;
        else if (fs.existsSync(destBase + '.png')) existingSize = fs.statSync(destBase + '.png').size;
        
        if (existingSize > 25000) {
            console.log(`   -> Skipping, already have robust image (${existingSize}b)`);
            return;
        }
        */

        // Visit article
        try {
            // throttle
            const start = Date.now();
            while(Date.now() - start < 1000){};

            const artContent = fetchContent(bestMatch.url);
            // Extract images
            const imgMatches = artContent.match(/src="(https:\/\/[^"]+\.(png|jpg|jpeg|webp|gif))"/g);
            if (imgMatches) {
                 const candidates = imgMatches
                    .map(s => s.replace('src="', '').replace('"', ''))
                    .filter(url => 
                        !url.includes('logo') && 
                        !url.includes('avatar') && 
                        !url.includes('ad-') &&
                        !url.includes('icon') &&
                        !url.includes('gravatar') &&
                        url.includes('uploads')
                    );
                
                if (candidates.length > 0) {
                    // Usually first upload is the diagram
                    const imgUrl = candidates[0];
                    const ext = path.extname(imgUrl) || '.png';
                    const localPath = `puzzles/puzzle_${p.id}${ext}`;
                    const fullDest = path.join(puzzlesDir, `puzzle_${p.id}${ext}`);
                    
                    console.log(`   -> Downloading ${imgUrl}`);
                    if (downloadImage(imgUrl, fullDest)) {
                        updates[p.id] = localPath;
                    }
                }
            }
        } catch (e) {
            console.log(`   -> Error processing ${bestMatch.url}`);
        }

    } else {
        console.log(`[NO_MATCH] ${p.id}: "${p.title}"`);
    }
});

// 5. Update Topics.js
console.log("Updating topics.js...");
let contentToUpdate = fs.readFileSync(topicsPath, 'utf8');
let count = 0;
Object.keys(updates).forEach(id => {
    const newPath = updates[id];
    // Regex replace
    const regex = new RegExp(`(id:\\s*${id},[\\s\\S]*?image:\\s*")([^"]+)(")`);
    if (regex.test(contentToUpdate)) {
        contentToUpdate = contentToUpdate.replace(regex, `$1${newPath}$3`);
        count++;
    }
});
fs.writeFileSync(topicsPath, contentToUpdate);
console.log(`Updated ${count} puzzles in topics.js`);
