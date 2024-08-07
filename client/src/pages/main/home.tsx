import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setUser } from '../../store/slices/page';

import NavbarComponent from '../../components/navbar';

import { checkLoggedIn } from '../../lib/auth';

const HomePage = () => {
  const user = useSelector((state: RootState) => state.page.currentUser);
  const dispatch = useDispatch();

  const redirect = useNavigate();

  type Contact = {
    userID: string;
    profile: {
      username: string;
    };
  };
  const [contacts, setContacts] = React.useState<Contact[]>([]);

  React.useEffect(() => {
    (async () => {
      if (!user) {
        const currentUser = await checkLoggedIn();
        if (currentUser) return dispatch(setUser(currentUser));
        redirect('/login');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    (async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_HOST}/api/contacts/get`, {
        withCredentials: true,
      });
      setContacts(data.contacts.accepted);
    })();
  }, []);

  const addContact = async () => {
    const username = prompt('Enter the username of the user you want to add');
    if (!username) return;

    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_HOST}/api/contacts/add`,
      { username: username },
      { withCredentials: true },
    );
  };

  return (
    <div className={user?.preferences.general.theme == 'dark' ? 'dark' : ''}>
      <div className='dark:bg-gray-800 bg-slate-200 min-h-screen dark:text-white text-neutral-700'>
        {user && (
          <div>
            <NavbarComponent user={user} />
            <div className='pt-20'>
              <div className='text-center'>
                <button onClick={addContact} className='w-11/12 p-2 bg-blue-400 text-white rounded-md shadow-md'>
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
        )}
        {!user && (
          <div>
            <h1>Authenticating</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
