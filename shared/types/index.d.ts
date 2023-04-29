import type { User } from "./shared/types/models";

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}

type AvailableLocales = "en"

type EmailNames = "new-login" | "verify-email"

export type { AvailableLocales, EmailNames }