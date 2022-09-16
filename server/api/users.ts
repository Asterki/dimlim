import express from "express";
import ms from "ms";
import rateLimit from "express-rate-limit";
import validator from "validator";
import bcrypt from "bcrypt";

import { reportError } from "../utils/error";
import db from "../config/databases";
import { User } from "../types";
import { launchArgs } from "..";
import { checkTFA } from "../utils/tfa";

const router: express.Router = express.Router();

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

module.exports = router;
