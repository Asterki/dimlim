import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

import Router from "../routes/router";

class Server {
    fastify: FastifyInstance;
    port: number;

    constructor(dev: boolean, port: number) {
        this.fastify = Fastify({
            logger: true,
        });
        this.port = port;
    }

    public getServer() {
        return this.fastify;
    }

    async start() {
        this.loadMiddlewares();
        this.registerRoutes();

        this.fastify.listen({
            port: this.port,
        });
    }

    private loadMiddlewares() {
        this.fastify.register(cors, {});
    }

    private registerRoutes() {
        const router = new Router();
        for (const route of router.getAllRoutes()) {
            this.fastify.route(route);
        }
    }
}

export default Server;
