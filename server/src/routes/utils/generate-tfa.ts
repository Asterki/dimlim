import speakeasy from 'speakeasy';

import { GenerateTFAResponseData as ResponseData } from '../../../../shared/types/api/utils';
import { NextFunction, Request, Response } from 'express';

const handler = async (req: Request, res: Response<ResponseData>, next: NextFunction) => {
  const secret = speakeasy.generateSecret();
  res.status(200).send({ status: 'success', data: secret });
};

export default handler;
