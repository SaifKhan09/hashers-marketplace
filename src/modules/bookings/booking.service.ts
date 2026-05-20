import { BookingStatus, ItemStatus, Role } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/api-error';
import { CreateBookingInput } from './booking.types';

export const createBooking = async (buyerId: string, payload: CreateBookingInput) => {
  return prisma.$transaction(async (tx) => {
    const item = await tx.item.findUnique({
      where: { id: payload.itemId },
    });

    if (!item) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Item not found');
    }

    if (item.sellerId === buyerId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'You cannot book your own item');
    }

    if (item.status !== ItemStatus.AVAILABLE) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Only available items can be booked');
    }

    const existingPendingBooking = await tx.booking.findFirst({
      where: {
        itemId: payload.itemId,
        status: BookingStatus.PENDING,
      },
    });

    if (existingPendingBooking) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'This item already has a pending booking');
    }

    const booking = await tx.booking.create({
      data: {
        itemId: payload.itemId,
        buyerId,
        message: payload.message,
      },
      include: {
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        item: {
          include: {
            seller: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    await tx.item.update({
      where: { id: payload.itemId },
      data: {
        status: ItemStatus.RESERVED,
      },
    });

    return booking;
  });
};

export const getMyBookings = async (userId: string, currentUserRole: Role, status?: BookingStatus) => {
  const where =
    currentUserRole === 'ADMIN'
      ? {
          ...(status ? { status } : {}),
        }
      : {
          buyerId: userId,
          ...(status ? { status } : {}),
        };

  return prisma.booking.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    include: {
      buyer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      item: {
        include: {
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

export const getSellerBookings = async (sellerId: string, currentUserRole: Role, status?: BookingStatus) => {
  const where =
    currentUserRole === 'ADMIN'
      ? {
          ...(status ? { status } : {}),
        }
      : {
          item: {
            sellerId,
          },
          ...(status ? { status } : {}),
        };

  return prisma.booking.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    include: {
      buyer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      item: {
        include: {
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

export const updateBookingStatus = async (
  bookingId: string,
  currentUserId: string,
  currentUserRole: Role,
  status: BookingStatus,
) => {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: {
        item: true,
      },
    });

    if (!booking) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Booking not found');
    }

    const isAdmin = currentUserRole === 'ADMIN';
    const isSeller = booking.item.sellerId === currentUserId;
    const isBuyer = booking.buyerId === currentUserId;

    if (!isAdmin) {
      if (status === BookingStatus.ACCEPTED || status === BookingStatus.REJECTED) {
        if (!isSeller) {
          throw new ApiError(StatusCodes.FORBIDDEN, 'Only the seller can accept or reject this booking');
        }
      }

      if (status === BookingStatus.CANCELLED) {
        if (!isBuyer) {
          throw new ApiError(StatusCodes.FORBIDDEN, 'Only the buyer can cancel this booking');
        }
      }
    }

    if (
      booking.status === BookingStatus.REJECTED ||
      booking.status === BookingStatus.CANCELLED
    ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'This booking can no longer be updated');
    }

    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status,
      },
      include: {
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        item: {
          include: {
            seller: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (status === BookingStatus.REJECTED || status === BookingStatus.CANCELLED) {
      await tx.item.update({
        where: { id: booking.itemId },
        data: {
          status: ItemStatus.AVAILABLE,
        },
      });
    }

    if (status === BookingStatus.ACCEPTED) {
      await tx.item.update({
        where: { id: booking.itemId },
        data: {
          status: ItemStatus.RESERVED,
        },
      });
    }

    return updatedBooking;
  });
};