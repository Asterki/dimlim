import { z } from "zod";

import UserModel from "../../models/users";

import { BlockResponseData as ResponseData } from "../../../../shared/types/api/contacts";
import { NextFunction, Request, Response } from "express";
import { User } from "../../../../shared/types/models";

import Logger from "../../services/logger";

// Contacts block
const handler = async (req: Request, res: Response<ResponseData>, next: NextFunction) => {
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
    if (username == currentUser.profile.username) return res.status(400).send({ status: "cannot-block-self" });

    try {
        const userExists = await UserModel.findOne({ "profile.username": username.toLowerCase() })
            .select("username userID")
            .lean();
        if (!userExists) return res.status(404).send({ status: "user-not-found" });

        // Update current user's contacts
        await UserModel.updateOne(
            { userID: currentUser.userID },
            {
                $pull: {
                    "contacts.accepted": userExists.userID,
                },
                $addToSet: {
                    "contacts.blocked": userExists.userID,
                },
            },
            { new: true }
        );

        // Update the other user's contacts
        await UserModel.updateOne(
            { userID: userExists.userID },
            {
                $pull: {
                    "contacts.accepted": currentUser.userID,
                    "contacts.pending": currentUser.userID,
                },
            },
            { new: true }
        );

        return res.status(200).send({
            status: "success",
        });
    } catch (error: unknown) {
        res.status(500).send({
            status: "internal-error",
        });
        Logger.getInstance().error((error as Error).message, true);
    }
};

export default handler;
