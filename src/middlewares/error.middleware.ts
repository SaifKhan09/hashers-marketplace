import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { env } from '../config/env';
import { logger } from '../lib/logger';
import { ApiError } from '../utils/api-error';

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.headersSent) {
    next(error);
    return;
  }

  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';
  let details: unknown;

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    details = error.details;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Database operation failed';
    details = {
      code: error.code,
      meta: error.meta,
    };
  } else if (error instanceof Error) {
    message = error.message;
  } else if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'statusCode' in error
  ) {
    const err = error as { message: string; statusCode: number; details?: unknown };
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  }

  logger.error('Request failed', {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message,
    details,
    error: error instanceof Error ? error.stack : error,
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(env.nodeEnv === 'development' && error instanceof Error
      ? { stack: error.stack }
      : {}),
  });
};