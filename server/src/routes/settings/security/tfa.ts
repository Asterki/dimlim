import { z } from 'zod';
import bcrypt from 'bcrypt';

import UserModel from '../../../models/users';

import { SecurityResponseData as ResponseData } from '../../../../../shared/types/api/settings';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../../../../shared/types/models';

import Logger from '../../../services/logger';

// Activate/Deactivate TFA
const handler = async (req: Request, res: Response<ResponseData>, next: NextFunction) => {
  if (req.isUnauthenticated() || !req.user) return res.status(401).send({ status: 'unauthenticated' });
  const currentUser = req.user as User;

  const parsedBody = z
    .object({
      password: z.string(),
      action: z.enum(['activate', 'deactivate']),
      secret: z.string().optional(),
    })
    .safeParse(req.body);

  if (!parsedBody.success)
    return res.status(400).send({
      status: 'invalid-parameters',
    });

  try {
    const user = await UserModel.findOne({ userID: currentUser.userID }).exec();
    if (!user) return res.status(404).send({ status: 'not-found' });

    const validPassword = bcrypt.compareSync(parsedBody.data.password, currentUser.preferences.security.password);
    if (!validPassword) return res.status(200).send({ status: 'invalid-password' });

    if (parsedBody.data.action === 'activate') {
      UserModel.updateOne(
        { userID: currentUser.userID },
        {
          $set: {
            'preferences.security.twoFactor.active': true,
            'preferences.security.twoFactor.secret': parsedBody.data.secret,
          },
        },
      ).exec();
    } else {
      UserModel.updateOne(
        { userID: currentUser.userID },
        {
          $set: {
            'preferences.security.twoFactor.active': false,
            'preferences.security.twoFactor.secret': '',
          },
        },
      ).exec();
    }

    return res.status(200).send({
      status: 'success',
    });
  } catch (error: unknown) {
    res.status(500).send({
      status: 'internal-error',
    });
    Logger.getInstance().error((error as Error).message, true);
  }
};

export default handler;
