import passport from 'passport';
import { z } from 'zod';

import { LoginResponseData as ResponseData } from '../../../../shared/types/api/accounts';
import { NextFunction, Request, Response } from 'express';

const handler = (req: Request, res: Response<ResponseData>, next: NextFunction) => {
  const parsedBody = z
    .object({
      emailOrUsername: z.string(),
      password: z.string(),
    })
    .safeParse(req.body);

  if (!parsedBody.success)
    return res.status(400).send({
      status: 'invalid-parameters',
    });

  passport.authenticate('local', (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user)
      return res.status(200).send({
        status: info.message,
      });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).send({
        status: 'success',
      });
    });
  })(req, res, next);
};

export default handler;
