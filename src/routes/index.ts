import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { asyncHandler } from '../utils/async-handler';

const router = Router();

router.get(
  '/health',
  asyncHandler(async (_req, res) => {
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Hashers Marketplace API is running',
    });
  }),
);

export default router;