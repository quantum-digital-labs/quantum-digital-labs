import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { JwtPayload, UserRole } from '../types';
import { AppError } from './AppError';

export function signAccessToken(payload: {
  id: string;
  email: string;
  role: UserRole;
}): string {
  return jwt.sign(
    { sub: payload.id, email: payload.email, role: payload.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions,
  );
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    if (
      typeof decoded.sub !== 'string' ||
      typeof decoded.email !== 'string' ||
      typeof decoded.role !== 'string'
    ) {
      throw new AppError('Invalid token payload', 401);
    }
    return {
      sub: decoded.sub,
      email: decoded.email,
      role: decoded.role as UserRole,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Invalid or expired token', 401);
  }
}
