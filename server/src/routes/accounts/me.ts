import { MeResponseData as ResponseData } from "../../../../shared/types/api/accounts";
import { NextFunction, Request, Response } from "express";

const handler = async (req: Request, res: Response<ResponseData>, next: NextFunction) => {
    const user = req.user;
    if (!user)
        return res.status(401).send({
            status: "unauthenticated"
        });

    return res.status(200).send({
        status: "success",
        user: user as any
    });
};

export default handler;
