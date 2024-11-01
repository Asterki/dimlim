import express from 'express';
import { z } from 'zod';

// Contacts routes
import contactsAdd from '../controllers/contacts/add';
import contactsRemove from '../controllers/contacts/remove';
import contactsBlock from '../controllers/contacts/block';
import contactsUnblock from '../controllers/contacts/unblock';
import contactsRequest from '../controllers/contacts/requests';
import contactsGet from '../controllers/contacts/get';
import contactFetch from '../controllers/contacts/fetch';

import { validateRequestBody } from '../middleware/validationMiddleware';
import { ensureAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

const addRemoveBlockUnBlockSchema = z.object({
  // That's a pretty handy schema!
  contactID: z.string().min(36, { message: 'Invalid contact ID' }).max(36, { message: 'Invalid contact ID' }),
});
router.post('/add', [validateRequestBody(addRemoveBlockUnBlockSchema), ensureAuthenticated], contactsAdd);
router.post('/remove', [validateRequestBody(addRemoveBlockUnBlockSchema), ensureAuthenticated], contactsRemove);
router.post('/block', [validateRequestBody(addRemoveBlockUnBlockSchema), ensureAuthenticated], contactsBlock);
router.post('/unblock', [validateRequestBody(addRemoveBlockUnBlockSchema), ensureAuthenticated], contactsUnblock);

const requestSchema = z.object({
  contactID: z.string().min(36, { message: 'Invalid contact ID' }).max(36, { message: 'Invalid contact ID' }),
  action: z.enum(['accept', 'reject']),
});
router.post('/requests', [validateRequestBody(requestSchema), ensureAuthenticated], contactsRequest);

router.get('/get', ensureAuthenticated, contactsGet);

const fetchSchema = z.object({
  username: z.string().min(3, { message: 'Invalid username' }).max(16, { message: 'Invalid username' }),
});
router.post('/fetch', [validateRequestBody(fetchSchema), ensureAuthenticated], contactFetch);

export default router;
