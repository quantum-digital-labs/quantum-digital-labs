import type { NextFunction, Request, Response } from 'express';
import * as internshipsService from '../services/internships.service';
import { listOpts } from '../utils/cmsHelpers';

export async function listInternships(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const items = await internshipsService.listInternships(listOpts(req));
    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function getInternship(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const item = await internshipsService.getInternshipById(
      req.params.id as string,
      listOpts(req),
    );
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function createInternship(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const item = await internshipsService.createInternship(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

export async function updateInternship(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const item = await internshipsService.updateInternship(
      req.params.id as string,
      req.body,
    );
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function deleteInternship(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await internshipsService.deleteInternship(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
