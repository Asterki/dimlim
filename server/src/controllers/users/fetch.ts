import UserModel from '../../models/Users';

import { FetchResponseData as ResponseData, FetchRequestBody as RequestBody } from '../../../../shared/types/api/users';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../../../shared/types/models';

import Logger from '../../utils/logger';

// Fetch user
const handler = async (req: Request<{}, {}, RequestBody>, res: Response<ResponseData>, next: NextFunction) => {
  const currentUser = req.user as User;
  const username = req.body.username;

  if (username == currentUser.profile.username)
    return res.status(401).send({
      status: 'cannot-check-self',
    });

  try {
    const user = await UserModel.findOne({ username: username }).select(
      'profile.username profile.avatar profile.bio profile.website',
    );

    if (!user || user == null || !user.profile || user.profile == undefined)
      return res.status(404).send({
        status: 'not-found',
      });

    return res.status(200).send({
      status: 'success',
      data: {
        username: "user.profile.username",
        avatar: "user.profile.avatar",
        bio: "user.profile.bio",
        website: "user.profile.website",
      },
    });
  } catch (error: unknown) {
    res.status(500).send({
      status: 'internal-error',
    });
    Logger.getInstance().error((error as Error).message, true);
  }
};

export default handler;
