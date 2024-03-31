import bcrypt from "bcrypt";
import { z } from "zod";

import Sessions from "../../services/sessions";

import { RouteOptions } from "fastify";
import {
    LoginRequestBody as RequestBody,
    LoginResponseData as ResponseData,
} from "../../../../shared/types/api/accounts";

const passport = Sessions.prototype.getInstance();

const loginRoute: RouteOptions = {
    method: "POST",
    url: "/api/accounts/login",
    preHandler: async (request, reply, done) => {
        const parsedBody = z
            .object({
                emailOrUsername: z.string(),
                password: z.string(),
                tfaCode: z.string().optional(),
            })
            .safeParse(request.body);

        if (!parsedBody.success)
            return reply.code(400).send({
                status: "invalid-parameters",
            } as ResponseData);

        done();
    },
    handler: async (request, reply) => {
        const { message, user } = await passport.authenticate("local", request);
        if (message !== "success") return reply.code(401).send({ status: message } as ResponseData);

        // Login user
        passport.login(user, request);
        reply.send({ status: "success" } as ResponseData);
    },
};

export default loginRoute;
