import express from 'express';
import request from 'supertest';

jest.mock('../../modules/auth/auth.routes', () => {
  const express = require('express');
  const router = express.Router();
  router.post('/login', (_req: any, res: any) => res.status(200).json({ module: 'auth' }));
  return router;
});

jest.mock('../../modules/items/item.routes', () => {
  const express = require('express');
  const router = express.Router();
  router.get('/', (_req: any, res: any) => res.status(200).json({ module: 'items' }));
  return router;
});

jest.mock('../../modules/bookings/booking.routes', () => {
  const express = require('express');
  const router = express.Router();
  router.get('/me', (_req: any, res: any) => res.status(200).json({ module: 'bookings' }));
  return router;
});

jest.mock('../../modules/transactions/transaction.routes', () => {
  const express = require('express');
  const router = express.Router();
  router.get('/sales', (_req: any, res: any) => res.status(200).json({ module: 'transactions' }));
  return router;
});

jest.mock('../../modules/admin/admin.routes', () => {
  const express = require('express');
  const router = express.Router();
  router.get('/', (_req: any, res: any) => res.status(200).json({ module: 'admin' }));
  return router;
});

import indexRoutes from '../index';

describe('routes/index', () => {
  const app = express();
  app.use(express.json());
  app.use('/', indexRoutes);

  it('should mount auth routes', async () => {
    await request(app).post('/auth/login').send({}).expect(200);
  });

  it('should mount item routes', async () => {
    await request(app).get('/items').expect(200);
  });

  it('should mount booking routes', async () => {
    await request(app).get('/bookings/me').expect(200);
  });

  it('should mount transaction routes', async () => {
    await request(app).get('/transactions/sales').expect(200);
  });

  it('should mount admin routes', async () => {
    await request(app).get('/admin').expect(200);
  });
});