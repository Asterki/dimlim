import UserModel from '../../models/Users';

import { NextFunction, Request, Response } from 'express';
import {
  BlockResponseData as ResponseData,
  AddRemoveBlockUnblockRequestBody as RequestBody,
} from '../../../../shared/types/api/contacts';
import { User } from '../../../../shared/types/models';

import Logger from '../../utils/logger';

// Contacts block
const handler = async (req: Request<{}, {}, RequestBody>, res: Response<ResponseData>, next: NextFunction) => {
  const { username } = req.body;
  const currentUser = req.user as User;

  if (username == currentUser.profile.username) return res.status(400).send({ status: 'cannot-block-self' });

  try {
    const userExists = await UserModel.findOne({ 'profile.username': username.toLowerCase() })
      .select('username userID')
      .lean();
    if (!userExists) return res.status(404).send({ status: 'user-not-found' });

    // Update current user's contacts
    await UserModel.updateOne(
      { userID: currentUser.userID },
      {
        $pull: {
          'contacts.accepted': userExists.userID,
        },
        $addToSet: {
          'contacts.blocked': userExists.userID,
        },
      },
      { new: true },
    );

    // Update the other user's contacts
    await UserModel.updateOne(
      { userID: userExists.userID },
      {
        $pull: {
          'contacts.accepted': currentUser.userID,
          'contacts.pending': currentUser.userID,
        },
      },
      { new: true },
    );

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
