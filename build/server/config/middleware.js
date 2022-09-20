"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const serve_favicon_1 = __importDefault(require("serve-favicon"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const chalk_1 = __importDefault(require("chalk"));
const index_1 = require("../index");
try {
    index_1.app.disable("x-powered-by");
    index_1.app.set("trust proxy", 1);
    // Requests
    index_1.app.use(body_parser_1.default.urlencoded({ extended: true }));
    index_1.app.use(body_parser_1.default.json());
    index_1.app.use((0, cookie_parser_1.default)());
    index_1.app.use((0, compression_1.default)());
    // Static content
    const avatarsPath = index_1.launchArgs.dev == true ? "../../data/avatars" : "../../../data/avatars";
    index_1.app.use((0, serve_favicon_1.default)(path_1.default.join(__dirname, "../../public/favicon.ico")));
    index_1.app.use("/assets/", express_1.default.static(path_1.default.join(__dirname, "../../src/assets")));
    index_1.app.use("/avatars/", express_1.default.static(path_1.default.join(__dirname, avatarsPath)));
    // Security, which is disabled in development mode
    if (index_1.launchArgs.dev !== true) {
        index_1.app.use(helmet_1.default.contentSecurityPolicy());
        index_1.app.use(helmet_1.default.crossOriginEmbedderPolicy({ policy: "require-corp" }));
        index_1.app.use(helmet_1.default.crossOriginOpenerPolicy({ policy: "same-origin" }));
        index_1.app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "same-origin" }));
        index_1.app.use(helmet_1.default.dnsPrefetchControl({
            allow: false,
        }));
        index_1.app.use(helmet_1.default.expectCt({
            maxAge: 0,
        }));
        index_1.app.use(helmet_1.default.frameguard({
            action: "sameorigin",
        }));
        index_1.app.use(helmet_1.default.hsts({
            maxAge: 15552000,
            includeSubDomains: true,
        }));
        index_1.app.use(helmet_1.default.permittedCrossDomainPolicies({
            permittedPolicies: "none",
        }));
        index_1.app.use(helmet_1.default.referrerPolicy({
            policy: "no-referrer",
        }));
        index_1.app.use(helmet_1.default.ieNoOpen());
        index_1.app.use(helmet_1.default.hidePoweredBy());
        index_1.app.use(helmet_1.default.noSniff());
        index_1.app.use(helmet_1.default.originAgentCluster());
        index_1.app.use(helmet_1.default.xssFilter());
    }
    console.log(`${chalk_1.default.cyanBright("info ")} - Middleware loaded`);
}
catch (err) {
    console.log(`${chalk_1.default.redBright("error")} - There was an error loading the middleware`);
    console.log(err);
}
