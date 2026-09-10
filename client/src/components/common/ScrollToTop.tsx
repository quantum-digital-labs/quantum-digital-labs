import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Ensures each navigation starts at the top — no dead-end scroll traps. */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname]);

  return null;
}
