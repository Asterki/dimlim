import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import validator from "validator";
import { z } from "zod";

import { RouteOptions } from "fastify";

import UserModel from "../models/users";

const registerRoute: RouteOptions = {
    method: "POST",
    url: "/api/accounts/register",
    schema: {
        body: {
            type: "object",
            required: ["email", "password"],
            properties: {
                email: { type: "string" },
                password: { type: "string" },
            },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    status: { type: "string" },
                },
            },
        },
    },
    handler: async (request, reply) => {
        const parsedBody = z
            .object({
                email: z.string().refine((email: string) => validator.isEmail(email)),
                username: z.string().max(24).min(2),
                password: z.string().max(128).min(6),
            })
            .safeParse(request.body);

        if (parsedBody.success === false) return reply.code(400).send({ message: "bad-request" });
        const { email, username, password } = parsedBody.data;

        // Check if the user exists
        const userExists = await UserModel.findOne({ $or: [{ "email.value": email }, { username: username }] });
        if (userExists)
            return reply.code(400).send({
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
            reply.code(200).send({
                status: "user-registered",
            });
        } catch (error) {
            reply.code(400).send({
                status: "user-exists",
            });
        }
    },
};

const routes = [registerRoute];
export default routes;
