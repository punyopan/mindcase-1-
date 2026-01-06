const db = require('./src/db');

async function cleanup() {
    // Get the latest session per user
    const latest = await db.query(`
        SELECT DISTINCT ON (user_id) id 
        FROM t_refresh_tokens 
        WHERE revoked = FALSE 
          AND replaced_by_token_id IS NULL 
        ORDER BY user_id, created_at DESC
    `);
    
    const keepIds = latest.rows.map(r => r.id);
    console.log('Keeping', keepIds.length, 'sessions (one per user)');
    
    if (keepIds.length > 0) {
        // Delete all except the latest per user
        const result = await db.query(
            `DELETE FROM t_refresh_tokens WHERE id != ALL($1::uuid[])`,
            [keepIds]
        );
        console.log('Deleted', result.rowCount, 'stale sessions');
    }
    
    const remaining = await db.query('SELECT COUNT(*) FROM t_refresh_tokens');
    console.log('Remaining:', remaining.rows[0].count);
    
    process.exit(0);
}

cleanup().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
