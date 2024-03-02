import Fastify, { FastifyInstance, RouteOptions } from "fastify";
import cors from "@fastify/cors";

class Server {
    fastify: FastifyInstance;
    port: number;

    constructor(port: number) {
        this.fastify = Fastify({
            logger: true,
        });
        this.port = port;
    }

    getServer() {
        return this.fastify;
    }

    async start() {
        await this.fastify.register(cors, {
            // put your options here
        });

        this.fastify.get("/", function (request, reply) {
            reply.send({ hello: "world" });
        });

        this.fastify.listen(this.port);
    }

    registerRoute(route: RouteOptions) {
        this.fastify.route(route);
    }
}

const server = new Server(3000);
server.start();

export default server;
