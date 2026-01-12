/**
 * Merge duplicate keys in locale JSON files
 */
const fs = require('fs');

function parseWithDuplicates(content) {
    const result = {};
    const base = JSON.parse(content);
    
    // Find all top-level keys and their positions
    const regex = /^  "([^"]+)"\s*:\s*\{/gm;
    let match;
    const keyPositions = {};
    
    while ((match = regex.exec(content)) !== null) {
        const key = match[1];
        if (!keyPositions[key]) keyPositions[key] = [];
        keyPositions[key].push(match.index);
    }
    
    // For each key with multiple occurrences, merge their contents
    for (const key of Object.keys(keyPositions)) {
        if (keyPositions[key].length > 1) {
            console.log('  Merging duplicate key: ' + key + ' (' + keyPositions[key].length + ' occurrences)');
            
            let merged = {};
            for (const pos of keyPositions[key]) {
                const objStart = content.indexOf('{', pos);
                let depth = 1;
                let objEnd = objStart + 1;
                while (depth > 0 && objEnd < content.length) {
                    if (content[objEnd] === '{') depth++;
                    if (content[objEnd] === '}') depth--;
                    objEnd++;
                }
                const objStr = content.substring(objStart, objEnd);
                try {
                    const obj = JSON.parse(objStr);
                    merged = { ...merged, ...obj };
                    console.log('    Added ' + Object.keys(obj).length + ' keys from occurrence at pos ' + pos);
                } catch (e) {
                    console.error('    Failed to parse at ' + pos + ': ' + e.message);
                }
            }
            result[key] = merged;
            console.log('    Total: ' + Object.keys(merged).length + ' keys');
        } else {
            result[key] = base[key];
        }
    }
    
    // Add any keys not in our scan
    for (const key of Object.keys(base)) {
        if (!result[key]) result[key] = base[key];
    }
    
    return result;
}

['locales/en.json', 'locales/es.json'].forEach(file => {
    console.log('Processing ' + file);
    const content = fs.readFileSync(file, 'utf8');
    const merged = parseWithDuplicates(content);
    fs.writeFileSync(file, JSON.stringify(merged, null, 2));
    console.log('Saved with ' + Object.keys(merged).length + ' keys\n');
});
