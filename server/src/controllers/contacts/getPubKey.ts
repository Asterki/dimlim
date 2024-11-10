import { NextFunction, Request, Response } from 'express';
import {
  GetPubKeyResponseData as ResponseData,
  GetPubKeyRequestData as RequestBodyData,
} from '../../../../shared/types/api/contacts';
import { User } from '../../../../shared/types/models';

import ContactService from '../../services/contacts';

const handler = async (req: Request<{}, {}, RequestBodyData>, res: Response<ResponseData>, next: NextFunction) => {
  const currentUser = req.user as User;

  try {
    const contact = await ContactService.getUserByID(req.body.contactID);
    if (contact == 'user-not-found' || !contact) {
      return res.status(404).send({
        status: 'contact-not-found',
      });
    }

    if (!contact.contacts.accepted.includes(currentUser.userID)) {
      return res.status(403).send({
        status: 'unauthenticated',
      });
    }

    return res.status(200).send({
      status: 'success',
      key: contact.pubKey,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: 'server-error',
    });
  }
};

export default handler;
