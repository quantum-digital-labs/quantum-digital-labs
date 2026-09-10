import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { useAppSelector } from '../../hooks';

interface AdminGuestRouteProps {
  children: ReactNode;
}

/**
 * Admin login only. Staff already signed in go to the CMS dashboard.
 * Non-staff authenticated users still see the admin login form.
 */
export function AdminGuestRoute({ children }: AdminGuestRouteProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const isStaff = user?.role === 'admin' || user?.role === 'editor';

  if (isAuthenticated && isStaff) {
    return <Navigate to={ROUTES.admin} replace />;
  }

  return children;
}
