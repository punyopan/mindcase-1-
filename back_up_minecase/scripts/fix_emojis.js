const fs = require('fs');
const path = require('path');

const topicsPath = path.join(__dirname, '../data/topics.js');
let content = fs.readFileSync(topicsPath, 'utf8');

// Map of corrupted chars to likely intended emojis based on context/title
const replacements = {
    // School Mysteries
    '"ðŸ «"': '"🏫"', // School
    '"ðŸ’°"': '"💰"', // Money bag
    '"ðŸ“ "': '"📄"', // Paper/Essay
    '"ðŸ“Š"': '"📊"', // Chart/Graph
    '"ðŸ’¸"': '"💸"', // Money with wings
    '"ðŸŽ“"': '"🎓"', // Graduation cap
    
    // Digital Deception
    '"ðŸ“±"': '"📱"', // Mobile phone
    '"ðŸ“ˆ"': '"📈"', // Chart increasing
    '"ðŸŽ­"': '"🎬"', // Clapper board / Video
    '"â­ "': '"⭐"',  // Star
    '"ðŸ’¬"': '"💬"', // Speech balloon (comment)
    '"ðŸ”„"': '"🔄"', // Refresh / Loop (algorithm)
    
    // Workplace Whodunit
    '"ðŸ’¼"': '"💼"', // Briefcase
    '"ðŸ‘¥"': '"👥"', // People (team)
    '"â °"': '"⏰"',  // Clock (meeting)
    '"ðŸ¤–"': '"🤖"', // Robot (AI)
    
    // Health & Headlines
    '"ðŸ ¥"': '"🏥"', // Hospital
    '"ðŸ©º"': '"🩺"', // Stethoscope
    '"ðŸ’‰"': '"💉"', // Syringe
    '"ðŸ¥—"': '"🥗"', // Salad/Food (diet)
    '"ðŸ“‰"': '"📉"', // Chart decreasing (or health chart?)
    '"ðŸ—£ï¸ "': '"🗣️"', // Speaking head
    '"ðŸŒ¿"': '"🌿"', // Herb/Leaf (natural)

    // Money Mysteries
    '"ðŸ ·ï¸ "': '"🚗"', // Car (deal) - guess based on title
    '"ðŸŽ°"': '"🎰"', // Slot machine (course/gambling?) or just standard Money
    '"ðŸ  "': '"🏠"', // House
    
    // Environmental Science
    '"ðŸŒ "': '"🌍"', // Globe
    '"â „ï¸ "': '"❄️"', // Snowflake
    '"â™»ï¸ "': '"♻️"', // Recycle
    '"ðŸ ¢"': '"🏢"', // Office building (corporate)
    '"ðŸ¥¤"': '"🥤"', // Cup with straw (plastic straw)
    '"ðŸšœ"': '"🚜"', // Tractor (local food)
    
    // Legal & Justice
    '"âš–ï¸ "': '"⚖️"', // Scales
    '"ðŸ‘ ï¸ "': '"👁️"', // Eye
    '"ðŸ”’"': '"🔒"', // Lock
    '"ðŸ’£"': '"💣"', // Bomb
    
    // Technology & Privacy
    '"ðŸ” "': '"🔍"', // Magnifying glass / Search
    '"ðŸŽ¯"': '"🎯"', // Bullseye (personalized)
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

// Check for remaining unreplaced weirdness
const remaining = content.match(/ðŸ[^\s"]+/g);
if (remaining) {
    console.log("Warning: Remaining potentially bad sequences:", remaining);
}

fs.writeFileSync(topicsPath, content);
console.log(`Replaced ${count} types of emoji corruption.`);
