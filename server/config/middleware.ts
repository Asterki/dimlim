// Dependencies
import path from "path";
import express from "express"
import favicon from "serve-favicon";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import compression from "compression";
import passport from "passport";

import chalk from "chalk";

import { app } from "../index";

try {
    app.disable("x-powered-by");
    app.set("trust proxy", 1);

    // Requests
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(compression());

    // Static content
    app.use(favicon(path.join(__dirname, "../../public/favicon.ico")));
    app.use("/assets/", express.static(path.join(__dirname, "../../src/assets")))

    // Session and login
    app.use(
        session({
            secret: process.env.SESSION_SECRET as string,
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false },
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    console.log(`${chalk.cyanBright("info ")} - Middleware loaded`);
} catch (err) {
    console.log(`${chalk.redBright("error")} - There was an error loading the middleware`);
    console.log(err);
}

export {};
