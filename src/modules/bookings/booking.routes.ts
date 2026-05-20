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
 *     responses:
 *       201:
 *         description: Booking created successfully
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
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 */
router.patch(
  '/:bookingId/status',
  authMiddleware,
  asyncHandler<BookingParams, unknown, UpdateBookingStatusBody>(
    updateBookingStatusController,
  ),
);

export default router;