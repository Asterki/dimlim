import express from 'express';
import { z } from 'zod';
import validator from 'validator';

import accountsRegister from '../controllers/accounts/register';
import accountsLogin from '../controllers/accounts/login';
import accountsFetch from '../controllers/accounts/fetch';
import accountsLogout from '../controllers/accounts/logout';

import { validateRequestBody } from '../middleware/validationMiddleware';
import { ensureAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

const registerSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(24)
    .refine((username) => {
      return validator.isAlphanumeric(username, 'en-US', { ignore: '_.' });
    }),
  password: z
    .string()
    .length(16)
    .refine((pass) => {
      return !validator.isStrongPassword(pass);
    }),
  pubKey: z.string().min(1),
  encryptedPrivKey: z.object({
    iv: z.string().min(1),
    ciphertext: z.string().min(1),
  }),
});
router.post('/register', validateRequestBody(registerSchema), accountsRegister);

const loginSchema = z.object({
  emailOrUsername: z.string().min(3).max(100),
  password: z.string().min(8).max(100),
  tfaCode: z.string().optional(),
});
router.post('/login', validateRequestBody(loginSchema), accountsLogin);

// Body-less routes
router.get('/fetch', ensureAuthenticated, accountsFetch);
router.get('/logout', ensureAuthenticated, accountsLogout);

export default router;
