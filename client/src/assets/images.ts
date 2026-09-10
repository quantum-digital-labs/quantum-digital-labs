import digitalAbstract from './images/digital-abstract.jpg';
import heroQuantum from './images/hero-quantum.jpg';
import portfolioGalleryMobile from './images/portfolio-gallery-mobile.jpg';
import portfolioGalleryWeb from './images/portfolio-gallery-web.jpg';
import projectCloud from './images/project-cloud.jpg';
import projectCorporateWeb from './images/project-corporate-web.jpg';
import projectMarketing from './images/project-marketing.jpg';
import projectRecruitment from './images/project-recruitment.jpg';
import projectTraining from './images/project-training.jpg';
import quantumLogo from './images/quantum-logo.jpg';
import quantumMark from './images/quantum-mark.jpg';
import quantumWordmark from './images/quantum-wordmark.jpg';
import serviceIt from './images/service-it.jpg';
import serviceMarketing from './images/service-marketing.jpg';
import serviceTraining from './images/service-training.jpg';
import teamCollaboration from './images/team-collaboration.jpg';
import type { ServiceCategoryId } from '../types';

export const siteImages = {
  logo: quantumLogo,
  logoMark: quantumMark,
  logoWordmark: quantumWordmark,
  hero: heroQuantum,
  team: teamCollaboration,
  digital: digitalAbstract,
  serviceIt,
  serviceMarketing,
  serviceTraining,
  projectCorporateWeb,
  projectRecruitment,
  projectTraining,
  projectMarketing,
  projectCloud,
  portfolioGalleryWeb,
  portfolioGalleryMobile,
} as const;

/** Category cover images used across Services listing and category pages. */
export const serviceCategoryImages: Record<ServiceCategoryId, string> = {
  it: siteImages.serviceIt,
  'non-it': siteImages.team,
  'digital-marketing': siteImages.serviceMarketing,
  staffing: siteImages.team,
  training: siteImages.serviceTraining,
};

/** Cover images for project cards and detail heroes. */
export const projectImages: Record<string, string> = {
  'QDLPJ-0001': siteImages.projectCorporateWeb,
  'QDLPJ-0002': siteImages.projectRecruitment,
  'QDLPJ-0003': siteImages.projectTraining,
  'QDLPJ-0004': siteImages.projectMarketing,
  'QDLPJ-0005': siteImages.projectCloud,
};

/** Cover + gallery images for sample portfolio case studies. */
export const portfolioCoverImages: Record<string, string> = {
  'QDLPF-0001': siteImages.projectCorporateWeb,
  'QDLPF-0002': siteImages.projectRecruitment,
  'QDLPF-0003': siteImages.projectTraining,
  'QDLPF-0004': siteImages.projectMarketing,
  'QDLPF-0005': siteImages.projectCloud,
};

export function getPortfolioGallery(id: string): string[] {
  const cover = portfolioCoverImages[id] ?? siteImages.digital;
  return [cover, siteImages.portfolioGalleryWeb, siteImages.portfolioGalleryMobile];
}
