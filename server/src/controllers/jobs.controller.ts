import type { NextFunction, Request, Response } from 'express';
import * as jobsService from '../services/jobs.service';
import { listOpts } from '../utils/cmsHelpers';

export async function listJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await jobsService.listJobs(listOpts(req));
    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function getJob(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await jobsService.getJobById(
      req.params.id as string,
      listOpts(req),
    );
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function createJob(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await jobsService.createJob(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

export async function updateJob(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await jobsService.updateJob(req.params.id as string, req.body);
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function deleteJob(req: Request, res: Response, next: NextFunction) {
  try {
    await jobsService.deleteJob(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
