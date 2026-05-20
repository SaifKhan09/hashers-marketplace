import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../utils/async-handler';
import {
  completeTransactionController,
  getAllTransactionsController,
  getMyPurchasesController,
  getMySalesController,
} from './transaction.controller';

type CompleteTransactionBody = {
  bookingId: string;
  status: string;
  paymentMethod?: string;
  notes?: string;
};

const router = Router();

/**
 * @openapi
 * /transactions:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Complete or fail a transaction for an accepted booking
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Transaction processed successfully
 */
router.post(
  '/',
  authMiddleware,
  asyncHandler<{}, unknown, CompleteTransactionBody>(completeTransactionController),
);

/**
 * @openapi
 * /transactions/purchases:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Get purchase history for logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purchases fetched successfully
 */
router.get('/purchases', authMiddleware, asyncHandler(getMyPurchasesController));

/**
 * @openapi
 * /transactions/sales:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Get sales history for logged-in seller
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales fetched successfully
 */
router.get('/sales', authMiddleware, asyncHandler(getMySalesController));

/**
 * @openapi
 * /transactions/admin:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Get all transactions (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 */
router.get('/admin', authMiddleware, asyncHandler(getAllTransactionsController));

export default router;