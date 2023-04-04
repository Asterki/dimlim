import express from "express";

import passport from "passport";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy";

import validator from "validator";
import { z } from "zod";

import UserModel from "../../models/user";
import { accountsServiceRegisterUser } from "../../services/accounts";

import { RegisterResponse, DeleteAccountResponse, LoginResponse } from "../../../shared/types/api/accounts";

const router: express.Router = express.Router();

// Account creation and deletion
router.post("/register", async (req, res) => {
	try {
		const parsedBody = z
			.object({
				username: z
					.string()
					.min(3, {
						message: "invalid-username-length",
					})
					.max(16, {
						message: "invalid-username-length",
					})
					.refine(
						(username) => {
							return validator.isAlphanumeric(username, "en-GB", {
								ignore: "._",
							});
						},
						{
							message: "invalid-username",
						}
					),
				email: z.string().refine(validator.isEmail, {
					message: "invalid-email",
				}),
				password: z.string().min(6, { message: "invalid-password-length" }).max(256, { message: "invalid-password-length" }),
			})
			.required()
			.safeParse(req.body);

		if (!parsedBody.success) return res.status(400).send("bad-request" as RegisterResponse);

		const user = await accountsServiceRegisterUser(parsedBody.data.username, parsedBody.data.email, parsedBody.data.password);
		if (user == "username-email-in-use") return res.send("username-email-in-use" as RegisterResponse);

		req.login(user, (err: unknown) => {
			if (err) throw err;
			return res.send("done" as RegisterResponse);
		});
	} catch (err: unknown) {
		return res.status(500);
	}
});

router.post("/delete-account", async (req: any, res: any) => {
	if (!req.isAuthenticated()) return res.status(403).send("unauthorized" as DeleteAccountResponse);

	try {
		const parsedBody = z
			.object({
				password: z.string(),
				tfaCode: z.string().optional(),
			})
			.required()
			.safeParse(req.body);

		if (!parsedBody.success) return res.status(400).send("bad-request" as DeleteAccountResponse);

		// Comparing password and tfa
		if (!bcrypt.compareSync(req.body.password, req.user.password)) return res.status(403).send("unauthorized" as DeleteAccountResponse);

		// TODO: REFACTOR THIS PROCESS
		if (req.user.tfa.secret !== "") {
			if (!req.body.tfaCode) return res.status(200).send("requires-tfa" as DeleteAccountResponse);

			const verified = speakeasy.totp.verify({
				secret: req.user.tfa.secret,
				encoding: "base32",
				token: req.body.tfaCode,
			});

			if (verified == false) return res.status(403).send("unauthorized" as DeleteAccountResponse);
		}

		await UserModel.deleteOne({ userID: req.user.userID });

		req.logout(async (err: unknown) => {
			if (err) throw err;
			return res.status(200).send("done" as DeleteAccountResponse);
		});
	} catch (err: unknown) {
		return res.status(500);
	}
});

// Account access
router.post("/login", (req, res, next) => {
	try {
		const parsedBody = z
			.object({
				email: z.string().refine(validator.isEmail),
				password: z.string(),
				tfaCode: z.string().optional(),
			})
			.required()
			.safeParse(req.body);

		if (!parsedBody.success) return res.status(400).send("bad-request" as LoginResponse);

		passport.authenticate("local", (err: Error | null, user: any, result: any) => {
			if (err) throw err;

			if (!user) {
				if (result.message == "requires-tfa" || result.message == "invalid-tfa-code") return res.send({ status: 200, message: result.message });
				return res.send("invalid-credentials" as LoginResponse);
			}

			req.logIn(user, (err: unknown) => {
				if (err) throw err;
				return res.send("done" as LoginResponse);
			});
		})(req, res, next);
	} catch (err: unknown) {
		res.status(500);
	}
});

router.get("/logout", (req, res) => {
	try {
		if (!req.isAuthenticated()) return res.redirect("/");

		// Logout
		req.logout((err: unknown) => {
			if (err) throw err;
			res.redirect("/");
		});
	} catch (err: unknown) {
		res.send(500);
	}
});

module.exports = router;
