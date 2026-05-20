import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import adminRoutes from '../modules/admin/admin.routes';
import authRoutes from '../modules/auth/auth.routes';
import itemRoutes from '../modules/items/item.routes';
import { asyncHandler } from '../utils/async-handler';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - System
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: API is running
 */
router.get(
  '/health',
  asyncHandler(async (_req, res) => {
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Hashers Marketplace API is running',
    });
  }),
);

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/items', itemRoutes);

export default router;