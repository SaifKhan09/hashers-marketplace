import { Role, TransactionStatus } from '@prisma/client';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ApiError } from '../../utils/api-error';
import {
  completeTransaction,
  getAllTransactions,
  getMyPurchases,
  getMySales,
} from './transaction.service';

type CompleteTransactionBody = {
  bookingId: string;
  status: string;
  paymentMethod?: string;
  notes?: string;
};

export const completeTransactionController = async (
  req: Request<{}, unknown, CompleteTransactionBody>,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }

  const { bookingId, status, paymentMethod, notes } = req.body;

  if (!bookingId || !status) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'bookingId and status are required');
  }

  const normalizedStatus = status.toUpperCase() as TransactionStatus;

  if (!['COMPLETED', 'FAILED'].includes(normalizedStatus)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'status must be one of COMPLETED or FAILED',
    );
  }

  const transaction = await completeTransaction(req.user.userId, req.user.role as Role, {
    bookingId,
    status: normalizedStatus,
    paymentMethod,
    notes,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Transaction processed successfully',
    data: transaction,
  });
};

export const getMyPurchasesController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }

  const status =
    typeof req.query.status === 'string'
      ? (req.query.status.toUpperCase() as TransactionStatus)
      : undefined;

  const transactions = await getMyPurchases(req.user.userId, req.user.role as Role, status);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Purchases fetched successfully',
    data: transactions,
  });
};

export const getMySalesController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }

  const status =
    typeof req.query.status === 'string'
      ? (req.query.status.toUpperCase() as TransactionStatus)
      : undefined;

  const transactions = await getMySales(req.user.userId, req.user.role as Role, status);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Sales fetched successfully',
    data: transactions,
  });
};

export const getAllTransactionsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }

  const status =
    typeof req.query.status === 'string'
      ? (req.query.status.toUpperCase() as TransactionStatus)
      : undefined;

  const transactions = await getAllTransactions(req.user.role as Role, status);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Transactions fetched successfully',
    data: transactions,
  });
};