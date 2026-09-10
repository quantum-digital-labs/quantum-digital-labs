import type { NextFunction, Request, Response } from 'express';
import * as aboutService from '../services/about.service';

export async function getAbout(_req: Request, res: Response, next: NextFunction) {
  try {
    const about = await aboutService.getAbout();
    res.json(about);
  } catch (error) {
    next(error);
  }
}

export async function putAbout(req: Request, res: Response, next: NextFunction) {
  try {
    const about = await aboutService.putAbout(req.body);
    res.json(about);
  } catch (error) {
    next(error);
  }
}
