import Fastify, { FastifyInstance } from "fastify";
import { Authenticator } from "@fastify/passport";

// Middleware
import cors from "@fastify/cors";

// Services
import Router from "./services/router";
import MongoDBClient from "./services/mongodb"
import SessionController from "./services/sessions";

import 'dotenv/config'
import { Connection } from 'mongoose';

class Server {
    // Server related
    fastify: FastifyInstance;
    fastifyPassport!: Authenticator;
    port: number;

    // Database
    mongooseClient: Connection;

    constructor(dev: boolean, port: number) {
        this.fastify = Fastify({
            logger: dev,
        });
        this.port = port;
        this.mongooseClient = new MongoDBClient(process.env.MONGODB_URI as string).getClient();
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

const dev = process.env.NODE_ENV !== "production";
const server = new Server(dev, 3000)
server.start()

export default Server;
