import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { env, isDatabaseConfigured } from '../config/env';
import { syncBusinessIdCounters } from '../utils/businessId';

async function migrate() {
  if (!isDatabaseConfigured || !env.DATABASE_URL) {
    console.error('[migrate] DATABASE_URL is not set in .env');
    process.exit(1);
  }

  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  const pool = new Pool({ connectionString: env.DATABASE_URL });

  try {
    console.log('[migrate] Applying schema to PostgreSQL...');
    await pool.query(sql);
    await syncBusinessIdCounters(pool);

    const tables = await pool.query<{
      table_name: string;
    }>(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.log('[migrate] Tables ready:');
    for (const row of tables.rows) {
      console.log(`  - ${row.table_name}`);
    }
    console.log('[migrate] Done.');
  } finally {
    await pool.end();
  }
}

migrate().catch((error) => {
  console.error('[migrate] Failed:', error);
  process.exit(1);
});
