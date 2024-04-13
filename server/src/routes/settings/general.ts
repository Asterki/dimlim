import { z } from "zod";

import UserModel from "../../models/users";

import { AddResponseData as ResponseData } from "../../../../shared/types/api/contacts";
import { NextFunction, Request, Response } from "express";
import { User } from "../../../../shared/types/models";

// Settings General
const handler = async (req: Request, res: Response<ResponseData>, next: NextFunction) => {
    if (req.isUnauthenticated() || !req.user) return res.status(401).send({ status: "unauthenticated" });
    const currentUser = req.user as User;

    const parsedBody = z
        .object({
            theme: z.enum(["dark", "light"]),
            language: z.enum(["en", "es"]),
        })
        .safeParse(req.body);

    if (!parsedBody.success)
        return res.status(400).send({
            status: "invalid-parameters",
        });

    await UserModel.updateOne(
        { userID: currentUser.userID },
        {
            $set: {
                "preferences.general.theme": parsedBody.data.theme,
                "preferences.general.language": parsedBody.data.language,
            },
        }
    ).exec();

    return res.status(200).send({
        status: "success",
    });
};

export default handler;
