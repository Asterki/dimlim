import * as React from 'react';
import axios from 'axios';
import * as Tabs from '@radix-ui/react-tabs';

import PageLayout from '../../layouts/PageLayout';
import useNotification from '../../hooks/useNotification';
import { useAuth } from '../../features/auth';
import { useContacts } from '../../features/contacts';

import NavbarComponent from '../../components/NavbarComponent';

const ContactsIndex = () => {
  const { user, authStatus } = useAuth();
  const { contacts,  } = useContacts()
  const { notification, showNotification } = useNotification();

  const [tab, setTab] = React.useState('tab1');

  const [contactsWithProfile, setContactsWithProfile] = React.useState([]);

  React.useEffect(() => {
    if (user) {
      axios
        .get('/api/contacts')
        .then((res) => {
          console.log(res.data);
          setContactsWithProfile(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user]);

  return (
    <PageLayout
      notification={notification}
      requiresLogin={true}
      className={user?.preferences.general.theme == 'dark' ? 'dark' : ''}
    >
      <div className='dark:bg-gray-800 bg-slate-200 min-h-screen dark:text-white text-neutral-700'>
        <div>
          <NavbarComponent user={user} />
          <div className='pt-20'>
            <div className='text-center flex items-center justify-center'>
              <Tabs.Root
                className='text-center w-11/12 md:w-8/12 flex justify-center items-center flex-col '
                defaultValue='tab1'
                onValueChange={(e) => {
                  setTab(e);
                }}
              >
                <Tabs.List
                  className='w-full flex justify-self-center shadow-md border-b-2 dark:border-gray-800'
                  aria-label='Manage your account'
                >
                  <Tabs.Trigger
                    className={`p-2 rounded-tl-md transition-all w-3/12 md:w-1/4 border-r-2 dark:border-gray-800 ${
                      tab == 'tab1'
                        ? 'text-white bg-blue-400 z-20'
                        : 'dark:bg-gray-700 bg-slate-100 hover:bg-white dark:hover:bg-gray-600'
                    }`}
                    value='tab1'
                  >
                    Requests
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    className={`p-2 transition-all w-3/12 md:w-1/4 border-r-2 dark:border-gray-800 ${
                      tab == 'tab2'
                        ? 'text-white bg-blue-400 z-20'
                        : 'dark:bg-gray-700 bg-slate-100 hover:bg-white dark:hover:bg-gray-600'
                    }`}
                    value='tab2'
                  >
                    Pending
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    className={`p-2 transition-all w-3/12 md:w-1/4 ${
                      tab == 'tab3'
                        ? 'text-white bg-blue-400 z-20'
                        : 'dark:bg-gray-700 bg-slate-100 hover:bg-white dark:hover:bg-gray-600'
                    }`}
                    value='tab3'
                  >
                    Current Contacts
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    className={`p-2 rounded-tr-md transition-all w-3/12 md:w-1/4 border-l-2 dark:border-gray-800 ${
                      tab == 'tab4'
                        ? 'text-white bg-blue-400 z-20'
                        : 'dark:bg-gray-700 bg-slate-100 hover:bg-white dark:hover:bg-gray-600'
                    }`}
                    value='tab4'
                  >
                    Blocked Contacts
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content
                  className='rounded-br-md rounded-bl-md dark:bg-gray-700 bg-slate-100 w-full text-center p-2 shadow-md'
                  value='tab1'
                >
                  <p className='text-2xl'>Contact Requests</p>
                  <div className='flex flex-col items-center'>
                    {user && user.contacts.requests.length === 0 && (
                      <div className='text-lg h-64 flex items-center justify-center dark:text-white/50'>
                        No requests
                      </div>
                    )}
                    {user && user.contacts.requests.length > 0 && (
                      <div className='w-11/12 min-h-64'>
                        {user.contacts.requests.map((contact) => (
                          <div
                            key={contact}
                            className='dark:bg-gray-600 bg-slate-200 rounded-md p-2 my-2 flex justify-between items-center'
                          >
                            <p>{contact}</p>
                            <div className='flex w-7/12 md:w-4/12'>
                              {/* <button
                                className='p-2 bg-blue-400 transition-all hover:brightness-110 rounded-md text-white mx-2 w-1/2'
                                onClick={() => pending(contact.profile!.username, 'accept')}
                              >
                                Accept
                              </button>
                              <button
                                className='p-2 bg-red-400 transition-all hover:brightness-110 rounded-md text-white w-1/2'
                                onClick={() => pending(contact.profile!.username, 'reject')}
                              >
                                Decline
                              </button> */}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Tabs.Content>
                {/* <Tabs.Content
                  className='rounded-br-md rounded-bl-md dark:bg-gray-700 bg-slate-100 w-full text-center p-2 shadow-md'
                  value='tab2'
                >
                  <p className='text-2xl'>Request Sent</p>
                  <div className='flex flex-col items-center'>
                    {contacts.pending.length === 0 && (
                      <div className='text-lg h-64 flex items-center justify-center dark:text-white/50'>
                        No requests
                      </div>
                    )}
                    {contacts.pending.length > 0 && (
                      <div className='w-11/12 min-h-64'>
                        {contacts.pending.map((contact) => (
                          <div
                            key={contact.userID as string}
                            className='dark:bg-gray-600 bg-slate-200 rounded-md p-2 my-2 flex justify-between items-center'
                          >
                            <p>{contact.profile!.username}</p>
                            <div className='flex justify-end w-7/12 md:w-4/12'>
                              <button
                                className='p-2 bg-red-400 transition-all hover:brightness-110 rounded-md text-white w-1/2'
                                onClick={() => pending(contact.profile!.username, 'reject')}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Tabs.Content>
                <Tabs.Content
                  className='rounded-br-md rounded-bl-md dark:bg-gray-700 bg-slate-100 w-full text-center p-2 shadow-md'
                  value='tab3'
                >
                  <p className='text-2xl'>Current Contacts</p>
                  <div className='flex flex-col items-center'>
                    {contacts.accepted.length === 0 && (
                      <div className='text-lg h-64 flex items-center justify-center dark:text-white/50'>
                        No contacts
                      </div>
                    )}
                    {contacts.accepted.length > 0 && (
                      <div className='w-11/12 min-h-64'>
                        {contacts.accepted.map((contact) => (
                          <div
                            key={contact.userID as string}
                            className='dark:bg-gray-600 bg-slate-200 rounded-md p-2 my-2 flex justify-between items-center'
                          >
                            <p>{contact.profile!.username}</p>
                            <div className='flex gap-2 justify-end w-7/12 md:w-4/12'>
                              <button
                                className='p-2 bg-red-400 transition-all hover:brightness-110 rounded-md text-white w-1/2'
                                onClick={() => remove(contact.profile!.username)}
                              >
                                Remove
                              </button>
                              <button
                                className='p-2 bg-red-400 transition-all hover:brightness-110 rounded-md text-white w-1/2'
                                onClick={() => block(contact.profile!.username)}
                              >
                                Block
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Tabs.Content>
                <Tabs.Content
                  className='rounded-br-md rounded-bl-md dark:bg-gray-700 bg-slate-100 w-full text-center p-2 shadow-md'
                  value='tab4'
                >
                  <p className='text-2xl'>Blocked Contacts</p>
                  <div className='flex flex-col items-center'>
                    {contacts.blocked.length === 0 && (
                      <div className='text-lg h-64 flex items-center justify-center dark:text-white/50'>
                        No blocked contacts
                      </div>
                    )}
                    {contacts.blocked.length > 0 && (
                      <div className='w-11/12 min-h-64'>
                        {contacts.blocked.map((contact) => (
                          <div
                            key={contact.userID as string}
                            className='dark:bg-gray-600 bg-slate-200 rounded-md p-2 my-2 flex justify-between items-center w-full'
                          >
                            <p>{contact.profile!.username}</p>
                            <button
                              className='p-2 bg-blue-400 transition-all hover:brightness-110 rounded-md text-white w-1/2'
                              onClick={() => unblock(contact.profile!.username)}
                            >
                              Unblock
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Tabs.Content> */}
              </Tabs.Root>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ContactsIndex;
