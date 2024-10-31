import { z } from 'zod';

import UserModel from '../../models/users';

import { GeneralResponseData as ResponseData, NotificationsRequestData as RequestData } from '../../../../shared/types/api/settings';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../../../shared/types/models';

import Logger from '../../utils/logger';

// Settings Notifications
const handler = async (req: Request<{}, {}, RequestData>, res: Response<ResponseData>, next: NextFunction) => {
  const { showNotifications, playSound } = req.body;
  const currentUser = req.user as User;

  try {
    await UserModel.updateOne(
      { userID: currentUser.userID },
      {
        $set: {
          'preferences.notifications.showNotifications': showNotifications,
          'preferences.notifications.playSound': playSound,
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
