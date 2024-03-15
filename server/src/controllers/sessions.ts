import { FastifyInstance } from "fastify";
import { Authenticator } from "@fastify/passport";

import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";

import { Strategy as LocalStrategy } from "passport-local";

class SessionController {
    authenticationStrategies: {
        local: LocalStrategy;
    };
    fastifyPassport: Authenticator;

    constructor() {
        this.fastifyPassport = new Authenticator();
        this.authenticationStrategies = {
            local: new LocalStrategy(
                (username: string, password: string, done) => {
                    //   User.findOne({ username: username }, function (err, user) {
                    //     if (err) { return done(err); }
                    //     if (!user) { return done(null, false); }
                    //     if (!user.verifyPassword(password)) { return done(null, false); }
                    //     return done(null, user);
                    //   });
                }
            ),
        };
    }

    public getPassport() {
        return this.fastifyPassport;
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
