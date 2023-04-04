//Register
interface GetContactNamesRequestBody {
	contacts: Array<string>
}

type RegisterResponse = "bad-request" | "username-email-in-use" | "done";

// Export types
export type { RegisterRequestBody, RegisterResponse };
