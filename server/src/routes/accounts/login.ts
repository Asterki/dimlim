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
        const auth = passport.authenticate("local", async (request, reply, err, user, info, status) => {
            if (err) return reply.status(500).send({ status: "internal-error" } as ResponseData);
            if (!user) return reply.status(400).send({ status: (info as any).message } as ResponseData);

            request.logIn(user, { session: true });
            reply.send({ status: "success" } as ResponseData);
        });
        // @ts-ignore
        await auth(request, reply);
    },
};

export default loginRoute;
