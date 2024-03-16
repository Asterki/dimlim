interface User {
    userID: string;
    created: number;

    username: string;
    email: {
        value: string;
        verified: boolean;
    };

    avatar: string;
    locale: string;

    contacts: Array<{
        userID: string;
        username: string;
    }>;
    blockedContacts: Array<{
        userID: string;
        username: string;
    }>;

    password: string;
    pubKey: ArrayBuffer,

    tfa: {
        secret: string;
    };
}

interface EmailVerificationCode {
    code: string;
    userID: string;
    expires: number;
}

export type { User, EmailVerificationCode };