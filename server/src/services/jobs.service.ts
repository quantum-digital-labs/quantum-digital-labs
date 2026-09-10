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

interface JobRow {
  id: string;
  uuid?: string;
  title: string;
  published: boolean;
  summary: string;
  location: string;
  department: string;
  experience: string;
  job_type: string;
  skills: string[] | null;
  responsibilities: string[] | null;
  requirements: string[] | null;
  benefits: string[] | null;
  openings: number | null;
  salary: string | null;
  application_deadline: string | Date | null;
  work_mode: string | null;
}

const JOB_SELECT = `
  id, uuid::text AS uuid, title, published,
  summary, location, department, experience, job_type,
  skills, responsibilities, requirements, benefits,
  openings, salary, application_deadline::text AS application_deadline, work_mode
`;

function mapJobRow(row: JobRow): JsonObject {
  const result: JsonObject = {
    id: row.id,
    uuid: row.uuid,
    title: row.title,
    published: row.published,
    summary: row.summary ?? '',
    location: row.location ?? '',
    department: row.department ?? '',
    experience: row.experience ?? '',
    jobType: row.job_type ?? '',
    skills: row.skills ?? [],
    responsibilities: row.responsibilities ?? [],
    requirements: row.requirements ?? [],
    benefits: row.benefits ?? [],
  };
  if (row.openings != null) result.openings = row.openings;
  if (row.salary) result.salary = row.salary;
  const deadline = formatDateField(row.application_deadline);
  if (deadline) result.applicationDeadline = deadline;
  if (row.work_mode) result.workMode = row.work_mode;
  return result;
}

export async function listJobs(
  options: { includeUnpublished?: boolean } = {},
): Promise<JsonObject[]> {
  const pool = getPool();
  const result = options.includeUnpublished
    ? await pool.query<JobRow>(
        `SELECT ${JOB_SELECT} FROM jobs ORDER BY updated_at DESC`,
      )
    : await pool.query<JobRow>(
        `SELECT ${JOB_SELECT} FROM jobs WHERE published = TRUE ORDER BY updated_at DESC`,
      );
  return result.rows.map(mapJobRow);
}

export async function getJobById(
  id: string,
  options: { includeUnpublished?: boolean } = {},
): Promise<JsonObject> {
  const pool = getPool();
  const result = await pool.query<JobRow>(
    `SELECT ${JOB_SELECT} FROM jobs WHERE id = $1`,
    [id],
  );
  const row = result.rows[0];
  if (!row || (!row.published && !options.includeUnpublished)) {
    throw new AppError('Not found', 404);
  }
  return mapJobRow(row);
}

export async function createJob(body: JsonObject): Promise<JsonObject> {
  const pool = getPool();
  const id = await nextBusinessId(pool, 'job');
  const title = String(body.title ?? id);
  const published = body.published !== false;

  try {
    const result = await pool.query<JobRow>(
      `INSERT INTO jobs (
         id, title, published, data, uuid,
         summary, location, department, experience, job_type,
         skills, responsibilities, requirements, benefits,
         openings, salary, application_deadline, work_mode
       ) VALUES (
         $1, $2, $3, '{}'::jsonb, gen_random_uuid(),
         $4, $5, $6, $7, $8,
         $9, $10, $11, $12,
         $13, $14, $15, $16
       )
       RETURNING ${JOB_SELECT}`,
      [
        id,
        title,
        published,
        String(body.summary ?? ''),
        String(body.location ?? ''),
        String(body.department ?? ''),
        String(body.experience ?? ''),
        String(body.jobType ?? ''),
        asStringArray(body.skills),
        asStringArray(body.responsibilities),
        asStringArray(body.requirements),
        asStringArray(body.benefits),
        asOptionalInt(body.openings),
        asOptionalText(body.salary),
        asOptionalDate(body.applicationDeadline),
        asOptionalText(body.workMode),
      ],
    );
    return mapJobRow(result.rows[0]!);
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new AppError('An item with this id already exists', 409);
    }
    throw error;
  }
}

export async function updateJob(id: string, body: JsonObject): Promise<JsonObject> {
  const pool = getPool();
  const existing = await pool.query<JobRow>(
    `SELECT ${JOB_SELECT} FROM jobs WHERE id = $1`,
    [id],
  );
  const row = existing.rows[0];
  if (!row) {
    throw new AppError('Not found', 404);
  }

  const title = String(body.title ?? row.title);
  const published =
    typeof body.published === 'boolean' ? body.published : row.published;
  const openings =
    body.openings !== undefined ? asOptionalInt(body.openings) : row.openings;
  const salary =
    body.salary !== undefined ? asOptionalText(body.salary) : row.salary;
  const applicationDeadline =
    body.applicationDeadline !== undefined
      ? asOptionalDate(body.applicationDeadline)
      : formatDateField(row.application_deadline) ?? null;
  const workMode =
    body.workMode !== undefined ? asOptionalText(body.workMode) : row.work_mode;

  const result = await pool.query<JobRow>(
    `UPDATE jobs SET
       title = $2,
       published = $3,
       data = '{}'::jsonb,
       summary = $4,
       location = $5,
       department = $6,
       experience = $7,
       job_type = $8,
       skills = $9,
       responsibilities = $10,
       requirements = $11,
       benefits = $12,
       openings = $13,
       salary = $14,
       application_deadline = $15,
       work_mode = $16,
       updated_at = NOW()
     WHERE id = $1
     RETURNING ${JOB_SELECT}`,
    [
      id,
      title,
      published,
      String(body.summary ?? row.summary ?? ''),
      String(body.location ?? row.location ?? ''),
      String(body.department ?? row.department ?? ''),
      String(body.experience ?? row.experience ?? ''),
      String(body.jobType ?? row.job_type ?? ''),
      body.skills !== undefined ? asStringArray(body.skills) : (row.skills ?? []),
      body.responsibilities !== undefined
        ? asStringArray(body.responsibilities)
        : (row.responsibilities ?? []),
      body.requirements !== undefined
        ? asStringArray(body.requirements)
        : (row.requirements ?? []),
      body.benefits !== undefined
        ? asStringArray(body.benefits)
        : (row.benefits ?? []),
      openings,
      salary,
      applicationDeadline,
      workMode,
    ],
  );
  return mapJobRow(result.rows[0]!);
}

export async function deleteJob(id: string): Promise<void> {
  const pool = getPool();
  const result = await pool.query(`DELETE FROM jobs WHERE id = $1`, [id]);
  if (!result.rowCount) {
    throw new AppError('Not found', 404);
  }
}
