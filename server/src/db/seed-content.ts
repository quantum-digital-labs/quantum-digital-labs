/**
 * Seed CMS content from client static data + default admin user.
 * Run: npm run db:seed
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { env, isDatabaseConfigured } from '../config/env';
import { hashPassword } from '../utils/password';

type JsonObject = Record<string, unknown>;

const ABOUT_CONTENT = {
  journey: [
    {
      title: 'May 2026 — Launch',
      text: 'Quantum Digital Labs began operations with a focused mix of technology, staffing, training, and marketing services.',
    },
    {
      title: 'First platform journeys',
      text: 'Built clear paths for services, careers, internships, projects, and sample portfolio case studies.',
    },
    {
      title: 'Talent + delivery together',
      text: 'Connected client work with internship roles and hiring loops so learning stays practical.',
    },
    {
      title: 'Today',
      text: 'A young company shipping in public — refining demos, content, and partner-ready experiences.',
    },
  ],
  vision:
    'To become a trusted digital and talent solutions partner by creating innovative technology solutions, developing skilled professionals, and enabling organizations to grow through technology and people.',
  mission:
    'Our mission is to deliver reliable technology, staffing, training, digital marketing, and project solutions while creating meaningful career and learning opportunities for students and professionals.',
  whyChoose: [
    'End-to-end delivery with transparent milestones',
    'Talent pathways through training and internships',
    'Long-term support beyond launch day',
  ],
  values: [
    {
      title: 'Integrity',
      description: 'Honesty in every engagement and commitment.',
      accent: '#B8956B',
    },
    {
      title: 'Quality',
      description: 'Craft over shortcuts — built to last.',
      accent: '#2E5A8C',
    },
    {
      title: 'Practical',
      description: 'Learning and delivery grounded in real work.',
      accent: '#0C2340',
    },
    {
      title: 'Clarity',
      description: 'Transparent communication at every step.',
      accent: '#4A7AB0',
    },
    {
      title: 'Growth',
      description: 'Continuous improvement for people and products.',
      accent: '#96784F',
    },
  ],
};

const ADMIN_EMAIL = 'admin@quantumdigitallabs.com';
const ADMIN_PASSWORD = 'Admin@12345';

async function loadClientData(): Promise<{
  jobs: JsonObject[];
  internships: JsonObject[];
  projects: JsonObject[];
  portfolio: JsonObject[];
  blog: JsonObject[];
  serviceCategories: JsonObject[];
}> {
  const seedDir = path.resolve(__dirname, 'seed');

  try {
    const jobsMod = await import('../../../client/src/data/jobs.ts');
    const internshipsMod = await import('../../../client/src/data/internships.ts');
    const projectsMod = await import('../../../client/src/data/projects.ts');
    const portfolioMod = await import('../../../client/src/data/portfolio.ts');
    const blogMod = await import('../../../client/src/data/blog.ts');
    const servicesMod = await import('../../../client/src/data/services.ts');

    console.log('[seed] Loaded static data from client/src/data');
    return {
      jobs: jobsMod.JOBS as JsonObject[],
      internships: internshipsMod.INTERNSHIPS as JsonObject[],
      projects: projectsMod.PROJECTS as JsonObject[],
      portfolio: portfolioMod.PORTFOLIO as JsonObject[],
      blog: blogMod.BLOG_ARTICLES as JsonObject[],
      serviceCategories: servicesMod.SERVICE_CATEGORIES as JsonObject[],
    };
  } catch (error) {
    console.warn('[seed] Client import failed, falling back to seed JSON:', error);

    const readJson = (name: string): JsonObject[] => {
      const filePath = path.join(seedDir, name);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Missing fallback seed file: ${filePath}`);
      }
      return JSON.parse(fs.readFileSync(filePath, 'utf8')) as JsonObject[];
    };

    return {
      jobs: readJson('jobs.json'),
      internships: readJson('internships.json'),
      projects: readJson('projects.json'),
      portfolio: readJson('portfolio.json'),
      blog: readJson('blog.json'),
      serviceCategories: readJson('services.json'),
    };
  }
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item)).filter(Boolean);
}

function asOptionalInt(value: unknown): number | null {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  return Number.isInteger(n) ? n : null;
}

function asOptionalText(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function asOptionalDate(value: unknown): string | null {
  if (value === undefined || value === null || value === '') return null;
  const text = String(value).trim();
  if (!/^\d{4}-\d{2}-\d{2}/.test(text)) return null;
  return text.slice(0, 10);
}

function asFaqs(value: unknown): { question: string; answer: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as { question?: unknown; answer?: unknown };
      const question = String(row.question ?? '').trim();
      const answer = String(row.answer ?? '').trim();
      if (!question && !answer) return null;
      return { question, answer };
    })
    .filter((item): item is { question: string; answer: string } => item !== null);
}

function metricsToColumn(metrics: unknown): string[] {
  if (!Array.isArray(metrics)) return [];
  return metrics
    .map((item) => {
      if (!item || typeof item !== 'object') return '';
      const row = item as { label?: unknown; value?: unknown };
      const label = String(row.label ?? '').trim();
      const value = String(row.value ?? '').trim();
      if (!label && !value) return '';
      return `${label} | ${value}`;
    })
    .filter(Boolean);
}

async function upsertJob(pool: Pool, job: JsonObject) {
  const id = String(job.id);
  const title = String(job.title ?? id);
  await pool.query(
    `INSERT INTO jobs (
       id, title, published, data,
       summary, location, department, experience, job_type,
       skills, responsibilities, requirements, benefits,
       openings, salary, application_deadline, work_mode
     ) VALUES (
       $1, $2, TRUE, '{}'::jsonb,
       $3, $4, $5, $6, $7,
       $8, $9, $10, $11,
       $12, $13, $14, $15
     )
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title,
       published = TRUE,
       data = '{}'::jsonb,
       summary = EXCLUDED.summary,
       location = EXCLUDED.location,
       department = EXCLUDED.department,
       experience = EXCLUDED.experience,
       job_type = EXCLUDED.job_type,
       skills = EXCLUDED.skills,
       responsibilities = EXCLUDED.responsibilities,
       requirements = EXCLUDED.requirements,
       benefits = EXCLUDED.benefits,
       openings = EXCLUDED.openings,
       salary = EXCLUDED.salary,
       application_deadline = EXCLUDED.application_deadline,
       work_mode = EXCLUDED.work_mode,
       updated_at = NOW()`,
    [
      id,
      title,
      String(job.summary ?? ''),
      String(job.location ?? ''),
      String(job.department ?? ''),
      String(job.experience ?? ''),
      String(job.jobType ?? ''),
      asStringArray(job.skills),
      asStringArray(job.responsibilities),
      asStringArray(job.requirements),
      asStringArray(job.benefits),
      asOptionalInt(job.openings),
      asOptionalText(job.salary),
      asOptionalDate(job.applicationDeadline),
      asOptionalText(job.workMode),
    ],
  );
}

async function upsertInternship(pool: Pool, item: JsonObject) {
  const id = String(item.id);
  const role = String(item.role ?? item.title ?? id);
  const title = String(item.title ?? role);
  await pool.query(
    `INSERT INTO internships (
       id, title, published, data,
       role, domain, duration, mode, summary,
       eligibility, technologies, skills, projects, responsibilities,
       certificate, benefits, learning_outcomes,
       openings, stipend, start_date, end_date, work_mode
     ) VALUES (
       $1, $2, TRUE, '{}'::jsonb,
       $3, $4, $5, $6, $7,
       $8, $9, $10, $11, $12,
       $13, $14, $15,
       $16, $17, $18, $19, $20
     )
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title,
       published = TRUE,
       data = '{}'::jsonb,
       role = EXCLUDED.role,
       domain = EXCLUDED.domain,
       duration = EXCLUDED.duration,
       mode = EXCLUDED.mode,
       summary = EXCLUDED.summary,
       eligibility = EXCLUDED.eligibility,
       technologies = EXCLUDED.technologies,
       skills = EXCLUDED.skills,
       projects = EXCLUDED.projects,
       responsibilities = EXCLUDED.responsibilities,
       certificate = EXCLUDED.certificate,
       benefits = EXCLUDED.benefits,
       learning_outcomes = EXCLUDED.learning_outcomes,
       openings = EXCLUDED.openings,
       stipend = EXCLUDED.stipend,
       start_date = EXCLUDED.start_date,
       end_date = EXCLUDED.end_date,
       work_mode = EXCLUDED.work_mode,
       updated_at = NOW()`,
    [
      id,
      title,
      role,
      String(item.domain ?? ''),
      String(item.duration ?? ''),
      String(item.mode ?? ''),
      String(item.summary ?? ''),
      asStringArray(item.eligibility),
      asStringArray(item.technologies),
      asStringArray(item.skills),
      asStringArray(item.projects),
      asStringArray(item.responsibilities),
      String(item.certificate ?? ''),
      asStringArray(item.benefits),
      asStringArray(item.learningOutcomes),
      asOptionalInt(item.openings),
      asOptionalText(item.stipend),
      asOptionalDate(item.startDate),
      asOptionalDate(item.endDate) ?? asOptionalDate(item.applicationDeadline),
      asOptionalText(item.workMode),
    ],
  );
}

async function upsertService(
  pool: Pool,
  categoryId: string,
  service: JsonObject,
) {
  const slug = String(service.slug);
  const title = String(service.title ?? slug);
  const faqs = asFaqs(service.faqs);
  await pool.query(
    `INSERT INTO services (
       category_id, slug, title, published, data,
       short_description, description,
       benefits, features, technologies, process, deliverables,
       faq_questions, faq_answers, faqs
     ) VALUES (
       $1, $2, $3, TRUE, '{}'::jsonb,
       $4, $5,
       $6, $7, $8, $9, $10,
       $11, $12, '[]'::jsonb
     )
     ON CONFLICT (category_id, slug) DO UPDATE SET
       title = EXCLUDED.title,
       published = TRUE,
       data = '{}'::jsonb,
       short_description = EXCLUDED.short_description,
       description = EXCLUDED.description,
       benefits = EXCLUDED.benefits,
       features = EXCLUDED.features,
       technologies = EXCLUDED.technologies,
       process = EXCLUDED.process,
       deliverables = EXCLUDED.deliverables,
       faq_questions = EXCLUDED.faq_questions,
       faq_answers = EXCLUDED.faq_answers,
       faqs = '[]'::jsonb,
       updated_at = NOW()`,
    [
      categoryId,
      slug,
      title,
      String(service.shortDescription ?? ''),
      String(service.description ?? ''),
      asStringArray(service.benefits),
      asStringArray(service.features),
      asStringArray(service.technologies),
      asStringArray(service.process),
      asStringArray(service.deliverables),
      faqs.map((f) => f.question),
      faqs.map((f) => f.answer),
    ],
  );
}

async function upsertProject(pool: Pool, project: JsonObject) {
  const id = String(project.id);
  const title = String(project.title ?? id);
  await pool.query(
    `INSERT INTO projects (
       id, title, published, data,
       category, client_type, timeline, status,
       overview, problem, solution,
       technologies, features, deliverables, results, screenshots, related_ids
     ) VALUES (
       $1, $2, TRUE, '{}'::jsonb,
       $3, $4, $5, $6,
       $7, $8, $9,
       $10, $11, $12, $13, $14, $15
     )
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title,
       published = TRUE,
       data = '{}'::jsonb,
       category = EXCLUDED.category,
       client_type = EXCLUDED.client_type,
       timeline = EXCLUDED.timeline,
       status = EXCLUDED.status,
       overview = EXCLUDED.overview,
       problem = EXCLUDED.problem,
       solution = EXCLUDED.solution,
       technologies = EXCLUDED.technologies,
       features = EXCLUDED.features,
       deliverables = EXCLUDED.deliverables,
       results = EXCLUDED.results,
       screenshots = EXCLUDED.screenshots,
       related_ids = EXCLUDED.related_ids,
       updated_at = NOW()`,
    [
      id,
      title,
      String(project.category ?? ''),
      String(project.clientType ?? ''),
      String(project.timeline ?? ''),
      String(project.status ?? ''),
      String(project.overview ?? ''),
      String(project.problem ?? ''),
      String(project.solution ?? ''),
      asStringArray(project.technologies),
      asStringArray(project.features),
      asStringArray(project.deliverables),
      asStringArray(project.results),
      asStringArray(project.screenshots),
      asStringArray(project.relatedIds),
    ],
  );
}

async function upsertPortfolio(pool: Pool, item: JsonObject) {
  const id = String(item.id);
  const title = String(item.title ?? id);
  await pool.query(
    `INSERT INTO portfolio_items (
       id, title, published, data,
       category, industry, year, role, timeline,
       overview, problem, solution, challenge, strategy, development,
       technology_narrative, technologies, features, deliverables,
       results, case_results, metrics, gallery_labels, related_ids
     ) VALUES (
       $1, $2, TRUE, '{}'::jsonb,
       $3, $4, $5, $6, $7,
       $8, $9, $10, $11, $12, $13,
       $14, $15, $16, $17,
       $18, $19, $20, $21, $22
     )
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title,
       published = TRUE,
       data = '{}'::jsonb,
       category = EXCLUDED.category,
       industry = EXCLUDED.industry,
       year = EXCLUDED.year,
       role = EXCLUDED.role,
       timeline = EXCLUDED.timeline,
       overview = EXCLUDED.overview,
       problem = EXCLUDED.problem,
       solution = EXCLUDED.solution,
       challenge = EXCLUDED.challenge,
       strategy = EXCLUDED.strategy,
       development = EXCLUDED.development,
       technology_narrative = EXCLUDED.technology_narrative,
       technologies = EXCLUDED.technologies,
       features = EXCLUDED.features,
       deliverables = EXCLUDED.deliverables,
       results = EXCLUDED.results,
       case_results = EXCLUDED.case_results,
       metrics = EXCLUDED.metrics,
       gallery_labels = EXCLUDED.gallery_labels,
       related_ids = EXCLUDED.related_ids,
       updated_at = NOW()`,
    [
      id,
      title,
      String(item.category ?? ''),
      String(item.industry ?? ''),
      String(item.year ?? ''),
      String(item.role ?? ''),
      String(item.timeline ?? ''),
      String(item.overview ?? ''),
      String(item.problem ?? ''),
      String(item.solution ?? ''),
      String(item.challenge ?? ''),
      String(item.strategy ?? ''),
      String(item.development ?? ''),
      String(item.technologyNarrative ?? ''),
      asStringArray(item.technologies),
      asStringArray(item.features),
      asStringArray(item.deliverables),
      asStringArray(item.results),
      asStringArray(item.caseResults),
      metricsToColumn(item.metrics),
      asStringArray(item.galleryLabels),
      asStringArray(item.relatedIds),
    ],
  );
}

async function upsertBlog(pool: Pool, post: JsonObject) {
  const slug = String(post.slug ?? post.id);
  const id = String(post.id ?? slug);
  const title = String(post.title ?? id);
  await pool.query(
    `INSERT INTO blog_posts (
       id, title, published, data,
       slug, author, post_date, category, reading_time, excerpt,
       tags, content, featured
     ) VALUES (
       $1, $2, TRUE, '{}'::jsonb,
       $3, $4, $5, $6, $7, $8,
       $9, $10, $11
     )
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title,
       published = TRUE,
       data = '{}'::jsonb,
       slug = EXCLUDED.slug,
       author = EXCLUDED.author,
       post_date = EXCLUDED.post_date,
       category = EXCLUDED.category,
       reading_time = EXCLUDED.reading_time,
       excerpt = EXCLUDED.excerpt,
       tags = EXCLUDED.tags,
       content = EXCLUDED.content,
       featured = EXCLUDED.featured,
       updated_at = NOW()`,
    [
      id,
      title,
      slug,
      String(post.author ?? ''),
      String(post.date ?? ''),
      String(post.category ?? ''),
      String(post.readingTime ?? ''),
      String(post.excerpt ?? ''),
      asStringArray(post.tags),
      asStringArray(post.content),
      post.featured === true,
    ],
  );
}

async function upsertAbout(pool: Pool, about: typeof ABOUT_CONTENT) {
  const journeyTitles = about.journey.map((j) => j.title);
  const journeyTexts = about.journey.map((j) => j.text);
  const valueTitles = about.values.map((v) => v.title);
  const valueDescriptions = about.values.map((v) => v.description);
  const valueAccents = about.values.map((v) => v.accent ?? '');
  await pool.query(
    `INSERT INTO about_content (
       id, data, vision, mission, why_choose,
       journey_titles, journey_texts,
       value_titles, value_descriptions, value_accents, updated_at
     ) VALUES (
       'main', '{}'::jsonb, $1, $2, $3,
       $4, $5,
       $6, $7, $8, NOW()
     )
     ON CONFLICT (id) DO UPDATE SET
       data = '{}'::jsonb,
       vision = EXCLUDED.vision,
       mission = EXCLUDED.mission,
       why_choose = EXCLUDED.why_choose,
       journey_titles = EXCLUDED.journey_titles,
       journey_texts = EXCLUDED.journey_texts,
       value_titles = EXCLUDED.value_titles,
       value_descriptions = EXCLUDED.value_descriptions,
       value_accents = EXCLUDED.value_accents,
       updated_at = NOW()`,
    [
      about.vision,
      about.mission,
      about.whyChoose,
      journeyTitles,
      journeyTexts,
      valueTitles,
      valueDescriptions,
      valueAccents,
    ],
  );
}

async function seedAdmin(pool: Pool) {
  const existing = await pool.query(`SELECT id FROM users WHERE email = $1`, [
    ADMIN_EMAIL,
  ]);
  if (existing.rowCount && existing.rowCount > 0) {
    console.log(`[seed] Admin user already exists (${ADMIN_EMAIL})`);
    return;
  }

  const passwordHash = await hashPassword(ADMIN_PASSWORD);
  await pool.query(
    `INSERT INTO users (email, password_hash, name, role, is_verified)
     VALUES ($1, $2, 'Admin', 'admin', TRUE)`,
    [ADMIN_EMAIL, passwordHash],
  );
  console.log(`[seed] Created admin user ${ADMIN_EMAIL}`);
}

async function seed() {
  if (!isDatabaseConfigured || !env.DATABASE_URL) {
    console.error('[seed] DATABASE_URL is not set in .env');
    process.exit(1);
  }

  const data = await loadClientData();
  const pool = new Pool({ connectionString: env.DATABASE_URL });

  try {
    console.log('[seed] Upserting CMS content...');

    await pool.query(
      `DELETE FROM job_applications WHERE job_id !~ '^QDLJB-[0-9]+$'`,
    );
    await pool.query(`DELETE FROM jobs WHERE id !~ '^QDLJB-[0-9]+$'`);
    await pool.query(
      `DELETE FROM internship_applications WHERE internship_id !~ '^QDLIN-[0-9]+$'`,
    );
    await pool.query(`DELETE FROM internships WHERE id !~ '^QDLIN-[0-9]+$'`);
    await pool.query(`DELETE FROM projects WHERE id !~ '^QDLPJ-[0-9]+$'`);
    await pool.query(`DELETE FROM portfolio_items WHERE id !~ '^QDLPF-[0-9]+$'`);
    await pool.query(`DELETE FROM blog_posts WHERE id !~ '^QDLBL-[0-9]+$'`);

    for (const job of data.jobs) {
      await upsertJob(pool, job);
    }
    console.log(`  jobs: ${data.jobs.length}`);

    for (const item of data.internships) {
      await upsertInternship(pool, item);
    }
    console.log(`  internships: ${data.internships.length}`);

    for (const project of data.projects) {
      await upsertProject(pool, project);
    }
    console.log(`  projects: ${data.projects.length}`);

    for (const item of data.portfolio) {
      await upsertPortfolio(pool, item);
    }
    console.log(`  portfolio: ${data.portfolio.length}`);

    for (const post of data.blog) {
      await upsertBlog(pool, post);
    }
    console.log(`  blog: ${data.blog.length}`);

    const { syncBusinessIdCounters } = await import('../utils/businessId');
    await syncBusinessIdCounters(pool);

    let serviceCount = 0;
    for (let i = 0; i < data.serviceCategories.length; i++) {
      const category = data.serviceCategories[i]!;
      const categoryId = String(category.id);
      const services = (category.services as JsonObject[] | undefined) ?? [];

      await pool.query(
        `INSERT INTO service_categories (id, title, path, description, sort_order, published)
         VALUES ($1, $2, $3, $4, $5, TRUE)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           path = EXCLUDED.path,
           description = EXCLUDED.description,
           sort_order = EXCLUDED.sort_order,
           published = TRUE,
           updated_at = NOW()`,
        [
          categoryId,
          String(category.title ?? categoryId),
          String(category.path ?? `/services/${categoryId}`),
          String(category.description ?? ''),
          i,
        ],
      );

      for (const service of services) {
        await upsertService(pool, categoryId, service);
        serviceCount += 1;
      }
    }
    console.log(
      `  service categories: ${data.serviceCategories.length}, services: ${serviceCount}`,
    );

    await upsertAbout(pool, ABOUT_CONTENT);
    console.log('  about_content: main');

    await seedAdmin(pool);
    console.log('[seed] Done.');
  } finally {
    await pool.end();
  }
}

seed().catch((error) => {
  console.error('[seed] Failed:', error);
  process.exit(1);
});
