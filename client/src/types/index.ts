export type UserRole =
  | 'admin'
  | 'hr'
  | 'recruiter'
  | 'editor'
  | 'candidate'
  | 'client';

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type {
  ServiceCategoryId,
  ServiceItem,
  ServiceCategory,
  JobPreview,
  InternshipPreview,
  PortfolioPreview,
  BlogPreview,
} from './content';
