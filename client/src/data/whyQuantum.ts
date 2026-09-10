import { siteImages } from '../assets/images';

export type WhyQuantumShape =
  | 'circle'
  | 'soft-square'
  | 'diamond'
  | 'hex'
  | 'blob'
  | 'arch';

export interface WhyQuantumItem {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  shape: WhyQuantumShape;
  accent: string;
}

/** Why Quantum pillars — each with a unique framed image treatment. */
export const WHY_QUANTUM_ITEMS: readonly WhyQuantumItem[] = [
  {
    id: 'innovation',
    title: 'Innovation',
    description: 'Practical ideas translated into usable digital solutions.',
    image: siteImages.digital,
    imageAlt: 'Abstract ideation and innovation visual',
    shape: 'blob',
    accent: '#B8956B',
  },
  {
    id: 'technology',
    title: 'Technology',
    description: 'Modern stacks chosen for reliability and long-term growth.',
    image: siteImages.serviceIt,
    imageAlt: 'Technology engineering workspace',
    shape: 'hex',
    accent: '#2E5A8C',
  },
  {
    id: 'quality',
    title: 'Quality',
    description: 'Clear delivery standards across design, code, and process.',
    image: siteImages.projectCorporateWeb,
    imageAlt: 'Quality-focused product craft',
    shape: 'soft-square',
    accent: '#0C2340',
  },
  {
    id: 'team',
    title: 'Experienced team',
    description: 'Cross-functional professionals across technology and talent.',
    image: siteImages.team,
    imageAlt: 'Experienced team collaborating',
    shape: 'circle',
    accent: '#4A7AB0',
  },
  {
    id: 'business',
    title: 'Business solutions',
    description: 'Services shaped around outcomes for startups and enterprises.',
    image: siteImages.projectMarketing,
    imageAlt: 'Business growth and solution planning',
    shape: 'diamond',
    accent: '#96784F',
  },
  {
    id: 'support',
    title: 'Customer support',
    description: 'Responsive communication and post-delivery assistance.',
    image: siteImages.projectCloud,
    imageAlt: 'Ongoing customer support and care',
    shape: 'arch',
    accent: '#1A3D66',
  },
] as const;

/** Legacy flat list for any older imports. */
export const WHY_QUANTUM = WHY_QUANTUM_ITEMS.map(({ title, description }) => ({
  title,
  description,
}));
