import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../utils/async-handler';
import {
  createBookingController,
  getMyBookingsController,
  getSellerBookingsController,
  updateBookingStatusController,
} from './booking.controller';

type BookingParams = {
  bookingId: string;
};

type CreateBookingBody = {
  itemId: string;
  message?: string;
};

type UpdateBookingStatusBody = {
  status: string;
};

const router = Router();

/**
 * @openapi
 * /bookings:
 *   post:
 *     tags:
 *       - Bookings
 *     summary: Create a booking for an item
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: ID of the item to book
 *                 example: clx123abc456
 *               message:
 *                 type: string
 *                 description: Optional note from the buyer
 *                 example: Need this item for two days
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Item not found
 */
router.post(
  '/',
  authMiddleware,
  asyncHandler<{}, unknown, CreateBookingBody>(createBookingController),
);

/**
 * @openapi
 * /bookings/me:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get bookings created by the logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings fetched successfully
 */
router.get('/me', authMiddleware, asyncHandler(getMyBookingsController));

/**
 * @openapi
 * /bookings/seller:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get bookings for items owned by the logged-in seller
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Seller bookings fetched successfully
 */
router.get('/seller', authMiddleware, asyncHandler(getSellerBookingsController));

/**
 * @openapi
 * /bookings/{bookingId}/status:
 *   patch:
 *     tags:
 *       - Bookings
 *     summary: Update booking status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         description: ID of the booking to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status for the booking
 *                 enum:
 *                   - PENDING
 *                   - APPROVED
 *                   - REJECTED
 *                   - CANCELLED
 *                 example: APPROVED
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 */
router.patch(
  '/:bookingId/status',
  authMiddleware,
  asyncHandler<BookingParams, unknown, UpdateBookingStatusBody>(
    updateBookingStatusController,
  ),
);

export default router;
