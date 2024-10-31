import UserModel from '../../models/users';

import { NextFunction, Request, Response } from 'express';
import {
  PrivacyResponseData as ResponseData,
  PrivacyRequestData as RequestData,
} from '../../../../shared/types/api/settings';

import { User } from '../../../../shared/types/models';

import Logger from '../../utils/logger';

// Settings Privacy
const handler = async (req: Request<{}, {}, RequestData>, res: Response<ResponseData>, next: NextFunction) => {
  const { showOnlineStatus, showLastSeen, showReadReceipts } = req.body;
  const currentUser = req.user as User;

  try {
    await UserModel.updateOne(
      { userID: currentUser.userID },
      {
        $set: {
          'preferences.privacy.showOnlineStatus': showOnlineStatus,
          'preferences.privacy.showLastSeen': showLastSeen,
          'preferences.privacy.showReadReceipts': showReadReceipts,
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
