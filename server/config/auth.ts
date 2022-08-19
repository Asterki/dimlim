import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";

import db from "../config/databases";

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

                    users = JSON.parse(users);

                    const user = users.find((user: any) => user.email.value == email);
                    if (!user) {
                        return done(null, false, { message: "invalid-credentials" });
                    }

                    if (!bcrypt.compareSync(password, user.password)) {
                        return done(null, false, { message: "invalid-credentials" });
                    }

                    return done(null, user);
                });
            } catch (err) {
                return done(err);
            }
        }
    )
);

export {};
