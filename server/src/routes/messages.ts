import express from 'express';
import { z } from 'zod';

// Message routes
import messageFetch from '../controllers/messages/fetch-unsent';

import { ensureAuthenticated } from '../middleware/authMiddleware';
import { validateRequestBody } from '../middleware/validationMiddleware';

const router = express.Router();

const fetchSchema = z.object({
    chatId: z.string().min(1).max(100),
    limit: z.number().int().positive().max(100),
    offset: z.number().int().min(0).default(0),
});
router.post('/fetch-unsent', [validateRequestBody(fetchSchema), ensureAuthenticated], messageFetch);

export default router;