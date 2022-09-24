import express from "express";
import minimist from "minimist";
import next from "next";
import chalk from "chalk";
import path from "path";
import http from "http";
import socketIo from "socket.io";

// Get startup values from process.env and minimist's argument parsing
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const launchArgs = minimist(process.argv.slice(2), {
    string: ["port"],
    boolean: ["dev", "setup"],

    default: {
        dev: process.env.NODE_ENV !== "production" || true,
        port: process.env.PORT || 8080,
        setup: false,
    },
});

// If the launch is in setup mode, this can be deleted after the first run
if (launchArgs.setup == true) {
    (async () => {
        // Initialize all values in the database
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const db = require("./config/databases").default;

        await db.set("users", []);
        await db.set("email-verification-codes", []);

        console.log(`${chalk.green("success")} - Everything has been set up, you can run the app by running ${chalk.bold("npm run start")}`);
        return process.exit();
    })();
}

// Declare the servers that we're gonna use
const app = express();
const nextApp = next({ dev: JSON.parse(launchArgs.dev) });
const server = http.createServer(app);
const io = new socketIo.Server(server);

console.log(launchArgs)

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
        console.log(`${chalk.magenta("event")} - Server running in ${launchArgs.dev == true ? "development" : "production"} mode at ${launchArgs.port}`);
    });
});

export { app, nextApp, server, io, launchArgs };
