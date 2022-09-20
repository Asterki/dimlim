"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportError = void 0;
const fs_1 = __importDefault(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const reportError = (errorToLog) => {
    // Generate the error ID
    const errorID = (0, uuid_1.v4)();
    // Get the logs in the file
    fs_1.default.readFile(path_1.default.join(__dirname, "../logs/errors.log"), (err, content) => {
        if (err)
            throw err;
        // Write new log
        fs_1.default.writeFile(path_1.default.join(__dirname, "../logs/errors.log"), `${content}Error Reported at ${new Date()}\nError ID: ${errorID}\n${errorToLog.stack}\n\n`, (err) => {
            if (err)
                throw err;
            console.log(`${chalk_1.default.red("error")} - New error, error ID: ${errorID}`);
        });
    });
    return errorID;
};
exports.reportError = reportError;
