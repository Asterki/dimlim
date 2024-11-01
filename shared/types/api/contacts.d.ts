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
    | 'contact-request-sent';
}

interface BlockResponseData {
  status: 'success' | 'user-not-found' | 'internal-error' | 'contact-not-found' | 'not-contact';
}

interface GetResponseData {
  status: 'unauthenticated' | 'success' | 'internal-error';
  contacts?: User.Profile[];
}

interface RequestsRequestBody {
  contactID: string;
  action: 'accept' | 'reject';
}

interface RequestsResponseData {
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

interface FetchContactRequestBody {
  username: string;
}

interface FetchContactResponse {
  status: 'success' | 'user-not-found' | 'internal-error' | "blocked";
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
  FetchContactResponse
};
