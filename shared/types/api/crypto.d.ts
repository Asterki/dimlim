// Update public key
interface UpdatePublicKeyRequestBody {
    pubKey: string;
}

type UpdatePublicKeyResponse = "unauthorized" | "invalid-parameters" | "done"

// Get public key
interface GetPublicKeyRequestBody {
    user: string;
}

type GetPublicKeyResponse = "unauthorized" | "invalid-parameters" | string | boolean

export type {
    UpdatePublicKeyRequestBody,
    UpdatePublicKeyResponse,
    GetPublicKeyRequestBody,
    GetPublicKeyResponse
}