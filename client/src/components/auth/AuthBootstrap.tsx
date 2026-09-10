import type { ReactNode } from 'react';

interface AuthBootstrapProps {
  children: ReactNode;
}

/**
 * Auth session is restored when the Redux store is created.
 * This wrapper remains for a stable app composition point.
 */
export function AuthBootstrap({ children }: AuthBootstrapProps) {
  return children;
}
