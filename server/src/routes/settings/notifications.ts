import { z } from 'zod';

import UserModel from '../../models/users';

import { GeneralResponseData as ResponseData } from '../../../../shared/types/api/settings';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../../../shared/types/models';

import Logger from '../../services/logger';

// Settings Notifications
const handler = async (req: Request, res: Response<ResponseData>, next: NextFunction) => {
  if (req.isUnauthenticated() || !req.user) return res.status(401).send({ status: 'unauthenticated' });
  const currentUser = req.user as User;

  const parsedBody = z
    .object({
      showNotifications: z.boolean(),
      playSound: z.boolean(),
    })
    .safeParse(req.body);

  if (!parsedBody.success)
    return res.status(400).send({
      status: 'invalid-parameters',
    });

  try {
    await UserModel.updateOne(
      { userID: currentUser.userID },
      {
        $set: {
          'preferences.notifications.showNotifications': parsedBody.data.showNotifications,
          'preferences.notifications.playSound': parsedBody.data.playSound,
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
