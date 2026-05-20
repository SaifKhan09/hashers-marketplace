import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ApiError } from '../../utils/api-error';
import { signin, signout, signup, getCurrentUser } from './auth.service';

export const signupController = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'firstName, lastName, email and password are required');
  }

  const result = await signup({ firstName, lastName, email, password });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
};

export const signinController = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'email and password are required');
  }

  const result = await signin({ email, password });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'User signed in successfully',
    data: result,
  });
};

export const signoutController = async (_req: Request, res: Response): Promise<void> => {
  const result = await signout();

  res.status(StatusCodes.OK).json({
    success: true,
    message: result.message,
  });
};

export const meController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }

  const user = await getCurrentUser(req.user.userId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Current user fetched successfully',
    data: user,
  });
};