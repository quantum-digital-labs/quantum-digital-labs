export interface JobListing {
  id: string;
  title: string;
  location: string;
  department: string;
  experience: string;
  jobType: string;
  skills: string[];
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  summary: string;
  /** Optional extras for admin-posted jobs */
  openings?: number;
  salary?: string;
  applicationDeadline?: string;
  workMode?: string;
  published?: boolean;
}

export const JOBS: JobListing[] = [
  {
    id: 'QDLJB-0001',
    title: 'Full Stack Developer',
    location: 'Remote / Hybrid',
    department: 'Engineering',
    experience: '0-2 years',
    jobType: 'Full-time',
    skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'REST APIs', 'Git'],
    responsibilities: [
      'Design, build, and maintain web applications across frontend and backend.',
      'Collaborate with design and product teams to ship features on schedule.',
      'Write clean, tested, and documented code that other engineers can extend.',
      'Participate in code reviews, sprint planning, and technical discussions.',
      'Debug production issues and improve performance, reliability, and UX.',
    ],
    requirements: [
      'Strong JavaScript and TypeScript fundamentals.',
      'Hands-on experience with React and Node.js.',
      'Familiarity with REST APIs, MongoDB (or similar), and Git.',
      'Clear written and verbal communication.',
      'Ability to work independently in a remote or hybrid setup.',
    ],
    benefits: [
      'Growth-focused project exposure across real client products.',
      'Mentorship and continuous learning support.',
      'Flexible hybrid collaboration.',
      'Clear career progression paths within Engineering.',
    ],
    summary:
      'Build and ship modern web products end to end — from React interfaces to Node.js APIs and databases.',
  },
  {
    id: 'QDLJB-0002',
    title: 'Digital Marketing Executive',
    location: 'On-site / Hybrid',
    department: 'Marketing',
    experience: '0-2 years',
    jobType: 'Full-time',
    skills: ['SEO', 'Google Ads', 'Social Media', 'Analytics', 'Content'],
    responsibilities: [
      'Plan and execute digital campaigns across SEO, ads, and social channels.',
      'Track channel performance and share clear weekly/monthly insights.',
      'Support content creation, publishing, and campaign creative briefs.',
      'Coordinate with design and sales teams on lead-generation goals.',
      'Maintain campaign calendars, reports, and optimization checklists.',
    ],
    requirements: [
      'Working knowledge of SEO, social media, and paid ads basics.',
      'Comfort with analytics dashboards (Google Analytics or similar).',
      'Strong writing, organization, and attention to detail.',
      'Willingness to learn tools and report results clearly.',
    ],
    benefits: [
      'Hands-on ownership of live campaigns.',
      'Cross-channel learning across SEO, ads, and social.',
      'Collaborative marketing culture with design and sales partners.',
    ],
    summary:
      'Drive demand for Quantum Digital Labs through SEO, paid ads, content, and social channels.',
  },
  {
    id: 'QDLJB-0003',
    title: 'HR Recruiter',
    location: 'Hybrid',
    department: 'People & Talent',
    experience: '3-5 years',
    jobType: 'Full-time',
    skills: ['Sourcing', 'Screening', 'Interview Coordination', 'ATS', 'Stakeholder Management'],
    responsibilities: [
      'Source and screen candidates for IT and non-IT openings.',
      'Coordinate interviews, feedback loops, and offer timelines.',
      'Maintain pipeline hygiene, status reports, and ATS records.',
      'Partner with hiring managers to clarify role requirements.',
      'Improve candidate experience from first contact to onboarding.',
    ],
    requirements: [
      'Prior recruiting experience preferred (agency or in-house).',
      'Strong communication, follow-up, and organization skills.',
      'Comfort with ATS workflows and structured screening.',
      'Ability to manage multiple open roles in parallel.',
    ],
    benefits: [
      'Exposure to both IT and non-IT hiring.',
      'Structured recruitment processes and tools.',
      'Growth path into senior talent acquisition roles.',
    ],
    summary:
      'Own end-to-end hiring — sourcing, screening, and coordinating interviews for technology and business roles.',
  },
  {
    id: 'QDLJB-0004',
    title: 'UI/UX Designer',
    location: 'Remote / Hybrid',
    department: 'Design',
    experience: '0-2 years',
    jobType: 'Full-time',
    skills: ['Figma', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability'],
    responsibilities: [
      'Create wireframes, high-fidelity UI, and interactive prototypes in Figma.',
      'Collaborate with engineering to ship feasible, polished interfaces.',
      'Improve usability and clarity across product flows and marketing pages.',
      'Contribute to a shared design system and reusable UI patterns.',
      'Present design rationale and iterate based on stakeholder feedback.',
    ],
    requirements: [
      'Portfolio showing product UI/UX work for web or mobile.',
      'Strong visual, interaction, and information-design skills.',
      'Understanding of accessibility and responsive layout basics.',
      'Comfort working closely with developers and product stakeholders.',
    ],
    benefits: [
      'End-to-end product design ownership.',
      'Cross-functional collaboration with engineering and marketing.',
      'Opportunities to grow design systems and brand experiences.',
    ],
    summary:
      'Design clear, modern product and website experiences — from wireframes to polished UI systems.',
  },
];

export function getJobById(id: string): JobListing | undefined {
  return JOBS.find((job) => job.id === id);
}

export const JOB_LOCATIONS = [...new Set(JOBS.map((job) => job.location))];
export const JOB_DEPARTMENTS = [...new Set(JOBS.map((job) => job.department))];
export const JOB_EXPERIENCES = [...new Set(JOBS.map((job) => job.experience))];
