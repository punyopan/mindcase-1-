const fs = require('fs');
const path = require('path');
const db = require('../db');

async function runMigrations() {
    console.log('🔄 Running Migrations...');
    
    const migrationsDir = path.join(__dirname, '../../migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));

    for (const file of files) {
        console.log(`📜 Executing ${file}...`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        try {
            await db.query(sql);
            console.log(`✅ ${file} completed.`);
        } catch (e) {
            console.error(`❌ Error in ${file}:`, e.message);
        }
    }
    
    console.log('✨ All migrations finished.');
    process.exit(0);
}

runMigrations();
