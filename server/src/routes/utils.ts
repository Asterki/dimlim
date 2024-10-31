import express from 'express';
import { z } from 'zod';

// Utils routes
import generateTFA from '../controllers/utils/generate-tfa';
import verifyTFA from '../controllers/utils/verify-tfa';

import { ensureAuthenticated } from '../middleware/authMiddleware';
import { validateRequestBody } from '../middleware/validationMiddleware';

const router = express.Router();

const verifyTFABodySchema = z.object({
  code: z.string().min(1).max(10),
  secret: z.string().min(1).max(100),
});
router.post('/verify-tfa', [validateRequestBody(verifyTFABodySchema), ensureAuthenticated], verifyTFA);

router.get('/generate-tfa', generateTFA);

export default router;
