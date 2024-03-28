import bcrypt from "bcrypt";
import { z } from "zod";

import Sessions from "../../services/sessions";

import { RouteOptions } from "fastify";

import UserModel from "../../models/users";

import {
    LoginRequestBody as RequestBody,
    LoginResponseData as ResponseData,
} from "../../../../shared/types/api/accounts";

const passport = Sessions.prototype.getInstance().getPassport();

const loginRoute: RouteOptions = {
    method: "POST",
    url: "/api/accounts/me",
    // preHandler: async (request, reply, done) => {
    //     const parsedBody = z
    //         .object({
    //             emailOrUsername: z.string(),
    //             password: z.string(),
    //             tfaCode: z.string().optional(),
    //         })
    //         .safeParse(request.body);

    //     if (!parsedBody.success)
    //         return reply.code(400).send({
    //             status: "invalid-parameters",
    //         } as ResponseData);

    //     done();
    // },
    handler: async (request, reply) => {
        console.log(reply)

        return reply.send(request.user)
    },
};

export default loginRoute;
