import express from "express";

import { z } from 'zod'
import { User } from "../../../shared/types/models";

import { getUserPublicKey, updatePublicKey } from "../../services/crypto";
import { GetPublicKeyRequestBody, GetPublicKeyResponse, UpdatePublicKeyRequestBody, UpdatePublicKeyResponse } from "../../../shared/types/api/crypto"

const router: express.Router = express.Router();

router.post(
    "/update-public-key",
    async (req: express.Request<unknown, UpdatePublicKeyResponse, UpdatePublicKeyRequestBody>, res: express.Response<UpdatePublicKeyResponse>) => {
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

router.post("/get-public-key", async (req: express.Request<unknown, GetPublicKeyResponse, GetPublicKeyRequestBody>, res: express.Response<GetPublicKeyResponse>) => {
    if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

    try {
        const parsedBody = z
            .object({
                user: z.string()
            })
            .required()
            .safeParse(req.body);

        if (!parsedBody.success && 'error' in parsedBody) return res.status(400).send("invalid-parameters");

        const publicKey = await getUserPublicKey(parsedBody.data.user, (req.user as User).userID);
        res.send(publicKey)
    } catch (err) {
        res.status(500);
    }
})

module.exports = router;
