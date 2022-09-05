import speakeasy from "speakeasy";

interface User {
    username: string;
    email: {
        value: string;
        verified: boolean;
    };
    password: string;
    userID: string;
    tfaSecret: string;
}

export type { User };
