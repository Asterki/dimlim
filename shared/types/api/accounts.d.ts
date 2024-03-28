interface RegisterRequestBody {
    email: string;
    username: string;
    password: string;
}

interface RegisterResponseData {
    status: "success" | "invalid-parameters" | "user-exists";
}

export type { RegisterRequestBody, RegisterResponseData };
