import { StatusCodes } from 'http-status-codes';

import { notFoundMiddleware } from '../not-found.middleware';
import { createMockRequest, createMockResponse, createNext } from '../../../tests/helpers/http-mocks';

describe('notFoundMiddleware', () => {
  it('should forward 404 error to next', () => {
    const req = createMockRequest({
      originalUrl: '/unknown-route',
    });
    const res = createMockResponse();
    const next = createNext();

    notFoundMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: StatusCodes.NOT_FOUND,
      }),
    );
  });
});