import express from 'express';

// Account routes
import accountsRegister from '../controllers/accounts/register';
import accountsLogin from '../controllers/accounts/login';
import accountsFetch from '../controllers/accounts/fetch';
import accountsLogout from '../controllers/accounts/logout';

const router = express.Router();

router.post('/register', accountsRegister);
router.post('/login', accountsLogin);
router.get('/fetch', accountsFetch);
router.get('/logout', accountsLogout);

export default router;