import UserModel from '../../models/users';

import { GeneralResponseData as ResponseData } from '../../../../shared/types/api/settings';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../../../shared/types/models';

import Logger from '../../utils/logger';

// Profile Update
const handler = async (req: Request, res: Response<ResponseData>, next: NextFunction) => {
  const { bio, website } = req.body;
  const currentUser = req.user as User;

  try {
    await UserModel.updateOne(
      { userID: currentUser.userID },
      {
        $set: {
          'profile.bio': bio,
          'profile.website': website,
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
