import { NextFunction, Request, Response } from 'express';
import { GetResponseData as ResponseData } from '../../../../shared/types/api/contacts';
import { User } from '../../../../shared/types/models';

import ContactsService from '../../services/contacts';

import Logger from '../../utils/logger';

// Contacts get
const handler = async (req: Request, res: Response<ResponseData>, next: NextFunction) => {
  const currentUser = req.user as User;

  try {
    const userContactsID = currentUser.contacts.accepted;
    const userContacts = await ContactsService.getProfile(userContactsID);

    if (userContacts == 'internal-error') throw new Error('internal-error');

    return res.status(200).send({
      status: 'success',
      contacts: userContacts,
    });
  } catch (error: unknown) {
    res.status(500).send({
      status: 'internal-error',
    });
    Logger.error((error as Error).message, true);
  }
};

export default handler;
