import express from 'express';
import request from 'supertest';

import bookingRoutes from '../booking.routes';

jest.mock('../../../middlewares/auth.middleware', () => ({
  authMiddleware: (_req: any, _res: any, next: any) => next(),
}));

jest.mock('../../../utils/async-handler', () => ({
  asyncHandler: (fn: any) => fn,
}));

jest.mock('../booking.controller', () => ({
  createBookingController: (_req: any, res: any) => res.status(201).json({ ok: true }),
  getMyBookingsController: (_req: any, res: any) => res.status(200).json({ ok: true }),
  getSellerBookingsController: (_req: any, res: any) => res.status(200).json({ ok: true }),
  updateBookingStatusController: (_req: any, res: any) => res.status(200).json({ ok: true }),
}));

describe('booking.routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/bookings', bookingRoutes);

  it('POST /bookings', async () => {
    await request(app).post('/bookings').send({}).expect(201);
  });

  it('GET /bookings/me', async () => {
    await request(app).get('/bookings/me').expect(200);
  });

  it('GET /bookings/seller', async () => {
    await request(app).get('/bookings/seller').expect(200);
  });

  it('PATCH /bookings/:bookingId/status', async () => {
    await request(app).patch('/bookings/booking-1/status').send({}).expect(200);
  });
});