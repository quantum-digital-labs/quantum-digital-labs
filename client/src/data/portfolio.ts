export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  industry: string;
  year: string;
  role: string;
  timeline: string;
  overview: string;
  problem: string;
  solution: string;
  challenge: string;
  strategy: string;
  development: string;
  technologyNarrative: string;
  technologies: string[];
  features: string[];
  deliverables: string[];
  results: string[];
  caseResults: string[];
  metrics: { label: string; value: string }[];
  galleryLabels: string[];
  relatedIds: string[];
  image?: string;
  published?: boolean;
}

/**
 * Sample portfolio used as a reference showcase for Quantum Digital Labs work.
 * These entries are demo case studies for design and sales conversations.
 */
export const PORTFOLIO: PortfolioItem[] = [
  {
    id: 'QDLPF-0001',
    title: 'Sample Corporate Website',
    category: 'Web Design & Development',
    industry: 'IT Services / Consulting',
    year: '2026',
    role: 'Product design + frontend delivery',
    timeline: '10–14 weeks',
    overview:
      'A reference corporate website for a services company — services catalog, careers entry points, and lead capture — used as a sample for clear information architecture and conversion-focused UI.',
    problem:
      'Prospects could not quickly understand service categories or take the next step toward a quote, contact, or careers inquiry.',
    solution:
      'We structured the site into Services → Category → Service type, added strong CTAs, and shipped modular React pages that stay consistent across marketing and delivery content.',
    challenge:
      'Balance brand presence with practical navigation so first-time visitors can find IT, staffing, training, and marketing offerings without feeling overloaded.',
    strategy:
      'Mapped primary journeys (explore services, request quote, browse roles), prioritized a clear first viewport, and reused a shared design system for cards, forms, and detail layouts.',
    development:
      'Built responsive page templates in React + TypeScript with Material UI, validated forms, breadcrumbs, and nested routes for services and careers.',
    technologyNarrative:
      'React, TypeScript, Material UI, Vite, and React Router for a modular, maintainable marketing site foundation.',
    technologies: ['React', 'TypeScript', 'Material UI', 'Vite', 'React Router', 'Zod'],
    features: [
      'Service category and detail pages',
      'Lead/quote capture with validation',
      'Careers and internship entry points',
      'Responsive layouts and sticky CTAs',
      'Reusable card and section components',
    ],
    deliverables: [
      'Sample production-ready frontend',
      'Content model for services and roles',
      'Form patterns with success states',
      'Reference screens for sales demos',
    ],
    results: [
      'Clearer service discovery path',
      'Consistent conversion to quote/contact',
      'Reusable UI system for future pages',
    ],
    caseResults: [
      'Visitors can move from category to service type in two clicks',
      'Quote and contact flows share validated form patterns',
      'Sales teams use this sample as a walkthrough reference',
    ],
    metrics: [
      { label: 'Primary journeys', value: '3 mapped' },
      { label: 'Core templates', value: '8+' },
      { label: 'Form paths', value: 'Quote + Contact' },
    ],
    galleryLabels: [
      'Homepage and brand hero',
      'Services category grid',
      'Quote and contact success states',
    ],
    relatedIds: ['QDLPF-0002', 'QDLPF-0003', 'QDLPF-0004'],
  },
  {
    id: 'QDLPF-0002',
    title: 'Sample Careers Portal',
    category: 'HR Tech / Web App',
    industry: 'Recruitment & Talent',
    year: '2026',
    role: 'UX + application workflow',
    timeline: '8–12 weeks',
    overview:
      'A sample careers experience showing open roles, detailed job pages, and a candidate application form with resume upload — designed as a hiring-flow reference.',
    problem:
      'Candidates needed clearer role details, and hiring teams needed structured applications instead of incomplete email submissions.',
    solution:
      'Created filtered role listings, rich job detail layouts, and an aligned apply form capturing personal, education, and experience data with file validation.',
    challenge:
      'Make role expectations obvious (skills, responsibilities, benefits) while keeping apply friction low and validation trustworthy.',
    strategy:
      'Used a Jobs → Role detail → Apply loop, sticky apply panels, and consistent chips/sections so candidates always know the next step.',
    development:
      'Implemented search/filter listings, detail pages, and React Hook Form + Zod validation including resume type/size checks.',
    technologyNarrative:
      'React Hook Form and Zod power reliable candidate intake; Material UI keeps the hiring UI consistent with the corporate site.',
    technologies: [
      'React',
      'TypeScript',
      'React Hook Form',
      'Zod',
      'Material UI',
      'File validation',
    ],
    features: [
      'Role search and filters',
      'Detailed responsibilities and requirements',
      'Apply form with resume upload',
      'Validation dialogs and success panels',
      'Return path to open roles',
    ],
    deliverables: [
      'Sample hiring UI',
      'Application workflow reference',
      'Resume validation rules',
      'Demo script for recruiters',
    ],
    results: [
      'Cleaner candidate data quality',
      'Clearer role communication',
      'Faster screening handoff',
    ],
    caseResults: [
      'Applications arrive with required fields completed',
      'Role pages set expectations before apply',
      'Useful as a staffing-service demo asset',
    ],
    metrics: [
      { label: 'Apply steps', value: 'Listing → Detail → Form' },
      { label: 'Required fields', value: 'Aligned + validated' },
      { label: 'Resume types', value: 'PDF / DOC / DOCX' },
    ],
    galleryLabels: [
      'Open roles listing',
      'Role detail apply panel',
      'Application confirmation',
    ],
    relatedIds: ['QDLPF-0001', 'QDLPF-0003'],
  },
  {
    id: 'QDLPF-0003',
    title: 'Sample Internship Hub',
    category: 'EdTech / Training',
    industry: 'Education & Early Career',
    year: '2026',
    role: 'Program catalog + student apply flow',
    timeline: '6–10 weeks',
    overview:
      'A sample internship hub where students browse role-based programs, review tech stacks, and apply with academic details — a reference for training and internship offerings.',
    problem:
      'Students could not tell which internship role fit them or which technologies they would practice before applying.',
    solution:
      'Presented internships as roles (not vague domains), highlighted tech stacks and outcomes, and added an academic application form with resume upload.',
    challenge:
      'Keep many program options scannable while still showing enough depth for informed applications.',
    strategy:
      'Used Internships → Role → Apply, domain filters, and sticky apply sidebars with concise role summaries.',
    development:
      'Built filterable role cards, detail sections for responsibilities/outcomes, and a two-column apply layout with role summary.',
    technologyNarrative:
      'Same React + Material UI foundation as careers, adapted for student fields (college, course, year) and learning outcomes.',
    technologies: ['React', 'TypeScript', 'Material UI', 'React Hook Form', 'Zod'],
    features: [
      'Role-based internship cards',
      'Tech stack highlights',
      'Eligibility and project samples',
      'Student apply form',
      'Domain filters',
    ],
    deliverables: [
      'Sample program catalog',
      'Role detail templates',
      'Student application reference',
      'Content structure for new programs',
    ],
    results: [
      'Better program discoverability',
      'Clearer learning expectations',
      'Higher-quality applications',
    ],
    caseResults: [
      'Students understand role + stack before applying',
      'Training teams reuse the content model',
      'Strong demo piece for internship services',
    ],
    metrics: [
      { label: 'Role types', value: '11 samples' },
      { label: 'Key sections', value: 'Stack + Outcomes' },
      { label: 'Apply path', value: '1 continuous loop' },
    ],
    galleryLabels: [
      'Internship roles grid',
      'Role tech stack panel',
      'Student application form',
    ],
    relatedIds: ['QDLPF-0001', 'QDLPF-0002'],
  },
  {
    id: 'QDLPF-0004',
    title: 'Sample Growth Marketing Dashboard',
    category: 'Digital Marketing / Analytics UI',
    industry: 'Marketing & Growth',
    year: '2026',
    role: 'Dashboard concept + reporting UI',
    timeline: '8–10 weeks',
    overview:
      'A sample analytics workspace for SEO, ads, and content performance — used as a reference concept for Quantum Digital Labs marketing services.',
    problem:
      'Marketing stakeholders lacked a single place to review channel health and weekly campaign progress.',
    solution:
      'Designed dashboard cards for channels and campaigns, plus reporting layouts that support demo conversations and quote follow-ups.',
    challenge:
      'Present performance without overwhelming non-technical stakeholders, while still looking credible for marketing leads.',
    strategy:
      'Focused on overview-first cards, simple status language, and CTAs that connect insights back to service engagement.',
    development:
      'Created chart-ready panels, campaign status components, and responsive dashboard shells ready for API wiring.',
    technologyNarrative:
      'React + TypeScript UI with chart-ready modules and Material UI patterns for a polished marketing demo.',
    technologies: ['React', 'TypeScript', 'Material UI', 'Chart-ready UI', 'REST-ready'],
    features: [
      'Channel overview cards',
      'Campaign status snapshots',
      'Reporting layout templates',
      'Service-linked CTAs',
      'Responsive dashboard shell',
    ],
    deliverables: [
      'Sample dashboard UI',
      'Channel/campaign card system',
      'Reporting templates',
      'Demo narrative for marketing services',
    ],
    results: [
      'Clearer weekly marketing reviews',
      'Better sales-to-marketing handoff',
      'Stronger marketing service demos',
    ],
    caseResults: [
      'Stakeholders grasp channel status quickly',
      'Useful reference for SEO/ads proposals',
      'Ready path to connect live analytics later',
    ],
    metrics: [
      { label: 'Channel views', value: 'SEO · Ads · Social' },
      { label: 'Primary audience', value: 'Growth teams' },
      { label: 'Use case', value: 'Demo + proposal' },
    ],
    galleryLabels: [
      'Channel overview dashboard',
      'Campaign performance panels',
      'Reporting layout',
    ],
    relatedIds: ['QDLPF-0001', 'QDLPF-0005'],
  },
  {
    id: 'QDLPF-0005',
    title: 'Sample Cloud Ops Console',
    category: 'Cloud / DevOps UI',
    industry: 'Cloud Infrastructure',
    year: '2026',
    role: 'Ops console concept',
    timeline: '10–12 weeks',
    overview:
      'A sample operations console for environment health, deployment stages, and release checklists — a reference for cloud and maintenance service conversations.',
    problem:
      'Engineering and client stakeholders needed a clearer way to discuss release readiness and environment status.',
    solution:
      'Designed environment cards, pipeline stages, and checklist patterns that map cleanly to cloud migration and support offerings.',
    challenge:
      'Communicate technical ops status in a UI that remains approachable for mixed audiences.',
    strategy:
      'Used status-first visuals, short labels, and a demo flow that mirrors real release conversations.',
    development:
      'Built console shells with status indicators, pipeline steps, and notes panels prepared for API integration.',
    technologyNarrative:
      'React interface with status components and modular panels aligned to cloud service storytelling.',
    technologies: ['React', 'TypeScript', 'Material UI', 'Status UI', 'API-ready'],
    features: [
      'Environment health overview',
      'Deployment pipeline stages',
      'Release checklist templates',
      'Incident/maintenance notes',
      'Stakeholder-friendly summaries',
    ],
    deliverables: [
      'Sample ops console UI',
      'Pipeline and checklist components',
      'Cloud service demo flow',
      'Integration-ready structure',
    ],
    results: [
      'Clearer release readiness talks',
      'Better client communication on ops',
      'Reusable cloud demo asset',
    ],
    caseResults: [
      'Mixed audiences can follow deployment status',
      'Supports cloud/maintenance proposals',
      'Pairs well with corporate site service pages',
    ],
    metrics: [
      { label: 'Ops views', value: 'Health · Pipeline · Notes' },
      { label: 'Audience', value: 'Eng + stakeholders' },
      { label: 'Purpose', value: 'Sample reference' },
    ],
    galleryLabels: [
      'Environment health view',
      'Deployment pipeline',
      'Release checklist panel',
    ],
    relatedIds: ['QDLPF-0001', 'QDLPF-0004'],
  },
];

export function getPortfolioById(id: string): PortfolioItem | undefined {
  return PORTFOLIO.find((item) => item.id === id);
}

export const PORTFOLIO_CATEGORIES = [
  ...new Set(PORTFOLIO.map((item) => item.category)),
];
