import express from "express";
import minimist from "minimist";
import next from "next";
import chalk from "chalk";
import path from "path";
import http from "http";
import socketIo from "socket.io";

// Get startup values from process.env and minimist's argument parsing
require("dotenv").config({ path: path.join(__dirname, "../.env") });
let launchArgs = minimist(process.argv.slice(2), {
    string: ["dev", "port"],

    default: {
        dev: process.env.NODE_ENV !== "production" || "true",
        port: process.env.PORT || 8080,
    },
});

// Declare the servers that we're gonna use
const app = express();
const nextApp = next({ dev: JSON.parse(launchArgs.dev) });
const server = http.createServer(app);
const io = new socketIo.Server(server);

nextApp.prepare().then(() => {
    const handle = nextApp.getRequestHandler();

    // Load all the configuration
    require("./config/middleware");
    require("./config/auth");
    require("./config/routes");
    require("./config/databases");
    require("./api/sockets");

    app.get("*", (req, res) => {
        handle(req, res);
    });

    // Start the main server
    server.listen(launchArgs.port, () => {
        console.log(
            `${chalk.magenta("event")} - Server running in ${
                launchArgs.dev == "true" ? "development" : "production"
            } mode at ${launchArgs.port}`
        );
    });
});

export { app, nextApp, server, io, launchArgs };
