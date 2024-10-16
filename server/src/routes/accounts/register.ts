import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import validator from 'validator';
import { z } from 'zod';

import UserModel from '../../models/users';

import {
  RegisterRequestBody as RequestBody,
  RegisterResponseData as ResponseData,
} from '../../../../shared/types/api/accounts';
import { NextFunction, Request, Response } from 'express';

import Logger from '../../services/logger';

const handler = async (req: Request, res: Response<ResponseData>, next: NextFunction) => {
  const parsedBody = z
    .object({
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
        .min(8)
        .refine((pass) => {
          return validator.isStrongPassword(pass);
        }),
    })
    .safeParse(req.body);

  if (!parsedBody.success)
    return res.status(400).send({
      status: 'invalid-parameters',
    });

  const { email, username, password } = req.body as RequestBody;

  // Check if the user exists
  const userExists = await UserModel.findOne({
    $or: [{ 'profile.email.value': email.toLowerCase() }, { 'profile.username': username.toLowerCase() }],
  });
  if (userExists)
    return res.status(200).send({
      status: 'user-exists',
    });

  try {
    // Create the user object
    let userID = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      userID,
      created: Date.now(),
      profile: {
        username,
        email: {
          value: email,
          verified: false,
        },
      },
      contacts: {
        blocked: [],
        pending: [],
        accepted: [],
      },
      pubKey: Buffer.from(''),
      preferences: {
        privacy: {
          showOnlineStatus: true,
          showLastSeen: true,
          showReadReceipts: true,
        },
        security: {
          password: hashedPassword,
          twoFactor: {
            active: false,
            secret: '',
          },
        },
      },
    });

    await user.save();

    req.login(user, (err) => {
      res.status(200).send({
        status: 'success',
      });
    });
  } catch (error: unknown) {
    res.status(500).send({
      status: 'internal-error',
    });
    Logger.getInstance().error((error as Error).message, true);
  }
};

export default handler;
