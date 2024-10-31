import express from 'express';

// Contacts routes
import contactsAdd from '../controllers/contacts/add';
import contactsRemove from '../controllers/contacts/remove';
import contactsBlock from '../controllers/contacts/block';
import contactsUnblock from '../controllers/contacts/unblock';
import contactsPending from '../controllers/contacts/pending';
import contactsGet from '../controllers/contacts/get';

const router = express.Router();

router.post('/add', contactsAdd);
router.post('/remove', contactsRemove);
router.post('/block', contactsBlock);
router.post('/unblock', contactsUnblock);
router.post('/pending', contactsPending);
router.get('/get', contactsGet);

export default router;