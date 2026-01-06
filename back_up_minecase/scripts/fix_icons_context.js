const fs = require('fs');
const path = require('path');

const topicsPath = path.join(__dirname, '../data/topics.js');
let content = fs.readFileSync(topicsPath, 'utf8');

// Map names/titles to desired icons
const iconMap = {
    // Topics
    'name: "Riddle Marathon"': 'icon: "🧩"',
    'name: "School Mysteries"': 'icon: "🏫"',
    'name: "Digital Deception"': 'icon: "📱"',
    'name: "Workplace Whodunit"': 'icon: "💼"',
    'name: "Health & Headlines"': 'icon: "🔬"',
    'name: "Money Mysteries"': 'icon: "💰"',
    'name: "Health & Wellness"': 'icon: "🏥"',
    'name: "Environmental Science"': 'icon: "🌍"',
    'name: "Legal & Justice"': 'icon: "⚖️"',
    'name: "Technology & Privacy"': 'icon: "🔍"',

    // Puzzles (by title)
    'title: "The 3 Bulbs & 3 Switches"': 'icon: "💡"',
    'title: "The Missing Money"': 'icon: "💰"',
    'title: "The Identical Essays"': 'icon: "📄"', // Page facing up
    'title: "The Back Row Pattern"': 'icon: "📊"',
    'title: "The Budget Crisis"': 'icon: "💸"', // Money with wings
    'title: "The Wonder Method"': 'icon: "🎓"',
    'title: "The Viral Statistic"': 'icon: "📈"',
    'title: "The Principal Video"': 'icon: "🎬"', // Clapper board
    'title: "The Expert Influencer"': 'icon: "⭐"',
    'title: "The Comment Consensus"': 'icon: "💬"',
    'title: "The Algorithm Echo"': 'icon: "🔄"',
    'title: "The Remote Work Blame"': 'icon: "👥"', // Busts in silhouette
    'title: "The Promotion Puzzle"': 'icon: "📈"',
    'title: "The Meeting Paradox"': 'icon: "⏰"',
    'title: "The AI Vendor Pitch"': 'icon: "🤖"',
    'title: "The Survey Trap"': 'icon: "📊"',
    'title: "The Miracle Supplement"': 'icon: "💊"', // Pill
    'title: "The Diet Debate"': 'icon: "🥗"',
    'title: "The Breakfast Study"': 'icon: "📉"',
    'title: "The Success Stories"': 'icon: "🗣️"', // Speaking head
    'title: "The Natural Label"': 'icon: "🌿"',
    'title: "The Hot Stock Tip"': 'icon: "📈"',
    'title: "The Course Dilemma"': 'icon: "🎰"', // Slot machine
    'title: "The Car Deal"': 'icon: "🚗"',
    'title: "The Tech Portfolio"': 'icon: "📊"',
    'title: "The Raise Decision"': 'icon: "🏠"',
    'title: "The Screening Test Paradox"': 'icon: "🩺"',
    'title: "The Vaccination Correlation"': 'icon: "💉"',
    'title: "The Celebrity Cure"': 'icon: "⭐"',
    'title: "The Painkiller Study"': 'icon: "💊"',
    'title: "The Fitness Tracker Fallacy"': 'icon: "⌚"', // Watch
    'title: "The Cold Winter Argument"': 'icon: "❄️"',
    'title: "The Recycling Contradiction"': 'icon: "♻️"',
    'title: "The Corporate Pledge"': 'icon: "🏢"', // Office building
    'title: "The Plastic Straw Ban"': 'icon: "🥤"',
    'title: "The Local Food Movement"': 'icon: "🚜"',
    'title: "The Eyewitness Confidence"': 'icon: "👁️"',
    'title: "The Recidivism Algorithm"': 'icon: "🤖"',
    'title: "The Plea Bargain Pressure"': 'icon: "⚖️"',
    'title: "The Tough-on-Crime Law"': 'icon: "🔒"',
    'title: "The Torture Ticking Bomb"': 'icon: "💣"',
    'title: "The Free App Deal"': 'icon: "📱"',
    'title: "The Smart Home Hack"': 'icon: "🏠"',
    'title: "The Encrypted Message Debate"': 'icon: "🔒"',
    'title: "The Personalized Feed"': 'icon: "🎯"',
    'title: "The Deepfake Evidence"': 'icon: "🎬"'
};

// We process the file line by line? No, multi-line context is needed.
// Regex approach: Find "title: ...", then look for "icon: ..." shortly after.
// Since the structure is consistent (icon usually follows title immediately), we can use a small window.

let modified = content;

for (const [key, value] of Object.entries(iconMap)) {
    // Escape the key for regex
    const namePart = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Regex matches the name/title, followed by any whitespace/newlines/commas, then "icon": "..."
    // We capture specific structure: 
    // key,
    // [whitespace]
    // icon: "..." 
    
    const regex = new RegExp(`(${namePart}[\\s\\S]*?)icon:\\s*"[^"]*"`, 'g');
    
    if (regex.test(modified)) {
        modified = modified.replace(regex, `$1${value}`);
    } else {
        console.log(`Warning: Could not match context for [${key}]`);
    }
}

fs.writeFileSync(topicsPath, modified);
console.log("Context-based icon replacement complete.");
