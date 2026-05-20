import { BookingStatus, Prisma, Role, TransactionStatus } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { prismaMock } from '../../../../tests/setup/prisma-mock';
import {
  completeTransaction,
  getAllTransactions,
  getMyPurchases,
  getMySales,
} from '../transaction.service';

describe('transaction.service', () => {
  describe('completeTransaction', () => {
    it('should complete transaction and mark item as sold', async () => {
      (prismaMock.$transaction as any).mockImplementation(async (callback: any) =>
        callback({
          booking: {
            findUnique: jest.fn().mockResolvedValue({
              id: 'booking-1',
              itemId: 'item-1',
              buyerId: 'buyer-1',
              status: BookingStatus.ACCEPTED,
              item: {
                id: 'item-1',
                sellerId: 'seller-1',
                price: new Prisma.Decimal('5000'),
              },
              buyer: {
                id: 'buyer-1',
              },
            }),
            update: jest.fn().mockResolvedValue({}),
          },
          transaction: {
            findUnique: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({
              id: 'txn-1',
              status: TransactionStatus.COMPLETED,
              amount: new Prisma.Decimal('5000'),
              booking: { id: 'booking-1' },
              item: { id: 'item-1' },
              buyer: {
                id: 'buyer-1',
                firstName: 'Buyer',
                lastName: 'One',
                email: 'buyer@example.com',
              },
              seller: {
                id: 'seller-1',
                firstName: 'Seller',
                lastName: 'One',
                email: 'seller@example.com',
              },
            }),
          },
          item: {
            update: jest.fn().mockResolvedValue({}),
          },
        }),
      );

      const result = await completeTransaction('seller-1', Role.USER, {
        bookingId: 'booking-1',
        status: TransactionStatus.COMPLETED,
        paymentMethod: 'CASH',
      });

      expect(result.status).toBe(TransactionStatus.COMPLETED);
    });

    it('should reject duplicate transaction creation', async () => {
      (prismaMock.$transaction as any).mockImplementation(async (callback: any) =>
        callback({
          booking: {
            findUnique: jest.fn().mockResolvedValue({
              id: 'booking-1',
              itemId: 'item-1',
              buyerId: 'buyer-1',
              status: BookingStatus.ACCEPTED,
              item: {
                id: 'item-1',
                sellerId: 'seller-1',
                price: new Prisma.Decimal('5000'),
              },
              buyer: {
                id: 'buyer-1',
              },
            }),
          },
          transaction: {
            findUnique: jest.fn().mockResolvedValue({
              id: 'txn-1',
            }),
            create: jest.fn(),
          },
          item: {
            update: jest.fn(),
          },
        }),
      );

      await expect(
        completeTransaction('seller-1', Role.USER, {
          bookingId: 'booking-1',
          status: TransactionStatus.COMPLETED,
        }),
      ).rejects.toMatchObject({
        statusCode: StatusCodes.BAD_REQUEST,
      });
    });
  });

  describe('getMyPurchases', () => {
    it('should return purchases for buyer', async () => {
      prismaMock.transaction.findMany.mockResolvedValue([] as any);

      await getMyPurchases('buyer-1', Role.USER);

      expect(prismaMock.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            buyerId: 'buyer-1',
          }),
        }),
      );
    });
  });

  describe('getMySales', () => {
    it('should return sales for seller', async () => {
      prismaMock.transaction.findMany.mockResolvedValue([] as any);

      await getMySales('seller-1', Role.USER);

      expect(prismaMock.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            sellerId: 'seller-1',
          }),
        }),
      );
    });
  });

  describe('getAllTransactions', () => {
    it('should allow admin to get all transactions', async () => {
      prismaMock.transaction.findMany.mockResolvedValue([] as any);

      await getAllTransactions(Role.ADMIN);

      expect(prismaMock.transaction.findMany).toHaveBeenCalled();
    });

    it('should forbid non-admin from getting all transactions', async () => {
      await expect(getAllTransactions(Role.USER)).rejects.toMatchObject({
        statusCode: StatusCodes.FORBIDDEN,
      });
    });
  });
});