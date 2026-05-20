import { ItemStatus } from '@prisma/client';

export interface CreateItemInput {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export interface UpdateItemInput {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  status?: ItemStatus;
}

export interface ItemQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ItemStatus;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'createdAt' | 'price';
  sortOrder?: 'asc' | 'desc';
}