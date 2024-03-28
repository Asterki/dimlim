import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import validator from "validator";
import { z } from "zod";

import { RouteOptions } from "fastify";

import UserModel from "../../models/users";

interface RequestBody {
    email: string;
    username: string;
    password: string;
}

interface ResponseData {
    status: "success" | "invalid-parameters" | "user-exists";
}

const loginRoute: RouteOptions = {
    method: "POST",
    url: "/api/accounts/login",
    preHandler: async (request, reply, done) => {
        const parsedBody = z
            .object({
                email: z.string().email(),
                password: z.string().min(8),
            })
            .safeParse(request.body);

        if (!parsedBody.success)
            return reply.code(400).send({
                status: "invalid-parameters",
            } as ResponseData);

        done();
    },
    handler: async (request, reply) => {
        const { email, password } = request.body as RequestBody;

        // // Check if the user exists
        // const user = await UserModel.findOne({ "email.value": email });
        // if (!user)
        //     return reply.code(400).send({
        //         status: "invalid-credentials",
        //     } as ResponseData);

        // // Verify password
        // if (!bcrypt.compareSync(password, user.password))
        //     return reply.code(400).send({
        //         status: "invalid-credentials",
        //     } as ResponseData);

        reply.code(200).send({
            status: "success",
        } as ResponseData);
    },
};

export default loginRoute;
