import { StatusCodes } from 'http-status-codes';

import * as transactionService from '../transaction.service';
import {
  completeTransactionController,
  getAllTransactionsController,
  getMyPurchasesController,
  getMySalesController,
} from '../transaction.controller';
import { createMockRequest, createMockResponse } from '../../../../tests/helpers/http-mocks';

jest.mock('../transaction.service');

describe('transaction.controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should complete transaction', async () => {
    const req = createMockRequest({
      user: { userId: 'seller-1', email: 'seller@example.com', role: 'USER' },
      body: { bookingId: 'booking-1', status: 'COMPLETED', paymentMethod: 'CASH' },
    });
    const res = createMockResponse();

    (transactionService.completeTransaction as jest.Mock).mockResolvedValue({ id: 'txn-1' });

    await completeTransactionController(req as any, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
  });

  it('should get my purchases', async () => {
    const req = createMockRequest({
      user: { userId: 'buyer-1', email: 'buyer@example.com', role: 'USER' },
      query: {},
    });
    const res = createMockResponse();

    (transactionService.getMyPurchases as jest.Mock).mockResolvedValue([]);

    await getMyPurchasesController(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });

  it('should get my sales', async () => {
    const req = createMockRequest({
      user: { userId: 'seller-1', email: 'seller@example.com', role: 'USER' },
      query: {},
    });
    const res = createMockResponse();

    (transactionService.getMySales as jest.Mock).mockResolvedValue([]);

    await getMySalesController(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });

  it('should get all transactions', async () => {
    const req = createMockRequest({
      user: { userId: 'admin-1', email: 'admin@example.com', role: 'ADMIN' },
      query: {},
    });
    const res = createMockResponse();

    (transactionService.getAllTransactions as jest.Mock).mockResolvedValue([]);

    await getAllTransactionsController(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });
});