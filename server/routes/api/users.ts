import express from "express";
import { z } from "zod";
import validator from "validator";

import {
	activateTFA,
	changeEmail,
	changePassword,
	deactivateTFA,
	usersServiceAddContact,
	usersServiceRemoveContact,
} from "../../services/users";

import {
	ActivateTFAResponse,
	AddContactRequestBody,
	AddContactResponse,
	ChangeEmailRequestBody,
	ChangeEmailResponse,
	ChangePasswordRequestBody,
	ChangePasswordResponse,
	RemoveContactRequestBody,
	RemoveContactResponse,
} from "../../../shared/types/api/users";
import { User } from "../../../shared/types/models";

const router: express.Router = express.Router();

router.post(
	"/add-contact",
	async (
		req: express.Request<unknown, AddContactResponse, AddContactRequestBody>,
		res: express.Response<AddContactResponse>
	) => {
		if (!req.isAuthenticated()) return res.status(403).send("unauthorized");

		try {
			const parsedBody = z
				.object({
					contactUsername: z.string(),
				})
				.required()
				.safeParse(req.body);

			if (!parsedBody.success) return res.status(400).send("invalid-parameters");

			const result = await usersServiceAddContact((req.user as User).userID, parsedBody.data.contactUsername);
			return res.send(result);
		} catch (err: unknown) {
			res.status(500);
		}
	}
);

router.post(
	"/remove-contact",
	async (
		req: express.Request<unknown, RemoveContactResponse, RemoveContactRequestBody>,
		res: express.Response<RemoveContactResponse>
	) => {
		if (!req.isAuthenticated()) return res.status(403).send("unauthorized");

		try {
			const parsedBody = z
				.object({
					contactUsername: z.string(),
				})
				.required()
				.safeParse(req.body);

			if (!parsedBody.success) return res.status(400).send("invalid-parameters");

			const result = await usersServiceRemoveContact((req.user as User).userID, parsedBody.data.contactUsername);
			return res.send(result);
		} catch (err: unknown) {
			res.status(500);
		}
	}
);

router.post(
	"/change-email",
	async (
		req: express.Request<unknown, ChangeEmailResponse, ChangeEmailRequestBody>,
		res: express.Response<ChangeEmailResponse>
	) => {
		if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

		try {
			const parsedBody = z
				.object({
					newEmail: z.string().refine(validator.isEmail),
					password: z.string(),
				})
				.required()
				.safeParse(req.body);

			if (!parsedBody.success) return res.status(400).send("invalid-parameters");

			const result = await changeEmail(parsedBody.data.password, parsedBody.data.newEmail, (req.user as User).userID);
			return res.status(200).send(result);
		} catch (err: unknown) {
			res.status(500);
		}
	}
);

router.post(
	"/change-password",
	async (
		req: express.Request<unknown, ChangePasswordResponse, ChangePasswordRequestBody>,
		res: express.Response<ChangePasswordResponse>
	) => {
		if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

		try {
			const parsedBody = z
				.object({
					password: z.string(),
					newPassword: z.string(),
				})
				.required()
				.safeParse(req.body);

			if (!parsedBody.success) return res.status(400).send("invalid-parameters");

			const result = await changePassword(parsedBody.data.password, parsedBody.data.newPassword, (req.user as User).userID);
			return res.status(200).send(result);
		} catch (err: unknown) {
			res.status(500);
		}
	}
);

router.post(
	"/activate-tfa",
	async (
		req: express.Request<unknown, ActivateTFAResponse, ActivateTFAResponse>,
		res: express.Response<ActivateTFAResponse>
	) => {
		if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

		try {
			const parsedBody = z
				.object({
					tfaCode: z.string(),
					tfaSecret: z.string(),
				})
				.required()
				.safeParse(req.body);

			if (!parsedBody.success) return res.status(400).send("invalid-parameters");

			const result = await activateTFA(parsedBody.data.tfaSecret, parsedBody.data.tfaCode, (req.user as User).userID);
			return res.status(200).send(result);
		} catch (err: unknown) {
			res.status(500);
		}
	}
);

router.post("/deactivate-tfa", async (req, res) => {
	if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

	try {
		const parsedBody = z
			.object({
				password: z.string(),
			})
			.required()
			.safeParse(req.body);

		if (!parsedBody.success) return res.status(400).send("invalid-parameters");

		const result = await deactivateTFA(parsedBody.data.password, (req.user as User).userID);
		return res.status(200).send(result);
	} catch (err: unknown) {
		res.status(500);
	}
});

module.exports = router;
