import { FastifyInstance } from "fastify";
import { Authenticator } from "@fastify/passport";
import { Strategy as LocalStrategy } from "passport-local";

import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";

import bcrypt from "bcrypt";
import speakeasy from "speakeasy";

import UserModel from "../models/users";

import { User } from "../../../shared/types/models";

class SessionController {
    private instance: SessionController | null = null;
    authenticationStrategies: {
        local: LocalStrategy;
    };
    fastifyPassport: Authenticator;

    public getInstance() {
        if (!this.instance) this.instance = new SessionController();
        return this.instance;
    }

    constructor() {
        this.fastifyPassport = new Authenticator();
        this.authenticationStrategies = {
            local: new LocalStrategy(
                {
                    usernameField: "emailOrUsername",
                    passwordField: "password",
                    passReqToCallback: true,
                    session: false,
                },
                async (req: any, _email: string, _password: string, done) => {
                    try {
                        console.log(req.body);
                        const user: (User & Document) | null = await UserModel.findOne({
                            $or: [{ "email.value": req.body.emailOrUsername }, { username: req.body.emailOrUsername }],
                        });
                        if (!user) return done(null, false, { message: "invalid-credentials" });

                        // Verify password and TFA code
                        if (!bcrypt.compareSync(req.body.password, user.password))
                            return done(null, false, { message: "invalid-credentials" });

                        // if (user.tfa.secret !== "") {
                        //     if (!req.body.tfaCode) return done(null, false, { message: "requires-tfa" });

                        //     const verified = speakeasy.totp.verify({
                        //         secret: user.tfa.secret,
                        //         encoding: "base32",
                        //         token: req.body.tfaCode,
                        //     });

                        //     if (verified == false) return done(null, false, { message: "invalid-tfa-code" });
                        // }

                        return done(null, user);
                    } catch (err: unknown) {
                        return done(err);
                    }
                }
            ),
        };
    }

    public getPassport() {
        return this.fastifyPassport;
    }

    public loadToServer(server: FastifyInstance) {
        this.loadMiddleware(server);
        this.addStrategies();
    }

    public addStrategies() {
        this.fastifyPassport.use("local", this.authenticationStrategies.local);
    }

    public loadMiddleware(server: FastifyInstance) {
        server.register(fastifyCookie);
        server.register(fastifySession, {
            secret: process.env.SESSION_SECRET as string,
        });

        server.register(this.fastifyPassport.initialize());
        server.register(this.fastifyPassport.secureSession());
    }
}

export default SessionController;
