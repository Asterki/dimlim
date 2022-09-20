"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressFile = void 0;
const zlib_1 = __importDefault(require("zlib"));
const fs_1 = __importDefault(require("fs"));
const compressFile = (location) => {
    const fileStream = fs_1.default.createReadStream(location);
    fileStream.pipe(zlib_1.default.createGzip()).pipe(fs_1.default.createWriteStream(`${location}.gz`));
};
exports.compressFile = compressFile;
