import { NextFunction, Request, Response } from 'express';
import { GetResponseData as ResponseData } from '../../../../shared/types/api/contacts';
import { User } from '../../../../shared/types/models';

import ContactsService from '../../services/contacts';

import Logger from 'file-error-logging/dist/cjs';

// Contacts get
const handler = async (req: Request, res: Response<ResponseData>, next: NextFunction) => {
  const currentUser = req.user as User;

  try {
    const acceptedContactsID = currentUser.contacts.accepted;
    const acceptedContacts = await ContactsService.getProfile(acceptedContactsID);
    if (acceptedContacts == 'internal-error') throw new Error('internal-error');

    const pendingContactsID = currentUser.contacts.pending;
    const pendingContacts = await ContactsService.getProfile(pendingContactsID);
    if (pendingContacts == 'internal-error') throw new Error('internal-error');

    const blockedContactsID = currentUser.contacts.blocked;
    const blockedContacts = await ContactsService.getProfile(blockedContactsID);
    if (blockedContacts == 'internal-error') throw new Error('internal-error');

    const requestContactsID = currentUser.contacts.requests;
    const requestContacts = await ContactsService.getProfile(requestContactsID);
    if (requestContacts == 'internal-error') throw new Error('internal-error');

    const userContacts = {
      accepted: acceptedContacts,
      pending: pendingContacts,
      blocked: blockedContacts,
      requests: requestContacts,
    };

    return res.status(200).send({
      status: 'success',
      contacts: userContacts,
    });
  } catch (error: unknown) {
    res.status(500).send({
      status: 'internal-error',
    });
    Logger.log("error", (error as Error).message);
  }
};

export default handler;
