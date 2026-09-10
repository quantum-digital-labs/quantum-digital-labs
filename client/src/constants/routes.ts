/**
 * Canonical application routes.
 * Every nav item and CTA must use these — never "#", empty hrefs, or void links.
 */
export const ROUTES = {
  home: '/',
  about: '/about',
  services: '/services',
  servicesIt: '/services/it',
  servicesNonIt: '/services/non-it',
  servicesDigitalMarketing: '/services/digital-marketing',
  servicesStaffing: '/services/staffing',
  servicesTraining: '/services/training',
  serviceDetail: (category: string, slug: string) =>
    `/services/${category}/${slug}` as const,
  jobs: '/jobs',
  jobsApplied: '/jobs/applied',
  jobDetail: (jobId: string) => `/jobs/${jobId}` as const,
  jobApply: (jobId: string) => `/jobs/${jobId}/apply` as const,
  internships: '/internships',
  internshipsApplied: '/internships/applied',
  admin: '/admin',
  adminLogin: '/admin/login',
  adminServices: '/admin/services',
  adminJobs: '/admin/jobs',
  adminInternships: '/admin/internships',
  adminProjects: '/admin/projects',
  adminPortfolio: '/admin/portfolio',
  adminAbout: '/admin/about',
  adminBlog: '/admin/blog',
  adminApplications: '/admin/applications',
  internshipDetail: (internshipId: string) =>
    `/internships/${internshipId}` as const,
  internshipApply: (internshipId: string) =>
    `/internships/${internshipId}/apply` as const,
  projects: '/projects',
  projectDetail: (projectId: string) => `/projects/${projectId}` as const,
  portfolio: '/portfolio',
  portfolioDetail: (projectId: string) => `/portfolio/${projectId}` as const,
  portfolioCaseStudy: (projectId: string) =>
    `/portfolio/${projectId}/case-study` as const,
  blog: '/blog',
  blogCategory: (category: string) => `/blog/category/${category}` as const,
  blogDetail: (slug: string) => `/blog/${slug}` as const,
  contact: '/contact',
  quote: '/quote',
  requestDemo: '/request-demo',
  login: '/login',
  register: '/register',
  verifyEmail: '/verify-email',
  privacy: '/privacy',
  terms: '/terms',
  notFound: '*',
} as const;

export interface NavItem {
  label: string;
  path: string;
}

/** Desktop / mobile primary navigation */
export const HEADER_NAV: NavItem[] = [
  { label: 'Home', path: ROUTES.home },
  { label: 'About', path: ROUTES.about },
  { label: 'Services', path: ROUTES.services },
  { label: 'Careers', path: ROUTES.jobs },
  { label: 'Internships', path: ROUTES.internships },
  { label: 'Projects', path: ROUTES.projects },
  { label: 'Portfolio', path: ROUTES.portfolio },
  { label: 'Blog', path: ROUTES.blog },
  { label: 'Contact', path: ROUTES.contact },
];

export const FOOTER_COMPANY: NavItem[] = [
  { label: 'About', path: ROUTES.about },
  { label: 'Careers', path: ROUTES.jobs },
  { label: 'Contact', path: ROUTES.contact },
];

export const FOOTER_SERVICES: NavItem[] = [
  { label: 'IT Services', path: ROUTES.servicesIt },
  { label: 'Non-IT Services', path: ROUTES.servicesNonIt },
  { label: 'Digital Marketing', path: ROUTES.servicesDigitalMarketing },
  { label: 'Staffing & Recruitment', path: ROUTES.servicesStaffing },
  { label: 'Training', path: ROUTES.servicesTraining },
];

export const FOOTER_RESOURCES: NavItem[] = [
  { label: 'Internships', path: ROUTES.internships },
  { label: 'Projects', path: ROUTES.projects },
  { label: 'Portfolio', path: ROUTES.portfolio },
  { label: 'Blog', path: ROUTES.blog },
];

export const FOOTER_LEGAL: NavItem[] = [
  { label: 'Privacy Policy', path: ROUTES.privacy },
  { label: 'Terms & Conditions', path: ROUTES.terms },
];
