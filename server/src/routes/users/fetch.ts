import { z } from "zod";

import UserModel from "../../models/users";
import { NextFunction, Request, Response } from "express";
import { User } from "../../../../shared/types/models";

import Logger from "../../services/logger";

// Fetch user
const handler = async (req: Request, res: Response, next: NextFunction) => {
    if (req.isUnauthenticated() || !req.user) return res.status(401).send({ status: "unauthenticated" });
    const currentUser = req.user as User;

    const parsedBody = z
        .object({
            username: z.string()
        })
        .safeParse(req.body);

    if (!parsedBody.success)
        return res.status(400).send({
            status: "invalid-parameters"
        });
    if (parsedBody.data.username == currentUser.profile.username)
        return res.status(401).send({
            status: "cannot-check-self"
        });

    try {
        const user = await UserModel.findOne({ username: parsedBody.data.username }).select(
            "profile.username profile.avatar profile.bio profile.location profile.website profile.joined"
        );

        if (!user || user == null || !user.profile || user.profile == undefined)
            return res.status(404).send({
                status: "not-found"
            });

        return res.status(200).send({
            status: "success",
            data: {
                username: user.profile.username,
                avatar: user.profile.avatar
                // bio: user.profile.bio,
                // location: user.profile.location,
                // website: user.profile.website,
                // joined: user.profile.joined,
            }
        });
    } catch (error: unknown) {
        res.status(500).send({
            status: "internal-error"
        });
        Logger.getInstance().error((error as Error).message, true);
    }
};

export default handler;
