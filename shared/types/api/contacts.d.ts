import { User } from '../models';

interface AddRemoveBlockUnblockRequestBody {
  contactID: string;
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
    | 'contact-request-sent'
    | 'self-add';
}

interface BlockResponseData {
  status: 'success' | 'internal-error' | 'user-not-found' | 'self-remove' | 'not-contact' | 'self-block';
}

interface GetResponseData {
  status: 'unauthenticated' | 'success' | 'internal-error';
  contacts?: {
    accepted: {
      userID: string;
      profile:
        | {
            username: string;
            avatar: string;
            imageID: string;
            website: string;
            bio: string;
          }
        | null
        | undefined;
    }[];
    pending: {
      userID: string;
      profile:
        | {
            username: string;
            avatar: string;
            imageID: string;
            website: string;
            bio: string;
          }
        | null
        | undefined;
    }[];
    blocked: {
      userID: string;
      profile:
        | {
            username: string;
            avatar: string;
            imageID: string;
            website: string;
            bio: string;
          }
        | null
        | undefined;
    }[];
    requests: {
      userID: string;
      profile:
        | {
            username: string;
            avatar: string;
            imageID: string;
            website: string;
            bio: string;
          }
        | null
        | undefined;
    }[];
  };
}

interface RequestsRequestBody {
  contactID: string;
  action: 'accept' | 'reject';
}

interface RequestsResponseData {
  status:
    | 'success'
    | 'internal-error'
    | 'user-not-found'
    | 'no-request'
    | 'self-reject'
    | 'self-add'
    | 'user-blocked'
    | 'request-pending'
    | 'already-contact'
    | 'contact-blocked'
    | 'contact-request-sent';
}

interface RemoveResponseData {
  status: 'user-not-found' | 'contact-not-found' | 'not-contact' | 'success' | 'internal-error' | 'self-remove';
}

interface UnblockResponseData {
  status: 'success' | 'internal-error' | 'user-not-found' | 'self-remove' | 'not-contact' | 'self-unblock';
}

interface FetchContactRequestBody {
  username: string;
}

interface FetchContactResponse {
  status: 'success' | 'user-not-found' | 'internal-error' | 'blocked';
  contact?: {
    userID: string;
    profile: User.Profile;
  };
}

export type {
  AddResponseData,
  BlockResponseData,
  GetResponseData,
  RequestsRequestBody,
  RequestsResponseData,
  RemoveResponseData,
  AddRemoveBlockUnblockRequestBody,
  UnblockResponseData,
  FetchContactRequestBody,
  FetchContactResponse,
};
