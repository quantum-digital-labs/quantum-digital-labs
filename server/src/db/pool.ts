import { Pool, type PoolConfig } from 'pg';
import { env, isDatabaseConfigured } from '../config/env';

let pool: Pool | null = null;

export function createPoolConfig(connectionString: string): PoolConfig {
  const needsSsl =
    env.NODE_ENV === 'production' ||
    /sslmode=require|neon\.tech|supabase\.(co|com)/i.test(connectionString);

  return {
    connectionString,
    max: env.NODE_ENV === 'production' ? 1 : 10,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  };
}

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

  pool = new Pool(createPoolConfig(env.DATABASE_URL));

  await pool.query('SELECT 1');
  console.log('[db] PostgreSQL connected');
}

export async function disconnectDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
