import { NextFunction, Request, Response } from 'express';
import { GenerateKeysResponseData as ResponseData } from '../../../../shared/types/api/crypto';

import { generateKeyPair } from "../../utils/crypto"

const handler = async (req: Request, res: Response<ResponseData>, next: NextFunction) => {
  const user = req.user;
  if (!user)
    return res.status(200).send({
      status: 'unauthenticated',
    });

    let data = generateKeyPair();

  return res.status(200).send({
    status: 'success',
    data
  });
};

export default handler;
