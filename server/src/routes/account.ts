import { RouteOptions } from "fastify";

const registerRoute: RouteOptions = {
    method: "GET",
    url: "/water",
    schema: {
        querystring: {
            name: { type: "string" },
            excitement: { type: "integer" },
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
    handler: function (request, reply) {
        reply.send({ hello: "world" });
    },
};

const routes = [registerRoute];
export default routes;
