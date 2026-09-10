export { PLACEHOLDER_STATS } from './placeholders';
export {
  SERVICE_CATEGORIES,
  getCategoryById,
  getService,
  isServiceCategoryId,
} from './services';
export { HOME_CAPABILITY_CARDS, HOME_SERVICE_CARDS } from './homeCapabilities';
export {
  JOBS,
  getJobById,
  JOB_LOCATIONS,
  JOB_DEPARTMENTS,
  JOB_EXPERIENCES,
  type JobListing,
} from './jobs';
export { INTERNSHIPS, getInternshipById, INTERNSHIP_DOMAINS, type InternshipProgram } from './internships';
export {
  PROJECTS,
  getProjectById,
  PROJECT_CATEGORIES,
  type ProjectItem,
} from './projects';
export {
  PORTFOLIO,
  getPortfolioById,
  PORTFOLIO_CATEGORIES,
  type PortfolioItem,
} from './portfolio';
export {
  BLOG_ARTICLES,
  BLOG_CATEGORIES,
  getArticleBySlug,
  getArticlesByCategory,
  getRelatedArticles,
  getArticlesNewestFirst,
  categoryToSlug,
  slugToCategory,
  type BlogArticle,
} from './blog';
export { PROCESS_METHOD_PHASES, PROCESS_STEPS } from './processMethod';
export { WHY_QUANTUM_ITEMS, WHY_QUANTUM } from './whyQuantum';

/** Home preview helpers mapped from full datasets */
export { JOBS as PREVIEW_JOBS } from './jobs';
export { INTERNSHIPS as PREVIEW_INTERNSHIPS } from './internships';
export { PORTFOLIO as PREVIEW_PORTFOLIO } from './portfolio';
export { getArticlesNewestFirst as getPreviewBlogs } from './blog';
export { BLOG_ARTICLES as PREVIEW_BLOGS } from './blog';
