import {
    RegisterRequestBody as RequestBody,
    RegisterResponseData as ResponseData,
} from "../../../../shared/types/api/accounts";
import { NextFunction, Request, Response } from "express";
import { User } from "../../../../shared/types/models";

// Contacts get
const handler = async (req: Request, res: Response, next: NextFunction) => {
    if (req.isUnauthenticated() || !req.user) return res.status(401).send({ status: "unauthenticated" });
    const currentUser = req.user as User;

    return res.status(200).send({
        status: "success",
        contacts: {
            accepted: currentUser.contacts.accepted,
            pending: currentUser.contacts.pending,
            blocked: currentUser.contacts.blocked,
        },
    });
};

export default handler;
