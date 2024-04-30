import { User } from "../models";

// Register
interface RegisterRequestBody {
    email: string;
    username: string;
    password: string;
}
interface RegisterResponseData {
    status: "success" | "invalid-parameters" | "user-exists" | "internal-error";
}

// Login
interface LoginRequestBody {
    emailOrUsername: string;
    password: string;
    tfaCode?: string;
}
interface LoginResponseData {
    status:
        | "success"
        | "invalid-parameters"
        | "invalid-credentials"
        | "requires-tfa"
        | "invalid-tfa-code"
        | "internal-error";
}

// Me
interface MeResponseData {
    status: "success" | "unauthenticated";
    user?: User;
}

// Logout
interface LogoutResponseData {
    status: "success" | "unauthenticated";
}

export type {
    RegisterRequestBody,
    RegisterResponseData,
    LoginRequestBody,
    LoginResponseData,
    MeResponseData,
    LogoutResponseData,
};
