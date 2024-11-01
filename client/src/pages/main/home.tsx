import * as React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import PageLayout from '../../layouts/PageLayout';

import { useAuth } from '../../features/auth';
import { useContacts } from '../../features/contacts';

const HomePage = () => {
  const { user, authStatus } = useAuth();
  const { contacts, addContactByUsername } = useContacts();

  const addContaect = async () => {
    const username = prompt('Enter the username of the user you want to add');
    const result = await addContactByUsername(username!);
    console.log(result)
  };

  return (
    <PageLayout requiresLogin={true} className={user?.preferences.general.theme == 'dark' ? 'dark' : ''}>
      <div className='dark:bg-gray-800 bg-slate-200 min-h-screen dark:text-white text-neutral-700'>
        <div>
          <div className='pt-20'>
            <div className='text-center'>
              <button onClick={addContaect} className='w-11/12 p-2 bg-blue-400 text-white rounded-md shadow-md'>
                Search or start chat
              </button>

              <div>
                <h1 className='text-2xl mt-5'>Contacts</h1>
                {contacts.map((contact) => (
                  <div key={contact.userID}>
                    <Link to={`/chat/${contact.userID}`}>
                      <div className='flex items-center justify-between p-2 dark:bg-gray-600 bg-slate-100 rounded-md mt-2'>
                        <p>{contact.profile.username}</p>
                        <p>Online</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
