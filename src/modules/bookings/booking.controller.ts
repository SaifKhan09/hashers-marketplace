import { BookingStatus, Role } from '@prisma/client';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ApiError } from '../../utils/api-error';
import {
  createBooking,
  getMyBookings,
  getSellerBookings,
  updateBookingStatus,
} from './booking.service';

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

export const createBookingController = async (
  req: Request<{}, unknown, CreateBookingBody>,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }

  const { itemId, message } = req.body;

  if (!itemId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'itemId is required');
  }

  const booking = await createBooking(req.user.userId, {
    itemId,
    message,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Booking created successfully',
    data: booking,
  });
};

export const getMyBookingsController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }

  const status =
    typeof req.query.status === 'string'
      ? (req.query.status.toUpperCase() as BookingStatus)
      : undefined;

  const bookings = await getMyBookings(req.user.userId, req.user.role as Role, status);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Bookings fetched successfully',
    data: bookings,
  });
};

export const getSellerBookingsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }

  const status =
    typeof req.query.status === 'string'
      ? (req.query.status.toUpperCase() as BookingStatus)
      : undefined;

  const bookings = await getSellerBookings(req.user.userId, req.user.role as Role, status);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Seller bookings fetched successfully',
    data: bookings,
  });
};

export const updateBookingStatusController = async (
  req: Request<BookingParams, unknown, UpdateBookingStatusBody>,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }

  const { status } = req.body;

  if (!status) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'status is required');
  }

  const normalizedStatus = status.toUpperCase() as BookingStatus;

  if (!['ACCEPTED', 'REJECTED', 'CANCELLED'].includes(normalizedStatus)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'status must be one of ACCEPTED, REJECTED, CANCELLED',
    );
  }

  const booking = await updateBookingStatus(
    req.params.bookingId,
    req.user.userId,
    req.user.role as Role,
    normalizedStatus,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Booking status updated successfully',
    data: booking,
  });
};