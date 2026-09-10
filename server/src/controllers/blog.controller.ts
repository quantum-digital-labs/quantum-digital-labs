import type { NextFunction, Request, Response } from 'express';
import * as blogService from '../services/blog.service';
import { listOpts } from '../utils/cmsHelpers';

export async function listBlog(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await blogService.listBlog(listOpts(req));
    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function getBlogPost(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await blogService.getBlogBySlug(
      req.params.slug as string,
      listOpts(req),
    );
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function createBlogPost(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const item = await blogService.createBlogPost(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

export async function updateBlogPost(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const item = await blogService.updateBlogPost(
      req.params.slug as string,
      req.body,
    );
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function deleteBlogPost(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await blogService.deleteBlogPost(req.params.slug as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
