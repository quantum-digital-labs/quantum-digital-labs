import { siteImages } from '../assets/images';
import { COMPANY, ROUTES } from '../constants';

export const ABOUT_SNAPSHOT = [
  { label: 'Founded', value: COMPANY.founded },
  { label: 'Headquarters', value: 'Madhapur, Hyderabad' },
  { label: 'Promise', value: COMPANY.tagline },
  { label: 'Focus', value: 'Technology & talent' },
] as const;

export const ABOUT_STORY = [
  `${COMPANY.legalName} was formed in ${COMPANY.founded} in Hyderabad and began public operations in May 2026. The company sits at the intersection of technology delivery and talent development — two needs that usually live in separate vendors, classrooms, or hiring desks.`,
  'Businesses need websites, products, marketing, operations support, and people they can trust. Students and professionals need structured ways to learn those skills on real work. We run both under one brand so learning stays practical and delivery stays accountable.',
  `${COMPANY.tagline} is the promise. We connect clients with capable teams, innovate with tools that can be maintained after launch, and transform how organizations ship software, hire, and grow skills. As a young company we ship in public — services, internships, careers, projects, and sample case studies — so partners can evaluate how we think before they commit.`,
] as const;

export const ABOUT_PILLARS = [
  {
    title: 'IT Services',
    description:
      'Web, mobile, software, UI/UX, cloud, AI automation, CRM, and ongoing maintenance — scoped with milestones you can track.',
    path: ROUTES.servicesIt,
    image: siteImages.serviceIt,
    imageAlt: 'Software engineering workspace',
    highlights: ['Web & mobile', 'Cloud & AI', 'Support'],
  },
  {
    title: 'Non-IT Services',
    description:
      'BPO, customer support, back-office, data entry, and process operations that keep day-to-day work moving while product teams focus on growth.',
    path: ROUTES.servicesNonIt,
    image: siteImages.team,
    imageAlt: 'Operations team coordinating business services',
    highlights: ['BPO', 'Support desks', 'Back-office'],
  },
  {
    title: 'Digital Marketing',
    description:
      'SEO, paid ads, social, content, branding, and video — planned around measurable demand rather than vanity metrics.',
    path: ROUTES.servicesDigitalMarketing,
    image: siteImages.serviceMarketing,
    imageAlt: 'Digital marketing campaign planning',
    highlights: ['SEO & ads', 'Content', 'Branding'],
  },
  {
    title: 'Staffing & Recruitment',
    description:
      'IT and non-IT hiring, contract and permanent staffing, bulk recruitment, and RPO for teams that need the right people on a clear timeline.',
    path: ROUTES.servicesStaffing,
    image: siteImages.projectRecruitment,
    imageAlt: 'Recruitment and talent acquisition session',
    highlights: ['IT & non-IT', 'Contract', 'Bulk hiring'],
  },
  {
    title: 'Training',
    description:
      'Cohort programs in full-stack, Python, data, AI/ML, testing, and digital marketing — built around projects, feedback, and job-ready skills.',
    path: ROUTES.servicesTraining,
    image: siteImages.serviceTraining,
    imageAlt: 'Professional training workshop',
    highlights: ['Live cohorts', 'Projects', 'Mentors'],
  },
  {
    title: 'Internships',
    description:
      'Guided programs with curriculum, mentor reviews, and portfolio outcomes so students practice on work that resembles client delivery.',
    path: ROUTES.internships,
    image: siteImages.projectTraining,
    imageAlt: 'Internship learning program',
    highlights: ['Curriculum', 'Mentorship', 'Certificate'],
  },
] as const;

export const ABOUT_AUDIENCES = [
  {
    title: 'Growing businesses',
    text: 'Startups, SMBs, and product teams that need digital delivery, operations support, or hiring without a bloated agency model.',
  },
  {
    title: 'Job seekers',
    text: 'Freshers, experienced professionals, and career switchers looking for published roles with a real application path.',
  },
  {
    title: 'Students & graduates',
    text: 'Engineering, degree, and diploma students who want internships with structure — not unpaid ambiguity.',
  },
  {
    title: 'Institutions',
    text: 'Colleges, universities, and training partners exploring industry-aligned programs and placement connections.',
  },
] as const;

export const ABOUT_APPROACH = [
  {
    step: '01',
    title: 'Discover',
    text: 'We start with goals, users, constraints, and success metrics — so the brief is shared before anyone starts building.',
  },
  {
    step: '02',
    title: 'Plan',
    text: 'Scope, architecture, and milestones are written down. You see what will ship, in what order, and what is out of bounds.',
  },
  {
    step: '03',
    title: 'Deliver',
    text: 'Work lands in increments with demos, reviews, and documentation. Progress is visible early — not only at the finish line.',
  },
  {
    step: '04',
    title: 'Support',
    text: 'Launch is a handoff with monitoring, training, and a path for fixes and improvements. We stay available after go-live.',
  },
] as const;

export const ABOUT_PRACTICES = [
  {
    title: 'Engineering & product',
    text: 'Web, mobile, cloud, and automation work with an emphasis on maintainable stacks and clear technical notes.',
  },
  {
    title: 'Design',
    text: 'Research-led UI/UX so interfaces stay usable for the people who actually operate the product.',
  },
  {
    title: 'Growth marketing',
    text: 'Campaigns, content, and analytics that connect attention to pipeline — not just more posts.',
  },
  {
    title: 'Training & internships',
    text: 'Programs and mentoring loops that sit next to delivery, so learning is measured against real tasks.',
  },
  {
    title: 'Recruitment',
    text: 'Hiring workflows for clients and for our own delivery teams, with published roles instead of informal asks.',
  },
] as const;

export const DEFAULT_JOURNEY = [
  {
    title: `${COMPANY.founded} — Company formed`,
    text: `${COMPANY.legalName} was incorporated in Hyderabad with a focused mix of technology, staffing, training, and marketing services.`,
  },
  {
    title: 'May 2026 — Operations launch',
    text: 'Public site, service catalogues, careers, internships, and sample work went live so partners could evaluate us in the open.',
  },
  {
    title: 'First platform journeys',
    text: 'We mapped complete paths — quote, demo, job apply, internship apply — instead of publishing isolated landing pages.',
  },
  {
    title: 'Talent + delivery together',
    text: 'Client work, internship roles, and hiring loops were connected so training stays practical and delivery stays staffed.',
  },
  {
    title: 'Partner-ready experiences',
    text: 'Demos, case-study samples, and content were refined so a first conversation starts from something you can inspect.',
  },
  {
    title: 'Today',
    text: 'A young company still shipping in public — improving services, programs, and the platform that holds them together.',
  },
] as const;

export const DEFAULT_VISION =
  'To become a trusted digital and talent solutions partner — building technology that organizations can actually run, developing skilled professionals, and helping businesses grow through both products and people.';

export const DEFAULT_MISSION =
  'Deliver reliable technology, staffing, training, digital marketing, and operations services, while creating career and learning paths that stay close to real client work. We measure success by shipped outcomes, clear communication, and skills people can reuse.';

export const DEFAULT_WHY = [
  'End-to-end delivery with written milestones, demos, and a named point of contact',
  'Talent pathways through training and internships, so capability grows with the work',
  'Long-term support after launch — monitoring, fixes, and a backlog for what comes next',
  'Cross-functional coverage (build, market, hire, train) without stitching five vendors together',
  'Practical stacks chosen for maintainability, not fashion',
  'Hyderabad-based delivery with transparent communication from brief to support',
] as const;

export const VALUE_ACCENTS = ['#B8956B', '#2E5A8C', '#0C2340', '#4A7AB0', '#96784F'] as const;

export const DEFAULT_VALUES = [
  {
    title: 'Integrity',
    description: 'We say what we will do, then do it — including the constraints, not only the highlights.',
    accent: VALUE_ACCENTS[0],
  },
  {
    title: 'Quality',
    description: 'Craft over shortcuts. Design, code, and process are built so the next person can maintain them.',
    accent: VALUE_ACCENTS[1],
  },
  {
    title: 'Practical',
    description: 'Learning and delivery stay grounded in real briefs, real users, and work that can ship.',
    accent: VALUE_ACCENTS[2],
  },
  {
    title: 'Clarity',
    description: 'Scope, status, and trade-offs are written down. You should never have to guess where things stand.',
    accent: VALUE_ACCENTS[3],
  },
  {
    title: 'Growth',
    description: 'People and products improve in public — internships, reviews, and iteration after launch.',
    accent: VALUE_ACCENTS[4],
  },
] as const;
