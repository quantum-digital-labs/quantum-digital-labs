import { isDatabaseConnected } from '../db/pool';
import { AppError } from '../utils/AppError';

export function assertDatabaseReady(): void {
  if (!isDatabaseConnected()) {
    throw new AppError(
      'Database is not connected. Set DATABASE_URL and restart the API.',
      503,
    );
  }
}
