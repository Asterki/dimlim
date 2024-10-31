import express from 'express';
import { z } from 'zod';

// Contacts routes
import contactsAdd from '../controllers/contacts/add';
import contactsRemove from '../controllers/contacts/remove';
import contactsBlock from '../controllers/contacts/block';
import contactsUnblock from '../controllers/contacts/unblock';
import contactsRequest from '../controllers/contacts/requests';
import contactsGet from '../controllers/contacts/get';

import { validateRequestBody } from '../middleware/validationMiddleware';
import { ensureAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

const addRemoveBlockUnBlockSchema = z.object({
  // That's a pretty handy schema!
  username: z.string().min(2).max(24),
});
router.post('/add', [validateRequestBody(addRemoveBlockUnBlockSchema), ensureAuthenticated], contactsAdd);
router.post('/remove', [validateRequestBody(addRemoveBlockUnBlockSchema), ensureAuthenticated], contactsRemove);
router.post('/block', [validateRequestBody(addRemoveBlockUnBlockSchema), ensureAuthenticated], contactsBlock);
router.post('/unblock', [validateRequestBody(addRemoveBlockUnBlockSchema), ensureAuthenticated], contactsUnblock);

const requestSchema = z.object({
  username: z.string(),
  action: z.enum(['accept', 'reject']),
});
router.get('/pending', [validateRequestBody(requestSchema), ensureAuthenticated], contactsRequest);

router.get('/get', ensureAuthenticated, contactsGet);

export default router;
