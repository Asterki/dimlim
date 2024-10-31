import UserModel from '../../models/users';

import { NextFunction, Request, Response } from 'express';
import {
  AddResponseData as ResponseData,
  AddRemoveBlockUnblockRequestBody as RequestBody,
} from '../../../../shared/types/api/contacts';
import { User } from '../../../../shared/types/models';

import Logger from '../../utils/logger';

// Contacts add
const handler = async (req: Request<{}, {}, RequestBody>, res: Response<ResponseData>, next: NextFunction) => {
  const { username } = req.body;
  const currentUser = req.user as User;

  if (username == currentUser.profile.username) return res.status(400).send({ status: 'cannot-add-self' });

  try {
    const userExists = await UserModel.findOne({ 'profile.username': username.toLowerCase() })
      .select('username userID contacts')
      .lean();
    if (!userExists) return res.status(404).send({ status: 'user-not-found' });

    // Update current user's pending contacts
    await UserModel.updateOne(
      { userID: currentUser.userID },
      { $addToSet: { 'contacts.pending': userExists.userID } },
      { new: true },
    );

    // Update the other user's pending contacts, if they're not blocked
    if ((userExists!.contacts!.blocked! as unknown as Array<string>).includes(currentUser.userID))
      // I swear these type assertions are going to kill me one day
      return res.status(200).send({ status: 'success' });

    await UserModel.updateOne(
      { userID: userExists.userID },
      { $addToSet: { 'contacts.requests': currentUser.userID } },
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
