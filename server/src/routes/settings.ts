import express from 'express';

// Settings routes
import settingsGeneral from '../controllers/settings/general';
import settingsPrivacy from '../controllers/settings/privacy';
import settingsNotification from '../controllers/settings/notifications';
import settingsChangePassword from '../controllers/settings/security/changepassword';
import settingsTfa from '../controllers/settings/security/tfa';

const router = express.Router();

router.post('/general', settingsGeneral);
router.post('/privacy', settingsPrivacy);
router.post('/notifications', settingsNotification);
router.post('/security/change-password', settingsChangePassword);
router.post('/security/tfa', settingsTfa);

export default router;