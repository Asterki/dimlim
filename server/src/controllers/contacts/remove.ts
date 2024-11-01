import ContactsService from "../../services/contacts"

import { NextFunction, Request, Response } from 'express';
import { RemoveResponseData as ResponseData,
  AddRemoveBlockUnblockRequestBody as RequestBody
 } from '../../../../shared/types/api/contacts';
import { User } from '../../../../shared/types/models';

import Logger from '../../utils/logger';

// Contacts remove
const handler = async (req: Request<{}, {}, RequestBody>, res: Response<ResponseData>, next: NextFunction) => {
  const { contactID } = req.body;
  const currentUser = req.user as User;

  try {
    const result = await ContactsService.removeContact(currentUser.userID, contactID);

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
    Logger.error((error as Error).message, true);
  }
};

export default handler;
