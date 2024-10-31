import bcrypt from 'bcrypt';

import UserModel from '../../../models/users';

import { NextFunction, Request, Response } from 'express';
import { SecurityResponseData as ResponseData, TFARequestData as RequestData } from '../../../../../shared/types/api/settings';
import { User } from '../../../../../shared/types/models';

import Logger from '../../../utils/logger';

// Activate/Deactivate TFA
const handler = async (req: Request<{}, {}, RequestData>, res: Response<ResponseData>, next: NextFunction) => {
  const { password, action, secret } = req.body;
  const currentUser = req.user as User;

  try {
    const user = await UserModel.findOne({ userID: currentUser.userID }).exec();
    if (!user) return res.status(404).send({ status: 'not-found' });

    const validPassword = bcrypt.compareSync(password, currentUser.preferences.security.password);
    if (!validPassword) return res.status(200).send({ status: 'invalid-password' });

    if (action === 'activate') {
      if (!secret) return res.status(200).send({ status: 'invalid-parameters' });

      UserModel.updateOne(
        { userID: currentUser.userID },
        {
          $set: {
            'preferences.security.twoFactor.active': true,
            'preferences.security.twoFactor.secret': secret,
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
