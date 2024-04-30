import { LogoutResponseData as ResponseData } from "../../../../shared/types/api/accounts";
import { NextFunction, Request, Response } from "express";

const handler = async (req: Request, res: Response<ResponseData>, next: NextFunction) => {
    const user = req.user;
    if (!user)
        return res.status(401).send({
            status: "unauthenticated",
        });

    req.logOut({ keepSessionInfo: false }, (err) => {
        if (err) return next(err);
        return res.send({
            status: "success",
        });
    });
};

export default handler;
