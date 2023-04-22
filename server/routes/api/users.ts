import express from "express";
import { z } from "zod";
import validator from "validator";

import {
	changeEmail,
	usersServiceAddContact,
	usersServiceRemoveContact,
} from "../../services/users";

import {
	AddContactRequestBody,
	AddContactResponse,
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

			const result = await usersServiceAddContact(
				(req.user as User).userID,
				parsedBody.data.contactUsername
			);
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

			const result = await usersServiceRemoveContact(
				(req.user as User).userID,
				parsedBody.data.contactUsername
			);
			return res.send(result);
		} catch (err: unknown) {
			res.status(500);
		}
	}
);

router.post("/change-email", async (req: any, res: any) => {
	if (!req.isAuthenticated() || req.user == undefined)
		return res.status(403).send("unauthorized");

	try {
		const parsedBody = z
			.object({
				email: z.string().refine(validator.isEmail, {
					message: "invalid-email",
				}),
			})
			.required()
			.safeParse(req.body);

		if (!parsedBody.success) return res.status(400).send("invalid-parameters");

		const result = await changeEmail(parsedBody.data.email, req.user.userID);
		return res.status(200).send(result);
	} catch (err: unknown) {
		res.status(500);
	}
});

module.exports = router;
