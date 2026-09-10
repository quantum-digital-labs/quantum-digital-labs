import { Pool } from 'pg';
import { env, isDatabaseConfigured } from '../config/env';

/**
 * PostgreSQL pool placeholder.
 * Connection is intentionally deferred — set DATABASE_URL and call
 * `connectDatabase()` in the next step when you are ready.
 */
let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    throw new Error(
      'PostgreSQL pool is not initialized. Call connectDatabase() after DATABASE_URL is set.',
    );
  }
  return pool;
}

export function isDatabaseConnected(): boolean {
  return pool !== null;
}

export async function connectDatabase(): Promise<void> {
  if (!isDatabaseConfigured || !env.DATABASE_URL) {
    console.warn(
      '[db] DATABASE_URL not set — API routes that need persistence will return 503.',
    );
    return;
  }

  if (pool) {
    return;
  }

  pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  await pool.query('SELECT 1');
  console.log('[db] PostgreSQL connected');
}

export async function disconnectDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
