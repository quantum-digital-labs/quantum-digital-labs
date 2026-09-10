import { getPool } from '../db/pool';
import { AppError } from '../utils/AppError';
import { nextBusinessId } from '../utils/businessId';
import {
  asStringArray,
  isUniqueViolation,
  type JsonObject,
} from '../utils/cmsHelpers';

interface BlogRow {
  id: string;
  uuid?: string;
  title: string;
  published: boolean;
  slug: string;
  author: string;
  post_date: string;
  category: string;
  reading_time: string;
  excerpt: string;
  tags: string[] | null;
  content: string[] | null;
  featured: boolean;
}

const BLOG_SELECT = `
  id, uuid::text AS uuid, title, published,
  slug, author, post_date, category, reading_time, excerpt,
  tags, content, featured
`;

function mapBlogRow(row: BlogRow): JsonObject {
  return {
    id: row.id,
    uuid: row.uuid,
    slug: row.slug || row.id,
    title: row.title,
    published: row.published,
    author: row.author ?? '',
    date: row.post_date ?? '',
    category: row.category ?? '',
    readingTime: row.reading_time ?? '',
    excerpt: row.excerpt ?? '',
    tags: row.tags ?? [],
    content: row.content ?? [],
    featured: row.featured === true,
  };
}

export async function listBlog(
  options: { includeUnpublished?: boolean } = {},
): Promise<JsonObject[]> {
  const pool = getPool();
  const result = options.includeUnpublished
    ? await pool.query<BlogRow>(
        `SELECT ${BLOG_SELECT} FROM blog_posts ORDER BY updated_at DESC`,
      )
    : await pool.query<BlogRow>(
        `SELECT ${BLOG_SELECT} FROM blog_posts WHERE published = TRUE ORDER BY updated_at DESC`,
      );
  return result.rows.map(mapBlogRow);
}

export async function getBlogBySlug(
  slug: string,
  options: { includeUnpublished?: boolean } = {},
): Promise<JsonObject> {
  const pool = getPool();
  const result = await pool.query<BlogRow>(
    `SELECT ${BLOG_SELECT} FROM blog_posts WHERE id = $1 OR slug = $1`,
    [slug],
  );
  const row = result.rows[0];
  if (!row || (!row.published && !options.includeUnpublished)) {
    throw new AppError('Not found', 404);
  }
  return mapBlogRow(row);
}

export async function createBlogPost(body: JsonObject): Promise<JsonObject> {
  const pool = getPool();
  const id = await nextBusinessId(pool, 'blog');
  const slug = String(body.slug ?? id);
  if (!slug) throw new AppError('slug is required', 400);
  const title = String(body.title ?? id);
  const published = body.published !== false;

  try {
    const result = await pool.query<BlogRow>(
      `INSERT INTO blog_posts (
         id, title, published, data, uuid,
         slug, author, post_date, category, reading_time, excerpt,
         tags, content, featured
       ) VALUES (
         $1, $2, $3, '{}'::jsonb, gen_random_uuid(),
         $4, $5, $6, $7, $8, $9,
         $10, $11, $12
       )
       RETURNING ${BLOG_SELECT}`,
      [
        id,
        title,
        published,
        slug,
        String(body.author ?? ''),
        String(body.date ?? ''),
        String(body.category ?? ''),
        String(body.readingTime ?? ''),
        String(body.excerpt ?? ''),
        asStringArray(body.tags),
        asStringArray(body.content),
        body.featured === true,
      ],
    );
    return mapBlogRow(result.rows[0]!);
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new AppError('An item with this id already exists', 409);
    }
    throw error;
  }
}

export async function updateBlogPost(
  slug: string,
  body: JsonObject,
): Promise<JsonObject> {
  const pool = getPool();
  const existing = await pool.query<BlogRow>(
    `SELECT ${BLOG_SELECT} FROM blog_posts WHERE id = $1 OR slug = $1`,
    [slug],
  );
  const row = existing.rows[0];
  if (!row) throw new AppError('Not found', 404);

  const title = String(body.title ?? row.title);
  const published =
    typeof body.published === 'boolean' ? body.published : row.published;
  const nextSlug = String(body.slug ?? row.slug ?? row.id);

  const result = await pool.query<BlogRow>(
    `UPDATE blog_posts SET
       title = $2, published = $3, data = '{}'::jsonb,
       slug = $4, author = $5, post_date = $6, category = $7,
       reading_time = $8, excerpt = $9, tags = $10, content = $11, featured = $12,
       updated_at = NOW()
     WHERE id = $1
     RETURNING ${BLOG_SELECT}`,
    [
      row.id,
      title,
      published,
      nextSlug,
      String(body.author ?? row.author ?? ''),
      String(body.date ?? row.post_date ?? ''),
      String(body.category ?? row.category ?? ''),
      String(body.readingTime ?? row.reading_time ?? ''),
      String(body.excerpt ?? row.excerpt ?? ''),
      body.tags !== undefined ? asStringArray(body.tags) : (row.tags ?? []),
      body.content !== undefined
        ? asStringArray(body.content)
        : (row.content ?? []),
      body.featured !== undefined ? body.featured === true : row.featured,
    ],
  );
  return mapBlogRow(result.rows[0]!);
}

export async function deleteBlogPost(slug: string): Promise<void> {
  const pool = getPool();
  const result = await pool.query(
    `DELETE FROM blog_posts WHERE id = $1 OR slug = $1`,
    [slug],
  );
  if (!result.rowCount) throw new AppError('Not found', 404);
}
