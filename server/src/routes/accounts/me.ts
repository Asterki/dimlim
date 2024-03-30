import bcrypt from "bcrypt";
import { z } from "zod";

import Sessions from "../../services/sessions";

import { RouteOptions } from "fastify";

import UserModel from "../../models/users";

import { MeResponseData as ResponseData } from "../../../../shared/types/api/accounts";

const passport = Sessions.prototype.getInstance().getPassport();

const loginRoute: RouteOptions = {
    method: "POST",
    url: "/api/accounts/me",
    preHandler: async (request, reply, done) => {
        if (!request.isAuthenticated()) return reply.status(401).send({ status: "unauthenticated" } as ResponseData);
        else done();
    },
    handler: async (request, reply) => {
        return reply.status(200).send(request.user);
    },
};

export default loginRoute;
