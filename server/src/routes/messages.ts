import express from 'express';
import { z } from 'zod';

// Message routes
import messageFetch from '../controllers/messages/fetch';

import { ensureAuthenticated } from '../middleware/authMiddleware';
import { validateRequestBody } from '../middleware/validationMiddleware';

const router = express.Router();

const fetchSchema = z.object({
    chatId: z.string().min(1).max(100),
    limit: z.number().int().positive().default(50),
    offset: z.number().int().positive().default(0),
});
router.post('/fetch-messages-from-chat', [validateRequestBody(fetchSchema), ensureAuthenticated], messageFetch);

export default router;
