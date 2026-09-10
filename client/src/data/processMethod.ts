import { siteImages } from '../assets/images';

export interface ProcessMethodPhase {
  id: string;
  title: string;
  tagline: string;
  progress: number;
  image: string;
  imageAlt: string;
  description: string;
  deliverables: readonly string[];
  duration: string;
}

/** Design & delivery phases shown on the home page Method section. */
export const PROCESS_METHOD_PHASES: readonly ProcessMethodPhase[] = [
  {
    id: 'ideate',
    title: 'Ideate',
    tagline: 'Discover the real problem',
    progress: 17,
    image: siteImages.digital,
    imageAlt: 'Abstract digital concept representing early ideation',
    description:
      'We map goals, users, and constraints through workshops and research. Every idea is pressure-tested so we build the right thing — not just the first thing that sounds good.',
    deliverables: ['Stakeholder interviews', 'Problem statement', 'Opportunity brief'],
    duration: 'Week 1',
  },
  {
    id: 'plan',
    title: 'Plan',
    tagline: 'Shape scope and architecture',
    progress: 33,
    image: siteImages.projectCorporateWeb,
    imageAlt: 'Corporate web planning and architecture session',
    description:
      'Roadmaps, wireframes, and technical plans align teams before a single line of code. Timelines, milestones, and success metrics are defined with full transparency.',
    deliverables: ['Solution blueprint', 'Milestone roadmap', 'Risk & dependency map'],
    duration: 'Week 2',
  },
  {
    id: 'develop',
    title: 'Develop',
    tagline: 'Build with craft and velocity',
    progress: 50,
    image: siteImages.serviceIt,
    imageAlt: 'Developers building software in a modern workspace',
    description:
      'Cross-functional squads ship in iterative sprints with clean code, reusable patterns, and regular demos. You see progress early and often — not only at the finish line.',
    deliverables: ['Working increments', 'Sprint demos', 'Technical documentation'],
    duration: 'Weeks 3–6',
  },
  {
    id: 'test',
    title: 'Test',
    tagline: 'Validate quality end-to-end',
    progress: 67,
    image: siteImages.projectCloud,
    imageAlt: 'Quality assurance and cloud testing environment',
    description:
      'Functional, performance, and usability checks run across devices and edge cases. Issues are triaged, fixed, and re-verified before anything reaches production.',
    deliverables: ['QA test matrix', 'Bug resolution log', 'UAT sign-off pack'],
    duration: 'Week 7',
  },
  {
    id: 'launch',
    title: 'Launch',
    tagline: 'Go live with confidence',
    progress: 83,
    image: siteImages.hero,
    imageAlt: 'Product launch and deployment milestone',
    description:
      'Deployment runbooks, monitoring, and rollback plans ensure a smooth release. We coordinate stakeholders, train users, and celebrate a controlled, measurable go-live.',
    deliverables: ['Release checklist', 'Deployment playbook', 'Launch analytics setup'],
    duration: 'Week 8',
  },
  {
    id: 'support',
    title: 'Support',
    tagline: 'Improve after launch',
    progress: 100,
    image: siteImages.team,
    imageAlt: 'Team providing ongoing product support',
    description:
      'Post-launch monitoring, feedback loops, and iterative improvements keep the product healthy. We stay available for fixes, enhancements, and long-term partnership.',
    deliverables: ['SLA & support channel', 'Performance reports', 'Enhancement backlog'],
    duration: 'Ongoing',
  },
] as const;

/** Legacy step labels — kept for any existing references. */
export const PROCESS_STEPS = PROCESS_METHOD_PHASES.map((phase) => phase.title);
