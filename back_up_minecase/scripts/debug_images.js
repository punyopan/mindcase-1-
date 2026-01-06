const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load topics to get URLs (we need to re-derive them or hardcode for test)
// I'll hardcode the titles to search index or just use the scrape_gfg_index logic again to get URL
const INDEX_URL = "https://www.geeksforgeeks.org/aptitude/top-100-puzzles-asked-in-interviews/";

function fetchContent(url) {
    try {
        return execSync(`curl -L -s -A "Mozilla/5.0" "${url}"`).toString();
    } catch (e) {
        return "";
    }
}

const indexHtml = fetchContent(INDEX_URL);
const puzzlesToCheck = [
    {id: 160, title: "Burning Island Escape"},
    {id: 164, title: "Coin Triplets"} // Title might be different in GFG list
];

puzzlesToCheck.forEach(p => {
    // Fuzzy find link
    const linkRegex = new RegExp(`<a href="([^"]+)"[^>]*>[^<]*${p.title.split(' ')[0]}[^<]*<\/a>`, 'i');
    const match = indexHtml.match(linkRegex) || indexHtml.match(new RegExp(`<a href="([^"]+)"[^>]*>.*?${p.title.split(' ')[1] || 'xxxxx'}.*?<\/a>`, 'i'));
    
    if (match) {
        const url = match[1];
        console.log(`Analyzing ${p.id} at ${url}`);
        const content = fetchContent(url);
        // Dump all imgs
        const imgs = content.match(/src="[^"]+"/g) || [];
        imgs.forEach(img => console.log(`   [${p.id}] Found: ${img}`));
    } else {
        console.log(`Could not find link for ${p.title}`);
    }
});
