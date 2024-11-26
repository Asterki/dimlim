import UserModel from '../../models/Users';

import { NextFunction, Request, Response } from 'express';
import { GeneralResponseData as ResponseData, NotificationsRequestData as RequestData } from '../../../../shared/types/api/settings';
import { User } from '../../../../shared/types/models';

import Logger from 'file-error-logging/dist/cjs';

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
    Logger.log("error", (error as Error).message);
  }
};

export default handler;
