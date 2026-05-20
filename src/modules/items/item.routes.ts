import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../utils/async-handler';
import {
  createItemController,
  deleteItemController,
  getItemByIdController,
  getItemsController,
  updateItemController,
} from './item.controller';

type ItemParams = {
  itemId: string;
};

type CreateItemBody = {
  name: string;
  description: string;
  price: number | string;
  imageUrl?: string;
};

type UpdateItemBody = {
  name?: string;
  description?: string;
  price?: number | string;
  imageUrl?: string;
  status?: string;
};

const router = Router();

/**
 * @openapi
 * /items:
 *   post:
 *     tags:
 *       - Items
 *     summary: Create a new marketplace item
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Item created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authMiddleware,
  asyncHandler<{}, unknown, CreateItemBody>(createItemController),
);

/**
 * @openapi
 * /items:
 *   get:
 *     tags:
 *       - Items
 *     summary: Get marketplace items with pagination, filters, search, and sorting
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, RESERVED, SOLD, REMOVED]
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, price]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Items fetched successfully
 */
router.get('/', authMiddleware, asyncHandler(getItemsController));

/**
 * @openapi
 * /items/{itemId}:
 *   get:
 *     tags:
 *       - Items
 *     summary: Get item details by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item fetched successfully
 *       404:
 *         description: Item not found
 */
router.get(
  '/:itemId',
  authMiddleware,
  asyncHandler<ItemParams>(getItemByIdController),
);

/**
 * @openapi
 * /items/{itemId}:
 *   patch:
 *     tags:
 *       - Items
 *     summary: Update an item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       403:
 *         description: Forbidden
 */
router.patch(
  '/:itemId',
  authMiddleware,
  asyncHandler<ItemParams, unknown, UpdateItemBody>(updateItemController),
);

/**
 * @openapi
 * /items/{itemId}:
 *   delete:
 *     tags:
 *       - Items
 *     summary: Delete an item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       403:
 *         description: Forbidden
 */
router.delete(
  '/:itemId',
  authMiddleware,
  asyncHandler<ItemParams>(deleteItemController),
);

export default router;