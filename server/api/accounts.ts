import express from "express";
import rateLimit from "express-rate-limit";
import ms from "ms";
import passport from "passport";
import bcrypt from "bcrypt";
import validator from "validator";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { v4 as uuidv4 } from "uuid";

import db from "../config/databases";
import { User } from "../types";

const router: express.Router = express.Router();

// Account creation and deletion
router.post(
    "/register",
    rateLimit({
        windowMs: ms("1 hour"),
        max: 10,
        message: {
            status: 429,
            message: "rate-limit-exceeded",
        },
    }),
    (req, res) => {
        // Check that values are there and that they're the right type
        if (!req.body.email || !req.body.password || !req.body.username)
            return res.send({ status: 400, message: "missing-parameters" });
        if (
            typeof req.body.email !== "string" ||
            typeof req.body.password !== "string" ||
            typeof req.body.username !== "string"
        )
            return res.send({ status: 400, message: "invalid-parameters" });

        try {
            let { email, password, username } = req.body;

            // Validate that all fields meet the criteria
            if (!validator.isEmail(email)) return res.send({ status: 400, message: "invalid-email" });
            if (password.length < 8 || password.length > 64)
                return res.send({ status: 400, message: "invalid-password" });
            if (
                username.length < 3 ||
                username.length > 32 ||
                !validator.isAlphanumeric(username, "en-US", { ignore: "." })
            )
                return res.send({ status: 400, message: "invalid-username" });

            // Get values from database and parse them
            db.get("users", async (err: any, users: any) => {
                if (err) {
                    if (err.type == "NotFoundError") {
                        db.put("users", JSON.stringify([]), (err: any) => {
                            if (err) return res.send({ status: 500, message: "server-error" });
                            return res.send({ status: 200, message: "try-again" });
                        });
                    }

                    if (err) return res.send({ status: 500, message: "server-error" });
                }

                users = JSON.parse(users);

                // Checks if values are in user
                if (users.find((user: any) => user.email.value == email))
                    return res.send({ status: 200, message: "email-already-in-use" });
                if (users.find((user: any) => user.username == username))
                    return res.send({ status: 200, message: "username-already-in-use" });

                // Create and push the user to the db
                const user: User = {
                    username: username.toLowerCase(),
                    email: {
                        value: email,
                        verified: false,
                    },
                    password: bcrypt.hashSync(password, 10),
                    userID: uuidv4(),
                    tfaSecret: "",
                };

                users.push(user);
                db.put("users", JSON.stringify(users), (err: any) => {
                    if (err) return res.send({ status: 500, message: "server-error" });
                });

                // Login the user
                req.login(user, (err: any) => {
                    if (err) return res.send({ status: 500, message: "server-error" });
                    return res.send({ status: 200, message: "success" });
                });
            });
        } catch (err) {
            return res.send({ status: 500, message: "server-error" });
        }
    }
);

router.post(
    "/delete-account",
    rateLimit({
        windowMs: ms("1 hour"),
        max: 10,
        message: {
            status: 429,
            message: "rate-limit-exceeded",
        },
    }),
    (req: any, res: any) => {
        // Do auth and params checks
        if (!req.user || !req.body.password) return res.send({ status: 403, message: "unauthorized" });
        if (typeof req.body.password !== "string") return res.send({ status: 400, message: "invalid-params" });

        try {
            // Get the user list
            db.get("users", (err: any, result: string) => {
                if (err) {
                    if (err.type == "NotFoundError") {
                        db.put("users", JSON.stringify([]), (err: any) => {
                            if (err) return res.status(500).send("server-error");
                            return res.send({ status: 400, message: "user-not-found" });
                        });
                    }

                    return res.status(500).send("server-error");
                }

                // Get the user
                let users: Array<User> = JSON.parse(result);
                let user: User | undefined = users.find((user: User) => user.userID == req.user.userID);
                if (!user) return res.send({ status: 400, message: "user-not-found" });

                if (user.tfaSecret !== "") {
                    if (!req.body.tfaCode) return res.send({ status: 400, message: "no-tfa-code" });

                    let verified = speakeasy.totp.verify({
                        secret: user.tfaSecret,
                        encoding: "base32",
                        token: req.body.tfaCode,
                    });

                    if (verified == false) return res.send({ status: 403, message: "unauthorized" });
                }

                if (!bcrypt.compareSync(req.body.password, user.password))
                    return res.send({ status: 403, message: "unauthorized" });

                let newUserList = users.filter((user: User) => user.userID !== req.user.userID);

                req.logout((err: any) => {
                    if (err) return res.redirect("/error?code=400");

                    db.put("users", JSON.stringify(newUserList), (err: any) => {
                        if (err) return res.send({ status: 500, message: "server-error" });
                        return res.send({ status: 200, message: "success" });
                    });
                });
            });
        } catch (err) {
            return res.send({ status: 500, message: "server-error" });
        }
    }
);

// Account access
router.post(
    "/login",
    rateLimit({
        windowMs: ms("1 hour"),
        max: 10,
        message: {
            status: 429,
            message: "rate-limit-exceeded",
        },
    }),
    (req, res, next) => {
        // Check that values are there and that they're the right type
        if (!req.body.email || !req.body.password) return res.send({ status: 400, message: "missing-data" });
        if (typeof req.body.email !== "string" || typeof req.body.password !== "string")
            return res.send({ status: 400, message: "invalid params" });

        try {
            // Auth using passport, see config/auth.ts for more reference on this
            passport.authenticate("local", (err: Error | null, user: any, result: any) => {
                if (!user) {
                    // Check if we didn't got the user because it requires a 2fa code
                    if (result.message == "requires-tfa" || result.message == "invalid-tfa-code")
                        return res.send({ status: 200, message: result.message });
                    return res.send({ status: 200, message: "invalid-credentials" });
                }

                // Login the user
                req.logIn(user, (err) => {
                    if (err) return res.send({ status: 500, message: "server-error" });
                    return res.send({ status: 200, message: "success" });
                });
            })(req, res, next);
        } catch (err) {
            return res.send({ status: 500, message: "server-error" });
        }
    }
);

router.get(
    "/logout",
    rateLimit({
        windowMs: ms("1 hour"),
        max: 10,
        message: {
            status: 429,
            message: "rate-limit-exceeded",
        },
    }),
    (req, res) => {
        // Logout
        if (!req.user) return res.redirect("/");

        req.logout((err: any) => {
            if (err) return res.redirect("/error?code=400");
            res.redirect("/");
        });
    }
);

// TFA Related
router.post(
    "/activate-tfa",
    rateLimit({
        windowMs: ms("1 hour"),
        max: 1,
        message: {
            status: 429,
            message: "rate-limit-exceeded",
        },
    }),
    (req: any, res: any) => {
        try {
            if (!req.user) return res.send({ status: 403, message: "not-logged-in" });

            db.get("users", (err: any, users: any) => {
                if (err) {
                    if (err.type == "NotFoundError") {
                        db.put("users", JSON.stringify([]), (err: any) => {
                            if (err) return res.send({ status: 500, message: "server-error" });
                            return res.send({ status: 400, message: "user-not-found" });
                        });
                    }

                    return res.send({ status: 500, message: "server-error" });
                }

                // Find the user
                users = JSON.parse(users);
                let user: User = users.find((user: any) => user.userID == req.user.userID);

                // Check if user exists, if so, check if tfa is already activated
                if (!user) return res.send({ status: 400, message: "user-not-found" });
                if (user.tfaSecret !== "") return res.send({ status: 400, message: "tfa-already-activated" });

                // Generate our secret
                let secret: any = speakeasy.generateSecret({ length: 20 });

                // TODO: Save to database
                let newUserList = users.filter((user: User) => user.userID !== req.user.userID);
                user.tfaSecret = secret.base32;
                newUserList.push(user);

                console.log(newUserList);

                // Generate the qr code
                qrcode.toDataURL(secret.otpauth_url, (err: any, image_data: string) => {
                    if (err) return res.send({ status: 500, message: "server-error" });

                    db.put("users", JSON.stringify(newUserList), (err: any) => {
                        if (err) return res.send({ status: 500, message: "server-error" });

                        // Send to client
                        return res.status(200).send({
                            image: image_data,
                            code: secret.otpauth_url,
                        });
                    });
                });
            });
        } catch (err) {
            res.status(500).send("server-error");
        }
    }
);

// Tests
router.post("/check-use", (req: any, res: any) => {
    // Check that values are there and that they're the right type
    if (!req.body.email || !req.body.username) return res.send({ status: 400, message: "missing-params" });
    if (typeof req.body.email !== "string" || typeof req.body.username !== "string")
        return res.send({ status: 400, message: "invalid-error" });

    let { email, username } = req.body;

    try {
        // Get from db and parse
        db.get("users", async (err: any, users: any) => {
            if (err) {
                if (err.type == "NotFoundError") {
                    return db.put("users", JSON.stringify([]), (err: any) => {
                        if (err) return res.send({ status: 500, message: "server-error" });
                        return res.send({ status: 200, message: "try-again" });
                    });
                }

                return res.send({ status: 500, message: "server-error" });
            }

            users = JSON.parse(users);

            // Test
            if (users.find((user: any) => user.email.value == email))
                return res.send({ status: 200, message: "email-already-in-use" });
            if (users.find((user: any) => user.username == username))
                return res.send({ status: 200, message: "username-already-in-use" });

            return res.send({ status: 200, message: "all-good" });
        });
    } catch (err) {
        return res.send({ status: 500, message: "server-error" });
    }
});

router.get("/test", (req, res) => {
    db.clear();
    db.put("users", JSON.stringify([]), (err: any) => {
        if (err) return res.send({ status: 500, message: "server-error" });
    });
    return res.send("ok");
});

module.exports = router;
