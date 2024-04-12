interface User {
    userID: string;
    created: number;
    profile: {
        username: string;
        avatar: string;
        email: {
            value: string;
            verified: boolean;
        };
        imageID: string;
    };
    contacts: {
        blocked: string[];
        pending: string[];
        requests: string[];
        accepted: string[];
    };
    pubKey: Buffer;
    preferences: {
        privacy: {
            showOnlineStatus: boolean;
            showLastSeen: boolean;
            showReadReceipts: boolean;
        };
        notifications: {
            showNotifications: boolean;
            playSound: boolean;
        };
        general: {
            theme: string;
            language: string;
        };
        security: {
            twoFactor: {
                active: boolean;
                secret?: string;
            };
            password: string;
        };
    };
}

interface EmailVerificationCode {
    code: string;
    userID: string;
    expires: number;
}

export type { User, EmailVerificationCode };
