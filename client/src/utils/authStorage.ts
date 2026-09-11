import { supabase } from '../lib/supabaseClient';
import type { AuthUser } from '../store/slices/authSlice';

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

/** Supabase's client already persists the real session in localStorage and
 * attaches it automatically to every request — this is now a no-op kept
 * only so existing call sites (LoginPage, AdminLoginPage) don't need to
 * change. */
export function saveSession(_session: AuthSession): void {
  // no-op
}

/** Synchronous session loading is no longer possible (Supabase's session
 * check is async) — app boot now uses `restoreSession()` from authApi
 * instead. Always returns null so any leftover call sites fall through. */
export function loadSession(): AuthSession | null {
  return null;
}

export function clearSession(): void {
  void supabase.auth.signOut();
}
