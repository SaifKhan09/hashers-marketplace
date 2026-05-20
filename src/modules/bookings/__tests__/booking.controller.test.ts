import { StatusCodes } from 'http-status-codes';

import * as bookingService from '../booking.service';
import {
  createBookingController,
  getMyBookingsController,
  getSellerBookingsController,
  updateBookingStatusController,
} from '../booking.controller';
import { createMockRequest, createMockResponse } from '../../../../tests/helpers/http-mocks';

jest.mock('../booking.service');

describe('booking.controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create booking', async () => {
    const req = createMockRequest({
      user: { userId: 'buyer-1', email: 'buyer@example.com', role: 'USER' },
      body: { itemId: 'item-1', message: 'Interested' },
    });
    const res = createMockResponse();

    (bookingService.createBooking as jest.Mock).mockResolvedValue({ id: 'booking-1' });

    await createBookingController(req as any, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
  });

  it('should get my bookings', async () => {
    const req = createMockRequest({
      user: { userId: 'buyer-1', email: 'buyer@example.com', role: 'USER' },
      query: {},
    });
    const res = createMockResponse();

    (bookingService.getMyBookings as jest.Mock).mockResolvedValue([]);

    await getMyBookingsController(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });

  it('should get seller bookings', async () => {
    const req = createMockRequest({
      user: { userId: 'seller-1', email: 'seller@example.com', role: 'USER' },
      query: {},
    });
    const res = createMockResponse();

    (bookingService.getSellerBookings as jest.Mock).mockResolvedValue([]);

    await getSellerBookingsController(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });

  it('should update booking status', async () => {
    const req = createMockRequest({
      user: { userId: 'seller-1', email: 'seller@example.com', role: 'USER' },
      params: { bookingId: 'booking-1' },
      body: { status: 'ACCEPTED' },
    });
    const res = createMockResponse();

    (bookingService.updateBookingStatus as jest.Mock).mockResolvedValue({
      id: 'booking-1',
      status: 'ACCEPTED',
    });

    await updateBookingStatusController(req as any, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });
});