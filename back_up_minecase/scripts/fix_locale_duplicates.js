/**
 * Fix duplicate keys in locale JSON files
 * 
 * The locale files have duplicate top-level keys (settings, auth) that need to be merged.
 * JSON.parse loses the first value, keeping only the last. We need to manually merge them.
 */

const fs = require('fs');

function extractAllObjects(content, topKey) {
    // Find all instances of `"topKey": {` and extract the objects
    const regex = new RegExp(`"${topKey}"\\s*:\\s*\\{`, 'g');
    const instances = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
        const startIdx = match.index + match[0].length - 1; // Position of opening {
        let depth = 1;
        let endIdx = startIdx + 1;
        
        while (depth > 0 && endIdx < content.length) {
            if (content[endIdx] === '{') depth++;
            if (content[endIdx] === '}') depth--;
            endIdx++;
        }
        
        const objectStr = content.substring(startIdx, endIdx);
        try {
            instances.push({
                start: match.index,
                end: endIdx,
                fullMatch: content.substring(match.index, endIdx),
                data: JSON.parse(objectStr)
            });
        } catch (e) {
            console.error(`Failed to parse ${topKey} at position ${match.index}:`, e.message);
        }
    }
    
    return instances;
}

function fixLocaleFile(filePath) {
    console.log(`\nProcessing ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check for duplicates in settings and auth
    const keysToCheck = ['settings', 'auth'];
    
    for (const key of keysToCheck) {
        const instances = extractAllObjects(content, key);
        
        if (instances.length > 1) {
            console.log(`  Found ${instances.length} "${key}" objects - merging...`);
            
            // Merge all instances into one
            let merged = {};
            for (const inst of instances) {
                merged = { ...merged, ...inst.data };
            }
            
            console.log(`  Merged ${key} has ${Object.keys(merged).length} keys`);
            
            // Replace all but the first instance
            // We'll keep the first one and remove the others, then update the first
            for (let i = instances.length - 1; i >= 1; i--) {
                const inst = instances[i];
                // Find if there's a comma before this instance
                let removeStart = inst.start;
                let removeEnd = inst.end;
                
                // Check for trailing comma after the closing brace
                let afterContent = content.substring(removeEnd);
                if (afterContent.match(/^\s*,/)) {
                    removeEnd += afterContent.match(/^\s*,/)[0].length;
                }
                
                // Check for leading comma/whitespace
                let beforeContent = content.substring(0, removeStart);
                let leadingMatch = beforeContent.match(/,\s*$/);
                if (leadingMatch) {
                    removeStart -= leadingMatch[0].length;
                }
                
                content = content.substring(0, removeStart) + content.substring(removeEnd);
                console.log(`  Removed duplicate ${key} object`);
            }
            
            // Now update the first instance with merged data
            const firstInst = extractAllObjects(content, key)[0];
            if (firstInst) {
                const mergedStr = JSON.stringify(merged, null, 4).replace(/\n/g, '\r\n');
                content = content.substring(0, firstInst.start) + 
                          `"${key}": ` + mergedStr +
                          content.substring(firstInst.end);
                console.log(`  Updated first ${key} object with merged content`);
            }
        } else {
            console.log(`  "${key}" OK (only 1 instance)`);
        }
    }
    
    // Validate final JSON
    try {
        JSON.parse(content);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✓ Saved and validated`);
    } catch (e) {
        console.error(`  ✗ Final validation failed:`, e.message);
        // Write to a .fixed file for debugging
        fs.writeFileSync(filePath + '.fixed', content, 'utf8');
        console.log(`  Wrote to ${filePath}.fixed for debugging`);
    }
}

// Fix both locale files
fixLocaleFile('locales/en.json');
fixLocaleFile('locales/es.json');
console.log('\nDone!');
