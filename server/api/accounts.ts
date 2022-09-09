import express from "express";
import rateLimit from "express-rate-limit";
import ms from "ms";
import passport from "passport";
import bcrypt from "bcrypt";
import validator from "validator";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import path from "path";

import db from "../config/databases";
import { sendEmail } from "../utils/email";
import { launchArgs } from "..";

import { reportError } from "../utils/error";
import { EmailVerificationCode, User } from "../types";
import { checkTFA } from "../utils/tfa";

const router: express.Router = express.Router();

// Account creation and deletion
router.post(
    "/register",
    rateLimit({
        windowMs: ms("1 hour"),
        max: launchArgs.dev == "true" ? 100 : 1,
        message: {
            status: 429,
            message: "rate-limit-exceeded",
        },
    }),
    (req, res) => {
        // Check that values are there and that they're the right type
        if (!req.body.email || !req.body.password || !req.body.username) return res.send({ status: 400, message: "missing-parameters" });
        if (typeof req.body.email !== "string" || typeof req.body.password !== "string" || typeof req.body.username !== "string")
            return res.send({ status: 400, message: "invalid-parameters" });

        try {
            let { email, password, username } = req.body;

            // Validate that all fields meet the criteria
            if (!validator.isEmail(email)) return res.send({ status: 400, message: "invalid-email" });
            if (password.length < 8 || password.length > 64) return res.send({ status: 400, message: "invalid-password" });
            if (username.length < 3 || username.length > 32 || !validator.isAlphanumeric(username, "en-US", { ignore: "." }))
                return res.send({ status: 400, message: "invalid-username" });

            // Get values from database and parse them
            db.get("users", async (err: any, userString: any) => {
                if (err) {
                    if (err.type == "NotFoundError") {
                        db.put("users", JSON.stringify([]), (err: any) => {
                            if (err) throw err;
                            return res.send({ status: 200, message: "try-again" });
                        });
                    } else throw err;
                }

                let users: Array<User> = JSON.parse(userString);

                // Checks if values are in user
                if (users.find((user: any) => user.email.value == email)) return res.send({ status: 200, message: "email-already-in-use" });
                if (users.find((user: any) => user.username == username)) return res.send({ status: 200, message: "username-already-in-use" });

                // Create and push the user to the db
                let newUser: User = {
                    username: username.toLowerCase(),
                    email: {
                        value: email,
                        verified: false,
                    },
                    password: bcrypt.hashSync(password, 10),
                    userID: uuidv4(),
                    tfa: {
                        secret: "",
                        backupCodes: [],
                        seenBackupCodes: false,
                    },
                };

                users.push(newUser);
                db.put("users", JSON.stringify(users), (err: any) => {
                    if (err) throw err;
                });

                // Login the user
                req.login(newUser, (err: any) => {
                    if (err) throw err;
                    return res.send({ status: 200, message: "success" });
                });
            });
        } catch (err) {
            let errorID = reportError(err);
            return res.send({ status: 500, message: "server-error", id: errorID });
        }
    }
);

router.post(
    "/delete-account",
    rateLimit({
        windowMs: ms("1 hour"),
        max: launchArgs.dev == "true" ? 100 : 1,
        message: {
            status: 429,
            message: "rate-limit-exceeded",
        },
    }),
    (req: any, res: any) => {
        // Do auth and params checks
        if (!req.isAuthenticated() || !req.body.password) return res.send({ status: 403, message: "unauthorized" });
        if (!req.body.password) return res.send({ status: 400, message: "missing-parameters" });
        if (typeof req.body.password !== "string") return res.send({ status: 400, message: "invalid-parameters" });

        try {
            // Get the user list
            db.get("users", (err: any, result: string) => {
                if (err) {
                    if (err.type == "NotFoundError") {
                        db.put("users", JSON.stringify([]), (newErr: any) => {
                            if (newErr) throw err;
                            return res.send({ status: 200, message: "try-again" });
                        });
                    } else throw err;
                }

                // Get the user
                let users: Array<User> = JSON.parse(result);
                let user: User | undefined = users.find((user: User) => user.userID == req.user.userID);
                if (!user) return res.send({ status: 400, message: "user-not-found" });

                if (user.tfa.secret !== "") {
                    if (!req.body.tfaCode) return res.send({ status: 400, message: "no-tfa-code" });

                    let verified = speakeasy.totp.verify({
                        secret: user.tfa.secret,
                        encoding: "base32",
                        token: req.body.tfaCode,
                    });

                    if (verified == false) return res.send({ status: 403, message: "unauthorized" });
                }

                if (!bcrypt.compareSync(req.body.password, user.password)) return res.send({ status: 403, message: "unauthorized" });

                let newUserList: Array<User> = users.filter((user: User) => user.userID !== req.user.userID);

                req.logout((err: any) => {
                    if (err) return res.redirect("/error?code=400");

                    db.put("users", JSON.stringify(newUserList), (err: any) => {
                        if (err) throw err;
                        return res.send({ status: 200, message: "success" });
                    });
                });
            });
        } catch (err) {
            let errorID = reportError(err);
            return res.send({ status: 500, message: "server-error", id: errorID });
        }
    }
);

// Account access
router.post(
    "/login",
    rateLimit({
        windowMs: ms("1 hour"),
        max: launchArgs.dev == "true" ? 100 : 10,
        message: {
            status: 429,
            message: "rate-limit-exceeded",
        },
    }),
    (req, res, next) => {
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
            let errorID = reportError(err);
            return res.send({ status: 500, message: "server-error", id: errorID });
        }
    }
);

router.get(
    "/logout",
    rateLimit({
        windowMs: ms("1 hour"),
        max: launchArgs.dev == "true" ? 100 : 10,
        message: {
            status: 429,
            message: "rate-limit-exceeded",
        },
    }),
    (req, res) => {
        if (!req.isAuthenticated()) return res.redirect("/");

        try {
            // Logout
            req.logout((err: any) => {
                if (err) throw err;
                res.redirect("/");
            });
        } catch (err) {
            let errorID = reportError(err);
            return res.send({ status: 500, message: "server-error", id: errorID });
        }
    }
);

// Email actions
router.post(
    "/send-verification-email",
    rateLimit({
        windowMs: ms("1 hour"),
        max: launchArgs.dev == "true" ? 100 : 3,
        message: {
            status: 429,
            message: "rate-limit-exceeded",
        },
    }),
    (req: any, res: any) => {
        if (!req.isAuthenticated()) return res.send({ status: 403, message: "unauthorized" });
        if (!req.body.lang) return res.send({ status: 400, message: "missing-parameters" });
        if (typeof req.body.lang !== "string") return res.send({ status: 400, message: "invalid-parameters" });

        try {
            db.get("users", (err: any, userString: string) => {
                if (err) {
                    if (err.type == "NotFoundError") {
                        db.put("users", JSON.stringify([]), (newErr: any) => {
                            console.log(newErr);
                            if (newErr) throw err;
                            return res.send({ status: 200, message: "try-again" });
                        });
                    } else throw err;
                }

                // Get the user
                let users: Array<User> = JSON.parse(userString);
                let user: User | undefined = users.find((user: any) => user.email.value == req.user.email.value);

                if (!user) return res.send({ status: 400, message: "user-not-found" });
                if (user.email.verified == true) return res.send({ status: 200, message: "email-verified" });

                // Open the email verification codes table
                db.get("email-verification-codes", async (err: any, codesString: string) => {
                    if (err) {
                        if (err.type == "NotFoundError") {
                            db.put("email-verification-codes", JSON.stringify([]), (newErr: any) => {
                                if (newErr) throw err;
                                return res.send({ status: 200, message: "try-again" });
                            });
                        } else throw err;
                    }

                    // Get the codes
                    let codes: Array<EmailVerificationCode> = JSON.parse(codesString);

                    // Remove the old code (used like this because codes.filter wont work for some reason)
                    let newCodeList: Array<EmailVerificationCode> = [];
                    codes.forEach((code: EmailVerificationCode) => {
                        if (code.email !== req.user.email.value) newCodeList.push(code);
                    });

                    // Generate the new code
                    let newCode: EmailVerificationCode = {
                        code: uuidv4(),
                        email: user?.email.value as string,
                        expires: Date.now() + ms("5 hours"),
                    };

                    // Send the email
                    let emailContent = require(`../../locales/emails/email-verification/${req.body.lang}`);
                    await sendEmail(
                        user?.email.value as string,
                        emailContent.subject,
                        emailContent.html
                            .replace(/{username}/g, user?.username)
                            .replace(/{link}/g, `${process.env.HOST}/api/accounts/verify-email?code=${newCode.code}&email=${newCode.email}`)
                    );

                    // Push changes to the db
                    newCodeList.push(newCode);
                    db.put("email-verification-codes", JSON.stringify(newCodeList), (err: any) => {
                        if (err) throw err;
                        return res.send({ status: 200, message: "success" });
                    });
                });
            });
        } catch (err) {
            let errorID = reportError(err);
            return res.send({ status: 500, message: "server-error", id: errorID });
        }
    }
);

router.get(
    "/verify-email",
    rateLimit({
        windowMs: ms("1 hour"),
        max: launchArgs.dev == "true" ? 100 : 10,
        message: {
            status: 429,
            message: "rate-limit-exceeded",
        },
    }),
    (req, res) => {
        if (!req.query.code || !req.query.email) return res.redirect("/");

        try {
            db.get("email-verification-codes", (err: any, codesString: string) => {
                if (err) {
                    if (err.type == "NotFoundError") {
                        db.put("email-verification-codes", JSON.stringify([]), (newErr: any) => {
                            if (newErr) throw err;
                            return res.send({ status: 200, message: "try-again" });
                        });
                    } else throw err;
                }

                // Get the current codes
                let codes: Array<EmailVerificationCode> = JSON.parse(codesString);

                // Get the code from the query and find it in the db
                let code = codes.find((listCode: EmailVerificationCode) => {
                    return listCode.email == req.query.email;
                });

                // Checks
                if (!code) return res.redirect("/");
                if (code.expires <= Date.now()) return res.redirect("/verify-email?expired=true");
                if (code.code !== req.query.code) return res.redirect("/verify-email?invalid=true");

                // Update user
                db.get("users", (err: any, usersString: string) => {
                    if (err) {
                        if (err.type == "NotFoundError") {
                            db.put("users", JSON.stringify([]), (newErr: any) => {
                                if (newErr) throw err;
                                return res.send({ status: 200, message: "try-again" });
                            });
                        } else throw err;
                    }

                    // Get user
                    let users: Array<User> = JSON.parse(usersString);
                    let user: User | undefined = users.find((listUser: User) => listUser.email.value == req.query.email);

                    // Checks
                    if (!user) return res.redirect("/error?code=400");
                    if (user.email.verified == true) return res.redirect("/verify-email?already-verified=true");

                    // Update the user
                    user.email.verified = true;
                    let newUsersList: Array<User> = users.filter((listUser: User) => listUser.userID !== user?.userID);

                    // Push changes to db
                    newUsersList.push(user);
                    db.put("users", JSON.stringify(newUsersList), (err: any) => {
                        if (err) throw err;
                        return res.redirect("/verify-email?=success=true");
                    });
                });
            });
        } catch (err) {
            let errorID = reportError(err);
            return res.redirect(`/error?code=500&id=${errorID}`);
        }
    }
);

router.post(
    "/change-email",
    rateLimit({
        windowMs: ms("1 hour"),
        max: launchArgs.dev == "true" ? 100 : 1,
        message: {
            status: 429,
            message: "rate-limit-exceeded",
        },
    }),
    (req: any, res: any) => {
        if (!req.isAuthenticated()) return res.send("unauthorized");
        if (!req.body.password || !req.body.newEmail) return res.send({ status: 400, message: "missing-parameters" });
        if (typeof req.body.password !== "string" || typeof req.body.newEmail !== "string" || !validator.isEmail(req.body.newEmail))
            return res.send({ status: 400, message: "invalid-parameters" });

        try {
            db.get("users", (err: any, userString: any) => {
                if (err) {
                    if (err.type == "NotFoundError") {
                        db.put("users", JSON.stringify([]), (err: Error) => {
                            if (err) throw err;
                            return res.send({ status: 400, message: "user-not-found" });
                        });
                    } else throw err;
                }

                // Find the user
                let users: Array<User> = JSON.parse(userString);
                let user: User | undefined = users.find((user: User) => user.userID == req.user.userID);
                if (!user) return res.send({ status: 400, message: "user-not-found" });

                // Check the TFA
                if (user.tfa.secret !== "") {
                    if (!req.body.tfaCode) return res.send({ status: 200, message: "requires-tfa" });
                    if (typeof req.body.tfaCode !== "string") return res.send({ status: 200, message: "invalid-tfa-code" });

                    let tfaResult = checkTFA(req.body.tfaCode, user, users);
                    if (tfaResult == "invalid-tfa-code") return res.send({ status: 200, message: "invalid-tfa-code" });
                }

                // Replace the user
                let newUserList = users.filter((listUser: User) => listUser.userID !== user?.userID);
                user.email = { value: req.body.newEmail, verified: false };
                newUserList.push(user);

                db.put("users", JSON.stringify(newUserList), (err: Error) => {
                    if (err) throw err;
                    return res.send({ status: 200, message: "success" });
                });
            });
        } catch (err) {
            let errorID = reportError(err);
            return res.send({ status: 500, message: "server-error", id: errorID });
        }
    }
);

// Password actions // TODO
router.post(
    "/change-password",
    rateLimit({
        windowMs: ms("1 hour"),
        max: launchArgs.dev == "true" ? 100 : 1,
        message: {
            status: 429,
            message: "rate-limit-exceeded",
        },
    }),
    (req: any, res: any) => {
        if (!req.isAuthenticated) return res.send({ status: 403, message: "unauthorized" });
        if (!req.body.oldPassword || !req.body.newPassword) return res.send({ status: 400, message: "missing-parameters" });
        if (typeof req.body.oldPassword !== "string" || typeof req.body.newPassword !== "string")
            return res.send({ status: 400, message: "invalid-parameters" });

        try {
            db.get("users", (err: any, userString: string) => {
                if (err) {
                    if (err.type == "NotFoundError") {
                        db.put("users", JSON.stringify([]), (newErr: any) => {
                            console.log(newErr);
                            if (newErr) throw err;
                            return res.send({ status: 200, message: "try-again" });
                        });
                    } else throw err;
                }

                // Get the user
                let users: Array<User> = JSON.parse(userString);
                let user: User | undefined = users.find((user: any) => user.email.value == req.user.email.value);
                if (!user) return res.send({ status: 400, message: "user-not-found" });

                // Check if the password is right
                if (!bcrypt.compareSync(req.body.oldPassword, user.password)) return res.send({ status: 403, message: "unauthorized" });

                // Check tfa is provided
                if (user.tfa.secret !== "") {
                    if (!req.body.tfaCode) return res.send({ status: 200, message: "requires-tfa" });
                    if (typeof req.body.tfaCode !== "string") return res.send({ status: 200, message: "invalid-tfa-code" });

                    let tfaResult = checkTFA(req.body.tfaCode, user, users);
                    if (tfaResult == "invalid-tfa-code") return res.send({ status: 200, message: "invalid-tfa-code" });
                }

                // Replace the user with the user with the new password
                let newUserList = users.filter((listUser: User) => listUser.userID !== user?.userID);
                user.password = bcrypt.hashSync(req.body.newPassword, 10);

                // Push to db
                newUserList.push(user);
                db.put("users", JSON.stringify(newUserList), (err: any) => {
                    if (err) throw err;

                    // Send to client
                    return res.status(200).send({
                        status: 200,
                        message: "success",
                    });
                });
            });
        } catch (err) {
            let errorID = reportError(err);
            return res.send({ status: 500, message: "server-error", id: errorID });
        }
    }
);

router.post("/reset-password", (req: any, res: any) => {});

// TFA related
router.post(
    "/activate-tfa",
    rateLimit({
        windowMs: ms("1 hour"),
        max: launchArgs.dev == "true" ? 100 : 1,
        message: {
            status: 429,
            message: "rate-limit-exceeded",
        },
    }),
    (req: any, res: any) => {
        try {
            if (!req.isAuthenticated()) return res.send({ status: 403, message: "not-logged-in" });

            db.get("users", (err: any, userString: any) => {
                if (err) {
                    if (err.type == "NotFoundError") {
                        db.put("users", JSON.stringify([]), (err: Error) => {
                            if (err) throw err;
                            return res.send({ status: 400, message: "user-not-found" });
                        });
                    } else throw err;
                }

                // Find the user
                let users: Array<User> = JSON.parse(userString);
                let user: User | undefined = users.find((user: any) => user.userID == req.user.userID);

                // Check if user exists, if so, check if tfa is already activated, and if email is verified
                if (!user) return res.send({ status: 400, message: "user-not-found" });
                if (user.tfa.secret !== "") return res.send({ status: 400, message: "tfa-already-activated" });
                // if (user.email.verified == false) return res.send({ status: 400, message: "email-not-verified" });

                // Generate our secret
                let secret: any = speakeasy.generateSecret({ length: 20 });

                let newUserList: Array<User> = users.filter((user: User) => user.userID !== req.user.userID);
                user.tfa.secret = secret.base32;
                newUserList.push(user);

                // Generate the qr code
                qrcode.toDataURL(secret.otpauth_url, (err: any, image_data: string) => {
                    if (err) throw err;

                    db.put("users", JSON.stringify(newUserList), (err: any) => {
                        if (err) throw err;

                        // Send to client
                        return res.send({
                            status: 200,
                            image: image_data,
                            code: secret.otpauth_url,
                        });
                    });
                });
            });
        } catch (err) {
            let errorID = reportError(err);
            return res.send({ status: 500, message: "server-error", id: errorID });
        }
    }
);

router.post(
    "/deactivate-tfa",
    rateLimit({
        windowMs: ms("1 hour"),
        max: launchArgs.dev == "true" ? 100 : 1,
        message: {
            status: 429,
            message: "rate-limit-exceeded",
        },
    }),
    (req: any, res: any) => {
        if (!req.isAuthenticated()) return res.send({ status: 403, message: "unauthorized" });
        if (!req.body.code) return res.send({ code: 400, status: "missing-parameters" });
        if (typeof req.body.code !== "string") return res.send({ code: 400, message: "invalid-parameters" });

        try {
            db.get("users", (err: any, userString: string) => {
                if (err) {
                    if (err.type == "NotFoundError") {
                        db.put("users", JSON.stringify([]), (err: Error) => {
                            if (err) throw err;
                            return res.send({ status: 400, message: "user-not-found" });
                        });
                    } else throw err;
                }

                // Get the user
                let users: Array<User> = JSON.parse(userString);
                let user: User | undefined = users.find((user: any) => user.userID == req.user.userID);

                // If the user isn't found, if the tfa is not active, or if the email is not verified
                if (!user) return res.send({ status: 400, message: "user-not-found" });
                if (user?.tfa.secret == "") return res.send({ status: 200, message: "tfa-not-active" });
                if (user.email.verified == false) return res.send({ status: 400, message: "email-not-verified" });

                // Check if the tfa code
                let tfaResult = checkTFA(req.body.tfaCode, user, users);
                if (tfaResult == "invalid-tfa-code") return res.send({ status: 200, message: "invalid-tfa-code" });

                // Remove the secret, and replace the user in the DB with the new user without the secret
                user.tfa.secret = "";
                let newUserList = users.filter((listUser: User) => listUser.email !== user?.email);
                newUserList.push(user);

                // Push changes to the DB
                db.put("users", JSON.stringify(newUserList), (err: any) => {
                    if (err) throw err;

                    // Send to client
                    return res.status(200).send({
                        status: 200,
                        message: "success",
                    });
                });
            });
        } catch (err) {
            let errorID = reportError(err);
            return res.send({ status: 500, message: "server-error", id: errorID });
        }
    }
);

router.post(
    "/verify-tfa",
    rateLimit({
        windowMs: ms("1 hour"),
        max: launchArgs.dev == "true" ? 100 : 1,
        message: {
            status: 429,
            message: "rate-limit-exceeded",
        },
    }),
    (req: any, res: any) => {
        if (!req.isAuthenticated()) return res.send({ code: 403, message: "unauthorized" });
        if (!req.body.code) return res.send({ code: 400, message: "missing-parameters" });
        if (typeof req.body.code !== "string") res.send({ code: 400, message: "invalid-parameters" });

        try {
            db.get("users", (err: any, userString: string) => {
                if (err) {
                    if (err.type == "NotFoundError") {
                        db.put("users", JSON.stringify([]), (err: Error) => {
                            if (err) throw err;
                            return res.send({ status: 400, message: "user-not-found" });
                        });
                    } else throw err;
                }

                // Get user list
                let users: Array<User> = JSON.parse(userString);
                let user: User | undefined = users.find((user) => user.userID == req.user.userID);

                // Check if user exists
                if (!user) return res.send({ code: 400, message: "user-not-found" });
                if (user.tfa.secret == "") return res.send({ code: 400, message: "tfa-not-active" });

                // I'll leave this like this, because we don't want the user to use a backup code instead of the code provided by the tfa app
                let verified = speakeasy.totp.verify({
                    secret: user.tfa.secret,
                    encoding: "base32",
                    token: req.body.code,
                });

                if (verified == false) return res.send({ status: 400, message: "invalid-tfa-code" });

                if (user.tfa.seenBackupCodes == true) return res.send({ code: 200, message: "backup-codes-seen" });

                // Generate codes
                let codeList: Array<string> = [];
                for (let i = 0; i < 10; i++) {
                    codeList.push(Math.random().toString(16).slice(2, 10));
                }

                // Hash codes
                let hashedCodes: Array<string> = [];
                codeList.forEach((code: string) => {
                    hashedCodes.push(bcrypt.hashSync(code, 10));
                });

                // Replace the old user with the new user
                let newUserList: Array<User> = users.filter((listUser: User) => listUser.userID !== user?.userID);
                user.tfa.backupCodes = hashedCodes;
                user.tfa.seenBackupCodes = true;
                newUserList.push(user);

                // Push to the DB
                db.put("users", JSON.stringify(newUserList), (err: any) => {
                    if (err) throw err;
                    return res.send({ status: 200, message: "success", codes: codeList });
                });
            });
        } catch (err) {
            let errorID = reportError(err);
            return res.send({ status: 500, message: "server-error", id: errorID });
        }
    }
);

// Tests
router.post("/check-use", (req: any, res: any) => {
    // Check that values are there and that they're the right type
    if (!req.body.email || !req.body.username) return res.send({ status: 400, message: "missing-params" });
    if (typeof req.body.email !== "string" || typeof req.body.username !== "string") return res.send({ status: 400, message: "invalid-error" });

    let { email, username } = req.body;

    try {
        // Get from db and parse
        db.get("users", async (err: any, users: any) => {
            if (err) {
                if (err.type == "NotFoundError") {
                    return db.put("users", JSON.stringify([]), (newErr: any) => {
                        if (newErr) throw err;
                        return res.send({ status: 200, message: "try-again" });
                    });
                } else throw err;
            }

            users = JSON.parse(users);

            // Test
            if (users.find((user: any) => user.email.value == email)) return res.send({ status: 200, message: "email-already-in-use" });
            if (users.find((user: any) => user.username == username)) return res.send({ status: 200, message: "username-already-in-use" });

            return res.send({ status: 200, message: "all-good" });
        });
    } catch (err) {
        let errorID = reportError(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});

router.post("/test", async (req: any, res: any) => {
    db.get("users", (err: any, userString: any) => {
        if (err) {
            if (err.type == "NotFoundError") {
                return db.put("users", JSON.stringify([]), (err: Error) => {
                    if (err) throw err;
                    return "user-not-found";
                });
            } else throw err;
        }

        // Find the user
        let users: Array<User> = JSON.parse(userString);
        let user: any = users.find((user: any) => user.userID == req.user.userID);

        if (user.tfa.secret !== "") {
            if (!req.body.tfaCode) return res.send({ status: 200, message: "requires-tfa" });
            if (typeof req.body.tfaCode !== "string") return res.send({ status: 200, message: "invalid-tfa-code" });

            let checked = checkTFA(req.body.tfaCode, user, users);
            console.log(checked);
        }

        return "success";
    });
});

router.post("/test-auth", (req, res) => {
    db.put("users", JSON.stringify([]));
});

module.exports = router;
