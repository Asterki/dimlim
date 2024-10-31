import passport from 'passport';

import { LoginResponseData as ResponseData } from '../../../../shared/types/api/accounts';
import { NextFunction, Request, Response } from 'express';

const handler = (req: Request, res: Response<ResponseData>, next: NextFunction) => {
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
