export type ServiceCategoryId =
  | 'it'
  | 'non-it'
  | 'digital-marketing'
  | 'staffing'
  | 'training';

export interface ServiceItem {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  features: string[];
  technologies: string[];
  process: string[];
  deliverables: string[];
  faqs: { question: string; answer: string }[];
  image?: string;
  published?: boolean;
}

export interface ServiceCategory {
  id: ServiceCategoryId;
  title: string;
  path: string;
  description: string;
  services: ServiceItem[];
}

export interface JobPreview {
  id: string;
  title: string;
  location: string;
  employmentType: string;
  experience: string;
}

export interface InternshipPreview {
  id: string;
  domain: string;
  duration: string;
  mode: string;
}

export interface PortfolioPreview {
  id: string;
  title: string;
  category: string;
  summary: string;
}

export interface BlogPreview {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
}
