import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { asyncHandler } from '../../utils/async-handler';

const router = Router();

/**
 * @openapi
 * /admin/ping:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Test admin-only access
 *     description: Returns a success response only for ADMIN users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin access granted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Admin access granted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/ping',
  authMiddleware,
  requireRole('ADMIN'),
  asyncHandler(async (_req, res) => {
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Admin access granted',
    });
  }),
);

export default router;