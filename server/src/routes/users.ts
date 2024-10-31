import express from 'express';

import usersFetch from '../controllers/users/fetch';

const router = express.Router();

router.get('/fetch', usersFetch);

export default router;
