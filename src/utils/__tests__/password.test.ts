import { comparePassword, hashPassword } from '../password';

describe('password utils', () => {
  it('should hash password', async () => {
    const hashed = await hashPassword('Password@123');

    expect(hashed).toBeDefined();
    expect(hashed).not.toBe('Password@123');
  });

  it('should compare valid password successfully', async () => {
    const hashed = await hashPassword('Password@123');

    const result = await comparePassword('Password@123', hashed);

    expect(result).toBe(true);
  });

  it('should return false for invalid password', async () => {
    const hashed = await hashPassword('Password@123');

    const result = await comparePassword('WrongPassword', hashed);

    expect(result).toBe(false);
  });
});