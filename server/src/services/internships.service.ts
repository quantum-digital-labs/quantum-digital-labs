import { getPool } from '../db/pool';
import { AppError } from '../utils/AppError';
import { nextBusinessId } from '../utils/businessId';
import {
  asOptionalDate,
  asOptionalInt,
  asOptionalText,
  asStringArray,
  formatDateField,
  isUniqueViolation,
  type JsonObject,
} from '../utils/cmsHelpers';

interface InternshipRow {
  id: string;
  uuid?: string;
  title: string;
  published: boolean;
  role: string;
  domain: string;
  duration: string;
  mode: string;
  summary: string;
  eligibility: string[] | null;
  technologies: string[] | null;
  skills: string[] | null;
  projects: string[] | null;
  responsibilities: string[] | null;
  certificate: string;
  benefits: string[] | null;
  learning_outcomes: string[] | null;
  openings: number | null;
  stipend: string | null;
  start_date: string | Date | null;
  end_date: string | Date | null;
  work_mode: string | null;
}

const INTERNSHIP_SELECT = `
  id, uuid::text AS uuid, title, published,
  role, domain, duration, mode, summary,
  eligibility, technologies, skills, projects, responsibilities,
  certificate, benefits, learning_outcomes,
  openings, stipend,
  start_date::text AS start_date, end_date::text AS end_date, work_mode
`;

function mapInternshipRow(row: InternshipRow): JsonObject {
  const result: JsonObject = {
    id: row.id,
    uuid: row.uuid,
    title: row.title,
    role: row.role || row.title,
    published: row.published,
    domain: row.domain ?? '',
    duration: row.duration ?? '',
    mode: row.mode ?? '',
    summary: row.summary ?? '',
    eligibility: row.eligibility ?? [],
    technologies: row.technologies ?? [],
    skills: row.skills ?? [],
    projects: row.projects ?? [],
    responsibilities: row.responsibilities ?? [],
    certificate: row.certificate ?? '',
    benefits: row.benefits ?? [],
    learningOutcomes: row.learning_outcomes ?? [],
  };
  if (row.openings != null) result.openings = row.openings;
  if (row.stipend) result.stipend = row.stipend;
  const startDate = formatDateField(row.start_date);
  if (startDate) result.startDate = startDate;
  const endDate = formatDateField(row.end_date);
  if (endDate) result.endDate = endDate;
  if (row.work_mode) result.workMode = row.work_mode;
  return result;
}

export async function listInternships(
  options: { includeUnpublished?: boolean } = {},
): Promise<JsonObject[]> {
  const pool = getPool();
  const result = options.includeUnpublished
    ? await pool.query<InternshipRow>(
        `SELECT ${INTERNSHIP_SELECT} FROM internships ORDER BY updated_at DESC`,
      )
    : await pool.query<InternshipRow>(
        `SELECT ${INTERNSHIP_SELECT} FROM internships WHERE published = TRUE ORDER BY updated_at DESC`,
      );
  return result.rows.map(mapInternshipRow);
}

export async function getInternshipById(
  id: string,
  options: { includeUnpublished?: boolean } = {},
): Promise<JsonObject> {
  const pool = getPool();
  const result = await pool.query<InternshipRow>(
    `SELECT ${INTERNSHIP_SELECT} FROM internships WHERE id = $1`,
    [id],
  );
  const row = result.rows[0];
  if (!row || (!row.published && !options.includeUnpublished)) {
    throw new AppError('Not found', 404);
  }
  return mapInternshipRow(row);
}

export async function createInternship(body: JsonObject): Promise<JsonObject> {
  const pool = getPool();
  const id = await nextBusinessId(pool, 'internship');
  const role = String(body.role ?? body.title ?? id);
  const title = String(body.title ?? role);
  const published = body.published !== false;
  const endDate =
    asOptionalDate(body.endDate) ?? asOptionalDate(body.applicationDeadline);

  try {
    const result = await pool.query<InternshipRow>(
      `INSERT INTO internships (
         id, title, published, data, uuid,
         role, domain, duration, mode, summary,
         eligibility, technologies, skills, projects, responsibilities,
         certificate, benefits, learning_outcomes,
         openings, stipend, start_date, end_date, work_mode
       ) VALUES (
         $1, $2, $3, '{}'::jsonb, gen_random_uuid(),
         $4, $5, $6, $7, $8,
         $9, $10, $11, $12, $13,
         $14, $15, $16,
         $17, $18, $19, $20, $21
       )
       RETURNING ${INTERNSHIP_SELECT}`,
      [
        id,
        title,
        published,
        role,
        String(body.domain ?? ''),
        String(body.duration ?? ''),
        String(body.mode ?? ''),
        String(body.summary ?? ''),
        asStringArray(body.eligibility),
        asStringArray(body.technologies),
        asStringArray(body.skills),
        asStringArray(body.projects),
        asStringArray(body.responsibilities),
        String(body.certificate ?? ''),
        asStringArray(body.benefits),
        asStringArray(body.learningOutcomes),
        asOptionalInt(body.openings),
        asOptionalText(body.stipend),
        asOptionalDate(body.startDate),
        endDate,
        asOptionalText(body.workMode),
      ],
    );
    return mapInternshipRow(result.rows[0]!);
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new AppError('An item with this id already exists', 409);
    }
    throw error;
  }
}

export async function updateInternship(
  id: string,
  body: JsonObject,
): Promise<JsonObject> {
  const pool = getPool();
  const existing = await pool.query<InternshipRow>(
    `SELECT ${INTERNSHIP_SELECT} FROM internships WHERE id = $1`,
    [id],
  );
  const row = existing.rows[0];
  if (!row) {
    throw new AppError('Not found', 404);
  }

  const role = String(body.role ?? row.role ?? row.title);
  const title = String(body.title ?? role);
  const published =
    typeof body.published === 'boolean' ? body.published : row.published;
  const openings =
    body.openings !== undefined ? asOptionalInt(body.openings) : row.openings;
  const stipend =
    body.stipend !== undefined ? asOptionalText(body.stipend) : row.stipend;
  const startDate =
    body.startDate !== undefined
      ? asOptionalDate(body.startDate)
      : formatDateField(row.start_date) ?? null;
  const endDate =
    body.endDate !== undefined || body.applicationDeadline !== undefined
      ? asOptionalDate(body.endDate) ?? asOptionalDate(body.applicationDeadline)
      : formatDateField(row.end_date) ?? null;
  const workMode =
    body.workMode !== undefined ? asOptionalText(body.workMode) : row.work_mode;

  const result = await pool.query<InternshipRow>(
    `UPDATE internships SET
       title = $2,
       published = $3,
       data = '{}'::jsonb,
       role = $4,
       domain = $5,
       duration = $6,
       mode = $7,
       summary = $8,
       eligibility = $9,
       technologies = $10,
       skills = $11,
       projects = $12,
       responsibilities = $13,
       certificate = $14,
       benefits = $15,
       learning_outcomes = $16,
       openings = $17,
       stipend = $18,
       start_date = $19,
       end_date = $20,
       work_mode = $21,
       updated_at = NOW()
     WHERE id = $1
     RETURNING ${INTERNSHIP_SELECT}`,
    [
      id,
      title,
      published,
      role,
      String(body.domain ?? row.domain ?? ''),
      String(body.duration ?? row.duration ?? ''),
      String(body.mode ?? row.mode ?? ''),
      String(body.summary ?? row.summary ?? ''),
      body.eligibility !== undefined
        ? asStringArray(body.eligibility)
        : (row.eligibility ?? []),
      body.technologies !== undefined
        ? asStringArray(body.technologies)
        : (row.technologies ?? []),
      body.skills !== undefined ? asStringArray(body.skills) : (row.skills ?? []),
      body.projects !== undefined
        ? asStringArray(body.projects)
        : (row.projects ?? []),
      body.responsibilities !== undefined
        ? asStringArray(body.responsibilities)
        : (row.responsibilities ?? []),
      String(body.certificate ?? row.certificate ?? ''),
      body.benefits !== undefined
        ? asStringArray(body.benefits)
        : (row.benefits ?? []),
      body.learningOutcomes !== undefined
        ? asStringArray(body.learningOutcomes)
        : (row.learning_outcomes ?? []),
      openings,
      stipend,
      startDate,
      endDate,
      workMode,
    ],
  );
  return mapInternshipRow(result.rows[0]!);
}

export async function deleteInternship(id: string): Promise<void> {
  const pool = getPool();
  const result = await pool.query(`DELETE FROM internships WHERE id = $1`, [id]);
  if (!result.rowCount) {
    throw new AppError('Not found', 404);
  }
}
