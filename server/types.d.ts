import speakeasy from "speakeasy";

interface User {
    userID: string;
    created: number;

    username: string;
    email: {
        value: string;
        verified: boolean;
    };

    avatar: string;
    bio: string
    preferredLanguage: string,

    contacts: Array;
    blockedContacts: Array;

    password: string;
    tfa: {
        secret: string;
        backupCodes: Array<string>;
        seenBackupCodes: boolean;
    };
}

interface EmailVerificationCode {
    code: string;
    email: string;
    expires: number;
}

export type { User, EmailVerificationCode };
