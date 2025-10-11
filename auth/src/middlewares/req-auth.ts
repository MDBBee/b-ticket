import { NextFunction, Request, Response } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    throw new NotAuthorizedError();
  }

  next();
};
