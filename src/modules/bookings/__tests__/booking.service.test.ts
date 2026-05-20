import { BookingStatus, ItemStatus, Role } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { prismaMock } from '../../../../tests/setup/prisma-mock';
import {
  createBooking,
  getMyBookings,
  getSellerBookings,
  updateBookingStatus,
} from '../booking.service';

describe('booking.service', () => {
  describe('createBooking', () => {
    it('should create booking and reserve item', async () => {
      (prismaMock.$transaction as any).mockImplementation(async (callback: any) =>
        callback({
          item: {
            findUnique: jest.fn().mockResolvedValue({
              id: 'item-1',
              sellerId: 'seller-1',
              status: ItemStatus.AVAILABLE,
            }),
            update: jest.fn().mockResolvedValue({
              id: 'item-1',
              status: ItemStatus.RESERVED,
            }),
          },
          booking: {
            findFirst: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({
              id: 'booking-1',
              itemId: 'item-1',
              buyerId: 'buyer-1',
              message: 'Interested',
              status: BookingStatus.PENDING,
              buyer: {
                id: 'buyer-1',
                firstName: 'Buyer',
                lastName: 'One',
                email: 'buyer@example.com',
              },
              item: {
                id: 'item-1',
                name: 'Chair',
                seller: {
                  id: 'seller-1',
                  firstName: 'Seller',
                  lastName: 'One',
                  email: 'seller@example.com',
                },
              },
            }),
          },
        }),
      );

      const result = await createBooking('buyer-1', {
        itemId: 'item-1',
        message: 'Interested',
      });

      expect(result.id).toBe('booking-1');
      expect(result.status).toBe(BookingStatus.PENDING);
    });

    it('should reject booking if item does not exist', async () => {
      (prismaMock.$transaction as any).mockImplementation(async (callback: any) =>
        callback({
          item: {
            findUnique: jest.fn().mockResolvedValue(null),
            update: jest.fn(),
          },
          booking: {
            findFirst: jest.fn(),
            create: jest.fn(),
          },
        }),
      );

      await expect(
        createBooking('buyer-1', { itemId: 'missing-item' }),
      ).rejects.toMatchObject({
        statusCode: StatusCodes.NOT_FOUND,
      });
    });

    it('should reject booking own item', async () => {
      (prismaMock.$transaction as any).mockImplementation(async (callback: any) =>
        callback({
          item: {
            findUnique: jest.fn().mockResolvedValue({
              id: 'item-1',
              sellerId: 'buyer-1',
              status: ItemStatus.AVAILABLE,
            }),
            update: jest.fn(),
          },
          booking: {
            findFirst: jest.fn(),
            create: jest.fn(),
          },
        }),
      );

      await expect(
        createBooking('buyer-1', { itemId: 'item-1' }),
      ).rejects.toMatchObject({
        statusCode: StatusCodes.BAD_REQUEST,
      });
    });

    it('should reject booking if item is not available', async () => {
      (prismaMock.$transaction as any).mockImplementation(async (callback: any) =>
        callback({
          item: {
            findUnique: jest.fn().mockResolvedValue({
              id: 'item-1',
              sellerId: 'seller-1',
              status: ItemStatus.RESERVED,
            }),
            update: jest.fn(),
          },
          booking: {
            findFirst: jest.fn(),
            create: jest.fn(),
          },
        }),
      );

      await expect(
        createBooking('buyer-1', { itemId: 'item-1' }),
      ).rejects.toMatchObject({
        statusCode: StatusCodes.BAD_REQUEST,
      });
    });

    it('should reject booking if a pending booking already exists', async () => {
      (prismaMock.$transaction as any).mockImplementation(async (callback: any) =>
        callback({
          item: {
            findUnique: jest.fn().mockResolvedValue({
              id: 'item-1',
              sellerId: 'seller-1',
              status: ItemStatus.AVAILABLE,
            }),
            update: jest.fn(),
          },
          booking: {
            findFirst: jest.fn().mockResolvedValue({
              id: 'booking-existing',
              status: BookingStatus.PENDING,
            }),
            create: jest.fn(),
          },
        }),
      );

      await expect(
        createBooking('buyer-1', { itemId: 'item-1' }),
      ).rejects.toMatchObject({
        statusCode: StatusCodes.BAD_REQUEST,
      });
    });
  });

  describe('getMyBookings', () => {
    it('should return buyer bookings for user role', async () => {
      prismaMock.booking.findMany.mockResolvedValue([] as any);

      await getMyBookings('buyer-1', Role.USER);

      expect(prismaMock.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            buyerId: 'buyer-1',
          }),
        }),
      );
    });

    it('should allow admin to fetch all bookings', async () => {
      prismaMock.booking.findMany.mockResolvedValue([] as any);

      await getMyBookings('admin-1', Role.ADMIN);

      expect(prismaMock.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        }),
      );
    });
  });

  describe('getSellerBookings', () => {
    it('should return seller bookings for user role', async () => {
      prismaMock.booking.findMany.mockResolvedValue([] as any);

      await getSellerBookings('seller-1', Role.USER);

      expect(prismaMock.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            item: {
              sellerId: 'seller-1',
            },
          }),
        }),
      );
    });

    it('should allow admin to fetch all seller bookings', async () => {
      prismaMock.booking.findMany.mockResolvedValue([] as any);

      await getSellerBookings('admin-1', Role.ADMIN);

      expect(prismaMock.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        }),
      );
    });
  });

  describe('updateBookingStatus', () => {
    it('should allow seller to accept booking', async () => {
      (prismaMock.$transaction as any).mockImplementation(async (callback: any) =>
        callback({
          booking: {
            findUnique: jest.fn().mockResolvedValue({
              id: 'booking-1',
              buyerId: 'buyer-1',
              status: BookingStatus.PENDING,
              itemId: 'item-1',
              item: {
                sellerId: 'seller-1',
              },
            }),
            update: jest.fn().mockResolvedValue({
              id: 'booking-1',
              status: BookingStatus.ACCEPTED,
              buyer: {
                id: 'buyer-1',
                firstName: 'Buyer',
                lastName: 'One',
                email: 'buyer@example.com',
              },
              item: {
                id: 'item-1',
                seller: {
                  id: 'seller-1',
                  firstName: 'Seller',
                  lastName: 'One',
                  email: 'seller@example.com',
                },
              },
            }),
          },
          item: {
            update: jest.fn().mockResolvedValue({
              id: 'item-1',
              status: ItemStatus.RESERVED,
            }),
          },
        }),
      );

      const result = await updateBookingStatus(
        'booking-1',
        'seller-1',
        Role.USER,
        BookingStatus.ACCEPTED,
      );

      expect(result.status).toBe(BookingStatus.ACCEPTED);
    });

    it('should allow buyer to cancel booking and release item', async () => {
      (prismaMock.$transaction as any).mockImplementation(async (callback: any) =>
        callback({
          booking: {
            findUnique: jest.fn().mockResolvedValue({
              id: 'booking-1',
              buyerId: 'buyer-1',
              status: BookingStatus.PENDING,
              itemId: 'item-1',
              item: {
                sellerId: 'seller-1',
              },
            }),
            update: jest.fn().mockResolvedValue({
              id: 'booking-1',
              status: BookingStatus.CANCELLED,
              buyer: {
                id: 'buyer-1',
                firstName: 'Buyer',
                lastName: 'One',
                email: 'buyer@example.com',
              },
              item: {
                id: 'item-1',
                seller: {
                  id: 'seller-1',
                  firstName: 'Seller',
                  lastName: 'One',
                  email: 'seller@example.com',
                },
              },
            }),
          },
          item: {
            update: jest.fn().mockResolvedValue({
              id: 'item-1',
              status: ItemStatus.AVAILABLE,
            }),
          },
        }),
      );

      const result = await updateBookingStatus(
        'booking-1',
        'buyer-1',
        Role.USER,
        BookingStatus.CANCELLED,
      );

      expect(result.status).toBe(BookingStatus.CANCELLED);
    });

    it('should forbid buyer from accepting booking', async () => {
      (prismaMock.$transaction as any).mockImplementation(async (callback: any) =>
        callback({
          booking: {
            findUnique: jest.fn().mockResolvedValue({
              id: 'booking-1',
              buyerId: 'buyer-1',
              status: BookingStatus.PENDING,
              itemId: 'item-1',
              item: {
                sellerId: 'seller-1',
              },
            }),
            update: jest.fn(),
          },
          item: {
            update: jest.fn(),
          },
        }),
      );

      await expect(
        updateBookingStatus('booking-1', 'buyer-1', Role.USER, BookingStatus.ACCEPTED),
      ).rejects.toMatchObject({
        statusCode: StatusCodes.FORBIDDEN,
      });
    });

    it('should reject update for missing booking', async () => {
      (prismaMock.$transaction as any).mockImplementation(async (callback: any) =>
        callback({
          booking: {
            findUnique: jest.fn().mockResolvedValue(null),
            update: jest.fn(),
          },
          item: {
            update: jest.fn(),
          },
        }),
      );

      await expect(
        updateBookingStatus('missing-booking', 'seller-1', Role.USER, BookingStatus.ACCEPTED),
      ).rejects.toMatchObject({
        statusCode: StatusCodes.NOT_FOUND,
      });
    });

    it('should reject update for already cancelled booking', async () => {
      (prismaMock.$transaction as any).mockImplementation(async (callback: any) =>
        callback({
          booking: {
            findUnique: jest.fn().mockResolvedValue({
              id: 'booking-1',
              buyerId: 'buyer-1',
              status: BookingStatus.CANCELLED,
              itemId: 'item-1',
              item: {
                sellerId: 'seller-1',
              },
            }),
            update: jest.fn(),
          },
          item: {
            update: jest.fn(),
          },
        }),
      );

      await expect(
        updateBookingStatus('booking-1', 'seller-1', Role.USER, BookingStatus.ACCEPTED),
      ).rejects.toMatchObject({
        statusCode: StatusCodes.BAD_REQUEST,
      });
    });
  });
});