import ContactsService from '../../services/contacts';

import { NextFunction, Request, Response } from 'express';
import {
  FetchContactResponse as ResponseData,
  FetchContactRequestBody as RequestBody,
} from '../../../../shared/types/api/contacts';
import { User } from '../../../../shared/types/models';

import Logger from '../../utils/logger';

// Contacts block
const handler = async (req: Request<{}, {}, RequestBody>, res: Response<ResponseData>, next: NextFunction) => {
  const { username } = req.body;
  const currentUser = req.user as User;

  try {
    const userResult = await ContactsService.getUserByUsername(username);

    const result = {
      userID: userResult.userID,
      profile: userResult.profile,
    };

    if (userResult.contacts.blocked.includes(currentUser.userID)) {
      res.send({
        status: 'blocked',
      });
    }

    res.send({
      status: 'success',
      contact: result,
    });
  } catch (error: unknown) {
    res.status(500).send({
      status: 'internal-error',
    });
    Logger.error((error as Error).message, true);
  }
};

export default handler;
