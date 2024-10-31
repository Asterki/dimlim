import { z } from 'zod';
import bcrypt from 'bcrypt';
import validator from 'validator';

import UserModel from '../../../models/users';

import { SecurityResponseData as ResponseData } from '../../../../../shared/types/api/settings';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../../../../shared/types/models';

import Logger from '../../../utils/logger';

// Activate TFA
const handler = async (req: Request, res: Response<ResponseData>, next: NextFunction) => {
  if (req.isUnauthenticated() || !req.user) return res.status(401).send({ status: 'unauthenticated' });
  const currentUser = req.user as User;

  const parsedBody = z
    .object({
      newPassword: z.string().refine((pass) => {
        return validator.isStrongPassword(pass);
      }),
      oldPassword: z.string(),
    })
    .safeParse(req.body);

  if (!parsedBody.success)
    return res.status(400).send({
      status: 'invalid-parameters',
    });

  try {
    const user = await UserModel.findOne({ userID: currentUser.userID }).exec();
    if (!user) return res.status(404).send({ status: 'not-found' });

    if (!!bcrypt.compareSync(parsedBody.data.oldPassword, currentUser.preferences.security.password))
      return res.status(200).send({ status: 'invalid-password' });

    const pass = await bcrypt.hash(parsedBody.data.newPassword, 10);

    UserModel.updateOne(
      { userID: currentUser.userID },
      {
        $set: {
          'preferences.security.password': pass,
        },
      },
    ).exec();

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
