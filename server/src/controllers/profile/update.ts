import UserModel from '../../models/Users';

import { NextFunction, Request, Response } from 'express';
import {
  UpdateResponseData as ResponseData,
  UpdateRequestBody as RequestBody,
} from '../../../../shared/types/api/profile';
import { User } from '../../../../shared/types/models';

import Logger from '../../utils/logger';

// Profile Update
const handler = async (req: Request<{}, {}, RequestBody>, res: Response<ResponseData>, next: NextFunction) => {
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
    Logger.error((error as Error).message, true);
  }
};

export default handler;
