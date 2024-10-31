import express from 'express';
import { z } from 'zod';

import usersFetch from '../controllers/users/fetch';

import { validateRequestBody } from '../middleware/validationMiddleware';
import { ensureAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

const fetchUserSchema = z.object({
  username: z.string().min(2).max(24),
});
router.post('/fetch', [ensureAuthenticated, validateRequestBody(fetchUserSchema)], usersFetch);

export default router;
