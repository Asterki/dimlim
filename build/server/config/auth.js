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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const uuid_1 = require("uuid");
const databases_1 = __importDefault(require("../config/databases"));
const tfa_1 = require("../utils/tfa");
const __1 = require("..");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const FileStore = require("session-file-store")(express_session_1.default);
// Session and login
// I can't believe I'm using json for storage, but I have to run all of this in the same server
const sessionsPath = __1.launchArgs.dev == true ? "../../data/sessions" : "../../../data/sessions";
__1.app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || (0, uuid_1.v4)(),
    resave: false,
    saveUninitialized: true,
    store: new FileStore({
        path: path_1.default.join(__dirname, sessionsPath),
        logFn: () => {
            return;
        },
    }),
    name: "session",
    cookie: {
        secure: process.env.COOKIE_SECURE == "true",
        maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 604800000,
    },
}));
__1.app.use(passport_1.default.initialize());
__1.app.use(passport_1.default.session());
// Passport configuration
passport_1.default.serializeUser((sessionUser, done) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield databases_1.default.get("users");
    const user = users.find((listUser) => sessionUser.userID == listUser.userID);
    if (!user)
        return done(null, false);
    else
        return done(null, user);
}));
passport_1.default.deserializeUser((sessionUser, done) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield databases_1.default.get("users");
    const user = users.find((listUser) => sessionUser.userID == listUser.userID);
    if (!user)
        return done(null, false);
    else
        return done(null, user);
}));
passport_1.default.use(new passport_local_1.default.Strategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
    session: true,
}, (req, email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield databases_1.default.get("users");
        const user = users.find((listUser) => listUser.email.value == email);
        if (!user)
            return done(null, false, { message: "invalid-credentials" });
        // Compare passwords
        if (!bcrypt_1.default.compareSync(password, user.password))
            return done(null, false, { message: "invalid-credentials" });
        // Verify if there's 2fa
        if (user.tfa.secret !== "") {
            if (!req.body.tfaCode)
                return done(null, false, { message: "requires-tfa" });
            if (typeof req.body.tfaCode !== "string")
                return done(null, false, { message: "invalid-tfa-code" });
            const tfaResult = (0, tfa_1.checkTFA)(req.body.tfaCode, user, users);
            if (tfaResult == "invalid-tfa-code")
                return done(null, false, { message: "invalid-tfa-code" });
        }
        // TODO: Mail the user when there's a new login
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
})));
