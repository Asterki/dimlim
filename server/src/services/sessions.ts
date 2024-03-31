import { FastifyInstance, FastifyRequest } from "fastify";

import fastifySession from "@fastify/session";
import MongoStore from "connect-mongo";

import bcrypt from "bcrypt";
import speakeasy from "speakeasy";

import mongoose from "mongoose";
import UserModel from "../models/users";

import { User } from "../../../shared/types/models";

class SessionController {
    private instance: SessionController | null = null;
    authenticationStrategies: {
        local: (request: FastifyRequest) => Promise<any>;
    };
    // fastifyPassport: Authenticator;

    public getInstance() {
        if (!this.instance) this.instance = new SessionController();
        return this.instance;
    }

    constructor() {
        // this.fastifyPassport = new Authenticator();
        this.authenticationStrategies = {
            local: async (request) => {
                try {
                    const { emailOrUsername, password, tfaCode } = request.body as {
                        emailOrUsername: string;
                        password: string;
                        tfaCode?: string;
                    };

                    const user: (User & Document) | null = await UserModel.findOne({
                        $or: [{ "email.value": emailOrUsername }, { username: emailOrUsername }],
                    });
                    if (!user) return { message: "invalid-credentials" };

                    // Verify password and TFA code
                    if (!bcrypt.compareSync(password, user.password)) return { message: "invalid-credentials" };
                    if (user.tfa.secret !== "") {
                        if (!tfaCode) return { message: "tfa-required" };
                        const verified = speakeasy.totp.verify({
                            secret: user.tfa.secret,
                            encoding: "base32",
                            token: tfaCode,
                        });

                        if (verified == false) return { message: "invalid-tfa" };
                    }

                    return { user, err: null, message: "success" };
                } catch (err: unknown) {
                    return { user: null, err: err as Error, message: "internal-error" };
                }
            },
        };
    }

    public authenticate(strategy: "local", request: FastifyRequest) {
        return this.authenticationStrategies[strategy](request);
    }

    public login(user: any, request: FastifyRequest) {
        (request.session as any).user = user;
    }

    public logout(request: FastifyRequest) {
        request.session.destroy();
    }

    public async serializeUser(user: any) {
        return user.userID;
    }

    public async deserializeUser(id: string) {
        return await UserModel.findOne({ userID: id });
    }

    public loadToServer(server: FastifyInstance) {
        this.loadMiddleware(server);
    }

    public loadMiddleware(server: FastifyInstance) {
        server.register(fastifySession, {
            secret: process.env.SESSION_SECRET as string,
            cookieName: "session",
            cookie: {
                secure: false,
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: true,
                path: "/",
            },
            saveUninitialized: false,
            store: MongoStore.create({
                mongoUrl: process.env.MONGODB_URI as string,
                // dbName: "sessions",
                collectionName: "sessions",
                autoRemove: 'disabled'
            }),
        });

        server.addHook("preHandler", (request, reply, next) => {
            console.log(request.session)

            next();
        });
    }
}

export default SessionController;
