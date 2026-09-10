import type { ServiceCategoryId } from '../types/content';

export interface ServiceCategoryOption {
  id: ServiceCategoryId;
  label: string;
  path: string;
}

export interface ServiceSubcategoryOption {
  slug: string;
  title: string;
}

export const SERVICE_CATEGORY_OPTIONS: ServiceCategoryOption[] = [
  { id: 'it', label: 'IT Services', path: '/services/it' },
  { id: 'non-it', label: 'Non-IT Services', path: '/services/non-it' },
  {
    id: 'digital-marketing',
    label: 'Digital Marketing',
    path: '/services/digital-marketing',
  },
  {
    id: 'staffing',
    label: 'Staffing & Recruitment',
    path: '/services/staffing',
  },
  { id: 'training', label: 'Training Services', path: '/services/training' },
];

export const SERVICE_SUBCATEGORIES: Record<
  ServiceCategoryId,
  ServiceSubcategoryOption[]
> = {
  it: [
    { slug: 'website-development', title: 'Website Development' },
    { slug: 'android-mobile-development', title: 'Android (Mobile) Development' },
    { slug: 'software-development', title: 'Software Development' },
    { slug: 'ui-ux-design', title: 'UI/UX Design' },
    { slug: 'cloud-services', title: 'Cloud Services' },
    { slug: 'ai-automation', title: 'AI Automation' },
    { slug: 'crm-solutions', title: 'CRM Solutions' },
    { slug: 'maintenance-support', title: 'Maintenance & Support' },
  ],
  'non-it': [
    { slug: 'bpo', title: 'BPO' },
    { slug: 'voice-process', title: 'Voice Process' },
    { slug: 'non-voice-process', title: 'Non-Voice Process' },
    { slug: 'customer-support', title: 'Customer Support' },
    { slug: 'back-office', title: 'Back Office' },
    { slug: 'data-entry', title: 'Data Entry' },
    { slug: 'content-moderation', title: 'Content Moderation' },
    { slug: 'medical-coding-billing', title: 'Medical Coding & Billing' },
  ],
  'digital-marketing': [
    { slug: 'seo', title: 'SEO' },
    { slug: 'google-ads', title: 'Google Ads' },
    { slug: 'social-media-marketing', title: 'Social Media Marketing' },
    { slug: 'content-marketing', title: 'Content Marketing' },
    { slug: 'email-marketing', title: 'Email Marketing' },
    { slug: 'branding', title: 'Branding' },
    { slug: 'social-ads', title: 'Social Ads' },
    { slug: 'video-marketing', title: 'Video Marketing' },
  ],
  training: [
    { slug: 'full-stack-development', title: 'Full Stack Development' },
    { slug: 'python', title: 'Python' },
    { slug: 'data-analytics', title: 'Data Analytics' },
    { slug: 'ai-ml', title: 'AI/ML' },
    { slug: 'digital-marketing-training', title: 'Digital Marketing Training' },
    { slug: 'software-testing', title: 'Software Testing' },
  ],
  staffing: [
    { slug: 'it-recruitment', title: 'IT Recruitment' },
    { slug: 'non-it-recruitment', title: 'Non-IT Recruitment' },
    { slug: 'contract-staffing', title: 'Contract Staffing' },
    { slug: 'permanent-staffing', title: 'Permanent Staffing' },
    { slug: 'bulk-hiring', title: 'Bulk Hiring' },
    {
      slug: 'recruitment-process-outsourcing',
      title: 'Recruitment Process Outsourcing',
    },
  ],
};

/** Split admin paragraph text into list items (one per non-empty line). */
export function paragraphToList(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Join list items back into a paragraph for the admin form. */
export function listToParagraph(items: string[] | undefined): string {
  return (items ?? []).join('\n');
}

/**
 * FAQ lines: `Question | Answer` (one FAQ per line).
 */
export function paragraphToFaqs(
  value: string,
): { question: string; answer: string }[] {
  return paragraphToList(value).map((line) => {
    const sep = line.indexOf('|');
    if (sep === -1) {
      return { question: line, answer: '' };
    }
    return {
      question: line.slice(0, sep).trim(),
      answer: line.slice(sep + 1).trim(),
    };
  });
}

export function faqsToParagraph(
  faqs: { question: string; answer: string }[] | undefined,
): string {
  return (faqs ?? [])
    .map((faq) => `${faq.question} | ${faq.answer}`)
    .join('\n');
}

export function getCategoryLabel(id: string): string {
  return (
    SERVICE_CATEGORY_OPTIONS.find((option) => option.id === id)?.label ?? id
  );
}
