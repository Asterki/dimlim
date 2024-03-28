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
        this.checkEnv();
        this.fastify = Fastify({
            logger: dev,
        });
        this.port = port;
    }

    public getServer() {
        return this.fastify;
    }

    async startServer() {
        this.loadMiddlewares();
        this.sessions.loadToServer(this.fastify);
        this.router.registerRoutes(this.fastify);

        this.fastify.listen({
            port: this.port,
        });
    }

    private checkEnv() {
        const requiredKeys = ["MONGODB_URI", "SESSION_SECRET"];
        for (const key of requiredKeys) {
            if (!process.env[key]) {
                throw new Error(`Missing environment variable: ${key}`);
            }
        }
    }

    private loadMiddlewares() {
        this.fastify.register(cors, {
            origin: "*",
        });
    }
}

const dev = process.env.NODE_ENV !== "production";
const server = new Server(dev, 3000);
server.startServer();

export default Server;
