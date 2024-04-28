interface GenerateTFAResponseData {
    status: "success";
    data: speakeasy.GeneratedSecret;
}

interface VerifyTFAResponseData {
    status: "success" | "invalid-parameters";
    valid?: boolean;
}

export type {
    GenerateTFAResponseData,
    VerifyTFAResponseData
};