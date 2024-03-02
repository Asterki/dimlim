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
                    schema: { type: "object" },
                },
            },
        },
    },
    handler: function (request, reply) {
        reply.send({
            querystring: {
                name: { type: "string" },
                excitement: { type: "integer" },
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        schema: { type: "object" },
                    },
                },
            },
        });
    },
};

server.registerRoute(registerRoute);
