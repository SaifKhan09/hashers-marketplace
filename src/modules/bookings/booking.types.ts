import { BookingStatus } from '@prisma/client';

export interface CreateBookingInput {
  itemId: string;
  message?: string;
}

export interface UpdateBookingStatusInput {
  status: BookingStatus;
}

export interface BookingQueryParams {
  status?: BookingStatus;
}