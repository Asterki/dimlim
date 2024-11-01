import axios from 'axios';

import type {
  AddResponseData,
  BlockResponseData,
  GetResponseData,
  RemoveResponseData,
  RequestsResponseData,
  UnblockResponseData,
} from '../../../../../shared/types/api/contacts';

const apiEndpoint = `${import.meta.env.VITE_SERVER_HOST}/api/contacts`;

const fetchContacts = async () => {
  try {
    const { data } = await axios.get<GetResponseData>(`${apiEndpoint}/get`);
    return data.contacts;
  } catch (err) {
    return [];
  }
};

const addContact = async (contactID: string) => {
  try {
    const { data } = await axios.post<AddResponseData>(`${apiEndpoint}/add`, { contactID });
    return data.status;
  } catch (err) {
    return 'internal-error';
  }
};

const removeContact = async (contactID: string) => {
  try {
    const { data } = await axios.post<RemoveResponseData>(`${apiEndpoint}/remove`, { contactID });
    return data.status;
  } catch (err) {
    return 'internal-error';
  }
};

const blockContact = async (contactID: string) => {
  try {
    const { data } = await axios.post<BlockResponseData>(`${apiEndpoint}/block`, { contactID });
    return data.status;
  } catch (err) {
    return 'internal-error';
  }
};

const unblockContact = async (contactID: string) => {
  try {
    const { data } = await axios.post<UnblockResponseData>(`${apiEndpoint}/unblock`, { contactID });
    return data.status;
  } catch (err) {
    return 'internal-error';
  }
};

const contactRequests = async (contactID: string, action: 'accept' | 'reject') => {
  try {
    const { data } = await axios.post<RequestsResponseData>(`${apiEndpoint}/requests`, { contactID, action });
    return data.status;
  } catch (err) {
    return 'internal-error';
  }
};

export default {
  fetchContacts,
  addContact,
  removeContact,
  blockContact,
  unblockContact,
  contactRequests,
};
