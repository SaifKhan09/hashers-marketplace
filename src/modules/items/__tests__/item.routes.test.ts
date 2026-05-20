import express from 'express';
import request from 'supertest';

import itemRoutes from '../item.routes';

jest.mock('../../../middlewares/auth.middleware', () => ({
  authMiddleware: (_req: any, _res: any, next: any) => next(),
}));

jest.mock('../../../middlewares/role.middleware', () => ({
  roleMiddleware: () => (_req: any, _res: any, next: any) => next(),
}));

jest.mock('../../../utils/async-handler', () => ({
  asyncHandler: (fn: any) => fn,
}));

jest.mock('../item.controller', () => ({
  createItemController: (_req: any, res: any) => res.status(201).json({ ok: true }),
  getItemsController: (_req: any, res: any) => res.status(200).json({ ok: true }),
  getItemByIdController: (_req: any, res: any) => res.status(200).json({ ok: true }),
  updateItemController: (_req: any, res: any) => res.status(200).json({ ok: true }),
  deleteItemController: (_req: any, res: any) => res.status(200).json({ ok: true }),
}));

describe('item.routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/items', itemRoutes);

  it('POST /items', async () => {
    await request(app).post('/items').send({}).expect(201);
  });

  it('GET /items', async () => {
    await request(app).get('/items').expect(200);
  });

  it('GET /items/:itemId', async () => {
    await request(app).get('/items/item-1').expect(200);
  });

  it('PATCH /items/:itemId', async () => {
    await request(app).patch('/items/item-1').send({}).expect(200);
  });

  it('DELETE /items/:itemId', async () => {
    await request(app).delete('/items/item-1').expect(200);
  });
});