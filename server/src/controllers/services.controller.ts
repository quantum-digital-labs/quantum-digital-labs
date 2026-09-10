import type { NextFunction, Request, Response } from 'express';
import * as servicesService from '../services/services.service';
import { listOpts } from '../utils/cmsHelpers';

export async function listServices(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await servicesService.listServiceCategories(listOpts(req));
    res.json(categories);
  } catch (error) {
    next(error);
  }
}

export async function getServiceCategory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const category = await servicesService.getServiceCategory(
      req.params.categoryId as string,
      listOpts(req),
    );
    res.json(category);
  } catch (error) {
    next(error);
  }
}

export async function getService(req: Request, res: Response, next: NextFunction) {
  try {
    const service = await servicesService.getService(
      req.params.categoryId as string,
      req.params.slug as string,
      listOpts(req),
    );
    res.json(service);
  } catch (error) {
    next(error);
  }
}

export async function createServiceCategory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const category = await servicesService.upsertServiceCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
}

export async function updateServiceCategory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const category = await servicesService.updateServiceCategory(
      req.params.categoryId as string,
      req.body,
    );
    res.json(category);
  } catch (error) {
    next(error);
  }
}

export async function deleteServiceCategory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await servicesService.deleteServiceCategory(req.params.categoryId as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function createService(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const service = await servicesService.createService(
      req.params.categoryId as string,
      req.body,
    );
    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
}

export async function updateService(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const service = await servicesService.updateService(
      req.params.categoryId as string,
      req.params.slug as string,
      req.body,
    );
    res.json(service);
  } catch (error) {
    next(error);
  }
}

export async function deleteService(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await servicesService.deleteService(
      req.params.categoryId as string,
      req.params.slug as string,
    );
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
