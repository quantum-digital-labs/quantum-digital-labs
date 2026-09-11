import type { BlogArticle } from '../data/blog';
import type { InternshipProgram } from '../data/internships';
import type { JobListing } from '../data/jobs';
import type { PortfolioItem } from '../data/portfolio';
import type { ProjectItem } from '../data/projects';
import type { ServiceCategory, ServiceItem } from '../types/content';
import { supabase } from '../lib/supabaseClient';

export type ContentKind = 'jobs' | 'internships' | 'projects' | 'portfolio' | 'blog';

export type JobContent = JobListing & { published?: boolean };
export type InternshipContent = InternshipProgram & { published?: boolean; title?: string };
export type ProjectContent = ProjectItem & { published?: boolean };
export type PortfolioContent = PortfolioItem & { published?: boolean };
export type BlogContent = BlogArticle & { id?: string; published?: boolean };

export type ServiceCategoryContent = ServiceCategory & { published?: boolean };
export type ServiceItemContent = ServiceItem & { published?: boolean };

/** Loose shape used by the generic admin CMS list/editor pages. */
export type ContentRecord = {
  id?: string;
  slug?: string;
  title?: string;
  published?: boolean;
  role?: unknown;
  [key: string]: unknown;
};

/** Untyped query builder — no generated Database types exist for this
 * project, so we bypass supabase-js's strict select-string parsing here and
 * rely on the hand-written row-mappers below for real typing. */
const db = supabase as any;

export interface AboutContent {
  journey?: { title: string; text: string }[];
  vision?: string;
  mission?: string;
  whyChoose?: string[];
  values?: { title: string; description: string; accent?: string }[];
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Shared helpers (mirrors server/src/utils/cmsHelpers.ts + middleware/upload.ts
// so the shapes returned here are byte-identical to the old Express API).
// ---------------------------------------------------------------------------

const DEFAULT_PROJECT_SCREENSHOT = '/defaults/project-screenshot.jpg';
const DEFAULT_PORTFOLIO_GALLERY = [
  '/defaults/portfolio-gallery-1.jpg',
  '/defaults/portfolio-gallery-2.jpg',
  '/defaults/portfolio-gallery-3.jpg',
];
const DEFAULT_PROJECT_COVER = '/defaults/project-cover.jpg';
const DEFAULT_PORTFOLIO_COVER = '/defaults/portfolio-cover.jpg';
const DEFAULT_SERVICE_COVER = '/defaults/service-cover.jpg';

function arr(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)).filter(Boolean) : [];
}

function isStoredImageUrl(value: string): boolean {
  const trimmed = value.trim();
  return (
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('/defaults/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/')
  );
}

function resolveCoverImage(value: unknown, fallback: string): string {
  const trimmed = String(value ?? '').trim();
  return isStoredImageUrl(trimmed) ? trimmed : fallback;
}

function resolveScreenshots(value: unknown): string[] {
  const list = arr(value).filter(isStoredImageUrl);
  return list.length > 0 ? list : [DEFAULT_PROJECT_SCREENSHOT];
}

function resolveGalleryLabels(value: unknown): string[] {
  const list = arr(value).filter(isStoredImageUrl);
  return list.length > 0 ? list : [...DEFAULT_PORTFOLIO_GALLERY];
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

function columnToMetrics(values: string[] | null | undefined) {
  return (values ?? [])
    .map((line) => {
      const text = String(line);
      const idx = text.indexOf('|');
      if (idx === -1) return { label: text.trim(), value: '' };
      return { label: text.slice(0, idx).trim(), value: text.slice(idx + 1).trim() };
    })
    .filter((m) => m.label || m.value);
}

function columnsToFaqs(questions: string[] | null | undefined, answers: string[] | null | undefined) {
  const q = questions ?? [];
  const a = answers ?? [];
  const len = Math.max(q.length, a.length);
  const out: { question: string; answer: string }[] = [];
  for (let i = 0; i < len; i++) {
    const question = String(q[i] ?? '').trim();
    const answer = String(a[i] ?? '').trim();
    if (question || answer) out.push({ question, answer });
  }
  return out;
}

function faqsToColumns(faqs: { question: string; answer: string }[]) {
  return { questions: faqs.map((f) => f.question), answers: faqs.map((f) => f.answer) };
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
    .filter((v): v is { question: string; answer: string } => v !== null);
}

async function nextBusinessId(
  kind: 'job' | 'internship' | 'project' | 'portfolio' | 'blog',
): Promise<string> {
  const { data, error } = await supabase.rpc('next_business_id', { kind });
  if (error) throw new Error(error.message);
  return data as string;
}

function checkError<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data as T;
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

const JOB_SELECT =
  'id, uuid, title, published, summary, location, department, experience, job_type, ' +
  'skills, responsibilities, requirements, benefits, openings, salary, application_deadline, work_mode';

function mapJobRow(row: Record<string, unknown>): JobContent {
  const result: Record<string, unknown> = {
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
  if (row.application_deadline) result.applicationDeadline = String(row.application_deadline).slice(0, 10);
  if (row.work_mode) result.workMode = row.work_mode;
  return result as unknown as JobContent;
}

export async function fetchJobs(): Promise<JobContent[]> {
  const res = await db.from('jobs').select(JOB_SELECT).order('updated_at', { ascending: false });
  return checkError<Record<string, unknown>[]>(res).map(mapJobRow);
}

export async function fetchJob(id: string): Promise<JobContent> {
  const res = await db.from('jobs').select(JOB_SELECT).eq('id', id).single();
  return mapJobRow(checkError<Record<string, unknown>>(res));
}

export async function createJob(rawBody: object): Promise<JobContent> {
  const body = rawBody as Record<string, unknown>;
  const id = await nextBusinessId('job');
  const insert = {
    id,
    title: String(body.title ?? id),
    published: body.published !== false,
    data: {},
    summary: String(body.summary ?? ''),
    location: String(body.location ?? ''),
    department: String(body.department ?? ''),
    experience: String(body.experience ?? ''),
    job_type: String(body.jobType ?? ''),
    skills: arr(body.skills),
    responsibilities: arr(body.responsibilities),
    requirements: arr(body.requirements),
    benefits: arr(body.benefits),
    openings: body.openings ?? null,
    salary: body.salary ?? null,
    application_deadline: body.applicationDeadline ?? null,
    work_mode: body.workMode ?? null,
  };
  const res = await db.from('jobs').insert(insert).select(JOB_SELECT).single();
  return mapJobRow(checkError<Record<string, unknown>>(res));
}

export async function updateJob(id: string, rawBody: object): Promise<JobContent> {
  const body = rawBody as Record<string, unknown>;
  const update: Record<string, unknown> = { data: {}, updated_at: new Date().toISOString() };
  if (body.title !== undefined) update.title = String(body.title);
  if (body.published !== undefined) update.published = body.published === true;
  if (body.summary !== undefined) update.summary = String(body.summary);
  if (body.location !== undefined) update.location = String(body.location);
  if (body.department !== undefined) update.department = String(body.department);
  if (body.experience !== undefined) update.experience = String(body.experience);
  if (body.jobType !== undefined) update.job_type = String(body.jobType);
  if (body.skills !== undefined) update.skills = arr(body.skills);
  if (body.responsibilities !== undefined) update.responsibilities = arr(body.responsibilities);
  if (body.requirements !== undefined) update.requirements = arr(body.requirements);
  if (body.benefits !== undefined) update.benefits = arr(body.benefits);
  if (body.openings !== undefined) update.openings = body.openings;
  if (body.salary !== undefined) update.salary = body.salary;
  if (body.applicationDeadline !== undefined) update.application_deadline = body.applicationDeadline;
  if (body.workMode !== undefined) update.work_mode = body.workMode;

  const res = await db.from('jobs').update(update).eq('id', id).select(JOB_SELECT).single();
  return mapJobRow(checkError<Record<string, unknown>>(res));
}

export async function deleteJob(id: string): Promise<void> {
  const { error } = await db.from('jobs').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Internships
// ---------------------------------------------------------------------------

const INTERNSHIP_SELECT =
  'id, uuid, title, published, role, domain, duration, mode, summary, eligibility, technologies, ' +
  'skills, projects, responsibilities, certificate, benefits, learning_outcomes, openings, stipend, ' +
  'start_date, end_date, work_mode';

function mapInternshipRow(row: Record<string, unknown>): InternshipContent {
  const result: Record<string, unknown> = {
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
  if (row.start_date) result.startDate = String(row.start_date).slice(0, 10);
  if (row.end_date) result.endDate = String(row.end_date).slice(0, 10);
  if (row.work_mode) result.workMode = row.work_mode;
  return result as unknown as InternshipContent;
}

export async function fetchInternships(): Promise<InternshipContent[]> {
  const res = await db
    .from('internships')
    .select(INTERNSHIP_SELECT)
    .order('updated_at', { ascending: false });
  return checkError<Record<string, unknown>[]>(res).map(mapInternshipRow);
}

export async function fetchInternship(id: string): Promise<InternshipContent> {
  const res = await db.from('internships').select(INTERNSHIP_SELECT).eq('id', id).single();
  return mapInternshipRow(checkError<Record<string, unknown>>(res));
}

export async function createInternship(rawBody: object): Promise<InternshipContent> {
  const body = rawBody as Record<string, unknown>;
  const id = await nextBusinessId('internship');
  const role = String(body.role ?? body.title ?? id);
  const insert = {
    id,
    title: String(body.title ?? role),
    published: body.published !== false,
    data: {},
    role,
    domain: String(body.domain ?? ''),
    duration: String(body.duration ?? ''),
    mode: String(body.mode ?? ''),
    summary: String(body.summary ?? ''),
    eligibility: arr(body.eligibility),
    technologies: arr(body.technologies),
    skills: arr(body.skills),
    projects: arr(body.projects),
    responsibilities: arr(body.responsibilities),
    certificate: String(body.certificate ?? ''),
    benefits: arr(body.benefits),
    learning_outcomes: arr(body.learningOutcomes),
    openings: body.openings ?? null,
    stipend: body.stipend ?? null,
    start_date: body.startDate ?? null,
    end_date: body.endDate ?? body.applicationDeadline ?? null,
    work_mode: body.workMode ?? null,
  };
  const res = await db.from('internships').insert(insert).select(INTERNSHIP_SELECT).single();
  return mapInternshipRow(checkError<Record<string, unknown>>(res));
}

export async function updateInternship(
  id: string,
  rawBody: object,
): Promise<InternshipContent> {
  const body = rawBody as Record<string, unknown>;
  const update: Record<string, unknown> = { data: {}, updated_at: new Date().toISOString() };
  if (body.title !== undefined) update.title = String(body.title);
  if (body.role !== undefined) update.role = String(body.role);
  if (body.published !== undefined) update.published = body.published === true;
  if (body.domain !== undefined) update.domain = String(body.domain);
  if (body.duration !== undefined) update.duration = String(body.duration);
  if (body.mode !== undefined) update.mode = String(body.mode);
  if (body.summary !== undefined) update.summary = String(body.summary);
  if (body.eligibility !== undefined) update.eligibility = arr(body.eligibility);
  if (body.technologies !== undefined) update.technologies = arr(body.technologies);
  if (body.skills !== undefined) update.skills = arr(body.skills);
  if (body.projects !== undefined) update.projects = arr(body.projects);
  if (body.responsibilities !== undefined) update.responsibilities = arr(body.responsibilities);
  if (body.certificate !== undefined) update.certificate = String(body.certificate);
  if (body.benefits !== undefined) update.benefits = arr(body.benefits);
  if (body.learningOutcomes !== undefined) update.learning_outcomes = arr(body.learningOutcomes);
  if (body.openings !== undefined) update.openings = body.openings;
  if (body.stipend !== undefined) update.stipend = body.stipend;
  if (body.startDate !== undefined) update.start_date = body.startDate;
  if (body.endDate !== undefined || body.applicationDeadline !== undefined) {
    update.end_date = body.endDate ?? body.applicationDeadline;
  }
  if (body.workMode !== undefined) update.work_mode = body.workMode;

  const res = await db
    .from('internships')
    .update(update)
    .eq('id', id)
    .select(INTERNSHIP_SELECT)
    .single();
  return mapInternshipRow(checkError<Record<string, unknown>>(res));
}

export async function deleteInternship(id: string): Promise<void> {
  const { error } = await db.from('internships').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

const PROJECT_SELECT =
  'id, uuid, title, published, category, client_type, timeline, status, overview, problem, solution, ' +
  'technologies, features, deliverables, results, screenshots, related_ids, image';

function mapProjectRow(row: Record<string, unknown>): ProjectContent {
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
  } as unknown as ProjectContent;
}

export async function fetchProjects(): Promise<ProjectContent[]> {
  const res = await db.from('projects').select(PROJECT_SELECT).order('updated_at', { ascending: false });
  return checkError<Record<string, unknown>[]>(res).map(mapProjectRow);
}

export async function fetchProject(id: string): Promise<ProjectContent> {
  const res = await db.from('projects').select(PROJECT_SELECT).eq('id', id).single();
  return mapProjectRow(checkError<Record<string, unknown>>(res));
}

export async function createProject(rawBody: object): Promise<ProjectContent> {
  const body = rawBody as Record<string, unknown>;
  const id = await nextBusinessId('project');
  const insert = {
    id,
    title: String(body.title ?? id),
    published: body.published !== false,
    data: {},
    category: String(body.category ?? ''),
    client_type: String(body.clientType ?? ''),
    timeline: String(body.timeline ?? ''),
    status: String(body.status ?? ''),
    overview: String(body.overview ?? ''),
    problem: String(body.problem ?? ''),
    solution: String(body.solution ?? ''),
    technologies: arr(body.technologies),
    features: arr(body.features),
    deliverables: arr(body.deliverables),
    results: arr(body.results),
    screenshots: resolveScreenshots(body.screenshots),
    related_ids: arr(body.relatedIds),
    image: resolveCoverImage(body.image, DEFAULT_PROJECT_COVER),
  };
  const res = await db.from('projects').insert(insert).select(PROJECT_SELECT).single();
  return mapProjectRow(checkError<Record<string, unknown>>(res));
}

export async function updateProject(id: string, rawBody: object): Promise<ProjectContent> {
  const body = rawBody as Record<string, unknown>;
  const update: Record<string, unknown> = { data: {}, updated_at: new Date().toISOString() };
  if (body.title !== undefined) update.title = String(body.title);
  if (body.published !== undefined) update.published = body.published === true;
  if (body.category !== undefined) update.category = String(body.category);
  if (body.clientType !== undefined) update.client_type = String(body.clientType);
  if (body.timeline !== undefined) update.timeline = String(body.timeline);
  if (body.status !== undefined) update.status = String(body.status);
  if (body.overview !== undefined) update.overview = String(body.overview);
  if (body.problem !== undefined) update.problem = String(body.problem);
  if (body.solution !== undefined) update.solution = String(body.solution);
  if (body.technologies !== undefined) update.technologies = arr(body.technologies);
  if (body.features !== undefined) update.features = arr(body.features);
  if (body.deliverables !== undefined) update.deliverables = arr(body.deliverables);
  if (body.results !== undefined) update.results = arr(body.results);
  if (body.screenshots !== undefined) update.screenshots = resolveScreenshots(body.screenshots);
  if (body.relatedIds !== undefined) update.related_ids = arr(body.relatedIds);
  if (body.image !== undefined) update.image = resolveCoverImage(body.image, DEFAULT_PROJECT_COVER);

  const res = await db.from('projects').update(update).eq('id', id).select(PROJECT_SELECT).single();
  return mapProjectRow(checkError<Record<string, unknown>>(res));
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await db.from('projects').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Portfolio
// ---------------------------------------------------------------------------

const PORTFOLIO_SELECT =
  'id, uuid, title, published, category, industry, year, role, timeline, overview, problem, solution, ' +
  'challenge, strategy, development, technology_narrative, technologies, features, deliverables, results, ' +
  'case_results, metrics, gallery_labels, related_ids, image';

function mapPortfolioRow(row: Record<string, unknown>): PortfolioContent {
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
    metrics: columnToMetrics(row.metrics as string[] | null),
    galleryLabels: resolveGalleryLabels(row.gallery_labels),
    relatedIds: row.related_ids ?? [],
    image: resolveCoverImage(row.image, DEFAULT_PORTFOLIO_COVER),
  } as unknown as PortfolioContent;
}

export async function fetchPortfolio(): Promise<PortfolioContent[]> {
  const res = await db
    .from('portfolio_items')
    .select(PORTFOLIO_SELECT)
    .order('updated_at', { ascending: false });
  return checkError<Record<string, unknown>[]>(res).map(mapPortfolioRow);
}

export async function fetchPortfolioItem(id: string): Promise<PortfolioContent> {
  const res = await db.from('portfolio_items').select(PORTFOLIO_SELECT).eq('id', id).single();
  return mapPortfolioRow(checkError<Record<string, unknown>>(res));
}

export async function createPortfolioItem(rawBody: object): Promise<PortfolioContent> {
  const body = rawBody as Record<string, unknown>;
  const id = await nextBusinessId('portfolio');
  const insert = {
    id,
    title: String(body.title ?? id),
    published: body.published !== false,
    data: {},
    category: String(body.category ?? ''),
    industry: String(body.industry ?? ''),
    year: String(body.year ?? ''),
    role: String(body.role ?? ''),
    timeline: String(body.timeline ?? ''),
    overview: String(body.overview ?? ''),
    problem: String(body.problem ?? ''),
    solution: String(body.solution ?? ''),
    challenge: String(body.challenge ?? ''),
    strategy: String(body.strategy ?? ''),
    development: String(body.development ?? ''),
    technology_narrative: String(body.technologyNarrative ?? ''),
    technologies: arr(body.technologies),
    features: arr(body.features),
    deliverables: arr(body.deliverables),
    results: arr(body.results),
    case_results: arr(body.caseResults),
    metrics: metricsToColumn(body.metrics),
    gallery_labels: resolveGalleryLabels(body.galleryLabels),
    related_ids: arr(body.relatedIds),
    image: resolveCoverImage(body.image, DEFAULT_PORTFOLIO_COVER),
  };
  const res = await db.from('portfolio_items').insert(insert).select(PORTFOLIO_SELECT).single();
  return mapPortfolioRow(checkError<Record<string, unknown>>(res));
}

export async function updatePortfolioItem(
  id: string,
  rawBody: object,
): Promise<PortfolioContent> {
  const body = rawBody as Record<string, unknown>;
  const update: Record<string, unknown> = { data: {}, updated_at: new Date().toISOString() };
  if (body.title !== undefined) update.title = String(body.title);
  if (body.published !== undefined) update.published = body.published === true;
  if (body.category !== undefined) update.category = String(body.category);
  if (body.industry !== undefined) update.industry = String(body.industry);
  if (body.year !== undefined) update.year = String(body.year);
  if (body.role !== undefined) update.role = String(body.role);
  if (body.timeline !== undefined) update.timeline = String(body.timeline);
  if (body.overview !== undefined) update.overview = String(body.overview);
  if (body.problem !== undefined) update.problem = String(body.problem);
  if (body.solution !== undefined) update.solution = String(body.solution);
  if (body.challenge !== undefined) update.challenge = String(body.challenge);
  if (body.strategy !== undefined) update.strategy = String(body.strategy);
  if (body.development !== undefined) update.development = String(body.development);
  if (body.technologyNarrative !== undefined) update.technology_narrative = String(body.technologyNarrative);
  if (body.technologies !== undefined) update.technologies = arr(body.technologies);
  if (body.features !== undefined) update.features = arr(body.features);
  if (body.deliverables !== undefined) update.deliverables = arr(body.deliverables);
  if (body.results !== undefined) update.results = arr(body.results);
  if (body.caseResults !== undefined) update.case_results = arr(body.caseResults);
  if (body.metrics !== undefined) update.metrics = metricsToColumn(body.metrics);
  if (body.galleryLabels !== undefined) update.gallery_labels = resolveGalleryLabels(body.galleryLabels);
  if (body.relatedIds !== undefined) update.related_ids = arr(body.relatedIds);
  if (body.image !== undefined) update.image = resolveCoverImage(body.image, DEFAULT_PORTFOLIO_COVER);

  const res = await db
    .from('portfolio_items')
    .update(update)
    .eq('id', id)
    .select(PORTFOLIO_SELECT)
    .single();
  return mapPortfolioRow(checkError<Record<string, unknown>>(res));
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const { error } = await db.from('portfolio_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

const BLOG_SELECT =
  'id, uuid, title, published, slug, author, post_date, category, reading_time, excerpt, tags, content, featured';

function mapBlogRow(row: Record<string, unknown>): BlogContent {
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
  } as unknown as BlogContent;
}

export async function fetchBlog(): Promise<BlogContent[]> {
  const res = await db.from('blog_posts').select(BLOG_SELECT).order('updated_at', { ascending: false });
  return checkError<Record<string, unknown>[]>(res).map(mapBlogRow);
}

export async function fetchBlogPost(slug: string): Promise<BlogContent> {
  const res = await db.from('blog_posts').select(BLOG_SELECT).or(`id.eq.${slug},slug.eq.${slug}`).single();
  return mapBlogRow(checkError<Record<string, unknown>>(res));
}

export async function createBlogPost(rawBody: object): Promise<BlogContent> {
  const body = rawBody as Record<string, unknown>;
  const id = await nextBusinessId('blog');
  const slug = String(body.slug ?? id);
  const insert = {
    id,
    title: String(body.title ?? id),
    published: body.published !== false,
    data: {},
    slug,
    author: String(body.author ?? ''),
    post_date: String(body.date ?? ''),
    category: String(body.category ?? ''),
    reading_time: String(body.readingTime ?? ''),
    excerpt: String(body.excerpt ?? ''),
    tags: arr(body.tags),
    content: arr(body.content),
    featured: body.featured === true,
  };
  const res = await db.from('blog_posts').insert(insert).select(BLOG_SELECT).single();
  return mapBlogRow(checkError<Record<string, unknown>>(res));
}

export async function updateBlogPost(slug: string, rawBody: object): Promise<BlogContent> {
  const body = rawBody as Record<string, unknown>;
  const update: Record<string, unknown> = { data: {}, updated_at: new Date().toISOString() };
  if (body.title !== undefined) update.title = String(body.title);
  if (body.published !== undefined) update.published = body.published === true;
  if (body.slug !== undefined) update.slug = String(body.slug);
  if (body.author !== undefined) update.author = String(body.author);
  if (body.date !== undefined) update.post_date = String(body.date);
  if (body.category !== undefined) update.category = String(body.category);
  if (body.readingTime !== undefined) update.reading_time = String(body.readingTime);
  if (body.excerpt !== undefined) update.excerpt = String(body.excerpt);
  if (body.tags !== undefined) update.tags = arr(body.tags);
  if (body.content !== undefined) update.content = arr(body.content);
  if (body.featured !== undefined) update.featured = body.featured === true;

  const res = await db
    .from('blog_posts')
    .update(update)
    .or(`id.eq.${slug},slug.eq.${slug}`)
    .select(BLOG_SELECT)
    .single();
  return mapBlogRow(checkError<Record<string, unknown>>(res));
}

export async function deleteBlogPost(slug: string): Promise<void> {
  const { error } = await db.from('blog_posts').delete().or(`id.eq.${slug},slug.eq.${slug}`);
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

const SERVICE_SELECT =
  'id, category_id, slug, title, published, short_description, description, benefits, features, ' +
  'technologies, process, deliverables, faq_questions, faq_answers, image';

function mapServiceItem(row: Record<string, unknown>): ServiceItemContent {
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
    faqs: columnsToFaqs(row.faq_questions as string[] | null, row.faq_answers as string[] | null),
    image: resolveCoverImage(row.image, DEFAULT_SERVICE_COVER),
  } as unknown as ServiceItemContent;
}

export async function fetchServices(
  // RLS already returns unpublished rows to staff automatically; this option
  // is kept only for call-site compatibility with the old Express API.
  _options?: { includeUnpublished?: boolean },
): Promise<ServiceCategoryContent[]> {
  const [catsRes, svcRes] = await Promise.all([
    db
      .from('service_categories')
      .select('id, title, path, description, sort_order, published')
      .order('sort_order', { ascending: true })
      .order('title', { ascending: true }),
    db.from('services').select(SERVICE_SELECT).order('title', { ascending: true }),
  ]);
  const cats = checkError<Record<string, unknown>[]>(catsRes);
  const svcs = checkError<Record<string, unknown>[]>(svcRes);

  const byCategory = new Map<string, ServiceItemContent[]>();
  for (const row of svcs) {
    const list = byCategory.get(row.category_id as string) ?? [];
    list.push(mapServiceItem(row));
    byCategory.set(row.category_id as string, list);
  }

  return cats.map((cat) => ({
    id: cat.id,
    title: cat.title,
    path: cat.path,
    description: cat.description,
    published: cat.published,
    services: byCategory.get(cat.id as string) ?? [],
  })) as unknown as ServiceCategoryContent[];
}

export async function fetchServiceCategory(categoryId: string): Promise<ServiceCategoryContent> {
  const categories = await fetchServices();
  const found = categories.find((c) => c.id === categoryId);
  if (!found) throw new Error('Service category not found');
  return found;
}

export async function fetchService(categoryId: string, slug: string): Promise<ServiceItemContent> {
  const res = await db
    .from('services')
    .select(SERVICE_SELECT)
    .eq('category_id', categoryId)
    .eq('slug', slug)
    .single();
  return mapServiceItem(checkError<Record<string, unknown>>(res));
}

export async function createServiceCategory(
  rawBody: object,
): Promise<ServiceCategoryContent> {
  const body = rawBody as Record<string, unknown>;
  const id = String(body.id ?? '');
  if (!id) throw new Error('id is required');
  const insert = {
    id,
    title: String(body.title ?? id),
    path: String(body.path ?? `/services/${id}`),
    description: String(body.description ?? ''),
    sort_order: Number(body.sortOrder ?? 0),
    published: body.published !== false,
  };
  const { error } = await db.from('service_categories').upsert(insert);
  if (error) throw new Error(error.message);
  return fetchServiceCategory(id);
}

export async function updateServiceCategory(
  categoryId: string,
  rawBody: object,
): Promise<ServiceCategoryContent> {
  const body = rawBody as Record<string, unknown>;
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.title !== undefined) update.title = String(body.title);
  if (body.path !== undefined) update.path = String(body.path);
  if (body.description !== undefined) update.description = String(body.description);
  if (body.sortOrder !== undefined) update.sort_order = Number(body.sortOrder);
  if (body.published !== undefined) update.published = body.published === true;

  const { error } = await db.from('service_categories').update(update).eq('id', categoryId);
  if (error) throw new Error(error.message);
  return fetchServiceCategory(categoryId);
}

export async function deleteServiceCategory(categoryId: string): Promise<void> {
  const { error } = await db.from('service_categories').delete().eq('id', categoryId);
  if (error) throw new Error(error.message);
}

export async function createService(
  categoryId: string,
  rawBody: object,
): Promise<ServiceItemContent> {
  const body = rawBody as Record<string, unknown>;
  const slug = String(body.slug ?? '');
  if (!slug) throw new Error('slug is required');
  const faqs = asFaqs(body.faqs);
  const faqCols = faqsToColumns(faqs);
  const insert = {
    category_id: categoryId,
    slug,
    title: String(body.title ?? slug),
    published: body.published !== false,
    data: {},
    short_description: String(body.shortDescription ?? ''),
    description: String(body.description ?? ''),
    benefits: arr(body.benefits),
    features: arr(body.features),
    technologies: arr(body.technologies),
    process: arr(body.process),
    deliverables: arr(body.deliverables),
    faq_questions: faqCols.questions,
    faq_answers: faqCols.answers,
    faqs: [],
    image: resolveCoverImage(body.image, DEFAULT_SERVICE_COVER),
  };
  const res = await db.from('services').insert(insert).select(SERVICE_SELECT).single();
  return mapServiceItem(checkError<Record<string, unknown>>(res));
}

export async function updateService(
  categoryId: string,
  slug: string,
  rawBody: object,
): Promise<ServiceItemContent> {
  const body = rawBody as Record<string, unknown>;
  const update: Record<string, unknown> = { data: {}, updated_at: new Date().toISOString() };
  if (body.title !== undefined) update.title = String(body.title);
  if (body.published !== undefined) update.published = body.published === true;
  if (body.shortDescription !== undefined) update.short_description = String(body.shortDescription);
  if (body.description !== undefined) update.description = String(body.description);
  if (body.benefits !== undefined) update.benefits = arr(body.benefits);
  if (body.features !== undefined) update.features = arr(body.features);
  if (body.technologies !== undefined) update.technologies = arr(body.technologies);
  if (body.process !== undefined) update.process = arr(body.process);
  if (body.deliverables !== undefined) update.deliverables = arr(body.deliverables);
  if (body.faqs !== undefined) {
    const faqCols = faqsToColumns(asFaqs(body.faqs));
    update.faq_questions = faqCols.questions;
    update.faq_answers = faqCols.answers;
    update.faqs = [];
  }
  if (body.image !== undefined) update.image = resolveCoverImage(body.image, DEFAULT_SERVICE_COVER);

  const res = await db
    .from('services')
    .update(update)
    .eq('category_id', categoryId)
    .eq('slug', slug)
    .select(SERVICE_SELECT)
    .single();
  return mapServiceItem(checkError<Record<string, unknown>>(res));
}

export async function deleteService(categoryId: string, slug: string): Promise<void> {
  const { error } = await db.from('services').delete().eq('category_id', categoryId).eq('slug', slug);
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

const ABOUT_SELECT =
  'vision, mission, why_choose, journey_titles, journey_texts, value_titles, value_descriptions, value_accents';

function mapAboutRow(row: Record<string, unknown>): AboutContent {
  const journeyTitles = (row.journey_titles as string[] | null) ?? [];
  const journeyTexts = (row.journey_texts as string[] | null) ?? [];
  const journeyLen = Math.max(journeyTitles.length, journeyTexts.length);
  const journey: { title: string; text: string }[] = [];
  for (let i = 0; i < journeyLen; i++) {
    const title = String(journeyTitles[i] ?? '').trim();
    const text = String(journeyTexts[i] ?? '').trim();
    if (title || text) journey.push({ title, text });
  }

  const valueTitles = (row.value_titles as string[] | null) ?? [];
  const valueDescriptions = (row.value_descriptions as string[] | null) ?? [];
  const valueAccents = (row.value_accents as string[] | null) ?? [];
  const valuesLen = Math.max(valueTitles.length, valueDescriptions.length, valueAccents.length);
  const values: { title: string; description: string; accent?: string }[] = [];
  for (let i = 0; i < valuesLen; i++) {
    const title = String(valueTitles[i] ?? '').trim();
    const description = String(valueDescriptions[i] ?? '').trim();
    const accent = String(valueAccents[i] ?? '').trim();
    if (!title && !description && !accent) continue;
    values.push({ title, description, ...(accent ? { accent } : {}) });
  }

  return {
    vision: (row.vision as string) ?? '',
    mission: (row.mission as string) ?? '',
    whyChoose: (row.why_choose as string[]) ?? [],
    journey,
    values,
  };
}

export async function fetchAbout(): Promise<AboutContent> {
  const res = await db.from('about_content').select(ABOUT_SELECT).eq('id', 'main').single();
  return mapAboutRow(checkError<Record<string, unknown>>(res));
}

export async function updateAbout(body: AboutContent): Promise<AboutContent> {
  const journey = Array.isArray(body.journey) ? body.journey : [];
  const values = Array.isArray(body.values) ? body.values : [];
  const upsert = {
    id: 'main',
    data: {},
    vision: String(body.vision ?? ''),
    mission: String(body.mission ?? ''),
    why_choose: arr(body.whyChoose),
    journey_titles: journey.map((j) => String(j.title ?? '').trim()),
    journey_texts: journey.map((j) => String(j.text ?? '').trim()),
    value_titles: values.map((v) => String(v.title ?? '').trim()),
    value_descriptions: values.map((v) => String(v.description ?? '').trim()),
    value_accents: values.map((v) => String(v.accent ?? '').trim()),
    updated_at: new Date().toISOString(),
  };
  const res = await db.from('about_content').upsert(upsert).select(ABOUT_SELECT).single();
  return mapAboutRow(checkError<Record<string, unknown>>(res));
}

/** Generic helpers used by the admin CMS list/editor. */
export const contentApiByKind = {
  jobs: {
    list: fetchJobs,
    get: fetchJob,
    create: createJob,
    update: updateJob,
    remove: deleteJob,
    label: 'Jobs',
    basePath: '/admin/jobs',
    idField: 'id' as const,
  },
  internships: {
    list: fetchInternships,
    get: fetchInternship,
    create: createInternship,
    update: updateInternship,
    remove: deleteInternship,
    label: 'Internships',
    basePath: '/admin/internships',
    idField: 'id' as const,
  },
  projects: {
    list: fetchProjects,
    get: fetchProject,
    create: createProject,
    update: updateProject,
    remove: deleteProject,
    label: 'Projects',
    basePath: '/admin/projects',
    idField: 'id' as const,
  },
  portfolio: {
    list: fetchPortfolio,
    get: fetchPortfolioItem,
    create: createPortfolioItem,
    update: updatePortfolioItem,
    remove: deletePortfolioItem,
    label: 'Portfolio',
    basePath: '/admin/portfolio',
    idField: 'id' as const,
  },
  blog: {
    list: fetchBlog,
    get: fetchBlogPost,
    create: createBlogPost,
    update: updateBlogPost,
    remove: deleteBlogPost,
    label: 'Blog',
    basePath: '/admin/blog',
    idField: 'slug' as const,
  },
} as const;
