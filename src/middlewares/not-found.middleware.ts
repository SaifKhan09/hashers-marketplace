import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const notFoundMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next({
    statusCode: StatusCodes.NOT_FOUND,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};