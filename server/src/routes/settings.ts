import express from 'express';

import { z } from 'zod';
import validator from "validator"

// Settings routes
import settingsGeneral from '../controllers/settings/general';
import settingsPrivacy from '../controllers/settings/privacy';
import settingsNotification from '../controllers/settings/notifications';
import settingsChangePassword from '../controllers/settings/security/changepassword';
import settingsTfa from '../controllers/settings/security/tfa';

const router = express.Router();

import { ensureAuthenticated } from '../middleware/authMiddleware';
import { validateRequestBody } from '../middleware/validationMiddleware';

const generalSchema = z.object({
  theme: z.enum(['dark', 'light']),
  language: z.enum(['en', 'es']),
});
router.post('/general', [validateRequestBody(generalSchema), ensureAuthenticated], settingsGeneral);

const privacySchema = z
.object({
  showOnlineStatus: z.boolean(),
  showLastSeen: z.boolean(),
  showReadReceipts: z.boolean(),
})
router.post('/privacy', [validateRequestBody(privacySchema), ensureAuthenticated], settingsPrivacy);

const notificationsSchema = z.object({
  showNotifications: z.boolean(),
  playSound: z.boolean(),
});
router.post('/notifications', [validateRequestBody(notificationsSchema), ensureAuthenticated], settingsNotification);

const securityChangePasswordSchema = z
.object({
  newPassword: z.string().refine((pass) => {
    return validator.isStrongPassword(pass);
  }),
  oldPassword: z.string(),
})
router.post('/security/change-password', [validateRequestBody(securityChangePasswordSchema), ensureAuthenticated], settingsChangePassword);

const securityTFASchema = z
.object({
  password: z.string(),
  action: z.enum(['activate', 'deactivate']),
  secret: z.string().optional(),
})
router.post('/security/tfa', [validateRequestBody(securityTFASchema), ensureAuthenticated], settingsTfa);

export default router;
