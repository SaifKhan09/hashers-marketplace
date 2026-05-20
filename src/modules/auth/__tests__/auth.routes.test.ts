import express from 'express';
import request from 'supertest';

jest.mock('../../../middlewares/auth.middleware', () => ({
  authMiddleware: (_req: any, _res: any, next: any) => next(),
}));

jest.mock('../../../utils/async-handler', () => ({
  asyncHandler: (fn: any) => fn,
}));

jest.mock('../auth.controller', () => ({
  signupController: (_req: any, res: any) => res.status(201).json({ ok: true }),
  signinController: (_req: any, res: any) => res.status(200).json({ ok: true }),
  signoutController: (_req: any, res: any) => res.status(200).json({ ok: true }),
  meController: (_req: any, res: any) => res.status(200).json({ ok: true }),
}));

const authRoutes = require('../auth.routes').default;

describe('auth.routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/auth', authRoutes);

  it('POST /auth/signup', async () => {
    await request(app)
      .post('/auth/signup')
      .send({
        firstName: 'Saif',
        lastName: 'Khan',
        email: 'saif@example.com',
        password: 'Password@123',
      })
      .expect(201);
  });

  it('POST /auth/signin', async () => {
    await request(app)
      .post('/auth/signin')
      .send({
        email: 'saif@example.com',
        password: 'Password@123',
      })
      .expect(200);
  });

  it('POST /auth/signout', async () => {
    await request(app).post('/auth/signout').expect(200);
  });

  it('GET /auth/me', async () => {
    await request(app).get('/auth/me').expect(200);
  });
});