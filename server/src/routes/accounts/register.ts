import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import validator from "validator";
import { z } from "zod";

import { RouteOptions } from "fastify";

import UserModel from "../../models/users";

import {
    RegisterRequestBody as RequestBody,
    RegisterResponseData as ResponseData,
} from "../../../../shared/types/api/accounts";

const registerRoute: RouteOptions = {
    method: "POST",
    url: "/api/accounts/register",
    preHandler: async (request, reply, done) => {
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
            .safeParse(request.body);

        if (!parsedBody.success)
            return reply.code(400).send({
                status: "invalid-parameters",
            } as ResponseData);

        done();
    },
    handler: async (request, reply) => {
        const { email, username, password } = request.body as RequestBody;

        // Check if the user exists
        const userExists = await UserModel.findOne({ $or: [{ "email.value": email }, { username: username }] });
        if (userExists)
            return reply.code(400).send({
                status: "user-exists",
            } as ResponseData);

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
            reply.code(200).send({
                status: "success",
            } as ResponseData);
        } catch (error) {
            reply.code(400).send({
                status: "user-exists",
            } as ResponseData);
        }
    },
};

export default registerRoute;
