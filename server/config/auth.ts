import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy";

import db from "../config/databases";
import { User } from "../types";

passport.serializeUser((user: any, done: any) => {
    return done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
    return done(null, user);
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
                    const user: User = users.find((user: any) => user.email.value == email);
                    if (!user) {
                        return done(null, false, { message: "invalid-credentials" });
                    }

                    // Compare passwords
                    if (!bcrypt.compareSync(password, user.password)) {
                        return done(null, false, { message: "invalid-credentials" });
                    }

                    // Verify if there's 2fa
                    if (user.tfaSecret !== "") {
                        if (!req.body.tfaCode) return done(null, false, { message: "requires-tfa" });
                        else {
                            let verified = speakeasy.totp.verify({
                                secret: user.tfaSecret,
                                encoding: "base32",
                                token: req.body.tfaCode,
                            });

                            if (verified == false) return done(null, false, { message: "invalid-tfa-code" })
                        }
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
