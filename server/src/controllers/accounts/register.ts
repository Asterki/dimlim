import AccountService from '../../services/accounts';

import { NextFunction, Request, Response } from 'express';
import {
  RegisterRequestBody as RequestBody,
  RegisterResponseData as ResponseData,
} from '../../../../shared/types/api/accounts';

import Logger from 'file-error-logging/dist/cjs';

const handler = async (req: Request<{}, {}, RequestBody>, res: Response<ResponseData>, next: NextFunction) => {
  const { email, username, password, pubKey, encryptedPrivKey } = req.body;

  try {
    const result = await AccountService.registerUser(email, username, password, pubKey, encryptedPrivKey);

    if (result.status === 'user-exists') {
      return res.status(200).send({
        status: 'user-exists',
      });
    }

    if (result.status === 'internal-error') {
      return res.status(500).send({
        status: 'internal-error',
      });
    }

    req.login(result.user!, (err) => {
      res.status(200).send({
        status: 'success',
      });
    });
  } catch (error: unknown) {
    res.status(500).send({
      status: 'internal-error',
    });
    Logger.log("error", (error as Error).message);
  }
};

export default handler;
