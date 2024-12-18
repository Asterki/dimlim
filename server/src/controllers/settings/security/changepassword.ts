import bcrypt from 'bcrypt';

import UserModel from '../../../models/Users';

import { NextFunction, Request, Response } from 'express';
import {
  SecurityResponseData as ResponseData,
  SecurityChangePasswordRequestData as RequestData,
} from '../../../../../shared/types/api/settings';
import { User } from '../../../../../shared/types/models';

import Logger from 'file-error-logging/dist/cjs';

// Activate TFA
const handler = async (req: Request<{}, {}, RequestData>, res: Response<ResponseData>, next: NextFunction) => {
  const { oldPassword, newPassword } = req.body;
  const currentUser = req.user as User;

  try {
    const user = await UserModel.findOne({ userID: currentUser.userID }).exec();
    if (!user) return res.status(404).send({ status: 'not-found' });

    if (!!bcrypt.compareSync(oldPassword, currentUser.preferences.security.password))
      return res.status(200).send({ status: 'invalid-password' });

    const pass = await bcrypt.hash(newPassword, 10);

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
    Logger.log("error", (error as Error).message);
  }
};

export default handler;
