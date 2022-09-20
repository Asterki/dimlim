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
const ms_1 = __importDefault(require("ms"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const error_1 = require("../utils/error");
const databases_1 = __importDefault(require("../config/databases"));
const __1 = require("..");
const tfa_1 = require("../utils/tfa");
const router = express_1.default.Router();
// Settings
router.post("/change-email", (0, express_rate_limit_1.default)({
    windowMs: (0, ms_1.default)("1 hour"),
    max: __1.launchArgs.dev == true ? 100 : 1,
    statusCode: 200,
    message: {
        status: 429,
        message: "rate-limit-exceeded",
    },
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated())
        return res.send("unauthorized");
    if (!req.body.password || !req.body.newEmail)
        return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.password !== "string" || typeof req.body.newEmail !== "string" || !validator_1.default.isEmail(req.body.newEmail))
        return res.send({ status: 400, message: "invalid-parameters" });
    try {
        const users = yield databases_1.default.get("users");
        const user = users.find((user) => user.userID == req.user.userID);
        if (!user)
            return res.send({ status: 400, message: "user-not-found" });
        if (users.find((user) => user.email.value == req.body.email))
            return res.send({ status: 200, message: "email-already-in-use" });
        // Replace the user
        const newUserList = users.filter((listUser) => listUser.userID !== (user === null || user === void 0 ? void 0 : user.userID));
        user.email = { value: req.body.newEmail, verified: false };
        newUserList.push(user);
        yield databases_1.default.set("users", newUserList);
        return res.send({ status: 200, message: "success" });
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
}));
router.post("/set-language", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated())
        return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.newLanguage)
        return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.newLanguage !== "string")
        return res.send({ status: 400, message: "invalid-parameters" });
    try {
        const users = yield databases_1.default.get("users");
        const user = users.find((user) => user.userID == req.user.userID);
        if (!user)
            return res.send({ status: 400, message: "user-not-found" });
        if (users.find((user) => user.email.value == req.body.email))
            return res.send({ status: 200, message: "email-already-in-use" });
        // Replace the user
        const newUserList = users.filter((listUser) => listUser.userID !== (user === null || user === void 0 ? void 0 : user.userID));
        user.preferredLanguage = req.body.newLanguage;
        newUserList.push(user);
        yield databases_1.default.set("users", newUserList);
        return res.send({ status: 200, message: "success" });
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
}));
router.post("/set-bio", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated())
        return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.newBio)
        return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.newBio !== "string")
        return res.send({ status: 400, message: "invalid-parameters" });
    try {
        const users = yield databases_1.default.get("users");
        const user = users.find((user) => user.userID == req.user.userID);
        if (!user)
            return res.send({ status: 400, message: "user-not-found" });
        if (users.find((user) => user.email.value == req.body.email))
            return res.send({ status: 200, message: "email-already-in-use" });
        // Replace the user
        const newUserList = users.filter((listUser) => listUser.userID !== (user === null || user === void 0 ? void 0 : user.userID));
        user.bio = req.body.newBio;
        newUserList.push(user);
        yield databases_1.default.set("users", newUserList);
        return res.send({ status: 200, message: "success" });
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
}));
router.post("/change-password", (0, express_rate_limit_1.default)({
    windowMs: (0, ms_1.default)("1 hour"),
    max: __1.launchArgs.dev == true ? 100 : 5,
    statusCode: 200,
    message: {
        status: 429,
        message: "rate-limit-exceeded",
    },
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated)
        return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.oldPassword || !req.body.newPassword)
        return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.oldPassword !== "string" ||
        typeof req.body.newPassword !== "string" ||
        req.body.newPassword.length < 8 ||
        req.body.newPassword.length > 256)
        return res.send({ status: 400, message: "invalid-parameters" });
    try {
        const users = yield databases_1.default.get("users");
        const user = users.find((user) => user.email.value == req.user.email.value);
        if (!user)
            return res.send({ status: 400, message: "user-not-found" });
        // Check if the user exists, and also if password is right
        if (!user)
            return res.send({ status: 400, message: "user-not-found" });
        if (!bcrypt_1.default.compareSync(req.body.oldPassword, user.password))
            return res.send({ status: 403, message: "unauthorized" });
        // Check tfa is provided
        if (user.tfa.secret !== "") {
            if (!req.body.tfaCode)
                return res.send({ status: 200, message: "requires-tfa" });
            if (typeof req.body.tfaCode !== "string")
                return res.send({ status: 200, message: "invalid-tfa-code" });
            const tfaResult = (0, tfa_1.checkTFA)(req.body.tfaCode, user, users);
            if (tfaResult == "invalid-tfa-code")
                return res.send({ status: 200, message: "invalid-tfa-code" });
        }
        // Checks
        // Replace the user with the user with the new password
        const newUserList = users.filter((listUser) => listUser.userID !== (user === null || user === void 0 ? void 0 : user.userID));
        user.password = bcrypt_1.default.hashSync(req.body.newPassword, 10);
        // Push to db
        newUserList.push(user);
        yield databases_1.default.set("users", newUserList);
        return res.send({ status: 200, message: "success" });
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
}));
// Contacts
router.post("/add-contact", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated())
        return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.contact)
        return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.contact !== "string")
        return res.send({ status: 400, message: "invalid-parameters" });
    if (req.body.contact == req.user.username)
        return res.send({ status: 400, message: "self-add" });
    try {
        const users = yield databases_1.default.get("users");
        const user = users.find((user) => user.userID == req.user.userID);
        const userToAdd = users.find((listUser) => listUser.username == req.body.contact);
        if (!userToAdd || !user)
            return res.send({ status: 400, message: "user-not-found" });
        if ((user === null || user === void 0 ? void 0 : user.contacts.find((listUser) => {
            return listUser.username.toLowerCase() == req.body.contact.toLowerCase();
        })) !== undefined)
            return res.send({ status: 400, message: "already-on-list" });
        if (!userToAdd)
            return res.send({ status: 400, message: "user-not-found" });
        const newUserList = users.filter((user) => user.userID !== req.user.userID);
        newUserList.filter((user) => user.userID !== (userToAdd === null || userToAdd === void 0 ? void 0 : userToAdd.userID));
        // Remove old users
        user === null || user === void 0 ? void 0 : user.contacts.push({ username: userToAdd.username, userID: userToAdd.userID });
        userToAdd === null || userToAdd === void 0 ? void 0 : userToAdd.contacts.push({ username: user === null || user === void 0 ? void 0 : user.username, userID: user === null || user === void 0 ? void 0 : user.userID });
        // Reload the main page to the other user if they're online
        __1.io.sockets.to(userToAdd.userID).emit("reload");
        newUserList.push(user);
        newUserList.push(userToAdd);
        databases_1.default.set("users", newUserList);
        return res.send({ status: 200, message: "success" });
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
}));
router.post("/remove-contact", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated())
        return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.contact)
        return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.contact !== "string")
        return res.send({ status: 400, message: "invalid-parameters" });
    try {
        const users = yield databases_1.default.get("users");
        const user = users.find((user) => user.userID == req.user.userID);
        const userToRemove = users.find((listUser) => listUser.username == req.body.contact);
        if (!userToRemove || !user)
            return res.send({ status: 400, message: "user-not-found" });
        // Remove old users
        const newUserList = users.filter((user) => user.userID !== req.user.userID);
        newUserList.filter((user) => user.userID !== (userToRemove === null || userToRemove === void 0 ? void 0 : userToRemove.userID));
        const newUserContactList = user === null || user === void 0 ? void 0 : user.contacts.filter((listUser) => {
            return listUser.userID !== (userToRemove === null || userToRemove === void 0 ? void 0 : userToRemove.userID);
        });
        const newUserToRemoveContactList = userToRemove === null || userToRemove === void 0 ? void 0 : userToRemove.contacts.filter((listUser) => {
            return listUser.userID !== (user === null || user === void 0 ? void 0 : user.userID);
        });
        if (!user)
            return; // To make typescript happy
        user.contacts = newUserContactList;
        userToRemove.contacts = newUserToRemoveContactList;
        // Reload the main page to the other user if they're online
        __1.io.sockets.to(userToRemove.userID).emit("reload");
        newUserList.push(user);
        newUserList.push(userToRemove);
        databases_1.default.set("users", newUserList);
        return res.send({ status: 200, message: "success" });
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
}));
router.post("/block-contact", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated())
        return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.contact)
        return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.contact !== "string")
        return res.send({ status: 400, message: "invalid-parameters" });
    try {
        const users = yield databases_1.default.get("users");
        const user = users.find((user) => user.userID == req.user.userID);
        const userToAdd = users.find((listUser) => listUser.username == req.body.contact);
        if (!userToAdd || !user)
            return res.send({ status: 400, message: "user-not-found" });
        const newUserList = users.filter((user) => user.userID !== req.user.userID);
        if (!user)
            return; // To make typescript happy
        user.contacts = user === null || user === void 0 ? void 0 : user.contacts.filter((listUser) => {
            return listUser.username !== req.body.contact;
        });
        user === null || user === void 0 ? void 0 : user.blockedContacts.push({ username: userToAdd === null || userToAdd === void 0 ? void 0 : userToAdd.username, userID: userToAdd === null || userToAdd === void 0 ? void 0 : userToAdd.userID });
        newUserList.push(user);
        databases_1.default.set("users", newUserList);
        return res.send({ status: 200, message: "success" });
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
}));
router.post("/unblock-contact", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated())
        return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.contact)
        return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.contact !== "string")
        return res.send({ status: 400, message: "invalid-parameters" });
    try {
        const users = yield databases_1.default.get("users");
        const user = users.find((user) => user.userID == req.user.userID);
        const userToAdd = users.find((listUser) => listUser.username == req.body.contact);
        if (!userToAdd || !user)
            return res.send({ status: 400, message: "user-not-found" });
        const newUserList = users.filter((user) => user.userID !== req.user.userID);
        if (!user)
            return; // To make typescript happy
        user.blockedContacts = user === null || user === void 0 ? void 0 : user.contacts.filter((listUser) => {
            return listUser.username !== req.body.contact;
        });
        user === null || user === void 0 ? void 0 : user.contacts.push({ username: userToAdd === null || userToAdd === void 0 ? void 0 : userToAdd.username, userID: userToAdd === null || userToAdd === void 0 ? void 0 : userToAdd.userID });
        newUserList.push(user);
        databases_1.default.set("users", newUserList);
        return res.send({ status: 200, message: "success" });
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
}));
router.post("/get-key", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated())
        return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.contact || !req.body.user)
        return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.contact !== "string" || typeof req.body.user !== "string")
        return res.send({ status: 400, message: "invalid-parameters" });
    try {
        const users = yield databases_1.default.get("users");
        const user = users.find((listUser) => listUser.username == req.body.user);
        const userToFind = users.find((listUser) => listUser.username == req.body.contact);
        if (!userToFind || !user)
            return res.send({ status: 400, message: "user-not-found" });
        res.send({ status: 200, message: [userToFind.encSecret, user.encSecret].sort().join("") });
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
}));
module.exports = router;
