import express from 'express';

// Utils routes
import generateTFA from '../controllers/utils/generate-tfa';
import verifyTFA from '../controllers/utils/verify-tfa';

const router = express.Router();

router.post('/verify-tfa', verifyTFA);
router.get('/generate-tfa', generateTFA);

export default router;