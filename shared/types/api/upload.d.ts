interface UploadAvatarRequestBody {
    image: string;
}

type UploadAvatarResponse = "done" | "invalid-parameters" | "unauthorized"

export type {
    UploadAvatarRequestBody,
    UploadAvatarResponse
}