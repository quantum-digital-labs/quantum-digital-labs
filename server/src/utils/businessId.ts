import type { Pool } from 'pg';

type CounterName = 'job' | 'internship' | 'project' | 'portfolio' | 'blog';

const PREFIX: Record<CounterName, string> = {
  job: 'QDLJB',
  internship: 'QDLIN',
  project: 'QDLPJ',
  portfolio: 'QDLPF',
  blog: 'QDLBL',
};

/**
 * Atomically allocate the next business id:
 * jobs → QDLJB-0001, internships → QDLIN-0001, projects → QDLPJ-0001,
 * portfolio → QDLPF-0001, blog → QDLBL-0001
 */
export async function nextBusinessId(
  pool: Pool,
  kind: CounterName,
): Promise<string> {
  await pool.query(
    `INSERT INTO id_counters (name, last_value)
     VALUES ($1, 0)
     ON CONFLICT (name) DO NOTHING`,
    [kind],
  );

  const result = await pool.query<{ last_value: number }>(
    `UPDATE id_counters
     SET last_value = last_value + 1
     WHERE name = $1
     RETURNING last_value`,
    [kind],
  );

  const value = result.rows[0]?.last_value;
  if (!value) {
    throw new Error(`Failed to allocate ${kind} id`);
  }

  return `${PREFIX[kind]}-${String(value).padStart(4, '0')}`;
}

/** Align counters with the highest existing business id already in the DB. */
export async function syncBusinessIdCounters(pool: Pool): Promise<void> {
  await pool.query(
    `INSERT INTO id_counters (name, last_value)
     VALUES ('job', 0), ('internship', 0), ('project', 0), ('portfolio', 0), ('blog', 0)
     ON CONFLICT (name) DO NOTHING`,
  );

  await pool.query(`
    UPDATE id_counters
    SET last_value = GREATEST(
      id_counters.last_value,
      COALESCE((
        SELECT MAX(NULLIF(regexp_replace(id, '^QDLJB-', ''), '')::INT)
        FROM jobs
        WHERE id ~ '^QDLJB-[0-9]+$'
      ), 0)
    )
    WHERE name = 'job'
  `);

  await pool.query(`
    UPDATE id_counters
    SET last_value = GREATEST(
      id_counters.last_value,
      COALESCE((
        SELECT MAX(NULLIF(regexp_replace(id, '^QDLIN-', ''), '')::INT)
        FROM internships
        WHERE id ~ '^QDLIN-[0-9]+$'
      ), 0)
    )
    WHERE name = 'internship'
  `);

  await pool.query(`
    UPDATE id_counters
    SET last_value = GREATEST(
      id_counters.last_value,
      COALESCE((
        SELECT MAX(NULLIF(regexp_replace(id, '^QDLPJ-', ''), '')::INT)
        FROM projects
        WHERE id ~ '^QDLPJ-[0-9]+$'
      ), 0)
    )
    WHERE name = 'project'
  `);

  await pool.query(`
    UPDATE id_counters
    SET last_value = GREATEST(
      id_counters.last_value,
      COALESCE((
        SELECT MAX(NULLIF(regexp_replace(id, '^QDLPF-', ''), '')::INT)
        FROM portfolio_items
        WHERE id ~ '^QDLPF-[0-9]+$'
      ), 0)
    )
    WHERE name = 'portfolio'
  `);

  await pool.query(`
    UPDATE id_counters
    SET last_value = GREATEST(
      id_counters.last_value,
      COALESCE((
        SELECT MAX(NULLIF(regexp_replace(id, '^QDLBL-', ''), '')::INT)
        FROM blog_posts
        WHERE id ~ '^QDLBL-[0-9]+$'
      ), 0)
    )
    WHERE name = 'blog'
  `);
}
