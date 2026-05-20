import express from 'express';
import request from 'supertest';

import transactionRoutes from '../transaction.routes';

jest.mock('../../../middlewares/auth.middleware', () => ({
  authMiddleware: (_req: any, _res: any, next: any) => next(),
}));

jest.mock('../../../utils/async-handler', () => ({
  asyncHandler: (fn: any) => fn,
}));

jest.mock('../transaction.controller', () => ({
  completeTransactionController: (_req: any, res: any) => res.status(201).json({ ok: true }),
  getMyPurchasesController: (_req: any, res: any) => res.status(200).json({ ok: true }),
  getMySalesController: (_req: any, res: any) => res.status(200).json({ ok: true }),
  getAllTransactionsController: (_req: any, res: any) => res.status(200).json({ ok: true }),
}));

describe('transaction.routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/transactions', transactionRoutes);

  it('POST /transactions', async () => {
    await request(app).post('/transactions').send({}).expect(201);
  });

  it('GET /transactions/purchases', async () => {
    await request(app).get('/transactions/purchases').expect(200);
  });

  it('GET /transactions/sales', async () => {
    await request(app).get('/transactions/sales').expect(200);
  });

  it('GET /transactions/admin', async () => {
    await request(app).get('/transactions/admin').expect(200);
  });
});