import { env } from '../env';

describe('env config', () => {
  it('should load environment configuration', () => {
    expect(env).toBeDefined();
    expect(env.port).toBeDefined();
  });
});