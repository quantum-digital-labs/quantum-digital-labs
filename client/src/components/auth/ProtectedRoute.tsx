import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { useAppSelector } from '../../hooks';

interface ProtectedRouteProps {
  children?: ReactNode;
  roles?: string[];
  /** Where to send guests. Defaults to public login. */
  loginPath?: string;
}

/**
 * Requires sign-in for apply/quote/admin actions. Redirects guests to login and
 * preserves the intended destination in location state.
 */
export function ProtectedRoute({
  children,
  roles,
  loginPath = ROUTES.login,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <Navigate
        to={loginPath}
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (roles && user && !roles.includes(user.role)) {
    if (loginPath === ROUTES.adminLogin) {
      return <Navigate to={ROUTES.adminLogin} replace />;
    }
    return <Navigate to={ROUTES.home} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
