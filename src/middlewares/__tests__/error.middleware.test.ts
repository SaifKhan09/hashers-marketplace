import { StatusCodes } from 'http-status-codes';

import { ApiError } from '../../utils/api-error';
import { errorMiddleware } from '../error.middleware';
import { createMockRequest, createMockResponse, createNext } from '../../../tests/helpers/http-mocks';

describe('errorMiddleware', () => {
  it('should handle ApiError', () => {
    const err = new ApiError(StatusCodes.BAD_REQUEST, 'Invalid input');
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createNext();

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Invalid input',
      }),
    );
  });

  it('should handle generic error', () => {
    const err = new Error('Something broke');
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createNext();

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
      }),
    );
  });
});