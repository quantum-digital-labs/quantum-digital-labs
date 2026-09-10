export interface InternshipProgram {
  id: string;
  /** Internship role title shown to candidates. */
  role: string;
  /** Domain / track label. */
  domain: string;
  duration: string;
  mode: string;
  eligibility: string[];
  technologies: string[];
  skills: string[];
  projects: string[];
  responsibilities: string[];
  certificate: string;
  benefits: string[];
  learningOutcomes: string[];
  summary: string;
  /** Optional extras for admin-posted internships */
  openings?: number;
  stipend?: string;
  startDate?: string;
  endDate?: string;
  /** @deprecated Prefer endDate; kept for older CMS records */
  applicationDeadline?: string;
  workMode?: string;
  published?: boolean;
  title?: string;
}

function internship(
  partial: Omit<InternshipProgram, 'certificate' | 'mode' | 'responsibilities'> &
    Partial<Pick<InternshipProgram, 'certificate' | 'mode' | 'responsibilities'>>,
): InternshipProgram {
  return {
    mode: 'Online / Hybrid',
    certificate: 'Certificate of completion upon successful program finish',
    responsibilities: [
      'Complete assigned learning modules and weekly checkpoints',
      'Build guided project tasks with mentor feedback',
      'Document progress and present final outcomes',
    ],
    ...partial,
  };
}

export const INTERNSHIPS: InternshipProgram[] = [
  internship({
    id: 'QDLIN-0001',
    role: 'Full Stack Developer Intern',
    domain: 'Engineering',
    duration: '8–12 weeks',
    summary:
      'Build complete web apps with modern frontend and backend practices under mentor guidance.',
    eligibility: ['Students or recent graduates', 'Basic programming familiarity'],
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Git'],
    skills: ['API integration', 'Component design', 'Debugging', 'Git collaboration'],
    projects: ['Service catalog app', 'Lead capture workflow'],
    responsibilities: [
      'Develop UI screens and connect them to APIs',
      'Implement backend routes and data models',
      'Write clean, reviewed code with Git workflows',
      'Present a working full-stack demo at program end',
    ],
    benefits: ['Mentorship', 'Live project exposure', 'Career guidance', 'Completion certificate'],
    learningOutcomes: [
      'Ship a full-stack feature end to end',
      'Use Git and collaborative workflows',
      'Explain architecture decisions clearly',
    ],
  }),
  internship({
    id: 'QDLIN-0002',
    role: 'Python Developer Intern',
    domain: 'Engineering',
    duration: '6–10 weeks',
    summary: 'Strengthen Python fundamentals through practical assignments and code reviews.',
    eligibility: ['Students with interest in programming'],
    technologies: ['Python', 'Virtual environments', 'Git', 'REST APIs'],
    skills: ['Scripting', 'Data handling', 'Problem solving'],
    projects: ['Automation utility', 'Data processing script'],
    responsibilities: [
      'Complete Python practice modules each week',
      'Build scripts for automation and data tasks',
      'Improve code quality through mentor reviews',
    ],
    benefits: ['Guided practice', 'Code reviews', 'Certificate'],
    learningOutcomes: ['Write clean Python modules', 'Handle files and APIs'],
  }),
  internship({
    id: 'QDLIN-0003',
    role: 'Java Developer Intern',
    domain: 'Engineering',
    duration: '8–12 weeks',
    summary: 'Learn Java application basics with structured mentoring and OOP practice.',
    eligibility: ['Computer science / related students'],
    technologies: ['Java', 'Git', 'IDE tooling', 'REST basics'],
    skills: ['OOP', 'Collections', 'Basic APIs'],
    projects: ['Console application', 'Simple REST consumer'],
    responsibilities: [
      'Practice OOP and core Java concepts',
      'Build small applications with mentor checkpoints',
      'Debug and document Java code clearly',
    ],
    benefits: ['Mentor support', 'Project portfolio piece', 'Certificate'],
    learningOutcomes: ['Apply OOP patterns', 'Debug Java applications'],
  }),
  internship({
    id: 'QDLIN-0004',
    role: 'AI / ML Intern',
    domain: 'Data & AI',
    duration: '8–12 weeks',
    summary: 'Introductory applied AI/ML with guided notebooks and real use cases.',
    eligibility: ['Students comfortable with Python basics'],
    technologies: ['Python', 'Notebooks', 'ML libraries', 'Pandas'],
    skills: ['Data prep', 'Model basics', 'Evaluation'],
    projects: ['Classification notebook', 'Insight report'],
    responsibilities: [
      'Prepare datasets and run guided experiments',
      'Document model choices and results',
      'Present findings from applied ML notebooks',
    ],
    benefits: ['Applied learning', 'Mentor feedback', 'Certificate'],
    learningOutcomes: ['Explain ML workflow', 'Document experiment results'],
  }),
  internship({
    id: 'QDLIN-0005',
    role: 'Data Science Intern',
    domain: 'Data & AI',
    duration: '8–12 weeks',
    summary: 'Analyze datasets and communicate insights that support decisions.',
    eligibility: ['Students interested in analytics'],
    technologies: ['Python', 'SQL', 'Visualization tools'],
    skills: ['Cleaning', 'Analysis', 'Storytelling'],
    projects: ['Dashboard summary', 'Exploratory analysis'],
    responsibilities: [
      'Clean and explore assigned datasets',
      'Build charts and summary insights',
      'Present findings in a clear short report',
    ],
    benefits: ['Practical datasets', 'Mentor reviews', 'Certificate'],
    learningOutcomes: ['Clean and analyze data', 'Present findings clearly'],
  }),
  internship({
    id: 'QDLIN-0006',
    role: 'Web Developer Intern',
    domain: 'Engineering',
    duration: '6–10 weeks',
    summary: 'Create responsive websites with modern frontend fundamentals.',
    eligibility: ['Students or career switchers'],
    technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
    skills: ['Responsive layout', 'Accessibility basics', 'Component UI'],
    projects: ['Landing page', 'Multi-section brochure site'],
    responsibilities: [
      'Build responsive page layouts',
      'Implement reusable UI components',
      'Polish accessibility and visual consistency',
    ],
    benefits: ['Portfolio-ready output', 'Code feedback', 'Certificate'],
    learningOutcomes: ['Build responsive pages', 'Structure reusable components'],
  }),
  internship({
    id: 'QDLIN-0007',
    role: 'Mobile Developer Intern',
    domain: 'Engineering',
    duration: '8–12 weeks',
    summary: 'Explore cross-platform mobile app foundations with guided builds.',
    eligibility: ['Students with basic programming knowledge'],
    technologies: ['React Native', 'Flutter', 'REST APIs'],
    skills: ['Mobile UI', 'Navigation', 'API consumption'],
    projects: ['Simple mobile feature set'],
    responsibilities: [
      'Design and implement mobile screens',
      'Connect screens to API data',
      'Demo a complete mobile user flow',
    ],
    benefits: ['Hands-on mobile practice', 'Mentorship', 'Certificate'],
    learningOutcomes: ['Ship a basic mobile flow', 'Handle API data in UI'],
  }),
  internship({
    id: 'QDLIN-0008',
    role: 'UI / UX Design Intern',
    domain: 'Design',
    duration: '6–10 weeks',
    summary: 'Practice research-informed UI/UX design for digital products.',
    eligibility: ['Design-interested students'],
    technologies: ['Figma', 'Prototyping tools'],
    skills: ['Wireframing', 'Visual hierarchy', 'Usability notes'],
    projects: ['App wireframe set', 'Clickable prototype'],
    responsibilities: [
      'Create wireframes and high-fidelity screens',
      'Build clickable prototypes in Figma',
      'Present design rationale and iterate on feedback',
    ],
    benefits: ['Portfolio critique', 'Design mentoring', 'Certificate'],
    learningOutcomes: ['Create usable flows', 'Present design rationale'],
  }),
  internship({
    id: 'QDLIN-0009',
    role: 'Digital Marketing Intern',
    domain: 'Marketing',
    duration: '6–10 weeks',
    summary: 'Learn SEO, content, and campaign fundamentals with practical assignments.',
    eligibility: ['Students interested in marketing'],
    technologies: ['Analytics', 'Ads platforms', 'Content tools'],
    skills: ['Keyword research', 'Content planning', 'Reporting'],
    projects: ['Channel plan', 'Sample campaign brief'],
    responsibilities: [
      'Research keywords and content opportunities',
      'Draft campaign and channel plans',
      'Prepare simple performance summaries',
    ],
    benefits: ['Practical marketing exposure', 'Certificate'],
    learningOutcomes: ['Draft a campaign plan', 'Interpret basic metrics'],
  }),
  internship({
    id: 'QDLIN-0010',
    role: 'Cloud Engineering Intern',
    domain: 'Cloud & Ops',
    duration: '8–12 weeks',
    summary: 'Understand cloud deployment and operations fundamentals with labs.',
    eligibility: ['Students with basic networking/OS familiarity'],
    technologies: ['Cloud consoles', 'CI/CD basics', 'Containers intro'],
    skills: ['Deployment concepts', 'Monitoring basics'],
    projects: ['Sample deployment checklist'],
    responsibilities: [
      'Complete cloud lab walkthroughs',
      'Document deployment and monitoring steps',
      'Present a sample release checklist',
    ],
    benefits: ['Hands-on labs', 'Mentor guidance', 'Certificate'],
    learningOutcomes: ['Explain cloud deployment flow', 'Document ops steps'],
  }),
  internship({
    id: 'QDLIN-0011',
    role: 'IoT Intern',
    domain: 'Hardware & IoT',
    duration: '8–12 weeks',
    summary: 'Explore IoT concepts, sensors, and connected device workflows.',
    eligibility: ['Engineering students interested in IoT'],
    technologies: ['Microcontrollers', 'Sensors', 'Cloud messaging basics'],
    skills: ['Device fundamentals', 'Data ingestion concepts'],
    projects: ['Sensor data prototype concept'],
    responsibilities: [
      'Study IoT architecture and sensor basics',
      'Prototype a simple connected-device flow',
      'Document data path from device to cloud',
    ],
    benefits: ['Applied IoT exposure', 'Certificate'],
    learningOutcomes: ['Describe IoT architecture', 'Prototype a simple sensor flow'],
  }),
];

export function getInternshipById(id: string): InternshipProgram | undefined {
  return INTERNSHIPS.find((item) => item.id === id);
}

export const INTERNSHIP_DOMAINS = [
  ...new Set(INTERNSHIPS.map((item) => item.domain)),
];
