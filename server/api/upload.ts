import express from "express";
import ms from "ms";
import rateLimit from "express-rate-limit";

import { avatarUpload } from "../config/upload";
import { reportError } from "../utils/error";

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
                    throw err;
                }

                return res.send({ status: 200, message: "success" });
            });
        } catch (err) {
            let errorID = reportError(err);
            return res.send({ status: 500, message: "server-error", id: errorID });
        }
    }
);

module.exports = router;
