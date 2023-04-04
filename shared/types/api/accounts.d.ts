//Register
interface RegisterRequestBody {
	username: string;
	email: string;
	password: string;
}

type RegisterResponse = "bad-request" | "username-email-in-use" | "done";

// Delete account
interface DeleteAccountRequestBody {
	password: string;
	tfaCode: string;
}

type DeleteAccountResponse = "unauthorized" | "bad-request" | "requires-tfa" | "done";

// Login
interface LoginRequestBody {
	email: string;
	password: string;
	tfaCode: string;
}

type LoginResponse = "bad-request" | "invalid-tfa-code" | "requires-tfa" | "invalid-credentials" | "done";

// Export types
export type { RegisterRequestBody, RegisterResponse, DeleteAccountRequestBody, DeleteAccountResponse, LoginRequestBody, LoginResponse };
