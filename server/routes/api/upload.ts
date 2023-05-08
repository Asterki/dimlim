import express from "express";

import { z } from 'zod'

import { uploadAvatar } from "../../services/upload";

import { UploadAvatarRequestBody, UploadAvatarResponse } from "../../../shared/types/api/upload"
import { User } from "../../../shared/types/models";

const router: express.Router = express.Router();

router.post(
    "/avatar",
    async (req: express.Request<unknown, UploadAvatarResponse, UploadAvatarRequestBody>, res: express.Response<UploadAvatarResponse>) => {
        if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

        try {
            // Validate fields
            const parsedBody = z
                .object({
                    image: z.string(),
                })
                .required()
                .safeParse(req.body);


            if (!parsedBody.success && 'error' in parsedBody) return res.status(400).send("invalid-parameters");

            const base64Data = parsedBody.data.image.replace(/^data:image\/jpeg;base64,/, "");
            await uploadAvatar((req.user as User).userID, base64Data)

            res.send("done")
        } catch (err) {
            res.status(500);
        }
    }
);

module.exports = router;
