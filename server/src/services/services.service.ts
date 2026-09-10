import { getPool } from '../db/pool';
import { AppError } from '../utils/AppError';
import {
  DEFAULT_SERVICE_COVER,
  resolveCoverImage,
} from '../middleware/upload';
import {
  asFaqs,
  asStringArray,
  columnsToFaqs,
  faqsToColumns,
  isUniqueViolation,
  type JsonObject,
} from '../utils/cmsHelpers';

interface ServiceCategoryRow {
  id: string;
  title: string;
  path: string;
  description: string;
  sort_order: number;
  published: boolean;
}

interface ServiceRow {
  id: string;
  category_id: string;
  slug: string;
  title: string;
  published: boolean;
  short_description: string;
  description: string;
  benefits: string[] | null;
  features: string[] | null;
  technologies: string[] | null;
  process: string[] | null;
  deliverables: string[] | null;
  faq_questions: string[] | null;
  faq_answers: string[] | null;
  image: string | null;
}

const SERVICE_SELECT = `
  id, category_id, slug, title, published,
  short_description, description,
  benefits, features, technologies, process, deliverables,
  faq_questions, faq_answers, image
`;

function mapServiceItem(row: ServiceRow): JsonObject {
  return {
    slug: row.slug,
    title: row.title,
    published: row.published,
    shortDescription: row.short_description ?? '',
    description: row.description ?? '',
    benefits: row.benefits ?? [],
    features: row.features ?? [],
    technologies: row.technologies ?? [],
    process: row.process ?? [],
    deliverables: row.deliverables ?? [],
    faqs: columnsToFaqs(row.faq_questions, row.faq_answers),
    image: resolveCoverImage(row.image, DEFAULT_SERVICE_COVER),
  };
}

export async function listServiceCategories(
  options: { includeUnpublished?: boolean } = {},
): Promise<JsonObject[]> {
  const pool = getPool();
  const catResult = options.includeUnpublished
    ? await pool.query<ServiceCategoryRow>(
        `SELECT id, title, path, description, sort_order, published
         FROM service_categories
         ORDER BY sort_order ASC, title ASC`,
      )
    : await pool.query<ServiceCategoryRow>(
        `SELECT id, title, path, description, sort_order, published
         FROM service_categories
         WHERE published = TRUE
         ORDER BY sort_order ASC, title ASC`,
      );

  const svcResult = options.includeUnpublished
    ? await pool.query<ServiceRow>(
        `SELECT ${SERVICE_SELECT} FROM services ORDER BY title ASC`,
      )
    : await pool.query<ServiceRow>(
        `SELECT ${SERVICE_SELECT} FROM services WHERE published = TRUE ORDER BY title ASC`,
      );

  const byCategory = new Map<string, JsonObject[]>();
  for (const row of svcResult.rows) {
    const list = byCategory.get(row.category_id) ?? [];
    list.push(mapServiceItem(row));
    byCategory.set(row.category_id, list);
  }

  return catResult.rows.map((cat) => ({
    id: cat.id,
    title: cat.title,
    path: cat.path,
    description: cat.description,
    published: cat.published,
    services: byCategory.get(cat.id) ?? [],
  }));
}

export async function getServiceCategory(
  categoryId: string,
  options: { includeUnpublished?: boolean } = {},
): Promise<JsonObject> {
  const categories = await listServiceCategories(options);
  const found = categories.find((c) => c.id === categoryId);
  if (!found) {
    throw new AppError('Service category not found', 404);
  }
  return found;
}

export async function getService(
  categoryId: string,
  slug: string,
  options: { includeUnpublished?: boolean } = {},
): Promise<JsonObject> {
  const pool = getPool();
  const result = await pool.query<ServiceRow>(
    `SELECT ${SERVICE_SELECT}
     FROM services
     WHERE category_id = $1 AND slug = $2`,
    [categoryId, slug],
  );
  const row = result.rows[0];
  if (!row || (!row.published && !options.includeUnpublished)) {
    throw new AppError('Service not found', 404);
  }
  return mapServiceItem(row);
}

export async function upsertServiceCategory(body: JsonObject): Promise<JsonObject> {
  const pool = getPool();
  const id = String(body.id ?? '');
  if (!id) throw new AppError('id is required', 400);

  const title = String(body.title ?? id);
  const path = String(body.path ?? `/services/${id}`);
  const description = String(body.description ?? '');
  const sortOrder = Number(body.sort_order ?? body.sortOrder ?? 0);
  const published = body.published !== false;

  await pool.query(
    `INSERT INTO service_categories (id, title, path, description, sort_order, published)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title,
       path = EXCLUDED.path,
       description = EXCLUDED.description,
       sort_order = EXCLUDED.sort_order,
       published = EXCLUDED.published,
       updated_at = NOW()`,
    [id, title, path, description, sortOrder, published],
  );

  return getServiceCategory(id, { includeUnpublished: true });
}

export async function updateServiceCategory(
  id: string,
  body: JsonObject,
): Promise<JsonObject> {
  const pool = getPool();
  const existing = await pool.query<ServiceCategoryRow>(
    `SELECT id, title, path, description, sort_order, published
     FROM service_categories WHERE id = $1`,
    [id],
  );
  if (!existing.rows[0]) {
    throw new AppError('Service category not found', 404);
  }
  const row = existing.rows[0];
  const title = String(body.title ?? row.title);
  const path = String(body.path ?? row.path);
  const description = String(body.description ?? row.description);
  const sortOrder = Number(body.sort_order ?? body.sortOrder ?? row.sort_order);
  const published =
    typeof body.published === 'boolean' ? body.published : row.published;

  await pool.query(
    `UPDATE service_categories
     SET title = $2, path = $3, description = $4, sort_order = $5,
         published = $6, updated_at = NOW()
     WHERE id = $1`,
    [id, title, path, description, sortOrder, published],
  );

  return getServiceCategory(id, { includeUnpublished: true });
}

export async function deleteServiceCategory(id: string): Promise<void> {
  const pool = getPool();
  const result = await pool.query(`DELETE FROM service_categories WHERE id = $1`, [id]);
  if (!result.rowCount) {
    throw new AppError('Service category not found', 404);
  }
}

export async function createService(
  categoryId: string,
  body: JsonObject,
): Promise<JsonObject> {
  const pool = getPool();
  const cat = await pool.query(`SELECT id FROM service_categories WHERE id = $1`, [
    categoryId,
  ]);
  if (!cat.rowCount) {
    throw new AppError('Service category not found', 404);
  }

  const slug = String(body.slug ?? '');
  if (!slug) throw new AppError('slug is required', 400);
  const title = String(body.title ?? slug);
  const published = body.published !== false;
  const faqs = asFaqs(body.faqs);
  const faqCols = faqsToColumns(faqs);

  try {
    const result = await pool.query<ServiceRow>(
      `INSERT INTO services (
         category_id, slug, title, published, data,
         short_description, description,
         benefits, features, technologies, process, deliverables,
         faq_questions, faq_answers, faqs, image
       ) VALUES (
         $1, $2, $3, $4, '{}'::jsonb,
         $5, $6,
         $7, $8, $9, $10, $11,
         $12, $13, '[]'::jsonb, $14
       )
       RETURNING ${SERVICE_SELECT}`,
      [
        categoryId,
        slug,
        title,
        published,
        String(body.shortDescription ?? ''),
        String(body.description ?? ''),
        asStringArray(body.benefits),
        asStringArray(body.features),
        asStringArray(body.technologies),
        asStringArray(body.process),
        asStringArray(body.deliverables),
        faqCols.questions,
        faqCols.answers,
        resolveCoverImage(body.image, DEFAULT_SERVICE_COVER),
      ],
    );
    return mapServiceItem(result.rows[0]!);
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new AppError('A service with this slug already exists in the category', 409);
    }
    throw error;
  }
}

export async function updateService(
  categoryId: string,
  slug: string,
  body: JsonObject,
): Promise<JsonObject> {
  const pool = getPool();
  const existing = await pool.query<ServiceRow>(
    `SELECT ${SERVICE_SELECT}
     FROM services WHERE category_id = $1 AND slug = $2`,
    [categoryId, slug],
  );
  const row = existing.rows[0];
  if (!row) {
    throw new AppError('Service not found', 404);
  }

  const title = String(body.title ?? row.title);
  const published =
    typeof body.published === 'boolean' ? body.published : row.published;
  const faqs =
    body.faqs !== undefined
      ? asFaqs(body.faqs)
      : columnsToFaqs(row.faq_questions, row.faq_answers);
  const faqCols = faqsToColumns(faqs);

  const result = await pool.query<ServiceRow>(
    `UPDATE services SET
       title = $3,
       published = $4,
       data = '{}'::jsonb,
       short_description = $5,
       description = $6,
       benefits = $7,
       features = $8,
       technologies = $9,
       process = $10,
       deliverables = $11,
       faq_questions = $12,
       faq_answers = $13,
       faqs = '[]'::jsonb,
       image = $14,
       updated_at = NOW()
     WHERE category_id = $1 AND slug = $2
     RETURNING ${SERVICE_SELECT}`,
    [
      categoryId,
      slug,
      title,
      published,
      String(body.shortDescription ?? row.short_description ?? ''),
      String(body.description ?? row.description ?? ''),
      body.benefits !== undefined
        ? asStringArray(body.benefits)
        : (row.benefits ?? []),
      body.features !== undefined
        ? asStringArray(body.features)
        : (row.features ?? []),
      body.technologies !== undefined
        ? asStringArray(body.technologies)
        : (row.technologies ?? []),
      body.process !== undefined
        ? asStringArray(body.process)
        : (row.process ?? []),
      body.deliverables !== undefined
        ? asStringArray(body.deliverables)
        : (row.deliverables ?? []),
      faqCols.questions,
      faqCols.answers,
      body.image !== undefined
        ? resolveCoverImage(body.image, DEFAULT_SERVICE_COVER)
        : resolveCoverImage(row.image, DEFAULT_SERVICE_COVER),
    ],
  );
  return mapServiceItem(result.rows[0]!);
}

export async function deleteService(categoryId: string, slug: string): Promise<void> {
  const pool = getPool();
  const result = await pool.query(
    `DELETE FROM services WHERE category_id = $1 AND slug = $2`,
    [categoryId, slug],
  );
  if (!result.rowCount) {
    throw new AppError('Service not found', 404);
  }
}
