const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Load Puzzles from Topics.js logic (robust eval)
const topicsPath = path.join(__dirname, '../data/topics.js');
let topicsContent = fs.readFileSync(topicsPath, 'utf8');

// Strip 'export ' to make it standard JS we can eval
topicsContent = topicsContent.replace('export const topics =', 'const topics =');
// We need to execute this string to get the 'topics' variable.
const topics = eval(topicsContent + "; topics;");

const marathonTopic = topics.find(t => t.id === 0);
if (!marathonTopic) {
    console.error("Could not find Riddle Marathon topic (id 0)");
    process.exit(1);
}

const puzzles = marathonTopic.puzzles;
const puzzlesDir = path.join(__dirname, '../puzzles');
// Generic placeholders to avoid
const BAD_SIZES = [12522, 2282, 13258, 4352, 5742, 20638];

function sleep(ms) {
    const start = Date.now();
    while (Date.now() - start < ms) {}
}

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
        if (BAD_SIZES.includes(stats.size)) {
            console.log(`[SKIP] Downloaded image at ${dest} matches generic size ${stats.size}`);
            fs.unlinkSync(dest);
            return false;
        }
        // Also check if it's very small (< 1KB) which might be a pixel
        if (stats.size < 1000) {
            console.log(`[SKIP] Image too small (${stats.size} bytes)`);
            fs.unlinkSync(dest);
            return false;
        }
        return true;
    } catch (e) {
        console.log(`[FAIL] Download failed for ${url}: ${e.message}`);
        return false;
    }
}

console.log(`Found ${puzzles.length} puzzles to process.`);

puzzles.forEach((p, index) => {
    // Throttle
    if (index > 0) sleep(1000); 

    const existingPathWebp = path.join(puzzlesDir, `puzzle_${p.id}.webp`);
    const existingPathPng = path.join(puzzlesDir, `puzzle_${p.id}.png`);
    const existingPathJpg = path.join(puzzlesDir, `puzzle_${p.id}.jpg`);
    
    // Check if we have a GOOD image locally
    let hasGoodImage = false;
    [existingPathWebp, existingPathPng, existingPathJpg].forEach(f => {
        if (fs.existsSync(f)) {
            const size = fs.statSync(f).size;
            if (!BAD_SIZES.includes(size) && size > 1000) {
                hasGoodImage = true;
            } else {
                console.log(`[CLEAN] Removing generic/bad image for ${p.id} (${size} bytes)`);
                fs.unlinkSync(f); // Delete bad image
            }
        }
    });

    if (hasGoodImage) {
        console.log(`[SKIP] Good image exists for ${p.id}: ${p.title}`);
        return;
    }

    console.log(`[PROCESS] Finding image for ${p.id}: ${p.title}`);

    // Manual Override for ID 100 (User Provided)
    if (p.id === 100) {
        const userUrl = "https://media.geeksforgeeks.org/wp-content/uploads/20250806161756545491/how_do_match_3_switches_to_3_light_bulbs_.webp";
        console.log(`[OVERRIDE] Using user provided URL for ${p.id}`);
        const dest = path.join(puzzlesDir, `puzzle_${p.id}.webp`);
        if (downloadImage(userUrl, dest)) {
            console.log(`[SUCCESS] Saved override ${dest}`);
            return;
        }
    }

    // Strategy: Search GFG
    const query = p.title.replace(/\s+/g, '+');
    const searchUrl = `https://www.geeksforgeeks.org/?s=${query}`;
    const searchPage = fetchContent(searchUrl);

    // Filter link matches
    const linkMatch = searchPage.match(/href="(https:\/\/www\.geeksforgeeks\.org\/[^"]+)"/g);
    
    let articleUrl = null;
    if (linkMatch) {
         for (const l of linkMatch) {
             const cleanLink = l.replace('href="', '').replace('"', '');
             // Stricter filtering for valid articles
             if (cleanLink.includes('puzzle') || 
                 cleanLink.includes(p.title.split(' ')[0].toLowerCase()) ||
                 cleanLink.includes('solution') ||
                 cleanLink.includes('answer') ||
                 cleanLink.includes('problem')) {
                 if (!cleanLink.includes('/user/') && 
                     !cleanLink.includes('/tag/') && 
                     !cleanLink.includes('/category/') &&
                     !cleanLink.includes('?') &&
                     !cleanLink.includes('courses') && 
                     !cleanLink.includes('jobs')) {
                    articleUrl = cleanLink;
                    break;
                 }
             }
         }
    }
    
    // Fallback: Try constructing URL if search failed (Puzzle 100 special case e.g.)
    // User URL: how_do_match_3_switches_to_3_light_bulbs_
    // That looks like a "clean" version of title.
    if (!articleUrl && p.id === 100) {
        // Just cheat for the one user complained about if search failed
        // But search should find it "puzzle 3 bulbs..."
    }

    if (!articleUrl) {
        console.log(`[WARN] No article found for ${p.id}`);
        return;
    }

    console.log(`[FOUND] Article: ${articleUrl} for puzzle ${p.id}`);
    const articleContent = fetchContent(articleUrl);
    
    // Grabbing candidate images
    const imgMatches = articleContent.match(/src="(https:\/\/[^"]+\.(png|jpg|jpeg|webp|gif))"/g);
    
    if (imgMatches) {
        const candidates = imgMatches
            .map(s => s.replace('src="', '').replace('"', ''))
            .filter(url => 
                !url.includes('logo') && 
                !url.includes('avatar') && 
                !url.includes('ad-') &&
                !url.includes('icon') &&
                !url.includes('button') &&
                !url.includes('badge') &&
                !url.includes('captcha') &&
                url.includes('uploads')
            );
            
        let success = false;
        for (const imgUrl of candidates) {
             const ext = path.extname(imgUrl) || '.png';
             const dest = path.join(puzzlesDir, `puzzle_${p.id}${ext}`);
             
             console.log(`[TRY] Downloading candidate: ${imgUrl}`);
             if (downloadImage(imgUrl, dest)) {
                 console.log(`[SUCCESS] Saved ${dest}`);
                 success = true;
                 break;
             }
        }
        
        if (!success) {
             console.log(`[FAIL] No valid non-generic images found in article for ${p.id}`);
        }
    } else {
         console.log(`[FAIL] No images found in article content for ${p.id}`);
    }
});

console.log("Processing complete.");
