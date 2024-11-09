import * as React from 'react';
import { Link } from 'react-router-dom';

import PageLayout from '../../layouts/PageLayout';

import AddContactDialog from '../../features/contacts/components/AddContactDialogComponent';

import { useAuth } from '../../features/auth';
import { useContacts } from '../../features/contacts';
import useNotification from '../../hooks/useNotification';

const HomePage = () => {
  const { user, authStatus } = useAuth();
  const { contacts, addContactByUsername } = useContacts();
  const { notification, showNotification } = useNotification();

  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = React.useState(false);

  const addContactButtonPressed = async (username: string) => {
    if (authStatus !== 'authenticated') return;

    const result = await addContactByUsername(username);
    setIsAddContactDialogOpen(false);

    switch (result) {
      case 'success':
        showNotification('Success', 'Contact request sent', 'success');
        break;
      case 'self-add':
        showNotification('Error', "You can't add yourself as contact", 'error');
        break;
      case 'user-not-found':
        showNotification('error', 'A user with that username could not be found', 'error');
        break;
      default: // Add more cases as needed
        showNotification('Error', 'An unknown error occurred' + result, 'error');
        break;
    }
  };

  return (
    <PageLayout
      notification={notification}
      requiresLogin={true}
      className={user?.preferences.general.theme == 'dark' ? 'dark' : ''}
    >
      <AddContactDialog
        open={isAddContactDialogOpen}
        onClose={() => setIsAddContactDialogOpen(false)}
        onSubmit={addContactButtonPressed}
      />
      <div className='pt-20 dark:bg-gray-800 bg-slate-200 min-h-screen dark:text-white text-neutral-700'>
        <div className='flex items-center justify-between gap-2 mx-10'>
          <div className='md:w-4/12 w-full'>
            <div className='text-center'>
              <button
                onClick={() => setIsAddContactDialogOpen(true)}
                className='w-11/12 p-2 bg-blue-400 text-white rounded-md shadow-md'
              >
                Add a contact
              </button>

              <div>
                <h1 className='text-2xl mt-5'>Contacts</h1>
                {contacts.map((contact) => (
                  <div key={contact.userID}>
                    <Link to={`/chat/${contact.userID}`}>
                      <div className='flex items-center justify-between p-2 dark:bg-gray-700 transition-all hover:brightness-110 bg-slate-100 rounded-md mt-2'>
                        <p>{contact.profile.username}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='w-full hidden md:block'>
            <div className='flex flex-col items-center'>
              <h1 className='text-2xl'>Welcome to DIMLIM</h1>
              <p className='text-center'>Select a contact to start chatting</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
