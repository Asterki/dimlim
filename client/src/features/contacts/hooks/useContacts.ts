import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setContacts } from '../slices/contacts';
import contactsApi from '../services/contactsApi';

const useContacts = () => {
  const dispatch = useDispatch();
  const contacts = useSelector((state: RootState) => state.contacts.contacts);

  const fetchContacts = async () => {
    const contacts = await contactsApi.fetchContacts();
    if (!contacts) return;
    dispatch(setContacts(contacts.accepted));
  };

  const addContactByUsername = async (username: string) => {
    const result = await contactsApi.fetchContactByUsername(username);
    if (result?.status !== "success") return result?.status

    return await contactsApi.addContact(result.contact!.userID);
  }

  const addContact = async (contactID: string) => {
    return await contactsApi.addContact(contactID);
  };

  const removeContact = async (contactID: string) => {
    return await contactsApi.removeContact(contactID);
  };

  const blockContact = async (contactID: string) => {
    return await contactsApi.blockContact(contactID);
  };

  const unblockContact = async (contactID: string) => {
    return await contactsApi.unblockContact(contactID);
  };

  const acceptRequest = async (contactID: string) => {
    return await contactsApi.contactRequests(contactID, 'accept');
  };

  const rejectRequest = async (contactID: string) => {
    return await contactsApi.contactRequests(contactID, 'reject');
  };

  useEffect(() => {
    fetchContacts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    contacts,
    addContact,
    removeContact,
    blockContact,
    unblockContact,
    acceptRequest,
    rejectRequest,
    addContactByUsername
  };
};

export default useContacts;
