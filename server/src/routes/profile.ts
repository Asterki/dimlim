import express from 'express';

// Profile routes
import profileUpdate from '../controllers/profile/update';
import profilePicture from '../controllers/profile/picture';

const router = express.Router();

router.post('/update', profileUpdate);
router.post('/picture', profilePicture);

export default router;