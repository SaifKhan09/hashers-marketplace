import { ItemStatus, Prisma, Role } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/api-error';
import { CreateItemInput, ItemQueryParams, UpdateItemInput } from './item.types';

export const createItem = async (sellerId: string, payload: CreateItemInput) => {
  const item = await prisma.item.create({
    data: {
      sellerId,
      name: payload.name,
      description: payload.description,
      price: new Prisma.Decimal(payload.price),
      imageUrl: payload.imageUrl,
    },
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
  });

  return item;
};

export const getItems = async (
  currentUserRole: Role,
  queryParams: ItemQueryParams,
) => {
  const page = queryParams.page && queryParams.page > 0 ? queryParams.page : 1;
  const limit =
    queryParams.limit && queryParams.limit > 0 && queryParams.limit <= 50
      ? queryParams.limit
      : 10;
  const skip = (page - 1) * limit;

  const sortBy = queryParams.sortBy === 'price' ? 'price' : 'createdAt';
  const sortOrder = queryParams.sortOrder === 'asc' ? 'asc' : 'desc';

  const where: Prisma.ItemWhereInput = {};

  if (queryParams.search) {
    where.OR = [
      {
        name: {
          contains: queryParams.search,
        },
      },
      {
        description: {
          contains: queryParams.search,
        },
      },
    ];
  }

  if (queryParams.minPrice !== undefined || queryParams.maxPrice !== undefined) {
    where.price = {
      ...(queryParams.minPrice !== undefined
        ? { gte: new Prisma.Decimal(queryParams.minPrice) }
        : {}),
      ...(queryParams.maxPrice !== undefined
        ? { lte: new Prisma.Decimal(queryParams.maxPrice) }
        : {}),
    };
  }

  if (currentUserRole === 'ADMIN') {
    if (queryParams.status) {
      where.status = queryParams.status;
    }
  } else {
    if (queryParams.status && queryParams.status !== ItemStatus.AVAILABLE) {
      return {
        data: [],
        meta: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    }

    where.status = ItemStatus.AVAILABLE;
  }

  const orderBy: Prisma.ItemOrderByWithRelationInput[] =
    sortBy === 'price'
      ? [{ price: sortOrder }, { id: 'desc' }]
      : [{ createdAt: sortOrder }, { id: 'desc' }];

  const [items, total] = await prisma.$transaction([
    prisma.item.findMany({
      where,
      skip,
      take: limit,
      orderBy,
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
    }),
    prisma.item.count({ where }),
  ]);

  return {
    data: items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getItemById = async (itemId: string, currentUserRole: Role) => {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
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
  });

  if (!item) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Item not found');
  }

  if (currentUserRole !== 'ADMIN' && item.status !== ItemStatus.AVAILABLE) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Item not found');
  }

  return item;
};

export const updateItem = async (
  itemId: string,
  currentUserId: string,
  currentUserRole: Role,
  payload: UpdateItemInput,
) => {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Item not found');
  }

  const isOwner = item.sellerId === currentUserId;
  const isAdmin = currentUserRole === 'ADMIN';

  if (!isOwner && !isAdmin) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not allowed to update this item');
  }

  const updatedItem = await prisma.item.update({
    where: { id: itemId },
    data: {
      ...(payload.name !== undefined ? { name: payload.name } : {}),
      ...(payload.description !== undefined ? { description: payload.description } : {}),
      ...(payload.price !== undefined ? { price: new Prisma.Decimal(payload.price) } : {}),
      ...(payload.imageUrl !== undefined ? { imageUrl: payload.imageUrl } : {}),
      ...(payload.status !== undefined ? { status: payload.status } : {}),
    },
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
  });

  return updatedItem;
};

export const deleteItem = async (
  itemId: string,
  currentUserId: string,
  currentUserRole: Role,
) => {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Item not found');
  }

  const isOwner = item.sellerId === currentUserId;
  const isAdmin = currentUserRole === 'ADMIN';

  if (!isOwner && !isAdmin) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not allowed to delete this item');
  }

  await prisma.item.delete({
    where: { id: itemId },
  });

  return {
    message: 'Item deleted successfully',
  };
};