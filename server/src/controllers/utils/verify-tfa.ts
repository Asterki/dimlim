import speakeasy from 'speakeasy';

import {
  VerifyTFAResponseData as ResponseData,
  VerifyTFARequestBody as RequestBody,
} from '../../../../shared/types/api/utils';
import { NextFunction, Request, Response } from 'express';

// Verify TFA
const handler = async (req: Request<{}, {}, RequestBody>, res: Response<ResponseData>, next: NextFunction) => {
  const { code, secret } = req.body;

  const result = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: code,
  });

  return res.status(200).send({
    status: 'success',
    valid: result,
  });
};

export default handler;
