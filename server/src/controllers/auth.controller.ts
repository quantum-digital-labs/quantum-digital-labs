import type { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth.service';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const result = await authService.registerUser(email, password);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, portal } = req.body as {
      email: string;
      password: string;
      portal?: 'admin' | 'public';
    };
    const result = await authService.loginUser(email, password, portal ?? 'public');
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.verifyEmail(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function resendVerification(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email } = req.body as { email: string };
    const result = await authService.resendVerification(email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
