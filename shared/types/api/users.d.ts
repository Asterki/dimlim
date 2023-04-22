// Contacts
interface AddContactRequestBody {
	contactUsername: string;
}

type AddContactResponse = "unauthorized" | "invalid-parameters" | "user-not-found" | "success";

interface RemoveContactRequestBody {
	contactUsername: string;
}

type RemoveContactResponse = "unauthorized" | "invalid-parameters" | "user-not-found" | "success";

// Export types
export type {
	AddContactRequestBody,
	AddContactResponse,
	RemoveContactRequestBody,
	RemoveContactResponse,
};
