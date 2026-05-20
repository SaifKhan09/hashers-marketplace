import { Request, Response, NextFunction } from 'express';

import { asyncHandler } from '../../utils/async-handler';

describe('asyncHandler', () => {
  it('should call wrapped handler successfully', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const wrapped = asyncHandler(handler);

    await wrapped({} as Request, {} as Response, jest.fn() as NextFunction);

    expect(handler).toHaveBeenCalled();
  });

  it('should forward errors to next', async () => {
    const error = new Error('Boom');
    const handler = jest.fn().mockRejectedValue(error);
    const next = jest.fn();
    const wrapped = asyncHandler(handler);

    await wrapped({} as Request, {} as Response, next as NextFunction);

    expect(next).toHaveBeenCalledWith(error);
  });
});