import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../utils/async-handler';
import {
  meController,
  signinController,
  signoutController,
  signupController,
} from './auth.controller';

const router = Router();

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Sai
 *               lastName:
 *                 type: string
 *                 example: Kiran
 *               email:
 *                 type: string
 *                 example: sai@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: User already exists
 */
router.post('/signup', asyncHandler(signupController));

/**
 * @openapi
 * /auth/signin:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Sign in an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: sai@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       401:
 *         description: Invalid email or password
 */
router.post('/signin', asyncHandler(signinController));

/**
 * @openapi
 * /auth/signout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Sign out the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Signed out successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/signout', authMiddleware, asyncHandler(signoutController));

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, asyncHandler(meController));

export default router;