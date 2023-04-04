import express from "express";
import { z } from "zod";

import { usersServiceAddContact, usersServiceRemoveContact } from "../../services/users";

const router: express.Router = express.Router();

router.post("/add-contact", async (req: any, res) => {
	if (!req.isAuthenticated()) return res.status(403).send("unauthorized");

	try {
		const parsedBody = z
			.object({
				contactUsername: z.string(),
			})
			.required()
			.safeParse(req.body);

		if (!parsedBody.success) return res.status(400).send("invalid-parameters");

		const result = usersServiceAddContact(req.user.userID, parsedBody.data.contactUsername);
		return res.send(result);
	} catch (err: unknown) {
		res.status(500);
	}
});

router.post("/remove-contact", async (req: any, res) => {
	if (!req.isAuthenticated()) return res.status(403).send("unauthorized");

	try {
		const parsedBody = z
			.object({
				contactUsername: z.string(),
			})
			.required()
			.safeParse(req.body);

		if (!parsedBody.success) return res.status(400).send("invalid-parameters");

		const result = await usersServiceRemoveContact(req.user.userID, parsedBody.data.contactUsername);
		return res.send(result);
	} catch (err: unknown) {
		res.status(500);
	}
});

module.exports = router;
