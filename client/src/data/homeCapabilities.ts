import { siteImages } from '../assets/images';
import { ROUTES } from '../constants';

export type HomeCapabilityVariant =
  | 'featured'
  | 'portrait'
  | 'split'
  | 'overlay'
  | 'accent-bar'
  | 'banner';

export interface HomeCapabilityItem {
  id: string;
  title: string;
  summary: string;
  highlights: readonly string[];
  path: string;
  image: string;
  imageAlt: string;
  accent: string;
  variant: HomeCapabilityVariant;
}

/**
 * Home capabilities — rendered in a 3-column equal grid (2 rows on desktop).
 */
export const HOME_CAPABILITY_CARDS: readonly HomeCapabilityItem[] = [
  {
    id: 'it-services',
    title: 'IT Services',
    summary: 'Engineering teams for web, mobile, cloud, and AI products.',
    highlights: ['Web & mobile apps', 'Cloud & DevOps', 'AI automation'],
    path: ROUTES.servicesIt,
    image: siteImages.serviceIt,
    imageAlt: 'Software engineering and IT development workspace',
    accent: '#2E5A8C',
    variant: 'featured',
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    summary: 'Growth campaigns that turn attention into measurable demand.',
    highlights: ['SEO & paid ads', 'Content & branding', 'Analytics'],
    path: ROUTES.servicesDigitalMarketing,
    image: siteImages.serviceMarketing,
    imageAlt: 'Digital marketing strategy and campaign planning',
    accent: '#B8956B',
    variant: 'featured',
  },
  {
    id: 'non-it-services',
    title: 'Non-IT Services',
    summary: 'Operations and support services that keep business running smoothly.',
    highlights: ['BPO & back-office', 'Customer support', 'Process ops'],
    path: ROUTES.servicesNonIt,
    image: siteImages.team,
    imageAlt: 'Operations team coordinating business services',
    accent: '#1A3D66',
    variant: 'featured',
  },
  {
    id: 'staffing',
    title: 'Staffing & Recruitment',
    summary: 'Right talent, faster — contract, permanent, and bulk hiring.',
    highlights: ['IT & non-IT hiring', 'Contract staffing', 'Bulk recruitment'],
    path: ROUTES.servicesStaffing,
    image: siteImages.projectRecruitment,
    imageAlt: 'Recruitment and talent acquisition session',
    accent: '#96784F',
    variant: 'featured',
  },
  {
    id: 'training',
    title: 'Training',
    summary: 'Career-ready programs across technology and marketing skills.',
    highlights: ['Live cohorts', 'Hands-on projects', 'Placement support'],
    path: ROUTES.servicesTraining,
    image: siteImages.serviceTraining,
    imageAlt: 'Professional training and upskilling workshop',
    accent: '#0C2340',
    variant: 'featured',
  },
  {
    id: 'internships',
    title: 'Internships',
    summary: 'Guided programs with mentors, real tasks, and portfolio outcomes.',
    highlights: ['Structured curriculum', 'Mentor feedback', 'Certificate'],
    path: ROUTES.internships,
    image: siteImages.projectTraining,
    imageAlt: 'Students in an internship learning program',
    accent: '#4A7AB0',
    variant: 'featured',
  },
] as const;

/** @deprecated Use HOME_CAPABILITY_CARDS for home page capabilities section. */
export const HOME_SERVICE_CARDS = HOME_CAPABILITY_CARDS.map(({ title, summary, path }) => ({
  title,
  description: summary,
  path,
}));
