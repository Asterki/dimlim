import express from 'express';

import GenerateKeys from '../controllers/crypto/generateKeys';

const router = express.Router();

router.get('/generateKeys', GenerateKeys);

export default router;
