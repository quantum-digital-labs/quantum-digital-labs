import type { NextFunction, Request, Response } from 'express';
import * as inquiriesService from '../services/inquiries.service';

export async function submitContact(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await inquiriesService.createContactInquiry(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function submitQuote(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await inquiriesService.createQuoteInquiry(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function submitDemo(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await inquiriesService.createDemoInquiry(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
