import type { NextFunction, Request, Response } from 'express';
import * as applicationsService from '../services/applications.service';
import type {
  InternshipApplicationStatus,
  JobApplicationStatus,
} from '../types';
import { AppError } from '../utils/AppError';

export async function submitJob(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.file) {
      throw new AppError('Resume is required', 400);
    }

    const result = await applicationsService.createJobApplication({
      ...(req.body as applicationsService.JobApplicationInput),
      resumeFileName: req.file.originalname,
      resumePath: req.file.path,
      userId: req.user?.id,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function submitInternship(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.file) {
      throw new AppError('Resume is required', 400);
    }

    const result = await applicationsService.createInternshipApplication({
      ...(req.body as applicationsService.InternshipApplicationInput),
      resumeFileName: req.file.originalname,
      resumePath: req.file.path,
      userId: req.user?.id,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getMine(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }
    const result = await applicationsService.getMyApplications(
      req.user.id,
      req.user.email,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    void req;
    const result = await applicationsService.getAdminApplications();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function patchJobStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { referenceNumber } = req.params as { referenceNumber: string };
    const { status } = req.body as { status: JobApplicationStatus };
    const result = await applicationsService.updateJobStatus(
      referenceNumber,
      status,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function patchInternshipStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { referenceNumber } = req.params as { referenceNumber: string };
    const { status } = req.body as { status: InternshipApplicationStatus };
    const result = await applicationsService.updateInternshipStatus(
      referenceNumber,
      status,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
