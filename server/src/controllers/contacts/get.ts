import { NextFunction, Request, Response } from 'express';
import { GetResponseData as ResponseData } from '../../../../shared/types/api/contacts';
import { User } from '../../../../shared/types/models';

import ContactsService from '../../services/contacts';

import Logger from '../../utils/logger';

// Contacts get
const handler = async (req: Request, res: Response<ResponseData>, next: NextFunction) => {
  const currentUser = req.user as User;

  try {
    const acceptedContactsID = currentUser.contacts.accepted;
    const acceptedContacts = await ContactsService.getProfile(acceptedContactsID);

    const pendingContactsID = currentUser.contacts.pending;
    const pendingContacts = await ContactsService.getProfile(pendingContactsID);

    const blockedContactsID = currentUser.contacts.blocked;
    const blockedContacts = await ContactsService.getProfile(blockedContactsID);

    const requestContactsID = currentUser.contacts.requests;
    const requestContacts = await ContactsService.getProfile(requestContactsID);

    const userContacts = {
      accepted: acceptedContacts,
      pending: pendingContacts,
      blocked: blockedContacts,
      requests: requestContacts,
    };

    if (acceptedContacts == 'internal-error') throw new Error('internal-error');
    if (pendingContacts == 'internal-error') throw new Error('internal-error');
    if (blockedContacts == 'internal-error') throw new Error('internal-error');
    if (requestContacts == 'internal-error') throw new Error('internal-error');

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
