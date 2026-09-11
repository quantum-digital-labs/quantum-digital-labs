import { supabase } from '../lib/supabaseClient';
import type { AuthUser } from '../store/slices/authSlice';

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterResponse {
  message: string;
  email: string;
  requiresVerification: boolean;
}

export interface MessageResponse {
  message: string;
  email?: string;
}

const ADMIN_PORTAL_ROLES = ['admin', 'editor'];

/** Reads the app-level role/name from `public.profiles` (auto-created by a
 * DB trigger on sign-up). Falls back to sane defaults if the row is
 * somehow missing so a login never hard-fails on this lookup alone. */
async function fetchProfile(userId: string, email: string): Promise<AuthUser> {
  const { data } = await supabase
    .from('profiles')
    .select('id, email, name, role')
    .eq('id', userId)
    .single();

  if (!data) {
    return { id: userId, email, name: email.split('@')[0] ?? '', role: 'candidate' };
  }
  return { id: data.id, email: data.email, name: data.name, role: data.role };
}

export async function loginRequest(
  email: string,
  password: string,
  portal?: 'admin' | 'public',
): Promise<AuthResponse> {
  const normalizedEmail = email.trim().toLowerCase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error || !data.session || !data.user) {
    if (/email not confirmed/i.test(error?.message ?? '')) {
      throw new Error('Email not verified. Please verify your email first.');
    }
    throw new Error(
      'Invalid email or password. If you do not have an account yet, please register first.',
    );
  }

  const user = await fetchProfile(data.user.id, data.user.email ?? normalizedEmail);

  if (portal === 'admin' && !ADMIN_PORTAL_ROLES.includes(user.role)) {
    await supabase.auth.signOut();
    throw new Error('Admin access required');
  }

  return { accessToken: data.session.access_token, user };
}

export async function registerRequest(
  email: string,
  password: string,
): Promise<RegisterResponse> {
  const normalizedEmail = email.trim().toLowerCase();
  const name = normalizedEmail.split('@')[0] ?? '';

  const { error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: { name, role: 'candidate' },
    },
  });

  if (error) {
    if (/already registered|already exists|user already/i.test(error.message)) {
      throw new Error('An account with this email already exists');
    }
    throw new Error(error.message);
  }

  return {
    message: 'Registration successful. Please verify your email.',
    email: normalizedEmail,
    requiresVerification: true,
  };
}

export async function verifyEmailRequest(token: string): Promise<MessageResponse> {
  // Legacy link-token verification isn't used with Supabase Auth (its own
  // confirmation link is handled automatically by the client's
  // `detectSessionInUrl` option). Kept only so an old bookmarked link
  // doesn't hard-crash the app.
  void token;
  throw new Error('This verification link is outdated. Please use the 6-digit code instead.');
}

export async function verifyEmailByCodeRequest(
  email: string,
  code: string,
): Promise<MessageResponse> {
  const normalizedEmail = email.trim().toLowerCase();
  const { error } = await supabase.auth.verifyOtp({
    email: normalizedEmail,
    token: code,
    type: 'signup',
  });

  if (error) {
    throw new Error(
      /expired/i.test(error.message)
        ? 'Verification code has expired. Please request a new one.'
        : 'Invalid verification code',
    );
  }

  // verifyOtp signs the user in as a side effect; sign back out so the
  // normal sign-in form (with a real password check) still runs afterwards.
  await supabase.auth.signOut();
  return { message: 'Email verified successfully', email: normalizedEmail };
}

export async function resendVerificationRequest(
  email: string,
): Promise<MessageResponse> {
  const normalizedEmail = email.trim().toLowerCase();
  // Ignore the error deliberately — same generic message either way avoids
  // leaking whether an account exists for this email.
  await supabase.auth.resend({ type: 'signup', email: normalizedEmail });
  return {
    message: 'If an account exists for this email, a verification code has been sent.',
    email: normalizedEmail,
  };
}

/** Restore whatever Supabase session already exists (e.g. returning user
 * with a valid refresh token) — used once at app boot. */
export async function restoreSession(): Promise<AuthResponse | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session?.user) return null;
  const user = await fetchProfile(data.session.user.id, data.session.user.email ?? '');
  return { accessToken: data.session.access_token, user };
}
