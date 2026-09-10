import type { AuthUser } from '../store/slices/authSlice';

const SESSION_KEY = 'qdl_auth_session';

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

/** Persist JWT session after successful login/register against the API. */
export function saveSession(session: AuthSession): void {
  localStorage.setItem('accessToken', session.accessToken);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem(SESSION_KEY);
}
