interface AddRemoveBlockUnblockRequestBody {
  username: string;
}

interface AddResponseData {
  status:
    | 'unauthenticated'
    | 'success'
    | 'invalid-parameters'
    | 'user-exists'
    | 'cannot-add-self'
    | 'user-not-found'
    | 'internal-error';
}

interface BlockResponseData {
  status:
    | 'unauthenticated'
    | 'success'
    | 'invalid-parameters'
    | 'user-exists'
    | 'cannot-block-self'
    | 'user-not-found'
    | 'internal-error';
}

interface Contact {
  profile: { username: string };
  userID: string;
}

interface GetResponseData {
  status: 'unauthenticated' | 'success' | 'internal-error';
  contacts?: {
    accepted: Contact[];
    pending: Contact[];
    requests: Contact[];
    blocked: Contact[];
  };
}

interface PendingRequestBody {
  username: string;
  action: 'accept' | 'reject';
}

interface PendingResponseData {
  status:
    | 'unauthenticated'
    | 'success'
    | 'invalid-parameters'
    | 'cannot-add-self'
    | 'user-not-found'
    | 'internal-error';
}

interface RemoveResponseData {
  status:
    | 'unauthenticated'
    | 'success'
    | 'invalid-parameters'
    | 'cannot-remove-self'
    | 'user-not-found'
    | 'internal-error';
}

interface UnblockResponseData {
  status:
    | 'unauthenticated'
    | 'success'
    | 'invalid-parameters'
    | 'cannot-unblock-self'
    | 'user-not-found'
    | 'internal-error';
}

export type {
  AddResponseData,
  BlockResponseData,
  Contact,
  GetResponseData,
  PendingRequestBody,
  PendingResponseData,
  RemoveResponseData,
  AddRemoveBlockUnblockRequestBody,
  UnblockResponseData,
};
