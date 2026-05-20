import { NextFunction, Request, Response } from 'express';

export const createMockRequest = (overrides: Partial<Request> = {}): Request =>
  ({
    ...overrides,
  } as Request);

export const createMockResponse = (): Response => {
  const res = {} as Response;

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);

  return res;
};

export const createNext = (): NextFunction => jest.fn();