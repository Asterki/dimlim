import express from "express";
import { z } from "zod";
import validator from "validator";

import {
    usersServiceActivateTFA,
    usersServiceChangeEmail,
    usersServiceChangePassword,
    usersServiceDeactivateTFA,
    usersServiceSendEmailVerificationEmail,
    usersServiceAddContact,
    usersServiceRemoveContact,
    usersServiceVerifyEmail,
    usersServiceRemoveAvatar,
} from "../../services/users";

import {
    ActivateTFAResponse,
    AddContactRequestBody,
    AddContactResponse,
    ChangeEmailRequestBody,
    ChangeEmailResponse,
    ChangePasswordRequestBody,
    ChangePasswordResponse,
    DeactivateTFARequestBody,
    DeactivateTFAResponse,
    RemoveAvatarResponse,
    RemoveContactRequestBody,
    RemoveContactResponse,
    SendVerifyEmailRequestBody,
    SendVerifyEmailResponse,
    VerifyEmailRequestQuery,
} from "../../../shared/types/api/users";
import { User } from "../../../shared/types/models";
import { ActivateTFARequestBody } from "../../../shared/types/api/users";

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

            if (!parsedBody.success && 'error' in parsedBody) return res.status(400).send("invalid-parameters");

            const result = await usersServiceAddContact((req.user as User).userID, parsedBody.data.contactUsername);
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

            if (!parsedBody.success && 'error' in parsedBody) return res.status(400).send("invalid-parameters");

            const result = await usersServiceRemoveContact((req.user as User).userID, parsedBody.data.contactUsername);
            return res.send(result);
        } catch (err: unknown) {
            res.status(500);
        }
    }
);

router.post("/remove-avatar", async (req: express.Request, res: express.Response<RemoveAvatarResponse>) => {
    if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

    try {
        const result = await usersServiceRemoveAvatar((req.user as User).userID)
        return res.status(200).send(result);
    } catch (err: unknown) {
        res.status(500);
    }
})

router.post(
    "/change-email",
    async (
        req: express.Request<unknown, ChangeEmailResponse, ChangeEmailRequestBody>,
        res: express.Response<ChangeEmailResponse>
    ) => {
        if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

        try {
            const parsedBody = z
                .object({
                    newEmail: z.string().refine(validator.isEmail),
                    password: z.string(),
                })
                .required()
                .safeParse(req.body);

            if (!parsedBody.success && 'error' in parsedBody) return res.status(400).send("invalid-parameters");

            const result = await usersServiceChangeEmail(
                parsedBody.data.password,
                parsedBody.data.newEmail,
                (req.user as User).userID
            );
            return res.status(200).send(result);
        } catch (err: unknown) {
            res.status(500);
        }
    }
);

router.post(
    "/change-password",
    async (
        req: express.Request<unknown, ChangePasswordResponse, ChangePasswordRequestBody>,
        res: express.Response<ChangePasswordResponse>
    ) => {
        if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

        try {
            const parsedBody = z
                .object({
                    password: z.string(),
                    newPassword: z.string(),
                })
                .required()
                .safeParse(req.body);

            if (!parsedBody.success && 'error' in parsedBody) return res.status(400).send("invalid-parameters");

            const result = await usersServiceChangePassword(
                parsedBody.data.password,
                parsedBody.data.newPassword,
                (req.user as User).userID
            );
            return res.status(200).send(result);
        } catch (err: unknown) {
            res.status(500);
        }
    }
);

router.post(
    "/activate-tfa",
    async (
        req: express.Request<unknown, ActivateTFAResponse, ActivateTFARequestBody>,
        res: express.Response<ActivateTFAResponse>
    ) => {
        if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

        try {
            const parsedBody = z
                .object({
                    tfaCode: z.string(),
                    tfaSecret: z.string(),
                })
                .required()
                .safeParse(req.body);

            if (!parsedBody.success && 'error' in parsedBody) return res.status(400).send("invalid-parameters");

            const result = await usersServiceActivateTFA(
                parsedBody.data.tfaSecret,
                parsedBody.data.tfaCode,
                (req.user as User).userID
            );
            return res.status(200).send(result);
        } catch (err: unknown) {
            res.status(500);
        }
    }
);

router.post(
    "/deactivate-tfa",
    async (
        req: express.Request<unknown, DeactivateTFAResponse, DeactivateTFARequestBody>,
        res: express.Response<DeactivateTFAResponse>
    ) => {
        if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

        try {
            const parsedBody = z
                .object({
                    password: z.string(),
                })
                .required()
                .safeParse(req.body);

            if (!parsedBody.success && 'error' in parsedBody) return res.status(400).send("invalid-parameters");

            const result = await usersServiceDeactivateTFA(parsedBody.data.password, (req.user as User).userID);
            return res.status(200).send(result);
        } catch (err: unknown) {
            res.status(500);
        }
    }
);

router.post(
    "/send-email-verification-email",
    async (
        req: express.Request<unknown, SendVerifyEmailResponse, SendVerifyEmailRequestBody>,
        res: express.Response<SendVerifyEmailResponse>
    ) => {
        if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

        try {
            const parsedBody = z
                .object({
                    locale: z.enum((process.env.NEXT_PUBLIC_LOCALES as any).split(",") ?? "en"),
                })
                .required()
                .safeParse(req.body);

            if (!parsedBody.success && 'error' in parsedBody) return res.status(400).send("invalid-parameters");

            const result = await usersServiceSendEmailVerificationEmail(req.user as User, parsedBody.data.locale);
            res.send(result);
        } catch (err: unknown) {
            res.status(500);
        }
    }
);

// * Note: no types for the response, since it redirects instead of sending a response message
router.get("/verify-email", async (req: express.Request<VerifyEmailRequestQuery>, res: express.Response) => {
    if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized")

    try {
        const parsedQuery = z
            .object({
                code: z.string(),
            })
            .required()
            .safeParse(req.query);

        if (!parsedQuery.success) return res.status(400).send("invalid-parameters");

        const result = await usersServiceVerifyEmail(parsedQuery.data.code)

        if (result == "done") return res.redirect("/accounts/verify-email?success=true")
        else return res.redirect(`/accounts/verify-email?error=${result}`)
    } catch (err: unknown) {
        res.status(500);
    }
});

module.exports = router;
