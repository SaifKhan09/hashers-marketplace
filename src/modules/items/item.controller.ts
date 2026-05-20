import { ItemStatus, Role } from '@prisma/client';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ApiError } from '../../utils/api-error';
import {
  createItem,
  deleteItem,
  getItemById,
  getItems,
  updateItem,
} from './item.service';

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

export const createItemController = async (
  req: Request<{}, unknown, CreateItemBody>,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }

  const { name, description, price, imageUrl } = req.body;

  if (!name || !description || price === undefined) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'name, description and price are required');
  }

  const parsedPrice = Number(price);

  if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'price must be a valid non-negative number');
  }

  const item = await createItem(req.user.userId, {
    name,
    description,
    price: parsedPrice,
    imageUrl,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Item created successfully',
    data: item,
  });
};

export const getItemsController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }

  const { page, limit, search, status, minPrice, maxPrice, sortBy, sortOrder } = req.query;

  const result = await getItems(req.user.role as Role, {
    page: typeof page === 'string' ? Number(page) : undefined,
    limit: typeof limit === 'string' ? Number(limit) : undefined,
    search: typeof search === 'string' ? search : undefined,
    status: typeof status === 'string' ? (status.toUpperCase() as ItemStatus) : undefined,
    minPrice: typeof minPrice === 'string' ? Number(minPrice) : undefined,
    maxPrice: typeof maxPrice === 'string' ? Number(maxPrice) : undefined,
    sortBy: typeof sortBy === 'string' ? (sortBy as 'createdAt' | 'price') : undefined,
    sortOrder: typeof sortOrder === 'string' ? (sortOrder as 'asc' | 'desc') : undefined,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Items fetched successfully',
    ...result,
  });
};

export const getItemByIdController = async (
  req: Request<ItemParams>,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }

  const item = await getItemById(req.params.itemId, req.user.role as Role, req.user.userId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Item fetched successfully',
    data: item,
  });
};

export const updateItemController = async (
  req: Request<ItemParams, unknown, UpdateItemBody>,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }

  const { name, description, price, imageUrl, status } = req.body;

  const updatePayload: {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    status?: ItemStatus;
  } = {};

  if (name !== undefined) {
    updatePayload.name = name;
  }

  if (description !== undefined) {
    updatePayload.description = description;
  }

  if (imageUrl !== undefined) {
    updatePayload.imageUrl = imageUrl;
  }

  if (price !== undefined) {
    const parsedPrice = Number(price);

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'price must be a valid non-negative number');
    }

    updatePayload.price = parsedPrice;
  }

  if (status !== undefined) {
    updatePayload.status = status.toUpperCase() as ItemStatus;
  }

  const item = await updateItem(
    req.params.itemId,
    req.user.userId,
    req.user.role as Role,
    updatePayload,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Item updated successfully',
    data: item,
  });
};

export const deleteItemController = async (
  req: Request<ItemParams>,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }

  const result = await deleteItem(req.params.itemId, req.user.userId, req.user.role as Role);

  res.status(StatusCodes.OK).json({
    success: true,
    message: result.message,
  });
};