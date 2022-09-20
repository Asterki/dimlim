"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const quick_db_1 = require("quick.db");
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const __1 = require("..");
let db;
try {
    // Start the database
    const dbPath = __1.launchArgs.dev == true ? "../../data/db.sqlite" : "../../../data/db.sqlite";
    db = new quick_db_1.QuickDB({ filePath: path_1.default.join(__dirname, dbPath) });
    console.log(`${chalk_1.default.magenta("event")} - Database connected and ready to use`);
}
catch (err) {
    console.log(`${chalk_1.default.redBright("error")} - There was an error connecting to the database`);
    console.log(err);
}
exports.default = db;
