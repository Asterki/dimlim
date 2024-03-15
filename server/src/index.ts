import Fastify, { FastifyInstance } from "fastify";

// Middleware
import cors from "@fastify/cors";

// Services
import Router from "./services/router";
import MongoDBClient from "./services/mongodb";
import SessionController from "./services/sessions";

import "dotenv/config";
import { Connection } from "mongoose";

class Server {
    // Server related
    fastify: FastifyInstance;
    port: number;

    // Services
    mongooseClient: Connection = new MongoDBClient(
        process.env.MONGODB_URI as string
    ).getClient();
    sessions: SessionController = new SessionController();
    router: Router = new Router();

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
        this.sessions.loadToServer(this.fastify);
        this.router.registerRoutes(this.fastify);

        this.fastify.listen({
            port: this.port,
        });
    }

    private loadMiddlewares() {
        this.fastify.register(cors, {});
    }
}

const dev = process.env.NODE_ENV !== "production";
const server = new Server(dev, 3000);
server.start();

export default Server;
