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
            if (!req.user) return res.status(403).send("unauthorized");

            avatarUpload.single("avatar")(req, res, (err) => {
                if (err.message == "invalid-type") return res.status(400).send("invalid-file-type");
                return res.status(200).send("success");
            });
        } catch (err) {
            return res.status(500).send("server-error");
        }
    }
);

module.exports = router;
