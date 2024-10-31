import express from 'express';
import { z } from 'zod';

// Profile routes
import profileUpdate from '../controllers/profile/update';
import profilePicture from '../controllers/profile/picture';

import { ensureAuthenticated } from '../middleware/authMiddleware';
import { validateRequestBody } from '../middleware/validationMiddleware';

const router = express.Router();

const updateSchema = z.object({
  bio: z.string().max(100),
  website: z.string().url().max(100),
});
router.post('/update', [validateRequestBody(updateSchema), ensureAuthenticated], profileUpdate);

const pictureSchema = z.object({
  action: z.enum(['upload', 'remove']),
});
router.post('/picture', [validateRequestBody(pictureSchema), ensureAuthenticated], profilePicture);

export default router;
