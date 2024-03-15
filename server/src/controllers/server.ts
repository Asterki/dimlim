import Fastify, { FastifyInstance } from "fastify";
import { Authenticator } from "@fastify/passport";

// Middleware
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";

import Router from "../routes/router";


import authenticationStrategies from "./sessions";

class Server {
    fastify: FastifyInstance;
    fastifyPassport: Authenticator;
    port: number;

    constructor(dev: boolean, port: number) {
        this.fastify = Fastify({
            logger: true,
        });
        this.port = port;
        this.fastifyPassport = new Authenticator();
    }

    public getServer() {
        return this.fastify;
    }

    public addSessionController() {}

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
        this.fastify.register(fastifyCookie);
        this.fastify.register(fastifySession, {
            secret: "secret with minimum length of 32 characters",
        });

        this.fastify.register(this.fastifyPassport.initialize());
        this.fastify.register(this.fastifyPassport.secureSession());

        // Registering strategies
        this.fastifyPassport.use("local", authenticationStrategies.local); 
    }

    private registerRoutes() {
        const router = new Router();
        for (const route of router.getAllRoutes()) {
            this.fastify.route(route);
        }
    }
}

export default Server;
