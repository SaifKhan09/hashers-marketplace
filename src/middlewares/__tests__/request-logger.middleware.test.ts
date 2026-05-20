import { requestLoggerMiddleware } from '../request-logger.middleware';
import { createNext } from '../../../tests/helpers/http-mocks';

jest.mock('../../lib/logger', () => ({
  logger: {
    http: jest.fn(),
  },
}));

import { logger } from '../../lib/logger';

describe('requestLoggerMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register finish listener and call next', () => {
    let finishHandler: (() => void) | undefined;

    const req: any = {
      method: 'GET',
      originalUrl: '/items',
      ip: '127.0.0.1',
      get: jest.fn((header: string) => {
        if (header.toLowerCase() === 'user-agent') {
          return 'jest-test-agent';
        }
        return undefined;
      }),
    };

    const res: any = {
      statusCode: 200,
      on: jest.fn((event: string, cb: () => void) => {
        if (event === 'finish') {
          finishHandler = cb;
        }
      }),
    };

    const next = createNext();

    requestLoggerMiddleware(req, res, next);

    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
    expect(next).toHaveBeenCalled();

    finishHandler?.();

    expect(logger.http).toHaveBeenCalledWith(
      'Incoming request processed',
      expect.objectContaining({
        method: 'GET',
        url: '/items',
        ip: '127.0.0.1',
        userAgent: 'jest-test-agent',
        statusCode: 200,
      }),
    );
  });
});