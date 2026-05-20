import { StatusCodes } from 'http-status-codes';

import { requireRole } from '../role.middleware';
import { createMockRequest, createMockResponse, createNext } from '../../../tests/helpers/http-mocks';

describe('roleMiddleware', () => {
  it('should call next when user has allowed role', () => {
    const req = createMockRequest({
      user: {
        userId: 'admin-1',
        email: 'admin@example.com',
        role: 'ADMIN',
      },
    });
    const res = createMockResponse();
    const next = createNext();

    requireRole('ADMIN')(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should forward unauthorized error when user is missing', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createNext();

    requireRole('ADMIN')(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: StatusCodes.UNAUTHORIZED,
      }),
    );
  });

  it('should forward forbidden error when role is not allowed', () => {
    const req = createMockRequest({
      user: {
        userId: 'user-1',
        email: 'user@example.com',
        role: 'USER',
      },
    });
    const res = createMockResponse();
    const next = createNext();

    requireRole('ADMIN')(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: StatusCodes.FORBIDDEN,
      }),
    );
  });
});