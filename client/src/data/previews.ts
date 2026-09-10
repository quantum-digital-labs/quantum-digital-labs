import type {
  BlogPreview,
  InternshipPreview,
  JobPreview,
  PortfolioPreview,
} from '../types';

/** Development preview content for navigation loops — not production claims. */
export const PREVIEW_JOBS: JobPreview[] = [
  {
    id: 'QDLJB-0001',
    title: 'Full Stack Developer',
    location: 'Remote / Hybrid',
    employmentType: 'Full-time',
    experience: '0-2 years',
  },
  {
    id: 'QDLJB-0002',
    title: 'Digital Marketing Executive',
    location: 'On-site / Hybrid',
    employmentType: 'Full-time',
    experience: '0-2 years',
  },
  {
    id: 'QDLJB-0003',
    title: 'HR Recruiter',
    location: 'Hybrid',
    employmentType: 'Full-time',
    experience: '3-5 years',
  },
];

export const PREVIEW_INTERNSHIPS: InternshipPreview[] = [
  {
    id: 'QDLIN-0001',
    domain: 'Full Stack Development',
    duration: '8–12 weeks',
    mode: 'Online / Hybrid',
  },
  {
    id: 'QDLIN-0005',
    domain: 'Data Science',
    duration: '8–12 weeks',
    mode: 'Online',
  },
  {
    id: 'QDLIN-0009',
    domain: 'Digital Marketing',
    duration: '6–10 weeks',
    mode: 'Online / Hybrid',
  },
];

export const PREVIEW_PORTFOLIO: PortfolioPreview[] = [
  {
    id: 'QDLPJ-0001',
    title: 'Corporate Web Platform',
    category: 'Web',
    summary: 'Responsive corporate website architecture with service and lead flows.',
  },
  {
    id: 'QDLPJ-0002',
    title: 'Recruitment Portal Concept',
    category: 'Web',
    summary: 'Job listing and application experience for candidates and hiring teams.',
  },
  {
    id: 'QDLPJ-0003',
    title: 'Training Program Module',
    category: 'Education',
    summary: 'Program catalog and registration flow for training offerings.',
  },
];

export const PREVIEW_BLOGS: BlogPreview[] = [
  {
    slug: 'building-reliable-digital-products',
    title: 'Building Reliable Digital Products',
    category: 'Technology',
    excerpt: 'Practical principles for shipping maintainable web products.',
  },
  {
    slug: 'how-students-can-prepare-for-internships',
    title: 'How Students Can Prepare for Internships',
    category: 'Career',
    excerpt: 'A simple checklist for students entering internship programs.',
  },
  {
    slug: 'digital-marketing-foundations-for-startups',
    title: 'Digital Marketing Foundations for Startups',
    category: 'Digital Marketing',
    excerpt: 'Core channels startups can use to generate early demand.',
  },
];
