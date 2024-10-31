import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import UserModel from '../../models/users';

import { NextFunction, Request, Response } from 'express';
import {
  RegisterRequestBody as RequestBody,
  RegisterResponseData as ResponseData,
} from '../../../../shared/types/api/accounts';

import Logger from '../../utils/logger';

const handler = async (req: Request<{}, {}, RequestBody>, res: Response<ResponseData>, next: NextFunction) => {
  const { email, username, password } = req.body;

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
