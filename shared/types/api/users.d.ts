// Add contact
interface AddContactRequestBody {
	contactUsername: string;
}

type AddContactResponse = "unauthorized" | "invalid-parameters" | "user-not-found" | "done";

// Remove contact
interface RemoveContactRequestBody {
	contactUsername: string;
}

type RemoveContactResponse = "unauthorized" | "invalid-parameters" | "user-not-found" | "done";

// Change email
interface ChangeEmailRequestBody {
	newEmail: string;
	password: string;
}

type ChangeEmailResponse = "unauthorized" | "invalid-parameters" | "email-in-use" | "done";

// Export types
export type {
	AddContactRequestBody,
	AddContactResponse,
	RemoveContactRequestBody,
	RemoveContactResponse,
	ChangeEmailRequestBody,
	ChangeEmailResponse,
};
