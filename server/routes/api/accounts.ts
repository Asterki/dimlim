import express from "express";
import passport from "passport";

import validator from "validator";
import { z } from "zod";

import { accountsServiceRegisterUser, accountsServiceDeleteUser } from "../../services/accounts";

import {
	RegisterResponse,
	DeleteAccountResponse,
	LoginResponse,
	RegisterRequestBody,
	DeleteAccountRequestBody,
	LoginRequestBody,
	LogoutResponse,
} from "../../../shared/types/api/accounts";
import { User } from "../../../shared/types/models";

const router: express.Router = express.Router();

// Account creation and deletion
router.post(
	"/register",
	async (req: express.Request<unknown, RegisterResponse, RegisterRequestBody>, res: express.Response<RegisterResponse>) => {
		try {
			// Validate fields
			const parsedBody = z
				.object({
					username: z
						.string()
						.min(3)
						.max(16)
						.refine((username) => {
							return validator.isAlphanumeric(username, "en-GB", {
								ignore: "._",
							});
						}),
					email: z.string().refine(validator.isEmail),
					password: z.string().min(6).max(256),
				})
				.required()
				.safeParse(req.body);

			if (!parsedBody.success && 'error' in parsedBody) return res.status(400).send("invalid-parameters");

			// Register the user
			const user = await accountsServiceRegisterUser(
				parsedBody.data.username,
				parsedBody.data.email,
				parsedBody.data.password
			);
			if (user == "username-email-in-use") return res.send("username-email-in-use");

			// Login the user
			req.login(user, (err: unknown) => {
				if (err) throw err;
				return res.send("done");
			});
		} catch (err: unknown) {
			return res.status(500);
		}
	}
);

router.post(
	"/delete-account",
	async (
		req: express.Request<unknown, DeleteAccountResponse, DeleteAccountRequestBody>,
		res: express.Response<DeleteAccountResponse>
	) => {
		if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

		try {
			const parsedBody = z
				.object({
					password: z.string(),
					tfaCode: z.string().optional(),
				})
				.required()
				.safeParse(req.body);

			if (!parsedBody.success && 'error' in parsedBody) return res.status(400).send("invalid-parameters");

			const result = await accountsServiceDeleteUser(req.user as User, parsedBody.data.password, parsedBody.data.tfaCode);
			if (result !== "done") return res.send(result);

			req.logout(async (err: unknown) => {
				if (err) throw err;
				return res.status(200).send("done");
			});
		} catch (err: unknown) {
			return res.status(500);
		}
	}
);

// Account access
router.post(
	"/login",
	(req: express.Request<unknown, LoginResponse, LoginRequestBody>, res: express.Response<LoginResponse>, next) => {
		try {
			const parsedBody = z
				.object({
					email: z.string().refine(validator.isEmail),
					password: z.string(),
					tfaCode: z.string().optional(),
				})
				.required()
				.safeParse(req.body);

			if (!parsedBody.success && 'error' in parsedBody) return res.status(400).send("invalid-parameters" as LoginResponse);

			passport.authenticate(
				"local",
				(
					err: unknown | null,
					user: User,
					result: { message: "invalid-credentials" | "requires-tfa" | "invalid-tfa-code" }
				) => {
					if (err) throw err;
					if (!user) return res.send(result.message);

					req.logIn(user, (err: unknown) => {
						if (err) throw err;
						return res.send("done" as LoginResponse);
					});
				}
			)(req, res, next);
		} catch (err: unknown) {
			res.status(500);
		}
	}
);

router.post("/logout", (req: express.Request<unknown, LogoutResponse, unknown>, res: express.Response<LogoutResponse>) => {
	try {
		if (!req.isAuthenticated()) return res.send("ok");

		// Logout
		req.logout((err: unknown) => {
			if (err) throw err;
			res.send("ok");
		});
	} catch (err: unknown) {
		res.status(500);
	}
});

module.exports = router;
