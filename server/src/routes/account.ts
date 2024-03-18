import validator from "validator";

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
        const { email, password } = request.body as {
            email: string;
            password: string;
        };

        if (!validator.isEmail(email)) {
            reply.code(400).send({
                status: "Invalid email",
            });
            return;
        }

        if (password.length < 8) {
            reply.code(400).send({
                status: "Password too short",
            });
            return;
        }

        const user = new UserModel({
            email,
            password,
        });

        try {
            await user.save();
            reply.code(200).send({
                status: "User registered",
            });
        } catch (error) {
            reply.code(400).send({
                status: "User already exists",
            });
        }
    },
};

const routes = [registerRoute];
export default routes;
