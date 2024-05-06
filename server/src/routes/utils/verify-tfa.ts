import { z } from 'zod';
import speakeasy from 'speakeasy';

import { VerifyTFAResponseData as ResponseData } from '../../../../shared/types/api/utils';
import { NextFunction, Request, Response } from 'express';

// Verify TFA
const handler = async (req: Request, res: Response<ResponseData>, next: NextFunction) => {
  const parsedBody = z
    .object({
      code: z.string(),
      secret: z.string(),
    })
    .safeParse(req.body);

  if (!parsedBody.success)
    return res.status(400).send({
      status: 'invalid-parameters',
    });

  const result = speakeasy.totp.verify({
    secret: parsedBody.data.secret,
    encoding: 'base32',
    token: parsedBody.data.code,
  });

  return res.status(200).send({
    status: 'success',
    valid: result,
  });
};

export default handler;
