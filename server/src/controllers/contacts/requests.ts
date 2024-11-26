import ContactsService from '../../services/contacts';

import { NextFunction, Request, Response } from 'express';
import {
  RequestsResponseData as ResponseData,
  RequestsRequestBody as RequestBody,
} from '../../../../shared/types/api/contacts';
import { User } from '../../../../shared/types/models';

import Logger from 'file-error-logging/dist/cjs';

// Contacts add
const handler = async (req: Request<{}, {}, RequestBody>, res: Response<ResponseData>, next: NextFunction) => {
  const { contactID, action } = req.body;
  const currentUser = req.user as User;

  try {
    let result: string;

    switch (action) {
      case "accept":
        result = await ContactsService.acceptContact(currentUser.userID, contactID)
        break;
      case "reject":
        result = await ContactsService.rejectContact(currentUser.userID, contactID)
        break;
      case "cancel":
        result = await ContactsService.cancelRequest(currentUser.userID, contactID)
        break;
    }

    if (result == 'internal-error') throw new Error('Internal error');
    if (result !== 'success') {
      return res.status(200).send({
        status: result,
      });
    } else {
      return res.status(200).send({
        status: 'success',
      });
    }
  } catch (error: unknown) {
    res.status(500).send({
      status: 'internal-error',
    });
    Logger.log("error", (error as Error).message);
  }
};

export default handler;
