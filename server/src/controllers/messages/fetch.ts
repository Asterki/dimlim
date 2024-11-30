import MessageService from '../../services/messages';

import { NextFunction, Request, Response } from 'express';
import {
  FetchMessageResponseData as ResponseData,
  FetchMessageRequestData as RequestData,
} from '../../../../shared/types/api/messages';
import { User } from '../../../../shared/types/models';

import Logger from 'file-error-logging/dist/cjs';

// Messages Fetch
const handler = async (req: Request<{}, {}, RequestData>, res: Response<ResponseData>, next: NextFunction) => {
  const { chatId, limit, offset } = req.body;
  const currentUser = req.user as User;

  try {
    const messages = await MessageService.getMessageCount(chatId, limit, offset);

    return res.status(200).send({
      status: 'success',
      messages: messages,
    });
  } catch (error: unknown) {
    res.status(500).send({
      status: 'internal-error',
    });
    Logger.log('error', (error as Error).message);
  }
};

export default handler;
