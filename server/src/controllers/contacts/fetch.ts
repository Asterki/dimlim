import ContactsService from '../../services/contacts';

import { NextFunction, Request, Response } from 'express';
import {
  FetchContactResponse as ResponseData,
  FetchContactRequestBody as RequestBody,
} from '../../../../shared/types/api/contacts';
import { User } from '../../../../shared/types/models';

import Logger from 'file-error-logging/dist/cjs';

// Contacts block
const handler = async (req: Request<{}, {}, RequestBody>, res: Response<ResponseData>, next: NextFunction) => {
  const { username } = req.body;
  const currentUser = req.user as User;

  try {
    const userResult = await ContactsService.getUserByUsername(username);
    if (userResult === 'user-not-found') return res.status(200).send({ status: 'user-not-found' });

    const result = {
      userID: userResult.userID,
      profile: userResult.profile,
    };

    if (userResult.contacts.blocked.includes(currentUser.userID)) {
      return res.send({
        status: 'blocked',
      });
    }

    return res.send({
      status: 'success',
      contact: result,
    });
  } catch (error: unknown) {
    Logger.log("error", (error as Error).message);
    return res.status(500).send({
      status: 'internal-error',
    });
  }
};

export default handler;
