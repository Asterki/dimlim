import { z } from "zod";
import bcrypt from "bcrypt";

import UserModel from "../../models/users";

import { SecurityResponseData as ResponseData } from "../../../../shared/types/api/settings";
import { NextFunction, Request, Response } from "express";
import { User } from "../../../../shared/types/models";

import Logger from "../../services/logger";

// Settings Security
const handler = async (req: Request, res: Response<ResponseData>, next: NextFunction) => {
    if (req.isUnauthenticated() || !req.user) return res.status(401).send({ status: "unauthenticated" });
    const currentUser = req.user as User;

    const parsedBody = z
        .object({
            twoFactor: z.object({
                active: z.boolean(),
                secret: z.string(),
            }),
            password: z.string(),
        })
        .safeParse(req.body);

    if (!parsedBody.success)
        return res.status(400).send({
            status: "invalid-parameters",
        });

    try {
        const pass = await bcrypt.hash(parsedBody.data.password, 10);

        await UserModel.updateOne(
            { userID: currentUser.userID },
            {
                $set: {
                    "preferences.security.twoFactor.active": parsedBody.data.twoFactor.active,
                    "preferences.security.twoFactor.secret": parsedBody.data.twoFactor.secret,
                    "preferences.security.password": pass,
                },
            }
        ).exec();

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
