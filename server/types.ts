import speakeasy from "speakeasy";

interface User {
    username: string;
    email: {
        value: string;
        verified: boolean;
    };
    password: string;
    userID: string;
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
