interface AddRemoveBlockUnblockRequestBody {
  username: string;
}

interface AddResponseData {
  status:
    | 'success'
    | 'user-not-found'
    | 'contact-not-found'
    | 'user-blocked'
    | 'internal-error'
    | 'request-pending'
    | 'request-sent'
    | 'already-contact'
    | 'contact-blocked'
    | 'contact-request-sent';
}

interface BlockResponseData {
  status: 'success' | 'user-not-found' | 'internal-error' | 'contact-not-found' | 'not-contact';
}

interface Contact {
  profile: { username: string };
  userID: string;
}

interface GetResponseData {
  status: 'unauthenticated' | 'success' | 'internal-error';
  contacts?: {
    accepted: String[];
    pending: String[];
    requests: String[];
    blocked: String[];
  };
}

interface PendingRequestBody {
  username: string;
  action: 'accept' | 'reject';
}

interface PendingResponseData {
  status:
    | 'success'
    | 'user-not-found'
    | 'internal-error'
    | 'contact-not-found'
    | 'user-blocked'
    | 'request-pending'
    | 'request-sent'
    | 'already-contact'
    | 'contact-blocked'
    | 'contact-request-sent'
    | 'no-request';
}

interface RemoveResponseData {
  status: 'user-not-found' | 'contact-not-found' | 'not-contact' | 'success' | 'internal-error';
}

interface UnblockResponseData {
  status: 'success' | 'user-not-found' | 'internal-error' | 'contact-not-found' | 'not-contact';
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
