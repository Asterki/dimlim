import { FastifyInstance } from "fastify";
import { Authenticator } from "@fastify/passport";

import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";

import { Strategy as LocalStrategy } from "passport-local";

import UserModel from "../models/users";

class SessionController {
    authenticationStrategies: {
        local: LocalStrategy;
    };
    fastifyPassport: Authenticator;

    constructor() {
        this.fastifyPassport = new Authenticator();
        this.authenticationStrategies = {
            local: new LocalStrategy(
                {
                    usernameField: "email",
                    passwordField: "password",
                    passReqToCallback: true,
                    session: true,
                },
                async (req: express.Request, _email: string, _password: string, done) => {
                    try {
                        const user: (User & Document) | null = await UserModel.findOne({
                            $or: [{ "email.value": req.body.email }, { username: req.body.email }],
                        });
                        if (!user) return done(null, false, { message: "invalid-credentials" });

                        // Verify password and TFA code
                        if (!bcrypt.compareSync(req.body.password, user.password))
                            return done(null, false, { message: "invalid-credentials" });
                        if (user.tfa.secret !== "") {
                            if (!req.body.tfaCode) return done(null, false, { message: "requires-tfa" });

                            const verified = speakeasy.totp.verify({
                                secret: user.tfa.secret,
                                encoding: "base32",
                                token: req.body.tfaCode,
                            });

                            if (verified == false) return done(null, false, { message: "invalid-tfa-code" });
                        }

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
            secret: "secret with minimum length of 32 characters",
        });

        server.register(this.fastifyPassport.initialize());
        server.register(this.fastifyPassport.secureSession());
    }
}

export default SessionController;
