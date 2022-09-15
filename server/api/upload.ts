import express from "express";
import ms from "ms";
import rateLimit from "express-rate-limit";

import { avatarUpload } from "../config/upload";
import { reportError } from "../utils/error";
import db from "../config/databases";
import { User } from "../types";

const router: express.Router = express.Router();

router.post(
    "/avatar",
    rateLimit({
        windowMs: ms("1 hour"),
        max: 5,
        message: "rate-limit-exceeded",
    }),
    (req, res) => {
        try {
            if (!req.user) return res.send({ status: 403, message: "not-logged-in" });

            avatarUpload.single("avatar")(req, res, async (err) => {
                if (err) {
                    if (err.message == "invalid-type") return res.send({ status: 400, message: "invalid-file-type" });
                    throw err;
                }

                let users = await db.get("users");
                let user: User | undefined = users.find((user: User) => user.userID == (req.user as User).userID);

                if (!user) return res.send({ status: 400, message: "user-not-found" });

                // Replace the user
                let newUserList = users.filter((listUser: User) => listUser.userID !== user?.userID);
                user.avatar = `${(req.user as User).userID}.png`;

                newUserList.push(user);

                await db.set("users", newUserList);

                return res.redirect("/settings");
            });
        } catch (err) {
            let errorID = reportError(err);
            return res.send({ status: 500, message: "server-error", id: errorID });
        }
    }
);

module.exports = router;
