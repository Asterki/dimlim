import bcrypt from "bcrypt";
import { z } from "zod";

import Sessions from "../../services/sessions";

import { RouteOptions } from "fastify";

import UserModel from "../../models/users";

import { MeResponseData as ResponseData } from "../../../../shared/types/api/accounts";

const loginRoute: RouteOptions = {
    method: "POST",
    url: "/api/accounts/me",
    handler: async (request, reply) => {
        console.log((request as any).session.user)
        return reply.status(200).send(request);
    },
};

export default loginRoute;
