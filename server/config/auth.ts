import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";

import db from "../config/databases";
import { sendEmail } from "../utils/email";
import { User } from "../types";
import { checkTFA } from "../utils/tfa";

passport.serializeUser((sessionUser: any, done: any) => {
    try {
        db.get("users", async (err: any, result: any) => {
            if (err) {
                if (err.type == "NotFoundError") {
                    db.put("users", JSON.stringify([]), (err: any) => {
                        if (err) return done(err);
                    });

                    return done(null, false);
                }

                return done(err);
            }

            let users = JSON.parse(result);
            let userFromDB: User = users.find((user: any) => user.email.value == sessionUser.email.value);

            if (!userFromDB) return done(null, false);
            else return done(null, userFromDB);
        });
    } catch (err) {
        throw err;
    }
});

passport.deserializeUser((sessionUser: any, done: any) => {
    try {
        db.get("users", async (err: any, result: any) => {
            if (err) {
                if (err.type == "NotFoundError") {
                    db.put("users", JSON.stringify([]), (err: any) => {
                        if (err) return done(err);
                    });

                    return done(null, false);
                }

                return done(err);
            }

            let users = JSON.parse(result);
            let userFromDB: User = users.find((user: any) => user.email.value == sessionUser.email.value);

            if (!userFromDB) return done(null, false);
            else return done(null, userFromDB);
        });
    } catch (err) {
        throw err;
    }
});

passport.use(
    new passportLocal.Strategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
            session: true,
        },
        (req: any, email: string, password: string, done: any) => {
            try {
                // Get from db and parse
                db.get("users", async (err: any, users: any) => {
                    if (err) {
                        if (err.type == "NotFoundError") {
                            db.put("users", JSON.stringify([]), (err: any) => {
                                if (err) return done(err);
                            });

                            return done(null, false, { message: "invalid-credentials" });
                        }

                        return done(err);
                    }

                    // Find if user exists
                    users = JSON.parse(users);
                    let user: User = users.find((user: any) => user.email.value == email);
                    if (!user) return done(null, false, { message: "invalid-credentials" });

                    // Compare passwords
                    if (!bcrypt.compareSync(password, user.password)) return done(null, false, { message: "invalid-credentials" });

                    // Verify if there's 2fa
                    if (user.tfa.secret !== "") {
                        if (!req.body.tfaCode) return done(null, false, { message: "requires-tfa" });
                        if (typeof req.body.tfaCode !== "string") return done(null, false, { message: "invalid-tfa-code" });

                        let tfaResult = checkTFA(req.body.tfaCode, user, users);
                        if (tfaResult == "invalid-tfa-code") return done(null, false, { message: "invalid-tfa-code" });
                    }

                    // TODO: Mail the user when there's a new login

                    return done(null, user);
                });
            } catch (err) {
                return done(err);
            }
        }
    )
);

export {};
