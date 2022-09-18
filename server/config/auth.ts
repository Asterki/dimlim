import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import path from "path";
import expressSession from "express-session";
import { v4 as uuidv4 } from "uuid";

import db from "../config/databases";
// import { sendEmail } from "../utils/email";
import { User } from "../types";
import { checkTFA } from "../utils/tfa";
import { app, launchArgs } from "..";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const FileStore = require("session-file-store")(expressSession);

// Session and login
// I can't believe I'm using json for storage, but I have to run all of this in the same server
const sessionsPath = launchArgs.dev == true ? "../../data/sessions" : "../../../data/sessions";
app.use(
    expressSession({
        secret: (process.env.SESSION_SECRET as string) || uuidv4(),
        resave: false,
        saveUninitialized: true,
        store: new FileStore({
            path: path.join(__dirname, sessionsPath),
            logFn: () => {
                return;
            },
        }),
        name: "session",
        cookie: {
            secure: (process.env.COOKIE_SECURE as string) == "true",
            maxAge: parseInt(process.env.COOKIE_MAX_AGE as string) || 604800000,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.serializeUser(async (sessionUser: any, done: any) => {
    const users = await db.get("users");
    const user = users.find((listUser: User) => sessionUser.userID == listUser.userID);

    if (!user) return done(null, false);
    else return done(null, user);
});

passport.deserializeUser(async (sessionUser: any, done: any) => {
    const users = await db.get("users");
    const user = users.find((listUser: User) => sessionUser.userID == listUser.userID);

    if (!user) return done(null, false);
    else return done(null, user);
});

passport.use(
    new passportLocal.Strategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
            session: true,
        },
        async (req: any, email: string, password: string, done: any) => {
            try {
                const users = await db.get("users");
                const user = users.find((listUser: User) => listUser.email.value == email);
                if (!user) return done(null, false, { message: "invalid-credentials" });

                // Compare passwords
                if (!bcrypt.compareSync(password, user.password)) return done(null, false, { message: "invalid-credentials" });

                // Verify if there's 2fa
                if (user.tfa.secret !== "") {
                    if (!req.body.tfaCode) return done(null, false, { message: "requires-tfa" });
                    if (typeof req.body.tfaCode !== "string") return done(null, false, { message: "invalid-tfa-code" });

                    const tfaResult = checkTFA(req.body.tfaCode, user, users);
                    if (tfaResult == "invalid-tfa-code") return done(null, false, { message: "invalid-tfa-code" });
                }

                // TODO: Mail the user when there's a new login

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

export {};
