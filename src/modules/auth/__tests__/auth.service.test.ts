import { Role } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { prismaMock } from '../../../../tests/setup/prisma-mock';

jest.mock('../../../utils/password', () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}));

jest.mock('../../../utils/jwt', () => ({
  generateToken: jest.fn(),
}));

import { hashPassword, comparePassword } from '../../../utils/password';
import { generateToken } from '../../../utils/jwt';
import { signin, signup } from '../auth.service';

describe('auth.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should register a new user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null as any);
      (hashPassword as jest.Mock).mockResolvedValue('hashed-password');

      prismaMock.user.create.mockResolvedValue({
        id: 'user-1',
        firstName: 'Saif',
        lastName: 'Khan',
        email: 'saif@example.com',
        passwordHash: 'hashed-password',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      (generateToken as jest.Mock).mockReturnValue('mock-jwt-token');

      const result = await signup({
        firstName: 'Saif',
        lastName: 'Khan',
        email: 'saif@example.com',
        password: 'Password@123',
      });

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'saif@example.com' },
      });
      expect(hashPassword).toHaveBeenCalledWith('Password@123');
      expect(generateToken).toHaveBeenCalledWith({
        userId: 'user-1',
        email: 'saif@example.com',
        role: Role.USER,
      });
      expect(result.token).toBe('mock-jwt-token');
    });

    it('should throw error if email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'saif@example.com',
      } as any);

      await expect(
        signup({
          firstName: 'Saif',
          lastName: 'Khan',
          email: 'saif@example.com',
          password: 'Password@123',
        }),
      ).rejects.toMatchObject({
        statusCode: StatusCodes.CONFLICT,
      });
    });
  });

  describe('signin', () => {
    it('should login successfully with valid credentials', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        firstName: 'Saif',
        lastName: 'Khan',
        email: 'saif@example.com',
        passwordHash: 'hashed-password',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      (comparePassword as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue('mock-jwt-token');

      const result = await signin({
        email: 'saif@example.com',
        password: 'Password@123',
      });

      expect(comparePassword).toHaveBeenCalledWith('Password@123', 'hashed-password');
      expect(generateToken).toHaveBeenCalledWith({
        userId: 'user-1',
        email: 'saif@example.com',
        role: Role.USER,
      });
      expect(result.token).toBe('mock-jwt-token');
    });

    it('should throw error when user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null as any);

      await expect(
        signin({
          email: 'missing@example.com',
          password: 'Password@123',
        }),
      ).rejects.toMatchObject({
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    });

    it('should throw error when password is invalid', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'saif@example.com',
        passwordHash: 'hashed-password',
        role: Role.USER,
      } as any);

      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        signin({
          email: 'saif@example.com',
          password: 'wrong-password',
        }),
      ).rejects.toMatchObject({
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    });
  });
});