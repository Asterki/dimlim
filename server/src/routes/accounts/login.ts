import bcrypt from "bcrypt";
import { z } from "zod";

import Sessions from "../../services/sessions";

import { RouteOptions } from "fastify";

import UserModel from "../../models/users";

import {
    LoginRequestBody as RequestBody,
    LoginResponseData as ResponseData,
} from "../../../../shared/types/api/accounts";

const passport = Sessions.prototype.getInstance().getPassport()
console.log(passport)

const loginRoute: RouteOptions = {
    method: "POST",
    url: "/api/accounts/login",
    preHandler: async (request, reply, done) => {
        const parsedBody = z
            .object({
                emailOrUsername: z.string().email(),
                password: z.string().min(8),
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
        const { emailOrUsername, password } = request.body as RequestBody;

        // passport.authenticate("local", (err, user, info) => {
        //     if (err) {
        //         return reply.code(500).json({
        //             ,
        //         } as ResponseData);
        //     }

        //     if (!user) {
        //         return reply.code(401).send({
        //             status: "invalid-credentials",
        //         } as ResponseData);
        //     }

        //     request.logIn(user, (err) => {
        //         if (err) {
        //             return reply.code(500).send({
        //                 status: "error",
        //             } as ResponseData);
        //         }

        //         return reply.send({
        //             status: "success",
        //         } as ResponseData);
        //     });
        // })
    },
};

export default loginRoute;
