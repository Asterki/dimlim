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
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const ms_1 = __importDefault(require("ms"));
const passport_1 = __importDefault(require("passport"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
const uuid_1 = require("uuid");
const databases_1 = __importDefault(require("../config/databases"));
const email_1 = require("../utils/email");
const __1 = require("..");
const error_1 = require("../utils/error");
const tfa_1 = require("../utils/tfa");
const locale_1 = require("../utils/locale");
const router = express_1.default.Router();
// Account creation and deletion
router.post("/register", (0, express_rate_limit_1.default)({
    windowMs: (0, ms_1.default)("1 hour"),
    max: __1.launchArgs.dev == true ? 100 : 30,
    statusCode: 200,
    message: {
        status: 429,
        message: "rate-limit-exceeded",
    },
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check that values are there and that they're the right type
    if (!req.body.email || !req.body.password || !req.body.username)
        return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.email !== "string" || typeof req.body.password !== "string" || typeof req.body.username !== "string")
        return res.send({ status: 400, message: "invalid-parameters" });
    try {
        const { email, password, username, lang } = req.body;
        // Validate that all fields meet the criteria
        if (!validator_1.default.isEmail(email))
            return res.send({ status: 400, message: "invalid-email" });
        if (password.length < 8 || password.length > 64)
            return res.send({ status: 400, message: "invalid-password" });
        if (username.length < 3 || username.length > 32 || !validator_1.default.isAlphanumeric(username, "en-US", { ignore: "." }))
            return res.send({ status: 400, message: "invalid-username" });
        // Get values from database and check if they're in use
        const users = yield databases_1.default.get("users");
        if (users.find((user) => user.email.value == email))
            return res.send({ status: 200, message: "email-already-in-use" });
        if (users.find((user) => user.username == username))
            return res.send({ status: 200, message: "username-already-in-use" });
        const makeId = (length) => {
            let result = "";
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        };
        // Create and push the user to the db
        const newUser = {
            userID: (0, uuid_1.v4)(),
            created: Date.now(),
            username: username.toLowerCase(),
            email: {
                value: email,
                verified: false,
            },
            avatar: "",
            bio: "",
            preferredLanguage: (0, locale_1.getLanguage)(lang),
            contacts: [],
            blockedContacts: [],
            password: bcrypt_1.default.hashSync(password, 10),
            chatSecret: (0, uuid_1.v4)(),
            encSecret: makeId(16),
            tfa: {
                secret: "",
                backupCodes: [],
                seenBackupCodes: false,
            },
        };
        users.push(newUser);
        databases_1.default.set("users", users);
        // Login the user
        req.login(newUser, (err) => {
            if (err)
                throw err;
            return res.send({ status: 200, message: "success" });
        });
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
}));
router.post("/delete-account", (0, express_rate_limit_1.default)({
    windowMs: (0, ms_1.default)("1 hour"),
    max: __1.launchArgs.dev == true ? 100 : 5,
    statusCode: 200,
    message: {
        status: 429,
        message: "rate-limit-exceeded",
    },
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Do auth and params checks
    if (!req.isAuthenticated())
        return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.password)
        return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.password !== "string")
        return res.send({ status: 400, message: "invalid-parameters" });
    try {
        // Get the user list
        const users = yield databases_1.default.get("users");
        const user = users.find((user) => user.userID == req.user.userID);
        if (!user)
            return res.send({ status: 400, message: "user-not-found" });
        // Check the password
        if (!bcrypt_1.default.compareSync(req.body.password, user.password))
            return res.send({ status: 403, message: "unauthorized" });
        // Check the tfa
        if (user.tfa.secret !== "") {
            if (!req.body.tfaCode)
                return res.send({ status: 400, message: "no-tfa-code" });
            const verified = speakeasy_1.default.totp.verify({
                secret: user.tfa.secret,
                encoding: "base32",
                token: req.body.tfaCode,
            });
            if (verified == false)
                return res.send({ status: 403, message: "invalid-tfa-code" });
        }
        // Delete the user and logout
        const newUserList = users.filter((user) => user.userID !== req.user.userID);
        req.logout((err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                throw err;
            yield databases_1.default.set("users", newUserList);
            return res.send({ status: 200, message: "success" });
        }));
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
}));
// Account access
router.post("/login", (0, express_rate_limit_1.default)({
    windowMs: (0, ms_1.default)("1 hour"),
    max: __1.launchArgs.dev == true ? 100 : 10,
    statusCode: 200,
    message: {
        status: 429,
        message: "rate-limit-exceeded",
    },
}), (req, res, next) => {
    // Check that values are there and that they're the right type
    if (!req.body.email || !req.body.password)
        return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.email !== "string" || typeof req.body.password !== "string")
        return res.send({ status: 400, message: "invalid-parameters" });
    try {
        // Auth using passport, see config/auth.ts for more reference on this
        passport_1.default.authenticate("local", (err, user, result) => {
            if (err)
                throw err;
            if (!user) {
                // Check if we didn't got the user because it requires a 2fa code
                if (result.message == "requires-tfa" || result.message == "invalid-tfa-code")
                    return res.send({ status: 200, message: result.message });
                return res.send({ status: 200, message: "invalid-credentials" });
            }
            // Login the user
            req.logIn(user, (err) => {
                if (err)
                    throw err;
                return res.send({ status: 200, message: "success" });
            });
        })(req, res, next);
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});
router.get("/logout", (0, express_rate_limit_1.default)({
    windowMs: (0, ms_1.default)("1 hour"),
    max: __1.launchArgs.dev == true ? 100 : 10,
    statusCode: 200,
    message: {
        status: 429,
        message: "rate-limit-exceeded",
    },
}), (req, res) => {
    if (!req.isAuthenticated())
        return res.redirect("/");
    try {
        // Logout
        req.logout((err) => {
            if (err)
                throw err;
            res.redirect("/");
        });
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});
// Email actions
router.post("/send-verification-email", (0, express_rate_limit_1.default)({
    windowMs: (0, ms_1.default)("1 hour"),
    max: __1.launchArgs.dev == true ? 100 : 3,
    statusCode: 200,
    message: {
        status: 429,
        message: "rate-limit-exceeded",
    },
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated())
        return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.lang)
        return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.lang !== "string")
        return res.send({ status: 400, message: "invalid-parameters" });
    try {
        const users = yield databases_1.default.get("users");
        const user = users.find((user) => user.email.value == req.user.email.value);
        if (!user)
            return res.send({ status: 400, message: "user-not-found" });
        if (user.email.verified == true)
            return res.send({ status: 200, message: "email-verified" });
        // Get the codes and filter out the old one
        const codes = yield databases_1.default.get("email-verification-codes");
        const newCodeList = codes.filter((code) => code.email !== req.user.email.value);
        // Generate the new code
        const newCode = {
            code: (0, uuid_1.v4)(),
            email: user === null || user === void 0 ? void 0 : user.email.value,
            expires: Date.now() + (0, ms_1.default)("5 hours"),
        };
        // Send the email
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const emailContent = require(`../../locales/emails/email-verification/${req.body.lang}`);
        yield (0, email_1.sendEmail)(user === null || user === void 0 ? void 0 : user.email.value, emailContent.subject, emailContent.html
            .replace(/{username}/g, user === null || user === void 0 ? void 0 : user.username)
            .replace(/{link}/g, `${process.env.HOST}/api/accounts/verify-email?code=${newCode.code}&email=${newCode.email}`));
        // Push changes to the db
        newCodeList.push(newCode);
        yield databases_1.default.set("email-verification-codes", newCodeList);
        return res.send({ status: 200, message: "success" });
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
}));
router.get("/verify-email", (0, express_rate_limit_1.default)({
    windowMs: (0, ms_1.default)("1 hour"),
    max: __1.launchArgs.dev == true ? 100 : 10,
    statusCode: 200,
    message: {
        status: 429,
        message: "rate-limit-exceeded",
    },
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.query.code || !req.query.email)
        return res.redirect("/");
    try {
        // Get code
        const codes = yield databases_1.default.get("email-verification-codes");
        const code = codes.find((listCode) => listCode.email == req.query.email);
        // Checks
        if (!code)
            return res.redirect("/");
        if (code.expires <= Date.now())
            return res.redirect("/accounts/verify-email?expired=true");
        if (code.code !== req.query.code)
            return res.redirect("/accounts/verify-email?invalid=true");
        // Get users
        const users = yield databases_1.default.get("users");
        const user = users.find((listUser) => listUser.email.value == (code === null || code === void 0 ? void 0 : code.email));
        // Update the user
        user.email.verified = true;
        const newUsersList = users.filter((listUser) => listUser.userID !== (user === null || user === void 0 ? void 0 : user.userID));
        // Remove the code from the database
        codes.filter((listCode) => listCode.code !== (code === null || code === void 0 ? void 0 : code.code));
        yield databases_1.default.set("email-verification-codes", codes);
        // Push to db
        newUsersList.push(user);
        yield databases_1.default.set("users", newUsersList);
        return res.redirect("/accounts/verify-email?=success=true");
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.redirect(`/error?code=500&id=${errorID}`);
    }
}));
// Password actions // TODO
// router.post("/reset-password", (_req: any, _res: any) => {});
// TFA related
router.post("/activate-tfa", (0, express_rate_limit_1.default)({
    windowMs: (0, ms_1.default)("1 hour"),
    max: __1.launchArgs.dev == true ? 100 : 1,
    statusCode: 200,
    message: {
        status: 429,
        message: "rate-limit-exceeded",
    },
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.isAuthenticated())
            return res.send({ status: 403, message: "unauthorized" });
        const users = yield databases_1.default.get("users");
        const user = users.find((user) => user.userID == req.user.userID);
        // Check if user exists, if so, check if tfa is already activated, and if email is verified
        if (!user)
            return res.send({ status: 400, message: "user-not-found" });
        if (user.tfa.secret !== "")
            return res.send({ status: 400, message: "tfa-already-activated" });
        if (user.email.verified == false)
            return res.send({ status: 400, message: "email-not-verified" });
        // Generate our secret
        const secret = speakeasy_1.default.generateSecret({ length: 20 });
        const newUserList = users.filter((user) => user.userID !== req.user.userID);
        user.tfa.secret = secret.base32;
        newUserList.push(user);
        // Generate the qr code
        qrcode_1.default.toDataURL(secret.otpauth_url, (err, image_data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                throw err;
            yield databases_1.default.set("users", newUserList);
            return res.send({
                status: 200,
                image: image_data,
                code: secret.base32,
            });
        }));
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
}));
router.post("/deactivate-tfa", (0, express_rate_limit_1.default)({
    windowMs: (0, ms_1.default)("1 hour"),
    max: __1.launchArgs.dev == true ? 100 : 5,
    statusCode: 200,
    message: {
        status: 429,
        message: "rate-limit-exceeded",
    },
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated())
        return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.tfaCode)
        return res.send({ code: 400, status: "missing-parameters" });
    if (typeof req.body.tfaCode !== "string")
        return res.send({ code: 400, message: "invalid-parameters" });
    try {
        const users = yield databases_1.default.get("users");
        const user = users.find((user) => user.userID == req.user.userID);
        // Checks
        if (!user)
            return res.send({ status: 400, message: "user-not-found" });
        if ((user === null || user === void 0 ? void 0 : user.tfa.secret) == "")
            return res.send({ status: 200, message: "tfa-not-active" });
        if (user.email.verified == false)
            return res.send({ status: 400, message: "email-not-verified" });
        // Check if the tfa code
        const tfaResult = (0, tfa_1.checkTFA)(req.body.tfaCode, user, users);
        if (tfaResult == "invalid-tfa-code")
            return res.send({ status: 200, message: "invalid-tfa-code" });
        // Remove the secret, and replace the user in the DB with the new user without the secret
        user.tfa.secret = "";
        user.tfa.backupCodes = [];
        user.tfa.seenBackupCodes = false;
        const newUserList = users.filter((listUser) => listUser.email !== (user === null || user === void 0 ? void 0 : user.email));
        // Push changes to the DB
        newUserList.push(user);
        yield databases_1.default.set("users", newUserList);
        return res.status(200).send({
            status: 200,
            message: "success",
        });
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
}));
router.post("/verify-tfa", (0, express_rate_limit_1.default)({
    windowMs: (0, ms_1.default)("1 hour"),
    max: __1.launchArgs.dev == true ? 100 : 5,
    statusCode: 200,
    message: {
        status: 429,
        message: "rate-limit-exceeded",
    },
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated())
        return res.send({ code: 403, message: "unauthorized" });
    if (!req.body.code)
        return res.send({ code: 400, message: "missing-parameters" });
    if (typeof req.body.code !== "string")
        res.send({ code: 400, message: "invalid-parameters" });
    try {
        const users = yield databases_1.default.get("users");
        const user = users.find((user) => user.userID == req.user.userID);
        // Check if user exists
        if (!user)
            return res.send({ code: 400, message: "user-not-found" });
        if (user.tfa.secret == "")
            return res.send({ code: 400, message: "tfa-not-active" });
        // I'll leave this like this, because we don't want the user to use a backup code instead of the code provided by the tfa app
        const verified = speakeasy_1.default.totp.verify({
            secret: user.tfa.secret,
            encoding: "base32",
            token: req.body.code,
        });
        if (verified == false)
            return res.send({ status: 400, message: "invalid-tfa-code" });
        if (user.tfa.seenBackupCodes == true)
            return res.send({ code: 200, message: "backup-codes-seen" });
        // Generate codes
        const codeList = [];
        for (let i = 0; i < 10; i++) {
            codeList.push(Math.random().toString(16).slice(2, 10));
        }
        // Hash codes
        const hashedCodes = [];
        codeList.forEach((code) => {
            hashedCodes.push(bcrypt_1.default.hashSync(code, 10));
        });
        // Replace the old user with the new user
        const newUserList = users.filter((listUser) => listUser.userID !== (user === null || user === void 0 ? void 0 : user.userID));
        user.tfa.backupCodes = hashedCodes;
        user.tfa.seenBackupCodes = true;
        // Push to the DB
        newUserList.push(user);
        yield databases_1.default.set("users", newUserList);
        return res.send({ status: 200, message: "success", codes: codeList });
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
}));
// Tests
router.post("/check-use", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check that values are there and that they're the right type
    if (!req.body.email || !req.body.username)
        return res.send({ status: 400, message: "missing-params" });
    if (typeof req.body.email !== "string" || typeof req.body.username !== "string")
        return res.send({ status: 400, message: "invalid-error" });
    try {
        // Get from db
        const users = yield databases_1.default.get("users");
        // Checks
        if (users.find((user) => user.email.value == req.body.email))
            return res.send({ status: 200, message: "email-already-in-use" });
        if (users.find((user) => user.username == req.body.username))
            return res.send({ status: 200, message: "username-already-in-use" });
        return res.send({ status: 200, message: "all-good" });
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
}));
router.get("/test-auth", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield databases_1.default.set("users", []);
    res.send("ha");
}));
module.exports = router;
