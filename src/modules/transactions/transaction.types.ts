import { TransactionStatus } from '@prisma/client';

export interface CompleteTransactionInput {
  bookingId: string;
  status: TransactionStatus;
  paymentMethod?: string;
  notes?: string;
}

export interface TransactionQueryParams {
  status?: TransactionStatus;
}