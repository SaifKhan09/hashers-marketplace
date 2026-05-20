import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ApiError } from '../utils/api-error';

type Role = 'USER' | 'ADMIN';

export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized'));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new ApiError(StatusCodes.FORBIDDEN, 'Access denied'));
      return;
    }

    next();
  };
};