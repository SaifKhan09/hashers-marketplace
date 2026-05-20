import { BookingStatus, ItemStatus, Prisma, Role, TransactionStatus } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/api-error';
import { CompleteTransactionInput } from './transaction.types';

export const completeTransaction = async (
  currentUserId: string,
  currentUserRole: Role,
  payload: CompleteTransactionInput,
) => {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: payload.bookingId },
      include: {
        item: true,
        buyer: true,
      },
    });

    if (!booking) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Booking not found');
    }

    const isAdmin = currentUserRole === 'ADMIN';
    const isSeller = booking.item.sellerId === currentUserId;

    if (!isAdmin && !isSeller) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'Only the seller or admin can complete this transaction',
      );
    }

    if (booking.status !== BookingStatus.ACCEPTED) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Only accepted bookings can be completed as transactions',
      );
    }

    const existingTransaction = await tx.transaction.findUnique({
      where: { bookingId: payload.bookingId },
    });

    if (existingTransaction) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Transaction already exists for this booking');
    }

    const transaction = await tx.transaction.create({
      data: {
        bookingId: booking.id,
        itemId: booking.itemId,
        buyerId: booking.buyerId,
        sellerId: booking.item.sellerId,
        amount: new Prisma.Decimal(booking.item.price),
        status: payload.status,
        paymentMethod: payload.paymentMethod,
        notes: payload.notes,
      },
      include: {
        booking: true,
        item: true,
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (payload.status === TransactionStatus.COMPLETED) {
      await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.COMPLETED,
        },
      });

      await tx.item.update({
        where: { id: booking.itemId },
        data: {
          status: ItemStatus.SOLD,
        },
      });
    }

    if (payload.status === TransactionStatus.FAILED) {
      await tx.item.update({
        where: { id: booking.itemId },
        data: {
          status: ItemStatus.AVAILABLE,
        },
      });
    }

    return transaction;
  });
};

export const getMyPurchases = async (
  currentUserId: string,
  currentUserRole: Role,
  status?: TransactionStatus,
) => {
  const where =
    currentUserRole === 'ADMIN'
      ? {
          ...(status ? { status } : {}),
        }
      : {
          buyerId: currentUserId,
          ...(status ? { status } : {}),
        };

  return prisma.transaction.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    include: {
      booking: true,
      item: true,
      buyer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      seller: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
};

export const getMySales = async (
  currentUserId: string,
  currentUserRole: Role,
  status?: TransactionStatus,
) => {
  const where =
    currentUserRole === 'ADMIN'
      ? {
          ...(status ? { status } : {}),
        }
      : {
          sellerId: currentUserId,
          ...(status ? { status } : {}),
        };

  return prisma.transaction.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    include: {
      booking: true,
      item: true,
      buyer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      seller: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
};

export const getAllTransactions = async (
  currentUserRole: Role,
  status?: TransactionStatus,
) => {
  if (currentUserRole !== 'ADMIN') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only admin can view all transactions');
  }

  return prisma.transaction.findMany({
    where: {
      ...(status ? { status } : {}),
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    include: {
      booking: true,
      item: true,
      buyer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      seller: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
};