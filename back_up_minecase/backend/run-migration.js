/**
 * Simple migration runner script
 * Run with: node run-migration.js <migration-file>
 */
const fs = require('fs');
const path = require('path');
const db = require('./src/db');

async function runMigration(migrationFile) {
    try {
        const sqlPath = path.join(__dirname, 'migrations', migrationFile);
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        console.log(`Running migration: ${migrationFile}`);
        await db.query(sql);
        console.log('Migration completed successfully!');
        
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
}

const migrationFile = process.argv[2];
if (!migrationFile) {
    console.log('Usage: node run-migration.js <migration-file>');
    console.log('Example: node run-migration.js init_login_history.sql');
    process.exit(1);
}

runMigration(migrationFile);
