import { StatusCodes } from 'http-status-codes';

import { authMiddleware } from '../auth.middleware';
import { createMockRequest, createMockResponse, createNext } from '../../../tests/helpers/http-mocks';

jest.mock('../../utils/jwt', () => ({
  verifyToken: jest.fn(),
}));

import { verifyToken } from '../../utils/jwt';

describe('authMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should attach user and call next for valid token', () => {
    const req = createMockRequest({
      headers: {
        authorization: 'Bearer valid-token',
      },
    });
    const res = createMockResponse();
    const next = createNext();

    (verifyToken as jest.Mock).mockReturnValue({
      userId: 'user-1',
      email: 'user@example.com',
      role: 'USER',
    });

    authMiddleware(req, res, next);

    expect(req.user).toEqual({
      userId: 'user-1',
      email: 'user@example.com',
      role: 'USER',
    });
    expect(next).toHaveBeenCalledWith();
  });

  it('should forward unauthorized error when authorization header is missing', () => {
    const req = createMockRequest({ headers: {} });
    const res = createMockResponse();
    const next = createNext();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: StatusCodes.UNAUTHORIZED,
      }),
    );
  });

  it('should forward unauthorized error when token format is invalid', () => {
    const req = createMockRequest({
      headers: {
        authorization: 'invalid-token-format',
      },
    });
    const res = createMockResponse();
    const next = createNext();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: StatusCodes.UNAUTHORIZED,
      }),
    );
  });

  it('should forward unauthorized error when token verification fails', () => {
    const req = createMockRequest({
      headers: {
        authorization: 'Bearer bad-token',
      },
    });
    const res = createMockResponse();
    const next = createNext();

    (verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('invalid token');
    });

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: StatusCodes.UNAUTHORIZED,
      }),
    );
  });
});