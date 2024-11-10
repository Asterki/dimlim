import axios from 'axios';

import type {
  AddResponseData,
  BlockResponseData,
  GetResponseData,
  RemoveResponseData,
  RequestsResponseData,
  UnblockResponseData,
  FetchContactResponse,
  GetPubKeyResponseData,
} from '../../../../../shared/types/api/contacts';

const apiEndpoint = `${import.meta.env.VITE_SERVER_HOST}/api/contacts`;

const fetchContacts = async () => {
  try {
    const { data } = await axios.get<GetResponseData>(`${apiEndpoint}/get`, { withCredentials: true });
    return data.contacts;
  } catch (err) {
    return {
      accepted: [],
      pending: [],
      blocked: [],
      requests: [],
    };
  }
};

const fetchContactByUsername = async (username: string) => {
  try {
    const { data } = await axios.post<FetchContactResponse>(
      `${apiEndpoint}/fetch`,
      { username },
      { withCredentials: true },
    );
    return data;
  } catch (err) {
    return null;
  }
};

const addContact = async (contactID: string) => {
  try {
    const { data } = await axios.post<AddResponseData>(`${apiEndpoint}/add`, { contactID }, { withCredentials: true });
    return data.status;
  } catch (err) {
    return 'internal-error';
  }
};

const removeContact = async (contactID: string) => {
  try {
    const { data } = await axios.post<RemoveResponseData>(
      `${apiEndpoint}/remove`,
      { contactID },
      { withCredentials: true },
    );
    return data.status;
  } catch (err) {
    return 'internal-error';
  }
};

const blockContact = async (contactID: string) => {
  try {
    const { data } = await axios.post<BlockResponseData>(
      `${apiEndpoint}/block`,
      { contactID },
      { withCredentials: true },
    );
    return data.status;
  } catch (err) {
    return 'internal-error';
  }
};

const unblockContact = async (contactID: string) => {
  try {
    const { data } = await axios.post<UnblockResponseData>(
      `${apiEndpoint}/unblock`,
      { contactID },
      { withCredentials: true },
    );
    return data.status;
  } catch (err) {
    return 'internal-error';
  }
};

const contactRequests = async (contactID: string, action: 'accept' | 'reject' | 'cancel') => {
  try {
    const { data } = await axios.post<RequestsResponseData>(
      `${apiEndpoint}/requests`,
      { contactID, action },
      { withCredentials: true },
    );
    return data.status;
  } catch (err) {
    return 'internal-error';
  }
};

const getContactPubKey = async (contactID: string) => {
  try {
    const { data } = await axios.post<GetPubKeyResponseData>(`${apiEndpoint}/getPubKey`, { contactID }, { withCredentials: true });
    return data.key;
  } catch (err) {
    return null;
  }
};

export default {
  fetchContacts,
  addContact,
  removeContact,
  blockContact,
  unblockContact,
  contactRequests,
  fetchContactByUsername,
  getContactPubKey
};
