"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
const chalk_1 = __importDefault(require("chalk"));
const index_1 = require("../index");
Object.defineProperty(exports, "app", { enumerable: true, get: function () { return index_1.app; } });
try {
    index_1.app.use("/api/content", require("../api/content"));
    index_1.app.use("/api/accounts", require("../api/accounts"));
    index_1.app.use("/api/users", require("../api/users"));
    index_1.app.use("/api/messages", require("../api/messages"));
    index_1.app.use("/api/upload", require("../api/upload"));
    console.log(`${chalk_1.default.cyanBright("info ")} - Routes loaded`);
}
catch (err) {
    console.log(`${chalk_1.default.redBright("error ")} - There was an error loading the routes`);
    console.log(err);
}
