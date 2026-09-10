import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { useAppSelector } from '../../hooks';

interface GuestRouteProps {
  children: ReactNode;
}

/**
 * Login / register only. Signed-in users are sent into the app.
 */
export function GuestRoute({ children }: GuestRouteProps) {
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const from =
    (location.state as { from?: string } | null)?.from &&
    (location.state as { from?: string }).from !== ROUTES.login &&
    (location.state as { from?: string }).from !== ROUTES.register
      ? (location.state as { from: string }).from
      : ROUTES.home;

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return children;
}
