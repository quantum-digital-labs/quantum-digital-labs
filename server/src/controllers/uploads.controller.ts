import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';

export async function uploadProjectScreenshots(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const files = req.files;
    if (!Array.isArray(files) || files.length === 0) {
      throw new AppError('Select at least one image to upload', 400);
    }

    const urls = files.map((file) => `/uploads/projects/${file.filename}`);
    res.status(201).json({ urls });
  } catch (error) {
    next(error);
  }
}

export async function uploadPortfolioGallery(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const files = req.files;
    if (!Array.isArray(files) || files.length === 0) {
      throw new AppError('Select at least one image to upload', 400);
    }

    const urls = files.map((file) => `/uploads/portfolio/${file.filename}`);
    res.status(201).json({ urls });
  } catch (error) {
    next(error);
  }
}

export async function uploadCoverImage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const file = req.file;
    if (!file) {
      throw new AppError('Select an image to upload', 400);
    }

    res.status(201).json({ url: `/uploads/covers/${file.filename}` });
  } catch (error) {
    next(error);
  }
}
