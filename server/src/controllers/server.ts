import Fastify, { FastifyInstance } from "fastify";
import { Authenticator } from "@fastify/passport";

// Middleware
import cors from "@fastify/cors";

import Router from "../routes/router";
import SessionController from "./sessions";

class Server {
    fastify: FastifyInstance;
    fastifyPassport!: Authenticator;
    port: number;

    constructor(dev: boolean, port: number) {
        this.fastify = Fastify({
            logger: dev,
        });
        this.port = port;
    }

    public getServer() {
        return this.fastify;
    }

    async start() {
        this.loadMiddlewares();
        this.loadSessionController();
        this.registerRoutes();

        this.fastify.listen({
            port: this.port,
        });
    }

    private loadMiddlewares() {
        this.fastify.register(cors, {});
    }

    private loadSessionController() {
        const sessionController = new SessionController();
        this.fastifyPassport = sessionController.getPassport();
        sessionController.addStrategies();
        sessionController.loadMiddleware(this.fastify);
    }

    private registerRoutes() {
        const router = new Router();
        for (const route of router.getAllRoutes()) {
            this.fastify.route(route);
        }
    }
}

export default Server;
