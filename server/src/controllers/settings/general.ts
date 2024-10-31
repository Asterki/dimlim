
import UserModel from '../../models/users';

import { GeneralResponseData as ResponseData, GeneralRequestData as RequestData } from '../../../../shared/types/api/settings';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../../../shared/types/models';

import Logger from '../../utils/logger';

// Settings General
const handler = async (req: Request<{}, {}, RequestData>, res: Response<ResponseData>, next: NextFunction) => {
  const { theme, language } = req.body;
  const currentUser = req.user as User;

  try {
    await UserModel.updateOne(
      { userID: currentUser.userID },
      {
        $set: {
          'preferences.general.theme': theme,
          'preferences.general.language': language,
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
