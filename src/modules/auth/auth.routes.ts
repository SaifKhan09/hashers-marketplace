import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../utils/async-handler';
import {
  meController,
  signinController,
  signoutController,
  signupController,
} from './auth.controller';

const router = Router();

router.post('/signup', asyncHandler(signupController));
router.post('/signin', asyncHandler(signinController));
router.post('/signout', authMiddleware, asyncHandler(signoutController));
router.get('/me', authMiddleware, asyncHandler(meController));

export default router;