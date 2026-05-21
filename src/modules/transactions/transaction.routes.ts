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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - status
 *               - paymentMethod
 *               - notes
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: ID of the accepted booking for which the transaction is being processed
 *                 example: clx123abc456
 *               status:
 *                 type: string
 *                 description: Final transaction status
 *                 enum:
 *                   - COMPLETED
 *                   - FAILED
 *                 example: COMPLETED
 *               paymentMethod:
 *                 type: string
 *                 description: Payment method used for the transaction
 *                 example: UPI
 *               notes:
 *                 type: string
 *                 description: Additional notes related to the transaction
 *                 example: Payment received successfully from buyer
 *           example:
 *             bookingId: clx123abc456
 *             status: COMPLETED
 *             paymentMethod: UPI
 *             notes: Payment received successfully from buyer
 *     responses:
 *       201:
 *         description: Transaction processed successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
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
