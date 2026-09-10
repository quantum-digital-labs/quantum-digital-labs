import type { BlogArticle } from '../data/blog';
import type { InternshipProgram } from '../data/internships';
import type { JobListing } from '../data/jobs';
import type { PortfolioItem } from '../data/portfolio';
import type { ProjectItem } from '../data/projects';
import type { ServiceCategory, ServiceItem } from '../types/content';
import { apiClient } from './apiClient';

export type ContentKind = 'jobs' | 'internships' | 'projects' | 'portfolio' | 'blog';

export type ContentRecord = Record<string, unknown> & {
  id?: string;
  slug?: string;
  title?: string;
  published?: boolean;
};

export type JobContent = JobListing & { published?: boolean };
export type InternshipContent = InternshipProgram & { published?: boolean; title?: string };
export type ProjectContent = ProjectItem & { published?: boolean };
export type PortfolioContent = PortfolioItem & { published?: boolean };
export type BlogContent = BlogArticle & { id?: string; published?: boolean };

export type ServiceCategoryContent = ServiceCategory & { published?: boolean };
export type ServiceItemContent = ServiceItem & { published?: boolean };

export interface AboutContent {
  journey?: { title: string; text: string }[];
  vision?: string;
  mission?: string;
  whyChoose?: string[];
  values?: { title: string; description: string; accent?: string }[];
  [key: string]: unknown;
}

function kindPath(kind: ContentKind): string {
  return `/content/${kind}`;
}

async function listKind<T>(kind: ContentKind): Promise<T[]> {
  const { data } = await apiClient.get<T[]>(kindPath(kind));
  return data;
}

async function getKind<T>(kind: ContentKind, id: string): Promise<T> {
  const { data } = await apiClient.get<T>(`${kindPath(kind)}/${encodeURIComponent(id)}`);
  return data;
}

async function createKind<T>(kind: ContentKind, body: ContentRecord): Promise<T> {
  const { data } = await apiClient.post<T>(kindPath(kind), body);
  return data;
}

async function updateKind<T>(
  kind: ContentKind,
  id: string,
  body: ContentRecord,
): Promise<T> {
  const { data } = await apiClient.patch<T>(
    `${kindPath(kind)}/${encodeURIComponent(id)}`,
    body,
  );
  return data;
}

async function deleteKind(kind: ContentKind, id: string): Promise<void> {
  await apiClient.delete(`${kindPath(kind)}/${encodeURIComponent(id)}`);
}

// —— Jobs ——
export const fetchJobs = () => listKind<JobContent>('jobs');
export const fetchJob = (id: string) => getKind<JobContent>('jobs', id);
export const createJob = (body: ContentRecord) => createKind<JobContent>('jobs', body);
export const updateJob = (id: string, body: ContentRecord) =>
  updateKind<JobContent>('jobs', id, body);
export const deleteJob = (id: string) => deleteKind('jobs', id);

// —— Internships ——
export const fetchInternships = () => listKind<InternshipContent>('internships');
export const fetchInternship = (id: string) =>
  getKind<InternshipContent>('internships', id);
export const createInternship = (body: ContentRecord) =>
  createKind<InternshipContent>('internships', body);
export const updateInternship = (id: string, body: ContentRecord) =>
  updateKind<InternshipContent>('internships', id, body);
export const deleteInternship = (id: string) => deleteKind('internships', id);

// —— Projects ——
export const fetchProjects = () => listKind<ProjectContent>('projects');
export const fetchProject = (id: string) => getKind<ProjectContent>('projects', id);
export const createProject = (body: ContentRecord) =>
  createKind<ProjectContent>('projects', body);
export const updateProject = (id: string, body: ContentRecord) =>
  updateKind<ProjectContent>('projects', id, body);
export const deleteProject = (id: string) => deleteKind('projects', id);

// —— Portfolio ——
export const fetchPortfolio = () => listKind<PortfolioContent>('portfolio');
export const fetchPortfolioItem = (id: string) =>
  getKind<PortfolioContent>('portfolio', id);
export const createPortfolioItem = (body: ContentRecord) =>
  createKind<PortfolioContent>('portfolio', body);
export const updatePortfolioItem = (id: string, body: ContentRecord) =>
  updateKind<PortfolioContent>('portfolio', id, body);
export const deletePortfolioItem = (id: string) => deleteKind('portfolio', id);

// —— Blog ——
export const fetchBlog = () => listKind<BlogContent>('blog');
export const fetchBlogPost = (slug: string) => getKind<BlogContent>('blog', slug);
export const createBlogPost = (body: ContentRecord) =>
  createKind<BlogContent>('blog', body);
export const updateBlogPost = (slug: string, body: ContentRecord) =>
  updateKind<BlogContent>('blog', slug, body);
export const deleteBlogPost = (slug: string) => deleteKind('blog', slug);

// —— Services ——
export async function fetchServices(options?: {
  includeUnpublished?: boolean;
}): Promise<ServiceCategoryContent[]> {
  const { data } = await apiClient.get<ServiceCategoryContent[]>('/content/services', {
    params: options?.includeUnpublished ? { all: '1' } : undefined,
  });
  return data;
}

export async function fetchServiceCategory(
  categoryId: string,
): Promise<ServiceCategoryContent> {
  const { data } = await apiClient.get<ServiceCategoryContent>(
    `/content/services/${encodeURIComponent(categoryId)}`,
  );
  return data;
}

export async function fetchService(
  categoryId: string,
  slug: string,
): Promise<ServiceItemContent> {
  const { data } = await apiClient.get<ServiceItemContent>(
    `/content/services/${encodeURIComponent(categoryId)}/${encodeURIComponent(slug)}`,
  );
  return data;
}

export async function createServiceCategory(
  body: ContentRecord,
): Promise<ServiceCategoryContent> {
  const { data } = await apiClient.post<ServiceCategoryContent>(
    '/content/services/categories',
    body,
  );
  return data;
}

export async function updateServiceCategory(
  categoryId: string,
  body: ContentRecord,
): Promise<ServiceCategoryContent> {
  const { data } = await apiClient.patch<ServiceCategoryContent>(
    `/content/services/categories/${encodeURIComponent(categoryId)}`,
    body,
  );
  return data;
}

export async function deleteServiceCategory(categoryId: string): Promise<void> {
  await apiClient.delete(
    `/content/services/categories/${encodeURIComponent(categoryId)}`,
  );
}

export async function createService(
  categoryId: string,
  body: ContentRecord,
): Promise<ServiceItemContent> {
  const { data } = await apiClient.post<ServiceItemContent>(
    `/content/services/${encodeURIComponent(categoryId)}`,
    body,
  );
  return data;
}

export async function updateService(
  categoryId: string,
  slug: string,
  body: ContentRecord,
): Promise<ServiceItemContent> {
  const { data } = await apiClient.patch<ServiceItemContent>(
    `/content/services/${encodeURIComponent(categoryId)}/${encodeURIComponent(slug)}`,
    body,
  );
  return data;
}

export async function deleteService(categoryId: string, slug: string): Promise<void> {
  await apiClient.delete(
    `/content/services/${encodeURIComponent(categoryId)}/${encodeURIComponent(slug)}`,
  );
}

// —— About ——
export async function fetchAbout(): Promise<AboutContent> {
  const { data } = await apiClient.get<AboutContent>('/content/about');
  return data;
}

export async function updateAbout(body: AboutContent): Promise<AboutContent> {
  const { data } = await apiClient.put<AboutContent>('/content/about', body);
  return data;
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
