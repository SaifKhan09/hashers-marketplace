import express from 'express';
import request from 'supertest';

jest.mock('../../../middlewares/auth.middleware', () => ({
  authMiddleware: (_req: any, _res: any, next: any) => next(),
}));

jest.mock('../../../middlewares/role.middleware', () => ({
  requireRole: () => (_req: any, _res: any, next: any) => next(),
  roleMiddleware: () => (_req: any, _res: any, next: any) => next(),
}));

jest.mock('../../../utils/async-handler', () => ({
  asyncHandler: (fn: any) => fn,
}));

const adminRoutes = require('../admin.routes').default;

describe('admin.routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/admin', adminRoutes);

  it('should mount admin router without crashing', async () => {
    const response = await request(app).get('/admin');
    expect([200, 404, 405]).toContain(response.status);
  });
});