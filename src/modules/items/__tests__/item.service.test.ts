import { ItemStatus, Role } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { prismaMock } from '../../../../tests/setup/prisma-mock';
import {
  createItem,
  deleteItem,
  getItemById,
  getItems,
  updateItem,
} from '../item.service';

describe('item.service', () => {
  describe('createItem', () => {
    it('should create an item', async () => {
      prismaMock.item.create.mockResolvedValue({
        id: 'item-1',
        sellerId: 'user-1',
        name: 'Chair',
        description: 'Good chair',
        price: { toString: () => '2500' },
        imageUrl: null,
        status: ItemStatus.AVAILABLE,
        createdAt: new Date(),
        updatedAt: new Date(),
        seller: {
          id: 'user-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
      } as any);

      const result = await createItem('user-1', {
        name: 'Chair',
        description: 'Good chair',
        price: 2500,
      });

      expect(result.name).toBe('Chair');
      expect(prismaMock.item.create).toHaveBeenCalled();
    });
  });

  describe('getItems', () => {
    it('should return only available items for non-admin without status filter', async () => {
      prismaMock.$transaction.mockResolvedValue([
        [
          {
            id: 'item-1',
            sellerId: 'user-1',
            name: 'Chair',
            description: 'Chair',
            price: { toString: () => '1000' },
            imageUrl: null,
            status: ItemStatus.AVAILABLE,
            createdAt: new Date(),
            updatedAt: new Date(),
            seller: {
              id: 'user-1',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
            },
          },
        ],
        1,
      ] as any);

      const result = await getItems(Role.USER, {});

      expect(result.meta.total).toBe(1);
      expect(prismaMock.item.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: ItemStatus.AVAILABLE,
          }),
        }),
      );
    });

    it('should return empty result for non-admin requesting non-available status', async () => {
      const result = await getItems(Role.USER, {
        status: ItemStatus.RESERVED,
      });

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });

    it('should allow admin to filter by reserved status', async () => {
      prismaMock.$transaction.mockResolvedValue([[], 0] as any);

      await getItems(Role.ADMIN, {
        status: ItemStatus.RESERVED,
      });

      expect(prismaMock.item.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: ItemStatus.RESERVED,
          }),
        }),
      );
    });
  });

  describe('getItemById', () => {
    it('should return item for admin', async () => {
      prismaMock.item.findUnique.mockResolvedValue({
        id: 'item-1',
        sellerId: 'user-1',
        name: 'Chair',
        description: 'Chair',
        price: { toString: () => '2000' },
        imageUrl: null,
        status: ItemStatus.RESERVED,
        createdAt: new Date(),
        updatedAt: new Date(),
        seller: {
          id: 'user-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
      } as any);

      const result = await getItemById('item-1', Role.ADMIN, 'admin-1');

      expect(result.id).toBe('item-1');
    });

    it('should throw not found for unavailable item if user is not admin and not owner', async () => {
      prismaMock.item.findUnique.mockResolvedValue({
        id: 'item-1',
        sellerId: 'seller-1',
        name: 'Chair',
        description: 'Chair',
        price: { toString: () => '2000' },
        imageUrl: null,
        status: ItemStatus.RESERVED,
        createdAt: new Date(),
        updatedAt: new Date(),
        seller: {
          id: 'seller-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
      } as any);

      await expect(getItemById('item-1', Role.USER, 'buyer-1')).rejects.toMatchObject({
        statusCode: StatusCodes.NOT_FOUND,
      });
    });
  });

  describe('updateItem', () => {
    it('should allow owner to update item', async () => {
      prismaMock.item.findUnique.mockResolvedValue({
        id: 'item-1',
        sellerId: 'user-1',
        name: 'Chair',
        description: 'Chair',
        price: { toString: () => '2000' },
        imageUrl: null,
        status: ItemStatus.AVAILABLE,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      prismaMock.item.update.mockResolvedValue({
        id: 'item-1',
        sellerId: 'user-1',
        name: 'Updated Chair',
        description: 'Chair',
        price: { toString: () => '2500' },
        imageUrl: null,
        status: ItemStatus.AVAILABLE,
        createdAt: new Date(),
        updatedAt: new Date(),
        seller: {
          id: 'user-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
      } as any);

      const result = await updateItem('item-1', 'user-1', Role.USER, {
        name: 'Updated Chair',
        price: 2500,
      });

      expect(result.name).toBe('Updated Chair');
    });

    it('should forbid non-owner non-admin', async () => {
      prismaMock.item.findUnique.mockResolvedValue({
        id: 'item-1',
        sellerId: 'seller-1',
        name: 'Chair',
        description: 'Chair',
        price: { toString: () => '2000' },
        imageUrl: null,
        status: ItemStatus.AVAILABLE,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      await expect(
        updateItem('item-1', 'user-2', Role.USER, { name: 'Hack' }),
      ).rejects.toMatchObject({
        statusCode: StatusCodes.FORBIDDEN,
      });
    });
  });

  describe('deleteItem', () => {
    it('should allow admin to delete item', async () => {
      prismaMock.item.findUnique.mockResolvedValue({
        id: 'item-1',
        sellerId: 'seller-1',
      } as any);

      prismaMock.item.delete.mockResolvedValue({} as any);

      const result = await deleteItem('item-1', 'admin-1', Role.ADMIN);

      expect(result.message).toBe('Item deleted successfully');
    });
  });
});