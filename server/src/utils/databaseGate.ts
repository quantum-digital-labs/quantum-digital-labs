import { AppError } from '../utils/AppError';

/** Thrown by services until PostgreSQL is wired in the next step. */
export function assertDatabaseReady(): never {
  throw new AppError(
    'Database is not connected yet. PostgreSQL wiring comes next.',
    503,
  );
}
