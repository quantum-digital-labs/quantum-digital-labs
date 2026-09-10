import type { NextFunction, Request, Response } from 'express';
import * as projectsService from '../services/projects.service';
import { listOpts } from '../utils/cmsHelpers';

export async function listProjects(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await projectsService.listProjects(listOpts(req));
    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function getProject(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await projectsService.getProjectById(
      req.params.id as string,
      listOpts(req),
    );
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function createProject(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const item = await projectsService.createProject(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

export async function updateProject(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const item = await projectsService.updateProject(
      req.params.id as string,
      req.body,
    );
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await projectsService.deleteProject(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
