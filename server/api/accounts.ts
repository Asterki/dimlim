import express from "express";
import ms from "ms";
import passport from "passport";
import bcrypt from "bcrypt";
import validator from "validator";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { v4 as uuidv4 } from "uuid";

import db from "../config/databases";
import { sendEmail } from "../utils/email";

import { EmailVerificationCode, User } from "../types";
import { reportError } from "../utils/error";
import { checkTFA } from "../utils/tfa";
import { getLanguage } from "../utils/locale";

const router: express.Router = express.Router();

// Account creation and deletion
router.post("/register", async (req, res) => {
    // Check that values are there and that they're the right type
    if (!req.body.email || !req.body.password || !req.body.username) return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.email !== "string" || typeof req.body.password !== "string" || typeof req.body.username !== "string")
        return res.send({ status: 400, message: "invalid-parameters" });

    try {
        const { email, password, username, lang } = req.body;

        // Validate that all fields meet the criteria
        if (!validator.isEmail(email)) return res.send({ status: 400, message: "invalid-email" });
        if (password.length < 8 || password.length > 64) return res.send({ status: 400, message: "invalid-password" });
        if (username.length < 3 || username.length > 32 || !validator.isAlphanumeric(username, "en-US", { ignore: "." }))
            return res.send({ status: 400, message: "invalid-username" });

        // Get values from database and check if they're in use
        const users = await db.get("users");
        if (users.find((user: any) => user.email.value == email)) return res.send({ status: 200, message: "email-already-in-use" });
        if (users.find((user: any) => user.username == username)) return res.send({ status: 200, message: "username-already-in-use" });

        const makeId = (length: number) => {
            let result = "";
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        };

        // Create and push the user to the db
        const newUser: User = {
            userID: uuidv4(),
            created: Date.now(),

            username: username.toLowerCase(),
            email: {
                value: email,
                verified: false,
            },

            avatar: "",
            bio: "",
            preferredLanguage: getLanguage(lang),

            contacts: [],
            blockedContacts: [],

            password: bcrypt.hashSync(password, 10),
            chatSecret: uuidv4(),
            encSecret: makeId(16),

            tfa: {
                secret: "",
                backupCodes: [],
                seenBackupCodes: false,
            },
        };

        users.push(newUser);
        db.set("users", users);

        // Login the user
        req.login(newUser, (err: any) => {
            if (err) throw err;
            return res.send({ status: 200, message: "success" });
        });
    } catch (err) {
        const errorID = reportError(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});

router.post("/delete-account", async (req: any, res: any) => {
    // Do auth and params checks
    if (!req.isAuthenticated()) return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.password) return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.password !== "string") return res.send({ status: 400, message: "invalid-parameters" });

    try {
        // Get the user list
        const users = await db.get("users");
        const user: User | undefined = users.find((user: User) => user.userID == req.user.userID);
        if (!user) return res.send({ status: 400, message: "user-not-found" });

        // Check the password
        if (!bcrypt.compareSync(req.body.password, user.password)) return res.send({ status: 403, message: "unauthorized" });

        // Check the tfa
        if (user.tfa.secret !== "") {
            if (!req.body.tfaCode) return res.send({ status: 400, message: "no-tfa-code" });

            const verified = speakeasy.totp.verify({
                secret: user.tfa.secret,
                encoding: "base32",
                token: req.body.tfaCode,
            });

            if (verified == false) return res.send({ status: 403, message: "invalid-tfa-code" });
        }

        // Delete the user and logout
        const newUserList: Array<User> = users.filter((user: User) => user.userID !== req.user.userID);
        req.logout(async (err: any) => {
            if (err) throw err;

            await db.set("users", newUserList);
            return res.send({ status: 200, message: "success" });
        });
    } catch (err) {
        const errorID = reportError(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});

// Account access
router.post("/login", (req, res, next) => {
    // Check that values are there and that they're the right type
    if (!req.body.email || !req.body.password) return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.email !== "string" || typeof req.body.password !== "string") return res.send({ status: 400, message: "invalid-parameters" });

    try {
        // Auth using passport, see config/auth.ts for more reference on this
        passport.authenticate("local", (err: Error | null, user: any, result: any) => {
            if (err) throw err;

            if (!user) {
                // Check if we didn't got the user because it requires a 2fa code
                if (result.message == "requires-tfa" || result.message == "invalid-tfa-code") return res.send({ status: 200, message: result.message });
                return res.send({ status: 200, message: "invalid-credentials" });
            }

            // Login the user
            req.logIn(user, (err) => {
                if (err) throw err;
                return res.send({ status: 200, message: "success" });
            });
        })(req, res, next);
    } catch (err) {
        const errorID = reportError(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});

router.get("/logout", (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/");

    try {
        // Logout
        req.logout((err: any) => {
            if (err) throw err;
            res.redirect("/");
        });
    } catch (err) {
        const errorID = reportError(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});

// Email actions
router.post("/send-verification-email", async (req: any, res: any) => {
    if (!req.isAuthenticated()) return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.lang) return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.lang !== "string") return res.send({ status: 400, message: "invalid-parameters" });

    try {
        const users = await db.get("users");
        const user: User | undefined = users.find((user: any) => user.email.value == req.user.email.value);

        if (!user) return res.send({ status: 400, message: "user-not-found" });
        if (user.email.verified == true) return res.send({ status: 200, message: "email-verified" });

        // Get the codes and filter out the old one
        const codes = await db.get("email-verification-codes");
        const newCodeList = codes.filter((code: EmailVerificationCode) => code.email !== req.user.email.value);

        // Generate the new code
        const newCode: EmailVerificationCode = {
            code: uuidv4(),
            email: user?.email.value as string,
            expires: Date.now() + ms("5 hours"),
        };

        // Send the email
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const emailContent = require(`../../locales/emails/email-verification/${req.body.lang}`);
        await sendEmail(
            user?.email.value as string,
            emailContent.subject,
            emailContent.html
                .replace(/{username}/g, user?.username)
                .replace(/{link}/g, `${process.env.HOST}/api/accounts/verify-email?code=${newCode.code}&email=${newCode.email}`)
        );

        // Push changes to the db
        newCodeList.push(newCode);
        await db.set("email-verification-codes", newCodeList);

        return res.send({ status: 200, message: "success" });
    } catch (err) {
        const errorID = reportError(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});

router.get("/verify-email", async (req, res) => {
    if (!req.query.code || !req.query.email) return res.redirect("/");

    try {
        // Get code
        const codes: Array<EmailVerificationCode> = await db.get("email-verification-codes");
        const code: EmailVerificationCode | undefined = codes.find((listCode: EmailVerificationCode) => listCode.email == req.query.email);

        // Checks
        if (!code) return res.redirect("/");
        if (code.expires <= Date.now()) return res.redirect("/accounts/verify-email?expired=true");
        if (code.code !== req.query.code) return res.redirect("/accounts/verify-email?invalid=true");

        // Get users
        const users = await db.get("users");
        const user: User = users.find((listUser: User) => listUser.email.value == code?.email);

        // Update the user
        user.email.verified = true;
        const newUsersList: Array<User> = users.filter((listUser: User) => listUser.userID !== user?.userID);

        // Remove the code from the database
        codes.filter((listCode: EmailVerificationCode) => listCode.code !== code?.code);
        await db.set("email-verification-codes", codes);

        // Push to db
        newUsersList.push(user);
        await db.set("users", newUsersList);

        return res.redirect("/accounts/verify-email?=success=true");
    } catch (err) {
        const errorID = reportError(err);
        return res.redirect(`/error?code=500&id=${errorID}`);
    }
});

// Password actions // TODO
// router.post("/reset-password", (_req: any, _res: any) => {});

// TFA related
router.post("/activate-tfa", async (req: any, res: any) => {
    try {
        if (!req.isAuthenticated()) return res.send({ status: 403, message: "unauthorized" });

        const users = await db.get("users");
        const user: User | undefined = users.find((user: any) => user.userID == req.user.userID);

        // Check if user exists, if so, check if tfa is already activated, and if email is verified
        if (!user) return res.send({ status: 400, message: "user-not-found" });
        if (user.tfa.secret !== "") return res.send({ status: 400, message: "tfa-already-activated" });
        if (user.email.verified == false) return res.send({ status: 400, message: "email-not-verified" });

        // Generate our secret
        const secret: any = speakeasy.generateSecret({ length: 20 });

        const newUserList: Array<User> = users.filter((user: User) => user.userID !== req.user.userID);
        user.tfa.secret = secret.base32;
        newUserList.push(user);

        // Generate the qr code
        qrcode.toDataURL(secret.otpauth_url, async (err: any, image_data: string) => {
            if (err) throw err;
            await db.set("users", newUserList);

            return res.send({
                status: 200,
                image: image_data,
                code: secret.base32,
            });
        });
    } catch (err) {
        const errorID = reportError(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});

router.post("/deactivate-tfa", async (req: any, res: any) => {
    if (!req.isAuthenticated()) return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.tfaCode) return res.send({ code: 400, status: "missing-parameters" });
    if (typeof req.body.tfaCode !== "string") return res.send({ code: 400, message: "invalid-parameters" });

    try {
        const users = await db.get("users");
        const user: User | undefined = users.find((user: any) => user.userID == req.user.userID);

        // Checks
        if (!user) return res.send({ status: 400, message: "user-not-found" });
        if (user?.tfa.secret == "") return res.send({ status: 200, message: "tfa-not-active" });
        if (user.email.verified == false) return res.send({ status: 400, message: "email-not-verified" });

        // Check if the tfa code
        const tfaResult = checkTFA(req.body.tfaCode, user, users);
        if (tfaResult == "invalid-tfa-code") return res.send({ status: 200, message: "invalid-tfa-code" });

        // Remove the secret, and replace the user in the DB with the new user without the secret
        user.tfa.secret = "";
        user.tfa.backupCodes = [];
        user.tfa.seenBackupCodes = false;
        const newUserList = users.filter((listUser: User) => listUser.email !== user?.email);

        // Push changes to the DB
        newUserList.push(user);
        await db.set("users", newUserList);

        return res.status(200).send({
            status: 200,
            message: "success",
        });
    } catch (err) {
        const errorID = reportError(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});

router.post("/verify-tfa", async (req: any, res: any) => {
    if (!req.isAuthenticated()) return res.send({ code: 403, message: "unauthorized" });
    if (!req.body.code) return res.send({ code: 400, message: "missing-parameters" });
    if (typeof req.body.code !== "string") res.send({ code: 400, message: "invalid-parameters" });

    try {
        const users = await db.get("users");
        const user: User | undefined = users.find((user: User) => user.userID == req.user.userID);

        // Check if user exists
        if (!user) return res.send({ code: 400, message: "user-not-found" });
        if (user.tfa.secret == "") return res.send({ code: 400, message: "tfa-not-active" });

        // I'll leave this like this, because we don't want the user to use a backup code instead of the code provided by the tfa app
        const verified = speakeasy.totp.verify({
            secret: user.tfa.secret,
            encoding: "base32",
            token: req.body.code,
        });

        if (verified == false) return res.send({ status: 400, message: "invalid-tfa-code" });
        if (user.tfa.seenBackupCodes == true) return res.send({ code: 200, message: "backup-codes-seen" });

        // Generate codes
        const codeList: Array<string> = [];
        for (let i = 0; i < 10; i++) {
            codeList.push(Math.random().toString(16).slice(2, 10));
        }

        // Hash codes
        const hashedCodes: Array<string> = [];
        codeList.forEach((code: string) => {
            hashedCodes.push(bcrypt.hashSync(code, 10));
        });

        // Replace the old user with the new user
        const newUserList: Array<User> = users.filter((listUser: User) => listUser.userID !== user?.userID);
        user.tfa.backupCodes = hashedCodes;
        user.tfa.seenBackupCodes = true;

        // Push to the DB
        newUserList.push(user);
        await db.set("users", newUserList);

        return res.send({ status: 200, message: "success", codes: codeList });
    } catch (err) {
        const errorID = reportError(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});

// Tests
router.post("/check-use", async (req: any, res: any) => {
    // Check that values are there and that they're the right type
    if (!req.body.email || !req.body.username) return res.send({ status: 400, message: "missing-params" });
    if (typeof req.body.email !== "string" || typeof req.body.username !== "string") return res.send({ status: 400, message: "invalid-error" });

    try {
        // Get from db
        const users = await db.get("users");

        // Checks
        if (users.find((user: any) => user.email.value == req.body.email)) return res.send({ status: 200, message: "email-already-in-use" });
        if (users.find((user: any) => user.username == req.body.username)) return res.send({ status: 200, message: "username-already-in-use" });

        return res.send({ status: 200, message: "all-good" });
    } catch (err) {
        const errorID = reportError(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});

router.get("/test-auth", async (req, res) => {
    await db.set("users", []);
    res.send("ha");
});

module.exports = router;
