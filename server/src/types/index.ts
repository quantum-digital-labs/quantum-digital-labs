export type UserRole =
  | 'admin'
  | 'hr'
  | 'recruiter'
  | 'editor'
  | 'candidate'
  | 'client';

export type JobApplicationStatus =
  | 'received'
  | 'reviewing'
  | 'shortlisted'
  | 'rejected'
  | 'hired';

export type InternshipApplicationStatus =
  | 'received'
  | 'reviewing'
  | 'shortlisted'
  | 'rejected'
  | 'selected';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface SubmitResult {
  referenceNumber: string;
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
