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

// Change password
interface ChangePasswordRequestBody {
	password: string;
	newPassword: string;
}

type ChangePasswordResponse = "unauthorized" | "invalid-parameters" | "invalid-password" | "done";

// Activate TFA
interface ActivateTFARequestBody {
	tfaCode: string;
	tfaSecret: string;
}

type ActivateTFAResponse = "unauthorized" | "invalid-parameters" | "done" | "invalid-code";

// Deactivate TFA
interface DeactivateTFARequestBody {
	password: string;
}

type DeactivateTFAResponse = "unauthorized" | "invalid-parameters" | "done" | "invalid-password";

// Export types
export type {
	AddContactRequestBody,
	AddContactResponse,
	RemoveContactRequestBody,
	RemoveContactResponse,
	ChangeEmailRequestBody,
	ChangeEmailResponse,
	ChangePasswordRequestBody,
	ChangePasswordResponse,
	ActivateTFARequestBody,
	ActivateTFAResponse,
	DeactivateTFARequestBody,
	DeactivateTFAResponse,
};
