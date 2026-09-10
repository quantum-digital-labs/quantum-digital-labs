import { apiClient } from './apiClient';
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

export async function loginRequest(
  email: string,
  password: string,
  portal?: 'admin' | 'public',
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', {
    email,
    password,
    ...(portal ? { portal } : {}),
  });
  return data;
}

export async function registerRequest(
  email: string,
  password: string,
): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>('/auth/register', {
    email,
    password,
  });
  return data;
}

export async function verifyEmailRequest(token: string): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>('/auth/verify-email', {
    token,
  });
  return data;
}

export async function verifyEmailByCodeRequest(
  email: string,
  code: string,
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>('/auth/verify-email', {
    email,
    code,
  });
  return data;
}

export async function resendVerificationRequest(
  email: string,
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(
    '/auth/resend-verification',
    { email },
  );
  return data;
}
