import validator from "validator";
import { z } from "zod";

import UserModel from "../../models/users";

import {
    RegisterRequestBody as RequestBody,
    RegisterResponseData as ResponseData,
} from "../../../../shared/types/api/accounts";
import { NextFunction, Request, Response } from "express";
import { User } from "../../../../shared/types/models";

// Contacts remove
const handler = async (req: Request, res: Response, next: NextFunction) => {
    if (req.isUnauthenticated() || !req.user) return res.status(401).send({ status: "unauthenticated" });
    const currentUser = req.user as User;

    const parsedBody = z
        .object({
            username: z.string(),
        })
        .safeParse(req.body);

    if (!parsedBody.success)
        return res.status(400).send({
            status: "invalid-parameters",
        });
    const { username } = parsedBody.data;
    if (username == currentUser.profile.username) return res.status(400).send({ status: "cannot-remove-self" });

    const userExists = await UserModel.findOne({ username: username }).select("username userID").lean();
    if (!userExists) return res.status(404).send({ status: "user-not-found" });

    // Update current user's contacts
    await UserModel.updateOne(
        { userID: currentUser.userID },
        { $pull: { "contacts.accepted": userExists.userID } },
        { new: true }
    );

    // Update the other user's contacts
    await UserModel.updateOne(
        { userID: userExists.userID },
        { $pull: { "contacts.accepted": currentUser.userID } },
        { new: true }
    );

    return res.status(200).send({
        status: "success",
    });
};

export default handler;
