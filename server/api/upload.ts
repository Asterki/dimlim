import express from "express";
import ms from "ms";
import rateLimit from "express-rate-limit";

import { avatarUpload } from "../config/upload";

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

            avatarUpload.single("avatar")(req, res, (err) => {
                if (err) {
                    if (err.message == "invalid-type") return res.send({ status: 400, message: "invalid-file-type" });
                    return res.send({ status: 500, message: "server-error" });
                }

                return res.send({ status: 200, message: "success" });
            });
        } catch (err) {
            return res.send({ status: 500, message: "server-error" });
        }
    }
);

module.exports = router;
