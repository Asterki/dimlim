import express from "express";
import ms from "ms";
import rateLimit from "express-rate-limit";
import validator from "validator";
import bcrypt from "bcrypt";

import { reportError } from "../utils/error";
import db from "../config/databases";
import { User } from "../types";
import { launchArgs, io } from "..";
import { checkTFA } from "../utils/tfa";

const router: express.Router = express.Router();

// Settings
router.post(
    "/change-email",
    rateLimit({
        windowMs: ms("1 hour"),
        max: launchArgs.dev == true ? 100 : 1,
        statusCode: 200,
        message: {
            status: 429,
            message: "rate-limit-exceeded",
        },
    }),
    async (req: any, res: any) => {
        if (!req.isAuthenticated()) return res.send("unauthorized");
        if (!req.body.password || !req.body.newEmail) return res.send({ status: 400, message: "missing-parameters" });
        if (typeof req.body.password !== "string" || typeof req.body.newEmail !== "string" || !validator.isEmail(req.body.newEmail))
            return res.send({ status: 400, message: "invalid-parameters" });

        try {
            let users = await db.get("users");
            let user: User | undefined = users.find((user: User) => user.userID == req.user.userID);

            if (!user) return res.send({ status: 400, message: "user-not-found" });
            if (users.find((user: any) => user.email.value == req.body.email)) return res.send({ status: 200, message: "email-already-in-use" });

            // Replace the user
            let newUserList = users.filter((listUser: User) => listUser.userID !== user?.userID);
            user.email = { value: req.body.newEmail, verified: false };

            newUserList.push(user);

            await db.set("users", newUserList);
            return res.send({ status: 200, message: "success" });
        } catch (err) {
            let errorID = reportError(err);
            return res.send({ status: 500, message: "server-error", id: errorID });
        }
    }
);

router.post("/set-language", async (req: any, res: any) => {
    if (!req.isAuthenticated()) return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.newLanguage) return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.newLanguage !== "string") return res.send({ status: 400, message: "invalid-parameters" });

    try {
        let users = await db.get("users");
        let user: User | undefined = users.find((user: User) => user.userID == req.user.userID);

        if (!user) return res.send({ status: 400, message: "user-not-found" });
        if (users.find((user: any) => user.email.value == req.body.email)) return res.send({ status: 200, message: "email-already-in-use" });

        // Replace the user
        let newUserList = users.filter((listUser: User) => listUser.userID !== user?.userID);
        user.preferredLanguage = req.body.newLanguage;

        newUserList.push(user);

        await db.set("users", newUserList);
        return res.send({ status: 200, message: "success" });
    } catch (err) {
        let errorID = reportError(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});

router.post("/set-bio", async (req: any, res: any) => {
    if (!req.isAuthenticated()) return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.newBio) return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.newBio !== "string") return res.send({ status: 400, message: "invalid-parameters" });

    try {
        let users = await db.get("users");
        let user: User | undefined = users.find((user: User) => user.userID == req.user.userID);

        if (!user) return res.send({ status: 400, message: "user-not-found" });
        if (users.find((user: any) => user.email.value == req.body.email)) return res.send({ status: 200, message: "email-already-in-use" });

        // Replace the user
        let newUserList = users.filter((listUser: User) => listUser.userID !== user?.userID);
        user.bio = req.body.newBio;

        newUserList.push(user);

        await db.set("users", newUserList);
        return res.send({ status: 200, message: "success" });
    } catch (err) {
        let errorID = reportError(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});

router.post(
    "/change-password",
    rateLimit({
        windowMs: ms("1 hour"),
        max: launchArgs.dev == true ? 100 : 5,
        statusCode: 200,
        message: {
            status: 429,
            message: "rate-limit-exceeded",
        },
    }),
    async (req: any, res: any) => {
        if (!req.isAuthenticated) return res.send({ status: 403, message: "unauthorized" });
        if (!req.body.oldPassword || !req.body.newPassword) return res.send({ status: 400, message: "missing-parameters" });
        if (
            typeof req.body.oldPassword !== "string" ||
            typeof req.body.newPassword !== "string" ||
            req.body.newPassword.length < 8 ||
            req.body.newPassword.length > 256
        )
            return res.send({ status: 400, message: "invalid-parameters" });

        try {
            let users = await db.get("users");
            let user: User | undefined = users.find((user: any) => user.email.value == req.user.email.value);

            // Check if the user exists, and also if password is right
            if (!user) return res.send({ status: 400, message: "user-not-found" });
            if (!bcrypt.compareSync(req.body.oldPassword, user.password)) return res.send({ status: 403, message: "unauthorized" });

            // Check tfa is provided
            if (user.tfa.secret !== "") {
                if (!req.body.tfaCode) return res.send({ status: 200, message: "requires-tfa" });
                if (typeof req.body.tfaCode !== "string") return res.send({ status: 200, message: "invalid-tfa-code" });

                let tfaResult = checkTFA(req.body.tfaCode, user, users);
                if (tfaResult == "invalid-tfa-code") return res.send({ status: 200, message: "invalid-tfa-code" });
            }

            // Checks

            // Replace the user with the user with the new password
            let newUserList = users.filter((listUser: User) => listUser.userID !== user?.userID);
            user.password = bcrypt.hashSync(req.body.newPassword, 10);

            // Push to db
            newUserList.push(user);
            await db.set("users", newUserList);

            return res.send({ status: 200, message: "success" });
        } catch (err) {
            let errorID = reportError(err);
            return res.send({ status: 500, message: "server-error", id: errorID });
        }
    }
);

// Contacts
router.post("/add-contact", async (req: any, res: any) => {
    if (!req.isAuthenticated()) return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.contact) return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.contact !== "string") return res.send({ status: 400, message: "invalid-parameters" });

    if (req.body.contact == req.user.username) return res.send({ status: 400, message: "self-add" });

    try {
        if (!req.isAuthenticated()) return res.send({ status: 403, message: "unauthorized" });

        let users = await db.get("users");
        let user: User | undefined = users.find((user: any) => user.userID == req.user.userID);
        let userToAdd: User | undefined = users.find((listUser: any) => listUser.username == req.body.contact);

        if (
            user?.contacts.find((listUser: any) => {
                return listUser.username.toLowerCase() == req.body.contact.toLowerCase();
            }) !== undefined
        )
            return res.send({ status: 400, message: "already-on-list" });

        if (!userToAdd) return res.send({ status: 400, message: "user-not-found" });

        let newUserList: Array<User> = users.filter((user: User) => user.userID !== req.user.userID);
        newUserList.filter((user: User) => user.userID !== userToAdd?.userID);

        // Remove old users
        user?.contacts.push({ username: userToAdd.username, userID: userToAdd.userID });
        userToAdd?.contacts.push({ username: user?.username, userID: user?.userID });

        // Reload the main page to the other user if they're online
        io.sockets.to(userToAdd.userID).emit("reload");

        newUserList.push(user as User);
        newUserList.push(userToAdd as User);
        db.set("users", newUserList);
        return res.send({ status: 200, message: "success" });
    } catch (err) {
        let errorID = reportError(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});

router.post("/remove-contact", async (req: any, res: any) => {
    if (!req.isAuthenticated()) return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.contact) return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.contact !== "string") return res.send({ status: 400, message: "invalid-parameters" });

    try {
        if (!req.isAuthenticated()) return res.send({ status: 403, message: "unauthorized" });

        let users = await db.get("users");
        let user: User | undefined = users.find((user: any) => user.userID == req.user.userID);
        let userToRemove: User | undefined = users.find((listUser: any) => listUser.username == req.body.contact);
        if (!userToRemove) return res.send({ status: 400, message: "user-not-found" });

        // Remove old users
        let newUserList: Array<User> = users.filter((user: User) => user.userID !== req.user.userID);
        newUserList.filter((user: User) => user.userID !== userToRemove?.userID);

        let newUserContactList = user?.contacts.filter((listUser: User) => {
            return listUser.userID !== userToRemove?.userID;
        });
        let newUserToRemoveContactList = userToRemove?.contacts.filter((listUser: User) => {
            return listUser.userID !== user?.userID;
        });

        // @ts-ignore
        user?.contacts = newUserContactList;
        userToRemove.contacts = newUserToRemoveContactList;

        console.log(user, userToRemove);

        // Reload the main page to the other user if they're online
        io.sockets.to(userToRemove.userID).emit("reload");

        newUserList.push(user as User);
        newUserList.push(userToRemove as User);
        db.set("users", newUserList);
        return res.send({ status: 200, message: "success" });
    } catch (err) {
        let errorID = reportError(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});

router.post("/block-contact", async (req: any, res: any) => {
    if (!req.isAuthenticated()) return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.contact) return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.contact !== "string") return res.send({ status: 400, message: "invalid-parameters" });

    try {
        if (!req.isAuthenticated()) return res.send({ status: 403, message: "unauthorized" });

        let users = await db.get("users");
        let user: User | undefined = users.find((user: any) => user.userID == req.user.userID);
        let userToAdd: User | undefined = users.find((listUser: any) => listUser.username == req.body.contact);

        let newUserList: Array<User> = users.filter((user: User) => user.userID !== req.user.userID);
        // @ts-ignore
        user?.contacts = user?.contacts.filter((listUser: User) => {
            return listUser.username !== req.body.contact;
        });

        user?.blockedContacts.push({ username: userToAdd?.username, userID: userToAdd?.userID });

        newUserList.push(user as User);
        db.set("users", newUserList);
        return res.send({ status: 200, message: "success" });
    } catch (err) {
        let errorID = reportError(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});

router.post("/unblock-contact", async (req: any, res: any) => {
    if (!req.isAuthenticated()) return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.contact) return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.contact !== "string") return res.send({ status: 400, message: "invalid-parameters" });

    try {
        if (!req.isAuthenticated()) return res.send({ status: 403, message: "unauthorized" });

        let users = await db.get("users");
        let user: User | undefined = users.find((user: any) => user.userID == req.user.userID);
        let userToAdd: User | undefined = users.find((listUser: any) => listUser.username == req.body.contact);

        let newUserList: Array<User> = users.filter((user: User) => user.userID !== req.user.userID);
        // @ts-ignore
        user?.blockedContacts = user?.contacts.filter((listUser: User) => {
            return listUser.username !== req.body.contact;
        });

        user?.contacts.push({ username: userToAdd?.username, userID: userToAdd?.userID });

        newUserList.push(user as User);
        db.set("users", newUserList);
        return res.send({ status: 200, message: "success" });
    } catch (err) {
        let errorID = reportError(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});

module.exports = router;
