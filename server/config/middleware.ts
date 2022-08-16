// Dependencies
import path from "path";
import favicon from "serve-favicon";
import helmet from "helmet";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import compression from "compression";

import chalk from "chalk";

import { app } from "../index";

// Requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());

// Static content
app.use(favicon(path.join(__dirname, "../../public/favicon.ico")));

// Security
// app.use(helmet());

// Session and login
// app.use(
// 	session({
// 		secret: 'keyboard cat',
// 		resave: false,
// 		saveUninitialized: true,
// 		cookie: { secure: true },
// 	})
// );

console.log(`${chalk.cyanBright("info ")} - Middleware loaded`);

export {};
