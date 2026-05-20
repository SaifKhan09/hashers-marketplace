import { StatusCodes } from 'http-status-codes';

import { createMockRequest, createMockResponse } from '../../../../tests/helpers/http-mocks';

jest.mock('../auth.service', () => ({
  signup: jest.fn(),
  signin: jest.fn(),
  signout: jest.fn(),
  getCurrentUser: jest.fn(),
}));

const authService = require('../auth.service');
const {
  signupController,
  signinController,
  signoutController,
  meController,
} = require('../auth.controller');

describe('auth.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signupController', () => {
    it('should register user successfully', async () => {
      const req = createMockRequest({
        body: {
          firstName: 'Saif',
          lastName: 'Khan',
          email: 'saif@example.com',
          password: 'Password@123',
        },
      });
      const res = createMockResponse();

      authService.signup.mockResolvedValue({
        user: {
          id: 'user-1',
          email: 'saif@example.com',
        },
        token: 'mock-jwt-token',
      });

      await signupController(req, res);

      expect(authService.signup).toHaveBeenCalledWith({
        firstName: 'Saif',
        lastName: 'Khan',
        email: 'saif@example.com',
        password: 'Password@123',
      });
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: 'user-1',
            email: 'saif@example.com',
          },
          token: 'mock-jwt-token',
        },
      });
    });

    it('should throw bad request when required fields are missing', async () => {
      const req = createMockRequest({
        body: {
          email: 'saif@example.com',
        },
      });
      const res = createMockResponse();

      await expect(signupController(req, res)).rejects.toMatchObject({
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'firstName, lastName, email and password are required',
      });
    });
  });

  describe('signinController', () => {
    it('should sign in user successfully', async () => {
      const req = createMockRequest({
        body: {
          email: 'saif@example.com',
          password: 'Password@123',
        },
      });
      const res = createMockResponse();

      authService.signin.mockResolvedValue({
        user: {
          id: 'user-1',
          email: 'saif@example.com',
        },
        token: 'mock-jwt-token',
      });

      await signinController(req, res);

      expect(authService.signin).toHaveBeenCalledWith({
        email: 'saif@example.com',
        password: 'Password@123',
      });
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User signed in successfully',
        data: {
          user: {
            id: 'user-1',
            email: 'saif@example.com',
          },
          token: 'mock-jwt-token',
        },
      });
    });

    it('should throw bad request when email or password is missing', async () => {
      const req = createMockRequest({
        body: {
          email: 'saif@example.com',
        },
      });
      const res = createMockResponse();

      await expect(signinController(req, res)).rejects.toMatchObject({
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'email and password are required',
      });
    });
  });

  describe('signoutController', () => {
    it('should sign out user successfully', async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      authService.signout.mockResolvedValue({
        message: 'User signed out successfully',
      });

      await signoutController(req, res);

      expect(authService.signout).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User signed out successfully',
      });
    });
  });

  describe('meController', () => {
    it('should return current user successfully', async () => {
      const req = createMockRequest({
        user: {
          userId: 'user-1',
          email: 'saif@example.com',
          role: 'USER',
        },
      });
      const res = createMockResponse();

      authService.getCurrentUser.mockResolvedValue({
        id: 'user-1',
        email: 'saif@example.com',
        firstName: 'Saif',
        lastName: 'Khan',
        role: 'USER',
      });

      await meController(req, res);

      expect(authService.getCurrentUser).toHaveBeenCalledWith('user-1');
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Current user fetched successfully',
        data: {
          id: 'user-1',
          email: 'saif@example.com',
          firstName: 'Saif',
          lastName: 'Khan',
          role: 'USER',
        },
      });
    });

    it('should throw unauthorized when req.user is missing', async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      await expect(meController(req, res)).rejects.toMatchObject({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    });
  });
});