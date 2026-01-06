const fs = require('fs');
const path = require('path');

const topicsPath = path.join(__dirname, '../data/topics.js');
let content = fs.readFileSync(topicsPath, 'utf8');

// Expanded map of corrupted chars to correct emojis
const replacements = {
     // Already fixed ones might still be needed if run on fresh buffer, but let's focus on missed ones
    '"âš–ï¸ "': '"⚖️"', // Scales (Legal)
    '"ðŸ‘ ï¸ "': '"👁️"', // Eye (Eyewitness)
    '"ðŸ  "': '"🏠"', // House (Smart Home)
    
    // Others seen in previous view that might have been missed or re-corrupted
    '"ðŸŒ "': '"🌍"', // Globe
    '"ðŸ ¥"': '"🏥"', // Hospital
    '"ðŸ¥¤"': '"🥤"', // Cup/Straw
    '"ðŸšœ"': '"🚜"', // Tractor
    '"ðŸ ·ï¸ "': '"🚗"', // Car
    '"ðŸŽ°"': '"🎰"', // Slot machine
    '"ðŸ¥—"': '"🥗"', // Salad
    '"ðŸ“‰"': '"📉"', // Chart down
    '"ðŸ—£ï¸ "': '"🗣️"', // Speaking head
    '"ðŸŒ¿"': '"🌿"', // Leaf
    '"ðŸŽ“"': '"🎓"', // Graduation cap
    '"ðŸ’¸"': '"💸"', // Money with wings
    '"ðŸ“ "': '"📄"', // Page
    '"ðŸ «"': '"🏫"', // School
    
    // Catch-alls for common patterns if specific string match fails
    // (Be careful with these global replacements)
};

let count = 0;
for (const [bad, good] of Object.entries(replacements)) {
    // Escape regex special chars if any (mostly quotes)
    const regex = new RegExp(bad, 'g');
    if (regex.test(content)) {
        content = content.replace(regex, good);
        count++;
    }
}

// Aggressive cleanup for any remaining "ðŸ" or "â" followed by garbage in icon fields
// Regex lookbehind/ahead for icon: "..." where ... contains bad chars
// JS regex doesn't support lookbehind well in all environments, so we match the line.
// pattern: icon: "[garbage]"
// We'll log them to be sure.

const badLines = content.match(/icon:\s*"[^"]*[ðâ][^"]*"/g);
if (badLines) {
    console.log("Still failing on lines:", badLines);
}

fs.writeFileSync(topicsPath, content);
console.log(`Replaced ${count} types of emoji corruption.`);
