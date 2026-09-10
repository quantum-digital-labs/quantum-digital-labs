import { COMPANY, ROUTES } from '../constants';

export interface ChatReply {
  text: string;
  suggestions?: string[];
  link?: { label: string; to: string };
}

const DEFAULT_SUGGESTIONS = [
  'What services do you offer?',
  'How do I apply for a job?',
  'Tell me about internships',
  'Request a quote',
];

function matchAny(input: string, keywords: string[]): boolean {
  return keywords.some((keyword) => input.includes(keyword));
}

/**
 * Lightweight AI-style assistant for Quantum Digital Labs.
 * Answers are grounded in site journeys (services, careers, internships, quote).
 */
export async function getAssistantReply(rawMessage: string): Promise<ChatReply> {
  const message = rawMessage.trim().toLowerCase();

  // Simulate thinking latency for an assistant feel.
  await new Promise((resolve) => setTimeout(resolve, 450 + Math.random() * 350));

  if (!message) {
    return {
      text: `Hi — I'm the ${COMPANY.brandName} assistant. Ask about services, careers, internships, projects, or how to get a quote.`,
      suggestions: DEFAULT_SUGGESTIONS,
    };
  }

  if (matchAny(message, ['hello', 'hi', 'hey', 'good morning', 'good evening'])) {
    return {
      text: `Hello! Welcome to ${COMPANY.shortName} (founded ${COMPANY.founded}). How can I help you today?`,
      suggestions: DEFAULT_SUGGESTIONS,
    };
  }

  if (matchAny(message, ['service', 'offer', 'what do you do', 'it service', 'staffing', 'marketing', 'training'])) {
    return {
      text: `${COMPANY.shortName} offers IT services, non-IT operations, digital marketing, staffing & recruitment, and training. Browse Services → pick a category → open a service type to see the tech stack, then request a quote.`,
      suggestions: ['Show IT services', 'How do I get a quote?', 'Where is the portfolio?'],
      link: { label: 'Explore Services', to: ROUTES.services },
    };
  }

  if (matchAny(message, ['it service', 'web', 'mobile', 'cloud', 'ai automation', 'website'])) {
    return {
      text: 'Our IT category covers website development, mobile apps, software, UI/UX, cloud, AI automation, CRM, and maintenance. Each service page lists features, process, and technologies.',
      suggestions: ['Request a quote', 'Show projects', 'Tell me about internships'],
      link: { label: 'Open IT Services', to: ROUTES.servicesIt },
    };
  }

  if (matchAny(message, ['job', 'career', 'hiring', 'vacancy', 'apply for a role', 'open role'])) {
    return {
      text: 'Open roles are under Careers. Flow: Careers → role details → Apply. You can filter by location, department, and experience, then submit your resume and basic details.',
      suggestions: ['How do I apply for a job?', 'Internship roles', 'Contact HR'],
      link: { label: 'View Careers', to: ROUTES.jobs },
    };
  }

  if (matchAny(message, ['apply', 'application', 'resume', 'cv'])) {
    return {
      text: 'To apply: open Careers or Internships, choose a role, and click Apply. You will be asked to sign in or register, then complete the form (including a PDF/DOC/DOCX resume).',
      suggestions: ['Open careers', 'Open internships', 'How do I sign in?'],
      link: { label: 'Browse Jobs', to: ROUTES.jobs },
    };
  }

  if (matchAny(message, ['internship', 'intern', 'student', 'training program'])) {
    return {
      text: 'Internships are role-based (for example Full Stack Developer Intern). Flow: Internships → role → Apply. Each role shows duration, mode, tech stack, and learning outcomes.',
      suggestions: ['Python internship', 'UI/UX internship', 'How do I apply?'],
      link: { label: 'View Internships', to: ROUTES.internships },
    };
  }

  if (matchAny(message, ['quote', 'pricing', 'cost', 'proposal', 'estimate'])) {
    return {
      text: 'Use Get a Quote to share your requirements. You will be asked to sign in or register first, then pick a service so our team can follow up.',
      suggestions: ['What services do you offer?', 'Request a demo', 'Contact us'],
      link: { label: 'Get a Quote', to: ROUTES.quote },
    };
  }

  if (matchAny(message, ['demo', 'walkthrough', 'project demo'])) {
    return {
      text: 'You can request a project demo from the Projects section. Open a project for problem, solution, tech stack, and results, then use Request Demo.',
      suggestions: ['Show projects', 'Show portfolio', 'Get a quote'],
      link: { label: 'View Projects', to: ROUTES.projects },
    };
  }

  if (matchAny(message, ['portfolio', 'case study', 'sample work', 'examples'])) {
    return {
      text: 'Our Sample Portfolio has reference case studies with galleries and detailed case-study pages. Flow: Portfolio → sample → Case study → Quote.',
      suggestions: ['Show projects', 'Get a quote', 'About the company'],
      link: { label: 'Open Portfolio', to: ROUTES.portfolio },
    };
  }

  if (matchAny(message, ['blog', 'article', 'news', 'launch'])) {
    return {
      text: `${COMPANY.shortName} started in ${COMPANY.founded}. The blog shares launch updates, product thinking, careers tips, and growth ideas from May 2026 onward.`,
      suggestions: ['About the company', 'What services do you offer?'],
      link: { label: 'Read the Blog', to: ROUTES.blog },
    };
  }

  if (matchAny(message, ['about', 'company', 'who are you', 'founded', 'may 2026', 'tagline'])) {
    return {
      text: `${COMPANY.shortName} (${COMPANY.legalName}) launched in ${COMPANY.founded}. Brand promise: ${COMPANY.tagline}. We connect technology delivery with talent and learning.`,
      suggestions: ['What services do you offer?', 'Open careers', 'Contact us'],
      link: { label: 'About Us', to: ROUTES.about },
    };
  }

  if (matchAny(message, ['contact', 'email', 'phone', 'address', 'reach'])) {
    return {
      text: `You can reach us through the Contact page. Official contact details will replace placeholders when provided. Current placeholders: ${COMPANY.email}, ${COMPANY.phone}.`,
      suggestions: ['Get a quote', 'Request a demo'],
      link: { label: 'Contact Us', to: ROUTES.contact },
    };
  }

  if (matchAny(message, ['login', 'sign in', 'register', 'account', 'password'])) {
    return {
      text: 'You can browse the site without an account. Sign in or register only when you apply for a job or internship, or submit a quote.',
      suggestions: ['What services do you offer?', 'Open careers'],
      link: { label: 'Sign in', to: ROUTES.login },
    };
  }

  if (matchAny(message, ['help', 'support', 'assist', 'what can you do'])) {
    return {
      text: 'I can guide you to services, careers, internships, projects, portfolio samples, blog posts, quotes, demos, and contact options — with short AI-style answers based on this site.',
      suggestions: DEFAULT_SUGGESTIONS,
    };
  }

  return {
    text: `I can help with ${COMPANY.shortName} services, careers, internships, projects, portfolio, quotes, and contact. Try one of the suggestions below, or rephrase your question.`,
    suggestions: DEFAULT_SUGGESTIONS,
    link: { label: 'Explore Services', to: ROUTES.services },
  };
}

export const CHAT_WELCOME: ChatReply = {
  text: `Hi! I'm your ${COMPANY.brandName} AI assistant. Ask me about services, jobs, internships, projects, or getting a quote.`,
  suggestions: DEFAULT_SUGGESTIONS,
};
