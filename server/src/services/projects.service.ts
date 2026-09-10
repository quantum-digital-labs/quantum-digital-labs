import { getPool } from '../db/pool';
import { AppError } from '../utils/AppError';
import { nextBusinessId } from '../utils/businessId';
import { DEFAULT_PROJECT_COVER, DEFAULT_PROJECT_SCREENSHOT, resolveCoverImage } from '../middleware/upload';
import {
  asStringArray,
  isUniqueViolation,
  type JsonObject,
} from '../utils/cmsHelpers';

function resolveScreenshots(value: unknown): string[] {
  const list = asStringArray(value).filter((item) => isScreenshotUrl(item));
  return list.length > 0 ? list : [DEFAULT_PROJECT_SCREENSHOT];
}

function isScreenshotUrl(value: string): boolean {
  const trimmed = value.trim();
  return (
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/')
  );
}

interface ProjectRow {
  id: string;
  uuid?: string;
  title: string;
  published: boolean;
  category: string;
  client_type: string;
  timeline: string;
  status: string;
  overview: string;
  problem: string;
  solution: string;
  technologies: string[] | null;
  features: string[] | null;
  deliverables: string[] | null;
  results: string[] | null;
  screenshots: string[] | null;
  related_ids: string[] | null;
  image: string | null;
}

const PROJECT_SELECT = `
  id, uuid::text AS uuid, title, published,
  category, client_type, timeline, status,
  overview, problem, solution,
  technologies, features, deliverables, results, screenshots, related_ids,
  image
`;

function mapProjectRow(row: ProjectRow): JsonObject {
  return {
    id: row.id,
    uuid: row.uuid,
    title: row.title,
    published: row.published,
    category: row.category ?? '',
    clientType: row.client_type ?? '',
    timeline: row.timeline ?? '',
    status: row.status ?? '',
    overview: row.overview ?? '',
    problem: row.problem ?? '',
    solution: row.solution ?? '',
    technologies: row.technologies ?? [],
    features: row.features ?? [],
    deliverables: row.deliverables ?? [],
    results: row.results ?? [],
    screenshots: resolveScreenshots(row.screenshots),
    relatedIds: row.related_ids ?? [],
    image: resolveCoverImage(row.image, DEFAULT_PROJECT_COVER),
  };
}

export async function listProjects(
  options: { includeUnpublished?: boolean } = {},
): Promise<JsonObject[]> {
  const pool = getPool();
  const result = options.includeUnpublished
    ? await pool.query<ProjectRow>(
        `SELECT ${PROJECT_SELECT} FROM projects ORDER BY updated_at DESC`,
      )
    : await pool.query<ProjectRow>(
        `SELECT ${PROJECT_SELECT} FROM projects WHERE published = TRUE ORDER BY updated_at DESC`,
      );
  return result.rows.map(mapProjectRow);
}

export async function getProjectById(
  id: string,
  options: { includeUnpublished?: boolean } = {},
): Promise<JsonObject> {
  const pool = getPool();
  const result = await pool.query<ProjectRow>(
    `SELECT ${PROJECT_SELECT} FROM projects WHERE id = $1`,
    [id],
  );
  const row = result.rows[0];
  if (!row || (!row.published && !options.includeUnpublished)) {
    throw new AppError('Not found', 404);
  }
  return mapProjectRow(row);
}

export async function createProject(body: JsonObject): Promise<JsonObject> {
  const pool = getPool();
  const id = await nextBusinessId(pool, 'project');
  const title = String(body.title ?? id);
  const published = body.published !== false;

  try {
    const result = await pool.query<ProjectRow>(
      `INSERT INTO projects (
         id, title, published, data, uuid,
         category, client_type, timeline, status,
         overview, problem, solution,
         technologies, features, deliverables, results, screenshots, related_ids,
         image
       ) VALUES (
         $1, $2, $3, '{}'::jsonb, gen_random_uuid(),
         $4, $5, $6, $7,
         $8, $9, $10,
         $11, $12, $13, $14, $15, $16,
         $17
       )
       RETURNING ${PROJECT_SELECT}`,
      [
        id,
        title,
        published,
        String(body.category ?? ''),
        String(body.clientType ?? ''),
        String(body.timeline ?? ''),
        String(body.status ?? ''),
        String(body.overview ?? ''),
        String(body.problem ?? ''),
        String(body.solution ?? ''),
        asStringArray(body.technologies),
        asStringArray(body.features),
        asStringArray(body.deliverables),
        asStringArray(body.results),
        resolveScreenshots(body.screenshots),
        asStringArray(body.relatedIds),
        resolveCoverImage(body.image, DEFAULT_PROJECT_COVER),
      ],
    );
    return mapProjectRow(result.rows[0]!);
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new AppError('An item with this id already exists', 409);
    }
    throw error;
  }
}

export async function updateProject(
  id: string,
  body: JsonObject,
): Promise<JsonObject> {
  const pool = getPool();
  const existing = await pool.query<ProjectRow>(
    `SELECT ${PROJECT_SELECT} FROM projects WHERE id = $1`,
    [id],
  );
  const row = existing.rows[0];
  if (!row) throw new AppError('Not found', 404);

  const title = String(body.title ?? row.title);
  const published =
    typeof body.published === 'boolean' ? body.published : row.published;

  const result = await pool.query<ProjectRow>(
    `UPDATE projects SET
       title = $2, published = $3, data = '{}'::jsonb,
       category = $4, client_type = $5, timeline = $6, status = $7,
       overview = $8, problem = $9, solution = $10,
       technologies = $11, features = $12, deliverables = $13,
       results = $14, screenshots = $15, related_ids = $16,
       image = $17,
       updated_at = NOW()
     WHERE id = $1
     RETURNING ${PROJECT_SELECT}`,
    [
      id,
      title,
      published,
      String(body.category ?? row.category ?? ''),
      String(body.clientType ?? row.client_type ?? ''),
      String(body.timeline ?? row.timeline ?? ''),
      String(body.status ?? row.status ?? ''),
      String(body.overview ?? row.overview ?? ''),
      String(body.problem ?? row.problem ?? ''),
      String(body.solution ?? row.solution ?? ''),
      body.technologies !== undefined
        ? asStringArray(body.technologies)
        : (row.technologies ?? []),
      body.features !== undefined
        ? asStringArray(body.features)
        : (row.features ?? []),
      body.deliverables !== undefined
        ? asStringArray(body.deliverables)
        : (row.deliverables ?? []),
      body.results !== undefined
        ? asStringArray(body.results)
        : (row.results ?? []),
      body.screenshots !== undefined
        ? resolveScreenshots(body.screenshots)
        : resolveScreenshots(row.screenshots),
      body.relatedIds !== undefined
        ? asStringArray(body.relatedIds)
        : (row.related_ids ?? []),
      body.image !== undefined
        ? resolveCoverImage(body.image, DEFAULT_PROJECT_COVER)
        : resolveCoverImage(row.image, DEFAULT_PROJECT_COVER),
    ],
  );
  return mapProjectRow(result.rows[0]!);
}

export async function deleteProject(id: string): Promise<void> {
  const pool = getPool();
  const result = await pool.query(`DELETE FROM projects WHERE id = $1`, [id]);
  if (!result.rowCount) throw new AppError('Not found', 404);
}
