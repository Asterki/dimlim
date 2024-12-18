// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';

const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isUnauthenticated() || !req.user) {
    return res.status(200).send({ status: 'unauthenticated' });
  }
  next();
};

export { ensureAuthenticated };
