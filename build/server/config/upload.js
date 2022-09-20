"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.avatarUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const __1 = require("..");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDestination = __1.launchArgs.dev == true ? "../../data/avatars" : "../../../data/avatars";
        cb(null, path_1.default.join(__dirname, uploadDestination));
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user.userID}.png`);
    },
});
const avatarUpload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fieldSize: 8000000,
        files: 1,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg")
            return cb(null, true);
        return cb(new Error("invalid-file-type"));
    },
});
exports.avatarUpload = avatarUpload;
