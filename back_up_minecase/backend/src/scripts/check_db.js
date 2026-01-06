const db = require('../db');

async function checkSchema() {
    try {
        console.log('🔍 Checking database tables...');
        const tables = await db.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('Tables found:', tables.rows.map(r => r.table_name));

        for (const row of tables.rows) {
            const table = row.table_name;
            const columns = await db.query(`
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns 
                WHERE table_name = $1
            `, [table]);
            console.log(`\n📋 Table: ${table}`);
            columns.rows.forEach(c => {
                console.log(`   - ${c.column_name} (${c.data_type}, ${c.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
            });
        }
    } catch (e) {
        console.error('Error:', e);
    } finally {
        process.exit();
    }
}

checkSchema();
