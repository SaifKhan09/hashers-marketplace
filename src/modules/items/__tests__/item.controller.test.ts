import { StatusCodes } from 'http-status-codes';

import * as itemService from '../item.service';
import {
  createItemController,
  deleteItemController,
  getItemByIdController,
  getItemsController,
  updateItemController,
} from '../item.controller';
import { createMockRequest, createMockResponse } from '../../../../tests/helpers/http-mocks';

jest.mock('../item.service');

describe('item.controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create item', async () => {
    const req = createMockRequest({
      user: { userId: 'seller-1', email: 'seller@example.com', role: 'USER' },
      body: { name: 'Chair', description: 'Good', price: 1000 },
    });
    const res = createMockResponse();

    (itemService.createItem as jest.Mock).mockResolvedValue({ id: 'item-1' });

    await createItemController(req, res);

    expect(itemService.createItem).toHaveBeenCalledWith('seller-1', req.body);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
  });

  it('should get items', async () => {
    const req = createMockRequest({
      user: { userId: 'user-1', email: 'user@example.com', role: 'USER' },
      query: {},
    });
    const res = createMockResponse();

    (itemService.getItems as jest.Mock).mockResolvedValue({
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    });

    await getItemsController(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });

  it('should get item by id', async () => {
    const req = createMockRequest({
      user: { userId: 'user-1', email: 'user@example.com', role: 'USER' },
      params: { itemId: 'item-1' },
    });
    const res = createMockResponse();

    (itemService.getItemById as jest.Mock).mockResolvedValue({ id: 'item-1' });

    await getItemByIdController(req as any, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });

  it('should update item', async () => {
    const req = createMockRequest({
      user: { userId: 'seller-1', email: 'seller@example.com', role: 'USER' },
      params: { itemId: 'item-1' },
      body: { name: 'Updated Chair' },
    });
    const res = createMockResponse();

    (itemService.updateItem as jest.Mock).mockResolvedValue({ id: 'item-1' });

    await updateItemController(req as any, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });

  it('should delete item', async () => {
    const req = createMockRequest({
      user: { userId: 'admin-1', email: 'admin@example.com', role: 'ADMIN' },
      params: { itemId: 'item-1' },
    });
    const res = createMockResponse();

    (itemService.deleteItem as jest.Mock).mockResolvedValue({
      message: 'Item deleted successfully',
    });

    await deleteItemController(req as any, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });
});