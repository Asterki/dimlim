import { RouteOptions } from "fastify";

import server from "..";

const registerRoute: RouteOptions = {
    method: "GET",
    url: "/",
    schema: {
        querystring: {
            name: { type: "string" },
            excitement: { type: "integer" },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    hello: { type: "string" },
                },
            },
        },
    },
    handler: function (request, reply) {
        reply.send({ hello: "world" });
    },
};

server.registerRoute(registerRoute);
