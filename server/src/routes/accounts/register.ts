import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import validator from "validator";
import { z } from "zod";

import UserModel from "../../models/users";

import {
    RegisterRequestBody as RequestBody,
    RegisterResponseData as ResponseData,
} from "../../../../shared/types/api/accounts";
import { NextFunction, Request, Response } from "express";

const handler = async (req: Request, res: Response<ResponseData>, next: NextFunction) => {
    const parsedBody = z
        .object({
            email: z.string().email(),
            username: z
                .string()
                .min(3)
                .max(24)
                .refine((username) => {
                    return validator.isAlphanumeric(username, "en-US", { ignore: "_." });
                }),
            password: z
                .string()
                .min(8)
                .refine((pass) => {
                    return validator.isStrongPassword(pass);
                }),
        })
        .safeParse(req.body);

    if (!parsedBody.success)
        return res.status(400).send({
            status: "invalid-parameters",
        });

    const { email, username, password } = req.body as RequestBody;

    // Check if the user exists
    const userExists = await UserModel.findOne({ $or: [{ "email.value": email }, { username: username }] });
    if (userExists)
        return res.status(200).send({
            status: "user-exists",
        });

    // Create the user object
    let userID = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
        userID: userID,
        created: Date.now(),
        username: username,
        email: {
            value: email,
        },
        password: hashedPassword,
    });

    try {
        await user.save();

        req.login(user, (err) => {
            res.status(200).send({
                status: "success",
            });
        });
    } catch (error) {
        res.status(200).send({
            status: "user-exists",
        });
    }
};

export default handler;
