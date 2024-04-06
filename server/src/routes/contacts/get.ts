import UserModel from "../../models/users";

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

    const acceptedContacts = await UserModel.find({ userID: { $in: currentUser.contacts.accepted } }).select(
        "profile.username userID"
    );
    const pendingContacts = await UserModel.find({ userID: { $in: currentUser.contacts.pending } }).select(
        "profile.username userID"
    );
    const blockedContacts = await UserModel.find({ userID: { $in: currentUser.contacts.blocked } }).select(
        "profile.username userID"
    );

    return res.status(200).send({
        status: "success",
        contacts: {
            accepted: acceptedContacts,
            pending: pendingContacts,
            blocked: blockedContacts,
        },
    });
};

export default handler;
