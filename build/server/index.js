"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchArgs = exports.io = exports.server = exports.nextApp = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const minimist_1 = __importDefault(require("minimist"));
const next_1 = __importDefault(require("next"));
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
// Get startup values from process.env and minimist's argument parsing
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({ path: path_1.default.join(__dirname, "../.env") });
const launchArgs = (0, minimist_1.default)(process.argv.slice(2), {
    string: ["port"],
    boolean: ["dev", "setup"],
    default: {
        dev: process.env.NODE_ENV !== "production" || true,
        port: process.env.PORT || 8080,
        setup: false,
    },
});
exports.launchArgs = launchArgs;
// If the launch is in setup mode, this can be deleted after the first run
if (launchArgs.setup == true) {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        // Initialize all values in the database
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const db = require("./config/databases").default;
        yield db.set("users", []);
        yield db.set("email-verification-codes", []);
        console.log(`${chalk_1.default.green("success")} - Everything has been set up, you can run the app by running ${chalk_1.default.bold("npm run start")}`);
        return process.exit();
    }))();
}
// Declare the servers that we're gonna use
const app = (0, express_1.default)();
exports.app = app;
const nextApp = (0, next_1.default)({ dev: JSON.parse(launchArgs.dev) });
exports.nextApp = nextApp;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.default.Server(server);
exports.io = io;
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
        console.log(`${chalk_1.default.magenta("event")} - Server running in ${launchArgs.dev == true ? "development" : "production"} mode at ${launchArgs.port}`);
    });
});
