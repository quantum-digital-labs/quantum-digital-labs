import crypto from 'crypto';
import { getPool } from '../db/pool';
import type { AuthUser, UserRole } from '../types';
import { AppError } from '../utils/AppError';
import { sendVerificationEmail, sendWelcomeEmail } from '../utils/emailTemplates';
import { signAccessToken } from '../utils/jwt';
import { comparePassword, hashPassword } from '../utils/password';

export interface RegisterResult {
  message: string;
  email: string;
  requiresVerification: boolean;
}

export interface LoginResult {
  accessToken: string;
  user: AuthUser;
}

export interface MessageResult {
  message: string;
  email?: string;
}

type Portal = 'admin' | 'public';

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: UserRole;
  is_verified: boolean;
  verification_token: string | null;
  verification_code: string | null;
  verification_expires_at: Date | null;
}

const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const ADMIN_PORTAL_ROLES: UserRole[] = ['admin', 'editor'];

function generateVerificationCode(): string {
  return String(crypto.randomInt(100000, 1000000));
}

function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function toAuthUser(row: Pick<UserRow, 'id' | 'email' | 'name' | 'role'>): AuthUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
  };
}

export async function registerUser(
  email: string,
  password: string,
): Promise<RegisterResult> {
  const pool = getPool();
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await pool.query<{ id: string }>(
    `SELECT id FROM users WHERE email = $1`,
    [normalizedEmail],
  );
  if (existing.rowCount && existing.rowCount > 0) {
    throw new AppError('An account with this email already exists', 409);
  }

  const passwordHash = await hashPassword(password);
  const code = generateVerificationCode();
  const token = generateVerificationToken();
  const expiresAt = new Date(Date.now() + VERIFICATION_TTL_MS);
  const name = normalizedEmail.split('@')[0] ?? '';

  await pool.query(
    `INSERT INTO users (
       email, password_hash, name, role, is_verified,
       verification_token, verification_code, verification_expires_at
     ) VALUES ($1, $2, $3, 'candidate', FALSE, $4, $5, $6)`,
    [normalizedEmail, passwordHash, name, token, code, expiresAt],
  );

  await sendWelcomeEmail({
    email: normalizedEmail,
    password,
    code,
    token,
  });

  return {
    message: 'Registration successful. Please verify your email.',
    email: normalizedEmail,
    requiresVerification: true,
  };
}

export async function loginUser(
  email: string,
  password: string,
  portal: Portal = 'public',
): Promise<LoginResult> {
  const pool = getPool();
  const normalizedEmail = email.trim().toLowerCase();

  const result = await pool.query<UserRow>(
    `SELECT id, email, password_hash, name, role, is_verified,
            verification_token, verification_code, verification_expires_at
     FROM users WHERE email = $1`,
    [normalizedEmail],
  );

  const user = result.rows[0];
  if (!user) {
    if (portal === 'public') {
      throw new AppError('Register first to login', 404);
    }
    throw new AppError('Invalid email or password', 401);
  }

  const passwordOk = await comparePassword(password, user.password_hash);
  if (!passwordOk) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.is_verified) {
    throw new AppError('Email not verified. Please verify your email first.', 403);
  }

  if (portal === 'admin' && !ADMIN_PORTAL_ROLES.includes(user.role)) {
    throw new AppError('Admin access required', 403);
  }

  const accessToken = signAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    accessToken,
    user: toAuthUser(user),
  };
}

export async function verifyEmail(input: {
  token?: string;
  email?: string;
  code?: string;
}): Promise<MessageResult> {
  const pool = getPool();
  let user: UserRow | undefined;

  if (input.token) {
    const result = await pool.query<UserRow>(
      `SELECT id, email, password_hash, name, role, is_verified,
              verification_token, verification_code, verification_expires_at
       FROM users WHERE verification_token = $1`,
      [input.token],
    );
    user = result.rows[0];
  } else if (input.email && input.code) {
    const result = await pool.query<UserRow>(
      `SELECT id, email, password_hash, name, role, is_verified,
              verification_token, verification_code, verification_expires_at
       FROM users WHERE email = $1`,
      [input.email.trim().toLowerCase()],
    );
    user = result.rows[0];
    if (user && user.verification_code !== input.code) {
      throw new AppError('Invalid verification code', 400);
    }
  } else {
    throw new AppError('Provide either token, or email and code', 400);
  }

  if (!user) {
    throw new AppError('Invalid or expired verification credentials', 400);
  }

  if (user.is_verified) {
    return { message: 'Email is already verified', email: user.email };
  }

  if (
    user.verification_expires_at &&
    new Date(user.verification_expires_at).getTime() < Date.now()
  ) {
    throw new AppError('Verification code has expired. Please request a new one.', 400);
  }

  await pool.query(
    `UPDATE users
     SET is_verified = TRUE,
         verification_token = NULL,
         verification_code = NULL,
         verification_expires_at = NULL,
         updated_at = NOW()
     WHERE id = $1`,
    [user.id],
  );

  return { message: 'Email verified successfully', email: user.email };
}

export async function resendVerification(email: string): Promise<MessageResult> {
  const pool = getPool();
  const normalizedEmail = email.trim().toLowerCase();

  const result = await pool.query<UserRow>(
    `SELECT id, email, password_hash, name, role, is_verified,
            verification_token, verification_code, verification_expires_at
     FROM users WHERE email = $1`,
    [normalizedEmail],
  );

  const user = result.rows[0];
  if (!user) {
    // Avoid email enumeration
    return {
      message: 'If an account exists for this email, a verification code has been sent.',
      email: normalizedEmail,
    };
  }

  if (user.is_verified) {
    return { message: 'Email is already verified', email: user.email };
  }

  const code = generateVerificationCode();
  const token = generateVerificationToken();
  const expiresAt = new Date(Date.now() + VERIFICATION_TTL_MS);

  await pool.query(
    `UPDATE users
     SET verification_token = $1,
         verification_code = $2,
         verification_expires_at = $3,
         updated_at = NOW()
     WHERE id = $4`,
    [token, code, expiresAt, user.id],
  );

  await sendVerificationEmail({
    email: user.email,
    code,
    token,
  });

  return {
    message: 'Verification code sent',
    email: user.email,
  };
}
