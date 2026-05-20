import { logger } from '../logger';

describe('logger', () => {
  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should expose info method', () => {
    expect(typeof logger.info).toBe('function');
  });
});