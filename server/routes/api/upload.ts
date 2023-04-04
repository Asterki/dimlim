import express from "express";
import rateLimit from "express-rate-limit";

import { avatarUpload } from "../../services/upload";
import UserModel from "../../models/user";

import { User } from "../../../shared/types/models";

const router: express.Router = express.Router();

router.post(
	"/avatar",
	rateLimit({
		windowMs: 1000 * 60 * 60,
		max: 5,
		message: "rate-limit-exceeded",
	}),
	(req: any, res) => {
        if (!req.isAuthenticated()) return res.status(403).send("unauthorized");
		
        try {
			avatarUpload.single("avatar")(req, res, async (err) => {
				if (err) {
					if (err.message == "invalid-type") return res.send({ status: 400, message: "invalid-file-type" });
					throw err;
				}

				const user: any | null = await UserModel.findOne({ userID: req.user.userID });
                if (!user) return res.status(400).send("invalid-parameters");

                user.avatar = `${(req.user as User).userID}.png`;

                user.save()
				return res.redirect("/settings");
			});
		} catch (err) {
			res.status(500);
		}
	}
);

module.exports = router;
