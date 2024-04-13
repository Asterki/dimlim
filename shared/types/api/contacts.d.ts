// Add contact
interface AddRequestBody {
    username: string;
}
interface AddResponseData {
    status:
        | "unauthenticated"
        | "success"
        | "invalid-parameters"
        | "user-exists"
        | "cannot-add-self"
        | "user-not-found"
        | "internal-error";
}

// Block contact
interface BlockRequestBody {
    username: string;
}
interface BlockResponseData {
    status:
        | "unauthenticated"
        | "success"
        | "invalid-parameters"
        | "user-exists"
        | "cannot-block-self"
        | "user-not-found"
        | "internal-error";
}

// Get contacts
interface Contact {
    profile: {
        username: string;
    };
    userID: string;
}
interface GetResponseData {
    status: "unauthenticated" | "success" | "internal-error";
    contacts?: {
        accepted: Contact[];
        pending: Contact[];
        requests: Contact[];
        blocked: Contact[];
    };
}


// Pending
interface PendingRequestBody {
    username: string;
    action: "accept" | "reject";
}
interface PendingResponseData {
    status:
        | "unauthenticated"
        | "success"
        | "invalid-parameters"
        | "cannot-add-self"
        | "user-not-found"
        | "internal-error";
}

// Remove
interface RemoveRequestBody {
    username: string;
}
interface RemoveResponseData {
    status:
        | "unauthenticated"
        | "success"
        | "invalid-parameters"
        | "cannot-remove-self"
        | "user-not-found"
        | "internal-error";
}

// Unblock
interface UnblockRequestBody {
    username: string;
}
interface UnblockResponseData {
    status:
        | "unauthenticated"
        | "success"
        | "invalid-parameters"
        | "cannot-unblock-self"
        | "user-not-found"
        | "internal-error";
}

export type {
    AddRequestBody,
    AddResponseData,
    BlockRequestBody,
    BlockResponseData,
    Contact,
    GetResponseData,
    PendingRequestBody,
    PendingResponseData,
    RemoveRequestBody,
    RemoveResponseData,
    UnblockRequestBody,
    UnblockResponseData,
};
