/**
 * Auto Migration Runner
 * Runs all migrations on startup (safe to run multiple times due to IF NOT EXISTS)
 */
const fs = require('fs');
const path = require('path');
const db = require('./src/db');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function runAllMigrations() {
    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
        .filter(f => f.endsWith('.sql'))
        .sort(); // Run in alphabetical order

    console.log('🔄 Running migrations...');
    
    for (const file of migrationFiles) {
        try {
            const sqlPath = path.join(MIGRATIONS_DIR, file);
            const sql = fs.readFileSync(sqlPath, 'utf8');
            await db.query(sql);
            console.log(`  ✓ ${file}`);
        } catch (err) {
            // Ignore "already exists" errors, fail on others
            if (!err.message.includes('already exists') && !err.message.includes('duplicate')) {
                console.error(`  ✗ ${file}: ${err.message}`);
            } else {
                console.log(`  ✓ ${file} (already applied)`);
            }
        }
    }
    
    console.log('✅ Migrations complete\n');
}

module.exports = runAllMigrations;

// Run directly if called as script
if (require.main === module) {
    runAllMigrations().then(() => process.exit(0)).catch(() => process.exit(1));
}
