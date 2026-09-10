import { getPool } from '../db/pool';
import { AppError } from '../utils/AppError';
import { nextBusinessId } from '../utils/businessId';
import { DEFAULT_PORTFOLIO_COVER, DEFAULT_PORTFOLIO_GALLERY, resolveCoverImage } from '../middleware/upload';
import {
  asStringArray,
  columnToMetrics,
  isUniqueViolation,
  metricsToColumn,
  type JsonObject,
} from '../utils/cmsHelpers';

function isGalleryImageUrl(value: string): boolean {
  const trimmed = value.trim();
  return (
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/')
  );
}

function resolveGalleryLabels(value: unknown): string[] {
  const list = asStringArray(value).filter((item) => isGalleryImageUrl(item));
  return list.length > 0 ? list : [...DEFAULT_PORTFOLIO_GALLERY];
}

interface PortfolioRow {
  id: string;
  uuid?: string;
  title: string;
  published: boolean;
  category: string;
  industry: string;
  year: string;
  role: string;
  timeline: string;
  overview: string;
  problem: string;
  solution: string;
  challenge: string;
  strategy: string;
  development: string;
  technology_narrative: string;
  technologies: string[] | null;
  features: string[] | null;
  deliverables: string[] | null;
  results: string[] | null;
  case_results: string[] | null;
  metrics: string[] | null;
  gallery_labels: string[] | null;
  related_ids: string[] | null;
  image: string | null;
}

const PORTFOLIO_SELECT = `
  id, uuid::text AS uuid, title, published,
  category, industry, year, role, timeline,
  overview, problem, solution, challenge, strategy, development,
  technology_narrative, technologies, features, deliverables,
  results, case_results, metrics, gallery_labels, related_ids,
  image
`;

function mapPortfolioRow(row: PortfolioRow): JsonObject {
  return {
    id: row.id,
    uuid: row.uuid,
    title: row.title,
    published: row.published,
    category: row.category ?? '',
    industry: row.industry ?? '',
    year: row.year ?? '',
    role: row.role ?? '',
    timeline: row.timeline ?? '',
    overview: row.overview ?? '',
    problem: row.problem ?? '',
    solution: row.solution ?? '',
    challenge: row.challenge ?? '',
    strategy: row.strategy ?? '',
    development: row.development ?? '',
    technologyNarrative: row.technology_narrative ?? '',
    technologies: row.technologies ?? [],
    features: row.features ?? [],
    deliverables: row.deliverables ?? [],
    results: row.results ?? [],
    caseResults: row.case_results ?? [],
    metrics: columnToMetrics(row.metrics),
    galleryLabels: resolveGalleryLabels(row.gallery_labels),
    relatedIds: row.related_ids ?? [],
    image: resolveCoverImage(row.image, DEFAULT_PORTFOLIO_COVER),
  };
}

export async function listPortfolio(
  options: { includeUnpublished?: boolean } = {},
): Promise<JsonObject[]> {
  const pool = getPool();
  const result = options.includeUnpublished
    ? await pool.query<PortfolioRow>(
        `SELECT ${PORTFOLIO_SELECT} FROM portfolio_items ORDER BY updated_at DESC`,
      )
    : await pool.query<PortfolioRow>(
        `SELECT ${PORTFOLIO_SELECT} FROM portfolio_items WHERE published = TRUE ORDER BY updated_at DESC`,
      );
  return result.rows.map(mapPortfolioRow);
}

export async function getPortfolioById(
  id: string,
  options: { includeUnpublished?: boolean } = {},
): Promise<JsonObject> {
  const pool = getPool();
  const result = await pool.query<PortfolioRow>(
    `SELECT ${PORTFOLIO_SELECT} FROM portfolio_items WHERE id = $1`,
    [id],
  );
  const row = result.rows[0];
  if (!row || (!row.published && !options.includeUnpublished)) {
    throw new AppError('Not found', 404);
  }
  return mapPortfolioRow(row);
}

export async function createPortfolioItem(body: JsonObject): Promise<JsonObject> {
  const pool = getPool();
  const id = await nextBusinessId(pool, 'portfolio');
  const title = String(body.title ?? id);
  const published = body.published !== false;

  try {
    const result = await pool.query<PortfolioRow>(
      `INSERT INTO portfolio_items (
         id, title, published, data, uuid,
         category, industry, year, role, timeline,
         overview, problem, solution, challenge, strategy, development,
         technology_narrative, technologies, features, deliverables,
         results, case_results, metrics, gallery_labels, related_ids,
         image
       ) VALUES (
         $1, $2, $3, '{}'::jsonb, gen_random_uuid(),
         $4, $5, $6, $7, $8,
         $9, $10, $11, $12, $13, $14,
         $15, $16, $17, $18,
         $19, $20, $21, $22, $23,
         $24
       )
       RETURNING ${PORTFOLIO_SELECT}`,
      [
        id,
        title,
        published,
        String(body.category ?? ''),
        String(body.industry ?? ''),
        String(body.year ?? ''),
        String(body.role ?? ''),
        String(body.timeline ?? ''),
        String(body.overview ?? ''),
        String(body.problem ?? ''),
        String(body.solution ?? ''),
        String(body.challenge ?? ''),
        String(body.strategy ?? ''),
        String(body.development ?? ''),
        String(body.technologyNarrative ?? ''),
        asStringArray(body.technologies),
        asStringArray(body.features),
        asStringArray(body.deliverables),
        asStringArray(body.results),
        asStringArray(body.caseResults),
        metricsToColumn(body.metrics),
        resolveGalleryLabels(body.galleryLabels),
        asStringArray(body.relatedIds),
        resolveCoverImage(body.image, DEFAULT_PORTFOLIO_COVER),
      ],
    );
    return mapPortfolioRow(result.rows[0]!);
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new AppError('An item with this id already exists', 409);
    }
    throw error;
  }
}

export async function updatePortfolioItem(
  id: string,
  body: JsonObject,
): Promise<JsonObject> {
  const pool = getPool();
  const existing = await pool.query<PortfolioRow>(
    `SELECT ${PORTFOLIO_SELECT} FROM portfolio_items WHERE id = $1`,
    [id],
  );
  const row = existing.rows[0];
  if (!row) throw new AppError('Not found', 404);

  const title = String(body.title ?? row.title);
  const published =
    typeof body.published === 'boolean' ? body.published : row.published;

  const result = await pool.query<PortfolioRow>(
    `UPDATE portfolio_items SET
       title = $2, published = $3, data = '{}'::jsonb,
       category = $4, industry = $5, year = $6, role = $7, timeline = $8,
       overview = $9, problem = $10, solution = $11, challenge = $12,
       strategy = $13, development = $14, technology_narrative = $15,
       technologies = $16, features = $17, deliverables = $18,
       results = $19, case_results = $20, metrics = $21,
       gallery_labels = $22, related_ids = $23, image = $24,
       updated_at = NOW()
     WHERE id = $1
     RETURNING ${PORTFOLIO_SELECT}`,
    [
      id,
      title,
      published,
      String(body.category ?? row.category ?? ''),
      String(body.industry ?? row.industry ?? ''),
      String(body.year ?? row.year ?? ''),
      String(body.role ?? row.role ?? ''),
      String(body.timeline ?? row.timeline ?? ''),
      String(body.overview ?? row.overview ?? ''),
      String(body.problem ?? row.problem ?? ''),
      String(body.solution ?? row.solution ?? ''),
      String(body.challenge ?? row.challenge ?? ''),
      String(body.strategy ?? row.strategy ?? ''),
      String(body.development ?? row.development ?? ''),
      String(body.technologyNarrative ?? row.technology_narrative ?? ''),
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
      body.caseResults !== undefined
        ? asStringArray(body.caseResults)
        : (row.case_results ?? []),
      body.metrics !== undefined
        ? metricsToColumn(body.metrics)
        : (row.metrics ?? []),
      body.galleryLabels !== undefined
        ? resolveGalleryLabels(body.galleryLabels)
        : resolveGalleryLabels(row.gallery_labels),
      body.relatedIds !== undefined
        ? asStringArray(body.relatedIds)
        : (row.related_ids ?? []),
      body.image !== undefined
        ? resolveCoverImage(body.image, DEFAULT_PORTFOLIO_COVER)
        : resolveCoverImage(row.image, DEFAULT_PORTFOLIO_COVER),
    ],
  );
  return mapPortfolioRow(result.rows[0]!);
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const pool = getPool();
  const result = await pool.query(`DELETE FROM portfolio_items WHERE id = $1`, [id]);
  if (!result.rowCount) throw new AppError('Not found', 404);
}
