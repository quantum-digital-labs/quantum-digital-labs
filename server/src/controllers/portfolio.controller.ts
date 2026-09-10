import type { NextFunction, Request, Response } from 'express';
import * as portfolioService from '../services/portfolio.service';
import { listOpts } from '../utils/cmsHelpers';

export async function listPortfolio(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const items = await portfolioService.listPortfolio(listOpts(req));
    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function getPortfolioItem(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const item = await portfolioService.getPortfolioById(
      req.params.id as string,
      listOpts(req),
    );
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function createPortfolioItem(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const item = await portfolioService.createPortfolioItem(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

export async function updatePortfolioItem(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const item = await portfolioService.updatePortfolioItem(
      req.params.id as string,
      req.body,
    );
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function deletePortfolioItem(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await portfolioService.deletePortfolioItem(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
