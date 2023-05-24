import express from "express";

import { z } from 'zod'
import { User } from "../../../shared/types/models";

import { updatePublicKey } from "../../services/crypto";

const router: express.Router = express.Router();

router.post(
    "/update-public-key",
    async (req: express.Request, res: express.Response) => {
        if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

        try {
            const parsedBody = z
                .object({
                    pubKey: z.string()
                })
                .required()
                .safeParse(req.body);

            if (!parsedBody.success && 'error' in parsedBody) return res.status(400).send("invalid-parameters");

            const publicKeyBuffer = Buffer.from(parsedBody.data.pubKey, "base64");
            await updatePublicKey((req.user as User).userID, publicKeyBuffer)
            res.send("done")
        } catch (err) {
            res.status(500);
        }
    }
);

module.exports = router;
