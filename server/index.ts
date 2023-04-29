import express from "express";
import next from "next";
import http from "http";
import socketIo from "socket.io";
import nodemailer from "nodemailer"

import chalk from "chalk";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../.env.local") });

// Declare the servers that we're gonna use
const app = express();
const nextApp = next({ dev: process.env.NODE_ENV == "development" });
const server = http.createServer(app);
const io = new socketIo.Server(server);

nextApp.prepare().then(() => {
    const handle = nextApp.getRequestHandler();

    // Load all the configuration
    require("./services/databases");
    require("./services/accounts");
    require("./services/upload");
    require("./services/messages");
    require("./services/users");
    require("./routes/router");

    app.get("*", (req: express.Request, res: express.Response) => {
        handle(req, res);
    });

    // Start the main server
    server.listen(process.env.PORT, () => {
        console.log(
            `${chalk.magenta("event")} - Server running in ${process.env.NODE_ENV == "development" ? "development" : "production"} mode at ${process.env.PORT}`
        );
    });
});

const emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS
    }
});


export { app, nextApp, server, io, emailTransporter };
